import { ActionExample } from '@elizaos/core';

const examples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "Hey Aurum, I want to pay 500 THB to this restaurant",
                action: "AURUM_REWARD_PROCESS_TRANSACTION",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Payment processed successfully: 14.29 USDC (500 THB) to Bangkok Kitchen [Restaurant]. You earned 1.429 Aurum points! Transaction hash: 0x123...",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Send 45 USD to Bob",
                action: "AURUM_REWARD_PROCESS_TRANSACTION",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Payment processed successfully: 45 USDC to Bob [Person]. You earned 4.5 Aurum points! Transaction hash: 0xabc...",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Pay 1000 THB to nearby shop",
                action: "AURUM_REWARD_PROCESS_TRANSACTION",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Payment processed successfully: 28.57 USDC (1000 THB) to 7-Eleven Sukhumvit [Store]. You earned 2.857 Aurum points! Transaction hash: 0x456...",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Transfer 75 EUR to taxi driver",
                action: "AURUM_REWARD_PROCESS_TRANSACTION",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Payment processed successfully: 80 USDC (75 EUR) to Bangkok Taxi [Service]. You earned 8 Aurum points! Transaction hash: 0xdef...",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Split bill 240 SGD with Alice",
                action: "AURUM_REWARD_PROCESS_TRANSACTION",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Payment processed successfully: 180 USDC (240 SGD) to Alice [Person]. You earned 18 Aurum points! Transaction hash: 0xghi...",
            },
        }
    ]
];

export default examples; 