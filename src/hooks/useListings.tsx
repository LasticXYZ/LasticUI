import { useEffect, useState } from 'react'

// TODO: Update this as necessary

export interface CoreListing {
  // listing identifier
  id: number

  // core identifiers
  begin: string
  coreNumber: number
  mask: string

  // details
  end: string
  status: 'listed' | 'tradeOngoing' | 'completed | cancelled'
  network: 'polkadot' | 'kusama' | 'westend' | 'rococo' // can and should obviously be separated in the future into multiple db tables
  timestamp: string
  cost: string // native currency in planck
  sellerAddress: string // address of current owner
  buyerAddress?: string | null // address, is added at buy init
  lasticAddress?: string | null // address, is added at buy init

  timepoint?: { height: number; index: number } // is added at multisig init. Used to identify right opened multisig if multiple are opened.
}

export const useListings = () => {
  const [listings, setListings] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchListings()
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
      const data = await response.json()

      if (!response.ok) throw new Error()

      setListings(data)
    } catch (error) {
      console.error('Failed to fetch listings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addListing = async (listing: CoreListing) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listing),
      })

      if (!response.ok) throw new Error()

      fetchListings()
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

  return { listings, isLoading, updateListings: fetchListings }
}
