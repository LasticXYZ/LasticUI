import Border from '@/components/border/Border'
import CoreItem from '@/components/cores/CoreItem'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import { network_list } from '@/config/network'
import { useCurrentSaleRegion, usePastCoresSold } from '@/hooks/subsquid'
import { parseNativeTokenToHuman } from '@/utils/account/token'
import { getChainFromPath } from '@/utils/common/chainPath'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { CoreOwnerEvent, getClient } from '@poppyseed/squid-sdk'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'

export default function PastCoresSold() {
  const { activeChain } = useInkathon()

  const client = useMemo(() => getClient(), [])
  const pathname = usePathname()
  const network = getChainFromPath(pathname)
  const tokenSymbol = network_list[network].tokenSymbol
  const configuration = network_list[network].configuration

  const currentSaleRegion = useCurrentSaleRegion(network, client)
  const coresData = usePastCoresSold(network, client, currentSaleRegion, configuration)

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

  return (
    <Border className="h-full flex flex-row justify-center items-center">
      <div className="h-full w-full flex flex-col justify-left items-left px-5 pb-10">
        <div className="pt-10 pl-4">
          <h1 className="text-xl font-bold uppercase font-unbounded ">
            <span className="text-2xl pr-2">🕵️ </span>Community Spy section
          </h1>
        </div>
        <SectionDisplay
          title="Bought in this Sale"
          regions={coresData}
          configuration={configuration}
          tokenSymbol={tokenSymbol}
        />
      </div>
    </Border>
  )
}

interface SectionProps {
  title: string
  regions: CoreOwnerEvent[] | null
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
        {regions && regions.length > 0 ? (
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
