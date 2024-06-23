import Border from '@/components/border/Border'
import { useSubScanCall } from '@/components/callSubscan/callSubScan'
import { AuctionResponse, AuctionsRequest } from '@/components/callSubscan/types'
import MiniBarGraphData from '@/components/graph/MiniBarGraphData'
import MiniLineGraphData from '@/components/graph/MiniLineGraphData'
import { network_list } from '@/config/network'
import { useSaleRegions } from '@/hooks/subsquid'
import { useSaleInfo } from '@/hooks/useSubstrateQuery'
import { priceCurve } from '@/utils'
import { getChainFromPath } from '@/utils/common/chainPath'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { getClient } from '@poppyseed/squid-sdk'
import { usePathname } from 'next/navigation'
import React, { useMemo, useState, type ReactNode } from 'react'
import CoreOwners from './CoreOwners'

type DataSetKey = 'priceOnePeriod' | 'price' | 'cores' | 'pastAuctions' // Add more keys as needed

type GraphData = {
  line: boolean
  label: string
  dataPoints: number[]
  labels: string[]
  xLabel: string
  yLabel: string
  footnote?: ReactNode
}

const CoreUtilisation: React.FC = () => {
  const pathname = usePathname()
  const network = getChainFromPath(pathname)
  const decimalPoints = network_list[network].tokenDecimals
  const { api } = useInkathon()

  const [activeDataSet, setActiveDataSet] = useState<DataSetKey>('priceOnePeriod') // Change to string to accommodate multiple datasets
  const client = useMemo(() => getClient(), [])
  const saleInfo = useSaleInfo(api)

  const saleRegions = useSaleRegions(network, client)
  const currentSaleRegion = saleRegions?.data.event ? saleRegions.data.event[0] : null
  const constant = network_list[network].constants
  const config = network_list[network].configuration
  let price_xy: { x: number[]; y: number[] } | undefined
  if (saleInfo && config && constant) {
    price_xy = priceCurve(saleInfo, config, constant)
    //console.log(price_xy)
  }

  const requestAuctionData = useMemo<AuctionsRequest>(
    () => ({
      auction_index: 0,
      page: 0,
      row: 10,
      status: 0,
    }),
    [],
  )

  const {
    data: auctionData,
    loading: auctionLoading,
    error: auctionError,
  } = useSubScanCall<AuctionResponse>({
    apiUrl: `${network_list[network].apiUrl}/scan/parachain/auctions`,
    requestData: requestAuctionData,
  })

  // Configurations for different data sets
  const dataConfigs = {
    priceOnePeriod: {
      line: true,
      label: 'Price Per Core In One Period',
      dataPoints: price_xy ? price_xy.y.map((price) => price / 10 ** decimalPoints) : [],
      labels: price_xy
        ? price_xy.x.map(
            (period) => `${period === currentSaleRegion?.saleStart ? 'Sale Start' : period}`,
          )
        : [],
      xLabel: 'Block Number',
      yLabel: `Price - ${network_list[network].tokenSymbol}`,
      footnote: (
        <span>
          Pricing curve indicative of the{' '}
          <a
            className="underline hover:font-bold"
            href="https://grillapp.net/12935/agile-coretime-pricing-explained-166522"
            target="_blank"
          >
            new pricing model
          </a>
        </span>
      ),
    },
    price: {
      line: false,
      label: 'Price Per Core Over Time',
      dataPoints: saleRegions?.data.event
        ? [...saleRegions.data.event]
            .reverse()
            .map((event) => Number(event.regularPrice) / 10 ** decimalPoints || 0)
        : [],
      labels: saleRegions?.data.event
        ? [...saleRegions.data.event]
            .reverse()
            .map((event, index) => `Nb. ${index + 1} - Rg. ${event.regionBegin}`)
        : [],
      xLabel: 'Regions',
      yLabel: `Stable Price - ${network_list[network].tokenSymbol}`,
    },
    cores: {
      line: false,
      label: 'Cores Offered',
      dataPoints: saleRegions?.data.event
        ? [...saleRegions.data.event]
            .reverse()
            .map((event) => parseFloat(event.coresOffered?.toString() || '0'))
        : [],
      labels: saleRegions?.data.event
        ? [...saleRegions.data.event]
            .reverse()
            .map((event, index) => `Nb. ${index + 1} - Rg. ${event.regionBegin}`)
        : [],
      xLabel: 'Regions',
      yLabel: 'Number of Cores Offered',
    },
    pastAuctions: {
      line: false,
      label: 'Monthly Auctions in the Past',
      dataPoints: auctionData?.data.auctions
        ? auctionData?.data.auctions
            .map((auction) =>
              auction.winners
                ? auction.winners.reduce(
                    (acc, winner) => acc + winner.amount / 10 ** decimalPoints,
                    0,
                  )
                : 0,
            )
            .reverse()
        : [],
      labels: auctionData?.data.auctions
        ? auctionData?.data.auctions.map((auction) => auction.auction_index.toString()).reverse()
        : [],
      xLabel: 'Auction Index',
      yLabel: `Amount in ${network_list[network].tokenSymbol}`,
    },
  } as const satisfies Record<string, GraphData>

  const activeData = dataConfigs[activeDataSet]

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
          <section className="col-span-3 p-4">
            {activeData.line ? (
              <MiniLineGraphData
                title={activeData.label}
                labels={activeData.labels}
                dataPoints={activeData.dataPoints}
                xLabel={activeData.xLabel}
                yLabel={activeData.yLabel}
              />
            ) : (
              <MiniBarGraphData
                title={activeData.label}
                labels={activeData.labels}
                dataPoints={activeData.dataPoints}
                xLabel={activeData.xLabel}
                yLabel={activeData.yLabel}
              />
            )}
            {'footnote' in activeData ? (
              <footer className="text-xs text-gray-16 text-end">{activeData.footnote}</footer>
            ) : null}
          </section>
        </div>
        <CoreOwners />
      </Border>
    </section>
  )
}

export default CoreUtilisation
