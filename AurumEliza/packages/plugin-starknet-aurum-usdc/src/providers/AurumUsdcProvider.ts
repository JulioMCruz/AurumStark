import { Provider, Contract, cairo, BigNumberish } from 'starknet';
import { AurumUsdcProvider } from '../types/AurumUsdc';
import { deployedContracts } from '../utils/contracts';
import { elizaLogger } from '@elizaos/core';

export class StarknetAurumUsdcProvider implements AurumUsdcProvider {
    private contract: Contract;
    private contractAddress: string;

    constructor(provider: Provider, network: 'devnet' | 'sepolia' = 'devnet') {
        elizaLogger.info("🔵 StarknetAurumUsdcProvider provider:", provider);
        elizaLogger.info("🔵 StarknetAurumUsdcProvider network:", network);
        this.contractAddress = deployedContracts[network].AurumUsdc.address;
        this.contract = new Contract(
            deployedContracts[network].AurumUsdc.abi,
            this.contractAddress,
            provider
        );
    }
    convertToUSDC(amount: string, fromCurrency: string): Promise<string> {
        throw new Error('Method not implemented.');
    }


    getAddress(): string {
        return this.contractAddress;
    }

    async getBalance(address: string): Promise<string> {
        try {
            elizaLogger.info("🔵 getBalance address:", address);
            elizaLogger.info("🔵 contract :", this.contract.address);
            const balance = await this.contract.call("balance_of", [address]);
            elizaLogger.info("🔵 getBalance balance:", balance.toString(    ) );
            return balance.toString();
        } catch (error) {
            elizaLogger.error("🔴 getBalance error:", error);
            throw new Error("Error getting balance");
        }
    }

    async transfer(to: string, amount: string): Promise<boolean> {
        elizaLogger.info("🔵 transfer to:", to);
        const uint = cairo.uint256(BigInt(amount)) as any;
        return this.contract.transfer(to, uint);
    }
} 