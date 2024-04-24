import {
  MultisigStorageInfo,
  MultisigStorageInfoResponse,
  parseMultisigStorageInfo,
} from '@/types/ListingsTypes'
import { ApiPromise } from '@polkadot/api'
import { createKeyMulti, encodeAddress } from '@polkadot/util-crypto'
import { SubstrateChain } from '@poppyseed/lastic-sdk'
import {
  getClient,
  MultisigCancelledEvent,
  MultisigExecutedEvent,
  NewMultisigEvent,
} from '@poppyseed/squid-sdk'

export const getEncodedAddress = (
  address: string | Uint8Array,
  activeChain?: SubstrateChain,
  ss58Format?: number,
) => {
  // check if the address is an ethereum address
  if (typeof address === 'string' && address.startsWith('0x') && address.length === 42) {
    console.log('Ethereum address detected, not encoding', address)
    return address.toLowerCase()
  }

  try {
    if (ss58Format) return encodeAddress(address, ss58Format)
    if (!activeChain) return
    return encodeAddress(address, activeChain.ss58Prefix)
  } catch (e) {
    console.error(`Error encoding the address ${address}, skipping`, e)
  }
}

export const calculateMultisigAddress = (
  threshold: number,
  signatories: string[],
  activeChain?: SubstrateChain,
) => {
  if (threshold < 2 || signatories.length < 2) return
  // Address as a byte array.
  const multisigPubKey = createKeyMulti(signatories, threshold)

  // Convert byte array to SS58 encoding.
  return getEncodedAddress(multisigPubKey, activeChain)
}

/** Get opened multisig events for the current multisig address. Note: They can already be executed or cancelled.  */
const getOpenedMultisigEvents = async (
  multisigAddress: string,
  activeRelayChain?: SubstrateChain,
): Promise<NewMultisigEvent[] | null> => {
  const client = getClient()
  if (!activeRelayChain) return null
  const query = client.eventAllNewMultisig()
  const response = await client.fetch(activeRelayChain.network, query)
  let events = response.data.event as NewMultisigEvent[]
  events = events.filter((event) => event.multisig === multisigAddress)

  return events
}

/** Get the executed multisig events for the current multisig address. */
const getExecutedMultisigEvents = async (
  multisigAddress: string,
  activeRelayChain?: SubstrateChain,
): Promise<MultisigExecutedEvent[] | null> => {
  const client = getClient()
  if (!activeRelayChain) return null
  const query = client.eventAllMultisigExecuted()
  const response = await client.fetch(activeRelayChain.network, query)
  let events = response.data.event as MultisigExecutedEvent[]
  events = events.filter((event) => event.multisig === multisigAddress)

  return events
}

/** Get the cancelled multisig events for the current multisig address. */
const getCancelledMultisigEvents = async (
  multisigAddress: string,
  activeRelayChain?: SubstrateChain,
): Promise<MultisigCancelledEvent[] | null> => {
  const client = getClient()
  if (!activeRelayChain) return null
  const query = client.eventAllMultisigCancelled()
  const response = await client.fetch(activeRelayChain.network, query)
  let events = response.data.event as MultisigCancelledEvent[]
  events = events.filter((event) => event.multisig === multisigAddress)

  return events
}

/**
 * Check if the multisig call was already executed.
 * @param multisigCallToCheck - The opened multisig call to check. Make sure to prefilter it by the multisig address.
 * @param events - The executed multisig events. Make sure to prefilter them by the multisig address.
 */
const isMultisigCallExecuted = (
  multisigCallToCheck: MultisigStorageInfo,
  events: MultisigExecutedEvent[],
): boolean => {
  return events.some(
    (executedEvent) =>
      executedEvent.timepoint.height === multisigCallToCheck.when.height &&
      executedEvent.timepoint.index === multisigCallToCheck.when.index,
  )
}

/**
 * Check if the multisig call was already cancelled. At the moment, 1 cancellation is sufficent, doesnt matter if the threshold could still be reached.
 * @param multisigCallToCheck - The opened multisig call to check. Make sure to prefilter it by the multisig address.
 * @param events - The cancelled multisig events. Make sure to prefilter them by the multisig address.
 */
const isMultisigCallCancelled = (
  multisigCallToCheck: MultisigStorageInfo,
  events: MultisigCancelledEvent[],
): boolean => {
  // Check if any event matches the timepoint of the multisig call to check
  return events.some((cancelledEvent) => {
    cancelledEvent.timepoint.height === multisigCallToCheck.when.height &&
      cancelledEvent.timepoint.index === multisigCallToCheck.when.index
  })
}

/** Helper function to check if the multisig call is not executed or cancelled. */
const isMultisigCallStillOpen = (
  multisigCallToCheck: MultisigStorageInfo,
  cancelEvents: MultisigCancelledEvent[],
  executeEvents: MultisigExecutedEvent[],
) => {
  return (
    !isMultisigCallExecuted(multisigCallToCheck, executeEvents) &&
    !isMultisigCallCancelled(multisigCallToCheck, cancelEvents)
  )
}

/**
 * Get all open multisig calls for the current multisig address. It checks also if the multisig call was already executed or cancelled.
 * @returns - The open multisig calls
 */
export const getAllOpenMultisigCalls = async (
  multisigAddress: string,
  api?: ApiPromise,
  activeRelayChain?: SubstrateChain,
): Promise<MultisigStorageInfo[] | undefined> => {
  if (!api) return

  // get all open multisig calls
  const allEntries = await api.query.multisig.multisigs.entries()

  // filter by multisig address
  let filtered = allEntries.filter(([key, _data]) => key.args[0].toHuman() === multisigAddress)

  // filter out executed and cancelled events
  const executedEvents = await getExecutedMultisigEvents(multisigAddress, activeRelayChain)
  const cancelledEvents = await getCancelledMultisigEvents(multisigAddress, activeRelayChain)
  filtered = filtered.filter(([_key, data]) =>
    isMultisigCallStillOpen(
      parseMultisigStorageInfo(data.toHuman() as unknown as MultisigStorageInfoResponse),
      cancelledEvents || [],
      executedEvents || [],
    ),
  )

  // parse the filtered multisig calls
  const openCalls = filtered.map(([_key, data]) =>
    parseMultisigStorageInfo(data.toHuman() as unknown as MultisigStorageInfoResponse),
  )

  return openCalls
}
