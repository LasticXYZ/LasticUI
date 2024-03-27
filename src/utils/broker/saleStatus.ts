import {
  BrokerConstantsType,
  ConfigurationType,
  SaleInfoType,
  blocksToTimeFormat,
} from '@poppyseed/lastic-sdk'

enum TypeOfChain {
  PARA = 'PARA',
  RELAY = 'RELAY',
  LOCAL = 'LOCAL',
}

enum StatusCode {
  Interlude = 'interlude',
  LeadIn = 'leadIn',
  Purchase = 'purchase',
  Ended = 'ended',
}

interface StatusInfo {
  statusTitle: string
  statusMessage: string
}

const statusInfoMap: Record<StatusCode, StatusInfo> = {
  [StatusCode.Interlude]: {
    statusTitle: 'Interlude Period',
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
  [StatusCode.Ended]: {
    statusTitle: 'Sale Ended',
    statusMessage: 'The sale has ended.',
  },
}

// Non-exported util functions for saleStatus

function getSaleEnds(
  saleInfo: SaleInfoType,
  config: ConfigurationType,
  constant: BrokerConstantsType,
  typeOfChain: TypeOfChain = TypeOfChain.PARA,
): number {
  const divideBy2OrNot: 1 | 2 = typeOfChain === 'PARA' ? 2 : 1
  return (
    saleInfo.saleStart +
    (config.regionLength * constant.timeslicePeriod) / divideBy2OrNot -
    config.interludeLength
  )
}

function calculateTimeRemaining(
  currentBlockNumber: number,
  saleInfo: SaleInfoType,
  config: ConfigurationType,
  constant: BrokerConstantsType,
  statusCode: StatusCode,
  typeOfChain: TypeOfChain = TypeOfChain.PARA,
): string {
  const saleEnds = getSaleEnds(saleInfo, config, constant, typeOfChain)

  switch (statusCode) {
    case StatusCode.Interlude:
      return blocksToTimeFormat(saleInfo.saleStart - currentBlockNumber, typeOfChain)
    case StatusCode.LeadIn:
      return blocksToTimeFormat(
        saleInfo.saleStart + config.leadinLength - currentBlockNumber,
        typeOfChain,
      )
    case StatusCode.Purchase:
      return blocksToTimeFormat(saleEnds - currentBlockNumber, typeOfChain)
    case StatusCode.Ended:
    default:
      return '-'
  }
}

function determineStatusCode(
  currentBlockNumber: number,
  saleInfo: SaleInfoType,
  config: ConfigurationType,
  saleEnds: number,
): StatusCode {
  if (currentBlockNumber < saleInfo.saleStart) return StatusCode.Interlude
  if (currentBlockNumber < saleInfo.saleStart + config.leadinLength) return StatusCode.LeadIn
  if (currentBlockNumber <= saleEnds) return StatusCode.Purchase
  return StatusCode.Ended
}

// Exported function

export function saleStatus(
  currentBlockNumber: number,
  saleInfo: SaleInfoType,
  config: ConfigurationType,
  constant: BrokerConstantsType,
  typeOfChain: TypeOfChain = TypeOfChain.PARA,
): { statusTitle: string; statusMessage: string; timeRemaining: string } {
  const saleEnds = getSaleEnds(saleInfo, config, constant, typeOfChain)

  const statusCode = determineStatusCode(currentBlockNumber, saleInfo, config, saleEnds)
  const { statusTitle, statusMessage } = statusInfoMap[statusCode]
  const timeRemaining = calculateTimeRemaining(
    currentBlockNumber,
    saleInfo,
    config,
    constant,
    statusCode,
    typeOfChain,
  )

  return {
    statusTitle,
    statusMessage,
    timeRemaining,
  }
}
