'use client'
import Border from '@/components/border/Border'
import PurchaseCreditsModal from '@/components/broker/extrinsics/PurchaseCreditsModal'
import SecondaryButton from '@/components/button/SecondaryButton'
import WalletStatus from '@/components/walletStatus/WalletStatus'

import React from 'react'

const BuyCores: React.FC = () => {
  const [creditsModalOpen, setCreditsModalOpen] = React.useState<boolean>(false)

  return (
    <Border className="h-full flex justify-center items-center">
      <div className="flex flex-col columns-1 items-center">
        <WalletStatus />
        <SecondaryButton
          title="Purchase Credits"
          onClick={() => setCreditsModalOpen(true)}
          className="px-10 mb-8"
        />
      </div>

      <PurchaseCreditsModal isOpen={creditsModalOpen} onClose={() => setCreditsModalOpen(false)} />
    </Border>
  )
}

export default BuyCores
