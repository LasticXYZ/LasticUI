import { CoreListing } from '@/hooks/useListings'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { useState } from 'react'

const buyerAddress = '0x123'
const sellerAddress = '0x456'
const lasticAddress = '0x789'

type ListingID = number

interface ListingState {
  step1: boolean
  step2: boolean
  step3: boolean
  step4: boolean
  statusMessage: string
}

const listingStateInit = {
  step1: false,
  step2: false,
  step3: false,
  step4: false,
  statusMessage: '',
}

type ListingsTracker = Record<ListingID, ListingState>

export const useListingsTracker = (coreListings: CoreListing[], intervalMs: number = 10000) => {
  const { api, activeAccount } = useInkathon()
  const [isLoading, setIsLoading] = useState(false)
  const [listingsState, setListingsState] = useState<ListingsTracker>(
    Object.create(
      coreListings.reduce((acc, listing) => ({ ...acc, [listing.id]: listingStateInit }), {}),
    ),
  )

  /**
   * Updates the state of all listings
   */
  const updateAllStates = async () => {}

  /**
   * Updates the state of a single listing
   */
  const updateState = () => {
    // TODO: on step 4 make sure to add 'completed' state to listing. This should mark all steps as finished.
    // Step 1: if multisig has funds; Or if DB says completed
    // Step 2: if multisig has core; Or if DB says completed
    // Step 3: if multisig is opened AND step 1 + 2; Or if DB says completed. Expects no multisig is opened outside of the app.
    // Step 4: if DB says completed. This should be update in the DB when lastic approves or multisig executed event rises.
    _getStatusMessage(123)
  }

  /**
   * Updates current listings by reading from the DB
   */
  const dbSync = async () => {}

  const _getStatusMessage = (id: ListingID) => {
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
    if (!listingsState[id].step1) return statusMessages.step1
    else if (!listingsState[id].step2) return statusMessages.step2
    else if (!listingsState[id].step3) return statusMessages.step3
    else if (!listingsState[id].step4) return statusMessages.step4
    else return 'Trade completed'
  }

  return { listingsState, isLoading, updateAllStates, dbSync }
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
