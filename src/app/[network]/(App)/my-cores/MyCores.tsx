import Border from '@/components/border/Border'
import SectionDisplay from '@/components/cores/CoreItemSectionDisplay'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import { network_list } from '@/config/network'
import { getChainFromPath } from '@/utils/common/chainPath'
import { encodeAddress } from '@polkadot/util-crypto'
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

export default function MyCores() {
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
  const constants = network_list[network].constants

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
        query = client.eventWhoCoreOwner(
          encodeAddress(activeAccount.address, activeChain?.ss58Prefix || 42),
          currentSaleRegion.regionBegin - configuration.regionLength,
          currentSaleRegion.regionBegin + configuration.regionLength,
        )
        query2 = client.eventOwnedAndAssignedCoreOwner(
          encodeAddress(activeAccount.address, activeChain?.ss58Prefix || 42),
        )
        query3 = client.eventOwnedAndPooledCoreOwner(
          encodeAddress(activeAccount.address, activeChain?.ss58Prefix || 42),
        )
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
  }, [activeAccount, activeChain, network, currentSaleData, client, configuration])

  if (!activeAccount || !activeChain) {
    return (
      <Border className="h-full flex flex-row justify-center items-center">
        <WalletStatus inactiveWalletMessage="Connect wallet in order to see your Coretime." />
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
  const currentlyActive =
    result?.data?.event?.filter((region) =>
      region.regionId.begin && currentSaleRegion?.regionBegin
        ? region.regionId.begin < currentSaleRegion.regionBegin
        : null,
    ) || []

  return result?.data?.event && result?.data?.event.length > 0 ? (
    <Border className="h-full flex flex-row justify-center items-center">
      <div className="h-full w-full flex flex-col justify-left items-left px-5 pb-10">
        <div className="pt-10 pl-4">
          <h1 className="text-xl font-bold uppercase font-unbounded ">Cores Owned</h1>
        </div>
        <SectionDisplay
          title="Obtained in this Sale"
          information="Cores you have bought in the current sale and are active during the next sale cycle."
          constants={constants}
          regions={justBought}
          configuration={configuration}
          tokenSymbol={tokenSymbol}
        />
        <SectionDisplay
          title="Obtained in the previous Sale"
          information="Cores you have bought in the previous sale cycle and are going to be active in this sale cycle."
          constants={constants}
          regions={currentlyActive}
          configuration={configuration}
          tokenSymbol={tokenSymbol}
        />
        <SectionDisplay
          title="Assigned Cores"
          information="All cores you have bought and are currently assigned to a task."
          constants={constants}
          regions={assignedCores?.data?.event || []}
          configuration={configuration}
          tokenSymbol={tokenSymbol}
        />
        <SectionDisplay
          title="Cores in the on Demand Pool"
          information="All cores that are currently in the on demand pool."
          constants={constants}
          regions={pooledCores?.data?.event || []}
          configuration={configuration}
          tokenSymbol={tokenSymbol}
        />
      </div>
    </Border>
  ) : (
    <Border className="h-full flex flex-row justify-center items-center">
      <WalletStatus />
    </Border>
  )
}
