import { useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import { Builder } from '@poppyseed/xcm-sdk'
import { useEffect } from 'react'

export const useTeleport = () => {
  const { api, relayApi, activeAccount, activeChain, activeRelayChain, activeSigner } =
    useInkathon()

  const { balanceFormatted, balance, tokenSymbol, tokenDecimals } = useBalance(
    activeAccount?.address,
    true,
  )

  const teleportToRelay = async (amount: string | number | bigint) => {
    if (!activeAccount) return

    const call = await Builder(api)
      .from('CoretimeKusama')
      .amount(amount)
      .address(activeAccount.address)
      .build()
  }

  const teleportToCoretimeChain = async (amount: string | number | bigint) => {
    if (!activeAccount) return

    const call = await Builder(relayApi)
      .to('CoretimeKusama')
      .amount(amount)
      .address(activeAccount.address)
      .build()
  }

  useEffect(() => {
    const fetchData = async () => {}

    fetchData()
  }, [])

  return null
}
