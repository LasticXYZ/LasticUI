'use client'

import Subtitle from '@/app/[network]/(App)/samesections/SubTitle'
import CoreItemPurchase from '@/components/cores/CoreItemPurchase'
import MultisigTradeModal from '@/components/multisig/MultisigTradeModal'
import { CoreListing, useListings } from '@/hooks/useListings'
import { useListingsTracker } from '@/hooks/useListingsTracker'
import { FormControlLabel, Radio } from '@mui/material'
import { useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import { useState } from 'react'

const LASTIC_ADDRESS = process.env.NEXT_PUBLIC_LASTIC_ADDRESS || ''

const filterStyle = {
  color: '#FF6370',
  '&.Mui-checked': {
    color: '#FF6370',
  },
}

interface Database {
  listings: CoreListing[]
}

type MultisigModal = {
  visible: boolean
  core: CoreListing | null
}

const ListingsPage = () => {
  const { activeAccount } = useInkathon()
  let { tokenSymbol } = useBalance(activeAccount?.address, true)
  const { listings, fetchListings } = useListings()
  const [filter, setFilter] = useState<string>('openListings')

  const {
    isLoading: isLoadingStateUpdate,
    listingsState,
    updateAllStates,
  } = useListingsTracker(listings, 8000)

  const [multisigModalData, setMultisigModalData] = useState<MultisigModal>({
    visible: false,
    core: null,
  })

  const closeMultisig = () => {
    setMultisigModalData((old) => ({ ...old, visible: false }))
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter((event.target as HTMLInputElement).value)
  }

  const filteredCores = listings.filter((core) => {
    if (filter === 'openListings') {
      return core.buyerAddress === '' || !core.buyerAddress
    } else if (filter === 'yourBuys') {
      return core.buyerAddress === activeAccount?.address
    } else if (filter === 'yourSales') {
      return core.sellerAddress === activeAccount?.address
    } else if (filter === 'ongoingTrades') {
      return core.status === 'tradeOngoing'
    }
    return false
  })

  return (
    <>
      <div className="flex flex-col flex-wrap gap-3 items-center">
        <Subtitle subtitle="Listed Cores" />

        <div className="flex flex-row flex-wrap mb-8">
          <FormControlLabel
            value="openListings"
            control={
              <Radio checked={filter === 'openListings'} onChange={handleChange} sx={filterStyle} />
            }
            label="Open Listings"
          />
          <FormControlLabel
            value="yourBuys"
            control={
              <Radio checked={filter === 'yourBuys'} onChange={handleChange} sx={filterStyle} />
            }
            label="Your Buys"
          />
          <FormControlLabel
            value="yourSales"
            control={
              <Radio checked={filter === 'yourSales'} onChange={handleChange} sx={filterStyle} />
            }
            label="Your Sales"
          />
          {activeAccount?.address === LASTIC_ADDRESS && (
            <FormControlLabel
              value="ongoingTrades"
              control={
                <Radio
                  checked={filter === 'ongoingTrades'}
                  onChange={handleChange}
                  sx={filterStyle}
                />
              }
              label="Ongoing Trades (Lastic only)"
            />
          )}
        </div>
      </div>

      {multisigModalData.core && (
        <MultisigTradeModal
          isOpen={multisigModalData.visible}
          onClose={closeMultisig}
          core={multisigModalData.core}
          onUpdateListingDB={fetchListings}
          listingsState={listingsState}
          onUpdateListingState={updateAllStates}
          isLoadingStateUpdate={isLoadingStateUpdate}
        />
      )}

      <section className="mx-auto max-w-9xl px-5">
        <div className=" grid grid-cols-2 gap-6">
          {filteredCores.length === 0 && <p>No cores found</p>}
          {filteredCores.map((core) => (
            <div key={core.id} className="">
              <CoreItemPurchase
                listing={core}
                state={listingsState[core.id]}
                currency={tokenSymbol}
                buttonAction={() => {
                  setMultisigModalData({ visible: true, core })
                }}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default ListingsPage