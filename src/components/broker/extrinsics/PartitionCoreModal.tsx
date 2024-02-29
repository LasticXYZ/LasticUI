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
  CORETIME_CHAIN_BLOCK_TIME,
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
  const [pivot, setPivot] = useState<Date | undefined>()
  const txButtonProps: TxButtonProps = {
    api,
    setStatus: (status: string | null) => console.log('tx status:', status),
    attrs: {
      palletRpc: 'broker',
      callable: 'partition',
      inputParams: [regionId, pivot],
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
  const { brokerConstants, isLoading: isConstantsLoading } = useBrokerConstants(api)
  const regionData = useRegionQuery()
  const [regionTimeSpan, setRegionTimeSpan] = useState<regionTimeSpan>({
    start: { region: 0, blocknumber: 0, utc: null },
    end: { region: 0, blocknumber: 0, utc: null },
  })

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

  let blocktimeRelay = RELAY_CHAIN_BLOCK_TIME //ms
  let blocktimeCoretime = CORETIME_CHAIN_BLOCK_TIME //ms

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
            minDateTime={regionTimeSpan.start.utc}
            maxDateTime={regionTimeSpan.end.utc}
            label={`Select a time in ${getTimezoneOffset()}`}
            orientation="landscape"
            value={pivot}
            onChange={(newValue) => {
              setPivot(newValue || undefined)
            }}
          />
        </LocalizationProvider>

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
 * @param relayApi the relay chain api.
 * @returns the closest 2 timeslice pivots for the given target. One above and one below. Or exactly one if it fits perfectly.
 */
const getPivotsForDatetime = async (
  regionBegin: timeslice,
  regionEnd: timeslice,
  timeslicePeriod: number,
  target: Date,
  relayApi: ApiPromise,
): Promise<timeslice[]> => {
  let closestLowerPivot = regionBegin
  let closestUpperPivot = regionEnd

  for (let timeslice = regionBegin; timeslice <= regionEnd; timeslice++) {
    const blockNumber = timeslice * timeslicePeriod

    const timesliceDateString = await blockTimeToUTC(relayApi, blockNumber)
    if (!timesliceDateString) {
      continue
    }
    const timesliceDateUTC = new Date(timesliceDateString)

    if (timesliceDateUTC === target) {
      return [timeslice] // Found a perfect match
    } else if (timesliceDateUTC < target) {
      closestLowerPivot = timeslice // Found a new lower pivot
    } else {
      closestUpperPivot = timeslice // Found the first upper pivot
      break // Exit the loop as we found our upper boundary
    }
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
