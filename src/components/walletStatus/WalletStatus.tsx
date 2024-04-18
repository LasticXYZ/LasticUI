import SecondaryButton from '@/components/button/SecondaryButton'
import CuteInfo from '@/components/info/CuteInfo'
import { ConnectButton } from '@/components/web3/ConnectButton'
import { goToChainRoute } from '@/utils/common/chainPath'
import { useInkathon } from '@poppyseed/lastic-sdk'
import { usePathname } from 'next/navigation'
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
  inactiveWalletMessage = 'Connect wallet in order to buy coretime.',
  customColor = 'bg-lastic-spectrum-via',
  customMessage = 'You currently have 0 active cores.',
  redirectLocationMessage = 'Go to marketplace',
  redirectLocation = '',
}) => {
  const { activeAccount } = useInkathon()
  const pathname = usePathname()

  if (redirectLocation === '') {
    redirectLocation = goToChainRoute(pathname, '/bulkcore1')
  }

  if (!activeAccount && checkForWallet) {
    return (
      <div className="flex justify-center items-center py-1 px-4">
        <div className="flex flex-col items-center justify-center px-2 py-4">
          <CuteInfo
            emoji={inactiveWalletEmoji}
            message={inactiveWalletMessage}
            color="bg-pink-400 dark:bg-teal-7"
          />
          <ConnectButton />
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center py-1 px-4">
      <div className="flex flex-col items-center justify-center px-2 py-4 ">
        <CuteInfo emoji={customEmoji} message={customMessage} color={customColor} />
        <SecondaryButton title={redirectLocationMessage} location={redirectLocation} />
      </div>
    </div>
  )
}

export default WalletStatus
