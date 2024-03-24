import AccordionTile from '@/components/accordion/AccordionTile'
import Border from '@/components/border/Border'
import MiniBarGraph from '@/components/graph/MiniBarGraph'
import { GraphLike, SaleInitializedEvent, getClient } from '@poppyseed/squid-sdk'
import React, { useEffect, useState } from 'react'
import CoreOwners from './CoreOwners'

type CoreUtilisationProps = {}

const CoreUtilisation: React.FC<CoreUtilisationProps> = () => {
  const [result, setResult] = useState<GraphLike<SaleInitializedEvent[]> | null>(null)
  const client = getClient()

  useEffect(() => {
    const fetchData = async () => {
      let query = client.eventAllSaleInitialized()
      const fetchedResult: GraphLike<SaleInitializedEvent[]> = await client.fetch(query)
      setResult(fetchedResult)
    }

    fetchData()
  }, [client]) // Add offset to the dependency array

  console.log(result)

  return (
    <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
      <Border>
        <div className="pt-10 pl-10">
          <h1 className="text-2xl font-unbounded uppercase font-bold">core utilization</h1>
        </div>
        <div className="grid grid-cols-4 font-montserrat p-6 w-full">
          <div className="col-span-1 grid grid-cols-1 gap-4 mb-4">
            <div className=" p-2">
              <AccordionTile question="Core Utilization" answer="twr-aerawerae" />
            </div>
          </div>
          <div className=" col-span-3 p-4">
            <MiniBarGraph />
          </div>
        </div>
        <CoreOwners />
      </Border>
    </section>
  )
}

export default CoreUtilisation
