'use client'
import Border from '@/components/border/Border'
import PrimaryButton from '@/components/button/PrimaryButton'
import Modal from '@/components/modal/Modal'
import { useRegionQuery } from '@/hooks/useRegionQuery'
import { RegionIdProps } from '@/types/broker'
import { useBrokerConstants } from '@/utils/broker'
import { MobileDateTimePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { ApiPromise } from '@polkadot/api'
import {
  RELAY_CHAIN_BLOCK_TIME,
  TxButtonProps,
  blockTimeToUTC,
  useInkathon,
  useTxButton,
} from '@poppyseed/lastic-sdk'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'

type regionTimeSpan = {
  start: { region: number; blocknumber: number; utc: Date | null }
  end: { region: number; blocknumber: number; utc: Date | null }
}

type timeslice = number

interface PartitionCoreModalProps {
  isOpen: boolean
  onClose: () => void
  regionId: RegionIdProps
}

const PartitionCoreModal: FC<PartitionCoreModalProps> = ({ isOpen, onClose, regionId }) => {
  const { api, activeSigner, activeAccount, activeChain, relayApi } = useInkathon()
  const { brokerConstants } = useBrokerConstants(api)
  const [selectedDateTime, setSelectedDateTime] = useState<Date | undefined | null>(null)
  const [pivotOptions, setPivotOptions] = useState<pivotInfo[]>([])
  const [selectedPivotOffset, setSelectedPivotOffset] = useState<timeslice | undefined>(undefined)
  const txButtonProps: TxButtonProps = {
    api,
    setStatus: (status: string | null) => console.log('tx status:', status),
    attrs: {
      palletRpc: 'broker',
      callable: 'partition',
      inputParams: [regionId, selectedPivotOffset],
      paramFields: [
        { name: 'region_id', type: 'Object', optional: false },
        { name: 'pivot', type: 'string', optional: false },
      ],
    },
    type: 'SIGNED-TX',
    activeAccount,
    activeSigner,
  }
  const { transaction, status, allParamsFilled } = useTxButton(txButtonProps)
  const regionData = useRegionQuery()
  const [regionTimeSpan, setRegionTimeSpan] = useState<regionTimeSpan>({
    start: { region: 0, blocknumber: 0, utc: null },
    end: { region: 0, blocknumber: 0, utc: null },
  })
  let blocktimeRelay = RELAY_CHAIN_BLOCK_TIME / 1000

  const pivotPercentage =
    selectedPivotOffset && regionTimeSpan.end.region
      ? (selectedPivotOffset / (regionTimeSpan.end.region - regionTimeSpan.start.region)) * 100
      : 0

  /**
   * useEffect fetches the start and end times of the region and sets the regionTimeSpan state.
   */
  useEffect(() => {
    const fetchTimes = async () => {
      if (regionData && relayApi) {
        let timeslicePeriod = brokerConstants?.timeslicePeriod ?? 0

        // filter by core id, owner and region begin!
        let region = regionData.find(
          (r) =>
            r.detail[0].core === regionId.core &&
            r.owner.owner === activeAccount?.address &&
            r.detail[0].begin.replace(/,/g, '') === regionId.begin,
        )

        if (region) {
          let startBlock = Number(region.detail[0].begin.replace(/,/g, '')) * timeslicePeriod
          let endBlock = Number(region.owner.end.replace(/,/g, '')) * timeslicePeriod

          let regionStartString = await blockTimeToUTC(relayApi, startBlock)
          let regionEndString = await blockTimeToUTC(relayApi, endBlock)

          let coreStartUtc = regionStartString ? new Date(regionStartString) : null
          let coreEndUtc = regionEndString ? new Date(regionEndString) : null

          setRegionTimeSpan({
            start: { region: Number(regionId.begin), blocknumber: startBlock, utc: coreStartUtc },
            end: {
              region: Number(region.owner.end.replace(/,/g, '')),
              blocknumber: endBlock,
              utc: coreEndUtc,
            },
          })
        }
      }
    }

    fetchTimes()
  }, [regionData, relayApi])

  useEffect(() => {
    setPivotOptions([])
    setSelectedPivotOffset(undefined)
  }, [selectedDateTime])

  const handleAccept = async (newValue: Date | null) => {
    setSelectedDateTime(newValue || undefined)

    // Ensure newValue is not null, all required data is available, and the selected datetime is within the region's timespan
    if (
      newValue &&
      relayApi &&
      regionTimeSpan.start.region &&
      regionTimeSpan.end.region &&
      brokerConstants?.timeslicePeriod &&
      (regionTimeSpan.start.utc ?? Date.now()) < newValue &&
      regionTimeSpan.end.utc &&
      regionTimeSpan.end.utc > newValue
    ) {
      try {
        const pivots = await getPivotsForDatetime(
          regionTimeSpan.start.region,
          regionTimeSpan.end.region,
          brokerConstants.timeslicePeriod,
          newValue,
          blocktimeRelay,
          relayApi,
        )
        setPivotOptions(pivots)
      } catch (error) {
        console.error('Error finding closest pivots:', error)
      }
    } else {
      setPivotOptions([])
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Split Core ${regionId.core} `}>
      <div className="flex flex-col p-4 ">
        <div className="pb-8">
          <div className="mx-10 mt-4 mb-24 relative">
            <div className="w-full bg-pink-4 bg-opacity-20 h-3 rounded-full overflow-hidden">
              <div
                className="bg-pink-4 bg-opacity-50 h-full"
                style={{ width: `${pivotPercentage}%` }}
              ></div>
            </div>

            {/* Marker for Start */}
            <div className="absolute top-0 -mt-1" style={{ left: `${0}%` }}>
              <div className="w-5 h-5 bg-red-4 rounded-full mb-2">
                <p className="absolute -mt-8 font-bold">Start</p>
              </div>
              <div className="text-sm text-left +mt-12 -ml-8">
                <p>{getDateString(regionTimeSpan.start.utc)}</p>
                <p>{getTimeString(regionTimeSpan.start.utc)}</p>
                <p>Region {regionTimeSpan.start.region}</p>
                <p>Block {regionTimeSpan.start.blocknumber}</p>
              </div>
            </div>

            {/* Marker for Pivot */}
            <div
              className={`absolute top-0 -mt-1 ${pivotPercentage < 2 ? 'hidden' : ''}`}
              style={{ left: `${pivotPercentage}%` }}
            >
              <div className="w-2 h-5 bg-red-4 rounded-full mb-4">
                <p
                  className={`absolute -mt-8 font-bold ${pivotPercentage < 10 || pivotPercentage > 90 ? 'hidden' : ''}`}
                >
                  Split
                </p>
              </div>
            </div>

            {/* Marker for End */}
            <div className="absolute top-0 -mt-1" style={{ left: '98%' }}>
              <div className="w-5 h-5 bg-red-4 rounded-full mb-2">
                <p className="absolute -mt-8 font-bold">End</p>
              </div>

              <div className="text-sm text-right text-nowrap +mt-12 -ml-24">
                <p>{getDateString(regionTimeSpan.end.utc)}</p>
                <p>{getTimeString(regionTimeSpan.end.utc)}</p>
                <p>Region {regionTimeSpan.end.region}</p>
                <p>Block {regionTimeSpan.end.blocknumber}</p>
              </div>
            </div>
          </div>
        </div>

        <p className="font-semibold mb-4">Where do you want to split?</p>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MobileDateTimePicker
            disablePast
            minDateTime={regionTimeSpan.start.utc || undefined}
            maxDateTime={regionTimeSpan.end.utc || undefined}
            label={`Select a time in ${getTimezoneOffset()}`}
            orientation="landscape"
            value={selectedDateTime}
            onAccept={handleAccept}
          />
        </LocalizationProvider>

        {pivotOptions.length > 0 && (
          <div className="flex flex-col mt-8">
            <p className="font-semibold mb-4">Select nearest valid pivot</p>
            <div className="grid gap-3">
              {pivotOptions.map((pivot, index) => {
                return (
                  <div
                    key={index}
                    className={`transition-transform duration-500 ease-out cursor-pointer ${
                      selectedPivotOffset === pivot.timeslice - regionTimeSpan.start.region
                        ? 'ring-2 ring-pink-500 shadow-lg transform scale-105 rounded-2xl'
                        : 'ring-2 ring-transparent rounded-2xl'
                    } transition-all duration-300`}
                    onClick={() =>
                      setSelectedPivotOffset(pivot.timeslice - regionTimeSpan.start.region)
                    }
                  >
                    <Border className="flex justify-center py-3 hover:bg-pink-1 hover:cursor-pointer">
                      <div className="mx-auto flex flex-row items-center justify-between overflow-hidden">
                        <div className="px-5">
                          <Image
                            src="/assets/Images/core1.png"
                            alt="Lastic Logo"
                            width={78}
                            height={60}
                          />
                        </div>

                        <div className="flex w-full text-lg flex-col px-5items-start justify-center">
                          <div className="uppercase font-unbounded tracking-wide text-md text-indigo-500 font-semibold">
                            Pivot at region {pivot.timeslice}
                          </div>

                          <p className="text-gray-12 text-md">{getDateTimeString(pivot.utc)}</p>
                        </div>
                      </div>
                    </Border>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center pt-10 ">
          <PrimaryButton
            title="Split Core"
            onClick={transaction}
            disabled={!allParamsFilled() || !selectedPivotOffset}
          />
          <div className="mt-5 text-sm text-gray-16 ">{status}</div>
        </div>
      </div>
    </Modal>
  )
}

type pivotInfo = {
  timeslice: timeslice
  utc: Date
}

/**
 * Finds the closest 2 timeslice pivots for a given target datetime within a region.
 *
 * @remarks
 * The pivots are found by estimating the closest timeslice to the target and then refining the estimate by fetching the exact timeslices around the estimated point.
 * Note: No tests written. Failing edge cases can exist.
 *
 * @param regionBegin starting timeslice of region.
 * @param regionBegin ending timeslice of region. Used to check that boundaries are not crossed.
 * @param timeslicePeriod the period of each timeslice in blocks.
 * @param target the target datetime to find the closest pivots for.
 * @param blockTime the blocktime of the relay chain in seconds.
 * @param relayApi the relay chain api.
 * @returns the closest 2 timeslice pivots for the given target. One above and one below. Or exactly one if it fits perfectly.
 * @throws an error if a block cannot be converted to UTC via lasticSDK.
 */
const getPivotsForDatetime = async (
  regionBegin: timeslice,
  regionEnd: timeslice,
  timeslicePeriod: number,
  target: Date,
  blockTime: number,
  relayApi: ApiPromise,
): Promise<pivotInfo[]> => {
  // helper function to fetch timeslice date and return pivotInfo
  const fetchPivotInfo = async (timeslice: timeslice): Promise<pivotInfo> => {
    const blockNumber = timeslice * timeslicePeriod
    const dateString = await blockTimeToUTC(relayApi, blockNumber)
    if (!dateString) throw new Error('Failed to fetch block utc time')

    return { timeslice, utc: new Date(dateString) }
  }

  // Convert the regionBegin timeslice to a datetime
  const regionBeginBlockNumber = regionBegin * timeslicePeriod
  const regionBeginDateString = await blockTimeToUTC(relayApi, regionBeginBlockNumber)
  if (!regionBeginDateString) throw new Error('Failed to fetch region begin date')
  const regionBeginDateUTC = new Date(regionBeginDateString)

  // Calculate the difference in seconds between target and regionBegin
  const secondsDifference = (target.getTime() - regionBeginDateUTC.getTime()) / 1000

  // Estimate the timeslice close to the target
  const estimatedTimesliceOffset = Math.floor(secondsDifference / (blockTime * timeslicePeriod))
  let estimatedTimeslice = regionBegin + estimatedTimesliceOffset

  // Adjust if estimatedTimeslice is outside the region boundaries
  estimatedTimeslice = Math.max(Math.min(estimatedTimeslice, regionEnd - 1), regionBegin + 1)

  let closestLowerPivot: timeslice = estimatedTimeslice - 1
  let closestUpperPivot: timeslice = estimatedTimeslice

  // refine lower pivot
  let lowerPivotInfo: pivotInfo | undefined
  while (closestLowerPivot >= regionBegin) {
    lowerPivotInfo = await fetchPivotInfo(closestLowerPivot)
    if (lowerPivotInfo.utc < target) {
      closestUpperPivot = closestLowerPivot + 1
      break
    }
    closestLowerPivot--
  }

  // set upper pivot (always 1 above lower pivot)
  lowerPivotInfo = lowerPivotInfo ?? (await fetchPivotInfo(closestLowerPivot))
  let upperPivotInfo = await fetchPivotInfo(closestUpperPivot)

  // Adjust both pivots if they are too low
  while (upperPivotInfo.utc <= target && closestUpperPivot < regionEnd) {
    closestLowerPivot++
    closestUpperPivot++
    lowerPivotInfo = await fetchPivotInfo(closestLowerPivot)
    upperPivotInfo = await fetchPivotInfo(closestUpperPivot)
  }

  // Ensure pivots do not include regionBegin or regionEnd
  if (closestLowerPivot <= regionBegin) {
    closestLowerPivot = regionBegin + 1
    lowerPivotInfo = await fetchPivotInfo(closestLowerPivot)
  }
  if (closestUpperPivot >= regionEnd) {
    closestUpperPivot = regionEnd - 1
    upperPivotInfo = await fetchPivotInfo(closestUpperPivot)
  }

  if (closestLowerPivot === closestUpperPivot) {
    return [lowerPivotInfo] // Return only one pivot if they are the same
  }

  return [lowerPivotInfo, upperPivotInfo]
}

/**
 * @returns a string representation of a date in the format of "MMM DD, YYYY, HH:MM:SS (GMT+X)"
 */
const getDateTimeString = (date: Date | null): string => {
  if (!date) {
    return 'N/A'
  }
  const dateString = date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  const timeZoneString = date
    .toLocaleTimeString('en-US', {
      timeZoneName: 'short',
    })
    .split(' ')
    .pop()

  const timeString = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return `${dateString}, ${timeString} (${timeZoneString})`
}

const getDateString = (date: Date | null): string => {
  if (!date) {
    return 'N/A'
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const getTimeString = (date: Date | null): string => {
  if (!date) {
    return 'N/A'
  }

  const timeZoneString = date
    .toLocaleTimeString('en-US', {
      timeZoneName: 'short',
    })
    .split(' ')
    .pop()

  const timeString = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return `${timeString} (${timeZoneString})`
}

/**
 * @returns the timezone offset of the current user in the format of "GMT+X"
 */
const getTimezoneOffset = (): string => {
  const timezone = new Date()
    .toLocaleTimeString('en-US', {
      timeZoneName: 'short',
    })
    .split(' ')
    .pop()

  return timezone || ''
}

export default PartitionCoreModal
