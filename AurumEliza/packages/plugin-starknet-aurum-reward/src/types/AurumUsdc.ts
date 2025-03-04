import { num, cairo, Contract, BigNumberish, AccountInterface } from 'starknet';

export interface AurumUsdcContract {
    address: string;
    name(): Promise<string>;
    symbol(): Promise<string>;
    decimals(): Promise<number>;
    totalSupply(): Promise<bigint>;
    balanceOf(account: string): Promise<bigint>;
    transfer(recipient: string, amount: BigNumberish): Promise<boolean>;
    approve(spender: string, amount: BigNumberish,  account: AccountInterface): Promise<string>;
    getDecimals(): Promise<number>;
    getBalance(address: string): Promise<bigint>;
    convertToUSDC(amount: string, fromCurrency: string): Promise<string>;
}

export interface AurumUsdcProvider {
    approve(spender: string, amount: BigNumberish): Promise<string>;
    getAccountAddress(): string;
    getBalance(address: string): Promise<string>;
    transfer(to: string, amount: string): Promise<boolean>;
    convertToUSDC(amount: string, fromCurrency: string): Promise<string>;
}

export interface TransferParams {
    to: string;
    amount: string;
    currency?: string;
}

export interface BalanceParams {
    address: string;
}

export interface Message {
    content: {
        text?: string;
        address?: string;
        to?: string;
        amount?: string;
        currency?: string;
    };
}
