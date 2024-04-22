import { CoreListing } from '@/hooks/useListings'
import { RegionDetail, RegionOwner, RegionsType } from '@/types'
import {
  AsMultiParams,
  MultisigStorageInfo,
  MultisigStorageInfoResponse,
  parseMultisigStorageInfo,
} from '@/types/ListingsTypes'
import { BN } from '@polkadot/util'
import {
  blake2AsHex,
  createKeyMulti,
  decodeAddress,
  encodeAddress,
  sortAddresses,
  xxhashAsHex,
} from '@polkadot/util-crypto'
import { useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import {
  getClient,
  MultisigCancelledEvent,
  MultisigExecutedEvent,
  NewMultisigEvent,
} from '@poppyseed/squid-sdk'
import { useEffect, useState } from 'react'

const LEGACY_ASMULTI_PARAM_LENGTH = 6
const MAX_WEIGHT = {
  refTime: 12000000, // 6096943 was reftime in test scenario for remark tx
  proofSize: 0,
}

const THRESHOLD = 2 // always 2 out of 3 signatories
const LASTIC_ADDRESS = '5GByzRyonPJC4kLg8dRenszsZD25dFjdJRCVCyfLkQ52HDev' //test 3; TODO: add to env

export const useMultisigTrading = (
  sellerAddress: string,
  buyerAddress: string,
  core: CoreListing,
) => {
  const { api, activeSigner, activeAccount, activeChain, activeRelayChain } = useInkathon()
  const client = getClient()
  const [isLoading, setIsLoading] = useState(false)
  const [txStatusMessage, setTxStatusMessage] = useState<string>('')

  useEffect(() => {
    setTxStatusMessage('')
  }, [core])

  const signatories = [sellerAddress, buyerAddress, LASTIC_ADDRESS]

  const _getEncodedAddress = (address: string | Uint8Array, ss58Format?: number) => {
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
  const getMultisigAddress = () => {
    if (THRESHOLD < 2 || signatories.length < 2) return
    // Address as a byte array.
    const multisigPubKey = createKeyMulti(signatories, THRESHOLD)

    // Convert byte array to SS58 encoding.
    return _getEncodedAddress(multisigPubKey)
  }
  const multisigAddress = getMultisigAddress()
  const { balance } = useBalance(multisigAddress, true)

  const initiateOrExecuteMultisigTradeCall = async (): Promise<void> => {
    if (!_basicChecks()) return
    let when = undefined

    // get latest open multisig call
    // if there is 1 open multisig call -> execute the trade (add 'when')
    // if there is no open multisig call -> create a new one (no 'when')
    // if there are more than 1 open multisig calls -> find the right one and execute it (hard)
    const openMultisigCalls = await getAllOpenMultisigCalls()

    if (openMultisigCalls && openMultisigCalls?.length === 1) {
      when = openMultisigCalls[0].when
    } else if (openMultisigCalls && openMultisigCalls?.length > 1) {
      // TODO find the right open multisig call to execute. Suggestion: Use timepoint stored in DB.
    }

    // TODO replace with batch call
    const remarkTx = api!.tx.system.remark(`Lastic multisig creation5`)

    // Batch example
    /* const txs = [
      api.tx.balances.transfer(addrBob, 12345),
      api.tx.balances.transfer(addrEve, 12345),
      api.tx.staking.unbond(12345),
    ]

    // construct the batch and send the transactions
    api.tx.utility.batch(txs).signAndSend(sender, ({ status }) => {
      if (status.isInBlock) {
        console.log(`included in ${status.asInBlock}`)
      }
    }) */

    // create the multisig call
    const asMultiTx = getAsMultiTx({
      tx: remarkTx,
      when,
    })

    if (!asMultiTx) {
      console.error('Error in creating the multisig call')
      return
    }
    try {
      setIsLoading(true)
      const unsub = await asMultiTx.signAndSend(
        activeAccount!.address,
        { signer: activeSigner },
        (result) => {
          setTxStatusMessage(result.status.type)
          if (result.status.isInBlock) {
            console.log(`Transaction included at blockHash ${result.status.asInBlock}`)
            console.log('Tx hash: ' + result.txHash)
            setTxStatusMessage('Multisig call included in block')
          } else if (result.status.isFinalized) {
            setTxStatusMessage('Multisig call finalized')
            // TODO: If new initiate, Fetch timepoint and update in db. Enables to have multiple trades in same address at once.
            unsub()
          }
        },
      )
    } catch (error: unknown) {
      if (error instanceof Error)
        setTxStatusMessage('Error in executing the multisig call: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const getAsMultiTx = ({ tx, when }: AsMultiParams) => {
    if (!api || !activeAccount) return
    const otherSignatories = sortAddresses(
      signatories.filter((sig) => sig !== activeAccount!.address),
    )
    return api.tx.multisig.asMulti.meta.args.length === LEGACY_ASMULTI_PARAM_LENGTH
      ? api.tx.multisig.asMulti(THRESHOLD, otherSignatories, when || null, tx, false, MAX_WEIGHT)
      : api.tx.multisig.asMulti(THRESHOLD, otherSignatories, when || null, tx, MAX_WEIGHT)
  }

  /**
   * Get all open multisig calls for the current multisig address. It checks also if the multisig call was already executed or cancelled.
   * @returns - The open multisig calls
   */
  const getAllOpenMultisigCalls = async (): Promise<MultisigStorageInfo[] | undefined> => {
    if (!api) return

    // get all open multisig calls
    const allEntries = await api.query.multisig.multisigs.entries()

    // filter by multisig address
    let filtered = allEntries.filter(([key, _data]) => key.args[0].toHuman() === multisigAddress)

    // filter out executed and cancelled events
    const executedEvents = await getExecutedMultisigEvents()
    const cancelledEvents = await getCancelledMultisigEvents()
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

  /** Get opened multisig events for the current multisig address. Note: They can already be executed or cancelled.  */
  const getOpenedMultisigEvents = async (): Promise<NewMultisigEvent[] | null> => {
    if (!activeRelayChain) return null
    const query = client.eventAllNewMultisig()
    const response = await client.fetch(activeRelayChain.network, query)
    let events = response.data.event as NewMultisigEvent[]
    events = events.filter((event) => event.multisig === multisigAddress)

    return events
  }

  /** Get the executed multisig events for the current multisig address. */
  const getExecutedMultisigEvents = async (): Promise<MultisigExecutedEvent[] | null> => {
    if (!activeRelayChain) return null
    const query = client.eventAllMultisigExecuted()
    const response = await client.fetch(activeRelayChain.network, query)
    let events = response.data.event as MultisigExecutedEvent[]
    events = events.filter((event) => event.multisig === multisigAddress)

    return events
  }

  /** Get the cancelled multisig events for the current multisig address. */
  const getCancelledMultisigEvents = async (): Promise<MultisigCancelledEvent[] | null> => {
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
   * Check if the multisig address currently holds the core price as balance.
   * @param amount - The balance amount the multisig address should hold
   * @returns - True if the multisig address holds the amount
   */
  const hasMultisigAddressTheCoreFunds = () => {
    if (balance?.gte(new BN(core.cost.toString()))) return true
    return false
  }

  /**
   * Check if the multisig address currently holds the listed core.
   * @param core - The core listing to check
   * @returns - True if the multisig address holds the core
   */
  const hasMultisigAddressTheListedCore = async () => {
    // fetch multisig regions
    const entries = await api?.query.broker.regions.entries()
    const regions: RegionsType | undefined = entries?.map(([key, value]) => {
      const detail = key.toHuman() as RegionDetail
      const owner = value.toHuman() as RegionOwner
      return { detail, owner }
    })
    const filteredRegions = regions?.filter((region) => region.owner.owner === multisigAddress)

    // check if the multisig address has the core
    return filteredRegions?.some((region) => {
      const regionDetail = region.detail[0]
      regionDetail.core === core.coreNumber.toString() &&
        regionDetail.begin === core.begin &&
        regionDetail.mask === core.mask
    })
  }

  /** Sends the core to the multisig address
   * @param core - The core listed to trade
   */
  const sendCoreToMultisig = async (core: CoreListing) => {
    if (!_basicChecks()) return
    const tx = api?.tx.broker.transfer(
      { begin: core.begin, core: core.coreNumber, mask: core.mask },
      multisigAddress,
    )
    try {
      tx?.signAndSend(activeAccount!.address, { signer: activeSigner }, (result) => {
        setTxStatusMessage(result.status.type)
        if (result.status.isInBlock) {
          console.log(`Transaction included at blockHash ${result.status.asInBlock}`)
          console.log('Tx hash: ' + result.txHash)
          setTxStatusMessage('Core sent and tx included in block')
        } else if (result.status.isFinalized) {
          setTxStatusMessage('Core sent and tx finalized')
        }
      })
    } catch (error: unknown) {
      if (error instanceof Error) setTxStatusMessage('Error sending the core: ' + error.message)
    }
  }

  /** Sends the funds to the multisig address
   * @param corePrice - The price of the listed core
   */
  const sendFundsToMultisig = async (corePrice: BN) => {
    if (!_basicChecks()) return
    // simple transfer logic
    const transfer = api?.tx.balances.transfer(multisigAddress, corePrice.toString())

    transfer?.signAndSend(activeAccount!.address, { signer: activeSigner }, (result) => {
      setTxStatusMessage(result.status.type)
      if (result.status.isInBlock) {
        console.log(`Transaction included at blockHash ${result.status.asInBlock}`)
        console.log('Tx hash: ' + result.txHash)
        setTxStatusMessage('Funds sent and tx included in block')
      } else if (result.status.isFinalized) {
        setTxStatusMessage('Funds sent and tx finalized')
        // TODO if tx successful, track in db. Add multisig signers and that trade is in progress
      }
    })
  }

  const _basicChecks = () => {
    if (!api || !activeSigner || !activeAccount || !activeChain) {
      console.error('Error in initializing the API')
      return false
    }
    if (!signatories.includes(activeAccount.address)) {
      console.error('Selected account not part of signatories')
      return false
    }
    if (THRESHOLD < 2) {
      console.error('Threshold must be at least 2')
      return false
    }
    return true
  }

  /**
   * The following function is used to get the block number and index of a multisig call.
   * @remarks
   * It reads the rpc storage directly to get the multisig call information. The same is done by the PJS team here: https://github.com/paritytech/txwrapper-core/blob/768bb445beb2907582b2d5e13ade3be5d995af3e/packages/txwrapper-examples/multisig/src/multisig.ts#L171
   * This function works but the Subsquid query provides a wrong call hash so the created storageKey is wrong. So use the getTimepoint() function for now instead.
   */
  const _getMultisigTimepointByStorageRead = async () => {
    const multisigAddressBytes = createKeyMulti(signatories, THRESHOLD)
    const multisigAddress = _getEncodedAddress(multisigAddressBytes)

    // 1. Creating the Storage key of our Multisig Storage item following the schema below :
    // Twox128("Multisig") + Twox128("Multisigs") + Twox64(multisigAddress) + multisigAddress + Blake128(multisigCallHash) + multisigCallHash
    const multisigModuleHash = xxhashAsHex('Multisig', 128)
    const multisigStorageHash = xxhashAsHex('Multisigs', 128)
    const multisigCall = '0xc444aa35ff6443f8c3a7c256c32656e934db465e4cd1220d476f592603733394' // TODO find a way to fetch it somewhere

    const multisigAddressHash = xxhashAsHex(decodeAddress(multisigAddress), 64)
    const multisigCallHash = blake2AsHex(multisigCall, 128)
    const multisigAddressInHex = Buffer.from(multisigAddressBytes).toString('hex')

    const multisigStorageKey =
      multisigModuleHash +
      multisigStorageHash.substring(2) +
      multisigAddressHash.substring(2) +
      multisigAddressInHex +
      multisigCallHash.substring(2) +
      multisigCall.substring(2)

    // correct storage key
    /* console.log(
      '0x7474449cca95dc5d0c00e71735a6d17d3cd15a3fd6e04e47bee3922dbfa92c8dbdbba0c80974cc914e19f599aa928e59b47b76460bc3537a8fbbaa2cff932addbefe18876fb32c7e46d861b81bed59335506089328585a33c444aa35ff6443f8c3a7c256c32656e934db465e4cd1220d476f592603733394',
    ) */
    // generated storage key
    // console.log(multisigStorageKey)

    // 2. Making an RPC request with the `state_getStorage` endpoint to retrieve the SCALE-encoded Multisig storage data from the chain under the key `multisigStorageKey`.
    const multisigStorage = await api?.rpc.state.getStorage(multisigStorageKey)
    console.log('Multisig storage: ', multisigStorage)

    // 3. Creating the Multisig type using the registry and the result from our RPC call
    const multisigType = api?.createType('PalletMultisigMultisig', multisigStorage)
    console.log('Multisig type: ', multisigType)

    /* const multisigCallIndex = (multisigType as any).when.index.toNumber()
    console.log('Multisig call index: ', multisigCallIndex)

    const multisigCallHeight = (multisigType as any).when.height.toNumber()
    console.log('Multisig call height: ', multisigCallHeight) */
  }

  return {
    initiateOrExecuteMultisigTradeCall,
    multisigAddress,
    hasMultisigAddressTheCoreFunds,
    hasMultisigAddressTheListedCore,
    sendCoreToMultisig,
    sendFundsToMultisig,
    txStatusMessage,
    isLoading,
    lasticAddress: LASTIC_ADDRESS,
  }
}
