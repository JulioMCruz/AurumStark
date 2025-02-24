import { Action, IAgentRuntime, elizaLogger, HandlerCallback, State } from '@elizaos/core';
import { AurumUsdcProvider, Message } from '../../types/AurumUsdc';
import { extractAddress, extractAmount, extractCurrency } from '../../utils/extractors';
import { num } from 'starknet';
import examples from './examples';

export class TransferAction implements Action {
    private provider: AurumUsdcProvider;
    public name = "AURUM_USDC_TRANSFER";
    public description = "Transferir AU USDC a otra dirección y ganar puntos de recompensa";
    public similes = [
        "SEND_USDC", 
        "TRANSFER_USDC",
        "send_payment",
        "make_payment",
        "pay_merchant",
        "transfer_funds"
    ];
    public examples = examples;

    constructor(provider: AurumUsdcProvider) {
        this.provider = provider;
    }

    async validate(runtime: IAgentRuntime, message: Message): Promise<boolean> {
        try {
            // Validar dirección Starknet (64 caracteres)
            const hasValidAddress = /0x[a-fA-F0-9]{64}/.test(message.content?.to || message.content?.text || '');
            const hasAmount = /\d+(\.\d+)?/.test(message.content?.amount || message.content?.text || '');
            
            if (!hasValidAddress || !hasAmount) {
                return false;
            }

            // // Validar que el contrato está disponible y responde
            // await this.contract.version();
            
            return true;
        } catch (error) {
            elizaLogger.error("🔴 Validation failed:", error);
            return false;
        }
    }

    private async convertAndScaleAmount(
        amount: string,
        currency: string,
        decimals: number
    ): Promise<bigint> {
        try {
            const usdcAmount = currency === 'USDC' 
                ? amount 
                : await this.provider.convertToUSDC(amount, currency);
            
            // Convertir a la precisión correcta de decimales
            const scaledAmount = BigInt(
                Math.floor(parseFloat(usdcAmount) * Math.pow(10, decimals))
            );
            
            return scaledAmount;
        } catch (error) {
            throw new Error(`Error converting amount: ${error.message}`);
        }
    }

    private async executeWithRetry(
        fn: () => Promise<boolean>,
        maxAttempts = 3
    ): Promise<boolean> {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === maxAttempts - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
                elizaLogger.warn(`Retry attempt ${i + 1} of ${maxAttempts}`);
            }
        }
        return false;
    }

    async handler(
        runtime: IAgentRuntime, 
        message: Message,
        _state?: State,
        _options?: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> {
        try {
            // // Obtener el contrato y sus decimales
            // const decimals = await this.contract.decimals();

            // // Extraer y validar parámetros
            // const to = message.content.to || extractAddress(message.content.text || '');
            // const amount = message.content.amount || extractAmount(message.content.text || '');
            // const currency = message.content.currency || extractCurrency(message.content.text || '');

            // // Validar balance
            // const senderAddress = await this.provider.getAddress();
            // const balance = await this.contract.balanceOf(senderAddress);
            // const scaledAmount = await this.convertAndScaleAmount(amount, currency, decimals);
            
            // if (balance < scaledAmount) {
            //     throw new Error('Insufficient balance for transfer');
            // }

            // // Ejecutar transferencia con reintentos
            // const success = await this.executeWithRetry(async () => {
            //     return await this.provider.transfer(to, num.toHex(scaledAmount));
            // });

            // if (success) {
            //     // Calcular puntos de recompensa (0.1 puntos por USDC)
            //     const rewardPoints = parseFloat(amount) * 0.1;

            //     if (callback) {
            //         callback({
            //             text: `¡Transferencia completada exitosamente! Has ganado ${rewardPoints.toFixed(3)} puntos Aurum.`,
            //             content: {
            //                 to,
            //                 amount: scaledAmount.toString(),
            //                 originalAmount: amount,
            //                 originalCurrency: currency,
            //                 rewardPoints,
            //                 status: 'success'
            //             }
            //         });
            //     }
                
            //     elizaLogger.success(`✅ Transfer successful: ${amount} USDC to ${to}`);
            //     return true;
            // } else {
            //     throw new Error('Transfer failed');
            // }
        } catch (error) {
            elizaLogger.error("🔴 TransferAction error:", error);
            
            if (callback) {
                let errorMessage = 'Error en la transferencia';
                if (error.message.includes('Insufficient balance')) {
                    errorMessage = 'Saldo insuficiente para realizar la transferencia';
                } else if (error.message.includes('Contract not found')) {
                    errorMessage = 'Contrato no encontrado en la red actual';
                }
                
                callback({
                    text: errorMessage,
                    content: {
                        status: 'failed',
                        error: error.message
                    }
                });
            }
            
            return false;
        }
    }
}
