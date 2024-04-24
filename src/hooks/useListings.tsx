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
  status: 'listed' | 'tradeOngoing' | 'completed'
  network: 'polkadot' | 'kusama' | 'westend' | 'rococo'
  end: string
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

  const fetchListings = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('') // TODO extract to service folder
      const data = await response.json()
      setListings(data)
    } catch (error) {
      console.error('Failed to fetch listings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addListing = async (listing: CoreListing) => {}

  const deleteListing = async (listing: CoreListing) => {}

  const updateListing = async (listing: CoreListing) => {}

  return { listings, isLoading, updateListings: fetchListings }
}
