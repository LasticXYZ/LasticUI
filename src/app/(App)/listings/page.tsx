'use client'

import CoreItemPurchase from '@/components/cores/CoreItemPurchase'
import MultisigTradeModal from '@/components/multisig/MultisigTradeModal'
import { CoreListing } from '@/hooks/useListings'
import { useEffect, useState } from 'react'
import SubTitle from '../samesections/SubTitle'

interface Database {
  listings: CoreListing[]
}

type MultisigModal = {
  visible: boolean
  core: CoreListing | null
}

const ListingsPage = () => {
  const [cores, setCores] = useState<CoreListing[]>([])
  const [multisigModalData, setMultisigModalData] = useState<MultisigModal>({
    visible: false,
    core: null,
  })

  useEffect(() => {
    async function fetchCores() {
      const response = await fetch('/database.json')
      const data: Database = await response.json()
      setCores(data.listings)
    }

    fetchCores().catch(console.error)
  }, [])

  const openMultisig = () => {
    setMultisigModalData((old) => ({ ...old, visible: true }))
  }

  const closeMultisig = () => {
    setMultisigModalData((old) => ({ ...old, visible: false }))
  }

  return (
    <>
      <SubTitle subtitle="Cores for Sale" />

      {multisigModalData.core && (
        <MultisigTradeModal
          isOpen={multisigModalData.visible}
          onClose={closeMultisig}
          core={multisigModalData.core}
          onStatusChange={() => {}}
        />
      )}

      <section className="mx-auto max-w-9xl px-5">
        <div className=" grid grid-cols-2 gap-6">
          {cores.map((core) => (
            <div key={core.id} className="">
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
