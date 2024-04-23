import Border from '@/components/border/Border'
import CoreItem from '@/components/cores/CoreItem'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import { network_list } from '@/config/network'
import { parseNativeTokenToHuman } from '@/utils/account/token'
import { getChainFromPath } from '@/utils/common/chainPath'
import { useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import { CoreOwnerEvent, GraphLike, GraphQuery, getClient } from '@poppyseed/squid-sdk'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

export default function MyCores() {
  const { activeAccount, activeChain, activeRelayChain } = useInkathon()
  let { tokenSymbol } = useBalance(activeAccount?.address, true)
  const [result, setResult] = useState<GraphLike<CoreOwnerEvent[]> | null>(null)
  const client = useMemo(() => getClient(), [])
  const network = activeRelayChain?.network
  const pathname = usePathname()
  const configuration = network_list[getChainFromPath(pathname)].configuration

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  let query: GraphQuery
  //const newAddress = encodeAddress(publicKeyBytes, targetNetworkPrefix)
  if (activeAccount) {
    query = client.eventWhoPurchased(activeAccount?.address, 7)
  }

  const handleNextPage = () => setCurrentPage(currentPage + 1)
  const handlePrevPage = () => setCurrentPage(currentPage - 1)

  useEffect(() => {
    if (network && query) {
      const fetchData = async () => {
        const fetchedResult: GraphLike<CoreOwnerEvent[]> = await client.fetch(network, query)
        setResult(fetchedResult)
      }

      fetchData()
    }
  }, [])

  if (!activeAccount || !activeChain) {
    return (
      <Border className="h-full flex flex-row justify-center items-center">
        <WalletStatus inactiveWalletMessage="Connect wallet in order to see your Coretime." />
      </Border>
    )
  }

  return result?.data.event ? (
    <Border className="h-full flex flex-row justify-center items-center">
      <div className="h-full w-full flex flex-col justify-left items-left px-5 pb-10">
        <div className="pt-10 pl-10">
          <h1 className="text-xl font-unbounded uppercase font-bold">cores owned</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 mt-4">
          {result?.data.event.map((region, index) => (
            <div key={index} className="">
              <CoreItem
                config={configuration}
                coreNumber={region.detail[0].core}
                size={region.detail[0].mask === '0xffffffffffffffffffff' ? '1' : 'Interlaced'}
                cost={parseNativeTokenToHuman({ paid: region.owner.paid, decimals: 12 })}
                reward="0"
                currencyCost={tokenSymbol}
                mask={region.detail[0].mask}
                begin={region.detail[0].begin}
                end={region.owner.end}
              />
            </div>
          ))}
        </div>
        {/* Pagination buttons 
        {!filteredForDisplay ||
          !regionData ||
          (filteredForDisplay.length !== 0 && (
            <div className="flex w-full items-center justify-between space-x-2 mt-4 px-5">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-2xl text-black dark:text-gray-1 border border-gray-21 font-semibold ${currentPage === 1 ? 'bg-gray-4 text-gray-18 cursor-not-allowed' : ' hover:bg-green-6'}`}
              >
                Previous
              </button>
              <p className="text-black dark:text-gray-1 font-semibold">{currentPage}</p>
              <button
                onClick={handleNextPage}
                disabled={filteredForDisplay.length < itemsPerPage}
                className={`px-4 py-2   border border-gray-21 text-black dark:text-gray-1 font-semibold rounded-2xl ${filteredForDisplay.length < itemsPerPage ? 'bg-gray-4 text-gray-18 cursor-not-allowed' : ' hover:bg-green-6'}`}
              >
                Next
              </button>
            </div>
          ))}
          */}
      </div>
    </Border>
  ) : (
    <Border className="h-full flex flex-row justify-center items-center">
      <WalletStatus />
    </Border>
  )
}
