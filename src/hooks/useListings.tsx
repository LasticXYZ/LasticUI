import { RegionDetail, RegionOwner, RegionsType } from '@/types'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { useEffect, useState } from 'react'

const LASTIC_ADDRESS = process.env.NEXT_PUBLIC_LASTIC_ADDRESS

// resembles activeChain.name. Can be separated in the future into multiple db tables
export type networks =
  | 'Polkadot Coretime'
  | 'Kusama Coretime'
  | 'Westend Coretime Chain'
  | 'Rococo Coretime Testnet'

type states = 'listed' | 'tradeOngoing' | 'completed' | 'cancelled'

/** CoreListing is the main data structure for the DB listings table. */
export interface CoreListing {
  // listing identifier
  id: number // autoincremented

  // core identifiers
  begin: string
  coreNumber: number
  mask: string

  // details
  end?: string
  status: states
  network: networks
  timestamp?: string
  cost: string // native currency in planck
  sellerAddress: string // address of current owner
  buyerAddress?: string | null // address, is added at buy init
  lasticAddress?: string | null // address, is added at buy init

  height?: number // Used to identify right opened multisig if multiple are opened.
  index?: number // Used to identify right opened multisig if multiple are opened.
}

/** Hook for fetching and managing listings on the DB. */
export const useListings = (fetchOnInit = true) => {
  const { api, activeChain } = useInkathon()
  const [listings, setListings] = useState<CoreListing[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    if (isLoading) {
      setStatusMessage('Loading...')
    } else {
      setStatusMessage((prev) => (prev === 'Loading...' ? '' : prev))
    }
  }, [isLoading])

  useEffect(() => {
    const fetchData = async () => {
      await fetch('/api/create-listings-table')
      if (fetchOnInit && activeChain?.name) await fetchListings(activeChain.name as networks)
    }

    fetchData()
  }, [fetchOnInit, activeChain?.name])

  const fetchListings = async (network: networks, id?: string) => {
    setIsLoading(true)
    try {
      // Create the URL with parameters
      const url = `/api/listings?network=${network}`
      if (id) url.concat(`&id=${id}`)

      const response = await fetch(url)
      if (!response.ok) throw new Error()

      const data = await response.json()

      setListings(data)
      return data as CoreListing[]
    } catch (error) {
      console.error('Failed to fetch listings:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const addListing = async (listing: Omit<CoreListing, 'id'>) => {
    setIsLoading(true)
    try {
      // get core end
      const end = await _getCoreEnd(listing)
      const enhancedListing = {
        ...listing,
        end,
      }

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enhancedListing),
      })

      if (!response.ok) throw new Error()

      if (activeChain?.name) await fetchListings(activeChain.name as networks)
      setStatusMessage('Listing added successfully')
    } catch (error) {
      console.error('Failed to add listing:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteListing = async (listing: CoreListing) => {}

  /** Checks if listing is still open to buy. Useful as a pre-check before starting a trade. */
  const _isListingStillOpen = async (listingID: number) => {
    const newListings = await fetchListings(activeChain?.name as networks)
    const listing = newListings.find((listing) => listing.id === listingID)

    if (!listing || listing.status !== 'listed' || listing.buyerAddress) return false

    return true
  }

  /** Marks a trade as started. Updates status and buyerAddress. Make sure to check if listing is still open. */
  const markTradeStarted = async (listingID: number, buyerAddress: string) => {
    setIsLoading(true)
    const network = activeChain?.name as networks
    try {
      const response = await fetch('/api/start-trade', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: listingID, buyerAddress, network }),
      })

      if (!response.ok) throw new Error()
      console.log('Trade marked as started in DB')
    } catch (error) {
      console.error('Failed to update listing:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markTradeCompleted = async (core: CoreListing) => {
    setIsLoading(true)
    const network = activeChain?.name as networks
    try {
      // update status
      const updatedListing = {
        ...core,
        network,
      }

      const response = await fetch('/api/finish-trade', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedListing),
      })

      if (!response.ok) throw new Error()
    } catch (error) {
      console.error('Failed to update listing:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const _getCoreEnd = async (core: Omit<CoreListing, 'id'>): Promise<string | undefined> => {
    const entries = await api?.query.broker.regions.entries()
    const regions: RegionsType | undefined = entries?.map(([key, value]) => {
      const detail = key.toHuman() as RegionDetail
      const owner = value.toHuman() as RegionOwner
      return { detail, owner }
    })

    const filteredRegions = regions?.filter((region) => {
      const regionDetail = region.detail[0]
      regionDetail.begin = regionDetail.begin.replace(/,/g, '')

      return (
        regionDetail.core === core.coreNumber.toString() &&
        regionDetail.begin === core.begin &&
        regionDetail.mask === core.mask
      )
    })

    if (filteredRegions && filteredRegions.length > 0) {
      return filteredRegions[0].owner.end.replace(/,/g, '')
    }
  }

  return {
    listings,
    isLoading,
    statusMessage,
    fetchListings,
    addListing,
    deleteListing,
    markTradeStarted,
    markTradeCompleted,
  }
}
