import { ActionExample } from '@elizaos/core';

export const examples: ActionExample[][] = [[
    {
        user: "{{user1}}",
        content: { 
            text: "Pay 500 THB to merchant 0x123..." 
        }
    },
    {
        user: "{{user2}}",
        content: { 
            text: "I'll handle the conversion and rewards. Current rate is 35 THB per USDC. This will be 14.29 USDC, and you'll earn 1.429 Aurum points for dining internationally. Transaction completed successfully!",
            action: "AURUM_USDC_TRANSFER"
        }
    }
]];

export default examples;
