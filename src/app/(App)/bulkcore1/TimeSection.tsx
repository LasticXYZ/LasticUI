import Border from '@/components/border/Border'
import TimelineComponent from '@/components/timelineComp/TimelineComp'
import TimelineUtilize from '@/components/timelineComp/TimelineUtilize'
import BuyWalletStatus from '@/components/walletStatus/BuyWalletStatus'
import { ApiPromise } from '@polkadot/api'
import {
  BrokerConstantsType,
  ConfigurationType,
  SaleInfoType,
  StatusType,
  blockTimeToUTC,
  blocksToTimeFormat,
  getConstants,
  getCurrentBlockNumber,
  useBalance,
  useInkathon,
} from '@poppyseed/lastic-sdk'
import { useEffect, useMemo, useState } from 'react'
import AnalyticSection from './AnalyticSection'

// Define a type for the queryParams
type QueryParams = (string | number | Record<string, unknown>)[]

const typeOfChain: 'PARA' | 'RELAY' | 'LOCAL' = 'PARA'

// Custom hook for querying substrate state
function useSubstrateQuery(
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

function useCurrentBlockNumber(api: ApiPromise | undefined) {
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

function useBrokerConstants(api: ApiPromise | undefined) {
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

function saleStatus(
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

function calculateCurrentPrice(
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

export default function BrokerSaleInfo() {
  const { api, relayApi, activeAccount } = useInkathon()
  let { tokenSymbol } = useBalance(activeAccount?.address, true)

  const currentBlockNumber = useCurrentBlockNumber(api)

  const saleInfoString = useSubstrateQuery(api, 'saleInfo')
  const configurationString = useSubstrateQuery(api, 'configuration')
  const statusString = useSubstrateQuery(api, 'status')

  const { brokerConstants, isLoading: isConstantsLoading } = useBrokerConstants(api)

  const saleInfo = useMemo(
    () => (saleInfoString ? (JSON.parse(saleInfoString) as SaleInfoType) : null),
    [saleInfoString],
  )
  const configuration = useMemo(
    () => (configurationString ? (JSON.parse(configurationString) as ConfigurationType) : null),
    [configurationString],
  )
  const status = useMemo(
    () => (statusString ? (JSON.parse(statusString) as StatusType) : null),
    [statusString],
  )

  // Update saleStage every second based on the currentBlockNumber
  const [saleStage, setSaleStage] = useState('')
  const [saleTitle, setSaleTitle] = useState('')
  const [timeRemaining, setTimeRemaining] = useState('')
  useEffect(() => {
    if (saleInfo && configuration && brokerConstants) {
      const { statusMessage, timeRemaining, statusTitle } = saleStatus(
        currentBlockNumber,
        saleInfo,
        configuration,
        brokerConstants,
      )
      setTimeRemaining(timeRemaining)
      setSaleTitle(statusTitle)
      setSaleStage(statusMessage)
    }
  }, [currentBlockNumber, saleInfo, configuration, brokerConstants])

  const [regionBeginTimestamp, setRegionBeginTimestamp] = useState<string | null>(null)
  const [regionEndTimestamp, setRegionEndTimestamp] = useState<string | null>(null)
  const [currentRelayBlock, setCurrentRelayBlock] = useState<number | null>(null)

  useEffect(() => {
    const fetchRegionTimestamps = async () => {
      try {
        if (saleInfo && brokerConstants) {
          const beginTimestamp = relayApi
            ? await blockTimeToUTC(relayApi, saleInfo.regionBegin * brokerConstants.timeslicePeriod)
            : null
          const endTimestamp = relayApi
            ? await blockTimeToUTC(relayApi, saleInfo.regionEnd * brokerConstants.timeslicePeriod)
            : null
          const getCurrentRelayBlock = relayApi ? await getCurrentBlockNumber(relayApi) : null

          setRegionBeginTimestamp(beginTimestamp)
          setRegionEndTimestamp(endTimestamp)
          setCurrentRelayBlock(getCurrentRelayBlock)
        }
      } catch (error) {
        console.error('Error fetching block timestamp:', error)
      }
    }

    fetchRegionTimestamps()
  }, [relayApi, saleInfo, brokerConstants])

  if (!api || !relayApi) return <div>API not available</div>

  if (
    !saleInfo ||
    !configuration ||
    !status ||
    !currentRelayBlock ||
    !brokerConstants ||
    isConstantsLoading
  ) {
    return <div>Loading...</div>
  }

  let currentPrice = calculateCurrentPrice(currentBlockNumber, saleInfo, configuration)

  let analyticsData = [
    {
      title: `${(currentPrice / 10 ** 12).toFixed(4)} ${tokenSymbol}`,
      subtitle: 'Current Price',
      change: `${(currentPrice / 10 ** 12).toFixed(9)} ${tokenSymbol} to be exact`,
    },
    {
      title: `${saleInfo?.coresSold} / ${saleInfo?.coresOffered}`,
      subtitle: `Core sold out of ${saleInfo?.coresOffered} available`,
      change: '',
    },
  ]

  return (
    <>
      <section className="mx-auto max-w-9xl px-4 mt-5 sm:px-6 lg:px-8">
        <Border>
          <div className=" p-10">
            <div>
              <div className="flex justify-between rounded-full mx-10 bg-pink-4 px-16 py-10 bg-opacity-30 items-center my-6">
                <div className="text-xl xl:text-2xl font-bold font-syncopate uppercase text-gray-21">
                  {saleTitle}
                </div>
                <div className="text-xl xl:text-2xl font-bold font-syncopate uppercase text-gray-18">
                  {timeRemaining}
                </div>
              </div>
            </div>
            <TimelineComponent
              currentBlockNumber={currentBlockNumber}
              saleInfo={saleInfo}
              config={configuration}
              constants={brokerConstants}
            />
            <TimelineUtilize
              currentRelayBlock={currentRelayBlock}
              saleInfo={saleInfo}
              config={configuration}
              constants={brokerConstants}
            />
            <div className="flex justify-center">
              <b className="pr-2">Sale Info:</b> {saleStage}
            </div>
          </div>
        </Border>
      </section>

      <section className="mx-auto max-w-9xl py-4 px-4 sm:px-6 lg:px-8 flex flex-col items-stretch">
        <div className="grid grid-cols-4 gap-8 flex-grow">
          <div className="col-span-1 flex flex-col items-stretch w-full">
            <AnalyticSection analytics={analyticsData} />
          </div>
          <div className="col-span-3 py-4">
            <Border className="h-full flex justify-center items-center">
              <BuyWalletStatus
                saleInfo={saleInfo}
                formatPrice={`${(currentPrice / 10 ** 12).toFixed(8)} ${tokenSymbol}`}
                currentPrice={currentPrice}
              />
            </Border>
          </div>
        </div>
      </section>
    </>
  )
}
