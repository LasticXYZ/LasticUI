import Border from '@/components/border/Border'
import { useSubScanCall } from '@/components/callSubscan/callSubScan'
import { AuctionResponse, AuctionsRequest } from '@/components/callSubscan/types'
import MiniBarGraphData from '@/components/graph/MiniBarGraphData'
import GeneralTable from '@/components/table/GeneralTable'
import React, { useMemo, useState } from 'react'

type DataSetKey = 'auction' // Add more keys as needed

const CoreOwners: React.FC = () => {
  const [activeDataSet, setActiveDataSet] = useState<DataSetKey>('auction') // Change to string to accommodate multiple datasets

  const requestData = useMemo<AuctionsRequest>(
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
    loading,
    error,
  } = useSubScanCall<AuctionResponse>({
    apiUrl: 'https://kusama.api.subscan.io/api/scan/parachain/auctions',
    requestData: requestData,
  })

  const TableHeader = [
    { title: 'Auction Index' },
    { title: 'Start Block' },
    { title: 'End Block' },
    { title: 'Early End Block' },
    { title: 'Extinguish Block' },
    { title: 'Lease Period' },
    { title: 'Amount' },
    { title: 'Winner Address' },
  ]

  const network_list = [
    {
      name: 'Polkadot',
      currency: 'DOT',
      apiUrl: 'https://polkadot.api.subscan.io/api/scan/parachain/auctions',
    },
    {
      name: 'Kusama',
      currency: 'KSM',
      apiUrl: 'https://kusama.api.subscan.io/api/scan/parachain/auctions',
    },
    {
      name: 'Rococo',
      currency: 'ROC',
      apiUrl: 'https://rococo.api.subscan.io/api/scan/parachain/auctions',
    },
  ]

  const network_currency = network_list[0].currency

  const labels = auctionData?.data.auctions
    .map((auction) => auction.auction_index.toString())
    .reverse()

  const dataPoints = auctionData?.data.auctions
    .map((auction) =>
      auction.winners
        ? auction.winners.reduce((acc, winner) => acc + winner.amount / 1000000000, 0)
        : 0,
    )
    .reverse()

  const dataConfigs = {
    auction: {
      label: 'Auction Prices',
      dataPoints: dataPoints ? dataPoints : [],
    },
  }

  const TableData = auctionData
    ? auctionData.data.auctions.map((auction) => ({
        href: '/', // or any other relevant link
        data: [
          auction.auction_index.toString(),
          auction.start_block.toString(),
          auction.end_block.toString(),
          auction.early_end_block.toString(),
          auction.extinguish_block.toString(),
          auction.lease_index.toString(),
          auction.winners
            ? auction.winners
                .map((winner) => `${winner.amount / 1000000000} ${network_currency}`)
                .join(', ')
            : 'Auction ongoing',
          auction.winners
            ? auction.winners.map((winner) => winner.bidder_account).join(', ')
            : 'Auction ongoing',
        ],
      }))
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
      className={`py-2 px-4 text-left hover:font-semibold border-b border-gray-18 ${activeDataSet === key ? 'text-pink-5 font-semibold' : 'text-gray-16'}`}
    >
      {dataConfigs[key as DataSetKey].label}
    </button>
  ))

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return auctionData ? (
    <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
      <Border>
        <div className="pt-10 pl-10">
          <h1 className="text-2xl font-unbounded uppercase font-bold">Core Data</h1>
        </div>
        <div className="grid grid-cols-4 font-montserrat p-6 w-full">
          <div className="col-span-1 grid grid-cols-1 gap-4 mb-4">
            <div className="col-span-1">
              <div className="p-2 flex flex-col space-y-4">{dataSetOptions}</div>
            </div>
          </div>
          <div className=" col-span-3 p-4">
            {labels && labels.length > 0 && (
              <MiniBarGraphData
                title={dataConfigs[activeDataSet].label}
                labels={labels}
                dataPoints={dataConfigs[activeDataSet].dataPoints}
              />
            )}
          </div>
        </div>
        <div className="mx-auto max-w-9xl px-4 mt-5 sm:px-6 lg:px-8">
          <GeneralTable tableData={TableData} tableHeader={TableHeader} colClass="grid-cols-8" />
        </div>
      </Border>
    </section>
  ) : null
}

export default CoreOwners
