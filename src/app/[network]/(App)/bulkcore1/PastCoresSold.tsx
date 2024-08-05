import Border from '@/components/border/Border'
import SectionDisplay from '@/components/cores/CoreItemSectionDisplay'
import { network_list } from '@/config/network'
import { useCurrentSaleRegion, usePastCoresSold } from '@/hooks/subsquid'
import { getChainFromPath } from '@/utils/common/chainPath'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { getClient } from '@poppyseed/squid-sdk'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export default function PastCoresSold() {
  const { activeChain } = useInkathon()

  const client = useMemo(() => getClient(), [])
  const pathname = usePathname()
  const network = getChainFromPath(pathname)
  const tokenSymbol = network_list[network].tokenSymbol
  const configuration = network_list[network].configuration

  const currentSaleRegion = useCurrentSaleRegion(network, client)
  const coresData = usePastCoresSold(network, client, currentSaleRegion, configuration)
  const constants = network_list[network].constants

  if (!activeChain || !coresData || coresData.length === 0) {
    return null
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
          information="All cores the community has purchased in this sale cycle."
          constants={constants}
          regions={coresData}
          configuration={configuration}
          tokenSymbol={tokenSymbol}
        />
      </div>
    </Border>
  )
}
