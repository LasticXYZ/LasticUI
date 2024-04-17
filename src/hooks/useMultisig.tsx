import { MultisigStorageInfo } from '@/types/ListingsTypes'
import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { Weight } from '@polkadot/types/interfaces'
import { ISubmittableResult } from '@polkadot/types/types'
import { createKeyMulti, encodeAddress, sortAddresses } from '@polkadot/util-crypto'
import { useInkathon } from '@poppyseed/lastic-sdk'

interface Params {
  api: ApiPromise
  threshold: number
  otherSignatories: string[]
  tx?: SubmittableExtrinsic<'promise', ISubmittableResult>
  weight?: Weight
  when?: MultisigStorageInfo['when']
}

const LEGACY_ASMULTI_PARAM_LENGTH = 6

export const useMultisig = () => {
  const { api, activeSigner, activeAccount, activeChain } = useInkathon()

  const initiateMultisigCall = async (signatories: string[], threshold: number): Promise<void> => {
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
    const remarkTx = api.tx.system.remark(`Lastic multisig creation`)
    const asMultiTx = getAsMultiTx({ api, threshold, otherSignatories, tx: remarkTx })

    try {
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
    }
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

  const getMultisigAddress = (signatories: string[], threshold: number) => {
    if (threshold < 2 || signatories.length < 2) return
    // Address as a byte array.
    const multisigPubKey = createKeyMulti(signatories, threshold)

    // Convert byte array to SS58 encoding.
    return getEncodedAddress(multisigPubKey)
  }

  const getChainEvents = async () => {}

  return { initiateMultisigCall, getMultisigAddress }
}
