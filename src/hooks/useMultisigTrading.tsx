import { MultisigStorageInfo } from '@/types/ListingsTypes'
import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { Weight } from '@polkadot/types/interfaces'
import { ISubmittableResult } from '@polkadot/types/types'
import { BN } from '@polkadot/util'
import {
  blake2AsHex,
  createKeyMulti,
  decodeAddress,
  encodeAddress,
  sortAddresses,
  xxhashAsHex,
} from '@polkadot/util-crypto'
import { useInkathon } from '@poppyseed/lastic-sdk'

interface NewMultisigEvent {
  blocknumber: number
  approving: string
  callHash: string
  id: string
  multisig: string
  timestamp: string
}

interface ExecutedMultisigEvent {
  id: string
  approving: string
  blockNumber: number
  callHash: string
  multisig: string
  timepoint: {
    height: number
    index: number
  }
  timestamp: string
}

interface CancelledMultisigEvent {
  id: string
  cancelling: string
  blockNumber: number
  callHash: string
  multisig: string
  timepoint: {
    height: number
    index: number
  }
  timestamp: string
}

interface Params {
  api: ApiPromise
  threshold: number
  otherSignatories: string[]
  tx?: SubmittableExtrinsic<'promise', ISubmittableResult>
  weight?: Weight
  when?: MultisigStorageInfo['when']
}

const LEGACY_ASMULTI_PARAM_LENGTH = 6

export const useMultisigTrading = (signatories: string[], threshold: number) => {
  const { api, activeSigner, activeAccount, activeChain } = useInkathon()

  const initiateMultisigTradeCall = async (): Promise<void> => {
    // checks
    if (!api || !activeSigner || !activeAccount || !activeChain)
      throw new Error('Error in initializing the API')
    if (!signatories.includes(activeAccount.address)) {
      throw new Error('Selected account not part of signatories')
    }
    if (threshold < 2) {
      throw new Error('Threshold is invalid')
    }

    // prepare the multisig creation
    const otherSignatories = sortAddresses(
      signatories.filter((sig) => sig !== activeAccount.address),
    )

    // TODO replace with batch call
    const remarkTx = api.tx.system.remark(`Lastic multisig creation`)
    console.log('Remark tx: ', remarkTx.hash.toHex())

    const asMultiTx = getAsMultiTx({ api, threshold, otherSignatories, tx: remarkTx })

    // getMultisigs(signatories, threshold)

    /*  try {
      const unsub = await asMultiTx.signAndSend(
        activeAccount.address,
        { signer: activeSigner },
        (result) => {
          if (result.status.isInBlock) {
            console.log(`Transaction included at blockHash ${result.status.asInBlock}`)
          } else if (result.status.isFinalized) {
            console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`)
            unsub()
          }
        },
      )
    } catch (error) {
      throw error
    } */
  }

  const getAsMultiTx = ({ api, threshold, otherSignatories, tx, weight, when }: Params) => {
    return api.tx.multisig.asMulti.meta.args.length === LEGACY_ASMULTI_PARAM_LENGTH
      ? api.tx.multisig.asMulti(threshold, otherSignatories, when || null, tx, false, weight || 0)
      : api.tx.multisig.asMulti(
          threshold,
          otherSignatories,
          when || null,
          tx,
          weight || {
            refTime: 0,
            proofSize: 0,
          },
        )
  }

  // temp function to test things
  const getMultisigs = async () => {
    if (!api) return

    const multisigAddress = getMultisigAddress()

    console.log('Multisig address: ', multisigAddress)

    // get all open multisig calls
    const allEntries = await api.query.multisig.multisigs.entries()
    allEntries.forEach(([key, exposure]) => {
      console.log(
        'key arguments:',
        key.args.map((k) => k.toHuman()),
      )
      console.log('     exposure:', exposure.toHuman())
    })

    const multisigInfo = await api.query.multisig.multisigs(
      '5Dq7JZwfd3Jv8PnuKe4B73ZDCUY4kQiE2UrD9kJybbqtRxp5',
      0,
    )

    console.log('Multisig info123: ', multisigInfo)

    /* const multisigType = api?.createType('PalletMultisigMultisig', multisigInfo)
    const multisigCallIndex = multisigType.toHuman()
    console.log('Multisig call index: ', multisigCallIndex) */

    const multisigStorage = await api?.rpc.state.getStorage(
      '0x7474449cca95dc5d0c00e71735a6d17d3cd15a3fd6e04e47bee3922dbfa92c8dbdbba0c80974cc914e19f599aa928e59b47b76460bc3537a8fbbaa2cff932addbefe18876fb32c7e46d861b81bed59335506089328585a33c444aa35ff6443f8c3a7c256c32656e934db465e4cd1220d476f592603733394',
    )

    const multisigType2 = api?.createType('Option<PalletMultisigMultisig>', multisigStorage)
    console.log('Multisig type: ', multisigType2.toHuman())

    getMultisigTimepointByStorageRead()

    return multisigInfo
  }

  /** Get the open multisig events for the current multisig address. Usually it should be max 1 event. If not, use executed & cancelled events to find the open one. */
  const getOpenMultisigEvents = async (): Promise<NewMultisigEvent[] | null> => {
    const multisigAddress = getMultisigAddress()
    // query via 'newMultisigs' all multisig events with current multisig address
    // filter by approver.length == 1 & approver includes
    return null
  }

  /** Get the executed multisig events for the current multisig address. */
  const getExecutedMultisigEvents = async (): Promise<ExecutedMultisigEvent[] | null> => {
    const multisigAddress = getMultisigAddress()
    // query via 'multisigExecuteds' all multisig events with current multisig address
    // if openMultisigEvents.length > 1, you can use this to check which is still open and which already completed. Use timepoint of the executed event and compare it with the timepoint of the open event
    return null
  }

  /** Get the cancelled multisig events for the current multisig address. */
  const getCancelledMultisigEvents = async (): Promise<CancelledMultisigEvent[] | null> => {
    const multisigAddress = getMultisigAddress()
    // query via 'multisigCancelleds' all multisig events with current multisig address
    // if openMultisigEvents.length > 1, you can use this to check which is still open and which already completed. Use timepoint of the cancelled event and compare it with the timepoint of the open event
    return null
  }

  const hasBuyerSentFunds = (amount: BN) => {
    const multisigAddress = getMultisigAddress()
    // check balance of multisig address and ensure it is greater than or equal to amount
  }

  const hasSellerSentCore = () => {
    const multisigAddress = getMultisigAddress()
    // check if multisig address has the listed core
    // see my-cores/MyCores.tsx for an example of how to query the regions. Filter by multisig address
  }

  const sendCoreToMultisig = async () => {
    // copy transfer core logic
  }

  const sendFundsToMultisig = async () => {
    // simple transfer logic
  }

  const getTimepoint = async () => {
    // get new multisig events
    // if 0 open events, return
    // if >1 open events, get executed and cancelled events and reduce to 1 event via timepoint
    // if 1 open event, use PJS to fetch all multisig entries and find the correct one by comparing properties: blockNumber, multisig, callHash, approving...
  }

  /**
   * The following function is used to get the block number and index of a multisig call.
   * @remarks
   * It reads the rpc storage directly to get the multisig call information. The same is done by the PJS team here: https://github.com/paritytech/txwrapper-core/blob/768bb445beb2907582b2d5e13ade3be5d995af3e/packages/txwrapper-examples/multisig/src/multisig.ts#L171
   * This function works but the Subsquid query provides a wrong call hash so the created storageKey is wrong. So use the getTimepoint() function for now instead.
   */
  const getMultisigTimepointByStorageRead = async () => {
    const multisigAddressBytes = createKeyMulti(signatories, threshold)
    const multisigAddress = getEncodedAddress(multisigAddressBytes)

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

  const getEncodedAddress = (address: string | Uint8Array, ss58Format?: number) => {
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
    if (threshold < 2 || signatories.length < 2) return
    // Address as a byte array.
    const multisigPubKey = createKeyMulti(signatories, threshold)

    // Convert byte array to SS58 encoding.
    return getEncodedAddress(multisigPubKey)
  }

  return {
    initiateMultisigCall: initiateMultisigTradeCall,
    getMultisigAddress,
    hasBuyerSentFunds,
    hasSellerSentCore,
  }
}
