import { elizaLogger, Plugin } from "@elizaos/core";
import { Account, RpcProvider } from 'starknet';
import { createActions, ProcessTransactionAction } from "./actions";
import { AurumRewardProvider } from "./providers/AurumRewardProvider";
import { AurumUsdcProvider } from './providers/AurumUsdcProvider';

// Direcciones de contratos por red
const  REWARD_CONTRACT_ADDRESSES = {
    mainnet: '0x290d82f4967bdb9e89921abbdf5716c81c2fba9fa2d1ffd42b1895910d5503d', // Reward en mainnet
    sepolia: '0x72d6a54994d80337db96da95b19454ab87c7c5ca9490d72d4901c6464676412', // Reward en testnet
    devnet: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'  // Reward en devnet
};

const USDC_CONTRACT_ADDRESSES = {
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

// Validar que la red sea válida
if (!VALID_NETWORKS.includes(AURUM_NETWORK)) {
    throw new Error(`Red no válida: ${AURUM_NETWORK}. Debe ser una de: ${VALID_NETWORKS.join(', ')}`);
}

function createPlugin(config: PluginConfig): Plugin {
    try {
        const { network = AURUM_NETWORK } = config;
        
        // Validar y obtener RPC URL
        const rpcUrl = network === 'mainnet' 
            ? process.env.AURUM_RPC_URL_MAINNET 
            : process.env.AURUM_RPC_URL_SEPOLIA;
        if (!rpcUrl) {
            elizaLogger.error(`[❌ AURUM] RPC URL no configurada para la red ${network}`);
            throw new Error('RPC URL no configurada');
        }

        // Validar y obtener Private Key
        const privateKey = network === 'mainnet'
            ? process.env.AURUM_PRIVATE_KEY_MAINNET
            : process.env.AURUM_PRIVATE_KEY_SEPOLIA;
        if (!privateKey) {
            elizaLogger.error(`[❌ AURUM] Private key no configurada para la red ${network}`);
            throw new Error('Private key no configurada');
        }

        // Validar y obtener Account Address
        const accountAddress = network === 'mainnet'
            ? process.env.AURUM_ACCOUNT_ADDRESS_MAINNET
            : process.env.AURUM_ACCOUNT_ADDRESS_SEPOLIA;
        if (!accountAddress) {
            elizaLogger.error(`[❌ AURUM] Account address no configurada para la red ${network}`);
            throw new Error('Account address no configurada');
        }

        // Validar formato de las credenciales
        if (!privateKey.startsWith('0x')) {
            elizaLogger.error('[❌ AURUM] Private key debe comenzar con 0x');
            throw new Error('Private key formato inválido');
        }
        if (!accountAddress.startsWith('0x')) {
            elizaLogger.error('[❌ AURUM] Account address debe comenzar con 0x');
            throw new Error('Account address formato inválido');
        }

        // Crear el provider RPC
        const provider = new RpcProvider({ nodeUrl: rpcUrl });
        
        try {
            const account = new Account(provider, accountAddress, privateKey);
            elizaLogger.info(`[✅ AURUM] Starknet account created for network: ${network}`);

            // Crear el provider de Reward con la dirección del contrato correspondiente
            const aurumRewardProvider = new AurumRewardProvider(
                REWARD_CONTRACT_ADDRESSES[network],
                account
            );
            // Crear el provider de USDC con la dirección del contrato correspondiente
              const aurumUsdcProvider = new AurumUsdcProvider(
                USDC_CONTRACT_ADDRESSES[network],
                account
            );
            
            elizaLogger.info(`[✅ AURUM] Aurum Reward Provider created for network: ${network}`);

            return {
                name: "aurum-reward",
                description: "Plugin para interactuar con el token AU Reward en Starknet",
                actions: createActions(aurumRewardProvider, aurumUsdcProvider),
                providers: []
            };
        } catch (error) {
            elizaLogger.error(`[❌ AURUM] Error al crear la cuenta de Starknet: ${error.message}`);
            throw error;
        }

    } catch (error) {
        elizaLogger.error(`[❌ AURUM] Error al crear el plugin: ${error.message}`);
        throw error;
    }
}

// Exportar tipos e implementaciones
export * from './types/AurumReward';
export { AurumRewardContract as AurumRewardContractImpl } from './contracts/AurumRewardContract';
export { AurumRewardProvider as AurumRewardProviderImpl } from './providers/AurumRewardProvider';


export const createAurumRewardPlugin = createPlugin;

// Exportar instancia predefinida del plugin
export const starknetAurumRewardPlugin = createPlugin({
    network: AURUM_NETWORK
});

export default starknetAurumRewardPlugin;
