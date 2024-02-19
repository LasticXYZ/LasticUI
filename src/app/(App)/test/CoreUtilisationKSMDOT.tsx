import AccordionTile from '@/components/accordion/AccordionTile'
import Border from '@/components/border/Border'
import { useSubScanCall } from '@/components/callSubscan/callSubScan'
import { AuctionResponse, AuctionsRequest } from '@/components/callSubscan/types'
import BarGraph from '@/components/graph/BarGraph'
import GeneralTable from '@/components/table/GeneralTable'
import React, { useMemo } from 'react'

const CoreOwners: React.FC = () => {
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
    apiUrl: 'https://polkadot.api.subscan.io/api/scan/parachain/auctions',
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

  const auctionIndices = auctionData?.data.auctions
    .map((auction) => auction.auction_index.toString())
    .reverse()
  const dotAmounts = auctionData?.data.auctions
    .map((auction) =>
      auction.winners
        ? auction.winners.reduce((acc, winner) => acc + winner.amount / 1000000000, 0)
        : 0,
    )
    .reverse()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return auctionData ? (
    <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
      <Border>
        <div className="pt-10 pl-10">
          <h1 className="text-xl font-unbounded uppercase font-bold">core utilization</h1>
        </div>
        <div className="grid grid-cols-4 font-montserrat p-6 w-full">
          <div className="col-span-1 grid grid-cols-1 gap-4 mb-4">
            <div className=" p-2">
              <AccordionTile question="Core Utilization" answer="twr-aerawerae" />
              <AccordionTile question="Project Name" answer="twr-aerawerae" />
              <AccordionTile question="Para ID" answer="twr-aerawerae" />
              <AccordionTile question="Nb. of Cores Owned" answer="twr-aerawerae" />
              <AccordionTile question="% Owned<" answer="twr-aerawerae" />
              <AccordionTile question="Period Until Renewal" answer="twr-aerawerae" />
              <AccordionTile question="Monthly price per Core" answer="twr-aerawerae" />
              <AccordionTile question="Volume and Price" answer="twr-aerawerae" />
            </div>
          </div>
          <div className=" col-span-3 p-4">
            <BarGraph auctionIndices={auctionIndices || []} dotAmounts={dotAmounts || []} />
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
