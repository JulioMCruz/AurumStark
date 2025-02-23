import {
    type AccountInterface,
    cairo,
    CallData,
    type Calldata,
    Contract,
    type ProviderInterface,
    type Abi,
} from "starknet";
import erc20Abi from "./erc20.json";
import aurumRewardAbi from "./aurumReward.json";

export type ApproveCall = {
    contractAddress: string;
    entrypoint: "approve";
    calldata: Calldata;
};

export type TransferCall = {
    contractAddress: string;
    entrypoint: "transfer";
    calldata: Calldata;
};

export type ProcessTransactionCall = {
    contractAddress: string;
    entrypoint: "process_transaction";
    calldata: Calldata;
};

export interface AurumRewardEvent {
    FeeCollected: {
        from: string;
        amount: bigint;
    };
    PointsRewarded: {
        to: string;
        amount: bigint;
    };
}

export class AurumRewardToken {
    abi: Abi;
    contract: Contract;
    calldata: CallData;
    aurumRewardContract?: Contract;
    aurumRewardCalldata?: CallData;

    constructor(
        token: string,
        providerOrAccount?: ProviderInterface | AccountInterface,
        aurumRewardAddress?: string
    ) {
        this.abi = erc20Abi as Abi;
        this.contract = new Contract(this.abi, token, providerOrAccount);
        this.calldata = new CallData(this.contract.abi);
        
        if (aurumRewardAddress && providerOrAccount) {
            const aurumAbi = aurumRewardAbi.abi as Abi;
            this.aurumRewardContract = new Contract(
                aurumAbi,
                aurumRewardAddress,
                providerOrAccount
            );
            this.aurumRewardCalldata = new CallData(this.aurumRewardContract.abi);
        }
    }

    public address() {
        return this.contract.address;
    }

    public async balanceOf(account: string): Promise<bigint> {
        const result = await this.contract.call("balance_of", [account]);
        return result as bigint;
    }

    public async decimals() {
        const result = await this.contract.call("decimals");
        return result as bigint;
    }

    public approveCall(spender: string, amount: bigint): ApproveCall {
        return {
            contractAddress: this.contract.address,
            entrypoint: "approve",
            calldata: this.calldata.compile("approve", {
                spender: spender,
                amount: cairo.uint256(amount),
            }),
        };
    }

    public processTransactionCall(
        sender: string,
        recipient: string,
        amount: bigint
    ): ProcessTransactionCall {
        if (!this.aurumRewardContract || !this.aurumRewardCalldata) {
            throw new Error("AurumReward contract not initialized");
        }

        return {
            contractAddress: this.aurumRewardContract.address,
            entrypoint: "process_transaction",
            calldata: this.aurumRewardCalldata.compile("process_transaction", {
                sender,
                recipient,
                amount: cairo.uint256(amount),
            }),
        };
    }

    public async getAccumulatedFees(): Promise<bigint> {
        if (!this.aurumRewardContract) {
            throw new Error("AurumReward contract not initialized");
        }
        const result = await this.aurumRewardContract.call("accumulated_fees");
        return result as bigint;
    }

    public async getUsdcToken(): Promise<string> {
        if (!this.aurumRewardContract) {
            throw new Error("AurumReward contract not initialized");
        }
        const result = await this.aurumRewardContract.call("usdc_token");
        return result as string;
    }

    public async getRewardPointsToken(): Promise<string> {
        if (!this.aurumRewardContract) {
            throw new Error("AurumReward contract not initialized");
        }
        const result = await this.aurumRewardContract.call("reward_points_token");
        return result as string;
    }

    public static readonly REWARD_RATE = 100n;
    public static readonly POINTS_MULTIPLIER = 10n;

    public calculateFee(amount: bigint): bigint {
        return amount / AurumRewardToken.REWARD_RATE;
    }

    public calculatePoints(feeAmount: bigint): bigint {
        return feeAmount * AurumRewardToken.POINTS_MULTIPLIER;
    }
} 