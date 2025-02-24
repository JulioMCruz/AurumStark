import { GetBalanceAction } from './getBalance';
import { TransferAction } from './transfer';
import { AurumUsdcProvider } from '../types/AurumUsdc';

export function createActions(provider: AurumUsdcProvider) {
    return [
        new GetBalanceAction(provider),
        new TransferAction(provider)
    ];
}

export * from './getBalance';
export * from './transfer';
