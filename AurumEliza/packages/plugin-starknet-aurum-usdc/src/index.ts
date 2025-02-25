import { elizaLogger, Plugin } from "@elizaos/core";
import { Account, RpcProvider } from 'starknet';
import { AurumUsdcProvider } from './providers/AurumUsdcProvider';
import { GetBalanceAction } from "./actions";

// Direcciones de contratos por red
const CONTRACT_ADDRESSES = {
    mainnet: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8', // USDC en mainnet
    sepolia: '0x005315902efd62667a0ca3c228decc63b30fb663e411dc726ac0f2ba35e8665f', // USDC en testnet
    devnet: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'  // USDC en devnet
};

interface PluginConfig {
    network: 'mainnet' | 'sepolia' | 'devnet';
    privateKey?: string;
    accountAddress?: string;
    rpcUrl?: string;
}

// Añadir validación para la variable de entorno
const VALID_NETWORKS = ['mainnet', 'sepolia', 'devnet'] as const;
type NetworkType = typeof VALID_NETWORKS[number];

const AURUM_NETWORK = (process.env.AURUM_NETWORK || 'sepolia') as NetworkType;
const AURUM_RPC_URL = (process.env.AURUM_RPC_URL || 'https://api.cartridge.gg/x/starknet/sepolia') as NetworkType;

// Validar que la red sea válida
if (!VALID_NETWORKS.includes(AURUM_NETWORK)) {
    throw new Error(`Red no válida: ${AURUM_NETWORK}. Debe ser una de: ${VALID_NETWORKS.join(', ')}`);
}

function createPlugin(config: PluginConfig): Plugin {
    const {
        network = AURUM_NETWORK,
        rpcUrl = AURUM_RPC_URL,
        privateKey,
        accountAddress
    } = config;

    // Crear el provider RPC
    const provider = new RpcProvider({ nodeUrl: rpcUrl });
    
    let account: Account | undefined;
    
    // Si se proporcionan credenciales, crear una cuenta
    if (privateKey && accountAddress) {
        account = new Account(provider, accountAddress, privateKey);
        elizaLogger.info("Starknet account created");
    }

    if (!account) {
        throw new Error("Account credentials are required");
    }

    // Crear el provider de USDC con la dirección del contrato correspondiente
    const aurumUsdcProvider = new AurumUsdcProvider(
        CONTRACT_ADDRESSES[network],
        account
    );
    
    elizaLogger.info(`Aurum USDC Provider created for network: ${network}`);

    return {
        name: "aurum-usdc",
        description: "Plugin para interactuar con el token AU USDC en Starknet",
        actions: [
            new GetBalanceAction(aurumUsdcProvider),
        ],
        providers: []
    };
}

// Exportar tipos e implementaciones
export * from './types/AurumUsdc';
export { AurumUsdcContract as AurumUsdcContractImpl } from './contracts/AurumUsdcContract';
export { AurumUsdcProvider as AurumUsdcProviderImpl } from './providers/AurumUsdcProvider';
export const createAurumUsdcPlugin = createPlugin;

// Exportar instancia predefinida del plugin
export const starknetAurumUsdcPlugin = createPlugin({
    network: AURUM_NETWORK,
    rpcUrl: AURUM_RPC_URL,
    // Estas credenciales deberían venir de variables de entorno en producción
    privateKey: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    accountAddress: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
});

export default starknetAurumUsdcPlugin;
