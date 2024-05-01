import Border from '@/components/border/Border'
import CoreItem from '@/components/cores/CoreItem'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import { network_list } from '@/config/network'
import { parseNativeTokenToHuman } from '@/utils/account/token'
import { getChainFromPath } from '@/utils/common/chainPath'
import { useInkathon } from '@poppyseed/lastic-sdk'
import {
  CoreOwnerEvent,
  GraphLike,
  GraphQuery,
  SaleInitializedEvent,
  getClient,
} from '@poppyseed/squid-sdk'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

export default function PastCoresSold() {
  const { activeAccount, activeChain } = useInkathon()
  const [result, setResult] = useState<GraphLike<CoreOwnerEvent[]> | null>(null)
  const [assignedCores, setAssignedCores] = useState<GraphLike<CoreOwnerEvent[]> | null>(null)
  const [pooledCores, setPooledCores] = useState<GraphLike<CoreOwnerEvent[]> | null>(null)
  const [currentSaleData, setCurrentSaleData] = useState<GraphLike<SaleInitializedEvent[]> | null>(
    null,
  )
  const client = useMemo(() => getClient(), [])
  const pathname = usePathname()
  const network = getChainFromPath(pathname)
  const tokenSymbol = network_list[network].tokenSymbol
  const configuration = network_list[network].configuration

  //const newAddress = encodeAddress(publicKeyBytes, targetNetworkPrefix)

  useMemo(() => {
    let query1 = client.eventAllSaleInitialized(2)
    if (network && query1) {
      const fetchData = async () => {
        const fetchedResult: GraphLike<SaleInitializedEvent[]> = await client.fetch(network, query1)
        setCurrentSaleData(fetchedResult)
      }

      fetchData()
    }
  }, [network, client])

  useEffect(() => {
    let query: GraphQuery | undefined
    let query2: GraphQuery | undefined
    let query3: GraphQuery | undefined

    if (activeAccount && currentSaleData?.data?.event?.length && configuration) {
      const currentSaleRegion = currentSaleData.data.event[0]

      if (currentSaleRegion.regionBegin) {
        query = client.eventAllCoreOwner(
          currentSaleRegion.regionBegin,
          currentSaleRegion.regionBegin + configuration.regionLength,
        )
        query2 = client.eventOwnedAndAssignedCoreOwner(activeAccount.address)
        query3 = client.eventOwnedAndPooledCoreOwner(activeAccount.address)
      }
    }

    if (network && query && query2 && query3) {
      const fetchData = async () => {
        const fetchedResult: GraphLike<CoreOwnerEvent[]> = await client.fetch(network, query)
        const assignedFetchedResult: GraphLike<CoreOwnerEvent[]> = await client.fetch(
          network,
          query2,
        )
        const pooledFetchedResult: GraphLike<CoreOwnerEvent[]> = await client.fetch(network, query3)
        setResult(fetchedResult)
        setAssignedCores(assignedFetchedResult)
        setPooledCores(pooledFetchedResult)
      }

      fetchData()
    }
  }, [activeAccount, network, currentSaleData, client, configuration])

  if (!activeChain) {
    return (
      <Border className="h-full flex flex-row justify-center items-center">
        <WalletStatus
          inactiveWalletEmoji="🌐"
          customEmoji="🌐"
          inactiveWalletMessage="Connecting..."
          customMessage="Connecting..."
        />
      </Border>
    )
  }

  // Splitting the results into two sections
  const currentSaleRegion = currentSaleData?.data?.event?.[0]
  const justBought =
    result?.data?.event?.filter((region) =>
      region.regionId.begin && currentSaleRegion?.regionBegin
        ? region.regionId.begin >= currentSaleRegion.regionBegin
        : null,
    ) || []

  return result?.data?.event && result?.data?.event.length > 0 ? (
    <Border className="h-full flex flex-row justify-center items-center">
      <div className="h-full w-full flex flex-col justify-left items-left px-5 pb-10">
        <div className="pt-10 pl-4">
          <h1 className="text-xl font-bold uppercase font-unbounded ">
            <span className="text-2xl pr-2">🕵️ </span>Community Spy section
          </h1>
        </div>
        <SectionDisplay
          title="Bought in this Sale"
          regions={justBought}
          configuration={configuration}
          tokenSymbol={tokenSymbol}
        />
      </div>
    </Border>
  ) : (
    <Border className="h-full flex flex-row justify-center items-center">
      <WalletStatus
        inactiveWalletEmoji="🌐"
        customEmoji="🌐"
        inactiveWalletMessage="Connecting..."
        customMessage="Connecting..."
      />
    </Border>
  )
}

interface SectionProps {
  title: string
  regions: CoreOwnerEvent[]
  configuration: any // Define more specific types based on what 'configuration' contains
  tokenSymbol: string
}

function SectionDisplay({ title, regions, configuration, tokenSymbol }: SectionProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const handleNextPage = () => setCurrentPage(currentPage + 1)
  const handlePrevPage = () => setCurrentPage(currentPage - 1)

  return (
    <>
      <h2 className="pt-10 pl-10 text-lg font-bold uppercase font-unbounded">{title}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
        {regions.length > 0 ? (
          regions.map((region, index) => (
            <CoreItem
              key={index}
              config={configuration}
              coreNumber={region.regionId.core}
              size={region.regionId.mask === '0xffffffffffffffffffff' ? 'Whole' : 'Interlaced'}
              cost={parseNativeTokenToHuman({ paid: region.price?.toString(), decimals: 12 })}
              currencyCost={tokenSymbol}
              mask={region.regionId.mask}
              begin={region.regionId.begin}
              duration={region.duration}
            />
          ))
        ) : (
          <div className="text-gray-12">No cores found</div>
        )}
      </div>
    </>
  )
}
