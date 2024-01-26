import Border from '@/components/border/Border';
import SecondaryButton from '@/components/button/SecondaryButton';
import CoreItemExtensive from '@/components/cores/CoreItemExtensive';
import TimelineComponent from '@/components/timelineComp/TimelineComp';
import TimelineUtilize from '@/components/timelineComp/TimelineUtilize';
import WalletStatus from '@/components/walletStatus/WalletStatus';
import { parseNativeTokenToHuman } from '@/utils/account/token';
import { calculateCurrentPrice, querySpecificRegion, saleStatus, useBrokerConstants, useCurrentBlockNumber, useSubstrateQuery } from '@/utils/broker';
import {
  ConfigurationType,
  SaleInfoType,
  StatusType,
  blockTimeToUTC,
  getCurrentBlockNumber,
  useBalance,
  useInkathon
} from '@poppyseed/lastic-sdk';
import { useEffect, useMemo, useState } from 'react';

export default function BrokerRegionData({ coreNb }: { coreNb: number }) {
  const { activeAccount, relayApi, activeChain, api } = useInkathon()
  let { tokenSymbol, tokenDecimals } = useBalance(activeAccount?.address, true)
  const region = querySpecificRegion({ api, coreNb })

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
  

  if (!activeChain || !activeAccount || !api || !relayApi) {
    return (
      <Border className='mt-5'>
        <WalletStatus 
          inactiveWalletMessage='Connecting to chain...'
        />
      </Border>
    )
  }

  if (
    !region ||
    !saleInfo ||
    !configuration ||
    !status ||
    !currentRelayBlock ||
    !brokerConstants ||
    isConstantsLoading
    ) {
    return (
      <Border className='mt-5'>
        <WalletStatus
          customEmoji='🤷‍♀️'
          inactiveWalletMessage='Connecting to chain...'
          customColor='bg-purple-2'
          customMessage='No region for this core number found'
        />
      </Border>
    )
  }

  let currentPrice = calculateCurrentPrice(currentBlockNumber, saleInfo, configuration)


  return (
  <>
    <Border className='mt-5'>
      <div className="h-full w-full flex flex-col justify-left items-left">
        <div>
          <div className="">
            <CoreItemExtensive
              timeBought="Jan 2024"
              coreNumber={region.detail[0].core}
              size="1"
              phase="- Period"
              cost={parseNativeTokenToHuman({paid: region.owner.paid, decimals: tokenDecimals})}
              reward="0"
              currencyCost={tokenSymbol}
              currencyReward="LASTIC"
              mask={region.detail[0].mask}
              begin={region.detail[0].begin}
              end={region.owner.end}
              />
          </div>
        </div>
      </div>
    </Border>
    {/* Time Section */}
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
