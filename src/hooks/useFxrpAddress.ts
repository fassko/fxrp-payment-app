'use client'

import { useReadContract } from 'wagmi'
import { iFlareContractRegistryAbi, iAssetManagerAbi } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'

const FLARE_CONTRACT_REGISTRY_ADDRESS = '0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019';

export function useFxrpAddress() {
  // First, get the AssetManagerFXRP address from the FlareContractsRegistry
  // Using useReadContract directly instead of useReadIFlareContractRegistry
  // to avoid initialization issues with provider context
  const { data: assetManagerAddress } = useReadContract({
    address: FLARE_CONTRACT_REGISTRY_ADDRESS,
    abi: iFlareContractRegistryAbi,
    functionName: 'getContractAddressByName',
    args: ['AssetManagerFXRP'],
    query: {
      enabled: typeof window !== 'undefined',
    },
  })

  // Then, get the fAsset (FXRP) address from the AssetManager
  // Using useReadContract directly instead of useReadIAssetManager
  // to avoid initialization issues with provider context
  const { data: fxrpAddress, isLoading, error } = useReadContract({
    address: assetManagerAddress,
    abi: iAssetManagerAbi,
    functionName: 'fAsset',
    query: {
      enabled: !!assetManagerAddress && typeof window !== 'undefined',
    },
  })

  return {
    fxrpAddress: fxrpAddress as `0x${string}` | undefined,
    assetManagerAddress: assetManagerAddress as `0x${string}` | undefined,
    isLoading,
    error
  }
}