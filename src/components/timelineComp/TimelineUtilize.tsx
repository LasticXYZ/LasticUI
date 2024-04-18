import { BrokerConstantsType, ConfigurationType, SaleInfoType } from '@poppyseed/lastic-sdk'
import { FC } from 'react'

// Additional interfaces, which should be defined according to your data structure
type SliderPropeTypes = {
  currentRelayBlock: number
  saleInfo: SaleInfoType
  config: ConfigurationType
  constants: BrokerConstantsType
}

function currentRelayBlockUtilization(
  currentRelayBlock: number,
  saleInfo: SaleInfoType,
  constant: BrokerConstantsType,
) {
  const startBlock = saleInfo.regionBegin * constant.timeslicePeriod
  const endBlock = saleInfo.regionEnd * constant.timeslicePeriod
  const percent = (currentRelayBlock - startBlock) / (endBlock - startBlock)
  if (percent < 0) {
    return 0
  } else {
    return percent
  }
}

const Slider: FC<SliderPropeTypes> = ({ currentRelayBlock, saleInfo, config, constants }) => {
  const saleDurationOnRelay = config.regionLength * constants.timeslicePeriod

  // Calculate percentages for each period
  const utilizationPercentage =
    ((currentRelayBlock - saleInfo.regionBegin * constants.timeslicePeriod) / saleDurationOnRelay) *
    100

  // Ensure the percentages are not negative or exceed 100
  const safeutilizationPercentage = Math.max(0, Math.min(100, utilizationPercentage))

  return (
    <div className="mx-10 mt-16 mb-10 relative">
      <div>
        {/*
            Amount of utilization:{' '}
            {currentRelayBlockUtilization(currentRelayBlock, saleInfo, constants)} % current relay
            block: {currentRelayBlock}
            start region block: {saleInfo.regionBegin * constants.timeslicePeriod}
            end region block: {saleInfo.regionEnd * constants.timeslicePeriod}
             Region Begin Timestamp:{' '}
            {regionBeginTimestamp !== null ? regionBeginTimestamp : 'Loading...'}
            Region End Timestamp: {regionEndTimestamp !== null ? regionEndTimestamp : 'Loading...'} */}
      </div>
      <div className="w-full bg-pink-4 bg-opacity-20 h-3 rounded-full overflow-hidden">
        <div
          className="bg-pink-4 bg-opacity-50 h-full"
          style={{ width: `${safeutilizationPercentage}%` }}
        ></div>
      </div>
      {/* Marker for Interlude Period */}
      <div className="absolute top-0 -mt-1" style={{ left: `${0}%` }}>
        <div className="w-5 h-5 bg-red-4 rounded-full"></div>
        <p className="text-sm text-left -mt-12 -ml-8">Start Utilization</p>
      </div>
      {/* Marker for Purchase Period */}
      <div className="absolute top-0 -mt-1" style={{ left: '100%' }}>
        <div className="w-5 h-5 bg-red-4 rounded-full"></div>
        <p className="text-sm text-left -mt-12 -ml-20">End Utilization</p>
      </div>
    </div>
  )
}

export default Slider
