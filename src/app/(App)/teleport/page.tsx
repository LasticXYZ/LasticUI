'use client'

import Border from '@/components/border/Border'
import PrimaryButton from '@/components/button/PrimaryButton'
import SideButton from '@/components/button/SideButton'
import ModalNotification, { notificationTypes } from '@/components/modal/ModalNotification'
import ModalTranasaction from '@/components/modal/ModalTransaction'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import { toShortAddress } from '@/utils/account/token'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { DispatchError, Hash } from '@polkadot/types/interfaces'
import { ISubmittableResult } from '@polkadot/types/types'
import { useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import { Builder } from '@poppyseed/xcm-sdk'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export type TxCbOnSuccessParams = { blockHash: Hash; txHash: Hash }

const handleTransaction = ({
  onSuccess,
  onError,
  onResult = console.log,
}: {
  onSuccess: (prams: TxCbOnSuccessParams) => void,
  onError: (err: DispatchError) => void,
  onResult?: (result: ISubmittableResult) => void
}) => (result: ISubmittableResult): void => {
  onResult(result)
  if (result.dispatchError) {
    console.warn('[EXEC] dispatchError', result)
    onError(result.dispatchError)
    return
  }

  if (result.status.isFinalized) {
    console.log('[EXEC] Finalized', result)
    console.log(`[EXEC] blockHash ${result.status.asFinalized}`)
    onSuccess({ blockHash: result.status.asFinalized, txHash: result.txHash })
  }
}

const chainOptions: { [key: string]: string } = {
  'Rococo Relay Chain': '/assets/Images/NetworkIcons/rococo-img.svg',
  'Rococo Coretime Testnet': '/assets/Images/NetworkIcons/coretime-img.svg',
}


const Teleport = () => {
  const [amount, setAmount] = useState<number>(0)
  const [isRelayToPara, setIsRelayToPara] = useState<boolean>(true) // State to toggle direction
  const [showTransactionPopup, setShowTransactionPopup] = useState(false);
  const [notification, setNotification] = useState<{ type: keyof typeof notificationTypes; message: string; isVisible: boolean }>({
    type: 'info',
    message: '',
    isVisible: false,
  });
  const { api, relayApi, activeAccount, activeChain, activeRelayChain, activeSigner } = useInkathon()

  const { balanceFormatted, balance, tokenSymbol, tokenDecimals } = useBalance(activeAccount?.address, true)

  const transactionCallback = handleTransaction({
    onSuccess: ({ blockHash }) => {
      setShowTransactionPopup(false); // Hide transaction popup
      setNotification({ type: 'success', message: `Transaction finalized at blockHash ${blockHash}`, isVisible: true });
    },
    onError: (error) => {
      setShowTransactionPopup(false); // Hide the popup in case of error too
      let errorMessage = "An unexpected error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
        setNotification({ type: 'danger', message: `Error in XCM transaction: ${errorMessage}`, isVisible: true });
  
      } else {
        setNotification({ type: 'danger', message: errorMessage, isVisible: true });
      }
    },
    onResult: (result) => {
      console.log('Transaction result:', result);
    }
  })

  const errorHandler = () => {
    setNotification({ type: 'warn', message: "Transaction was cancelled by the user.", isVisible: true });
    setShowTransactionPopup(false)
  }

  const functionSendXCM = async (amountToSend: number) => {
    if (!activeAccount || !relayApi || !api) return

    setShowTransactionPopup(true)

    try {
      const call = isRelayToPara
        ? await Builder(relayApi).to('CoretimeKusama').amount(amountToSend).address(activeAccount.address).build()
        : await Builder(api).from('CoretimeKusama').amount(amountToSend).address(activeAccount.address).build()
    
      call
        .signAndSend(activeAccount.address, { signer: activeSigner }, transactionCallback)
        .catch(errorHandler)
    } catch (error) {
      console.error('Error in XCM transaction:', error)
      
      setShowTransactionPopup(false)
      if (error instanceof Error && error.message === 'Cancelled') {
        setNotification({
          type: 'warn',
          message: 'Transaction was cancelled by the user.',
          isVisible: true,
        });
      } else {
        // Handle other errors differently
        setNotification({
           type: 'danger', 
           message: error instanceof Error ? `Error in XCM transaction: ${error.message}`: 'Error in XCM transaction: An unexpected error occurred.', 
           isVisible: true 
        });

      }
    } finally {
      
    }
  }

  const handleMaxClick = () => {
    setAmount(Number(balance) / 10 ** tokenDecimals)
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
            Teleport assets between networks using the XCM protocol. XCM is a cross-chain messaging protocol that allows assets to be moved between different networks.
          </p>
          {/* Temporary link */}
          <Link href="https://hello.kodadot.xyz/tutorial/teleport/teleport-bridge" className="mb-2 font-semibold">
            Click here to learn how it works
          </Link>
          <hr className="my-4 border-gray-9" />

          <div className="flex flex-row items-center justify-between w-full gap-6 mb-6">
            <div className='w-full'>
              <p className="mb-2">Source chain</p>
              <div className="relative w-full rounded-2xl bg-opacity-20 py-2 pl-3 pr-10 text-left border border-gray-9 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="flex items-center">
                  <Image
                    src={chainOptions[(isRelayToPara ? activeRelayChain?.name : activeChain?.name) || 'Rococo Relay Chain']}
                    alt=""
                    width='0'
                    height="0"
                    style={{ width: '2em', height: 'auto' }}
                    className="flex-shrink-0 h-6 w-6 rounded-full"
                  />
                  <span className="ml-3 block truncate">{isRelayToPara ? activeRelayChain?.name : activeChain?.name}</span>
                </span>
              </div>
            </div>
            <div className='pt-8'>
              <button onClick={toggleDirection} className="">
                <ArrowPathIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className='w-full'>
              <p className="mb-2">Destination</p>
              <div className="relative w-full rounded-2xl bg-opacity-20 py-2 pl-3 pr-10 text-left border border-gray-9 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="flex items-center">
                  <Image
                    src={chainOptions[(isRelayToPara ? activeChain?.name : activeRelayChain?.name) || 'Rococo Relay Chain']}
                    alt=""
                    width='0'
                    height="0"
                    style={{ width: '2em', height: 'auto' }}
                    className="flex-shrink-0 h-6 w-6 rounded-full"
                  />
                  <span className="ml-3 block truncate">{isRelayToPara ? activeChain?.name : activeRelayChain?.name}</span>
                </span>
              </div>
            </div>
          </div>

          <button onClick={toggleDirection} className="mb-4 py-2 px-4 bg-blue-500 text-black rounded hover:bg-blue-600 transition">
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
              <span className="ml-2">{tokenSymbol}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span>Balance on {activeChain?.name}: {balanceFormatted}</span>
              <SideButton title="Max" onClick={handleMaxClick} />
            </div>
          </div>
          <div className='flex justify-center items-center'>
            <PrimaryButton 
              disabled={(amount <= 0)}
              title={showTransactionPopup ? 'Processing...' : 'Proceed To Confirmation'} 
              onClick={() => functionSendXCM(amount * 10 ** tokenDecimals)}
            />

          </div>

          <p className="mt-6">
            You will receive {amount || 0} {tokenSymbol} on {isRelayToPara ? activeChain?.name : activeRelayChain?.name} to {toShortAddress(activeAccount?.address, 4)}
          </p>
        </div>
        <ModalTranasaction isVisible={showTransactionPopup} message="Transaction is being processed. Please wait..." />
        <ModalNotification type={notification.type} isVisible={notification.isVisible} message={notification.message} onClose={() => setNotification({ ...notification, isVisible: false })} />
      </Border>
    </section>
  )
}

export default Teleport
