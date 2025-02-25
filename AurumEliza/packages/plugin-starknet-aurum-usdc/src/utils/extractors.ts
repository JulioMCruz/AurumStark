/**
 * Utility functions for extracting data from text
 */

/**
 * Extracts an Ethereum address from text
 * @param text Text containing an Ethereum address
 * @returns The first Ethereum address found in the text
 * @throws Error if no valid address is found
 */
export function extractAddress(text: string): string {
    const match = text.match(/0x[a-fA-F0-9]{64}/);
    if (!match) throw new Error('No valid Starknet address found in text');
    return match[0];
}

/**
 * Extracts a numeric amount from text
 * @param text Text containing a numeric amount
 * @returns The first numeric amount found in the text
 * @throws Error if no valid amount is found
 */
export function extractAmount(text: string): string {
    const match = text.match(/\d+(\.\d+)?/);
    if (!match) throw new Error('No valid amount found in text');
    return match[0];
}

/**
 * Extracts a currency code from text
 * @param text Text containing a currency code
 * @returns The first currency code found in the text, defaults to 'USDC'
 */
export function extractCurrency(text: string): string {
    const match = text.match(/THB|USDC|USD/i);
    return match ? match[0].toUpperCase() : 'USDC';
}
