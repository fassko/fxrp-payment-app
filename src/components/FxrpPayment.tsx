'use client'

import { useState, useEffect, useRef, startTransition } from 'react'
import { useConnection } from 'wagmi'

import { useFxrpPayment, useFxrpBalance } from '../hooks/useFxrpPayment'
import { getExplorerAddressUrl, getExplorerTransactionUrl, formatAddress } from '../lib/utils'
import { ClientOnly } from './ClientOnly'

function FxrpPaymentInner() {
  const { address, isConnected } = useConnection()
  const { balance, fxrpAddress, decimals, isLoading: isLoadingBalance, error: balanceError, refetch } = useFxrpBalance(address)
  const { sendFxrp, isPending, isConfirming, isSuccess, error, hash } = useFxrpPayment()
  
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const previousHashRef = useRef<string | undefined>(undefined)

  // Reset form fields when a new transaction hash is received
  useEffect(() => {
    if (hash && hash !== previousHashRef.current) {
      previousHashRef.current = hash
      startTransition(() => {
        setRecipient('');
        setAmount('');
      })
    }
  }, [hash])

  // Refresh balance after successful transfer
  useEffect(() => {
    if (isSuccess) {
      refetch()
    }
  }, [isSuccess, refetch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipient || !amount) return

    try {
      await sendFxrp(recipient, amount, decimals)
    } catch (err) {
      console.error('Payment failed:', err)
    }
  }

  if (!isConnected) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-700">Please connect your wallet to make FXRP payments.</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="mb-4 p-4 bg-linear-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-200">
        <p className="font-bold text-gray-900 mb-2">Your FXRP Balance:</p>
        {isLoadingBalance ? (
          <p className="font-bold text-gray-800">Loading...</p>
        ) : balanceError ? (
          <p className="font-bold text-red-600">Error: {balanceError.message}</p>
        ) : (
          <p className="font-bold text-gray-900 mb-1">{parseFloat(balance).toFixed(4)} FXRP</p>
        )}
        {fxrpAddress && (
          <p className="text-xs text-gray-600 mt-2">
            Contract:{' '}
            <a
              href={getExplorerAddressUrl(fxrpAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E6007A] hover:text-[#C40066] underline"
            >
              {formatAddress(fxrpAddress)}
            </a>
          </p>
        )}
        {address && (
          <p className="text-xs text-gray-600">
            Your Address:{' '}
            <a
              href={getExplorerAddressUrl(address)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E6007A] hover:text-[#C40066] underline"
            >
              {formatAddress(address)}
            </a>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Address
          </label>
          <input
            id="recipient"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6007A] text-gray-900 placeholder:text-gray-400"
            required
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount (FXRP)
          </label>
          <input
            id="amount"
            type="number"
            step="0.000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E6007A] text-gray-900 placeholder:text-gray-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending || isConfirming || !recipient || !amount}
          className="w-full px-4 py-2 bg-[#E6007A] text-white rounded-md hover:bg-[#C40066] disabled:bg-gray-400 enabled:cursor-pointer disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Preparing...' : isConfirming ? 'Confirming...' : 'Send FXRP'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
          <p className="text-red-700 text-sm">
            Error: {error.message}
          </p>
        </div>
      )}

      {isSuccess && hash && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded">
          <p className="text-green-700 text-sm">
            Transaction successful! 
            <br />
            Hash:{' '}
            <a
              href={getExplorerTransactionUrl(hash)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E6007A] hover:text-[#C40066] underline font-mono"
            >
              {formatAddress(hash, 10, 8)}
            </a>
          </p>
        </div>
      )}
    </div>
  )
}

export function FxrpPayment() {
  return (
    <ClientOnly>
      <FxrpPaymentInner />
    </ClientOnly>
  )
}