# @elizaos/plugin-starknet-aurum-usdc

Plugin for interacting with USDC tokens on Starknet through Eliza.

## Features

- USDC balance queries on Starknet
- Support for multiple networks (mainnet, sepolia, devnet)
- Automatic decimal handling

## Installation

```bash
npm install @elizaos/plugin-starknet-aurum-usdc
```

## Quick Start

### Using the predefined instance

```typescript
import { starknetAurumUsdcPlugin } from '@elizaos/plugin-starknet-aurum-usdc';

// The plugin comes pre-configured for the Sepolia network
eliza.use(starknetAurumUsdcPlugin);
```

### Creating a custom instance

```typescript
import { createAurumUsdcPlugin } from '@elizaos/plugin-starknet-aurum-usdc';

const plugin = createAurumUsdcPlugin({
    network: 'sepolia', // 'mainnet' | 'sepolia' | 'devnet'
    privateKey: process.env.STARKNET_PRIVATE_KEY,
    accountAddress: process.env.STARKNET_ACCOUNT_ADDRESS,
    rpcUrl: 'OPTIONAL_URL' // Custom RPC URL
});

eliza.use(plugin);
```

## Available Actions

### Check Balance

```typescript
// The action is triggered by commands like:
"check balance of 0x..."
"get balance of domain.stark"
"show balance"
```

## Network Configuration

The plugin supports the following networks:

- **Mainnet**
  - RPC: https://starknet-mainnet.public.blastapi.io
  - USDC: 0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7

- **Sepolia (Testnet)**
  - RPC: https://api.cartridge.gg/x/starknet/sepolia
  - USDC: 0x040976C636d469331A343a2Fa3E67280663124a5bd7Fc0BC17191ECb847d1E42

- **Devnet**
  - RPC: http://localhost:5050
  - USDC: 0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7

## Implementation

The plugin is built on three main components:

1. **AurumUsdcContract**: Implements the interface for interacting with the USDC contract on Starknet
   - Balance queries
   - Decimal handling

2. **AurumUsdcProvider**: Provides an abstraction layer over the contract
   - Account management
   - Error handling

3. **Actions**: Implements the executable actions
   - GetBalanceAction: For balance queries

## Required Environment Variables

```env
STARKNET_PRIVATE_KEY=your_private_key
STARKNET_ACCOUNT_ADDRESS=your_account_address
```

## Security

- Credentials should be handled securely through environment variables
- It's recommended to use different accounts for mainnet and testnet
- Implement additional validations according to your needs

## Contributing

Contributions are welcome. Please ensure you:

1. Follow the existing code style
2. Add tests for new features
3. Update documentation as needed
