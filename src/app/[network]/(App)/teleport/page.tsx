'use client'

import Border from '@/components/border/Border'
import PrimaryButton from '@/components/button/PrimaryButton'
import SideButton from '@/components/button/SideButton'
import ModalNotification from '@/components/modal/ModalNotification'
import ModalTranasaction from '@/components/modal/ModalTransaction'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import { useTeleport } from '@/hooks/useTeleport'
import { toShortAddress } from '@/utils/account/token'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { Hash } from '@polkadot/types/interfaces'
import { useBalance, useInkathon, useRelayBalance } from '@poppyseed/lastic-sdk'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export type TxCbOnSuccessParams = { blockHash: Hash; txHash: Hash }

// const handleTransaction =
//   ({
//     onSuccess,
//     onError,
//     onResult = console.log,
//   }: {
//     onSuccess: (prams: TxCbOnSuccessParams) => void
//     onError: (err: DispatchError) => void
//     onResult?: (result: ISubmittableResult) => void
//   }) =>
//   (result: ISubmittableResult): void => {
//     const { addToast } = useToasts()

//     onResult(result)
//     if (result.dispatchError) {
//       console.warn('[EXEC] dispatchError', result)
//       addToast({
//         title: '[EXEC] dispatchError',
//         type: 'error',
//         link: '',
//       })
//       onError(result.dispatchError)
//       return
//     }

//     if (result.status.isFinalized) {
//       console.log('[EXEC] Finalized', result)
//       console.log(`[EXEC] blockHash ${result.status.asFinalized}`)
//       onSuccess({ blockHash: result.status.asFinalized, txHash: result.txHash })
//     }
//   }

const chainOptions: { [key: string]: string } = {
  rococo: '/assets/Images/NetworkIcons/rococo-img.svg',
  'rococo-coretime': '/assets/Images/NetworkIcons/coretime-img.svg',
  kusama: '/assets/Images/NetworkIcons/kusama-img.svg',
  'kusama-coretime': '/assets/Images/NetworkIcons/coretime-img.svg',
}

const Teleport = () => {
  const [amount, setAmount] = useState<number>(0)
  const [isRelayToPara, setIsRelayToPara] = useState<boolean>(true)
  const {
    notification,
    setNotification,
    isTeleporting,
    teleportToRelay,
    teleportToCoretimeChain,
    teleportMessage,
  } = useTeleport()
  const { activeAccount, activeChain, activeRelayChain } = useInkathon()

  const {
    balanceFormatted: balanceFormattedOnCoretime,
    balance: balanceOnCoretimeChain,
    tokenSymbol: tokenSymbolOnCoretimeChain,
    tokenDecimals: tokenDecimalsOnCoretimeChain,
  } = useBalance(activeAccount?.address, true)

  const {
    balanceFormatted: balanceFormattedOnRelayChain,
    balance: balanceOnRelayChain,
    tokenSymbol: tokenSymbolOnRelayChain,
    tokenDecimals: tokenDecimalsOnRelayChain,
  } = useRelayBalance(activeAccount?.address, true)

  const doTeleport = async (amountToSend: number) => {
    isRelayToPara
      ? await teleportToCoretimeChain(amountToSend)
      : await teleportToRelay(amountToSend)
  }

  const handleMaxClick = () => {
    if (isRelayToPara) setAmount(Number(balanceOnRelayChain) / 10 ** tokenDecimalsOnRelayChain)
    else setAmount(Number(balanceOnCoretimeChain) / 10 ** tokenDecimalsOnCoretimeChain)
  }

  const toggleDirection = () => {
    setIsRelayToPara(!isRelayToPara)
  }

  if (!activeAccount) {
    return (
      <section className="mx-auto max-w-9xl py-7 px-4 sm:px-6 lg:px-8">
        <Border>
          <WalletStatus customMessage="Connect your wallet to Teleport your assets" />
        </Border>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-9xl py-7 px-4 sm:px-6 lg:px-8">
      <Border>
        <div className="container mx-auto p-10">
          <h1 className="text-2xl font-bold mb-4 font-unbounded uppercase">Teleport</h1>
          <p className="mb-6">
            Teleport assets between networks using the XCM protocol. XCM is a cross-chain messaging
            protocol that allows assets to be moved between different networks.
          </p>
          {/* Temporary link */}
          <Link
            href="https://hello.kodadot.xyz/tutorial/teleport/teleport-bridge"
            className="mb-2 font-semibold"
          >
            Click here to learn how it works
          </Link>
          <hr className="my-4 border-gray-9" />

          <div className="flex flex-row items-center justify-between w-full gap-6 mb-6">
            <div className="w-full">
              <p className="mb-2">Source chain</p>
              <div className="relative w-full rounded-2xl bg-opacity-20 py-2 pl-3 pr-10 text-left border border-gray-9 focus:outline-none  focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="flex items-center">
                  <Image
                    src={
                      chainOptions[
                        (isRelayToPara ? activeRelayChain?.network : activeChain?.network) ||
                          'Rococo Relay Chain'
                      ]
                    }
                    alt=""
                    width="0"
                    height="0"
                    style={{ width: '2em', height: 'auto' }}
                    className="flex-shrink-0 h-6 w-6 rounded-full"
                  />
                  <span className="ml-3 block truncate">
                    {isRelayToPara ? activeRelayChain?.name : activeChain?.name}
                  </span>
                </span>
              </div>
            </div>
            <div className="pt-8">
              <button onClick={toggleDirection} className="">
                <ArrowPathIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="w-full">
              <p className="mb-2">Destination</p>
              <div className="relative w-full rounded-2xl bg-opacity-20 py-2 pl-3 pr-10 text-left border border-gray-9 focus:outline-none  focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="flex items-center">
                  <Image
                    src={
                      chainOptions[
                        (isRelayToPara ? activeChain?.network : activeRelayChain?.network) ||
                          'rococo'
                      ]
                    }
                    alt=""
                    width="0"
                    height="0"
                    style={{ width: '2em', height: 'auto' }}
                    className="flex-shrink-0 h-6 w-6 rounded-full"
                  />
                  <span className="ml-3 block truncate">
                    {isRelayToPara ? activeChain?.name : activeRelayChain?.name}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={toggleDirection}
            className="mb-4 py-2 px-4 text-black dark:text-gray-1 rounded hover:bg-blue-600 transition"
          >
            Move assets from {isRelayToPara ? 'Relay to Parachain' : 'Parachain to Relay'}
          </button>
          <div className="mb-6">
            <p className="mb-2">Asset Amount</p>
            <div className="flex items-center p">
              <input
                type="number"
                placeholder="0"
                value={amount || ''}
                min="0"
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                className="flex-1 p-2 pl-5 bg-transparent border border-gray-9 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-7 focus:border-transparent"
              />
              <span className="ml-2">{tokenSymbolOnCoretimeChain}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span>
                Balance on {activeChain?.name}: {balanceFormattedOnCoretime}
              </span>
              <span>
                Balance on {activeRelayChain?.name}: {balanceFormattedOnRelayChain}
              </span>
              <SideButton title="Max" onClick={handleMaxClick} />
            </div>
          </div>
          <div className="flex justify-center items-center">
            <PrimaryButton
              disabled={amount <= 0}
              title={isTeleporting ? 'Processing...' : 'Proceed To Confirmation'}
              onClick={() =>
                doTeleport(
                  amount *
                    10 **
                      (isRelayToPara ? tokenDecimalsOnRelayChain : tokenDecimalsOnCoretimeChain),
                )
              }
            />
          </div>

          <p className="mt-6">
            You will receive {amount || 0} {tokenSymbolOnCoretimeChain} on{' '}
            {isRelayToPara ? activeChain?.name : activeRelayChain?.name} to{' '}
            {toShortAddress(activeAccount?.address, 4)}
          </p>
        </div>

        <ModalTranasaction isVisible={isTeleporting} message={teleportMessage} />

        <ModalNotification
          type={notification.type}
          isVisible={notification.isVisible}
          message={notification.message}
          onClose={() => setNotification({ ...notification, isVisible: false })}
        />
      </Border>
    </section>
  )
}

export default Teleport
