import { AccountInterface, ProviderInterface, Contract, CallData, cairo, num, BigNumberish } from 'starknet';
import { IAurumReward } from '../types/AurumReward';
import aurumRewardAbi from './abi/aurum_reward.json';
import { elizaLogger } from '@elizaos/core';

export class AurumRewardContract implements IAurumReward {
    private contract: Contract;
    private calldata: CallData;

    constructor(
        address: string,
        providerOrAccount?: ProviderInterface | AccountInterface
    ) {
        this.contract = new Contract(aurumRewardAbi, address);
        this.calldata = new CallData(this.contract.abi);
    }
    getAddress(): string {
        return this.contract.address;
    }

    public get address(): string {
        return this.contract.address;
    }

    async processTransaction(sender: string, recipient: string, amount: bigint, account: AccountInterface): Promise<string> {
        try {
            const uint256Amount = cairo.uint256(amount);
            const tx  = await account.execute({
                contractAddress: this.contract.address,
                entrypoint: "process_transaction",
                calldata: this.calldata.compile("process_transaction", {
                    sender: sender,
                    recipient: recipient,
                    amount: uint256Amount,
                })
            });
            elizaLogger.info(`[✅ AURUM] Transaction processed successfully ${tx.transaction_hash}`);
            return tx.transaction_hash;
        } catch (error) {
            elizaLogger.error(`[❌ AURUM] Error processing transaction: ${error.message}`);
            throw error;
        }
    }

    async accumulatedFees(): Promise<bigint> {
        try {
            const result = await this.contract.call("accumulated_fees");
            elizaLogger.info(`[✅ AURUM] Accumulated fees retrieved`);
            return BigInt(result.toString());
        } catch (error) {
            elizaLogger.error(`[❌ AURUM] Error getting accumulated fees: ${error.message}`);
            throw error;
        }
    }

    async usdcToken(): Promise<string> {
        try {
            const result = await this.contract.call("usdc_token");
            elizaLogger.info(`[✅ AURUM] USDC token address retrieved`);
            return result.toString();
        } catch (error) {
            elizaLogger.error(`[❌ AURUM] Error getting USDC token address: ${error.message}`);
            throw error;
        }
    }

    async rewardPointsToken(): Promise<string> {
        try {
            const result = await this.contract.call("reward_points_token");
            elizaLogger.info(`[✅ AURUM] Reward points token address retrieved`);
            return result.toString();
        } catch (error) {
            elizaLogger.error(`[❌ AURUM] Error getting reward points token address: ${error.message}`);
            throw error;
        }
    }

    async withdrawFees(amount: bigint): Promise<void> {
        try {
            const uint256Amount = cairo.uint256(amount);
            await this.contract.invoke("withdraw_fees", [uint256Amount]);
            elizaLogger.info(`[✅ AURUM] Fees withdrawn successfully`);
        } catch (error) {
            elizaLogger.error(`[❌ AURUM] Error withdrawing fees: ${error.message}`);
            throw error;
        }
    }
} 