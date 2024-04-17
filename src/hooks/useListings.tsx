import { useEffect, useState } from 'react'

// TODO: Update this as necessary
export interface CoreListing {
  id: number
  coreNumber: number
  size: number
  cost: number
  reward: number
  owner: string
  currencyCost: string
  currencyReward: string
  mask: string
  begin: string
  end: string
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
