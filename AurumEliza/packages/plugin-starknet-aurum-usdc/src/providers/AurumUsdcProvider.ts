import { AccountInterface, ProviderInterface } from 'starknet';
import { AurumUsdcContract } from '../contracts/AurumUsdcContract';
import { AurumUsdcProvider as IAurumUsdcProvider } from '../types/AurumUsdc';

export class AurumUsdcProvider implements IAurumUsdcProvider {
    private contract: AurumUsdcContract;
    private account: AccountInterface;

    constructor(
        contractAddress: string,
        account: AccountInterface
    ) {
        this.account = account;
        this.contract = new AurumUsdcContract(contractAddress, account);
    }

    public getAddress(): string {
        return this.account.address;
    }

    public async getBalance(address: string): Promise<string> {
        const balance = await this.contract.getBalanceFormatted(address);
        return balance;
    }

    public async transfer(to: string, amount: string): Promise<boolean> {
        try {
            // Obtener los decimales del contrato
            const decimals = await this.contract.decimals();
            
            // Convertir el amount a la precisión correcta
            const scaledAmount = BigInt(
                Math.floor(parseFloat(amount) * Math.pow(10, decimals))
            );

            // Realizar la transferencia
            const success = await this.contract.transfer(to, scaledAmount);
            
            if (!success) {
                throw new Error('Transfer failed');
            }

            return true;
        } catch (error) {
            console.error('Transfer error:', error);
            return false;
        }
    }

    public async convertToUSDC(amount: string, fromCurrency: string): Promise<string> {
        return this.contract.convertToUSDC(amount, fromCurrency);
    }
}
