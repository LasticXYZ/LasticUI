import Border from '@/components/border/Border'
import MiniBarGraphData from '@/components/graph/MiniBarGraphData'
import { GraphLike, SaleInitializedEvent, getClient } from '@poppyseed/squid-sdk'
import React, { useEffect, useState } from 'react'
import CoreOwners from './CoreOwners'

type DataSetKey = 'price' | 'cores' // Add more keys as needed

const CoreUtilisation: React.FC = () => {
  const [result, setResult] = useState<GraphLike<SaleInitializedEvent[]> | null>(null)
  const [activeDataSet, setActiveDataSet] = useState<DataSetKey>('price') // Change to string to accommodate multiple datasets
  const client = getClient()

  useEffect(() => {
    const fetchData = async () => {
      const query = client.eventAllSaleInitialized()
      const fetchedResult: GraphLike<SaleInitializedEvent[]> = await client.fetch(query)
      setResult(fetchedResult)
    }

    fetchData()
  }, [client])

  // Configurations for different data sets
  const dataConfigs = {
    price: {
      label: 'Price Per Core',
      dataPoints:
        result?.data.event?.map((event) => parseFloat(event.regularPrice?.toString() || '0')) || [],
    },
    cores: {
      label: 'Cores Offered',
      dataPoints:
        result?.data.event?.map((event) => parseFloat(event.coresOffered?.toString() || '0')) || [],
    },
  }

  const labels =
    result?.data.event?.map((event, index) => `Nb. ${index + 1} - Rg. ${event.regionBegin}`) || []

  // Toggle between data sets
  const toggleActiveDataSet = (newDataSet: DataSetKey) => {
    setActiveDataSet(newDataSet)
  }

  // Generate buttons or options for switching datasets
  const dataSetOptions = Object.keys(dataConfigs).map((key) => (
    <button
      key={key}
      onClick={() => toggleActiveDataSet(key as DataSetKey)}
      className={`py-2 px-4 text-left hover:font-semibold border-b border-gray-18 ${activeDataSet === key ? 'text-pink-5 dark:text-pink-400 font-semibold' : 'text-gray-16'}`}
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
