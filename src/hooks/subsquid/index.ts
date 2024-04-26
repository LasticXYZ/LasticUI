import { GraphLike, SaleInitializedEvent, SquidClient } from '@poppyseed/squid-sdk'
import { useEffect, useMemo, useState } from 'react'

// Function to fetch the sale region
// This function is used in the BrokerSaleInfo component
export function useSaleRegion(network: string | null, client: SquidClient) {
  const [currentSaleRegion, setCurrentSaleRegion] = useState<SaleInitializedEvent | null>(null)

  useMemo(() => {
    let query1 = client.eventAllSaleInitialized(1)

    if (network && query1) {
      const fetchData = async () => {
        const fetchedResult: GraphLike<SaleInitializedEvent[]> = await client.fetch(network, query1)
        const currentSaleRegion: SaleInitializedEvent | null = fetchedResult?.data.event
          ? fetchedResult.data.event[0]
          : null
        setCurrentSaleRegion(currentSaleRegion)
      }

      fetchData()
    }
  }, [network, client])

  return currentSaleRegion
}

interface CoresSoldInThisSale {
  totalCount: number
}

export function useSaleRegions(network: string | null, client: SquidClient) {
  const [result, setResult] = useState<GraphLike<SaleInitializedEvent[]> | null>(null)

  useMemo(() => {
    const fetchData = async () => {
      if (network) {
        const query = client.eventAllSaleInitialized()
        try {
          const fetchedResult: GraphLike<SaleInitializedEvent[]> = await client.fetch(
            network,
            query,
          )
          setResult(fetchedResult)
        } catch (error) {
          console.error('Failed to fetch data:', error)
        }
      }
    }
    fetchData()
  }, [network, client])

  return result
}

// Function to fetch the cores sold in the current sale region
// This function is used in the TimeSection component
export function useCoresSold(
  network: string | null,
  client: SquidClient,
  currentSaleRegion: SaleInitializedEvent | null,
) {
  const [coresSoldInThisSale, setCoresSoldInThisSale] = useState<CoresSoldInThisSale | null>(null)

  useEffect(() => {
    if (currentSaleRegion && currentSaleRegion.regionBegin) {
      let query4 = client.coresSoldInThisSale(currentSaleRegion.regionBegin)
      if (network && query4) {
        const fetchData = async () => {
          const fetchedResult: GraphLike<CoresSoldInThisSale> | null = await client.fetch(
            network,
            query4,
          )
          const coresSoldInThisSale = fetchedResult?.data.event ? fetchedResult.data.event : null
          setCoresSoldInThisSale(coresSoldInThisSale)
        }

        fetchData()
      }
    }
  }, [client, network, currentSaleRegion])

  return coresSoldInThisSale
}

export function useCurrentSaleRegion(network: string | null, client: SquidClient) {
  const [currentSaleRegion, setCurrentSaleRegion] = useState<SaleInitializedEvent | null>(null)

  useMemo(() => {
    let query1 = client.eventAllSaleInitialized(1)

    if (network && query1) {
      const fetchData = async () => {
        const fetchedResult: GraphLike<SaleInitializedEvent[]> = await client.fetch(network, query1)
        const currentSaleRegion: SaleInitializedEvent | null = fetchedResult?.data.event
          ? fetchedResult.data.event[0]
          : null
        setCurrentSaleRegion(currentSaleRegion)
      }

      fetchData()
    }
  }, [network, client])

  return currentSaleRegion
}
