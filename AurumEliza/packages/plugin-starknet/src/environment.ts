import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";
import { RpcProvider } from "starknet";

// Actualizar la URL por defecto a Sepolia
const STARKNET_SEPOLIA_RPC = "https://starknet-sepolia.public.blastapi.io";

// Agregar constante para el chainId de Sepolia
const STARKNET_SEPOLIA_CHAIN_ID = "0x534e5f5345504f4c4941"; // SN_SEPOLIA en hexadecimal

export const starknetEnvSchema = z.object({
    STARKNET_ADDRESS: z.string().min(1, "Starknet address is required"),
    STARKNET_PRIVATE_KEY: z.string().min(1, "Starknet private key is required"),
    STARKNET_RPC_URL: z.string().min(1, "Starknet RPC URL is required"),
    AURUM_REWARD_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{64}$/, "Invalid Aurum Reward contract address format"),
});

export type StarknetConfig = z.infer<typeof starknetEnvSchema>;

// Dirección del contrato AurumReward en Starknet
export const AURUM_REWARD_ADDRESS = process.env.AURUM_REWARD_ADDRESS || "0x123..."; // Reemplazar con la dirección real del contrato desplegado

export async function validateStarknetConfig(
    runtime: IAgentRuntime
): Promise<StarknetConfig> {
    try {
        const config = {
            STARKNET_ADDRESS:
                runtime.getSetting("STARKNET_ADDRESS") ||
                process.env.STARKNET_ADDRESS,
            STARKNET_PRIVATE_KEY:
                runtime.getSetting("STARKNET_PRIVATE_KEY") ||
                process.env.STARKNET_PRIVATE_KEY,
            STARKNET_RPC_URL:
                runtime.getSetting("STARKNET_RPC_URL") ||
                process.env.STARKNET_RPC_URL ||
                STARKNET_SEPOLIA_RPC,
            AURUM_REWARD_ADDRESS:
                runtime.getSetting("AURUM_REWARD_ADDRESS") ||
                process.env.AURUM_REWARD_ADDRESS ||
                AURUM_REWARD_ADDRESS,
        };

        const validatedConfig = starknetEnvSchema.parse(config);

        // Crear provider y validar la red
        const provider = new RpcProvider({ nodeUrl: validatedConfig.STARKNET_RPC_URL });
        
        try {
            const chainId = await provider.getChainId();
            if (chainId !== STARKNET_SEPOLIA_CHAIN_ID) {
                throw new Error(
                    `Invalid network. Expected Sepolia (${STARKNET_SEPOLIA_CHAIN_ID}), but got ${chainId}`
                );
            }

            // Validar que el contrato existe
            await provider.getClassAt(validatedConfig.AURUM_REWARD_ADDRESS);
            
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(
                    `Network validation failed: ${error.message}`
                );
            }
            throw error;
        }

        return validatedConfig;
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Starknet configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}
