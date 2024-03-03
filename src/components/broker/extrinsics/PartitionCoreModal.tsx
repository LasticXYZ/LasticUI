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
  const { brokerConstants, isLoading: isConstantsLoading } = useBrokerConstants(api)
  const [selectedDateTime, setSelectedDateTime] = useState<Date | undefined | null>(null)
  const [pivotOptions, setPivotOptions] = useState<pivotInfo[]>([])
  const [selectedPivot, setSelectedPivot] = useState<timeslice | undefined>(undefined)
  const txButtonProps: TxButtonProps = {
    api,
    setStatus: (status: string | null) => console.log('tx status:', status),
    attrs: {
      palletRpc: 'broker',
      callable: 'partition',
      inputParams: [regionId, selectedPivot],
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
    setSelectedPivot(undefined)
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
          <p className="font-semibold mb-4">Core details</p>
          <li>
            {getDateTimeString(regionTimeSpan.start.utc)} {' to '}
            {getDateTimeString(regionTimeSpan.end.utc)}
          </li>
          <li>{`Region range: ${regionTimeSpan.start.region} to ${regionTimeSpan.end.region}`}</li>
          <li>{`Block range: ${regionTimeSpan.start.blocknumber} to ${regionTimeSpan.end.blocknumber}`}</li>
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
                      selectedPivot === pivot.timeslice
                        ? 'ring-2 ring-pink-500 shadow-lg transform scale-105 rounded-2xl'
                        : 'ring-2 ring-transparent rounded-2xl'
                    } transition-all duration-300`}
                    onClick={() => setSelectedPivot(pivot.timeslice - regionTimeSpan.start.region)}
                  >
                    <Border className="px-6 py-4 hover:bg-pink-1 hover:cursor-pointer">
                      <div>
                        <div className="uppercase font-unbounded uppercase tracking-wide text-md text-indigo-500 font-semibold">
                          Pivot at region {pivot.timeslice}
                        </div>
                      </div>
                      <div className="mx-auto pt-4 flex flex-row items-center justify-between overflow-hidden">
                        <div className="px-5">
                          <Image
                            src="/assets/Images/core1.png"
                            alt="Lastic Logo"
                            width={78}
                            height={60}
                          />
                        </div>
                        <div className="flex w-full text-lg flex-col px-5items-start justify-center">
                          <div className="flex flex-row text-gray-12 p-1 ">
                            <p className="px-2">{getDateTimeString(pivot.utc)}</p>
                          </div>
                        </div>
                      </div>
                    </Border>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex justify-center pt-10 ">
          <PrimaryButton
            title="Split Core"
            onClick={transaction}
            disabled={!allParamsFilled() || !selectedPivot}
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
