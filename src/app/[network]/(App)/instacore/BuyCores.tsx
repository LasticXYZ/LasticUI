'use client'
import Border from '@/components/border/Border'
import SecondaryButton from '@/components/button/SecondaryButton'
import PurchaseCreditsModal from '@/components/extrinsics/broker/PurchaseCreditsModal'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import { useInkathon } from '@poppyseed/lastic-sdk'

import React from 'react'

const BuyCores: React.FC = () => {
  const { activeAccount, activeChain } = useInkathon()
  const [creditsModalOpen, setCreditsModalOpen] = React.useState<boolean>(false)

  if (!activeAccount || !activeChain) {
    return (
      <Border className="h-full flex flex-row justify-center items-center">
        <WalletStatus />
      </Border>
    )
  }

  return (
    <>
      <Border className="h-full flex justify-center items-center py-20 px-5">
        <SecondaryButton
          title="Purchase Credits"
          onClick={() => setCreditsModalOpen(true)}
          className=""
        />
      </Border>

      <PurchaseCreditsModal isOpen={creditsModalOpen} onClose={() => setCreditsModalOpen(false)} />
    </>
  )
}

export default BuyCores
