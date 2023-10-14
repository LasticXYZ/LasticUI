import { SupportedChainId } from '@azns/resolver-core'
import { useResolveAddressToDomain } from '@azns/resolver-react'
import { InjectedAccount } from '@polkadot/extension-inject/types'
import {
  useInkathon,
} from '@scio-labs/use-inkathon'
import { FC, useMemo } from 'react'

export interface AccountNameProps {
  account: InjectedAccount
}

export const AccountName: FC<AccountNameProps> = ({ account, ...rest }) => {
    const { activeChain } = useInkathon()
    const doResolveAddress = useMemo(
      () => Object.values(SupportedChainId).includes(activeChain?.network as SupportedChainId),
      [activeChain?.network],
    )
    const { primaryDomain } = useResolveAddressToDomain(
      doResolveAddress ? account?.address : undefined,
      {
        chainId: activeChain?.network,
        debug: true,
      },
    )
    //console.log("Address:", account.address);
    //console.log("ss58Prefix:", activeChain?.ss58Prefix);
    
    return (
      <p className="flex font-mono font-bold text-sm uppercase">
        {primaryDomain || account.name}
      </p>
    )
  }
  