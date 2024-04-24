// components/Card.tsx
import { parseNativeTokenToHuman, toShortAddress } from '@/utils/account/token'
import { CoreOwnerEvent } from '@poppyseed/squid-sdk'
import Image from 'next/image'
import React from 'react'

interface CardProps {
  timeBought: string
  owner: string
  amITheOwner: boolean
  paid: string | null
  coreNumber: number
  phase: string
  cost: string
  currencyCost: string
  mask: string
  begin: number
  end: number
  region: CoreOwnerEvent
}

const CoreItemExtensive: React.FC<CardProps> = ({
  timeBought,
  owner,
  amITheOwner,
  paid,
  coreNumber,
  phase,
  cost,
  currencyCost,
  mask,
  begin,
  end,
  region,
}) => {
  return (
    <>
      <div className="pt-10 pl-10">
        <h1 className="text-xl font-unbounded uppercase font-bold">Core Nb. {coreNumber} </h1>
      </div>
      <div className="mx-auto pt-4 flex flex-row items-start p-10 justify-between overflow-hidden">
        <div className="px-10">
          <Image src="/assets/Images/core2.png" alt="Lastic Logo" width={400} height={400} />
        </div>
        <div className="flex w-full flex-col pl-10 items-start justify-start space-y-3">
          <div>
            <div className="block mt-1 text-md leading-tight font-medium text-black dark:text-gray-1">
              Owner: {toShortAddress(owner)} {amITheOwner ? '(You)' : '(Not you)'}
            </div>
          </div>
          <div>
            <div className="block mt-1 text-md leading-tight font-medium text-black dark:text-gray-1">
              Paid: {parseNativeTokenToHuman({ paid: paid, decimals: 12, reduceDecimals: 6 })}{' '}
              {currencyCost}
            </div>
          </div>
          <div>
            <div className="block mt-1 text-md leading-tight font-medium text-black dark:text-gray-1">
              Last event time:{' '}
              {region.timestamp ? new Date(region.timestamp).toLocaleString() : timeBought}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col px-5 items-start justify-start space-y-3">
          <div className="text-md  text-black dark:text-gray-1 ">
            <p>Mask: {mask}</p>
          </div>
          <div className="text-md  text-black dark:text-gray-1 ">
            <p>Begin: {begin}</p>
          </div>
          <div className="text-md  text-black dark:text-gray-1 ">
            <p>End: {end}</p>
          </div>
        </div>
        <div className="flex w-full flex-col px-5 items-start justify-start space-y-3">
          <div className="text-md  text-black dark:text-gray-1 ">
            <p>Put into a pool: {region.pooled ? 'True' : 'False'}</p>
          </div>
          <div className="text-md  text-black dark:text-gray-1 ">
            <p>Assigned: {region.assigned ? 'True' : 'False'}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default CoreItemExtensive
