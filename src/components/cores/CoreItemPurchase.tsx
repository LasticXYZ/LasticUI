// components/Card.tsx
import Border from '@/components/border/Border'
import PrimaryButton from '@/components/button/PrimaryButton'
import Image from 'next/image'
import React from 'react'

interface CardProps {
  coreNumber: string
  size: string
  cost: string
  reward: string
  currencyCost: string
  currencyReward: string
  mask: string
  begin: string
  end: string
  buttonAction?: () => void
}

const Card: React.FC<CardProps> = ({
  coreNumber,
  size,
  cost,
  reward,
  currencyCost,
  currencyReward,
  mask,
  begin,
  end,
  buttonAction,
}) => {
  const beginStr = begin.replace(/,/g, '')
  const coreSize = parseInt(end.replace(/,/g, '')) - parseInt(begin.replace(/,/g, ''))
  const bulkSize = 1260 // TODO replace this by config value

  return (
    <Border className="px-10 py-6 hover:bg-pink-1">
      <div>
        <div className="uppercase font-unbounded tracking-wide text-md font-semibold flex justify-between items-center">
          <span>Core Nb. {coreNumber}</span>
          <div className="flex space-x-2">
            {' '}
            {/* Container to hold both buttons next to each other */}
            {coreSize < bulkSize && (
              <div className="bg-pink-400 border border-gray-8 px-2 py-1 text-xs font-semibold uppercase rounded-full shadow-lg">
                Partitioned
              </div>
            )}
            {mask !== '0xffffffffffffffffffff' && (
              <div className="bg-pink-400 border border-gray-8 px-2 py-1 text-xs font-semibold uppercase rounded-full shadow-lg">
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
            <p className="text-gray-12 px-2">
              {' '}
              Cost: {cost} {currencyCost}
            </p>
          </div>

          <div>
            <p className="text-gray-12 px-2">Mask: {mask}</p>
          </div>
          <div className="flex flex-row text-gray-12 p-1 ">
            <p className="px-2">Begin: {begin}</p>
            <p className="px-2">End: {end}</p>
          </div>
          <div className="flex flex-col p-5 items-start justify-center">
            <PrimaryButton title="Purchase" onClick={buttonAction} />
          </div>
        </div>
      </div>
    </Border>
  )
}

export default Card
