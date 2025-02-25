import { Account } from 'starknet';
import { AurumRewardContract } from '../contracts/AurumRewardContract';
import { IAurumReward } from '../types/AurumReward';
import { elizaLogger } from '@elizaos/core';
import { BigNumberish } from "starknet";

export class AurumRewardProvider implements IAurumReward {
    private contract: AurumRewardContract;
    private account: Account;
    constructor(contractAddress: string, account: Account) {
        this.contract = new AurumRewardContract(contractAddress, account);
        this.account = account;
        elizaLogger.info(`[✅ AURUM REWARD] AurumRewardProvider initialized with contract: ${contractAddress}`);
    }
    getAddress(): string {
        elizaLogger.info('[✅ AURUM REWARD] AurumRewardProvider - Get Address:', {
            address: this.contract.address
        });
        return this.contract.address;
    }

    async processTransaction(sender: string, recipient: string, amount: bigint): Promise<string> {
         return await this.contract.processTransaction(sender, recipient, amount, this.account);
    }

    async accumulatedFees(): Promise<bigint> {
        return this.contract.accumulatedFees();
    }

    async usdcToken(): Promise<string> {
        return this.contract.usdcToken();
    }

    async rewardPointsToken(): Promise<string> {
        return this.contract.rewardPointsToken();
    }

    async withdrawFees(amount: bigint): Promise<void> {
        return this.contract.withdrawFees(amount);
    }
} 