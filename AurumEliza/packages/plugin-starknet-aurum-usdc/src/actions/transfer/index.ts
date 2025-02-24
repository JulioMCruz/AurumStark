import { Action, IAgentRuntime, elizaLogger, HandlerCallback, State } from '@elizaos/core';
import { AurumUsdcProvider, Message } from '../../types/AurumUsdc';
import { extractAddress, extractAmount, extractCurrency } from '../../utils/extractors';
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

    async validate(_runtime: IAgentRuntime, message: Message): Promise<boolean> {
        const hasValidAddress = /0x[a-fA-F0-9]{40}/.test(message.content?.to || message.content?.text || '');
        const hasAmount = /\d+(\.\d+)?/.test(message.content?.amount || message.content?.text || '');
        return hasValidAddress && hasAmount;
    }

    async handler(
        runtime: IAgentRuntime, 
        message: Message,
        _state?: State,
        _options?: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> {
        try {
            const to = message.content.to || extractAddress(message.content.text || '');
            const amount = message.content.amount || extractAmount(message.content.text || '');
            const currency = message.content.currency || extractCurrency(message.content.text || '');
            
            // Get exchange rate and convert if needed
            const usdcAmount = currency === 'USDC' ? amount : await this.provider.convertToUSDC(amount, currency);
            
            // Calculate reward points (0.1 points per USDC)
            const rewardPoints = parseFloat(usdcAmount) * 0.1;
            
            // Execute transfer
            const success = await this.provider.transfer(to, usdcAmount.toString());
            
            if (success && callback) {
                callback({
                    text: `Transaction completed successfully! You've earned ${rewardPoints.toFixed(3)} Aurum points.`,
                    content: {
                        to,
                        amount: usdcAmount,
                        originalAmount: amount,
                        originalCurrency: currency,
                        rewardPoints,
                        status: 'success'
                    }
                });
            }
            
            return success;
        } catch (error) {
            elizaLogger.error("🔴 TransferAction error:", error);
            return false;
        }
    }
}
