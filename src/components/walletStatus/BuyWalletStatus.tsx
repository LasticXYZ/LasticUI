import SecondaryButton from '@/components/button/SecondaryButton'
import PurchaseInteractor from '@/components/extrinsics/broker/PurchaseInteractor'
import CuteInfo from '@/components/info/CuteInfo'
import { ConnectButton } from '@/components/web3/ConnectButton'
import { parseNativeTokenToHuman } from '@/utils/account/token'
import { StatusCode } from '@/utils/broker/saleStatus'
import { goToChainRoute } from '@/utils/common/chainPath'
import { truncateHash } from '@/utils/truncateHash'
import { encodeAddress } from '@polkadot/util-crypto'
import { useBalance, useInkathon, useRelayBalance } from '@poppyseed/lastic-sdk'
import { SaleInitializedEvent } from '@poppyseed/squid-sdk'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React from 'react'

type BuyWalletStatusType = {
  saleInfo: SaleInitializedEvent
  coresSold: number | undefined
  firstCore: number
  formatPrice: string
  currentPrice: number | null
  statusCode: StatusCode | null
}

const BuyWalletStatus: React.FC<BuyWalletStatusType> = ({
  saleInfo,
  coresSold,
  firstCore,
  formatPrice,
  currentPrice,
  statusCode,
}) => {
  const { activeAccount, activeChain } = useInkathon()
  const {
    freeBalance: balance,
    tokenSymbol,
    tokenDecimals,
  } = useBalance(activeAccount?.address, true)
  const { freeBalance: relayBalance } = useRelayBalance(activeAccount?.address, true)

  const formattedCoreBalance = parseNativeTokenToHuman({
    paid: balance?.toString(),
    decimals: tokenDecimals,
    reduceDecimals: 2,
  })
  const formattedrelayBalance = parseNativeTokenToHuman({
    paid: relayBalance?.toString(),
    decimals: tokenDecimals,
    reduceDecimals: 2,
  })

  const pathname = usePathname()

  let inputPurchasePrice = currentPrice ? Math.ceil(currentPrice) : NaN

  if (!saleInfo.coresOffered || !saleInfo.idealCoresSold) {
    return (
      <div className="flex justify-center items-center py-20 px-4">
        <div className="flex flex-col items-center justify-center px-2 py-8">
          <CuteInfo emoji="🔥" message="Sale not initialized yet." color="bg-lastic-spectrum-via" />
        </div>
      </div>
    )
  }

  if (!activeAccount || !statusCode) {
    return (
      <div className="flex justify-center items-center py-20 px-4">
        <div className="flex flex-col items-center justify-center px-2 py-8">
          <CuteInfo
            emoji="👀"
            message="Connect wallet in order to buy Coretime."
            color="bg-teal-4 dark:bg-teal-5"
          />
          <ConnectButton />
        </div>
      </div>
    )
  }

  if (statusCode === StatusCode.Interlude) {
    return (
      <div className="flex justify-center items-center py-20 px-4">
        <div className="flex flex-col items-center justify-center px-2 py-8">
          <CuteInfo
            emoji="🔥"
            message="Renewal period is active. Time to renew your core!"
            color="bg-lastic-spectrum-via"
          />
          <SecondaryButton
            title="Time To Renew your Core"
            location={goToChainRoute(pathname, `/renewal`)}
          />
        </div>
      </div>
    )
  }

  if (saleInfo.coresOffered && coresSold && coresSold >= saleInfo.coresOffered) {
    return (
      <div className="flex justify-center items-center py-20 px-4">
        <div className="flex flex-col items-center justify-center px-2 py-8 ">
          <CuteInfo emoji="😔" message="All cores are sold out." color="bg-lastic-spectrum-via" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-left h-full w-full p-10">
      <h2 className="text-2xl font-unbounded uppercase font-semibold mt-4 mb-4">Sale Info</h2>
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
        <div className="dark:text-gray-6">
          <div className="text-gray-18 dark:text-gray-3 text-xl font-unbounded uppercase mb-5">
            Core Nb:{' '}
            <span className="font-semibold">{coresSold ? firstCore + coresSold : firstCore}</span>
          </div>
          <div className=" mb-2 ">
            Available Cores:{' '}
            <span className="font-semibold">
              {coresSold ? saleInfo.coresOffered - coresSold : saleInfo.coresOffered} /{' '}
              {saleInfo.coresOffered}{' '}
            </span>
          </div>
          <div className=" mb-2">
            Cores that need to be sold so that the price starts rising:{' '}
            <span className="font-semibold">
              {saleInfo.idealCoresSold} / {saleInfo.coresOffered}{' '}
            </span>
          </div>
          <div className=" mb-4">
            Buy core for: <span className="text-pink-400 font-semibold">{formatPrice}</span>
          </div>
          <div>
            Using account:{' '}
            {truncateHash(encodeAddress(activeAccount.address, activeChain?.ss58Prefix || 42), 8)}
          </div>
          <div className="mt-5">
            {balance ? (
              <div>
                {' '}
                Balance on Coretime: {formattedCoreBalance} {tokenSymbol}
              </div>
            ) : (
              'Loading Balance'
            )}
            {relayBalance ? (
              <div>
                {' '}
                Balance on Relay: {formattedrelayBalance} {tokenSymbol}
              </div>
            ) : (
              'Loading Relay Balance'
            )}
          </div>
          <div className="">
            {balance &&
            relayBalance &&
            balance.toNumber() < inputPurchasePrice &&
            relayBalance.toNumber() < inputPurchasePrice ? (
              <div className="text-red-500 py-2">Insufficient balance for purchase.</div>
            ) : null}
          </div>
          <div className="">
            {balance &&
            relayBalance &&
            balance.toNumber() < inputPurchasePrice &&
            relayBalance.toNumber() >= inputPurchasePrice ? (
              <div className="text-red-500 py-2">Your assets will be autoteleported.</div>
            ) : null}
          </div>
          {balance &&
          relayBalance &&
          balance.toNumber() > 0 &&
          (balance.toNumber() > inputPurchasePrice ||
            relayBalance.toNumber() > inputPurchasePrice) ? (
            <div className="flex flex-col px-10 mt-10 items-center ">
              <PurchaseInteractor param={inputPurchasePrice.toString()} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default BuyWalletStatus
