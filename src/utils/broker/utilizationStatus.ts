import { BrokerConstantsType, ConfigurationType } from '@poppyseed/lastic-sdk'

import { CoreOwnerEvent } from '@poppyseed/squid-sdk'
import { blocksToTimeFormat } from './blockTime'

interface StatusInfo {
  statusTitle: string
  statusMessage: string
}

export enum UtilizationCode {
  Undefined = 'undefined',
  NotStarted = 'Starts in',
  Running = 'running',
  Ended = 'ended',
}

const utilizationInfoMap: Record<UtilizationCode, StatusInfo> = {
  [UtilizationCode.Undefined]: {
    statusTitle: 'Undefined',
    statusMessage: 'The utilization period is undefined.',
  },
  [UtilizationCode.NotStarted]: {
    statusTitle: 'Not Started',
    statusMessage: 'The utilization period has not started yet.',
  },
  [UtilizationCode.Running]: {
    statusTitle: 'Running',
    statusMessage: 'The utilization period is running.',
  },
  [UtilizationCode.Ended]: {
    statusTitle: 'Ended',
    statusMessage: 'The utilization period has ended.',
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
  config: ConfigurationType,
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
    config,
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
