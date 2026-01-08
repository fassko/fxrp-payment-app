'use client'

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { useFxrpAddress } from './useFxrpAddress'
import IERC20MetadataArtifact from '@openzeppelin/contracts/build/contracts/IERC20Metadata.json'

const ERC20_ABI = IERC20MetadataArtifact.abi

// Helper function to format balance using decimals
function formatBalance(balance: bigint | undefined, decimals: number | undefined): string {
  if (!balance || decimals === undefined) return '0'
  return formatUnits(balance, decimals)
}

export function useFxrpPayment() {
  const { fxrpAddress } = useFxrpAddress()
  
  const { 
    writeContract, 
    data: hash,
    isPending,
    error 
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const sendFxrp = async (to: string, amount: string, decimals?: number) => {
    if (!fxrpAddress) {
      throw new Error('FXRP address not available')
    }
    if (decimals === undefined) {
      throw new Error('Token decimals not available')
    }
    
    try {
      const amountInUnits = parseUnits(amount, decimals)
      
      writeContract({
        address: fxrpAddress,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [to as `0x${string}`, amountInUnits],
      })
    } catch (err) {
      console.error('Error sending FXRP:', err)
      throw err
    }
  }

  return {
    sendFxrp,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
    fxrpAddress
  }
}

export function useFxrpBalance(address?: string) {
  const { fxrpAddress, isLoading: isLoadingAddress, error: addressError } = useFxrpAddress()
  
  // Fetch decimals from the token contract
  const { data: decimals, isLoading: isLoadingDecimals, error: decimalsError } = useReadContract({
    address: fxrpAddress,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: {
      enabled: !!fxrpAddress && typeof window !== 'undefined',
    },
  })

  // Fetch balance
  const { data: balance, isLoading: isLoadingBalance, error: balanceError } = useReadContract({
    address: fxrpAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address && !!fxrpAddress && typeof window !== 'undefined',
    },
  })

  const formattedBalance = formatBalance(balance as bigint | undefined, decimals as number | undefined)

  return {
    balance: formattedBalance,
    rawBalance: balance,
    decimals: decimals as number | undefined,
    fxrpAddress,
    isLoading: isLoadingAddress || isLoadingDecimals || isLoadingBalance,
    error: addressError || decimalsError || balanceError,
  }
}