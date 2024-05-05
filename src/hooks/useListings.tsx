import { RegionDetail, RegionOwner, RegionsType } from '@/types'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { useEffect, useState } from 'react'

// resembles ActiveChain.name ;can and should obviously be separated in the future into multiple db tables
export type networks =
  | 'Polkadot Coretime'
  | 'Kusama Coretime'
  | 'Westend Coretime Chain'
  | 'Rococo Coretime Testnet'

type states = 'listed' | 'tradeOngoing' | 'completed' | 'cancelled'

// TODO: Update this as necessary
export interface CoreListing {
  // listing identifier
  id: number

  // core identifiers
  begin: string
  coreNumber: number
  mask: string

  // details
  end?: string
  status: states
  network: networks
  timestamp: string
  cost: string // native currency in planck
  sellerAddress: string // address of current owner
  buyerAddress?: string | null // address, is added at buy init
  lasticAddress?: string | null // address, is added at buy init

  timepoint?: { height: number; index: number } // is added at multisig init. Used to identify right opened multisig if multiple are opened.
}

export const useListings = (fetchOnInit = true) => {
  const { api } = useInkathon()
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
    if (fetchOnInit) fetchListings()
  }, [])

  const fetchListings = async (filterParams?: Record<string, string>) => {
    setIsLoading(true)
    try {
      // Construct query parameters from filterParams
      let queryParams = ''
      if (filterParams) {
        queryParams = new URLSearchParams(filterParams).toString()
      }

      // Create the URL with parameters
      const url = `/api/listings${queryParams ? '?' + queryParams : ''}`

      const response = await fetch(url)
      if (!response.ok) throw new Error()

      const data = await response.json()

      console.log('data', data)

      setListings(data)
      return data as CoreListing[]
    } catch (error) {
      console.error('Failed to fetch listings:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const addListing = async (listing: CoreListing) => {
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

      await fetchListings()
      setStatusMessage('Listing added successfully')
    } catch (error) {
      console.error('Failed to add listing:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteListing = async (listing: CoreListing) => {}

  const updateListing = async (listing: CoreListing) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/listings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listing),
      })

      if (!response.ok) throw new Error()

      fetchListings()
    } catch (error) {
      console.error('Failed to update listing:', error)
    } finally {
      setIsLoading(false)
    }
  }

  /** Checks if listing is still open to buy. Useful as a pre-check before starting a trade. */
  const _isListingStillOpen = async (listingID: number) => {
    const newListings = await fetchListings()
    const listing = newListings.find((listing) => listing.id === listingID)

    if (!listing || listing.status !== 'listed' || listing.buyerAddress) return false

    return true
  }

  /** Marks a trade as started. Updates status and buyerAddress. Make sure to check if listing is still open. */
  const markTradeStarted = async (listingID: number, buyerAddress: string) => {
    setIsLoading(true)
    try {
      // update status & buyerAddress
      const updatedListing = {
        id: listingID,
        status: 'tradeOngoing',
        buyerAddress,
      }

      const response = await fetch('/api/listings', {
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

  const markTradeCompleted = async (listingID: number) => {
    setIsLoading(true)
    try {
      // update status
      const updatedListing = {
        id: listingID,
        status: 'completed',
      }

      const response = await fetch('/api/listings', {
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

  const _getCoreEnd = async (core: CoreListing) => {
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
    updateListing,
    markTradeStarted,
    markTradeCompleted,
  }
}
