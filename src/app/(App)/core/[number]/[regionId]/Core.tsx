import Border from '@/components/border/Border'
import AssignModal from '@/components/broker/extrinsics/AssignModal'
import InterlaceCoreModal from '@/components/broker/extrinsics/InterlaceCoreModal'
import PartitionCoreModal from '@/components/broker/extrinsics/PartitionCoreModal'
import TransferModal from '@/components/broker/extrinsics/TransferModal'
import SecondaryButton from '@/components/button/SecondaryButton'
import CoreItemExtensive from '@/components/cores/CoreItemExtensive'
import TimelineComponent from '@/components/timelineComp/TimelineComp'
import TimelineUtilizeCore from '@/components/timelineComp/TimelineUtilizeCore'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import { parseNativeTokenToHuman } from '@/utils/account/token'
import {
  calculateCurrentPrice,
  saleStatus,
  useBrokerConstants,
  useCurrentBlockNumber,
  useQuerySpecificRegion,
  useSubstrateQuery,
} from '@/utils/broker'
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

export default function BrokerRegionData({
  coreNb,
  regionId,
}: {
  coreNb: number
  regionId: number
}) {
  const { activeAccount, relayApi, activeChain, api } = useInkathon()
  let { tokenSymbol, tokenDecimals } = useBalance(activeAccount?.address, true)
  const region = useQuerySpecificRegion({ api, coreNb, regionId })

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

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isPartitionModalOpen, setIsPartitionModalOpen] = useState(false)
  const [isInterlaceModalOpen, setIsInterlaceModalOpen] = useState(false)

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
      <Border className="mt-5">
        <WalletStatus inactiveWalletMessage="Connecting to chain..." />
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
      <Border className="mt-5">
        <WalletStatus
          customEmoji="🤷‍♀️"
          inactiveWalletMessage="Connecting to chain..."
          customColor="bg-purple-2"
          customMessage="No region for this core number found"
        />
      </Border>
    )
  }

  let currentPrice = calculateCurrentPrice(currentBlockNumber, saleInfo, configuration)

  return (
    <>
      <Border className="mt-5">
        <div className="h-full w-full flex flex-col justify-left items-left">
          <div>
            <div className="">
              <CoreItemExtensive
                timeBought="Jan 2024"
                owner={region.owner.owner}
                amITheOwner={region.owner.owner === activeAccount.address}
                paid={region.owner.paid}
                coreNumber={region.detail[0].core}
                size="1"
                phase="- Period"
                cost={parseNativeTokenToHuman({ paid: region.owner.paid, decimals: tokenDecimals })}
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
          <div className="p-10">
            <div>
              <div className="flex justify-between rounded-full mx-10 bg-pink-4 px-16 py-10 bg-opacity-30 items-center my-6">
                <div className="text-xl font-bold font-unbounded uppercase text-gray-21">
                  {saleTitle}
                </div>
                <div className="text-2xl font-bold font-unbounded uppercase text-gray-18">
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

            <div className="pt-5 pl-10">
              <h3 className="text-xl font-unbounded uppercase font-bold">Utilization</h3>
            </div>

            <TimelineUtilizeCore
              currentRelayBlock={currentRelayBlock}
              beginRegion={regionId}
              config={configuration}
              constants={brokerConstants}
            />

            <div className="pt-5 pl-10">
              <h3 className="text-xl font-unbounded uppercase font-bold">Note</h3>
            </div>

            <div className="flex flex-row flex-wrap justify-between">
              {region.owner.owner === activeAccount.address ? (
                <>
                  <div className="flex flex-col italic max-w-md text-gray-12 items-start justify-center px-4 py-8">
                    This core is yours. You are able to:
                    <ul className="px-2 py-2">
                      <li> * Transfer your core to another account</li>
                      <li> * Utilize it for a parachain</li>
                      <li> * Split it up</li>
                      <li> * Change block production frequency</li>
                      <li> * Assign it to a task</li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 py-10">
                    {/* Buttons*/}
                    <div className="text-2xl font-bold font-unbounded uppercase text-gray-21">
                      <SecondaryButton
                        title="Transfer Core"
                        onClick={() => setIsTransferModalOpen(true)}
                        className="w-full"
                      />
                    </div>

                    <div className="text-2xl font-bold font-unbounded uppercase text-gray-21">
                      <SecondaryButton
                        title="Assign Core"
                        onClick={() => setIsAssignModalOpen(true)}
                        className="w-full"
                      />
                    </div>

                    <div className="text-2xl font-bold font-unbounded uppercase text-gray-21 break-words">
                      <SecondaryButton
                        title="Change Frequency"
                        onClick={() => setIsInterlaceModalOpen(true)}
                        className="w-full"
                      />
                    </div>

                    <div className="text-2xl font-bold font-unbounded uppercase text-gray-21">
                      <SecondaryButton
                        title="Split Core"
                        onClick={() => setIsPartitionModalOpen(true)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col italic max-w-3xl text-gray-12 items-center justify-center px-2 py-8">
                  Note: You do not own this core. After buying a core you will be able to: Transfer
                  it, Utilize it, Split it up, or change its frequency.
                </div>
              )}
            </div>
          </div>
        </Border>
      </section>

      <>
        {/* Modals*/}
        <TransferModal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          regionId={{
            begin: region.detail[0].begin.replace(/,/g, ''),
            core: region.detail[0].core,
            mask: region.detail[0].mask,
          }}
        />

        <AssignModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          regionId={{
            begin: region.detail[0].begin.replace(/,/g, ''),
            core: region.detail[0].core,
            mask: region.detail[0].mask,
          }}
        />

        <PartitionCoreModal
          isOpen={isPartitionModalOpen}
          onClose={() => setIsPartitionModalOpen(false)}
          regionId={{
            begin: region.detail[0].begin.replace(/,/g, ''),
            core: region.detail[0].core,
            mask: region.detail[0].mask,
          }}
        />

        <InterlaceCoreModal
          isOpen={isInterlaceModalOpen}
          onClose={() => setIsInterlaceModalOpen(false)}
          regionId={{
            begin: region.detail[0].begin.replace(/,/g, ''),
            core: region.detail[0].core,
            mask: region.detail[0].mask,
          }}
        />
      </>
    </>
  )
}
