// components/Card.tsx
import Border from '@/components/border/Border'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface CardProps {
  timeBought: string
  coreNumber: string
  size: string
  phase: string
  cost: number
  reward: string
  currencyCost: string
  currencyReward: string
  mask: string
  begin: string
  end: string
}

const Card: React.FC<CardProps> = ({
  timeBought,
  coreNumber,
  size,
  phase,
  cost,
  reward,
  currencyCost,
  currencyReward,
  mask,
  begin,
  end,
}) => {
  const beginStr = begin.replace(/,/g, '')
  return (
    <Border className="px-10 py-6 hover:bg-pink-1 hover:cursor-pointer">
      <Link href={`/core/${coreNumber}/${beginStr}`}>
        <div>
          <div className="uppercase font-syncopate tracking-wide text-md text-indigo-500 font-semibold">
            Core Nb. {coreNumber}
          </div>
        </div>
        <div className="mx-auto pt-4 flex flex-row items-center justify-between overflow-hidden">
          <div>
            <Image src="/assets/Images/core1.png" alt="Lastic Logo" width={130} height={50} />
          </div>
          <div className="flex w-full flex-row px-5 items-center justify-between">
            <div>
              <div className="block mt-1 text-md leading-tight font-medium text-black">
                Time bought: {timeBought}
              </div>
            </div>
            <div>
              <p className="text-gray-12">Size: {size} cores</p>
              <p className="text-gray-12">Phase: {phase}</p>
            </div>
            <div>
              <p className="text-gray-12">
                Cost: {cost} {currencyCost}
              </p>
              <p className="text-gray-12">
                Reward: {reward} {currencyReward}
              </p>
            </div>
            <div className="">
              <div className="text-sm text-gray-10">
                <p>Mask: {mask}</p>
                <p>Begin: {begin}</p>
                <p>End: {end}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Border>
  )
}

export default Card
