import AccordionTile from '@/components/accordion/AccordionTile'
import Border from '@/components/border/Border'
import { useSubScanCall } from '@/components/callSubscan/callSubScan'
import { ParachainInfoRequest, ParachainInfoResponse } from '@/components/callSubscan/types'
import GeneralTable from '@/components/table/GeneralTable'
import { toShortAddress } from '@/utils'
import { useInkathon } from '@poppyseed/lastic-sdk'
import React, { useMemo, useState } from 'react'

const network_list = [
  {
    name: 'Polkadot',
    currency: 'DOT',
    apiUrl: 'https://polkadot.api.subscan.io/api/scan/parachain/list',
  },
  {
    name: 'Kusama',
    currency: 'KSM',
    apiUrl: 'https://kusama.api.subscan.io/api/scan/parachain/list',
  },
  {
    name: 'westend',
    currency: 'WST',
    apiUrl: 'https://rococo.api.subscan.io/api/scan/parachain/list',
  },
  {
    name: 'rococo',
    currency: 'ROC',
    apiUrl: 'https://rococo.api.subscan.io/api/scan/parachain/list',
  },
]

const ParachainInfo: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 7
  const { activeRelayChain } = useInkathon()

  const network = activeRelayChain?.network
  console.log(network)

  const handleNextPage = () => setCurrentPage(currentPage + 1)
  const handlePrevPage = () => setCurrentPage(currentPage - 1)

  const requestData = useMemo<ParachainInfoRequest>(
    () => ({
      page: currentPage,
      row: itemsPerPage,
      order: 'para_id asc',
      status: [
        'Parachain',
        'DowngradingParachain',
        'OffboardingParachain',
        'UpgradingToParachain',
        'Reserved',
        'Onboarding',
        'Parathread',
        'UpgradingParathread',
        'DowngradingToParathread',
      ],
    }),
    [],
  )

  const {
    data: auctionData,
    loading,
    error,
  } = useSubScanCall<ParachainInfoResponse>({
    apiUrl: 'https://rococo.api.subscan.io/api/scan/parachain/list',
    requestData: requestData,
  })

  const TableHeader = [
    { title: 'Para Id' },
    { title: 'Status' },
    { title: 'Address' },
    { title: 'Early End Block' },
    { title: 'Extinguish Block' },
    { title: 'Lease Period' },
    { title: 'para_id' },
    { title: 'Owner' },
  ]

  const network_currency = network_list[0].currency

  const TableData = auctionData
    ? auctionData.data.chains.map((paraInfo) => ({
        data: [
          paraInfo.para_id.toString(),
          paraInfo.status,
          toShortAddress(paraInfo.manager_display?.address),
          paraInfo.manager_display?.display,
          paraInfo.manager_display?.identity ? 'Yes' : 'No',
          toShortAddress(paraInfo.manager_display?.parent?.address),
        ],
      }))
    : []

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return auctionData ? (
    <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
      <Border>
        <div className="pt-10 pl-10">
          <h1 className="text-xl font-unbounded uppercase font-bold">Data Analysis</h1>
        </div>
        <div className="grid grid-cols-4 font-montserrat p-6 w-full">
          <div className="col-span-1 grid grid-cols-1 gap-4 mb-4">
            <div className=" p-2">
              <AccordionTile question="Money in auctions" answer="twr-aerawerae" />
            </div>
          </div>
          <div className=" col-span-3 p-4">
            {/* <BarGraph auctionIndices={auctionIndices || []} dotAmounts={dotAmounts || []} /> */}
          </div>
        </div>
        <div className="mx-auto max-w-9xl px-4 mt-5 sm:px-6 lg:px-8">
          <GeneralTable tableData={TableData} tableHeader={TableHeader} colClass="grid-cols-8" />
        </div>

        {/* Pagination buttons */}
        <div className="flex w-full items-center justify-between space-x-2 mt-4 px-5">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className={`px-4 py-2 rounded-2xl text-black border border-gray-21 font-semibold ${currentPage === 1 ? 'bg-gray-4 text-gray-18 cursor-not-allowed' : ' hover:bg-green-6'}`}
          >
            Previous
          </button>
          <p className="text-black font-semibold">{currentPage}</p>
          <button
            onClick={handleNextPage}
            className={`px-4 py-2   border border-gray-21 text-black font-semibold rounded-2xl ${auctionData.data.chains.length < itemsPerPage ? 'bg-gray-4 text-gray-18 cursor-not-allowed' : ' hover:bg-green-6'}`}
          >
            Next
          </button>
        </div>
      </Border>
    </section>
  ) : null
}

export default ParachainInfo
