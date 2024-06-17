import { Region, RegionDetail, RegionOwner, RegionsType } from '@/types/broker'
import { getSaleEnds } from '@/utils/broker/saleStatus'
import { ApiPromise } from '@polkadot/api'
import { BrokerConstantsType, ConfigurationType, getConstants } from '@poppyseed/lastic-sdk'
import { SaleInitializedEvent } from '@poppyseed/squid-sdk'
import { useEffect, useState } from 'react'

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

          if (mask) {
            const filteredRegionsByMask = filteredRegionsByNbAndRegion.filter((region) =>
              region.detail.some(
                (detailItem) =>
                  detailItem.mask === mask &&
                  parseInt(detailItem.core) === coreNb &&
                  detailItem.begin.replace(/,/g, '') === regionId.toString(),
              ),
            )

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
): number | null {
  if (!saleInfo || !saleInfo.saleStart || !saleInfo.regularPrice) return null
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

/**
 * Return the factor by which the regular price must be multiplied during the leadin period.
 *
 * @param progress - The amount through the leadin period; between zero and one
 */
const leadInFactorAt = (progress: number) =>
  progress <= 1 / 2 ? 100 - progress * 180 : 19 - progress * 18

// Calculate the price of a core at a given block number
// y = kx + n
// y = k * currentBlockNumber + n
export function calculateCurrentPricePerCore(
  currentBlockNumber: number,
  saleInfo: SaleInitializedEvent | null,
  config: ConfigurationType,
): number | null {
  if (saleInfo === null || saleInfo.saleStart === null || saleInfo.regularPrice === null) {
    return null
  }

  if (
    currentBlockNumber < saleInfo.saleStart ||
    currentBlockNumber >= saleInfo.saleStart + config.leadinLength
  ) {
    return Number(saleInfo.regularPrice)
  }

  const leadInLength = saleInfo.leadinLength ?? config.leadinLength
  const blocksPassed = Math.min(leadInLength, currentBlockNumber - saleInfo.saleStart)

  return leadInFactorAt(blocksPassed / leadInLength) * Number(saleInfo.regularPrice)
}

// Pseudocode to visualize the price per core over time
export function priceCurve(
  saleInfo: SaleInitializedEvent,
  config: ConfigurationType,
  constant: BrokerConstantsType,
): { x: number[]; y: number[] } | undefined {
  const saleStart = saleInfo.saleStart
  // console.log(saleStart)
  const saleEnds = getSaleEnds(saleInfo, config, constant)
  // console.log(config.leadinLength)
  let prices = []
  let blocks = []
  if (!saleStart || !saleEnds) return

  for (let block = saleStart; block <= saleEnds; block += 1000) {
    const price = calculateCurrentPricePerCore(block, saleInfo, config)
    if (price !== null) {
      prices.push(price)
      blocks.push(block)
    }
  }

  // Assuming a function plotGraph exists
  return { x: blocks, y: prices }
}
