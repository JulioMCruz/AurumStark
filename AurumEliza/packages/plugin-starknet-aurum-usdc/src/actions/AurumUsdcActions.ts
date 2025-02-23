import { Action, IAgentRuntime, Memory, ActionExample, elizaLogger } from '@elizaos/core';
import { AurumUsdcProvider } from '../types/AurumUsdc';

export class GetBalanceAction implements Action {
    execute(arg0: { address: string; }): unknown {
        elizaLogger.info("🟡 GetBalanceAction", arg0);
        throw new Error("Method not implemented.");
    }
    private provider: AurumUsdcProvider;
    public name = "AURUM_USDC_GET_BALANCE";
    public description = "Obtener el balance de AU USDC de una dirección";
    public similes = ["AURUM_USDC_CHECK_BALANCE", "AURUM_USDC_VIEW_BALANCE"];
    public examples: ActionExample[][] = [[
        {
            user: "{{user1}}",
            content: {
                text: "Check my balance aurum usdc at 0x123...",
            },
        },
        {
            user: "{{user2}}",
            content: {
                text: "Sure thing, Balance on its way.",
                action: "AURUM_USDC_GET_BALANCE",
            },
        },
    ]];

    constructor(provider: AurumUsdcProvider) {
        this.provider = provider;
    }

    async validate(_runtime: IAgentRuntime, message: Memory): Promise<boolean> {
        return typeof message.content?.address === 'string';
    }

    async handler(_runtime: IAgentRuntime, message: Memory): Promise<string> {
        const address = message.content.address as string;
        return this.provider.getBalance(address);
    }
}

export class TransferAction implements Action {
    execute(arg0: { to: string; amount: string; }): unknown {
        elizaLogger.info("🟡 TransferAction", arg0);
        throw new Error("Method not implemented.");
    }
    private provider: AurumUsdcProvider;
    public name = "TRANSFER";
    public description = "Transferir AU USDC a otra dirección";
    public similes = ["SEND_USDC", "TRANSFER_USDC"];
    public examples: ActionExample[][] = [[
        {
            user: "user",
            content: { text: "Transfer 100000000 AU USDC to 0x123..." }
        },
        {
            user: "assistant",
            content: { text: "Transfer successful" }
        }
    ]];

    constructor(provider: AurumUsdcProvider) {
        this.provider = provider;
    }

    async validate(_runtime: IAgentRuntime, message: Memory): Promise<boolean> {
        return typeof message.content?.to === 'string' && 
               typeof message.content?.amount === 'string';
    }

    async handler(_runtime: IAgentRuntime, message: Memory): Promise<boolean> {
        const to = message.content.to as string;
        const amount = message.content.amount as string;
        return this.provider.transfer(to, amount);
    }
} 