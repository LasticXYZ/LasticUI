import Border from '@/components/border/Border'
import TimelineComponent from '@/components/timelineComp/TimelineComp'
import BuyWalletStatus from '@/components/walletStatus/BuyWalletStatus'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import {
  useBrokerConstants,
  useCurrentBlockNumber,
  useSubstrateQuery,
} from '@/hooks/useSubstrateQuery'
import { saleStatus } from '@/utils/broker'
import {
  ConfigurationType,
  SaleInfoType,
  StatusType,
  blockTimeToUTC,
  getCurrentBlockNumber,
  useBalance,
  useInkathon,
} from '@poppyseed/lastic-sdk'
import { useEffect, useMemo, useState } from 'react'
import AnalyticSection from './AnalyticSection'

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
    return <WalletStatus />
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
              <div className="flex justify-between rounded-full mx-10 bg-pink-4 dark:bg-pink-400 dark:bg-opacity-95  px-16 py-10 bg-opacity-30 items-center my-6">
                <div className="text-xl xl:text-2xl font-bold font-unbounded uppercase text-gray-21 dark:text-white ">
                  {saleTitle}
                </div>
                <div className="text-xl xl:text-2xl font-bold font-unbounded uppercase text-gray-18 dark:text-white ">
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
