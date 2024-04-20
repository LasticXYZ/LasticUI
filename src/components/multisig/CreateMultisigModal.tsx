import SecondaryButton from '@/components/button/SecondaryButton'
import Modal from '@/components/modal/Modal'
import { useMultisigTrading } from '@/hooks/useMultisigTrading'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { FC } from 'react'
import { MultisigActionStatus, MultisigModalProps } from '../../types/ListingsTypes'
import AddressMini from '../web3/AddressMini'

const CreateMultisigModal: FC<MultisigModalProps> = ({ isOpen, onClose, onStatusChange }) => {
  const { api } = useInkathon()

  const signatories = [
    '5D88QJLCvrZXiHdCptSW5dP7rzE9nQGCgRSvDfEdti6erqGV', //test 4
    '5Hp7jnPx2bBZDTvAWZ3udtxar1nhhbmGvnU7eg37P4kmKUev', //test 2
    '5Gza9nxUQiiErg5NotZ6FPePcjBEHhawoNL3sGqpmjrVhgeo', //test 1
  ]
  const { initiateOrExecuteMultisigTradeCall, getMultisigAddress } = useMultisigTrading(
    signatories,
    2,
  )

  const name = 'lastic-multisig-1'
  const multisigAddress = '5Dq7JZwfd3Jv8PnuKe4B73ZDCUY4kQiE2UrD9kJybbqtRxp5'

  const _createMultisig = () => {
    const status: MultisigActionStatus = { action: 'create', status: 'pending' }

    try {
      initiateOrExecuteMultisigTradeCall().then(() => {
        console.log('Multisig created successfully')
      })

      status.status = 'success'
      status.message = 'Multisig created successfully'
    } catch (error) {
      status.status = 'error'
      status.message = (error as Error).message

      console.error(error)
    }

    onStatusChange(status)
    onClose()
  }

  if (!api) {
    return <div>API not available</div>
  }

  const signatories = [
    '5FLRCTbjEwumqTcMYsQ7t6E3DDCoQxCgNJeE4A9LYzUJ4RvB',
    '5D7wsEFq9rXS4cTAfZ8Uo1Dt8aTD3JTKjnHAEn3Ku4mNL1bJ',
    '5HNJjkjo3KGA3R1DanS82R47tV7G3avEZ8GzLDW9CQtkNjVW',
  ]
  const threshold = new BN(2)
  const name = 'lastic-multisig-1'

  const _createMultisig = useCallback((): void => {
    const options = {
      genesisHash: isDevelopment ? undefined : api.genesisHash.toHex(),
      name: name.trim(),
    }
    const status = createMultisig(signatories, threshold, options, 'created multisig')

    onStatusChange(status)
    onClose()
  }, [api.genesisHash, isDevelopment, name, onClose, onStatusChange, signatories, threshold])

  if (!isOpen) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Purchase Listed Region`}>
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-left font-bold">Note</p>
          <p className="text-sm text-justify border-2 rounded-xl p-2">
            To buy this core, first you are going to create a multi-signature account including you,
            the seller and Lastic. This way you can exchange the core for the price you have agreed
            on, while having Lastic as a trusted party to enforce the agreement.
          </p>
        </div>
        <div className="self-center">
          {signatories.map((address) => (
            <AddressMini key={address} value={address} withSidebar={false} />
          ))}
        </div>
      </div>
      <SecondaryButton disabled={false} title="Create" onClick={_createMultisig} />
    </Modal>
  )
}

export default CreateMultisigModal
