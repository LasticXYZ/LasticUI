import SecondaryButton from '@/components/button/SecondaryButton'
import CuteInfo from '@/components/info/CuteInfo'
import { ConnectButton } from '@/components/web3/ConnectButton'
import { useInkathon } from '@poppyseed/lastic-sdk'
import React from 'react'

interface WalletStatusProps {
  checkForWallet?: boolean
  inactiveWalletEmoji?: string
  customEmoji?: string
  inactiveWalletMessage?: string
  customColor?: string
  customMessage?: string
  redirectLocationMessage?: string
  redirectLocation?: string
}

const WalletStatus: React.FC<WalletStatusProps> = ({
  checkForWallet = true,
  inactiveWalletEmoji = '👀',
  customEmoji = '😔',
  inactiveWalletMessage = 'Connect wallet in order to buy instantaneous coretime.',
  customColor = 'bg-lastic-spectrum-via',
  customMessage = 'You currently have 0 active cores.',
  redirectLocationMessage = 'Go to marketplace',
  redirectLocation = '/bulkcore1',
}) => {
  const { activeAccount } = useInkathon()

  if (!activeAccount && checkForWallet) {
    return (
      <div className="flex justify-center items-center py-20 px-4">
        <div className="flex flex-col items-center justify-center px-2 py-8">
          <CuteInfo emoji={inactiveWalletEmoji} message={inactiveWalletMessage} color="bg-teal-4" />
          <ConnectButton />
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center py-20 px-4">
      <div className="flex flex-col items-center justify-center px-2 py-8 ">
        <CuteInfo emoji={customEmoji} message={customMessage} color={customColor} />
        <SecondaryButton title={redirectLocationMessage} location={redirectLocation} />
      </div>
    </div>
  )
}

export default WalletStatus
