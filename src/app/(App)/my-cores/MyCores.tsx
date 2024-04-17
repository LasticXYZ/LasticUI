import Border from '@/components/border/Border'
import CoreItem from '@/components/cores/CoreItem'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import { useSubstrateQuery } from '@/hooks/useSubstrateQuery'
import { parseNativeTokenToHuman } from '@/utils/account/token'
import { ConfigurationType, useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import { useEffect, useMemo, useState } from 'react'

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
  const { activeAccount, activeChain, api } = useInkathon()
  let { tokenSymbol } = useBalance(activeAccount?.address, true)
  const regionData = useRegionQuery()

  const configurationString = useSubstrateQuery(api, 'configuration')

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const handleNextPage = () => setCurrentPage(currentPage + 1)
  const handlePrevPage = () => setCurrentPage(currentPage - 1)

  const configuration = useMemo(
    () => (configurationString ? (JSON.parse(configurationString) as ConfigurationType) : null),
    [configurationString],
  )

  if (!activeAccount || !activeChain) {
    return (
      <Border className="h-full flex flex-row justify-center items-center">
        <WalletStatus />
      </Border>
    )
  }

  // Filter regions where activeAccount's address matches the region owner's address
  const filteredRegionData = regionData?.filter(
    (region) => region.owner.owner === activeAccount.address,
  )
  const filteredForDisplay = filteredRegionData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return filteredForDisplay && filteredForDisplay.length > 0 ? (
    <Border className="h-full flex flex-row justify-center items-center">
      <div className="h-full w-full flex flex-col justify-left items-left px-5 pb-10">
        <div className="pt-10 pl-10">
          <h1 className="text-xl font-unbounded uppercase font-bold">cores owned</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 mt-4">
          {filteredForDisplay.map((region, index) => (
            <div key={index} className="">
              <CoreItem
                config={configuration}
                coreNumber={region.detail[0].core}
                size={region.detail[0].mask === '0xffffffffffffffffffff' ? '1' : 'Interlaced'}
                cost={parseNativeTokenToHuman({ paid: region.owner.paid, decimals: 12 })}
                reward="0"
                currencyCost={tokenSymbol}
                currencyReward="LST"
                mask={region.detail[0].mask}
                begin={region.detail[0].begin}
                end={region.owner.end}
              />
            </div>
          ))}
        </div>
        {/* Pagination buttons */}
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
      </div>
    </Border>
  ) : (
    <Border className="h-full flex flex-row justify-center items-center">
      <WalletStatus />
    </Border>
  )
}
