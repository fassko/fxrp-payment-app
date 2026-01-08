/**
 * Get the Flare Coston2 explorer URL for an address
 * @param address - The address to link to
 * @returns The explorer URL
 */
export function getExplorerAddressUrl(address: string): string {
  return `https://coston2-explorer.flare.network/address/${address}`
}

/**
 * Get the Flare Coston2 explorer URL for a transaction hash
 * @param hash - The transaction hash to link to
 * @returns The explorer URL
 */
export function getExplorerTransactionUrl(hash: string): string {
  return `https://coston2-explorer.flare.network/tx/${hash}`
}

/**
 * Format an address or hash to a shortened version (e.g., 0x1234...5678)
 * @param address - The address or hash to format
 * @param startLength - Number of characters to show at the start (default: 6)
 * @param endLength - Number of characters to show at the end (default: 4)
 * @returns The formatted address string
 */
export function formatAddress(address: string, startLength: number = 6, endLength: number = 4): string {
  if (!address || address.length <= startLength + endLength) {
    return address
  }
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}
