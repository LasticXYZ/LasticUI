import Border from '@/components/border/Border'
import CountDown from '@/components/countDown/CountDown'
import TimelineComponent from '@/components/timelineComp/TimelineComp'
import BuyWalletStatus from '@/components/walletStatus/BuyWalletStatus'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import { network_list } from '@/config/network'
import { useCurrentBlockNumber } from '@/hooks/useSubstrateQuery'
import { calculateCurrentPrice, saleStatus } from '@/utils/broker'
import { StatusCode } from '@/utils/broker/saleStatus'
import { getChainFromPath } from '@/utils/common/chainPath'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { GraphLike, SaleInitializedEvent, getClient } from '@poppyseed/squid-sdk'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import AnalyticSection from './AnalyticSection'

interface CoresSoldInThisSale {
  totalCount: number
}

export default function BrokerSaleInfo() {
  const { relayApi, api } = useInkathon()
  const [currentSaleRegion, setCurrentSaleRegion] = useState<SaleInitializedEvent | null>(null)
  const [coresSoldInThisSale, setCoresSoldInThisSale] = useState<CoresSoldInThisSale | null>(null)
  // Update saleStage every second based on the currentBlockNumber
  const [saleStage, setSaleStage] = useState('')
  const [saleTitle, setSaleTitle] = useState('')
  const [statusCode, setStatusCode] = useState<StatusCode | null>(null)
  const [timeRemaining, setTimeRemaining] = useState('')

  const client = useMemo(() => getClient(), [])
  const pathname = usePathname()
  const network = getChainFromPath(pathname)

  const currentBlockNumber = useCurrentBlockNumber(api)

  // const saleInfoString = useSubstrateQuery(api, 'saleInfo')
  // const configurationString = useSubstrateQuery(api, 'configuration')

  const configuration = network_list[network].configuration
  const brokerConstants = network_list[network].constants
  const tokenSymbol = network_list[network].tokenSymbol

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
  }, [currentSaleRegion])

  useEffect(() => {
    if (currentSaleRegion && configuration && brokerConstants) {
      const { statusMessage, timeRemaining, statusTitle, statusCode } = saleStatus(
        currentBlockNumber,
        currentSaleRegion,
        configuration,
        brokerConstants,
      )
      setTimeRemaining(timeRemaining)
      setSaleTitle(statusTitle)
      setSaleStage(statusMessage)
      setStatusCode(statusCode)
    }
  }, [currentBlockNumber, currentSaleRegion, configuration, brokerConstants])

  if (!api)
    return (
      <>
        <section className="mx-auto mb-5 max-w-9xl px-4 mt-5 sm:px-6 lg:px-8">
          <Border>
            <div className=" p-10">
              <WalletStatus
                redirectLocationMessage="Try on Rococo"
                redirectLocation="/rococo/bulkcore1"
                inactiveWalletMessage="Wait a moment... Connecting API."
              />
            </div>
          </Border>
        </section>
      </>
    )

  if (!currentSaleRegion || !configuration || !brokerConstants) {
    return (
      <>
        <section className="mx-auto mb-5 max-w-9xl px-4 mt-5 sm:px-6 lg:px-8">
          <Border>
            <div className=" p-10">
              <WalletStatus
                redirectLocationMessage="Try on Rococo"
                redirectLocation="/rococo/bulkcore1"
                customMessage="Loading ... or Chain not configured."
              />
            </div>
          </Border>
        </section>
      </>
    )
  }

  let currentPrice = calculateCurrentPrice(currentBlockNumber, currentSaleRegion, configuration)

  let analyticsData = [
    {
      title: `${(currentPrice / 10 ** 12).toFixed(4)} ${tokenSymbol}`,
      subtitle: 'Current Price',
      change: `${(currentPrice / 10 ** 12).toFixed(9)} ${tokenSymbol} to be exact`,
    },
    {
      title: `${coresSoldInThisSale?.totalCount} / ${currentSaleRegion?.coresOffered}`,
      subtitle: `Core sold out of ${currentSaleRegion?.coresOffered} available`,
      change: '',
    },
  ]

  return (
    <>
      <section className="mx-auto max-w-9xl px-4 mt-5 sm:px-6 lg:px-8">
        <Border>
          <div className=" p-10">
            <CountDown title={saleTitle} timeRemaining={timeRemaining} />

            <TimelineComponent
              currentBlockNumber={currentBlockNumber}
              saleInfo={currentSaleRegion}
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
                saleInfo={currentSaleRegion}
                coresSold={coresSoldInThisSale?.totalCount}
                firstCore={network_list[network].saleInfo?.firstCore || 0}
                formatPrice={`${(currentPrice / 10 ** 12).toFixed(8)} ${tokenSymbol}`}
                currentPrice={currentPrice}
                statusCode={statusCode}
              />
            </Border>
          </div>
        </div>
      </section>
    </>
  )
}
