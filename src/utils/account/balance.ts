import { InjectedAccount } from '@polkadot/extension-inject/types'
import { useBalance, useRelayBalance } from '@poppyseed/lastic-sdk'
import { parseNativeTokenToHuman } from './token'

export function useFreeRelayBalance({ activeAccount }: { activeAccount: InjectedAccount }) {
  const { freeBalance: freeRelayBalance, tokenDecimals } = useRelayBalance(
    activeAccount?.address,
    true,
  )

  const relayBalance = parseNativeTokenToHuman({
    paid: freeRelayBalance?.toString(),
    decimals: tokenDecimals,
    reduceDecimals: 2,
  })

  return relayBalance
}

export function useFreeCoretimeBalance({ activeAccount }: { activeAccount: InjectedAccount }) {
  const { freeBalance, tokenDecimals } = useBalance(activeAccount?.address, true)

  const coreBalance = parseNativeTokenToHuman({
    paid: freeBalance?.toString(),
    decimals: tokenDecimals,
    reduceDecimals: 2,
  })

  return coreBalance
}
