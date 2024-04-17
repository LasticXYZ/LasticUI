'use client'

import CoreItemPurchase from '@/components/cores/CoreItemPurchase'
import { CoreListing } from '@/hooks/useListings'
import { useEffect, useState } from 'react'
import CreateMultisigModal from '../../../components/multisig/CreateMultisigModal'
import SubTitle from '../samesections/SubTitle'

interface Database {
  listings: CoreListing[]
}

const ParaIdPage = () => {
  const [cores, setCores] = useState<CoreListing[]>([])
  const [isMultisigVisible, setIsMultisigVisible] = useState(false)

  useEffect(() => {
    async function fetchCores() {
      const response = await fetch('/database.json')
      const data: Database = await response.json()
      setCores(data.listings)
    }

    fetchCores().catch(console.error)
  }, [])

  const openMultisig = () => {
    setIsMultisigVisible(true)
  }

  const closeMultisig = () => {
    setIsMultisigVisible(false)
  }

  return (
    <>
      <SubTitle subtitle="Cores for Sale" />

      <div></div>

      <CreateMultisigModal
        isOpen={isMultisigVisible}
        onClose={closeMultisig}
        onStatusChange={() => {}}
      />

      <section className="mx-auto max-w-9xl px-5">
        <div className=" grid grid-cols-2 gap-6">
          {cores.map((core) => (
            <div key={core.id} className="">
              {/* Assign the openMultisig function to the onClick event */}
              <CoreItemPurchase
                coreNumber={core.coreNumber.toString()}
                size={core.size.toString()}
                cost={core.cost.toString()}
                reward={core.reward.toString()}
                currencyCost={core.currencyCost}
                currencyReward={core.currencyReward}
                mask={core.mask}
                begin={core.begin}
                end={core.end}
                buttonAction={openMultisig}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default ParaIdPage
