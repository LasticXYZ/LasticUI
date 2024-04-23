import { CoreListing } from '@/hooks/useListings'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { useState } from 'react'

const buyerAddress = '0x123'
const sellerAddress = '0x456'
const lasticAddress = '0x789'

export const useMultisigStatus = (coreListings: CoreListing[], intervalMs?: number) => {
  const { api, activeAccount } = useInkathon()
  const [isLoading, setIsLoading] = useState(false)
  // Make it support
  const [steps, setSteps] = useState({
    step1: true,
    step2: false,
    step3: false,
    step4: false,
  })
  const [statusMessage, setStatusMessage] = useState(
    '⏳ Wait for the seller to send the core to the multisig address',
  )

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
    if (!steps.step1) setStatusMessage(statusMessages.step1)
    else if (!steps.step2) setStatusMessage(statusMessages.step2)
    else if (!steps.step3) setStatusMessage(statusMessages.step3)
    else if (!steps.step4) setStatusMessage(statusMessages.step4)
    else setStatusMessage('Trade completed')
  }

  return { isLoading }
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
