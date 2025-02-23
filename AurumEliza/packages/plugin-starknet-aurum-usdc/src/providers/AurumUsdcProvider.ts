import { Provider, Contract, cairo, BigNumberish } from 'starknet';
import { AurumUsdcContract, AurumUsdcProvider } from '../types/AurumUsdc';
import { deployedContracts } from '../utils/contracts';

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

    async getContract(): Promise<AurumUsdcContract> {
        return this.contract as unknown as AurumUsdcContract;
    }

    getAddress(): string {
        return this.contractAddress;
    }

    async getBalance(address: string): Promise<string> {
        const contract = await this.getContract();
        const balance = await contract.balanceOf(address);
        return balance.toString();
    }

    async getBalanceFormatted(address: string): Promise<string> {
        const contract = await this.getContract();
        const balance = await contract.getBalanceFormatted(address);
        return balance;
    }

    async transfer(to: string, amount: string): Promise<boolean> {
        const contract = await this.getContract();
        const uint = cairo.uint256(BigInt(amount)) as any;
        return contract.transfer(to, uint);
    }
} 