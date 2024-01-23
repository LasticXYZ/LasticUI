import Border from '@/components/border/Border'
import SecondaryButton from '@/components/button/SecondaryButton'
import CuteInfo from '@/components/info/CuteInfo'
import { ConnectButton } from '@/components/web3/ConnectButton'
import { useInkathon } from '@poppyseed/lastic-sdk'
import React from 'react'

const WalletStatus: React.FC = () => {
  const { activeAccount } = useInkathon()

  if (!activeAccount) {
    return (
      <div className="flex justify-center items-center py-20 px-4">
        <div className="flex flex-col items-center justify-center px-2 py-8">
          <CuteInfo
            emoji="👀"
            message="Connect wallet in order to buy instantaneous coretime."
            color="bg-teal-4"
          />
          <ConnectButton />
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center py-20 px-4">
      <div className="flex flex-col items-center justify-center px-2 py-8 ">
        <CuteInfo
          emoji="😔"
          message="You currently have 0 active cores."
          color="bg-lastic-spectrum-via"
        />
        <SecondaryButton title="Go to marketplace" location="/bulkcore1" />
      </div>
    </div>
  )
}

export default WalletStatus
