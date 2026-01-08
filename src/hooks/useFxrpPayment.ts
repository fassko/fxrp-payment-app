'use client'

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { parseUnits, erc20Abi } from 'viem'

import { useFxrpAddress } from './useFxrpAddress'
import { formatBalance } from '../lib/format'

export function useFxrpPayment() {
  const { fxrpAddress } = useFxrpAddress()
  
  const writeContract = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: writeContract.data,
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
      
      writeContract.mutate({
        address: fxrpAddress,
        abi: erc20Abi,
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
    hash: writeContract.data,
    isPending: writeContract.isPending,
    isConfirming,
    isSuccess,
    error: writeContract.error,
    fxrpAddress
  }
}

export function useFxrpBalance(address?: string) {
  const { fxrpAddress, isLoading: isLoadingAddress, error: addressError } = useFxrpAddress()
  
  // Fetch decimals from the token contract
  const { data: decimals, isLoading: isLoadingDecimals, error: decimalsError } = useReadContract({
    address: fxrpAddress,
    abi: erc20Abi,
    functionName: 'decimals',
    query: {
      enabled: !!fxrpAddress && typeof window !== 'undefined',
    },
  })

  // Fetch balance
  const { data: balance, isLoading: isLoadingBalance, error: balanceError } = useReadContract({
    address: fxrpAddress,
    abi: erc20Abi,
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