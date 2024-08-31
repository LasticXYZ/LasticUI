import Border from '@/components/border/Border'
import SecondaryButton from '@/components/button/SecondaryButton'
import CoreItemExtensive from '@/components/cores/CoreItemExtensive'
import CountDown from '@/components/countDown/CountDown'
import ListingsModal from '@/components/extrinsics/broker/AddListingsModal'
import AssignModal from '@/components/extrinsics/broker/AssignModal'
import InterlaceCoreModal from '@/components/extrinsics/broker/InterlaceCoreModal'
import PartitionCoreModal from '@/components/extrinsics/broker/PartitionCoreModal'
import TransferModal from '@/components/extrinsics/broker/TransferModal'
import TimelineComponent from '@/components/timelineComp/TimelineComp'
import TimelineUtilizeCore from '@/components/timelineComp/TimelineUtilizeCore'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import { network_list } from '@/config/network'
import { useCurrentBlockNumber, useCurrentRelayBlockNumber, useSaleInfo } from '@/hooks/substrate'
import { useListings } from '@/hooks/useListings'
import { saleStatus } from '@/utils/broker'
import { utilizationStatus } from '@/utils/broker/utilizationStatus'
import { getChainFromPath } from '@/utils/common/chainPath'
import { encodeAddress } from '@polkadot/util-crypto'
import { blockTimeToUTC, useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import { CoreOwnerEvent, GraphLike, GraphQuery, getClient } from '@poppyseed/squid-sdk'
import { usePathname } from 'next/navigation'
import { FC, useEffect, useMemo, useState } from 'react'

interface BrokerRegionDataProps {
  coreNb: number
  beginRegion: number
  mask: string
}

const BrokerRegionData: FC<BrokerRegionDataProps> = ({ coreNb, beginRegion, mask }) => {
  const [saleStage, setSaleStage] = useState('')
  const [saleTitle, setSaleTitle] = useState('')
  const [timeRemaining, setTimeRemaining] = useState('')
  const [utilizationStage, setUtilizationStage] = useState('')
  const [utilizationTitle, setUtilizationTitle] = useState('')
  const [utilizationTimeRemaining, setUtilizationTimeRemaining] = useState('')

  const [regionBeginTimestamp, setRegionBeginTimestamp] = useState<string | null>(null)
  const [regionEndTimestamp, setRegionEndTimestamp] = useState<string | null>(null)

  const [isListingsModalOpen, setIsListingsModalOpen] = useState(false)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isPartitionModalOpen, setIsPartitionModalOpen] = useState(false)
  const [isInterlaceModalOpen, setIsInterlaceModalOpen] = useState(false)

  const { activeAccount, relayApi, activeChain, api } = useInkathon()
  let { tokenSymbol, tokenDecimals } = useBalance(activeAccount?.address, true)
  const [region, setRegionResult] = useState<CoreOwnerEvent | null>(null)
  //const region = useQuerySpecificRegion({ api, coreNb, regionId, mask })

  const client = useMemo(() => getClient(), [])
  const pathname = usePathname()
  const network = getChainFromPath(pathname)
  const configuration = network_list[network].configuration
  const brokerConstants = network_list[network].constants
  const { listings } = useListings()
  const isCoreListed = listings.some(
    (listing) =>
      listing.coreNumber === coreNb &&
      listing.mask === mask &&
      listing.begin === region?.regionId.begin?.toString() &&
      listing.status !== 'completed' &&
      listing.status !== 'cancelled',
  )

  const currentBlockNumber = useCurrentBlockNumber(api)
  const currentRelayBlock = useCurrentRelayBlockNumber(relayApi)

  const saleInfo = useSaleInfo(api)

  useEffect(() => {
    let query: GraphQuery | undefined

    if (saleInfo && configuration) {
      if (saleInfo.regionBegin) {
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
  }, [network, saleInfo, client, configuration, coreNb, beginRegion, mask])

  useEffect(() => {
    if (saleInfo && region && currentRelayBlock && configuration && brokerConstants) {
      const { statusMessage, timeRemaining, statusTitle } = saleStatus(
        currentBlockNumber,
        saleInfo,
        configuration,
        brokerConstants,
      )
      setTimeRemaining(timeRemaining)
      setSaleTitle(statusTitle)
      setSaleStage(statusMessage)

      const {
        statusMessage: utilizationStatusMessage,
        timeRemaining: utilizationTimeRemaining,
        utilizationCode: utilizationStatusTitle,
      } = utilizationStatus(currentRelayBlock, region, configuration, brokerConstants)

      setUtilizationStage(utilizationStatusMessage)
      setUtilizationTitle(utilizationStatusTitle)
      setUtilizationTimeRemaining(utilizationTimeRemaining)
    }
  }, [currentBlockNumber, currentRelayBlock, saleInfo, region, configuration, brokerConstants])

  useEffect(() => {
    const fetchRegionTimestamps = async () => {
      try {
        if (saleInfo && region?.regionId?.begin && region.duration && brokerConstants) {
          const beginTimestamp = relayApi
            ? await blockTimeToUTC(
                relayApi,
                region.regionId.begin * brokerConstants.timeslicePeriod,
              )
            : null
          const endTimestamp = relayApi
            ? await blockTimeToUTC(
                relayApi,
                (region.regionId.begin + region.duration) * brokerConstants.timeslicePeriod,
              )
            : null

          setRegionBeginTimestamp(beginTimestamp)
          setRegionEndTimestamp(endTimestamp)
        }
      } catch (error) {
        console.error('Error fetching block timestamp:', error)
      }
    }

    fetchRegionTimestamps()
  }, [region, relayApi, brokerConstants, saleInfo])

  if (!api || !relayApi || !configuration) {
    return (
      <Border className="mt-5">
        <WalletStatus inactiveWalletMessage="Connecting to chain..." />
      </Border>
    )
  }

  if (
    !region ||
    !configuration ||
    !saleInfo ||
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
                config={configuration}
                constants={brokerConstants}
                region={region}
                timeBought={region.timestamp ? new Date(region.timestamp).toLocaleString() : '-'}
                owner={region.owner}
                amITheOwner={
                  region.owner ===
                  (activeAccount
                    ? encodeAddress(activeAccount.address, activeChain?.ss58Prefix || 42)
                    : null)
                }
                paid={region.price}
                coreNumber={region.regionId.core}
                currencyCost={tokenSymbol}
                utilizationStatus={`${utilizationTitle} ${utilizationTimeRemaining}`}
              />
            </div>
          </div>
        </div>
      </Border>

      {/* Time Section */}
      <section className="mt-8">
        <Border>
          <div className="p-10">
            {/* Utilization */}
            <div className="pt-5 pl-10">
              <h3 className="text-xl font-unbounded uppercase font-bold">Utilization</h3>
            </div>
            <CountDown title={utilizationTitle} timeRemaining={utilizationTimeRemaining} />

            <TimelineUtilizeCore
              currentRelayBlock={currentRelayBlock}
              beginRegion={region.regionId.begin}
              config={configuration}
              constants={brokerConstants}
            />
            <div className="flex justify-center items-center mb-5">
              <b className="mr-5 ">Utilization Status:</b> {utilizationStage}
            </div>

            {/* Sale Info */}
            <div className="pt-5 pl-10">
              <h3 className="text-xl font-unbounded uppercase font-bold">Sale Info</h3>
            </div>
            <CountDown title={saleTitle} timeRemaining={timeRemaining} />

            <TimelineComponent
              currentBlockNumber={currentBlockNumber}
              saleInfo={saleInfo}
              config={configuration}
              constants={brokerConstants}
            />

            {region.assigned || region.pooled ? (
              (region.assigned && (
                <>
                  <div className="pt-5 pl-10">
                    <h3 className="text-xl font-unbounded uppercase font-bold">Assigned</h3>
                  </div>
                  <div className="flex flex-row flex-wrap justify-between">
                    <div className="flex flex-col italic max-w-3xl text-gray-12 items-center justify-center px-2 py-8">
                      Note: This region is Assigned.
                    </div>
                  </div>
                </>
              )) ||
              (region.pooled && (
                <>
                  <div className="pt-5 pl-10">
                    <h3 className="text-xl font-unbounded uppercase font-bold">Pooled</h3>
                  </div>
                  <div className="flex flex-row flex-wrap justify-between">
                    <div className="flex flex-col italic max-w-3xl text-gray-12 items-center justify-center px-2 py-8">
                      Note: This region is in the On Demand Pool.
                    </div>
                  </div>
                </>
              ))
            ) : (
              <div className="flex flex-row flex-wrap justify-between">
                {region.owner ===
                (activeAccount
                  ? encodeAddress(activeAccount.address, activeChain?.ss58Prefix || 42)
                  : null) ? (
                  <>
                    <div className="pt-5 pl-10">
                      <h3 className="text-xl font-unbounded uppercase font-bold">Note</h3>
                    </div>
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
                      {!isCoreListed && network === 'rococo' && (
                        <div className="text-2xl font-bold uppercase relative w-full max-w-xs mx-auto">
                          <div className="absolute right-0 top-0 transform translate-x-1/4 -translate-y-1/3 bg-red-4 border border-gray-8 px-2 py-1 text-xs font-semibold uppercase rounded-full shadow-lg z-10">
                            Beta
                          </div>

                          <SecondaryButton
                            title="List Core for Sale"
                            onClick={() => setIsListingsModalOpen(true)}
                            className="w-full"
                          />
                        </div>
                      )}
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
                  <>
                    <div className="pt-5 pl-10">
                      <h3 className="text-xl font-unbounded uppercase font-bold">Note</h3>
                    </div>
                    <div className="flex flex-col italic max-w-3xl text-gray-12 items-center justify-center px-2 py-8">
                      Note: You do not own this core. After buying a core you will be able to:
                      Transfer it, Utilize it, Split it up, or change its frequency.
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </Border>
      </section>

      <>
        {/* Modals*/}

        <ListingsModal
          isOpen={isListingsModalOpen}
          onClose={() => setIsListingsModalOpen(false)}
          regionId={{
            begin: region.regionId.begin.toString(),
            core: region.regionId.core.toString(),
            mask: region.regionId.mask,
          }}
        />

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
