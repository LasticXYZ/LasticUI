import { parseNativeTokenToHuman, toShortAddress } from '@/utils/account/token'
import { SupportedChainId } from '@azns/resolver-core'
import { useResolveAddressToDomain } from '@azns/resolver-react'
import { UserIcon, WalletIcon } from '@heroicons/react/24/solid'
import { useBalance, useInkathon, useRelayBalance } from '@poppyseed/lastic-sdk'
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
  const { freeBalance, tokenSymbol, tokenDecimals } = useBalance(activeAccount?.address, true)
  const { freeBalance: freeRelayBalance } = useRelayBalance(activeAccount?.address, true)

  const coreBalance = parseNativeTokenToHuman({
    paid: freeBalance?.toString(),
    decimals: tokenDecimals,
    reduceDecimals: 2,
  })
  const relayBalance = parseNativeTokenToHuman({
    paid: freeRelayBalance?.toString(),
    decimals: tokenDecimals,
    reduceDecimals: 2,
  })

  if (!activeAccount) {
    return null
  }

  return (
    <div>
      <div className="text-gray-8 border-t border-gray-9 mt-10 font-montserrat text-xs font-semibold px-4 pt-6">
        ACCOUNT
      </div>
      <div className="mt-2 text-gray-18 flex flex-col px-2">
        <div className="py-3 px-2 text-l text-gray-19 flex flex-row items-center font-semibold transition duration-150 ease-in-out">
          <span className="px-2">
            <UserIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          {primaryDomain || activeAccount?.name}
        </div>
        <div className="py-3 px-2 text-l text-gray-19 flex flex-row items-center font-semibold transition duration-150 ease-in-out">
          <span className="px-2">
            <WalletIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          {toShortAddress(activeAccount?.address, 6)}
        </div>
      </div>
      <div>
        <div className="text-gray-8 border-t border-gray-9 mt-10 font-montserrat text-xs font-semibold px-4 pt-6">
          BALANCES
        </div>
        <div className="mt-2 ml-2 text-gray-18 flex flex-col px-2">
          <table className="w-full text-md">
            <tbody>
              <tr>
                <td className="py-1">Coretime Chain:</td>
                <td className="text-right">
                  {coreBalance} {tokenSymbol}
                </td>
              </tr>
              <tr>
                <td className="py-1">Relay Chain Balance:</td>
                <td className="text-right">
                  {relayBalance} {tokenSymbol}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
