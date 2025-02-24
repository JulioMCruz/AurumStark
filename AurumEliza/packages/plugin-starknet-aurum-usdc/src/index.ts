import { elizaLogger, Plugin } from "@elizaos/core";
import { Provider, RpcProvider } from 'starknet';
import { StarknetAurumUsdcProvider } from './providers/AurumUsdcProvider';
import { GetBalanceAction, TransferAction } from "./actions";

export function createAurumUsdcPlugin(provider: Provider, network: 'devnet' | 'sepolia' = 'sepolia'): Plugin {
    const aurumUsdcProvider = new StarknetAurumUsdcProvider(provider, network);
    elizaLogger.info("Aurum Usdc Provider created");
    // Crear y retornar el plugin
    return {
        name: "aurum-usdc",
        description: "Plugin para interactuar con el token AU USDC en Starknet",
        actions: [new GetBalanceAction(aurumUsdcProvider), new TransferAction(aurumUsdcProvider)],
        providers: []
    };
}

export * from './types/AurumUsdc';
export { StarknetAurumUsdcProvider };
// TODO: SETUP RPC URL .env

export const starknetAurumUsdcPlugin = createAurumUsdcPlugin(new RpcProvider({ nodeUrl: 'https://api.cartridge.gg/x/starknet/sepolia' }));
export default starknetAurumUsdcPlugin
