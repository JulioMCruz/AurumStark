import { AccountInterface, BigNumberish, ProviderInterface } from 'starknet';
import { AurumUsdcContract } from '../contracts/AurumUsdcContract';
import { AurumUsdcProvider as IAurumUsdcProvider } from '../types/AurumUsdc';
import { elizaLogger } from '@elizaos/core';

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
    approve(spender: string, amount: BigNumberish): Promise<boolean> {
        try {
            elizaLogger.info('[✅ AURUM REWARD] AurumUsdcProvider - Approval:', {
                spender,
                amount
            });
            return this.contract.approve(spender, amount);
        } catch (error) {
            elizaLogger.error('[❌ AURUM REWARD] AurumUsdcProvider - Approval failed:', error);
            return Promise.resolve(false);
        }
    }

    public getAccountAddress(): string {
        elizaLogger.info('[✅ AURUM REWARD] AurumUsdcProvider - Account Address:', {
            address: this.account.address
        });
        return this.account.address;
    }

    public async getBalance(address: string): Promise<string> {
        elizaLogger.info('[✅ AURUM REWARD] AurumUsdcProvider - Get Balance:', {
            address
        });
        const balance = await this.contract.getBalanceFormatted(address);
        return balance;
    }

    public async transfer(to: string, amount: string): Promise<boolean> {
        elizaLogger.info('[✅ AURUM REWARD] AurumUsdcProvider - Transfer:', {
            to,
            amount
        });
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
            elizaLogger.error('[❌ AURUM REWARD] AurumUsdcProvider -  A Transfer error:', error);
            return false;
        }
    }

    public async convertToUSDC(amount: string, fromCurrency: string): Promise<string> {
        return this.contract.convertToUSDC(amount, fromCurrency);
    }
}
