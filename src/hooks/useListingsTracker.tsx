import { CoreListing } from '@/hooks/useListings'
import { RegionDetail, RegionOwner, RegionsType } from '@/types'
import { calculateMultisigAddress, getAllOpenMultisigCalls } from '@/utils/multisigHelper'
import { BN } from '@polkadot/util'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { useEffect, useState } from 'react'

const LASTIC_ADDRESS = process.env.NEXT_PUBLIC_LASTIC_ADDRESS || '' // used for new multisigs and if db has no other address defined

const THRESHOLD = 2

type ListingID = number

export interface ListingState {
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

export type ListingsTracker = Record<ListingID, ListingState>

/** Hook for tracking the state of listings. Uses PJS, events, and the DB */
export const useListingsTracker = (coreListings: CoreListing[], intervalMs?: number) => {
  const { api, activeAccount, activeChain, activeRelayChain } = useInkathon()

  const [isLoading, setIsLoading] = useState(false)
  const [listingsState, setListingsState] = useState<ListingsTracker>(
    coreListings.reduce(
      (acc, listing) => ({
        ...acc,
        [listing.id]: listingStateInit,
      }),
      {},
    ),
  )

  useEffect(() => {
    updateAllStates()

    if (intervalMs) {
      const interval = setInterval(() => {
        updateAllStates()
      }, intervalMs)
      return () => clearInterval(interval)
    }
  }, [activeAccount, coreListings])

  /** Updates the state of all listings */
  const updateAllStates = async () => {
    try {
      setIsLoading(true)

      const updates = await Promise.all(
        coreListings.map((listing) =>
          _getListingState(listing).then((state) => ({ [listing.id]: state })),
        ),
      )

      const update = Object.assign({}, ...updates)

      setListingsState((prevState) => {
        return { ...prevState, ...update }
      })
    } catch (error) {
      console.error('Failed to update listings state:', error)
    } finally {
      setIsLoading(false)
    }
  }

  /** Updates the state of a single listing */
  const _getListingState = async (core: CoreListing) => {
    // on complete
    if (core.status === 'completed')
      return {
        step1: true,
        step2: true,
        step3: true,
        step4: true,
        statusMessage: 'Trade completed',
      }

    let state = listingStateInit

    // Step 1
    if (
      core.status === 'tradeOngoing' &&
      core.buyerAddress &&
      (await hasMultisigAddressTheCoreFunds(core))
    ) {
      state = { ...state, step1: true }
    }

    // Step 2
    if (core.status === 'tradeOngoing' && (await hasMultisigAddressTheListedCore(core))) {
      state = { ...state, step2: true }
    }

    // Step 3
    if (core.status === 'tradeOngoing') {
      const buyer = core.buyerAddress || activeAccount?.address
      const multisigAddress = calculateMultisigAddress(
        THRESHOLD,
        [core.sellerAddress, buyer || '', core.lasticAddress || LASTIC_ADDRESS],
        activeChain,
      )
      const multisigCalls = await getAllOpenMultisigCalls(
        multisigAddress || '',
        api,
        activeRelayChain,
      )

      if (multisigCalls && multisigCalls.length == 1) {
        state = { ...state, step3: true }
      } else if (multisigCalls && multisigCalls.length > 1) {
        // TODO support this case
        console.error(
          'More than one multisig call opened for the same multisig address. Trying the first.',
        )
        state = { ...state, step3: true }
      }
    }

    const msg = _getStatusMessage(state, core)
    return { ...state, statusMessage: msg }
  }

  const _getStatusMessage = (newState: ListingState, core: CoreListing) => {
    let statusMessages = statusMessagesNeutralView

    // status message personalized for each user

    if (activeAccount?.address === core.sellerAddress) {
      statusMessages = statusMessagesSellerView
    } else if (activeAccount?.address === (core.lasticAddress || LASTIC_ADDRESS)) {
      statusMessages = statusMessagesLasticView
    } else statusMessages = statusMessagesBuyerView

    if (core.status === 'completed') return 'Trade completed'
    // identify right step
    else if (!newState.step1) return statusMessages.step1
    else if (!newState.step2) return statusMessages.step2
    else if (!newState.step3) return statusMessages.step3
    else if (!newState.step4) return statusMessages.step4
    else return 'Buy this core'
  }

  /** Updates current listings by reading from the DB. Not implemented yet. */
  const _dbSync = async () => {}

  /**
   * Check if the multisig address currently holds the core price as balance.
   * @returns - True if the multisig address holds the amount
   */
  const hasMultisigAddressTheCoreFunds = async (core: CoreListing) => {
    const multisigAddress = calculateMultisigAddress(
      THRESHOLD,
      [
        core.sellerAddress,
        core.buyerAddress || activeAccount?.address || '',
        core.lasticAddress || LASTIC_ADDRESS,
      ],
      activeChain,
    )

    const { data: balance } = (await api?.query.system.account(multisigAddress)) as any
    const cleanedBalance = balance?.free.toString().replace(/,/g, '')
    const balanceBN = new BN(cleanedBalance)

    if (balanceBN?.gte(new BN(core.cost))) {
      return true
    }

    return false
  }

  /**
   * Check if the multisig address currently holds the listed core.
   * @param core - The core listing to check
   * @returns - True if the multisig address holds the core
   */
  const hasMultisigAddressTheListedCore = async (core: CoreListing) => {
    const multisigAddress = calculateMultisigAddress(
      THRESHOLD,
      [
        core.sellerAddress,
        core.buyerAddress || activeAccount?.address || '',
        core.lasticAddress || LASTIC_ADDRESS,
      ],
      activeChain,
    )

    // fetch multisig regions
    const entries = await api?.query.broker.regions.entries()
    const regions: RegionsType | undefined = entries?.map(([key, value]) => {
      const detail = key.toHuman() as RegionDetail
      const owner = value.toHuman() as RegionOwner
      return { detail, owner }
    })

    // filter regions by coreNb, begin and mask
    const filteredRegions = regions?.filter((region) => {
      const regionDetail = region.detail[0]
      regionDetail.begin = regionDetail.begin.replace(/,/g, '')

      return (
        regionDetail.core === core.coreNumber.toString() &&
        regionDetail.begin === core.begin &&
        regionDetail.mask === core.mask
      )
    })

    // check if the multisig address has the core
    return filteredRegions?.some((region) => region.owner.owner === multisigAddress)
  }

  return { listingsState, isLoading, updateAllStates }
}

const statusMessagesBuyerView = {
  step1: '💥 Click below to initiate the trade and send the funds to the multisig',
  step2: '⏳ Wait for the seller to send the core to the multisig address',
  step3: '⏳ Wait for the seller to open the multisig trade call',
  step4: '⏳ Wait for Lastic to verify and finish the multisig call. Or do it yourself.',
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
