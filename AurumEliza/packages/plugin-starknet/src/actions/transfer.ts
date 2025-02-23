// TODO: Implement this for Starknet.
// It should just transfer tokens from the agent's wallet to the recipient.

import {
    type Action,
    type ActionExample,
    composeContext,
    type Content,
    elizaLogger,
    generateObjectDeprecated,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    ModelClass,
    type State,
} from "@elizaos/core";
import { getStarknetAccount } from "../utils";
import { validateStarknetConfig, AURUM_REWARD_ADDRESS } from "../environment";
import { getAddressFromName, isStarkDomain } from "../utils/starknetId";
import { AurumRewardToken } from "../utils/AurumRewardToken";

export interface TransferContent extends Content {
    tokenAddress: string;
    recipient?: string;
    starkName?: string;
    amount: string | number;
}

export function isTransferContent(
    content: TransferContent
): content is TransferContent {
    // Validaciones básicas
    const validTypes =
        typeof content.tokenAddress === "string" &&
        (typeof content.recipient === "string" ||
            typeof content.starkName === "string") &&
        (typeof content.amount === "string" ||
            typeof content.amount === "number");
    if (!validTypes) return false;

    // Validar dirección del token
    if (!content.tokenAddress.startsWith("0x") || 
        content.tokenAddress.length !== 66) return false;

    // Validar recipient o starkName
    if (content.recipient && 
        (!content.recipient.startsWith("0x") || 
         content.recipient.length !== 66)) return false;

    if (content.starkName && !isStarkDomain(content.starkName)) return false;

    return true;
}

const transferTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

For the amount to send, use a value from 1 - 100. This will be processed through the AurumReward contract which will:
1. Take a 1% fee
2. Award 10 reward points per token of fee
3. Transfer the remaining amount to the recipient

Known token addresses:
- USDC: 0x... (reemplazar con la dirección real del token USDC)

Example response:
\`\`\`json
{
    "tokenAddress": "0x...", // USDC address
    "recipient": "0x1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF",
    "amount": "100"
}
\`\`\`

{{recentMessages}}

Extract the transfer details from the recent messages.`;

export default {
    name: "SEND_TOKEN",
    similes: ["TRANSFER_USDC", "SEND_USDC", "PAY_WITH_USDC"],
    validate: async (runtime: IAgentRuntime) => {
        try {
            await validateStarknetConfig(runtime);
            return true;
        } catch (error) {
            elizaLogger.error("Validation failed:", error);
            return false;
        }
    },
    description: "Use this action to transfer USDC tokens through the AurumReward contract, which handles fees and reward points.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.log("Starting AurumReward transfer handler...");

        try {
            const config = await validateStarknetConfig(runtime);
            const currentState = state ?? await runtime.composeState(message);
            
            // Generar contenido de la transferencia
            const content = await generateObjectDeprecated({
                runtime,
                context: composeContext({ state: currentState, template: transferTemplate }),
                modelClass: ModelClass.MEDIUM,
            });

            if (!isTransferContent(content)) {
                throw new Error("Invalid transfer content");
            }

            const account = getStarknetAccount(runtime);
            const aurumToken = new AurumRewardToken(content.tokenAddress, account, config.AURUM_REWARD_ADDRESS);

            // Calcular montos
            const decimals = await aurumToken.decimals();
            const amount = BigInt(Math.floor(Number(content.amount) * (10 ** Number(decimals))));
            const fee = aurumToken.calculateFee(amount);
            const points = aurumToken.calculatePoints(fee);

            // Obtener recipient
            const recipient = content.recipient ?? await getAddressFromName(account, content.starkName!);

            // Notificar inicio
            if (callback) {
                callback({
                    text: `Processing transfer of ${content.amount} USDC through AurumReward...`,
                    content: { status: "processing" }
                });
            }

            // Aprobar y procesar
            const approveTx = await account.execute(aurumToken.approveCall(config.AURUM_REWARD_ADDRESS, amount));
            await account.waitForTransaction(approveTx.transaction_hash);

            const processTx = await account.execute(aurumToken.processTransactionCall(account.address, recipient, amount));
            await account.waitForTransaction(processTx.transaction_hash);

            // Notificar éxito
            const successMsg = `Transfer completed! Paid ${fee} USDC fee and earned ${points} reward points.`;
            elizaLogger.success(successMsg);
            
            if (callback) {
                callback({
                    text: successMsg,
                    content: {
                        status: "success",
                        transactionHash: processTx.transaction_hash,
                        fee: fee.toString(),
                        points: points.toString()
                    }
                });
            }

            return true;

        } catch (error) {
            const errorMsg = `Transfer failed: ${error.message}`;
            elizaLogger.error(errorMsg);
            
            if (callback) {
                callback({
                    text: errorMsg,
                    content: { status: "failed", error: error.message }
                });
            }
            
            return false;
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "Send 100 USDC to wallet.stark" }
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Processing transfer of 100 USDC through AurumReward...",
                    content: { status: "processing" }
                }
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Transfer completed! Paid 1 USDC fee and earned 10 reward points.",
                    content: {
                        status: "success",
                        transactionHash: "0x123...",
                        fee: "1",
                        points: "10"
                    }
                }
            }
        ]
    ] as ActionExample[][],

    metadata: {
        requiresNetwork: true,
        networkType: "starknet",
        gasRequired: true,
        permissions: ["transfer"]
    }
} as Action;
