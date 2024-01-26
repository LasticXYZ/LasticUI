import Border from '@/components/border/Border';
import CoreItemExtensive from '@/components/cores/CoreItemExtensive';
import WalletStatus from '@/components/walletStatus/WalletStatus';
import { parseNativeTokenToHuman } from '@/utils/account/token';
import { querySpecificRegion } from '@/utils/broker';
import { useBalance, useInkathon } from '@poppyseed/lastic-sdk';

export default function BrokerRegionData({ coreNb }: { coreNb: number }) {
  const { activeAccount, activeChain, api } = useInkathon()
  let { tokenSymbol } = useBalance(activeAccount?.address, true)
  const region = querySpecificRegion({ api, coreNb })

  if (!activeChain || !activeAccount || !api) {
    return (
      <Border className='mt-5'>
        <WalletStatus 
          inactiveWalletMessage='Connecting to chain...'
        />
      </Border>
    )
  }

  if (!region) {
    return (
      <Border className='mt-5'>
        <WalletStatus
          customEmoji='🤷‍♀️'
          inactiveWalletMessage='Connecting to chain...'
          customColor='bg-purple-2'
          customMessage='No region for this core number found'
        />
      </Border>
    )
  }

  return (
    <Border className='mt-5'>
      <div className="h-full w-full flex flex-col justify-left items-left">
        <div>
          <div className="">
            <CoreItemExtensive
              timeBought="Jan 2024"
              coreNumber={region.detail[0].core}
              size="1"
              phase="- Period"
              cost={parseNativeTokenToHuman({paid: region.owner.paid, decimals: 12})}
              reward="0"
              currencyCost={tokenSymbol}
              currencyReward="LASTIC"
              mask={region.detail[0].mask}
              begin={region.detail[0].begin}
              end={region.owner.end}
            />
          </div>
        </div>
      </div>
    </Border>
  )
}
