import GeneralTable from '@/components/table/GeneralTable'
import { parseNativeTokenToHuman, toShortAddress } from '@/utils/account/token'
import { useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import { GraphLike, PurchasedEvent, getClient } from '@poppyseed/squid-sdk'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

const PastTransactions = () => {
  const { activeAccount, activeRelayChain } = useInkathon()

  const [result, setResult] = useState<GraphLike<PurchasedEvent[]> | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [offset, setOffset] = useState(0)
  const client = getClient()

  let { tokenSymbol } = useBalance(activeAccount?.address, true)
  tokenSymbol = tokenSymbol || 'UNIT'

  useEffect(() => {
    const fetchData = async () => {
      let query = client.eventAllPurchased(7, offset)
      const fetchedResult: GraphLike<PurchasedEvent[]> = await client.fetch(
        activeRelayChain?.network,
        query,
      )
      setResult(fetchedResult)
    }

    fetchData()
  }, [activeRelayChain, client, offset]) // Add offset to the dependency array

  const TableHeader = [
    { title: 'Time' },
    { title: 'Block Number' },
    { title: 'Purchased By' },
    { title: 'Core Nb.' },
    { title: 'RegionID Begin' },
    { title: 'Price' },
  ]

  const TableData =
    result?.data.event?.map((event, index) => ({
      data: [
        event.timestamp ? format(new Date(event.timestamp), 'MMMM dd, yyyy HH:mm:ss OOOO') : '',
        event.blockNumber?.toString(),
        toShortAddress(event.who, 5),
        event.regionId.core?.toString(),
        event.regionId.begin?.toString(),
        `${parseNativeTokenToHuman({ paid: event.price?.toString(), decimals: 12 })} ${tokenSymbol}`,
      ],
    })) || []

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      setOffset(offset - 10)
    }
  }

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1)
    setOffset(offset + 10)
  }

  return (
    <div>
      <div className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
        <div>
          {result ? (
            <>
              <GeneralTable
                tableData={TableData}
                tableHeader={TableHeader}
                colClass="grid-cols-6"
              />
              <div className="flex justify-between space-x-2 mt-4 p-5">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-2xl text-black dark:text-gray-1 border border-gray-21 font-semibold ${currentPage === 1 ? 'bg-gray-2 dark:bg-gray-20 dark:text-gray-14 text-gray-14 cursor-not-allowed' : ' dark:border-gray-4 hover:bg-pink-400'}`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  className="px-4 py-2 hover:bg-pink-400 border border-gray-21 dark:border-gray-4 text-black dark:text-gray-1 font-semibold rounded-2xl"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p>Loading transactions...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PastTransactions
