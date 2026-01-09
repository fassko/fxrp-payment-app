'use client'

import { useReadIFlareContractRegistry, useReadIAssetManager } from '@flarenetwork/flare-wagmi-periphery-package/contracts/coston2'

const FLARE_CONTRACT_REGISTRY_ADDRESS = '0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019';

export function useFxrpAddress() {
  // Get the AssetManagerFXRP address using the generated hook
  const { data: assetManagerAddress } = useReadIFlareContractRegistry({
    address: FLARE_CONTRACT_REGISTRY_ADDRESS,
    functionName: 'getContractAddressByName',
    args: ['AssetManagerFXRP'],
  })

  // Then, get the fAsset (FXRP) address from the AssetManager
  // @ts-expect-error - Type instantiation issue with generated wagmi types
  const { data: fxrpAddress, isLoading, error } = useReadIAssetManager({
    address: assetManagerAddress as `0x${string}` | undefined,
    functionName: 'fAsset',
    query: {
      enabled: !!assetManagerAddress,
    },
  })

  return {
    fxrpAddress: fxrpAddress as `0x${string}` | undefined,
    assetManagerAddress: assetManagerAddress as `0x${string}` | undefined,
    isLoading,
    error
  }
}