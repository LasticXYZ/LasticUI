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
import { network_list } from '@/config/network'
import { parseNativeTokenToHuman } from '@/utils/account/token'
import { calculateCurrentPrice, saleStatus, useCurrentBlockNumber } from '@/utils/broker'
import { getChainFromPath } from '@/utils/common/chainPath'
import {
  blockTimeToUTC,
  getCurrentBlockNumber,
  useBalance,
  useInkathon,
} from '@poppyseed/lastic-sdk'
import {
  CoreOwnerEvent,
  GraphLike,
  GraphQuery,
  SaleInitializedEvent,
  getClient,
} from '@poppyseed/squid-sdk'
import { usePathname } from 'next/navigation'
import { FC, useEffect, useMemo, useState } from 'react'

interface BrokerRegionDataProps {
  coreNb: number
  beginRegion: number
  mask: string
}

const BrokerRegionData: FC<BrokerRegionDataProps> = ({ coreNb, beginRegion, mask }) => {
  const { activeAccount, relayApi, activeRelayChain, activeChain, api } = useInkathon()
  let { tokenSymbol, tokenDecimals } = useBalance(activeAccount?.address, true)
  const [region, setRegionResult] = useState<CoreOwnerEvent | null>(null)
  const [currentSaleRegion, setCurrentSaleRegion] = useState<SaleInitializedEvent | null>(null)
  const client = useMemo(() => getClient(), [])
  const network = activeRelayChain?.network
  const pathname = usePathname()
  const configuration = network_list[getChainFromPath(pathname)].configuration
  const brokerConstants = network_list[getChainFromPath(pathname)].constants

  //const region = useQuerySpecificRegion({ api, coreNb, regionId: beginRegion, mask })

  const currentBlockNumber = useCurrentBlockNumber(api)

  let query: GraphQuery

  useMemo(() => {
    query = client.eventAllSaleInitialized(1)
    if (network && query) {
      const fetchData = async () => {
        const fetchedResult: GraphLike<SaleInitializedEvent[]> = await client.fetch(network, query)
        const currentSaleRegion: SaleInitializedEvent | null = fetchedResult?.data.event
          ? fetchedResult.data.event[0]
          : null
        setCurrentSaleRegion(currentSaleRegion)
      }

      fetchData()
    }
  }, [network, client])

  useEffect(() => {
    if (activeAccount && currentSaleRegion && configuration) {
      if (currentSaleRegion.regionBegin) {
        query = client.eventSpecificRegionCoreOwner(coreNb, beginRegion, mask)
      }
    }

    if (network && query) {
      const fetchData = async () => {
        const fetchedResult: GraphLike<CoreOwnerEvent[]> = await client.fetch(network, query)
        const region = fetchedResult?.data.event ? fetchedResult.data.event[0] : null
        setRegionResult(region)
      }

      fetchData()
    }
  }, [activeAccount, network, currentSaleRegion, client])

  // Update saleStage every second based on the currentBlockNumber
  const [saleStage, setSaleStage] = useState('')
  const [saleTitle, setSaleTitle] = useState('')
  const [timeRemaining, setTimeRemaining] = useState('')
  useEffect(() => {
    if (currentSaleRegion && configuration && brokerConstants) {
      const { statusMessage, timeRemaining, statusTitle } = saleStatus(
        currentBlockNumber,
        currentSaleRegion,
        configuration,
        brokerConstants,
      )
      setTimeRemaining(timeRemaining)
      setSaleTitle(statusTitle)
      setSaleStage(statusMessage)
    }
  }, [currentBlockNumber, currentSaleRegion, configuration, brokerConstants])

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
        if (
          currentSaleRegion &&
          currentSaleRegion.regionBegin &&
          currentSaleRegion.regionEnd &&
          brokerConstants
        ) {
          const beginTimestamp = relayApi
            ? await blockTimeToUTC(
                relayApi,
                currentSaleRegion.regionBegin * brokerConstants.timeslicePeriod,
              )
            : null
          const endTimestamp = relayApi
            ? await blockTimeToUTC(
                relayApi,
                currentSaleRegion.regionEnd * brokerConstants.timeslicePeriod,
              )
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
  }, [relayApi, brokerConstants, currentSaleRegion])

  if (!activeChain || !activeAccount || !api || !relayApi || !configuration) {
    return (
      <Border className="mt-5">
        <WalletStatus inactiveWalletMessage="Connecting to chain..." />
      </Border>
    )
  }

  let currentPrice = calculateCurrentPrice(currentBlockNumber, currentSaleRegion, configuration)

  if (
    !region ||
    !configuration ||
    !currentSaleRegion ||
    !currentRelayBlock ||
    !brokerConstants ||
    !region.duration ||
    !region.regionId.core ||
    !region.regionId.begin ||
    !region.regionId.mask ||
    !region.owner
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

  return (
    <>
      <Border className="mt-5">
        <div className="h-full w-full flex flex-col justify-left items-left">
          <div>
            <div className="">
              <CoreItemExtensive
                timeBought="- 2024"
                owner={region.owner}
                amITheOwner={region.owner === activeAccount.address}
                paid={region.price}
                coreNumber={region.regionId.core}
                phase="- Period"
                cost={parseNativeTokenToHuman({ paid: region.price, decimals: tokenDecimals })}
                currencyCost={tokenSymbol}
                mask={region.regionId.mask}
                begin={region.regionId.begin}
                end={region.duration + region.regionId.begin}
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
              <div className="flex justify-between rounded-full mx-10 bg-pink-300 dark:bg-pink-400  px-16 py-10 bg-opacity-30 dark:bg-opacity-80 items-center my-6">
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
              saleInfo={currentSaleRegion}
              config={configuration}
              constants={brokerConstants}
            />

            <div className="pt-5 pl-10">
              <h3 className="text-xl font-unbounded uppercase font-bold">Utilization</h3>
            </div>

            <TimelineUtilizeCore
              currentRelayBlock={currentRelayBlock}
              beginRegion={region.regionId.begin}
              config={configuration}
              constants={brokerConstants}
            />

            <div className="pt-5 pl-10">
              <h3 className="text-xl font-unbounded uppercase font-bold">Note</h3>
            </div>

            <div className="flex flex-row flex-wrap justify-between">
              {region.owner === activeAccount.address ? (
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

                    <div className="text-2xl font-bold uppercase relative w-full max-w-xs mx-auto">
                      {/* Overlay "New" Banner */}
                      <div className="absolute right-0 top-0 transform translate-x-1/4 -translate-y-1/3 bg-pink-3 border border-gray-8 px-2 py-1 text-xs font-semibold uppercase rounded-full shadow-lg z-10">
                        New
                      </div>
                      <SecondaryButton
                        title="Change Frequency"
                        onClick={() => setIsInterlaceModalOpen(true)}
                        className="w-full"
                      />
                    </div>

                    <div className="text-2xl font-bold uppercase relative w-full max-w-xs mx-auto">
                      {/* Overlay "New" Banner */}
                      <div className="absolute right-0 top-0 transform translate-x-1/4 -translate-y-1/3 bg-pink-3 border border-gray-8 px-2 py-1 text-xs font-semibold uppercase rounded-full shadow-lg z-10">
                        New
                      </div>

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
            begin: region.regionId.begin.toString(),
            core: region.regionId.core.toString(),
            mask: region.regionId.mask,
          }}
        />

        <AssignModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          regionId={{
            begin: region.regionId.begin.toString(),
            core: region.regionId.core.toString(),
            mask: region.regionId.mask,
          }}
        />

        <PartitionCoreModal
          isOpen={isPartitionModalOpen}
          onClose={() => setIsPartitionModalOpen(false)}
          regionId={{
            begin: region.regionId.begin.toString(),
            core: region.regionId.core.toString(),
            mask: region.regionId.mask,
          }}
        />

        <InterlaceCoreModal
          isOpen={isInterlaceModalOpen}
          onClose={() => setIsInterlaceModalOpen(false)}
          regionId={{
            begin: region.regionId.begin.toString(),
            core: region.regionId.core.toString(),
            mask: region.regionId.mask,
          }}
        />
      </>
    </>
  )
}

export default BrokerRegionData
