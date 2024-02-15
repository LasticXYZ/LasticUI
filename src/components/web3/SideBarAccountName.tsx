import { toShortAddress } from '@/utils/account/token'
import { SupportedChainId } from '@azns/resolver-core'
import { useResolveAddressToDomain } from '@azns/resolver-react'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { useMemo } from 'react'

export const SideBarAccountName = () => {
  const { activeAccount, activeChain } = useInkathon()
  const doResolveAddress = useMemo(
    () => Object.values(SupportedChainId).includes(activeChain?.network as SupportedChainId),
    [activeChain?.network],
  )
  const { primaryDomain } = useResolveAddressToDomain(
    doResolveAddress ? activeAccount?.address : undefined,
    {
      chainId: activeChain?.network,
      debug: true,
    },
  )
  //console.log("Address:", account.address);
  //console.log("ss58Prefix:", activeChain?.ss58Prefix);

  return (
    <>
      <div className="flex font-bold text-sm py-1">Connected to: {activeChain?.name}</div>
      <div className="flex font-bold text-sm py-1">
        Name: {primaryDomain || activeAccount?.name}
      </div>
      <div className="flex font-bold text-sm py-1">
        Address: {toShortAddress(activeAccount?.address, 6)}
      </div>
    </>
  )
}
