export const COSTON2_EXPLORER_URL = 'https://coston2-explorer.flare.network'

/**
 * Get the Flare Coston2 explorer URL for an address
 */
export function getExplorerAddressUrl(address: string): string {
  return `${COSTON2_EXPLORER_URL}/address/${address}`
}

/**
 * Get the Flare Coston2 explorer URL for a transaction hash
 */
export function getExplorerTransactionUrl(hash: string): string {
  return `${COSTON2_EXPLORER_URL}/tx/${hash}`
}

/**
 * Format an address or hash to a shortened version (e.g., 0x1234...5678)
 */
export function formatAddress(address: string, startLength: number = 6, endLength: number = 4): string {
  if (!address || address.length <= startLength + endLength) {
    return address
  }
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`
}
