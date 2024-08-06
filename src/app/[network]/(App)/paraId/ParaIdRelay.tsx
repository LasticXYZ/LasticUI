import Border from '@/components/border/Border'
import GeneralTable from '@/components/table/GeneralTable'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import { PossibleNetworks, network_list } from '@/config/network'
import { parseFormattedNumber, toShortHead } from '@/utils'
import { getChainFromPath } from '@/utils/common/chainPath'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

type ParasHeadType = {
  parachain: string[]
  head: string
}

// Custom hook for querying and transforming workplan data
const useParasHead = () => {
  const { relayApi } = useInkathon()
  const [data, setData] = useState<ParasHeadType[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!relayApi?.query?.paras?.heads) return
      try {
        const entries = await relayApi.query.paras.heads.entries()
        const data: ParasHeadType[] = entries.map(([key, value]) => {
          const parachain: string[] = key.toHuman() as string[]

          const head: string = value.toHuman() as string

          return { parachain, head }
        })
        setData(data)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchData()
    const intervalId = setInterval(fetchData, 5000) as unknown as number
    return () => clearInterval(intervalId)
  }, [relayApi])

  return data
}

// Custom hook for querying and transforming workplan data
const useParasParachains = () => {
  const { relayApi } = useInkathon()
  const [data, setData] = useState<string[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!relayApi?.query?.paras?.parachains) return
      try {
        const entries = await relayApi.query.paras.parachains()
        const data: string[] = entries.toHuman() as string[]
        //console.log(data)
        setData(data)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchData()
    const intervalId = setInterval(fetchData, 5000) as unknown as number
    return () => clearInterval(intervalId)
  }, [relayApi])

  return data
}

const ParaIdRelay = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState<number | null>(null)
  const itemsPerPage = 10
  const { activeRelayChain } = useInkathon()
  const pathname = usePathname()
  const network = getChainFromPath(pathname)

  const parasHead = useParasHead()
  const parasParachains = useParasParachains()

  const handleNextPage = () => setCurrentPage(currentPage + 1)
  const handlePrevPage = () => setCurrentPage(currentPage - 1)

  // Merge and deduplicate parachain IDs from both parasParachains and parasHead
  const allParaIds = [
    ...(parasParachains || []),
    ...(parasHead || []).flatMap((head) => head.parachain),
  ]

  // Deduplicate allParaIds
  const uniqueParaIds = Array.from(new Set(allParaIds))

  // Combine the data, ensuring no duplicates and including all possible paraIds
  const combinedData = uniqueParaIds.map((paraId) => {
    const headData = parasHead?.find((head) => head.parachain.includes(paraId))
    return {
      parachain: parseFormattedNumber(paraId),
      head: headData ? toShortHead(headData.head) : 'No head registered',
      para: parasParachains?.includes(paraId) ? 'Parachain' : 'Registered',
    }
  })

  // Filter and order logic
  const filteredAndOrderedData = useMemo(() => {
    return combinedData
      .filter((data) => !searchTerm || data.parachain === searchTerm)
      .sort((a, b) => a.parachain - b.parachain)
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  }, [combinedData, searchTerm, currentPage, itemsPerPage])

  if (!activeRelayChain) {
    return (
      <Border className="h-full flex flex-row justify-center items-center">
        <WalletStatus />
      </Border>
    )
  }

  return (
    <Border className="h-full flex flex-row justify-center items-center">
      <div className="h-full w-full flex flex-col justify-start items-start p-10">
        <h1 className="text-xl font-bold font-unbounded uppercase mb-5">
          Executing on the Relay chain
        </h1>
        {/* Search input */}
        <input
          id="task"
          type="number"
          placeholder="Search by ParaId..."
          value={searchTerm || ''}
          onChange={(e) => setSearchTerm(parseFloat(e.target.value) || null)}
          className="ml-2 p-2 border rounded"
        />

        {filteredAndOrderedData && filteredAndOrderedData.length > 0 ? (
          <>
            <div className="w-full overflow-x-auto">
              <GeneralTable
                tableData={filteredAndOrderedData.map((data, index) => ({
                  data: [
                    data.parachain.toString(),
                    network_list[network as PossibleNetworks].paraId.hasOwnProperty(
                      data.parachain.toString(),
                    )
                      ? network_list[network as PossibleNetworks].paraId[data.parachain.toString()]
                          .name
                      : null,
                    data.head.toString(),
                    data.para.toString(),
                  ],
                }))}
                tableHeader={[
                  { title: 'Parachain' },
                  { title: 'Chain Name' },
                  { title: 'Head' },
                  { title: 'Status' },
                ]}
                colClass="grid-cols-4"
              />
            </div>

            <div className="flex w-full items-center justify-between space-x-2 mt-4 px-5">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-2xl text-black dark:text-gray-1 border border-gray-21 font-semibold ${currentPage === 1 ? 'bg-gray-2 dark:bg-gray-20 dark:text-gray-14 text-gray-14 cursor-not-allowed' : ' hover:bg-green-6'}`}
              >
                Previous
              </button>
              <p className="text-black dark:text-gray-1 font-semibold">{currentPage}</p>
              <button
                onClick={handleNextPage}
                disabled={
                  filteredAndOrderedData.length < itemsPerPage ||
                  filteredAndOrderedData.length === 0
                }
                className={`px-4 py-2   border border-gray-21 text-black dark:text-gray-1 font-semibold rounded-2xl ${filteredAndOrderedData.length < itemsPerPage ? 'bg-gray-2 dark:bg-gray-20 dark:text-gray-14 text-gray-14 cursor-not-allowed' : ' hover:bg-green-6'}`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </Border>
  )
}

export default ParaIdRelay
