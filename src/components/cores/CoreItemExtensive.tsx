// components/Card.tsx
import Image from 'next/image'
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

const CoreItemExtensive: React.FC<CardProps> = ({
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
  return (
    <>
      <div className="pt-10 pl-10">
        <h1 className="text-xl font-syncopate font-bold">Core Nb. {coreNumber} </h1>
      </div>
      <div className="mx-auto pt-4 flex flex-row items-cente p-10 justify-between overflow-hidden">
        <div>
          <Image src="/assets/Images/core2.png" alt="Lastic Logo" width={400} height={400} />
        </div>
        <div className="flex w-full flex-col px-5 items-start justify-between">
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
      </>

  )
}

export default CoreItemExtensive
