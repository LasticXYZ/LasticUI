import {
  QueryParams,
  Region,
  RegionDetail,
  RegionOwner,
  RegionsType,
  typeOfChain,
} from '@/types/broker'
import { ApiPromise } from '@polkadot/api'
import {
  BrokerConstantsType,
  ConfigurationType,
  SaleInfoType,
  blocksToTimeFormat,
  getConstants,
  getCurrentBlockNumber,
} from '@poppyseed/lastic-sdk'
import { useEffect, useState } from 'react'

export function useQuerySpecificRegion({
  api,
  coreNb,
  regionId,
}: {
  api?: ApiPromise
  coreNb: number
  regionId: number
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

          const filteredRegion = regions.find((region) =>
            region.detail.some(
              (detailItem) =>
                parseInt(detailItem.core) === coreNb &&
                detailItem.begin.replace(/,/g, '') === regionId.toString(),
            ),
          )

          setData(filteredRegion || null)
        } catch (error) {
          console.error('Failed to fetch regions:', error)
        }
      }
    }

    fetchData()
    const intervalId = setInterval(fetchData, 5000)

    return () => clearInterval(intervalId)
  }, [api, coreNb, regionId])

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

export function saleStatus(
  currentBlockNumber: number,
  saleInfo: SaleInfoType,
  config: ConfigurationType,
  constant: BrokerConstantsType,
) {
  const divide_by_2_or_not: 1 | 2 = typeOfChain === 'PARA' ? 2 : 1
  const saleEnds: number =
    saleInfo.saleStart +
    (config.regionLength * constant.timeslicePeriod) / divide_by_2_or_not -
    config.interludeLength

  let statusMessage = ''
  let timeRemaining = ''
  let statusTitle = ''

  if (currentBlockNumber < saleInfo.saleStart) {
    timeRemaining = blocksToTimeFormat(saleInfo.saleStart - currentBlockNumber, typeOfChain)
    statusMessage = 'Time to renew your core!'
    statusTitle = 'Interlude Period'
  } else if (currentBlockNumber < saleInfo.saleStart + config.leadinLength) {
    timeRemaining = blocksToTimeFormat(
      saleInfo.saleStart + config.leadinLength - currentBlockNumber,
      typeOfChain,
    )
    statusMessage =
      'Sales have started we are now in the lead-in period. The price is linearly decreasing with each block.'
    statusTitle = 'Lead-in Period'
  } else if (currentBlockNumber <= saleEnds) {
    timeRemaining = blocksToTimeFormat(saleEnds - currentBlockNumber, typeOfChain)
    statusMessage = 'Sale is in the purchase period.'
    statusTitle = 'Purchase Period'
  } else {
    timeRemaining = '-'
    statusMessage = 'The sale has ended.'
    statusTitle = 'Sale Ended'
  }

  return { statusTitle, statusMessage, timeRemaining }
}

export function calculateCurrentPrice(
  currentBlockNumber: number,
  saleInfo: SaleInfoType,
  config: ConfigurationType,
): number {
  if (
    currentBlockNumber < saleInfo.saleStart + config.leadinLength &&
    currentBlockNumber > saleInfo.saleStart
  ) {
    return saleInfo.price * (2 - (currentBlockNumber - saleInfo.saleStart) / config.leadinLength)
  } else {
    return saleInfo.price
  }
}
