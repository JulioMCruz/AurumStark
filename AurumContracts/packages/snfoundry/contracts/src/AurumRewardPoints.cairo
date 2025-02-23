#[starknet::interface]
pub trait IAurumRewardPoints<TContractState> {
    fn mint_points(ref self: TContractState, recipient: starknet::ContractAddress, amount: u256);
    fn reward_manager(self: @TContractState) -> starknet::ContractAddress;
}

#[starknet::contract]
pub mod AurumRewardPoints {
    use openzeppelin_token::erc20::{ERC20Component, ERC20HooksEmptyImpl};
    use starknet::{ContractAddress, get_caller_address};

    component!(path: ERC20Component, storage: erc20, event: ERC20Event);

    impl ERC20Hooks = ERC20HooksEmptyImpl<ContractState>;

    #[abi(embed_v0)]
    impl ERC20Impl = ERC20Component::ERC20MixinImpl<ContractState>;
    impl ERC20InternalImpl = ERC20Component::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc20: ERC20Component::Storage,
        reward_manager: ContractAddress,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC20Event: ERC20Component::Event,
        PointsMinted: PointsMinted,
    }

    #[derive(Drop, starknet::Event)]
    struct PointsMinted {
        #[key]
        recipient: ContractAddress,
        amount: u256,
    }

    #[constructor]
    fn constructor(ref self: ContractState, reward_manager: ContractAddress) {
        let name = "AurumPoints";
        let symbol = "ARP";

        self.erc20.initializer(name, symbol);
        self.reward_manager.write(reward_manager);
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn assert_only_reward_manager(self: @ContractState) {
            let caller = get_caller_address();
            assert(caller == self.reward_manager.read(), 'Only reward manager');
        }
    }

    #[abi(embed_v0)]
    impl AurumRewardPointsImpl of super::IAurumRewardPoints<ContractState> {
        fn mint_points(ref self: ContractState, recipient: ContractAddress, amount: u256) {
            self.assert_only_reward_manager();
            self.erc20.mint(recipient, amount);
            self.emit(PointsMinted { recipient, amount });
        }

        fn reward_manager(self: @ContractState) -> ContractAddress {
            self.reward_manager.read()
        }
    }

    #[external(v0)]
    fn set_reward_manager(ref self: ContractState, new_manager: ContractAddress) {
        // Solo el manager actual puede cambiar el manager
        self.assert_only_reward_manager();
        self.reward_manager.write(new_manager);
    }
}
