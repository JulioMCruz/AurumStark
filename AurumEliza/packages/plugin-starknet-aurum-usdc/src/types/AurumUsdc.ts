import { num, cairo } from 'starknet';

export interface AurumUsdcContract {
    address: string;
    name(): Promise<string>;
    symbol(): Promise<string>;
    decimals(): Promise<number>;
    totalSupply(): Promise<bigint>;
    balanceOf(account: string): Promise<bigint>;
    transfer(recipient: string, amount: typeof cairo.uint256): Promise<boolean>;
    version(): Promise<string>;
    getDecimals(): Promise<number>;
    getBalance(address: string): Promise<bigint>;
    getBalanceFormatted(address: string): Promise<string>;
}

export interface AurumUsdcProvider {
    getContract(): Promise<AurumUsdcContract>;
    getAddress(): string;
    getBalance(address: string): Promise<string>;
    getBalanceFormatted(address: string): Promise<string>;
    transfer(to: string, amount: string): Promise<boolean>;
}

export interface TransferParams {
    to: string;
    amount: string;
}

export interface BalanceParams {
    address: string;
} 