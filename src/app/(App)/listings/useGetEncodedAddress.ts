import { encodeAddress } from '@polkadot/util-crypto'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { useCallback } from 'react'

export const encodesubstrateAddress = (address: string | Uint8Array, ss58Format?: number) => {
  // this looks like an ethereum account, do not encode
  if (typeof address === 'string' && address.startsWith('0x') && address.length === 42) {
    // console.log('Ethereum address detected, not encoding', address)
    return address.toLowerCase()
  }

  try {
    return encodeAddress(address, ss58Format)
  } catch (e) {
    console.error(`Error encoding the address ${address}, skipping`, e)
  }
}

export const useGetEncodedAddress = () => {
  const { activeChain } = useInkathon()


  const getEncodedAddress = useCallback(
    (address: string | Uint8Array | undefined) => {
      if (!activeChain || !address || address === 'undefined') {
        return
      }
      return encodesubstrateAddress(address, activeChain?.ss58Prefix)
    },
    [activeChain]
  )

  return getEncodedAddress
}
