import PurchaseInteractor from '@/components/broker/PurchaseInteractor'
import SecondaryButton from '@/components/button/SecondaryButton'
import CuteInfo from '@/components/info/CuteInfo'
import { ConnectButton } from '@/components/web3/ConnectButton'
import { truncateHash } from '@/utils/truncateHash'
import { encodeAddress } from '@polkadot/util-crypto'
import { SaleInfoType, useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import Image from 'next/image'
import React from 'react'

type BuyWalletStatusType = {
  saleInfo: SaleInfoType
  formatPrice: string
  currentPrice: number
}

const BuyWalletStatus: React.FC<BuyWalletStatusType> = ({
  saleInfo,
  formatPrice,
  currentPrice,
}) => {
  const { activeAccount, activeChain } = useInkathon()
  const { balanceFormatted, balance } = useBalance(activeAccount?.address, true)

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

  if (saleInfo.coresSold >= saleInfo.coresOffered) {
    return (
      <div className="flex justify-center items-center py-20 px-4">
        <div className="flex flex-col items-center justify-center px-2 py-8 ">
          <CuteInfo emoji="😔" message="All cores are sold out." color="bg-lastic-spectrum-via" />
          <SecondaryButton title="Purchase Instantianous Coretime" location="/instacore" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-left h-full w-full p-10">
      <h2 className="text-2xl font-syncopate font-semibold mt-4 mb-4">Sale Info</h2>
      <div className="flex flex-row mt-5">
        <div className="pr-10 mt-5">
          <Image
            src="/assets/Images/core1.png"
            width={200}
            height={200}
            alt="instacore"
            className="mb-4"
          />
        </div>
        <div>
          <div className="text-gray-18 text-xl font-syncopate mb-5">
            Core Nb:{' '}
            <span className="font-semibold">{saleInfo.firstCore + saleInfo.coresSold}</span>
          </div>
          <div className="text-gray-600 mb-2">
            Available Cores:{' '}
            <span className="font-semibold">
              {saleInfo.coresOffered - saleInfo.coresSold} / {saleInfo.coresOffered}{' '}
            </span>
          </div>
          <div className="text-gray-600 mb-2">
            Cores that need to be sold so that the price starts rising:{' '}
            <span className="font-semibold">
              {saleInfo.idealCoresSold} / {saleInfo.coresOffered}{' '}
            </span>
          </div>
          <div className="text-gray-600 mb-4">
            Buy core for: <span className="text-green-500 font-semibold">{formatPrice}</span>
          </div>
          <div>
            Using account:{' '}
            {truncateHash(encodeAddress(activeAccount.address, activeChain?.ss58Prefix || 42), 8)}
          </div>
          <div>
            {balance
              ? balance.toNumber() > 0
                ? `Balance: ${balanceFormatted}`
                : 'You have 0 balance on this account'
              : 'Loading Balance'}
          </div>
          <div className="flex flex-col px-10 mt-10 items-center ">
            <PurchaseInteractor param={Math.floor(currentPrice * 1.02).toString()} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyWalletStatus
