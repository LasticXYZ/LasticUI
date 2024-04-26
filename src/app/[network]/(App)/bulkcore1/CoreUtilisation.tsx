import Border from '@/components/border/Border'
import MiniBarGraphData from '@/components/graph/MiniBarGraphData'
import { network_list } from '@/config/network'
import { useSaleRegions } from '@/hooks/subsquid'
import { priceCurve } from '@/utils'
import { getChainFromPath } from '@/utils/common/chainPath'
import { getClient } from '@poppyseed/squid-sdk'
import { usePathname } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import CoreOwners from './CoreOwners'

type DataSetKey = 'priceOnePeriod' | 'price' | 'cores' // Add more keys as needed

const CoreUtilisation: React.FC = () => {
  const pathname = usePathname()
  const network = getChainFromPath(pathname)
  const decimalPoints = network_list[network].decimalPoints

  //const [result, setResult] = useState<GraphLike<SaleInitializedEvent[]> | null>(null)
  const [activeDataSet, setActiveDataSet] = useState<DataSetKey>('price') // Change to string to accommodate multiple datasets
  const client = useMemo(() => getClient(), [])

  const saleRegions = useSaleRegions(network, client)
  const currentSaleRegion = saleRegions?.data.event ? saleRegions.data.event[0] : null
  const constant = network_list[network].constants
  const config = network_list[network].configuration
  let price_xy: { x: number[]; y: number[] } | undefined
  if (currentSaleRegion && config && constant) {
    price_xy = priceCurve(currentSaleRegion, config, constant)
    console.log(price_xy)
  }

  // Configurations for different data sets
  const dataConfigs = {
    priceOnePeriod: {
      graph: 'line',
      label: 'Price Per Core In One Period',
      dataPoints: price_xy ? price_xy.y : [],
    },
    price: {
      graph: 'bar',
      label: 'Price Per Core Over Time',
      dataPoints: saleRegions?.data.event
        ? [...saleRegions.data.event]
            .reverse()
            .map((event) => Number(event.regularPrice) / 10 ** decimalPoints || 0)
        : [],
    },
    cores: {
      graph: 'bar',
      label: 'Cores Offered',
      dataPoints: saleRegions?.data.event
        ? [...saleRegions.data.event]
            .reverse()
            .map((event) => parseFloat(event.coresOffered?.toString() || '0'))
        : [],
    },
  }

  const labels = saleRegions?.data.event
    ? [...saleRegions.data.event]
        .reverse()
        .map((event, index) => `Nb. ${index + 1} - Rg. ${event.regionBegin}`)
    : []

  // Toggle between data sets
  const toggleActiveDataSet = (newDataSet: DataSetKey) => {
    setActiveDataSet(newDataSet)
  }

  // Generate buttons or options for switching datasets
  const dataSetOptions = Object.keys(dataConfigs).map((key) => (
    <button
      key={key}
      onClick={() => toggleActiveDataSet(key as DataSetKey)}
      className={`py-2 px-4 text-left hover:font-semibold border-b border-gray-18 ${activeDataSet === key ? 'text-pink-500 dark:text-pink-400 font-semibold' : 'text-gray-16'}`}
    >
      {dataConfigs[key as DataSetKey].label}
    </button>
  ))

  return (
    <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
      <Border>
        <div className="pt-10 pl-10">
          <h1 className="text-2xl font-unbounded uppercase font-bold">Core Data</h1>
        </div>
        <div className="grid grid-cols-4 font-montserrat p-6 w-full">
          <div className="col-span-1">
            <div className="p-2 flex flex-col space-y-4">{dataSetOptions}</div>
          </div>
          <div className="col-span-3 p-4">
            {labels.length > 0 && (
              <MiniBarGraphData
                title={dataConfigs[activeDataSet].label}
                labels={labels}
                dataPoints={dataConfigs[activeDataSet].dataPoints}
              />
            )}
          </div>
        </div>
        <CoreOwners />
      </Border>
    </section>
  )
}

export default CoreUtilisation
