import { Action, createAction } from "@elizaos/core";

export const claimRewardAction = createAction({
    name: "claimReward",
    description: "Reclama tokens ERC20 como recompensa del contrato AurumReward",
    parameters: {
        amount: {
            type: "string",
            description: "Cantidad de tokens a reclamar",
            required: true
        },
        tokenAddress: {
            type: "string",
            description: "Dirección del token ERC20",
            required: true
        }
    },
    async execute(params, agent) {
        const { amount, tokenAddress } = params;

        try {
            const result = await agent.rewardProvider.claimReward(amount, tokenAddress);
            
            if (result.success) {
                return {
                    success: true,
                    message: `Recompensa reclamada exitosamente. Hash de transacción: ${result.transactionHash}`
                };
            } else {
                return {
                    success: false,
                    message: `Error al reclamar recompensa: ${result.error}`
                };
            }
        } catch (error) {
            return {
                success: false,
                message: `Error inesperado al reclamar recompensa: ${error.message}`
            };
        }
    }
}); 