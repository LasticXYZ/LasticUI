import { createKeyMulti } from '@polkadot/util-crypto'
import { useMemo } from 'react'
import { useGetEncodedAddress } from './useGetEncodedAddress'

export const useGetMultisigAddress = (signatories: string[], threshold?: number | null) => {
  const getEncodedAddress = useGetEncodedAddress()

  const newMultisigPubKey = useMemo(() => {
    if (!threshold) return
    return createKeyMulti(signatories, threshold)
  }, [signatories, threshold])
  const newMultisigAddress = useMemo(
    () => getEncodedAddress(newMultisigPubKey),
    [getEncodedAddress, newMultisigPubKey],
  )

  return newMultisigAddress
}
