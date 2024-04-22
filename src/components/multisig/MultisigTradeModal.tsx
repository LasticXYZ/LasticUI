import SecondaryButton from '@/components/button/SecondaryButton'
import Modal from '@/components/modal/Modal'
import { CoreListing } from '@/hooks/useListings'
import { useMultisigTrading } from '@/hooks/useMultisigTrading'
import { Checkbox } from '@mui/material'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { FC, useState } from 'react'
import { ModalProps } from '../../types/ListingsTypes'

const checkboxStyle = {
  '& .MuiSvgIcon-root': {
    fill: '#E6B3CA',
    fontSize: 16,
  },
  p: 0,
}

export interface MultisigTradeModalProps extends ModalProps {
  isOpen: boolean
  core: CoreListing
  // add stepstate here
  // add onUpdateSteps here
}

const statusMessagesBuyerView = {
  step1: '💥 Click below to initiate the trade and send the funds to the multisig',
  step2: '⏳ Wait for the seller to send the core to the multisig address',
  step3: '⏳ Wait for the seller to open the multisig trade call',
  step4: '⏳ Wait for Lastic to verify and finish the multisig call',
}

const statusMessagesSellerView = {
  step1: '⏳ Wait for a buyer to initiate the trade',
  step2: '💥 Your Turn: Click below to send the core to the multisig address',
  step3: '💥 Your Turn: Click below to open the multisig trade call',
  step4: '⏳ Wait for Lastic to verify and finish the multisig call',
}

const statusMessagesLasticView = {
  step1: '⏳ Wait for a buyer to initiate the trade. As Lastic, you cannot initiate the trade',
  step2: '⏳ Wait for the seller to send the core to the multisig address',
  step3: '⏳ Wait for the seller to open the multisig trade call',
  step4: '💥 Your Turn: Click below to verify and finish the multisig call',
}

const statusMessagesNeutralView = {
  step1: '⏳ Waiting for a buyer to initiate the trade',
  step2: '⏳ Waiting for the seller to send the core to the multisig address',
  step3: '⏳ Waiting for the seller to open the multisig trade call',
  step4: '⏳ Waiting for Lastic to verify and finish the multisig call',
}

const MultisigTradeModal: FC<MultisigTradeModalProps> = ({
  isOpen,
  onClose,
  core,
  onStatusChange,
}) => {
  const { api, activeAccount } = useInkathon()
  const [stepState, setStepState] = useState({
    step1: true,
    step2: false,
    step3: false,
    step4: false,
  })
  const [statusMessage, setStatusMessage] = useState(
    '⏳ Wait for the seller to send the core to the multisig address',
  )

  const test1 = '5Gza9nxUQiiErg5NotZ6FPePcjBEHhawoNL3sGqpmjrVhgeo'
  const test2 = '5Hp7jnPx2bBZDTvAWZ3udtxar1nhhbmGvnU7eg37P4kmKUev'
  const test3 = '5GByzRyonPJC4kLg8dRenszsZD25dFjdJRCVCyfLkQ52HDev'
  const test4 = '5D88QJLCvrZXiHdCptSW5dP7rzE9nQGCgRSvDfEdti6erqGV'

  const sellerAddress = test2
  const lasticAddress = test3 // get from env
  const buyerAddress = test4

  const signatoriesWithLabel = [
    {
      address: sellerAddress,
      label: 'Seller',
    },
    {
      address: buyerAddress,
      label: 'Buyer',
    },
    {
      address: lasticAddress,
      label: 'Lastic',
    },
  ]
  const { initiateOrExecuteMultisigTradeCall, multisigAddress, isLoading, txStatusMessage } =
    useMultisigTrading(test2, test4, core)

  const _multisigCall = () => {
    initiateOrExecuteMultisigTradeCall().then(() => {
      console.log('Multisig call successful')
    })
  }

  const updateState = () => {
    // TODO: on step 4 make sure to add 'completed' state to listing. This should mark all steps as finished.
    // Step 1: if multisig has funds; Or if DB says completed
    // Step 2: if multisig has core; Or if DB says completed
    // Step 3: if multisig is opened AND step 1 + 2; Or if DB says completed. Expects no multisig is opened outside of the app.
    // Step 4: if DB says completed. This should be update in the DB when lastic approves or multisig executed event rises.
    _updateStatusMessage()
  }

  const _updateStatusMessage = () => {
    let statusMessages = statusMessagesNeutralView

    // status message personalized for each user
    if (activeAccount?.address === buyerAddress) {
      statusMessages = statusMessagesBuyerView
    } else if (activeAccount?.address === sellerAddress) {
      statusMessages = statusMessagesSellerView
    } else if (activeAccount?.address === lasticAddress) {
      statusMessages = statusMessagesLasticView
    }

    // identify right step
    if (!stepState.step1) setStatusMessage(statusMessages.step1)
    else if (!stepState.step2) setStatusMessage(statusMessages.step2)
    else if (!stepState.step3) setStatusMessage(statusMessages.step3)
    else if (!stepState.step4) setStatusMessage(statusMessages.step4)
    else setStatusMessage('Trade completed')
  }

  if (!isOpen || !api) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Purchase Listed Core Nb ${core.coreNumber}`}>
      <div className="flex flex-col gap-5 ">
        <p className="text-left font-bold">How it works</p>
        <div className="text-xs border-2 rounded-xl p-2">
          <p className="text-justify pb-2">
            This trade is realized via a multisig account that requires 2 out of 3 signatories. It
            requires the following steps to be completed:
          </p>

          <div className="grid text-xs gap-2 items-start">
            <div className="flex items-center gap-1">
              <Checkbox disableRipple checked={stepState.step1} sx={checkboxStyle} />
              <p>Step 1: The buyer sends the price amount to the multisig address</p>
            </div>
            <div className="flex items-center gap-1">
              <Checkbox disableRipple checked={stepState.step2} size="small" sx={checkboxStyle} />
              <p>Step 2: The seller sends the core to the multisig address</p>
            </div>
            <div className="flex items-center gap-1">
              <Checkbox disableRipple checked={stepState.step3} sx={checkboxStyle} />
              <p>
                Step 3: The seller opens a batch multisig call that sends the core to the buyer and
                the balance to himself
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Checkbox disableRipple checked={stepState.step4} sx={checkboxStyle} />
              <p>
                Step 4: Lastic verifies and approves the multisig call and the the trade will be
                executed
              </p>
            </div>
          </div>
        </div>

        <div className="self-center">
          {signatoriesWithLabel.map(({ address, label }) => (
            <div key={address} className="flex items-center gap-3 text-xs">
              <p className="w-32 text-end">
                {label} {activeAccount?.address === address && '(You)'}:
              </p>
              <div className="flex items-center gap-1 text-gray-400">
                {/* <AddressMini value={address} withSidebar={false} /> */}
                <p className="flex-1">{address}</p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3 text-xs">
            <p className="w-32 text-end">Multisig Address:</p>
            <p className="text-gray-400 flex">{multisigAddress}</p>
          </div>
        </div>
        <p className="font-bold text-center">{statusMessage}</p>
        <SecondaryButton
          className="w-40 self-center"
          disabled={isLoading}
          title="Process Trade"
          onClick={_multisigCall}
        />
        {txStatusMessage && <p className="flex flex-wrap self-center text-xs">{txStatusMessage}</p>}
      </div>
    </Modal>
  )
}

export default MultisigTradeModal
