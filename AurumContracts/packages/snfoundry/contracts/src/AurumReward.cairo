#[starknet::interface]
pub trait IAurumReward<TContractState> {
    fn process_transaction(
        ref self: TContractState, sender: starknet::ContractAddress, recipient: starknet::ContractAddress, amount: u256
    );
    fn accumulated_fees(self: @TContractState) -> u256;
    fn usdc_token(self: @TContractState) -> starknet::ContractAddress;
    fn reward_points_token(self: @TContractState) -> starknet::ContractAddress;
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
    }

    #[abi(embed_v0)]
    impl AurumRewardImpl of super::IAurumReward<ContractState> {
        fn process_transaction(
            ref self: ContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256
        ) {
            // Calculate 1% fee
            let fee = amount / REWARD_RATE;
            
            // Transfer main amount minus fee to recipient
            let net_amount = amount - fee;
            let usdc = self.usdc_token.read();
            usdc.transferFrom(sender, recipient, net_amount);
            
            // Transfer fee to this contract
            usdc.transferFrom(sender, get_contract_address(), fee);
            
            // Update accumulated fees
            self.accumulated_fees.write(self.accumulated_fees.read() + fee);
            
            // Calculate and mint reward points (10 points per token of fee)
            let points = fee * POINTS_MULTIPLIER;
            let reward_points = self.reward_points.read();
            reward_points.mint_points(sender, points);
            
            // Emit events
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
    }
}
