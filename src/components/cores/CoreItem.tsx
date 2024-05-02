// components/Card.tsx
import Border from '@/components/border/Border'
import { goToChainRoute } from '@/utils/common/chainPath'
import { BrokerConstantsType, ConfigurationType } from '@poppyseed/lastic-sdk'
import Image from 'next/image'
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

const CoreItem: React.FC<CardProps> = ({
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
    <Border className="px-10 py-6 hover:bg-pink-50 hover:dark:bg-gray-22 hover:cursor-pointer">
      <Link href={goToChainRoute(pathname, `/core/${coreNumber}/${begin}/${mask}`)}>
        <div>
          <div className="font-unbounded uppercase tracking-wide text-md font-semibold flex justify-between items-center">
            <span>Core Nb. {coreNumber}</span>
            <div className="flex space-x-2">
              {' '}
              {/* Container to hold both buttons next to each other */}
              {duration < config.regionLength && (
                <div className="bg-pink-200  dark:bg-pink-400 dark:bg-opacity-80 border border-gray-8 px-4 py-1 text-xs font-semibold uppercase rounded-full shadow-lg">
                  Partitioned
                </div>
              )}
              {mask !== '0xffffffffffffffffffff' && (
                <div className="bg-pink-200 dark:bg-pink-400  dark:bg-opacity-80 border border-gray-8 px-4 py-1 text-xs font-semibold uppercase rounded-full shadow-lg">
                  Interlaced
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mx-auto pt-4 flex flex-row items-center justify-between overflow-hidden">
          <div className="px-5">
            <Image src="/assets/Images/core1.png" alt="Lastic Logo" width={130} height={100} />
          </div>
          <div className="flex w-full text-lg flex-col px-5items-start justify-center">
            <div className="flex flex-row p-1">
              <p className="text-gray-12 px-2">Size: {size} core</p>
            </div>
            <div className="flex flex-row p-1">
              <p className="text-gray-12 px-2">
                {' '}
                Cost: {cost} {currencyCost}
              </p>
            </div>
            <div className="flex flex-row text-gray-12 p-1 ">
              <p className="px-2">Begin Relay Block: {begin * constants.timeslicePeriod}</p>
            </div>
            <div className="flex flex-row text-gray-12 p-1 ">
              <p className="px-2">
                End Relay Block: {(begin + duration) * constants.timeslicePeriod}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </Border>
  )
}

export default CoreItem
