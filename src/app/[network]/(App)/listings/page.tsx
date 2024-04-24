'use client'

import Subtitle from '@/app/[network]/(App)/samesections/SubTitle'
import CoreItemPurchase from '@/components/cores/CoreItemPurchase'
import MultisigTradeModal from '@/components/multisig/MultisigTradeModal'
import { CoreListing } from '@/hooks/useListings'
import { useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import { useEffect, useState } from 'react'

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
      <Subtitle subtitle="Cores for Sale" />

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
                listing={core}
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
