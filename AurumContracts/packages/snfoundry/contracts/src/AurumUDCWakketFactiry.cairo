#[starknet::contract]
mod UDCWalletFactory {
    use starknet::{
        get_caller_address, ContractAddress, contract_address_const, ClassHash,
        get_contract_address, syscalls::deploy_syscall,
    };
    use starknet::class_hash::ClassHash;
    use array::ArrayTrait;
    use option::OptionTrait;
    use traits::Into;
    use zeroable::Zeroable;

    // IERC20 interface for USDC token
    #[starknet::interface]
    trait IERC20<TContractState> {
        fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256) -> bool;
        fn transferFrom(
            ref self: TContractState,
            sender: ContractAddress,
            recipient: ContractAddress,
            amount: u256,
        ) -> bool;
        fn balanceOf(self: @TContractState, account: ContractAddress) -> u256;
    }

    // Universal Deployer Contract interface
    #[starknet::interface]
    trait IUDC<TContractState> {
        fn deployContract(
            ref self: TContractState,
            class_hash: ClassHash,
            salt: felt252,
            unique: bool,
            calldata: Array<felt252>,
        ) -> ContractAddress;

        fn counterfactualAddress(
            self: @TContractState,
            class_hash: ClassHash,
            salt: felt252,
            unique: bool,
            calldata: Array<felt252>,
        ) -> ContractAddress;
    }

    // Contract storage
    #[storage]
    struct Storage {
        owner: ContractAddress,
        wallet_class_hash: ClassHash,
        usdc_address: ContractAddress,
        udc_address: ContractAddress,
        funded_wallets: LegacyMap::<ContractAddress, bool>,
        wallet_info: LegacyMap::<
            ContractAddress, (felt252, felt252),
        > // (salt, future_owner_public_key)
    }

    // Constants
    const FUNDING_AMOUNT: u256 = 100000; // 0.1 USDC with 6 decimals

    // Events
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        WalletPrefunded: WalletPrefunded,
        WalletClaimed: WalletClaimed,
    }

    #[derive(Drop, starknet::Event)]
    struct WalletPrefunded {
        wallet_address: ContractAddress,
        salt: felt252,
        future_owner_public_key: felt252,
        funding_amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct WalletClaimed {
        wallet_address: ContractAddress,
        owner_public_key: felt252,
    }

    // Constructor
    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress,
        wallet_class_hash: ClassHash,
        usdc_address: ContractAddress,
        udc_address: ContractAddress,
    ) {
        self.owner.write(owner);
        self.wallet_class_hash.write(wallet_class_hash);
        self.usdc_address.write(usdc_address);

        // Default UDC address if not provided
        if (udc_address.is_zero()) {
            // Mainnet UDC address
            self
                .udc_address
                .write(
                    contract_address_const::<
                        0x041a78e741e5af2fec34b695679bc6891742439f7afb8484ecd7766661ad02bf,
                    >(),
                );
        } else {
            self.udc_address.write(udc_address);
        }
    }

    // Methods
    #[external(v0)]
    impl UDCWalletFactoryImpl of super::UDCWalletFactory {
        // Calculate wallet address using UDC counterfactual address calculation
        fn calculate_wallet_address(
            self: @ContractState, salt: felt252, future_owner_public_key: felt252,
        ) -> ContractAddress {
            // Prepare constructor calldata with the future owner's public key
            let mut constructor_calldata = ArrayTrait::new();
            constructor_calldata.append(future_owner_public_key);

            // Get UDC contract
            let udc = IUDCDispatcher { contract_address: self.udc_address.read() };

            // Calculate the counterfactual address
            return udc
                .counterfactualAddress(
                    self.wallet_class_hash.read(),
                    salt,
                    true, // unique = true to avoid address collisions
                    constructor_calldata,
                );
        }

        // Pre-fund a wallet for future claiming
        fn prefund_wallet(
            ref self: ContractState, salt: felt252, future_owner_public_key: felt252,
        ) -> ContractAddress {
            // Only owner can pre-fund wallets
            let caller = get_caller_address();
            assert(caller == self.owner.read(), 'Only owner can prefund wallets');

            // Calculate the future wallet address
            let wallet_address = self.calculate_wallet_address(salt, future_owner_public_key);

            // Check if this wallet has already been funded
            assert(!self.funded_wallets.read(wallet_address), 'Wallet already funded');

            // Mark as funded and store info for future deployment
            self.funded_wallets.write(wallet_address, true);
            self.wallet_info.write(wallet_address, (salt, future_owner_public_key));

            // Transfer USDC to the future wallet address
            let usdc_contract = IERC20Dispatcher { contract_address: self.usdc_address.read() };
            let success = usdc_contract.transfer(wallet_address, FUNDING_AMOUNT);
            assert(success, 'USDC transfer failed');

            // Emit event
            self
                .emit(
                    WalletPrefunded {
                        wallet_address: wallet_address,
                        salt: salt,
                        future_owner_public_key: future_owner_public_key,
                        funding_amount: FUNDING_AMOUNT,
                    },
                );

            return wallet_address;
        }

        // Batch prefund multiple wallets at once
        fn batch_prefund_wallets(
            ref self: ContractState,
            salts: Array<felt252>,
            future_owner_public_keys: Array<felt252>,
        ) -> Array<ContractAddress> {
            assert(salts.len() == future_owner_public_keys.len(), 'Arrays length mismatch');

            let mut wallet_addresses = ArrayTrait::new();
            let mut i: usize = 0;

            loop {
                if i >= salts.len() {
                    break;
                }

                let salt = *salts.at(i);
                let public_key = *future_owner_public_keys.at(i);
                let wallet_address = self.prefund_wallet(salt, public_key);
                wallet_addresses.append(wallet_address);

                i += 1;
            };

            return wallet_addresses;
        }

        // Claim a pre-funded wallet using UDC
        fn claim_wallet(ref self: ContractState, wallet_address: ContractAddress) -> bool {
            // Check if this wallet has been funded
            assert(self.funded_wallets.read(wallet_address), 'Wallet not prefunded');

            // Get the stored wallet info
            let (salt, future_owner_public_key) = self.wallet_info.read(wallet_address);

            // Prepare constructor calldata with the stored public key
            let mut constructor_calldata = ArrayTrait::new();
            constructor_calldata.append(future_owner_public_key);

            // Get UDC contract
            let udc = IUDCDispatcher { contract_address: self.udc_address.read() };

            // Deploy the wallet through UDC
            let deployed_address = udc
                .deployContract(
                    self.wallet_class_hash.read(),
                    salt,
                    true, // unique = true
                    constructor_calldata,
                );

            // Verify the deployed address matches the expected address
            assert(deployed_address == wallet_address, 'Address mismatch');

            // Mark as no longer funded (claimed)
            self.funded_wallets.write(wallet_address, false);

            // Emit event
            self
                .emit(
                    WalletClaimed {
                        wallet_address: wallet_address, owner_public_key: future_owner_public_key,
                    },
                );

            return true;
        }


        // Withdraw USDC in case of emergency
        fn withdraw_emergency(
            ref self: ContractState, token_address: ContractAddress, amount: u256,
        ) -> bool {
            let caller = get_caller_address();
            assert(caller == self.owner.read(), 'Only owner can withdraw');

            let token_contract = IERC20Dispatcher { contract_address: token_address };
            let success = token_contract.transfer(caller, amount);
            assert(success, 'Token transfer failed');

            return true;
        }

        // View functions
        fn is_wallet_funded(self: @ContractState, wallet_address: ContractAddress) -> bool {
            return self.funded_wallets.read(wallet_address);
        }

        fn get_usdc_address(self: @ContractState) -> ContractAddress {
            return self.usdc_address.read();
        }

        fn get_wallet_class_hash(self: @ContractState) -> ClassHash {
            return self.wallet_class_hash.read();
        }

        fn get_udc_address(self: @ContractState) -> ContractAddress {
            return self.udc_address.read();
        }
    }
}
