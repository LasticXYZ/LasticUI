'use client'

import Subtitle from '@/app/[network]/(App)/samesections/SubTitle'
import CoreItemPurchase from '@/components/cores/CoreItemPurchase'
import MultisigTradeModal from '@/components/multisig/MultisigTradeModal'
import { CoreListing, networks, useListings } from '@/hooks/useListings'
import { useListingsTracker } from '@/hooks/useListingsTracker'
import { FormControlLabel, Radio, Switch } from '@mui/material'
import { useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import { useEffect, useState } from 'react'

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
  const { activeAccount, activeChain } = useInkathon()
  let { tokenSymbol } = useBalance(activeAccount?.address, true)
  const { listings, fetchListings } = useListings()
  const [filter, setFilter] = useState<string>('openListings')
  const [includeCompleted, setIncludeCompleted] = useState<boolean>(false)

  useEffect(() => {
    console.log(listings)
  }, [listings])

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

  const filteredByCompleted = listings.filter((core) => {
    if (!includeCompleted) return core.status !== 'completed'
    else return true
  })

  const filteredCores = filteredByCompleted.filter((core) => {
    if (filter === 'openListings') {
      return (core.buyerAddress === '' || !core.buyerAddress) && core.status === 'listed'
    } else if (filter === 'yourBuys') {
      return core.buyerAddress === activeAccount?.address
    } else if (filter === 'yourSales') {
      return core.sellerAddress === activeAccount?.address
    } else if (filter === 'ongoingTrades') {
      return core.status === 'tradeOngoing'
    } else if (filter === 'completedTrades') {
      return core.status === 'completed'
    }
    return false
  })

  return (
    <>
      <div className="flex flex-col flex-wrap gap-3 items-center">
        <Subtitle subtitle="Listed Cores" />

        <div
          className={`flex flex-row flex-wrap ${filter === 'openListings' || filter === 'ongoingTrades' ? 'pb-20' : ''}`}
        >
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
            <>
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
              <FormControlLabel
                value="completedTrades"
                control={
                  <Radio
                    checked={filter === 'completedTrades'}
                    onChange={handleChange}
                    sx={filterStyle}
                  />
                }
                label="Completed Trades (Lastic only)"
              />
            </>
          )}
        </div>
        <div className="mb-8" hidden={filter === 'openListings' || filter === 'ongoingTrades'}>
          <FormControlLabel
            control={
              <Switch
                checked={includeCompleted}
                onChange={() => setIncludeCompleted(!includeCompleted)}
              />
            }
            label="Include Completed"
          />
        </div>
      </div>

      {multisigModalData.core && (
        <MultisigTradeModal
          isOpen={multisigModalData.visible}
          onClose={closeMultisig}
          core={multisigModalData.core}
          onUpdateListingDB={() => fetchListings(activeChain?.name as networks)}
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
