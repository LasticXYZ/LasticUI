import Border from '@/components/border/Border'
import CoreItem from '@/components/cores/CoreItem'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import { parseNativeTokenToHuman } from '@/utils/account/token'
import { useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import { useEffect, useState } from 'react'

// Define a type for the queryParams
type QueryParams = (string | number | Record<string, unknown>)[]

type RegionDetailItem = {
  begin: string
  core: string
  mask: string
}

type RegionDetail = RegionDetailItem[]

type RegionOwner = {
  end: string
  owner: string
  paid: string
}

type Region = {
  detail: RegionDetail
  owner: RegionOwner
}

type RegionsType = Region[]

// Custom hook for querying substrate state
const useRegionQuery = () => {
  const { api } = useInkathon()
  const [data, setData] = useState<RegionsType | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (api?.query?.broker?.regions) {
        try {
          const entries = await api.query.broker.regions.entries()
          const regions: RegionsType = entries.map(([key, value]) => {
            const detail = key.toHuman() as RegionDetail
            const owner = value.toHuman() as RegionOwner
            return { detail, owner }
          })
          setData(regions)
        } catch (error) {
          console.error('Failed to fetch regions:', error)
        }
      }
    }

    fetchData()
    const intervalId = setInterval(fetchData, 5000)

    return () => clearInterval(intervalId)
  }, [api])

  return data
}

export default function MyCores() {
  const { activeAccount, activeChain } = useInkathon()
  let { tokenSymbol } = useBalance(activeAccount?.address, true)
  const regionData = useRegionQuery()

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  const handleNextPage = () => setCurrentPage(currentPage + 1)
  const handlePrevPage = () => setCurrentPage(currentPage - 1)

  if (!activeAccount || !activeChain) {
    return (
      <Border className="h-full flex flex-row justify-center items-center">
        <WalletStatus />
      </Border>
    )
  }

  // Filter regions where activeAccount's address matches the region owner's address
  const filteredRegionData = regionData
    ?.filter((region) => region.owner.owner === activeAccount.address)
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return filteredRegionData && filteredRegionData.length > 0 ? (
    <Border className="h-full flex flex-row justify-center items-center">
      <div className="h-full w-full flex flex-col justify-left items-left">
        <div className="pt-10 pl-10">
          <h1 className="text-xl font-unbounded uppercase font-bold">cores owned</h1>
          {/* Pagination buttons */}
          <div className="flex justify-center mt-3">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="mr-2 px-4 py-2 bg-gray-300 rounded text-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={
                !regionData || indexOfLastItem >= regionData.length // Disable when there are no more items
              }
              // disabled={filteredRegionData.length < itemsPerPage}
              // disabled={filteredRegionData.length <= indexOfLastItem}
              className="px-4 py-2 bg-gray-300 rounded text-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
        <div>
          {filteredRegionData.map((region, index) => (
            <div key={index} className="p-6">
              <CoreItem
                coreNumber={region.detail[0].core}
                size="1"
                cost={parseNativeTokenToHuman({ paid: region.owner.paid, decimals: 12 })}
                reward="0"
                currencyCost={tokenSymbol}
                currencyReward="LASTIC"
                mask={region.detail[0].mask}
                begin={region.detail[0].begin}
                end={region.owner.end}
              />
            </div>
          ))}
        </div>
      </div>
    </Border>
  ) : (
    <Border className="h-full flex flex-row justify-center items-center">
      <WalletStatus />
    </Border>
  )
}
