import { GetBalanceAction } from './getBalance';
import { AurumUsdcProvider } from '../types/AurumUsdc';

export function createActions(provider: AurumUsdcProvider) {
    return [
        new GetBalanceAction(provider),
    ];
}

export * from './getBalance';
