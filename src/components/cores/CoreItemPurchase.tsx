'use client'
// components/Card.tsx
import Border from '@/components/border/Border'
import PrimaryButton from '@/components/button/PrimaryButton'
import { CoreListing } from '@/hooks/useListings'
import { ListingState } from '@/hooks/useListingsTracker'
import { parseNativeTokenToHuman } from '@/utils'
import { goToChainRoute } from '@/utils/common/chainPath'
import { useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

interface CardProps {
  listing: CoreListing
  currency: string
  buttonAction?: () => void
  state?: ListingState
}

const Card: React.FC<CardProps> = ({ listing, currency, buttonAction, state }) => {
  const { activeAccount } = useInkathon()
  const { tokenDecimals } = useBalance(activeAccount?.address)
  const pathname = usePathname()
  const beginStr = listing.begin.replace(/,/g, '')
  const endStr = listing.end ? listing.end.replace(/,/g, '') : ''
  const coreSize = endStr ? parseInt(endStr) - parseInt(listing.begin.replace(/,/g, '')) : 0
  const bulkSize = 1260 // TODO replace this by config value

  const price = parseNativeTokenToHuman({
    paid: listing.cost,
    decimals: tokenDecimals,
    reduceDecimals: 3,
  })

  // get state label
  const stateLabel = () => {
    if (state?.step4) {
      return 'Completed'
    }
    if (state?.step3) {
      return 'Step 4 - Verification'
    }
    if (state?.step2) {
      return 'Step 3 - Multisig call inititation'
    }
    if (state?.step1) {
      return 'Step 2 - Buyer found'
    }
    return 'Open to buy'
  }

  return (
    <Border className="px-10 py-6 hover:bg-pink-1">
      <div>
        <div className="uppercase font-unbounded tracking-wide text-md font-semibold flex justify-between items-center">
          <span>Core Nb. {listing.coreNumber}</span>
          <div className="flex space-x-2">
            {' '}
            {/* Container to hold both buttons next to each other */}
            {coreSize < bulkSize && (
              <div className="bg-pink-400 border border-gray-8 px-2 py-1 text-xs font-semibold uppercase rounded-full shadow-lg">
                Partitioned
              </div>
            )}
            {listing.mask !== '0xffffffffffffffffffff' && (
              <div className="bg-pink-400 border border-gray-8 px-2 py-1 text-xs font-semibold uppercase rounded-full shadow-lg">
                Interlaced
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto pt-4 flex flex-row items-center justify-between overflow-hidden">
        <Link
          href={goToChainRoute(pathname, `/core/${listing.coreNumber}/${beginStr}/${listing.mask}`)}
        >
          <div className="px-5">
            <Image src="/assets/Images/core1.png" alt="Lastic Logo" width={130} height={100} />
          </div>
        </Link>
        <div className="flex w-full text-lg flex-col px-5items-start justify-center">
          <Link
            href={goToChainRoute(
              pathname,
              `/core/${listing.coreNumber}/${beginStr}/${listing.mask}`,
            )}
          >
            <div className="flex flex-col text-gray-12">
              <p className="text-gray-12 px-2">Mask: {listing.mask}</p>
              <p className="px-2">Begin: {listing.begin}</p>
              <p className="px-2">End: {listing.end}</p>
            </div>
          </Link>

          <span className="inline-block bg-gray-600 text-white text-sm px-3 p-1 rounded-full mt-3">
            {stateLabel()}
          </span>

          <div className="pt-5 pl-10">
            <p className="font-bold text-2xl">
              {price} {currency}
            </p>
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
