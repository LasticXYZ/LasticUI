import { parseHNStringToString } from '@/utils/broker/blockTime'
import { ApiPromise } from '@polkadot/api'
import { ParachainInfo, ParachainState } from '../../hooks/useParachainInfo'

// Fetches the list of currently active parachains.
export const getActiveParachains = async (
  api?: ApiPromise,
  relayApi?: ApiPromise,
): Promise<number[]> => {
  if (!api || !relayApi) return []

  const workloadEntries = await api.query.broker.workload.entries()
  return workloadEntries
    .map(([, value]) => (value.toJSON() as any)[0].assignment.task)
    .filter((task) => task !== undefined)
}

// Fetches the list of parachains that are in the workplan.
export const getWorkplanParachains = async (
  api?: ApiPromise,
  relayApi?: ApiPromise,
): Promise<number[]> => {
  if (!api || !relayApi) return []

  const workplanEntries = await api.query.broker.workplan.entries()
  return workplanEntries
    .map(([, value]) => (value.toJSON() as any)[0].assignment.task)
    .filter((task) => task !== undefined)
}

// Fetches the list of parachains that are currently lease holding.
export const getLeaseHoldingParachains = async (
  api: ApiPromise,
  relayApi?: ApiPromise,
): Promise<number[]> => {
  if (!api || !relayApi) return []

  const leases = await api.query.broker.leases()
  return (leases.toJSON() as Array<{ until: number; task: number }>).map((lease) => lease.task)
}

// Fetches the list of system parachains.
export const getSystemParachains = async (
  api?: ApiPromise,
  relayApi?: ApiPromise,
): Promise<number[]> => {
  if (!api || !relayApi) return []

  const reservations = await api.query.broker.reservations()
  return (reservations.toJSON() as Array<any>)
    .map((entry) => entry[0])
    .filter((lease) => lease.assignment.task)
    .map((lease) => lease.assignment.task)
}

// Fetches the list of all parachains and their states.
export const fetchAllParachains = async (
  network: string,
  api?: ApiPromise,
  relayApi?: ApiPromise,
): Promise<ParachainInfo[]> => {
  if (!api || !relayApi) return []

  const parachainLifecycles = await relayApi.query.paras.paraLifecycles.entries()
  const activeParas = await getActiveParachains(api, relayApi)
  const workplanParas = await getWorkplanParachains(api, relayApi)
  const leaseHoldingParas = await getLeaseHoldingParachains(api, relayApi)
  const systemParas = await getSystemParachains(api, relayApi)

  return parachainLifecycles.map(([key, value]) => {
    const [strId] = key.toHuman() as [string]
    const paraId = parseInt(strId.replace(/,/g, ''))
    const strState = value.toString()
    const state = systemParas.includes(paraId)
      ? ParachainState.SYSTEM
      : leaseHoldingParas.includes(paraId)
        ? ParachainState.LEASE_HOLDING
        : strState === 'Onboarding'
          ? ParachainState.ONBOARDING
          : activeParas.includes(paraId)
            ? ParachainState.ACTIVE_PARA
            : workplanParas.includes(paraId)
              ? ParachainState.IN_WORKPLAN
              : strState === 'Parathread'
                ? ParachainState.ONDEMAND_PARACHAIN
                : ParachainState.IDLE_PARA

    return { paraId, state, network }
  })
}

// Fetches the list of reserved parachains.
export const getReservedParachains = async (
  activeAccount: any,
  api?: ApiPromise,
  relayApi?: ApiPromise,
): Promise<ParachainInfo[]> => {
  if (!relayApi) return []

  const records = await relayApi.query.registrar.paras.entries()
  return records
    .map(([key, value]) => {
      const paraId = parseInt(parseHNStringToString((key.toHuman() as any)[0]))
      const { manager } = value.toJSON() as any
      return manager === activeAccount?.address
        ? { paraId, state: ParachainState.RESERVED, network: '' }
        : null
    })
    .filter((parachain) => parachain !== null) as ParachainInfo[]
}

// Fetches the next available parachain ID on the relay chain.
export const fetchNextParachainId = async (
  setNextParaId: (id: number) => void,
  api?: ApiPromise,
  relayApi?: ApiPromise,
) => {
  if (!relayApi) return
  const idRaw = await relayApi.query.registrar.nextFreeParaId()
  setNextParaId(idRaw.toPrimitive() as number)
}

// Fetches the reservation cost for parachains.
export const fetchReservationCost = async (
  setReservationCost: (cost: string) => void,
  api?: ApiPromise,
  relayApi?: ApiPromise,
) => {
  if (!relayApi) return
  setReservationCost(relayApi.consts.registrar.paraDeposit.toString())
}

// Fetches registration constants such as data deposit per byte and maximum code size.
export const fetchRegistrationConstants = async (
  setDataDepositPerByte: (value: bigint) => void,
  setMaxCodeSize: (value: bigint) => void,
  api?: ApiPromise,
  relayApi?: ApiPromise,
) => {
  if (!relayApi) return
  setDataDepositPerByte(BigInt(relayApi.consts.registrar.dataDepositPerByte.toString()))
  const { maxCodeSize } = (await relayApi.query.configuration.activeConfig()).toJSON() as any
  setMaxCodeSize(BigInt(maxCodeSize))
}
