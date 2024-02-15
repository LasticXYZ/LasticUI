'use client'

import Border from '@/components/border/Border'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import { toShortAddress } from '@/utils/account/token'
import { Builder } from '@paraspell/sdk'
import { DispatchError, Hash } from '@polkadot/types/interfaces'
import { ISubmittableResult } from '@polkadot/types/types'
import { useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import Link from 'next/link'
import { useState } from 'react'

export type TxCbOnSuccessParams = { blockHash: Hash; txHash: Hash }


const txCb =
(
  onSuccess: (prams: TxCbOnSuccessParams) => void,
  onError: (err: DispatchError) => void,
  onResult: (result: ISubmittableResult) => void = console.log,
) =>
(result: ISubmittableResult): void => {
  onResult(result)
  if (result.dispatchError) {
    console.warn('[EXEC] dispatchError', result)
    onError(result.dispatchError)
  }

  if (result.status.isFinalized) {
    console.log('[EXEC] Finalized', result)
    console.log(`[EXEC] blockHash ${result.status.asFinalized}`)
    onSuccess({ blockHash: result.status.asFinalized, txHash: result.txHash })
  }
}

export const notificationTypes = {
  success: {
    variant: 'success',
  },
  info: {
    variant: 'info',
  },
  danger: {
    variant: 'danger',
    duration: 15000,
  },
  warn: {
    variant: 'warning',
  },
}


export const showNotification = (
  message: string | null,
  params: any = notificationTypes.info,
  duration = 10000,
): void => {
  if (params === notificationTypes.danger) {
    console.error('[Notification Error]', message)
    return
  }

  console.log(message)
}

const Teleport = () => {
  const [amount, setAmount] = useState(NaN)
  const [isLoading, setIsLoading] = useState(false)
  const { api, relayApi, activeAccount, activeChain, activeRelayChain, activeSigner } = useInkathon()

  const { balanceFormatted, balance, tokenSymbol, tokenDecimals } = useBalance(activeAccount?.address, true, {
    forceUnit: false,
    fixedDecimals: 2,
    removeTrailingZeros: true,
  })

  const chainOptions = [
    { name: 'Rococo', icon: '/assets/Images/NetworkIcons/rococo-img.svg' },
    { name: 'Rococo AssetHub', icon: '/assets/Images/NetworkIcons/assethub.svg' },
  ]

  // const transactionHandler = {
  //   onBroadcast: (hash: string) => {
  //     console.log(`Transaction broadcasted with hash ${hash}`)
  //   },
  //   onFinalized: (hash: string) => {
  //     console.log(`Transaction finalized with hash ${hash}`)
  //   },
  //   onReady: (hash: string) => {
  //     console.log(`Transaction ready with hash ${hash}`)
  //   },
  //   onInBlock: (hash: string) => {
  //     console.log(`Transaction in block with hash ${hash}`)
  //   },
  // }

  const transactionHandler = txCb(
    ({ blockHash }) => {
      showNotification(
        `Transaction finalized at blockHash ${blockHash}`,
        notificationTypes.success,
      )
    },
    (dispatchError) => {
      showNotification(dispatchError.toString(), notificationTypes.warn)
    },
  )

  const functionSendXCM = async (amountToSend: number) => {
    if (!activeAccount || !relayApi || !api) return

    setIsLoading(true)
    let call;

    try {
      call = await Builder(relayApi)
        .to('AssetHubKusama')
        .amount(amountToSend)
        .address(activeAccount.address)
        .build()

      console.log(call)
    } catch (error) {
      console.error('Error building XCM:', error)
      return ;
    } 

    try {
      call.signAndSend(
        activeAccount.address,
        { signer: activeSigner },
        transactionHandler,
      )
    } catch (error) {
      console.error('Error sending XCM:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMaxClick = () => {
    setAmount(Number(balance)/ 10**12) // Assuming 'balanceFormatted' is a string that can be directly used
  }

  if (!activeAccount) {
    return (
      <section className="mx-auto max-w-9xl py-7 px-4 sm:px-6 lg:px-8">
      <Border>
        <WalletStatus customMessage='Connect your wallet to Teleport your assets'/>
      </Border>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-9xl py-7 px-4 sm:px-6 lg:px-8">
      <Border>
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4 font-syncopate">Teleport</h1>
          <p className="mb-6">
            Teleport assets between networks in the Polkadot and Kusama Ecosystem.
          </p>
          <Link href="/" className="mb-2 font-semibold">
            Click here to learn how it works
          </Link>
          <hr className="my-4 border-gray-9" />

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="mb-2">Source chain</p>
              {activeRelayChain?.name}
            </div>
            <div>
              <p className="mb-2">Destination</p>
              {activeChain?.name}
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-2">Asset Amount</p>
            <div className="flex items-center p">
              <input
                type="number"
                placeholder="0"
                value={amount}
                min="0"
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                className="flex-1 p-2 bg-transparent border border-gray-9 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-7 focus:border-transparent"
              />
              <span className="ml-2">{tokenSymbol}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span>Balance: {balanceFormatted}</span>
              <button onClick={handleMaxClick} className="text-blue-500">Max</button>
            </div>
          </div>

          <button
            onClick={() => functionSendXCM(amount * 10 ** tokenDecimals)}
            disabled={isLoading} // Disable button when operation is in progress
            className={`w-full py-2 border border-gray-9 rounded-lg hover:bg-gray-3 ${isLoading ? 'bg-gray-10' : ''}`}
          >
            {isLoading ? 'Processing...' : 'Proceed To Confirmation'}
          </button>

          <p className="mt-6">
            You will receive {amount || 0} {tokenSymbol} on {activeChain?.name} to {toShortAddress(activeAccount?.address, 4)}
          </p>
        </div>
      </Border>
    </section>
  )
}

export default Teleport
