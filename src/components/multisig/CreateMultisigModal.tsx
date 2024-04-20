import SecondaryButton from '@/components/button/SecondaryButton'
import Modal from '@/components/modal/Modal'
import { useMultisigTrading } from '@/hooks/useMultisigTrading'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { FC } from 'react'
import { MultisigActionStatus, MultisigModalProps } from '../../types/ListingsTypes'

const CreateMultisigModal: FC<MultisigModalProps> = ({ isOpen, onClose, onStatusChange }) => {
  const { api, activeAccount } = useInkathon()

  const test1 = '5Gza9nxUQiiErg5NotZ6FPePcjBEHhawoNL3sGqpmjrVhgeo'
  const test2 = '5Hp7jnPx2bBZDTvAWZ3udtxar1nhhbmGvnU7eg37P4kmKUev'
  const test3 = '5GByzRyonPJC4kLg8dRenszsZD25dFjdJRCVCyfLkQ52HDev'
  const test4 = '5D88QJLCvrZXiHdCptSW5dP7rzE9nQGCgRSvDfEdti6erqGV'

  const signatories = [test2, test3, test4]
  const signatoriesWithLabel = [
    {
      address: test2,
      label: 'Seller',
    },
    {
      address: test3,
      label: 'Buyer',
    },
    {
      address: test4,
      label: 'Lastic',
    },
  ]
  const { initiateOrExecuteMultisigTradeCall, getMultisigAddress } = useMultisigTrading(
    signatories,
    2,
  )

  const name = 'lastic-multisig-1'
  const multisigAddress = getMultisigAddress()

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
      <div className="flex flex-col gap-5 ">
        <p className="text-left font-bold">How it works</p>
        <div className="text-xs border-2 rounded-xl p-2">
          <p className="text-justify pb-2">
            This trade is realized via a multisig account that requires 2 out of 3 signatories. It
            requires the following steps to be completed:
          </p>

          <div className="grid text-xs gap-2 items-start ">
            <p className="font-semibold">Step 1: </p>
            <p>The buyer sends the price amount to the multisig address</p>
            <p className="font-semibold">Step 2:</p>
            <p>
              The seller sends the core to the multisig address and opens a batch multisig call that
              sends the core to the buyer and the balance to himself
            </p>
            <p className="font-semibold">Step 3:</p>
            <p>Lastic verifies and approves the multisig call and the the trade will be executed</p>
          </div>
        </div>

        <div className="self-center">
          {signatoriesWithLabel.map(({ address, label }) => (
            <div key={address} className="flex  text-left gap-2 text-sm">
              <p>{label}:</p>
              <div className="flex gap-1 text-gray-400">
                {/* <AddressMini value={address} withSidebar={false} /> */}
                <p>{address}</p>
                {activeAccount?.address === address && <p>(You)</p>}
              </div>
            </div>
          ))}
          <div className="flex text-left gap-2 text-sm">
            <p>Multisig Address:</p>
            <p className="text-gray-400">{multisigAddress}</p>
          </div>
        </div>
        <SecondaryButton
          className="w-40 self-center"
          disabled={false}
          title="Create"
          onClick={_createMultisig}
        />
      </div>
    </Modal>
  )
}

export default CreateMultisigModal
