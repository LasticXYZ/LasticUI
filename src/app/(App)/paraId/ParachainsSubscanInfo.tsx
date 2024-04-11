import Border from '@/components/border/Border'
import { useSubScanCall } from '@/components/callSubscan/callSubScan'
import { ParachainInfoRequest, ParachainInfoResponse } from '@/components/callSubscan/types'
import GeneralTable from '@/components/table/GeneralTable'
import { toShortAddress } from '@/utils'
import { useInkathon } from '@poppyseed/lastic-sdk'
import React, { useMemo, useState } from 'react'
import { PossibleNetworks, network_list } from '../test/paraIdData'

const ParachainInfo: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
  const [paraId, setParaId] = useState<number | null>(null)
  const allStatuses = ['Parachain', 'Reserved', 'Onboarding', 'Parathread']
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
    'Parachain',
    'Reserved',
    'Onboarding',
    'Parathread',
  ])
  // Display depending on the network:
  const { activeRelayChain } = useInkathon()
  const network = activeRelayChain?.network

  const handleNextPage = () => setCurrentPage(currentPage + 1)
  const handlePrevPage = () => setCurrentPage(currentPage - 1)

  // Function to handle status checkbox changes
  const handleStatusChange = (status: string) => {
    setCurrentPage(0)
    setSelectedStatuses((prevStatuses) =>
      prevStatuses.includes(status)
        ? prevStatuses.filter((s) => s !== status)
        : [...prevStatuses, status],
    )
  }

  const requestData = useMemo<ParachainInfoRequest>(
    () => ({
      page: paraId ? 0 : currentPage, // If paraId is provided, page is always 0
      row: itemsPerPage,
      order: 'para_id asc',
      para_id: paraId || undefined, // Use undefined to omit the parameter if paraId is not set
      status: selectedStatuses,
    }),
    [currentPage, paraId, selectedStatuses],
  )

  const {
    data: auctionData,
    loading,
    error,
  } = useSubScanCall<ParachainInfoResponse>({
    apiUrl: `${network ? network_list[network as PossibleNetworks].apiUrl : network_list['polkadot'].apiUrl}/scan/parachain/list`,
    requestData,
  })

  const TableHeader = [
    { title: 'Para Id' },
    { title: 'Chain Name' },
    { title: 'Status' },
    { title: 'Owner' },
    { title: 'Lease Period' },
  ]

  const TableData = auctionData
    ? auctionData.data.chains?.map((paraInfo) => ({
        data: [
          paraInfo.para_id.toString(),
          network_list[network as PossibleNetworks].paraId.hasOwnProperty(
            paraInfo.para_id.toString(),
          )
            ? network_list[network as PossibleNetworks].paraId[paraInfo.para_id.toString()]
            : null,
          paraInfo.status,
          toShortAddress(paraInfo.manager_display?.address),
          `${paraInfo.first_period} - ${paraInfo.last_period}`,
        ],
      }))
    : []

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return auctionData ? (
    <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
      <Border>
        <div className="pt-10 pl-10">
          <h1 className="text-xl font-unbounded uppercase font-bold">
            Subscan data from {network} relay chain
          </h1>
        </div>
        {/* Input for paraId */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-2 mt-5 ml-14">
          <input
            type="number"
            className="form-input mt-1 block w-full sm:w-64 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={paraId || ''}
            onChange={(e) => setParaId(e.target.value ? parseInt(e.target.value, 10) : null)}
            placeholder="Enter ParaId"
          />
          {/* Checkboxes for selecting statuses */}
          <div className="flex flex-wrap items-center gap-2">
            {allStatuses.map((status) => (
              <label key={status} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 rounded"
                  checked={selectedStatuses.includes(status)}
                  onChange={() => handleStatusChange(status)}
                />
                <span className="text-sm text-gray-17">{status}</span>
              </label>
            ))}
          </div>
        </div>
        {TableData ? (
          <>
            <div className="mx-auto max-w-9xl px-4 mt-5 sm:px-6 lg:px-8">
              <GeneralTable
                tableData={TableData}
                tableHeader={TableHeader}
                colClass="grid-cols-5"
              />
            </div>

            <div className="flex w-full items-center justify-between space-x-2  p-10">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className={`px-4 py-2 rounded-2xl text-black border border-gray-21 font-semibold ${currentPage === 0 ? 'bg-gray-4 text-gray-18 cursor-not-allowed' : ' hover:bg-green-6'}`}
              >
                Previous
              </button>
              <p className="text-black font-semibold">{currentPage}</p>
              <button
                onClick={handleNextPage}
                disabled={auctionData.data.chains.length < itemsPerPage}
                className={`px-4 py-2   border border-gray-21 text-black font-semibold rounded-2xl ${auctionData.data.chains.length < itemsPerPage ? 'bg-gray-4 text-gray-18 cursor-not-allowed' : ' hover:bg-green-6'}`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="p-10">No data available.</p>
        )}
      </Border>
    </section>
  ) : null
}

export default ParachainInfo
