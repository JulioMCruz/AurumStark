import { AccountInterface, ProviderInterface, Contract, CallData, cairo, num, BigNumberish } from 'starknet';
import { AurumUsdcContract as IAurumUsdcContract } from '../types/AurumUsdc';
import aurumUsdcAbi from './abi/aurum_usdc.json';
import { elizaLogger } from '@elizaos/core';

export class AurumUsdcContract implements IAurumUsdcContract {
    private static DECIMALS = 6; // USDC uses 6 decimals
    private contract: Contract;
    private calldata: CallData;

    constructor(
        address: string,
        providerOrAccount?: ProviderInterface | AccountInterface
    ) {
        this.contract = new Contract(aurumUsdcAbi, address, providerOrAccount);
        this.calldata = new CallData(this.contract.abi);
    }

    public get address(): string {
        return this.contract.address;
    }

    public async name(): Promise<string> {
        const result = await this.contract.call("name");
        return result.toString();
    }

    public async symbol(): Promise<string> {
        const result = await this.contract.call("symbol");
        return result.toString();
    }

    public async decimals(): Promise<number> {
        return AurumUsdcContract.DECIMALS;
    }

    public async totalSupply(): Promise<bigint> {
        const result = await this.contract.call("total_supply");
        return BigInt(result.toString());
    }

    public async balanceOf(account: string): Promise<bigint> {
        const result = await this.contract.call("balance_of", [account]);
        return BigInt(result.toString());
    }

    public async transfer(recipient: string, amount: BigNumberish): Promise<boolean> {
        try {
            const uint256Amount = cairo.uint256(amount);
            await this.contract.invoke("transfer", [
                recipient,
                uint256Amount
            ]);
            return true;
        } catch (error) {
            console.error("Transfer failed:", error);
            return false;
        }
    }

    public async version(): Promise<string> {
        const result = await this.contract.call("version");
        return result.toString();
    }

    public async getDecimals(): Promise<number> {
        return this.decimals();
    }

    public async getBalance(address: string): Promise<bigint> {
        return this.balanceOf(address);
    }

    public async getBalanceFormatted(address: string): Promise<string> {
        const balance = await this.getBalance(address);
        return this.formatAmount(balance);
    }

    public async convertToUSDC(amount: string, fromCurrency: string): Promise<string> {
        // Por ahora asumimos una conversión 1:1 para USDC
        // En una implementación real, aquí se conectaría con un oráculo de precios
        if (fromCurrency.toUpperCase() === 'USDC') {
            return amount;
        }
        
        // Implementar lógica de conversión real aquí
        // Por ejemplo, usando un oráculo de precios de Starknet
        throw new Error('Currency conversion not implemented');
    }

    private formatAmount(amount: bigint): string {
        elizaLogger.info(`Formatting amount: ${amount}`);
        return (Number(amount) / Math.pow(10, AurumUsdcContract.DECIMALS)).toString();
    }
}
