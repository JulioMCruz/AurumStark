#[starknet::interface]
pub trait IAurumReward<TContractState> {
    fn process_transaction(
        ref self: TContractState, sender: starknet::ContractAddress, recipient: starknet::ContractAddress, amount: u256
    );
    fn accumulated_fees(self: @TContractState) -> u256;
    fn usdc_token(self: @TContractState) -> starknet::ContractAddress;
    fn reward_points_token(self: @TContractState) -> starknet::ContractAddress;
    fn withdraw_fees(ref self: TContractState, amount: u256);
}

#[starknet::contract]
pub mod AurumReward {
    use openzeppelin_token::erc20::interface::{IERC20CamelDispatcher, IERC20CamelDispatcherTrait};
    use starknet::{ContractAddress, get_contract_address};
    use contracts::AurumRewardPoints::{IAurumRewardPointsDispatcher, IAurumRewardPointsDispatcherTrait};

    const REWARD_RATE: u256 = 100; // 1% = 1/100
    const POINTS_MULTIPLIER: u256 = 10; // 10 points per token of fee

    #[storage]
    struct Storage {
        usdc_token: IERC20CamelDispatcher,
        reward_points: IAurumRewardPointsDispatcher,
        accumulated_fees: u256,
        admin: ContractAddress,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        FeeCollected: FeeCollected,
        PointsRewarded: PointsRewarded,
    }

    #[derive(Drop, starknet::Event)]
    struct FeeCollected {
        #[key]
        from: ContractAddress,
        amount: u256,
    }

    #[derive(Drop, starknet::Event)]
    struct PointsRewarded {
        #[key]
        to: ContractAddress,
        amount: u256,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        usdc_address: ContractAddress,
        reward_points_address: ContractAddress,
    ) {
        self.usdc_token.write(IERC20CamelDispatcher { contract_address: usdc_address });
        self.reward_points.write(IAurumRewardPointsDispatcher { contract_address: reward_points_address });
        self.accumulated_fees.write(0);
        self.admin.write(starknet::get_caller_address());
    }

    #[abi(embed_v0)]
    impl AurumRewardImpl of super::IAurumReward<ContractState> {
        fn process_transaction(
            ref self: ContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256
        ) {
            // Validaciones iniciales
            assert(amount > 0, 'INVALID_AMOUNT');
            assert(sender != recipient, 'INVALID_RECIPIENT');
            
            // Calcular fee
            let fee = amount / REWARD_RATE;
            let net_amount = amount - fee;
            
            let usdc = self.usdc_token.read();
            
            // Verificar allowance
            let sender_allowance = usdc.allowance(sender, get_contract_address());
            assert(sender_allowance >= amount, 'INSUFFICIENT_ALLOWANCE');
            
            // Verificar balance
            let sender_balance = usdc.balanceOf(sender);
            assert(sender_balance >= amount, 'INSUFFICIENT_BALANCE');
            
            // Ejecutar transferencias
            usdc.transferFrom(sender, recipient, net_amount);
            usdc.transferFrom(sender, get_contract_address(), fee);
            
            // Actualizar fees y recompensas
            self.accumulated_fees.write(self.accumulated_fees.read() + fee);
            
            let points = fee * POINTS_MULTIPLIER;
            let reward_points = self.reward_points.read();
            reward_points.mint_points(sender, points);
            
            // Emitir eventos
            self.emit(FeeCollected { from: sender, amount: fee });
            self.emit(PointsRewarded { to: sender, amount: points });
        }

        fn accumulated_fees(self: @ContractState) -> u256 {
            self.accumulated_fees.read()
        }

        fn usdc_token(self: @ContractState) -> ContractAddress {
            self.usdc_token.read().contract_address
        }

        fn reward_points_token(self: @ContractState) -> ContractAddress {
            self.reward_points.read().contract_address
        }

        fn withdraw_fees(ref self: ContractState, amount: u256) {
            assert(self.admin.read() == starknet::get_caller_address(), 'ONLY_ADMIN');
            
            let current_fees = self.accumulated_fees.read();
            assert(amount <= current_fees, 'INSUFFICIENT_FEES');
            
            self.accumulated_fees.write(current_fees - amount);
            
            let usdc = self.usdc_token.read();
            usdc.transfer(self.admin.read(), amount);
        }
    }
}
