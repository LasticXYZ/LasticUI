import { CoreListing } from '@/hooks/useListings'
import { RegionDetail, RegionOwner, RegionsType } from '@/types'
import {
  AsMultiParams,
  CancelledMultisigEvent,
  ExecutedMultisigEvent,
  MultisigStorageInfo,
  MultisigStorageInfoResponse,
  NewMultisigEvent,
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

const LEGACY_ASMULTI_PARAM_LENGTH = 6
const MAX_WEIGHT = {
  refTime: 12000000, // 6096943 was reftime in test scenario for remark tx
  proofSize: 0,
}

export const useMultisigTrading = (signatories: string[], threshold: number) => {
  const { api, activeSigner, activeAccount, activeChain } = useInkathon()

  const getMultisigAddress = () => {
    if (threshold < 2 || signatories.length < 2) return
    // Address as a byte array.
    const multisigPubKey = createKeyMulti(signatories, threshold)

    // Convert byte array to SS58 encoding.
    return _getEncodedAddress(multisigPubKey)
  }
  const multisigAddress = getMultisigAddress()

  const { balance } = useBalance(multisigAddress, true)

  const initiateOrExecuteMultisigTradeCall = async (): Promise<void> => {
    if (!_basicChecks()) return

    // get latest open multisig call
    const latestOpenMultisig = await getLatestOpenMultisig()
    let when = undefined

    // if there is an open multisig call -> execute the trade (add 'when')
    // if there is no open multisig call -> create a new one (no 'when')
    if (latestOpenMultisig) when = latestOpenMultisig.when

    // TODO replace with batch call
    const remarkTx = api!.tx.system.remark(`Lastic multisig creation5`)

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
      const unsub = await asMultiTx.signAndSend(
        activeAccount!.address,
        { signer: activeSigner },
        (result) => {
          if (result.status.isInBlock) {
            console.log(`Transaction included at blockHash ${result.status.asInBlock}`)
            console.log('Tx hash: ' + result.txHash)
          } else if (result.status.isFinalized) {
            unsub()
          }
        },
      )
    } catch (error) {
      throw error
    }
  }

  const getAsMultiTx = ({ tx, when }: AsMultiParams) => {
    if (!api || !activeAccount) return
    const otherSignatories = sortAddresses(
      signatories.filter((sig) => sig !== activeAccount!.address),
    )
    return api.tx.multisig.asMulti.meta.args.length === LEGACY_ASMULTI_PARAM_LENGTH
      ? api.tx.multisig.asMulti(threshold, otherSignatories, when || null, tx, false, MAX_WEIGHT)
      : api.tx.multisig.asMulti(threshold, otherSignatories, when || null, tx, MAX_WEIGHT)
  }

  // temp function to test things
  const getLatestOpenMultisig = async (): Promise<MultisigStorageInfo | undefined> => {
    if (!api) return

    // get all open multisig calls
    const allEntries = await api.query.multisig.multisigs.entries()

    // filter by multisig address
    let filtered = allEntries.filter(([key, _data]) => key.args[0].toHuman() === multisigAddress)

    // Usually it should be max 1 event. If not, use isMultisigCallExecuted & isMultisigCallCancelled functions to find the open one.
    // TODO: filter via cancellations and executions

    // sort descending by block number
    filtered.sort(([_key1, data1], [_key2, data2]) => {
      // convert string to number, e.g. "1,213,918" -> 1213918
      const blocknumber1 = parseInt(
        ((data1.toHuman() as any).when.height as string).replace(/,/g, ''),
      )
      const blocknumber2 = parseInt(
        ((data2.toHuman() as any).when.height as string).replace(/,/g, ''),
      )

      return blocknumber2 - blocknumber1
    })

    /* filtered.forEach(([key, exposure], index) => {
      console.log(
        `keys index ${index}`,
        key.args.map((k) => k.toHuman()),
      )
      console.log(`data index ${index}`, exposure.toHuman())
    }) */

    return filtered[0]
      ? parseMultisigStorageInfo(filtered[0][1].toHuman() as unknown as MultisigStorageInfoResponse)
      : undefined
  }

  /** Get the open multisig events for the current multisig address. Not implemented yet */
  const getOpenMultisigEvents = async (): Promise<NewMultisigEvent[] | null> => {
    // query via 'newMultisigs' all multisig events with current multisig address
    // filter by approver.length == 1 & approver includes
    return null
  }

  /** Get the executed multisig events for the current multisig address. Not implemented yet */
  const getExecutedMultisigEvents = async (): Promise<ExecutedMultisigEvent[] | null> => {
    // query via 'multisigExecuteds' all multisig events with current multisig address
    // if openMultisigEvents.length > 1, you can use this to check which is still open and which already completed. Use timepoint of the executed event and compare it with the timepoint of the open event

    return null
  }

  /** Get the cancelled multisig events for the current multisig address. Not implemented yet */
  const getCancelledMultisigEvents = async (): Promise<CancelledMultisigEvent[] | null> => {
    // query via 'multisigCancelleds' all multisig events with current multisig address
    // if openMultisigEvents.length > 1, you can use this to check which is still open and which already completed. Use timepoint of the cancelled event and compare it with the timepoint of the open event
    return null
  }

  /**
   * Check if the multisig call was already executed.
   * @param multisigCallToCheck - The opened multisig call to check. Make sure to prefilter them by the multisig address.
   * @param events - The executed multisig events. Make sure to prefilter them by the multisig address.
   */
  const isMultisigCallExecuted = (
    multisigCallToCheck: MultisigStorageInfo,
    events: ExecutedMultisigEvent[],
  ): boolean => {
    // Check if any event matches the timepoint of the multisig call to check
    const alreadyExecuted = events.some((executedEvent) => {
      return (
        executedEvent.timepoint.height === multisigCallToCheck.when.height &&
        executedEvent.timepoint.index === multisigCallToCheck.when.index
      )
    })

    return !alreadyExecuted
  }

  /**
   * Check if the multisig call was already cancelled. At the moment, 1 cancellation is sufficent, doesnt matter if the threshold could still be reached.
   * @param multisigCallToCheck - The opened multisig call to check. Make sure to prefilter them by the multisig address.
   * @param events - The cancelled multisig events. Make sure to prefilter them by the multisig address.
   */
  const isMultisigCallCancelled = (
    multisigCallToCheck: MultisigStorageInfo,
    events: CancelledMultisigEvent[],
  ): boolean => {
    // Check if any event matches the timepoint of the multisig call to check
    const alreadyCancelled = events.some((cancelledEvent) => {
      return (
        cancelledEvent.timepoint.height === multisigCallToCheck.when.height &&
        cancelledEvent.timepoint.index === multisigCallToCheck.when.index
      )
    })

    return !alreadyCancelled
  }

  /** Helper function to check if the multisig call is not executed or cancelled. */
  const isMultisigCallOpen = (
    multisigCallToCheck: MultisigStorageInfo,
    cancelEvents: CancelledMultisigEvent[],
    executeEvents: ExecutedMultisigEvent[],
  ) => {
    return (
      !isMultisigCallExecuted(multisigCallToCheck, executeEvents) &&
      !isMultisigCallCancelled(multisigCallToCheck, cancelEvents)
    )
  }

  /**
   * Check if the buyer has sent the funds to the multisig address.
   * @param amount - The balance amount the multisig address currently holds
   * @returns - True if the multisig address holds the amount
   */
  const hasBuyerSentFunds = (amount: BN) => {
    if (balance?.gte(amount)) return true
    return false
  }

  /**
   * Check if the seller has sent the core to the multisig address.
   * @param core - The core listing to check
   * @returns - True if the multisig address holds the core
   */
  const hasSellerSentCore = async (core: CoreListing) => {
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
    tx?.signAndSend(activeAccount!.address, { signer: activeSigner }).then((hash) => {
      console.log(`Core sent to multisig address with hash: ${hash}`)
    })
  }

  /** Sends the funds to the multisig address
   * @param corePrice - The price of the listed core
   */
  const sendFundsToMultisig = async (corePrice: BN) => {
    if (!_basicChecks()) return
    // simple transfer logic
    const transfer = api?.tx.balances.transfer(multisigAddress, corePrice.toString())
    transfer?.signAndSend(activeAccount!.address, { signer: activeSigner }).then((hash) => {
      console.log(`Funds sent to multisig address with hash: ${hash}`)
      // TODO if tx successful track in db. Add multisig signers and that trade is in progress
    })
  }

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

  const _basicChecks = () => {
    if (!api || !activeSigner || !activeAccount || !activeChain) {
      console.error('Error in initializing the API')
      return false
    }
    if (!signatories.includes(activeAccount.address)) {
      console.error('Selected account not part of signatories')
      return false
    }
    if (threshold < 2) {
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
    const multisigAddressBytes = createKeyMulti(signatories, threshold)
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
    getMultisigAddress,
    hasBuyerSentFunds,
    hasSellerSentCore,
    sendCoreToMultisig,
    sendFundsToMultisig,
  }
}
