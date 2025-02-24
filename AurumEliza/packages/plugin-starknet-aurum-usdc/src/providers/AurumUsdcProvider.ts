import { Provider, Contract, cairo, BigNumberish } from 'starknet';
import { AurumUsdcContract, AurumUsdcProvider } from '../types/AurumUsdc';
import { deployedContracts } from '../utils/contracts';
import { elizaLogger } from '@elizaos/core';

export class StarknetAurumUsdcProvider implements AurumUsdcProvider {
    private contract: Contract;
    private contractAddress: string;

    constructor(provider: Provider, network: 'devnet' | 'sepolia' = 'devnet') {
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

    async getContract(): Promise<AurumUsdcContract> {
        return this.contract as unknown as AurumUsdcContract;
    }

    getAddress(): string {
        return this.contractAddress;
    }

    async getBalance(address: string): Promise<string> {
        try {
            const contract = await this.getContract();
            elizaLogger.info("🔵 getBalance address:", address);
            elizaLogger.info("🔵 contract :", contract);
            const balance = await contract.balanceOf(address);
            elizaLogger.info("🔵 getBalance balance:", balance.toString(    ) );
            return balance.toString();
        } catch (error) {
            elizaLogger.error("🔴 getBalance error:", error);
            throw new Error("Error getting balance");
        }
    }

    async transfer(to: string, amount: string): Promise<boolean> {
        const contract = await this.getContract();
        const uint = cairo.uint256(BigInt(amount)) as any;
        return contract.transfer(to, uint);
    }
} 