import { formatUnits } from 'viem'

// Helper function to format balance using decimals
export function formatBalance(balance: bigint | undefined, decimals: number | undefined): string {
  if (!balance || decimals === undefined) return '0'
  return formatUnits(balance, decimals)
}