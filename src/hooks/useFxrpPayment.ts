'use client'

import { useWriteContract, useWaitForTransactionReceipt, useReadContracts } from 'wagmi'
import { parseUnits, formatUnits, erc20Abi } from 'viem'

import { useFxrpAddress } from './useFxrpAddress'

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

  const { data, isLoading, error } = useReadContracts({
    contracts: [
      {
        address: fxrpAddress,
        abi: erc20Abi,
        functionName: 'decimals',
      },
      {
        address: fxrpAddress,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: address ? [address as `0x${string}`] : undefined,
      },
    ],
    query: {
      enabled: !!address && !!fxrpAddress,
    },
  })

  const [decimalsResult, balanceResult] = data ?? []
  const decimals = decimalsResult?.result as number | undefined
  const balance = balanceResult?.result as bigint | undefined
  const formattedBalance = balance && decimals !== undefined ? formatUnits(balance, decimals) : '0'

  return {
    balance: formattedBalance,
    rawBalance: balance,
    decimals,
    fxrpAddress,
    isLoading: isLoadingAddress || isLoading,
    error: addressError || error,
  }
}