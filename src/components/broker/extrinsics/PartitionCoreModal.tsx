'use client'
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
  const [selectedDateTime, setSelectedDateTime] = useState<Date | undefined>()
  const [pivotOptions, setPivotOptions] = useState<timeslice[]>([])
  const [selectedPivot, setSelectedPivot] = useState<timeslice | null>(null)
  const txButtonProps: TxButtonProps = {
    api,
    setStatus: (status: string | null) => console.log('tx status:', status),
    attrs: {
      palletRpc: 'broker',
      callable: 'partition',
      inputParams: [regionId, selectedDateTime],
      paramFields: [
        { name: 'regionId', type: 'Object', optional: false },
        { name: 'pivot', type: 'string', optional: false }, // unsure if string is correct
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

  const handleAccept = async (newValue: Date | null) => {
    console.log('Selected datetime:', newValue)
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
        console.log('Finding closest pivots for:', newValue)
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
            <p className="font-semibold mb-4">Nearest pivots</p>
            {pivotOptions.map((pivot, index) => {
              return <li>{pivot}</li>
            })}
          </div>
        )}

        <div className="flex justify-center pt-10">
          <PrimaryButton title="Split Core" onClick={transaction} disabled={!allParamsFilled()} />
          <div className="mt-5 text-sm text-gray-16 ">{status}</div>
        </div>
      </div>
    </Modal>
  )
}

/**
 * @param regionBegin starting timeslice of region.
 * @param regionBegin ending timeslice of region. Used to check that boundaries are not crossed.
 * @param timeslicePeriod the period of each timeslice in blocks.
 * @param target the target datetime to find the closest pivots for.
 * @param blockTime the blocktime of the relay chain in seconds.
 * @param relayApi the relay chain api.
 * @returns the closest 2 timeslice pivots for the given target. One above and one below. Or exactly one if it fits perfectly.
 * @throws an error if the regionBegin or regionEnd cannot be converted to UTC.
 */
const getPivotsForDatetime = async (
  regionBegin: timeslice,
  regionEnd: timeslice,
  timeslicePeriod: number,
  target: Date,
  blockTime: number,
  relayApi: ApiPromise,
): Promise<timeslice[]> => {
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
  if (estimatedTimeslice < regionBegin) estimatedTimeslice = regionBegin
  if (estimatedTimeslice > regionEnd) estimatedTimeslice = regionEnd

  // Refine the estimate by fetching the exact timeslices around the estimated point
  let closestLowerPivot = estimatedTimeslice
  let closestUpperPivot = estimatedTimeslice + 1

  // Refine lower pivot
  while (closestLowerPivot >= regionBegin) {
    const blockNumber = closestLowerPivot * timeslicePeriod
    const dateString = await blockTimeToUTC(relayApi, blockNumber)
    if (!dateString) throw new Error('Failed to fetch block utc time')

    const dateUTC = new Date(dateString)

    if (dateUTC <= target) break // Found nearest lower pivot
    closestLowerPivot--
  }

  // Refine upper pivot
  while (closestUpperPivot <= regionEnd) {
    const blockNumber = closestUpperPivot * timeslicePeriod
    const dateString = await blockTimeToUTC(relayApi, blockNumber)
    if (!dateString) throw new Error('Failed to fetch block utc time')
    const dateUTC = new Date(dateString)

    if (dateUTC >= target) break // Found nearest upper pivot
    closestUpperPivot++
  }

  // Ensure we have two distinct pivots (handle edge cases)
  if (closestLowerPivot === closestUpperPivot) {
    if (closestLowerPivot > regionBegin) {
      closestLowerPivot--
    } else if (closestUpperPivot < regionEnd) {
      closestUpperPivot++
    }
  }

  return [closestLowerPivot, closestUpperPivot]
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
