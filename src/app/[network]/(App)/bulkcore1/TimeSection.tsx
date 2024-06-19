import Border from '@/components/border/Border'
import CountDown from '@/components/countDown/CountDown'
import TimelineComponent from '@/components/timelineComp/TimelineComp'
import BuyWalletStatus from '@/components/walletStatus/BuyWalletStatus'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import { network_list } from '@/config/network'
import { useCoresSold, useSaleRegion } from '@/hooks/subsquid'
import { useCurrentBlockNumber, useSaleInfo } from '@/hooks/useSubstrateQuery'
import { calculateCurrentPricePerCore, saleStatus } from '@/utils/broker'
import { StatusCode } from '@/utils/broker/saleStatus'
import { getChainFromPath } from '@/utils/common/chainPath'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { SquidClient, getClient } from '@poppyseed/squid-sdk'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import AnalyticSection from './AnalyticSection'

export default function BrokerSaleInfo() {
  const { api } = useInkathon()
  // Update saleStage every second based on the currentBlockNumber
  const [saleStage, setSaleStage] = useState('')
  const [saleTitle, setSaleTitle] = useState('')
  const [statusCode, setStatusCode] = useState<StatusCode | null>(null)
  const [timeRemaining, setTimeRemaining] = useState('')

  const client: SquidClient = useMemo(() => getClient(), [])
  const pathname = usePathname()
  const network = getChainFromPath(pathname)

  const currentBlockNumber = useCurrentBlockNumber(api)

  const configuration = network_list[network].configuration
  const brokerConstants = network_list[network].constants
  const tokenSymbol = network_list[network].tokenSymbol
  const decimalPoints = network_list[network].tokenDecimals

  const currentSaleRegion = useSaleRegion(network, client)

  const coresSoldInThisSale = useCoresSold(network, client, currentSaleRegion)

  const saleInfo = useSaleInfo(api)

  useEffect(() => {
    if (saleInfo && configuration && brokerConstants) {
      const { statusMessage, timeRemaining, statusTitle, statusCode } = saleStatus(
        currentBlockNumber,
        saleInfo,
        configuration,
        brokerConstants,
      )
      setTimeRemaining(timeRemaining)
      setSaleTitle(statusTitle)
      setSaleStage(statusMessage)
      setStatusCode(statusCode)
    }
  }, [currentBlockNumber, saleInfo, configuration, brokerConstants])

  if (!api || !saleInfo)
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

  if (!currentSaleRegion || !saleInfo || !configuration || !brokerConstants) {
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

  let currentPrice = calculateCurrentPricePerCore(currentBlockNumber, saleInfo, configuration)

  let analyticsData = [
    {
      title: `${currentPrice ? (currentPrice / 10 ** decimalPoints).toFixed(4) : '-'} ${tokenSymbol}`,
      subtitle: 'Current Price',
      change: `${currentPrice ? (currentPrice / 10 ** decimalPoints).toFixed(9) : '-'} ${tokenSymbol} to be exact`,
    },
    {
      title: `${saleInfo?.coresSold} / ${currentSaleRegion?.coresOffered}`,
      subtitle: `Cores sold or renewed out of ${currentSaleRegion?.coresOffered} available`,
      change: `${coresSoldInThisSale?.totalCount} cores sold in this sale`,
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
                saleInfo={currentSaleRegion}
                coresSold={saleInfo?.coresSold}
                firstCore={saleInfo?.firstCore || 0}
                formatPrice={`${currentPrice ? (currentPrice / 10 ** decimalPoints).toFixed(8) : '-'} ${tokenSymbol}`}
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
