import { getChainFromPath } from '@/utils/common/chainPath'
import {
  fetchAllParachains,
  fetchNextParachainId,
  fetchRegistrationConstants,
  fetchReservationCost,
  getReservedParachains,
} from '@/utils/parachain/parachainUtils'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export type ParachainInfo = {
  paraId: number
  state: ParachainState
  network: string
}

export enum ParachainState {
  SYSTEM = 'System Chain',
  ACTIVE_PARA = 'Currently Active',
  IDLE_PARA = 'Idle Chain',
  RESERVED = 'Reserved',
  ONBOARDING = 'Onboarding',
  ONDEMAND_PARACHAIN = 'Parathread',
  IN_WORKPLAN = 'Idle(In workplan)',
  LEASE_HOLDING = 'Holding Slot',
}

export const useParachainInfo = () => {
  const [loading, setLoading] = useState(false)
  const [parachains, setParachains] = useState<ParachainInfo[]>([])
  const [nextParaId, setNextParaId] = useState<number>(0)
  const [reservationCost, setReservationCost] = useState<string>('0')
  const [dataDepositPerByte, setDataDepositPerByte] = useState(BigInt(0))
  const [maxCodeSize, setMaxCodeSize] = useState(BigInt(0))

  const { api, relayApi, activeAccount } = useInkathon()
  const pathname = usePathname()
  const network = getChainFromPath(pathname)

  const fetchParachainStates = useCallback(async () => {
    setLoading(true)
    await Promise.all([
      fetchNextParachainId(setNextParaId, api, relayApi),
      fetchReservationCost(setReservationCost, api, relayApi),
      fetchRegistrationConstants(setDataDepositPerByte, setMaxCodeSize, api, relayApi),
    ])

    const allParachains = await fetchAllParachains(network, api, relayApi)
    const reservedParachains = await getReservedParachains(activeAccount, api, relayApi)

    const uniqueParachains = [
      ...allParachains,
      ...reservedParachains.filter(
        (reserved) => !allParachains.some((para) => para.paraId === reserved.paraId),
      ),
    ].sort((a, b) => a.paraId - b.paraId)

    setParachains(uniqueParachains)
    setLoading(false)
  }, [api, relayApi, activeAccount, network])

  useEffect(() => {
    fetchParachainStates()
  }, [fetchParachainStates])

  return {
    loading,
    parachains,
    nextParaId,
    reservationCost,
    dataDepositPerByte,
    maxCodeSize,
    fetchParachainStates,
  }
}
