import Border from '@/components/border/Border'
import CountDown from '@/components/countDown/CountDown'
import TimelineComponent from '@/components/timelineComp/TimelineComp'
import { network_list } from '@/config/network'
import { useSaleRegion } from '@/hooks/subsquid'
import { useCurrentBlockNumber, useSaleInfo } from '@/hooks/substrate'
import { saleStatus } from '@/utils/broker'
import { StatusCode } from '@/utils/broker/saleStatus'
import { getChainFromPath } from '@/utils/common/chainPath'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { SquidClient, getClient } from '@poppyseed/squid-sdk'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

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
  const currentSaleRegion = useSaleRegion(network, client)

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

  if (!api || !saleInfo) return null

  if (!currentSaleRegion || !saleInfo || !configuration || !brokerConstants) {
    return null
  }

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
            <div className="flex justify-start ml-2">
              <b className="pr-2">Timeline Info:</b> {saleStage}
            </div>
            <div className="flex justify-start ml-2 mt-2">
              <b className="pr-2">Info:</b> Best time to renew your core is in the renewal period.
              If you didnt remember to renew your core, you can still renew it in the purchasing
              period but not when all the cores are sold out.
            </div>
          </div>
        </Border>
      </section>
    </>
  )
}
