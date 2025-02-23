export const deployedContracts = {
    devnet: {
        AurumUsdc: {
            address: "0x040976c636d469331a343a2fa3e67280663124a5bd7fc0bc17191ecb847d1e42",
            abi: [
                {
                    "type": "impl",
                    "name": "AurumUsdcImpl",
                    "interface_name": "contracts::AurumUsdc::IAurumUsdc"
                },
                {
                    "type": "interface",
                    "name": "contracts::AurumUsdc::IAurumUsdc",
                    "items": [
                        {
                            "type": "function",
                            "name": "name",
                            "inputs": [],
                            "outputs": [{"type": "core::byte_array::ByteArray"}],
                            "state_mutability": "view"
                        },
                        {
                            "type": "function",
                            "name": "symbol",
                            "inputs": [],
                            "outputs": [{"type": "core::byte_array::ByteArray"}],
                            "state_mutability": "view"
                        },
                        {
                            "type": "function",
                            "name": "decimals",
                            "inputs": [],
                            "outputs": [{"type": "core::integer::u8"}],
                            "state_mutability": "view"
                        },
                        {
                            "type": "function",
                            "name": "balance_of",
                            "inputs": [{"name": "account", "type": "core::starknet::contract_address::ContractAddress"}],
                            "outputs": [{"type": "core::integer::u256"}],
                            "state_mutability": "view"
                        },
                        {
                            "type": "function",
                            "name": "transfer",
                            "inputs": [
                                {"name": "recipient", "type": "core::starknet::contract_address::ContractAddress"},
                                {"name": "amount", "type": "core::integer::u256"}
                            ],
                            "outputs": [{"type": "core::bool"}],
                            "state_mutability": "external"
                        }
                    ]
                }
            ]
        }
    },
    sepolia: {
        AurumUsdc: {
            address: "0x040976c636d469331a343a2fa3e67280663124a5bd7fc0bc17191ecb847d1e42",
            abi: [
                {
                    "type": "impl",
                    "name": "AurumUsdcImpl",
                    "interface_name": "contracts::AurumUsdc::IAurumUsdc"
                },
                {
                    "type": "interface",
                    "name": "contracts::AurumUsdc::IAurumUsdc",
                    "items": [
                        {
                            "type": "function",
                            "name": "name",
                            "inputs": [],
                            "outputs": [{"type": "core::byte_array::ByteArray"}],
                            "state_mutability": "view"
                        },
                        {
                            "type": "function",
                            "name": "symbol",
                            "inputs": [],
                            "outputs": [{"type": "core::byte_array::ByteArray"}],
                            "state_mutability": "view"
                        },
                        {
                            "type": "function",
                            "name": "decimals",
                            "inputs": [],
                            "outputs": [{"type": "core::integer::u8"}],
                            "state_mutability": "view"
                        },
                        {
                            "type": "function",
                            "name": "balance_of",
                            "inputs": [{"name": "account", "type": "core::starknet::contract_address::ContractAddress"}],
                            "outputs": [{"type": "core::integer::u256"}],
                            "state_mutability": "view"
                        },
                        {
                            "type": "function",
                            "name": "transfer",
                            "inputs": [
                                {"name": "recipient", "type": "core::starknet::contract_address::ContractAddress"},
                                {"name": "amount", "type": "core::integer::u256"}
                            ],
                            "outputs": [{"type": "core::bool"}],
                            "state_mutability": "external"
                        }
                    ]
                }
            ]
        }
    }
} as const; 