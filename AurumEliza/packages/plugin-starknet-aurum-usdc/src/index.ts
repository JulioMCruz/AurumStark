import { elizaLogger, Plugin } from "@elizaos/core";
import { Account, RpcProvider } from 'starknet';
import { AurumUsdcProvider } from './providers/AurumUsdcProvider';
import { GetBalanceAction } from "./actions";

// Direcciones de contratos por red
const CONTRACT_ADDRESSES = {
    mainnet: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', // USDC en mainnet
    sepolia: '0x040976C636d469331A343a2Fa3E67280663124a5bd7Fc0BC17191ECb847d1E42', // USDC en testnet
    devnet: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'  // USDC en devnet
};

// URLs de RPC por red
const RPC_URLS = {
    mainnet: 'https://starknet-mainnet.public.blastapi.io',
    sepolia: 'https://api.cartridge.gg/x/starknet/sepolia',
    devnet: 'http://localhost:5050'
};

interface PluginConfig {
    network: 'mainnet' | 'sepolia' | 'devnet';
    privateKey?: string;
    accountAddress?: string;
    rpcUrl?: string;
}

function createPlugin(config: PluginConfig): Plugin {
    const {
        network = 'sepolia',
        rpcUrl = RPC_URLS[network],
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
    network: 'sepolia',
    rpcUrl: 'https://api.cartridge.gg/x/starknet/sepolia',
    // Estas credenciales deberían venir de variables de entorno en producción
    privateKey: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    accountAddress: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
});

export default starknetAurumUsdcPlugin;
