import { BrokerConstantsType, ConfigurationType, SaleInfoType } from '@poppyseed/lastic-sdk'
import { FC } from 'react'

// Additional interfaces, which should be defined according to your data structure
type SliderPropeTypes = {
  currentBlockNumber: number
  saleInfo: SaleInfoType
  config: ConfigurationType
  constants: BrokerConstantsType
}

const Slider: FC<SliderPropeTypes> = ({ currentBlockNumber, saleInfo, config, constants }) => {
  const saleDuration = (config.regionLength * constants.timeslicePeriod)

  // Calculate percentages for each period
  const startSalePercentage = (config.interludeLength / saleDuration) * 100
  const leadinPercentage = ((config.leadinLength + config.interludeLength) / saleDuration) * 100
  const purchasePercentage =
    ((currentBlockNumber - saleInfo.saleStart + config.interludeLength) / saleDuration) * 100

  // Ensure the percentages are not negative or exceed 100
  const safeStartSalePercentage = Math.max(0, Math.min(100, startSalePercentage))
  const safeLeadinPercentage = Math.max(0, Math.min(100, leadinPercentage))
  const safePurchasePercentage = Math.max(0, Math.min(100, purchasePercentage))

  return (
    <div className="mx-10 my-16 relative">
      <div className="w-full bg-pink-300 dark:bg-pink-400 dark:bg-opacity-20 bg-opacity-20 h-3 rounded-full overflow-hidden">
        <div
          className="bg-pink-300 dark:bg-pink-400 dark:bg-opacity-40 bg-opacity-50 h-full"
          style={{ width: `${safePurchasePercentage}%` }}
        ></div>
      </div>
      {/* Marker for Interlude Period */}
      <div className="absolute top-0 -mt-1" style={{ left: `${0}%` }}>
        <div className="w-5 h-5 bg-red-4 dark:bg-pink-400 rounded-full"></div>
        <p className="text-sm text-left -mt-12 -ml-8">Core Start</p>
      </div>
      <div className="absolute top-0 -mt-1" style={{ left: `${safeStartSalePercentage / 2}%` }}>
        <p className="text-sm text-left mt-5 -ml-10">Renew Period</p>
      </div>
      {/* Marker for LeadIn Period */}
      <div className="absolute top-0 -mt-1" style={{ left: `${safeStartSalePercentage}%` }}>
        <div className="w-5 h-5 bg-red-4 dark:bg-pink-400 rounded-full"></div>
        <p className="text-sm text-left -mt-12 -ml-5">Sale Start</p>
      </div>
      <div
        className="absolute top-0 -mt-1"
        style={{ left: `${(safeStartSalePercentage + safeLeadinPercentage) / 2}%` }}
      >
        <p className="text-sm text-left mt-5 -ml-10">Linearly decreasing price</p>
      </div>
      {/* Marker for Lead-in Period */}
      <div className="absolute top-0 -mt-1" style={{ left: `${safeLeadinPercentage}%` }}>
        <div className="w-5 h-5 bg-red-4 dark:bg-pink-400 rounded-full"></div>
        <p className="text-sm text-left -mt-12 -ml-10">Prices Stabilize</p>
      </div>
      <div
        className="absolute top-0 -mt-1"
        style={{ left: `${(safeLeadinPercentage + 100) / 2}%` }}
      >
        <p className="text-sm text-left mt-5 -ml-10">Stable price = {saleInfo.price / 10 ** 12}</p>
      </div>
      {/* Marker for Purchase Period */}
      <div className="absolute top-0 -mt-1" style={{ left: '100%' }}>
        <div className="w-5 h-5 bg-red-4 dark:bg-pink-400 rounded-full"></div>
        <p className="text-sm text-left -mt-12 -ml-10">Sale End</p>
      </div>
    </div>
  )
}

export default Slider
