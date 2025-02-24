import {
    Action,
    IAgentRuntime,
    ActionExample,
    elizaLogger,
    HandlerCallback,
    State,
} from "@elizaos/core";
import { AurumUsdcProvider, Message } from "../../types/AurumUsdc";
import { extractAddress } from "../../utils/extractors";
import examples from "./examples";

export class GetBalanceAction implements Action {
    private provider: AurumUsdcProvider;
    public name = "AURUM_USDC_GET_BALANCE";
    public description = "Obtener el balance de AU USDC de una dirección";
    public similes = [
        "AURUM_USDC_CHECK_BALANCE",
        "AURUM_USDC_VIEW_BALANCE",
        "check_balance",
        "view_balance",
        "get_balance",
        "balance_check",
    ];
    public examples = examples;

    constructor(provider: AurumUsdcProvider) {
        this.provider = provider;
    }

    async validate(
        _runtime: IAgentRuntime,
        message: Message
    ): Promise<boolean> {
        const addressRegex = /0x[a-fA-F0-9]{40}/;
        return addressRegex.test(
            message.content?.address || message.content?.text || ""
        );
    }

    async handler(
        runtime: IAgentRuntime,
        message: Message,
        _state?: State,
        _options?: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> {
        try {
            const address =
                message.content.address ||
                extractAddress(message.content.text || "");
            elizaLogger.info("🟡 address: ", address);

            const balance = await this.provider.getBalance(address);

            callback({
                text: `Your current balance is ${balance} AU USDC`,
                content: {
                    balance,
                    address,
                },
            });

            return true;
        } catch (error) {
            elizaLogger.error("🔴 GetBalanceAction error:", error);
            return false;
        }
    }
}
