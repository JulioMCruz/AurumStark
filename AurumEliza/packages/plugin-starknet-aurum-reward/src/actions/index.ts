import { ProcessTransactionAction } from './processTransaction';
import { AurumRewardProvider } from '../providers/AurumRewardProvider';
import { AurumUsdcProvider } from '../providers/AurumUsdcProvider';

export function createActions(provider: AurumRewardProvider, usdcProvider: AurumUsdcProvider) {
    return [
        new ProcessTransactionAction(provider, usdcProvider),
    ];
}

export * from './processTransaction';
