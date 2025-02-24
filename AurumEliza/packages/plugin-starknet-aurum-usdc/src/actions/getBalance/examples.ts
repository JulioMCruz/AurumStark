import { ActionExample } from '@elizaos/core';

export const examples: ActionExample[][] = [[
    {
        user: "{{user1}}",
        content: {
            text: "Check my balance aurum usdc at 0x123...",
        },
    },
    {
        user: "{{user2}}",
        content: {
            text: "Your current balance is 100 AU USDC",
            action: "AURUM_USDC_GET_BALANCE",
        },
    },
]];

export default examples;
