// components/Card.tsx
import TagComp from '@/components/tags/TagComp'
import { parseNativeTokenToHuman, toShortAddress } from '@/utils/account/token'
import { BrokerConstantsType, ConfigurationType } from '@poppyseed/lastic-sdk'
import { CoreOwnerEvent } from '@poppyseed/squid-sdk'
import Image from 'next/image'
import React from 'react'

interface CardProps {
  config: ConfigurationType | null
  constants: BrokerConstantsType
  timeBought: string
  owner: string
  amITheOwner: boolean
  paid: string | null
  coreNumber: number
  currencyCost: string
  mask: string
  begin: number
  end: number
  region: CoreOwnerEvent
}

const CoreItemExtensive: React.FC<CardProps> = ({
  config,
  constants,
  region,
  timeBought,
  owner,
  amITheOwner,
  coreNumber,
  currencyCost,
}) => {
  const mask = region.regionId.mask
  const begin = region.regionId.begin
  const end =
    region.regionId.begin && region.duration ? region.regionId.begin + region.duration : null
  const paid = region.price
  const duration = region.duration

  if (!config || !begin) return null

  return (
    <>
      <div className="mx-auto py-5 flex flex-row items-start px-10 justify-between overflow-hidden">
        <div className="flex-2 max-w-30% pt-5 items-center justify-center">
          <Image src="/assets/Images/core2.png" alt="Lastic Logo" width={200} height={200} />
        </div>
        <div className="flex-1 flex flex-col py-4 px-10">
          <div className="pb-4 flex flex-row justify-between space-x-5">
            <h1 className="text-xl font-unbounded uppercase font-bold">Core Nb. {coreNumber}</h1>
            <div className="flex flex-row space-x-5">
              <div className="flex gap-2">
                {mask !== '0xffffffffffffffffffff' && <TagComp title="Interlaced" />}
                {duration && duration < config.regionLength && <TagComp title="Partitioned" />}
                {duration && duration === config.regionLength && <TagComp title="Full" />}
              </div>
              <div className="flex gap-2">
                {region.assigned ? (
                  <TagComp title="Assigned" />
                ) : (
                  <TagComp title="Unassigned" color="bg-pink-300 dark:bg-pink-500" />
                )}
              </div>
              <div className="flex gap-2">
                {region.pooled ? (
                  <TagComp title="Pooled" />
                ) : (
                  <TagComp title="Not In a Pool" color="bg-pink-200 dark:bg-pink-600" />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-row pt-2 justify-between space-x-3">
            <div className="text-md leading-tight font-medium text-black dark:text-gray-1">
              Owner: {toShortAddress(owner)} {amITheOwner ? '(You)' : '(Not you)'}
            </div>
            <div className="text-md leading-tight font-medium text-black dark:text-gray-1">
              Last event time:{' '}
              {region.timestamp ? new Date(region.timestamp).toLocaleString() : timeBought}
            </div>
          </div>
          <div className="flex flex-row py-4 justify-between space-x-3">
            <div className="text-md leading-tight font-medium text-black dark:text-gray-1">
              Paid: {parseNativeTokenToHuman({ paid: paid, decimals: 12, reduceDecimals: 6 })}{' '}
              {currencyCost}
            </div>
            <div className="text-md leading-tight font-medium text-black dark:text-gray-1">
              Utilization: Not Started
            </div>
          </div>
          <div className=" grid grid-cols-2 gap-5 lg:grid-cols-4 justify-between mt-5">
            <div className="flex flex-col pr-5 text-md text-black dark:text-gray-1">
              <p>
                <b>Begins</b>
              </p>
              <p>Region: {begin}</p>
              <p>Relay Block: {begin * constants.timeslicePeriod}</p>
              <p>Time: </p>
            </div>
            <div className="flex flex-col px-5 text-md text-black dark:text-gray-1">
              <p>
                <b>Ends</b>
              </p>
              <p>Region: {end}</p>
              <p>Relay Block: {end ? end * constants.timeslicePeriod : null}</p>
              <p>Time: </p>
            </div>
            <div className="flex flex-col px-5 text-md text-black dark:text-gray-1">
              <p>
                <b>Mask</b>
              </p>
              <p>HEX: {mask}</p>
              <p>
                Status: {mask === '0xffffffffffffffffffff' ? 'Full Region' : 'Interlaced Region'}
              </p>
            </div>
            <div className="flex flex-col  px-5 text-md text-black dark:text-gray-1">
              <p>
                <b>Duration</b>
              </p>
              <p>Regions: {duration}</p>
              <p>Blocks: {duration ? duration * constants.timeslicePeriod : null}</p>
              <p>Time: </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CoreItemExtensive
