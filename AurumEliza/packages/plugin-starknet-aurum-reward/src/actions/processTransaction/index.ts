import {
    Action,
    IAgentRuntime,
    ActionExample,
    elizaLogger,
    HandlerCallback,
    State,
    Memory,
} from "@elizaos/core";
import { AurumRewardProvider } from "../../providers/AurumRewardProvider";
import { extractAddress, extractAmount } from "../../utils/extractors";
import examples from "./examples";
import { AurumUsdcProvider } from "../../providers/AurumUsdcProvider";


export class ProcessTransactionAction implements Action {
    private rewardProvider: AurumRewardProvider;
    private usdcProvider: AurumUsdcProvider;
    public name = "AURUM_REWARD_PROCESS_TRANSACTION";
    public description = "Process a payment transaction in local currency to a merchant, automatically converting to USDC and earning Aurum rewards";
    public similes = [
        "AURUM_PAYMENT_PROCESS",
        "MERCHANT_PAYMENT",
        "PAY_WITH_AURUM",
        "process_payment",
        "pay_merchant",
        "make_payment",
        "send_payment",
        "pay_restaurant",
        "pay_store",
        "local_currency_payment"
    ];
    public examples = examples;

    constructor(rewardProvider: AurumRewardProvider, usdcProvider: AurumUsdcProvider) {
        this.rewardProvider = rewardProvider;
        this.usdcProvider = usdcProvider;
    }

    async validate(
        _runtime: IAgentRuntime,
        message: Memory
    ): Promise<boolean> {
        const text = message.content?.text || "";
        
        // Validar diferentes formatos de cantidad y moneda
        const currencyPattern = /(\d+(\.\d+)?)\s*(USDC|THB|USD|EUR|JPY|SGD)/i;
        const paymentPattern = /(pay|send|transfer|split)\s+.*?(to|with|at)\s+.*?(restaurant|shop|store|person|\w+)/i;
        
        const hasCurrency = currencyPattern.test(text);
        const hasPaymentIntent = paymentPattern.test(text);
        
        return hasCurrency && hasPaymentIntent;
    }

    async handler(
        runtime: IAgentRuntime,
        message: Memory,
        _state?: State,
        _options?: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> {
        try {
            const text = message.content.text || "";
            
            elizaLogger.info("[🟡 AURUM REWARD ACTION] Processing transaction:", text);

            // Extraer las direcciones y el monto del texto
            const fromMatch = text.match(/from\s+(0x[a-fA-F0-9]{64})/);
            const toMatch = text.match(/to\s+(0x[a-fA-F0-9]{64})/);
            const sender = fromMatch ? fromMatch[1] : this.usdcProvider.getAccountAddress() ;
            const recipient = toMatch ? toMatch[1] : "0x021764cc7C3E5B4Bf278D27196f22df369Dc5Da2044D3530D8de8D97767Fc938";
            const amount =  BigInt(extractAmount(text));

            elizaLogger.info("[🟡 AURUM REWARD ACTION] Processing transaction:", {
                sender,
                recipient,
                amount: amount.toString()
            });

            // await this.usdcProvider.approve(this.rewardProvider.getAddress(), amount.toString());
            await this.rewardProvider.processTransaction(sender, recipient, amount);

            elizaLogger.info("[🟢 AURUM REWARD ACTION] Transaction processed successfully:", {
                sender,
                recipient,
                amount: amount.toString()
            });

            callback({
                text: `Transaction processed successfully: ${amount} tokens from ${sender} to ${recipient}`,
                content: {
                    sender,
                    recipient,
                    amount: amount.toString(),
                },
            });

            return true;
        } catch (error) {
            elizaLogger.error("[❌ AURUM REWARD ACTION] ProcessTransactionAction error:", error);
            return false;
        }
    }
} 