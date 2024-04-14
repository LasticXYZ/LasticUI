import { ApiPromise } from '@polkadot/api'
import { sortAddresses } from '@polkadot/util-crypto'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { getAsMultiTx } from './getAsMultiTx'

interface CreateMultisigRemarkParams {
  api: ApiPromise
  signatories: string[]
  threshold: number
  //   addToast: (toast: ToastMessage) => void;
  //   getSubscanExtrinsicLink: (hash: string) => string;
  setIsSubmitted: (isSubmitted: boolean) => void
  addresses?: string[] // Add more detail if needed
}

interface ToastMessage {
  title: string
  type: 'success' | 'error'
  link?: string
}

export const useCreateMultisigRemark = async ({
  signatories,
  threshold,
  setIsSubmitted,
}: CreateMultisigRemarkParams) => {
  const { api, activeSigner, activeAccount, activeChain } = useInkathon()

  if (!api || !activeSigner || !activeAccount || !activeChain) {
    throw new Error('Erorr in initializing the API')
  } else if (!signatories.includes(activeAccount.address)) {
    throw new Error('Selected account not part of signatories')
  }
  if (!threshold) {
    throw new Error('Threshold is invalid')
  }

  const otherSignatories = sortAddresses(signatories.filter((sig) => sig !== activeAccount.address))
  const remarkTx = api.tx.system.remark(`Multisig Lastic creation`)
  const asMultiTx = getAsMultiTx({ api, threshold, otherSignatories, tx: remarkTx })

  setIsSubmitted(true)

  try {
    const unsub = await asMultiTx.signAndSend(
      activeAccount.address,
      { signer: activeSigner },
      (result) => {
        if (result.status.isInBlock) {
          console.log(`Transaction included at blockHash ${result.status.asInBlock}`)
          // addToast({
          //   title: 'Multisig creation transaction included',
          //   type: 'success',
          //   link: getSubscanExtrinsicLink(result.transactionHash)
          // });
        } else if (result.status.isFinalized) {
          console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`)
          // addToast({
          //   title: 'Multisig creation transaction finalized',
          //   type: 'success',
          //   link: getSubscanExtrinsicLink(result.transactionHash)
          // });
          unsub()
          setIsSubmitted(false)
        }
      },
    )
  } catch (error) {
    setIsSubmitted(false)
    // addToast({
    //   title: error.message || 'Failed to create multisig',
    //   type: 'error',
    // });
    throw error
  }
}
