import { AccountInterface } from "starknet";

export interface IAurumReward {
    processTransaction(sender: string, recipient: string, amount: bigint, account: AccountInterface): Promise<string>;
    accumulatedFees(): Promise<bigint>;
    usdcToken(): Promise<string>;
    rewardPointsToken(): Promise<string>;
    withdrawFees(amount: bigint): Promise<void>;
    getAddress(): string;
} 