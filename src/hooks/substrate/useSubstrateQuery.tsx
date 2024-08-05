import { SaleInfoType } from '@/types'
import { ApiPromise } from '@polkadot/api'
import { BrokerConstantsType, getConstants, getCurrentBlockNumber } from '@poppyseed/lastic-sdk'
import { useEffect, useMemo, useState } from 'react'

// Define a type for the queryParams
type QueryParams = (string | number | Record<string, unknown>)[]

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
    const intervalId = setInterval(fetchData, 5000) as unknown as number

    return () => clearInterval(intervalId)
  }, [api, queryKey, queryParams])

  return data
}

export function useSaleInfo(api: ApiPromise | undefined) {
  const saleInfoString = useSubstrateQuery(api, 'saleInfo')

  const saleInfo = useMemo(
    () => (saleInfoString ? (JSON.parse(saleInfoString) as SaleInfoType) : null),
    [saleInfoString],
  )
  return saleInfo
}

export function useCurrentBlockNumber(api: ApiPromise | undefined) {
  const [currentBlockNumber, setCurrentBlockNumber] = useState(0)

  useEffect(() => {
    if (!api) return

    const fetchCurrentBlockNumber = async () => {
      const currentBlock = await getCurrentBlockNumber(api)
      setCurrentBlockNumber(currentBlock)
    }

    const intervalId = setInterval(fetchCurrentBlockNumber, 1000) as unknown as number

    return () => clearInterval(intervalId)
  }, [api])

  return currentBlockNumber
}

export function useCurrentRelayBlockNumber(relayApi: ApiPromise | undefined) {
  const [currentBlockNumber, setCurrentBlockNumber] = useState(0)

  useEffect(() => {
    if (!relayApi) return

    const fetchCurrentBlockNumber = async () => {
      const currentBlock = await getCurrentBlockNumber(relayApi)
      setCurrentBlockNumber(currentBlock)
    }

    const intervalId = setInterval(fetchCurrentBlockNumber, 1000) as unknown as number

    return () => clearInterval(intervalId)
  }, [relayApi])

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
