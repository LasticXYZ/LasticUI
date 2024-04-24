import { QueryParams, Region, RegionDetail, RegionOwner, RegionsType } from '@/types/broker'
import { ApiPromise } from '@polkadot/api'
import { BrokerConstantsType, ConfigurationType, getConstants } from '@poppyseed/lastic-sdk'
import { SaleInitializedEvent } from '@poppyseed/squid-sdk'
import { useEffect, useState } from 'react'
import { getCurrentBlockNumber } from './blockTime'

export { saleStatus } from './saleStatus'

export function useQuerySpecificRegion({
  api,
  coreNb,
  regionId,
  mask,
}: {
  api?: ApiPromise
  coreNb: number
  regionId: number
  mask?: string
}) {
  const [data, setData] = useState<Region | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (api?.query?.broker?.regions) {
        try {
          const entries = await api.query.broker.regions.entries()
          const regions: RegionsType = entries.map(([key, value]) => {
            const detail = key.toHuman() as RegionDetail
            const owner = value.toHuman() as RegionOwner
            return { detail, owner }
          })

          const filteredRegionsByNbAndRegion = regions.filter((region) =>
            region.detail.some(
              (detailItem) =>
                parseInt(detailItem.core) === coreNb &&
                detailItem.begin.replace(/,/g, '') === regionId.toString(),
            ),
          )
          // console.log(`filteredRegionsByNbAndRegion`)

          if (mask) {
            const filteredRegionsByMask = filteredRegionsByNbAndRegion.filter((region) =>
              region.detail.some(
                (detailItem) =>
                  detailItem.mask === mask &&
                  parseInt(detailItem.core) === coreNb &&
                  detailItem.begin.replace(/,/g, '') === regionId.toString(),
              ),
            )
            console.log(`filteredRegionsByMask`)
            console.log(filteredRegionsByMask)
            setData(filteredRegionsByMask[0] || null)
          } else {
            setData(filteredRegionsByNbAndRegion[0] || null)
          }
        } catch (error) {
          console.error('Failed to fetch regions:', error)
        }
      }
    }

    fetchData()
    const intervalId = setInterval(fetchData, 5000)

    return () => clearInterval(intervalId)
  }, [api, coreNb, regionId, mask])

  return data
}

// Custom hook for querying substrate state
export function useSubstrateQuery(
  api: ApiPromise | undefined,
  queryKey: string,
  queryParams: QueryParams = [],
) {
  const [data, setData] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (api?.query?.broker?.[queryKey]) {
        try {
          const result = await api.query.broker[queryKey](...queryParams)
          // Check if the Option type is Some and unwrap the value
          if (result) {
            setData(result.toString())
          } else {
            setData(null)
          }
        } catch (error) {
          console.error(`Failed to fetch ${queryKey}:`, error)
        }
      }
    }

    fetchData()
    const intervalId = setInterval(fetchData, 5000)

    return () => clearInterval(intervalId)
  }, [api, queryKey, queryParams])

  return data
}

export function useCurrentBlockNumber(api: ApiPromise | undefined) {
  const [currentBlockNumber, setCurrentBlockNumber] = useState(0)

  useEffect(() => {
    if (!api) return

    const fetchCurrentBlockNumber = async () => {
      const currentBlock = await getCurrentBlockNumber(api)
      setCurrentBlockNumber(currentBlock)
    }

    const intervalId = setInterval(fetchCurrentBlockNumber, 1000) // Update every second

    return () => clearInterval(intervalId)
  }, [api])

  return currentBlockNumber
}

export function useBrokerConstants(api: ApiPromise | undefined) {
  const [brokerConstants, setBrokerConstants] = useState<BrokerConstantsType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchConstants = async () => {
      try {
        const constants = await getConstants(api)
        if (isMounted) {
          setBrokerConstants(constants)
          setIsLoading(false)
        }
      } catch (err) {
        console.error(err)
        setIsLoading(false)
      }
    }

    fetchConstants()

    return () => {
      isMounted = false
    }
  }, [api])

  return { brokerConstants, isLoading }
}

export function calculateCurrentPrice(
  currentBlockNumber: number,
  saleInfo: SaleInitializedEvent | null,
  config: ConfigurationType,
): number {
  if (!saleInfo || !saleInfo.saleStart || !saleInfo.regularPrice) return 0
  if (
    currentBlockNumber < saleInfo.saleStart + config.leadinLength &&
    currentBlockNumber > saleInfo.saleStart
  ) {
    return (
      Number(saleInfo.regularPrice) *
      (2 - (currentBlockNumber - saleInfo.saleStart) / config.leadinLength)
    )
  } else {
    return Number(saleInfo.regularPrice)
  }
}
