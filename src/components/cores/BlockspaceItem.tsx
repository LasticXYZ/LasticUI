// components/Card.tsx
import Border from '@/components/border/Border'
import { goToChainRoute } from '@/utils/common/chainPath'
import { BrokerConstantsType, ConfigurationType } from '@poppyseed/lastic-sdk'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

interface CardProps {
  config: ConfigurationType | null
  coreNumber: number | null
  size: string
  cost: string
  currencyCost: string
  mask: string | null
  begin: number | null
  duration: number | null
  constants: BrokerConstantsType | null
}

const BlockspaceItem: React.FC<CardProps> = ({
  config,
  coreNumber,
  size,
  cost,
  currencyCost,
  mask,
  begin,
  duration,
  constants,
}) => {
  const pathname = usePathname()

  if (!config || !duration || !begin || !constants) return null

  return (
    <Border className="px-3 py-6 hover:bg-pink-50 hover:dark:bg-gray-22 hover:cursor-pointer">
      <Link href={goToChainRoute(pathname, `/core/${coreNumber}/${begin}/${mask}`)}>
        <div className="mx-auto pt-4 flex flex-col items-center justify-between overflow-hidden">
          <div className="text-6xl">🐸</div>
          <div className="flex w-full mt-2 text-sm flex-col px-5items-start justify-center">
            <div className="flex flex-row ">
              <p className="text-gray-12 px-2">Core Nb. {coreNumber}</p>
            </div>
            <div className="flex flex-row">
              <p className="text-gray-12 px-2">
                {' '}
                Cost: {cost} {currencyCost}
              </p>
            </div>
            <div className="flex flex-col text-gray-12 ">
              <p className="px-2">Relay Blocks: </p>
              <p className="px-2">
                {begin * constants.timeslicePeriod} -{' '}
                {(begin + duration) * constants.timeslicePeriod}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </Border>
  )
}

export default BlockspaceItem
