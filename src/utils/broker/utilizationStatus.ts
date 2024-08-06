import { BrokerConstantsType, ConfigurationType } from '@poppyseed/lastic-sdk'

import { parseFormattedNumber } from '@/utils/helperFunc'
import { CoreOwnerEvent } from '@poppyseed/squid-sdk'
import { blocksToTimeFormat } from './blockTime'

interface StatusInfo {
  statusTitle: string
  statusMessage: string
}

export enum UtilizationCode {
  Undefined = 'Undefined',
  NotStarted = 'Starts in',
  Running = 'Running till',
  Ended = 'Ended',
}

const utilizationInfoMap: Record<UtilizationCode, StatusInfo> = {
  [UtilizationCode.Undefined]: {
    statusTitle: 'Undefined',
    statusMessage: 'The utilization period for this core is undefined.',
  },
  [UtilizationCode.NotStarted]: {
    statusTitle: 'Starts in',
    statusMessage: 'The utilization period for this core has not started yet.',
  },
  [UtilizationCode.Running]: {
    statusTitle: 'Running',
    statusMessage: 'The utilization period for this core is running.',
  },
  [UtilizationCode.Ended]: {
    statusTitle: 'Ended',
    statusMessage: 'The utilization period for this core has ended.',
  },
}

function determineUtilizationStatusCode(
  currentRelayBlock: number,
  config: ConfigurationType,
  constant: BrokerConstantsType,
  region: CoreOwnerEvent,
): UtilizationCode {
  if (!region?.regionId?.begin || !region?.duration) return UtilizationCode.Undefined
  if (currentRelayBlock < region.regionId.begin * constant.timeslicePeriod)
    return UtilizationCode.NotStarted
  if (currentRelayBlock < (region.regionId.begin + region.duration) * constant.timeslicePeriod)
    return UtilizationCode.Running
  if (currentRelayBlock > (region.regionId.begin + region.duration) * constant.timeslicePeriod)
    return UtilizationCode.Ended
  return UtilizationCode.Undefined
}

function calculateUtilizationTimeRemaining(
  currentRelayBlock: number,
  region: CoreOwnerEvent,
  constant: BrokerConstantsType,
  statusCode: UtilizationCode,
): string {
  // const saleEnds = getSaleEnds(saleInfo, config, constant)

  switch (statusCode) {
    case UtilizationCode.NotStarted:
      return region.regionId.begin
        ? blocksToTimeFormat(
            region.regionId.begin * constant.timeslicePeriod - currentRelayBlock,
            'RELAY',
          )
        : '-'
    case UtilizationCode.Running:
      return region.duration && region.regionId.begin
        ? blocksToTimeFormat(
            (region.regionId.begin + region.duration) * constant.timeslicePeriod -
              currentRelayBlock,
            'RELAY',
          )
        : '-'
    default:
      return '-'
  }
}

export function utilizationStatus(
  currentRelayBlock: number,
  region: CoreOwnerEvent,
  config: ConfigurationType,
  constant: BrokerConstantsType,
): {
  statusTitle: string
  statusMessage: string
  timeRemaining: string
  utilizationCode: UtilizationCode
} {
  const utilizationCode = determineUtilizationStatusCode(
    currentRelayBlock,
    config,
    constant,
    region,
  )
  const { statusTitle, statusMessage } = utilizationInfoMap[utilizationCode]
  const timeRemaining = calculateUtilizationTimeRemaining(
    currentRelayBlock,
    region,
    constant,
    utilizationCode,
  )

  return {
    statusTitle,
    statusMessage,
    timeRemaining,
    utilizationCode,
  }
}

export function calculateTimeUtilizationBegins(
  currentRelayBlock: number,
  beginRegion: string | number | null,
  constant: BrokerConstantsType | null,
): string | null {
  if (beginRegion === null) {
    return null
  }

  if (typeof beginRegion === 'string') {
    beginRegion = parseFormattedNumber(beginRegion)
  }

  console.log('beginRegion', beginRegion)
  return constant
    ? blocksToTimeFormat(beginRegion * constant.timeslicePeriod - currentRelayBlock, 'RELAY')
    : null
}

export function calculateTimeUtilizationEnds(
  currentRelayBlock: number,
  beginRegion: string | number,
  constant: BrokerConstantsType | null,
  config: ConfigurationType | null,
  duration?: number,
): string | null {
  if (!config) {
    return null
  }

  if (typeof beginRegion === 'string') {
    beginRegion = parseFormattedNumber(beginRegion)
  }

  duration = duration ? duration : config.regionLength

  return constant
    ? blocksToTimeFormat(
        (beginRegion + duration) * constant.timeslicePeriod - currentRelayBlock,
        'RELAY',
      )
    : null
}
