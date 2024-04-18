import {
  BrokerConstantsType,
  ConfigurationType,
  SaleInfoType,
  blocksToTimeFormat,
} from '@poppyseed/lastic-sdk'

export enum StatusCode {
  Interlude = 'interlude',
  LeadIn = 'leadIn',
  Purchase = 'purchase',
}

interface StatusInfo {
  statusTitle: string
  statusMessage: string
}

const statusInfoMap: Record<StatusCode, StatusInfo> = {
  [StatusCode.Interlude]: {
    statusTitle: 'Renewal Period',
    statusMessage: 'Time to renew your core!',
  },
  [StatusCode.LeadIn]: {
    statusTitle: 'Lead-in Period',
    statusMessage:
      'Sales have started we are now in the lead-in period. The price is linearly decreasing with each block.',
  },
  [StatusCode.Purchase]: {
    statusTitle: 'Purchase Period',
    statusMessage: 'Sale is in the purchase period.',
  },
}

// Non-exported util functions for saleStatus

function getSaleEnds(
  saleInfo: SaleInfoType,
  config: ConfigurationType,
  constant: BrokerConstantsType,
): number {
  // The logic assumes that the coretime chain runs 2 times slower then the relay chain
  return (
    saleInfo.saleStart +
    (config.regionLength * constant.timeslicePeriod) / 2 -
    config.interludeLength
  )
}

function calculateTimeRemaining(
  currentBlockNumber: number,
  saleInfo: SaleInfoType,
  config: ConfigurationType,
  constant: BrokerConstantsType,
  statusCode: StatusCode,
): string {
  // const saleEnds = getSaleEnds(saleInfo, config, constant)

  switch (statusCode) {
    case StatusCode.Interlude:
      return blocksToTimeFormat(saleInfo.saleStart - currentBlockNumber)
    case StatusCode.LeadIn:
      return blocksToTimeFormat(saleInfo.saleStart + config.leadinLength - currentBlockNumber)
    case StatusCode.Purchase:
      return '-'
    default:
      return '-'
  }
}

function determineStatusCode(
  currentBlockNumber: number,
  saleInfo: SaleInfoType,
  config: ConfigurationType,
): StatusCode {
  if (currentBlockNumber < saleInfo.saleStart) return StatusCode.Interlude
  if (currentBlockNumber < saleInfo.saleStart + config.leadinLength) return StatusCode.LeadIn
  return StatusCode.Purchase
}

// Exported function

export function saleStatus(
  currentBlockNumber: number,
  saleInfo: SaleInfoType,
  config: ConfigurationType,
  constant: BrokerConstantsType,
): {
  statusTitle: string
  statusMessage: string
  timeRemaining: string
  statusCode: StatusCode
} {
  // Check issue https://github.com/LasticXYZ/LasticUI/issues/94 to see why this is commented out
  // const saleEnds = getSaleEnds(saleInfo, config, constant)

  const statusCode = determineStatusCode(currentBlockNumber, saleInfo, config)
  const { statusTitle, statusMessage } = statusInfoMap[statusCode]
  const timeRemaining = calculateTimeRemaining(
    currentBlockNumber,
    saleInfo,
    config,
    constant,
    statusCode,
  )

  return {
    statusTitle,
    statusMessage,
    timeRemaining,
    statusCode,
  }
}
