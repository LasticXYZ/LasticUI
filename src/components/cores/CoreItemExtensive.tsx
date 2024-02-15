// components/Card.tsx
import { parseNativeTokenToHuman, toShortAddress } from '@/utils/account/token'
import Image from 'next/image'
import React from 'react'

interface CardProps {
  timeBought: string
  owner: string
  amITheOwner: boolean
  paid: string
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
  owner,
  amITheOwner,
  paid,
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
      <div className="mx-auto pt-4 flex flex-row items-start p-10 justify-between overflow-hidden">
        <div className="px-10">
          <Image src="/assets/Images/core2.png" alt="Lastic Logo" width={400} height={400} />
        </div>
        <div className="flex w-full flex-col px-5 items-start justify-start space-y-3">
          <div>
            <div className="block mt-1 text-md leading-tight font-medium text-black">
              Owner: {toShortAddress(owner)} {amITheOwner ? '(You)' : '(Not you)'}
            </div>
          </div>
          <div>
            <div className="block mt-1 text-md leading-tight font-medium text-black">
              Paid: {parseNativeTokenToHuman({ paid: paid, decimals: 12 })} {currencyCost}
            </div>
          </div>
          <div>
            <div className="block mt-1 text-md leading-tight font-medium text-black">
              Time bought: {timeBought}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col px-5 items-start justify-start space-y-3">
          <div>
            <p className="text-gray-12">Size: {size} core</p>
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
