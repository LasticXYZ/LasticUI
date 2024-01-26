import Border from '@/components/border/Border'
import SecondaryButton from '@/components/button/SecondaryButton'
import TimelineComponent from '@/components/timelineComp/TimelineComp'
import TimelineUtilize from '@/components/timelineComp/TimelineUtilize'
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

  return (
    <>
      <section className="mt-8">
        <Border>
          <div className=" p-10">
            <div>
              <div className="flex justify-between rounded-full mx-10 bg-pink-4 px-16 py-10 bg-opacity-30 items-center my-6">
                <div className="text-xl font-bold font-syncopate text-gray-21">{saleTitle}</div>
                <div className="text-2xl font-bold font-syncopate text-gray-18">
                  {timeRemaining}
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <b className="pr-2">Sale Info:</b> {saleStage}
            </div>
            <TimelineComponent
              currentBlockNumber={currentBlockNumber}
              saleInfo={saleInfo}
              config={configuration}
              constants={brokerConstants}
            />
            <div className="pt-5 pl-10">
              <h3 className="text-xl font-syncopate font-bold">Utilization</h3>
            </div>
            <TimelineUtilize
              currentRelayBlock={currentRelayBlock}
              saleInfo={saleInfo}
              config={configuration}
              constants={brokerConstants}
            />
            <div className="pt-5 pl-10">
              <h3 className="text-xl font-syncopate font-bold">Note</h3>
            </div>
            <div className="flex flex-row justify-between">
              <div className="flex flex-col italic max-w-md text-gray-12 items-center justify-center px-2 py-8">
                Note: Since this core is split up you are not eligible for renewal. You are however able to:
                <ul className='px-4 py-2'>
                  <li> * Sell your Bulk Coretime - list it first on Bulk Coretime market</li>
                  <li> * Utilize it - Make sure to have your Parachain ready in order to test it out.</li>
                  <li> * Split it up</li>
                  <li> * Recombine it</li>
                  <li> * Assign it to a task</li>
                </ul>
              </div>
              <div className='grid grid-cols-2 gap-4 py-10'>
                <div className="text-2xl font-bold font-syncopate text-gray-21">
                  <SecondaryButton title="List this core" location="/instacore" />
                </div>
                <div className="text-2xl font-bold font-syncopate text-gray-21">
                  <SecondaryButton title="renew Core" location="/instacore" disabled={false} />
                </div>
                <div className="text-2xl font-bold font-syncopate text-gray-21">
                  <SecondaryButton title="Combine core" location="/instacore" />
                </div>
                <div className="text-2xl font-bold font-syncopate text-gray-21">
                  <SecondaryButton title="Split up core" location="/instacore" />
                </div>
              </div>

            </div>

          </div>
        </Border>
      </section>

    </>
  )
}
