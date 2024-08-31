import BlockspaceItem from '@/components/cores/BlockspaceItem'
import { Region } from '@/types'
import { parseNativeTokenToHuman } from '@/utils'
import { BrokerConstantsType, parseHNString } from '@poppyseed/lastic-sdk'
import { CoreOwnerEvent } from '@poppyseed/squid-sdk'
import { useState } from 'react'

interface SectionProps {
  title: string
  information: string
  constants: BrokerConstantsType | null
  regions: (CoreOwnerEvent | Region)[] | null
  configuration: any // Define more specific types based on what 'configuration' contains
  tokenSymbol: string
}

function isCoreOwnerEvent(item: CoreOwnerEvent | Region): item is CoreOwnerEvent {
  return (item as CoreOwnerEvent).regionId !== undefined
}

export default function BlockspaceBarons({
  title,
  information,
  regions,
  configuration,
  constants,
  tokenSymbol,
}: SectionProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const handleNextPage = () => setCurrentPage(currentPage + 1)
  const handlePrevPage = () => setCurrentPage(currentPage - 1)

  return (
    <>
      {regions && regions.length > 0 ? (
        <>
          <h2 className="pt-5 pl-10 text-lg font-bold uppercase font-unbounded">{title}</h2>
          <div className="pl-10 pt-4 italic">
            <p>{information}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
            {regions.map((region, index) =>
              isCoreOwnerEvent(region) ? (
                <BlockspaceItem
                  key={index}
                  config={configuration}
                  coreNumber={region.regionId.core}
                  size={region.regionId.mask === '0xffffffffffffffffffff' ? 'Whole' : 'Interlaced'}
                  cost={parseNativeTokenToHuman({ paid: region.price?.toString(), decimals: 12 })}
                  currencyCost={tokenSymbol}
                  mask={region.regionId.mask}
                  begin={region.regionId.begin}
                  duration={region.duration}
                  constants={constants}
                />
              ) : (
                <BlockspaceItem
                  key={index}
                  config={configuration}
                  coreNumber={Number(region.detail[0].core)}
                  size={region.detail[0].mask === '0xffffffffffffffffffff' ? 'Whole' : 'Interlaced'}
                  cost={parseNativeTokenToHuman({ paid: region.owner.paid, decimals: 12 })}
                  currencyCost={tokenSymbol}
                  mask={region.detail[0].mask}
                  begin={parseHNString(region.detail[0].begin)}
                  duration={parseHNString(region.detail[0].begin) - parseHNString(region.owner.end)}
                  constants={constants}
                />
              ),
            )}
          </div>
        </>
      ) : null}
    </>
  )
}
