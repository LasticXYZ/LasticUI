import { TxCbOnSuccessParams } from '@/app/(App)/teleport/page'
import { notificationTypes } from '@/components/modal/ModalNotification'
import { DispatchError } from '@polkadot/types/interfaces'
import { ISubmittableResult } from '@polkadot/types/types'
import { useBalance, useInkathon, useRelayBalance } from '@poppyseed/lastic-sdk'
import { Builder, Extrinsic } from '@poppyseed/xcm-sdk'
import { useState } from 'react'

export const useTeleport = () => {
  // notifications could be extracted into own hook
  const [notification, setNotification] = useState<{
    type: keyof typeof notificationTypes
    message: string
    isVisible: boolean
  }>({
    type: 'info',
    message: '',
    isVisible: false,
  })

  const [isTeleporting, setIsTeleporting] = useState(false)
  const [teleportMessage, setTeleportMessage] = useState('Teleporting. Please wait...')

  const { api, relayApi, activeAccount, activeChain, activeRelayChain, activeSigner } =
    useInkathon()

  // used for auto teleport
  const {
    balanceFormatted: balanceFormattedOnCoretime,
    balance: balanceOnCoretimeChain,
    tokenSymbol: tokenSymbolOnCoretimeChain,
    tokenDecimals: tokenDecimalsOnCoretimeChain,
  } = useBalance(activeAccount?.address, true)

  // used for auto teleport
  const {
    balanceFormatted: balanceFormattedOnRelayChain,
    balance: balanceOnRelayChain,
    tokenSymbol: tokenSymbolOnRelayChain,
    tokenDecimals: tokenDecimalsOnRelayChain,
  } = useRelayBalance(activeAccount?.address, true)

  const teleport = async (ext: Extrinsic) => {
    if (!activeAccount) return
    try {
      setIsTeleporting(true)
      ext
        .signAndSend(activeAccount.address, { signer: activeSigner }, transactionCallback)
        .catch(errorHandler)
    } catch (error) {
      console.error('Error in XCM transaction:', error)
      setIsTeleporting(false)
      // user canceled
      if (error instanceof Error && error.message === 'Cancelled') {
        setNotification({
          type: 'warn',
          message: 'Transaction was cancelled by the user.',
          isVisible: true,
        })
      } else {
        // other errors
        setNotification({
          type: 'danger',
          message:
            error instanceof Error
              ? `Error in XCM transaction: ${error.message}`
              : 'Error in XCM transaction: An unexpected error occurred.',
          isVisible: true,
        })
      }
    }
  }

  const teleportToRelay = async (amount: string | number | bigint) => {
    if (!activeAccount || !api) return
    setTeleportMessage(
      `Teleporting ${Number(amount) / 10 ** tokenDecimalsOnCoretimeChain} ${tokenSymbolOnCoretimeChain} to Relay Chain. Please wait...`,
    )
    const ext = await Builder(api)
      .from('CoretimeKusama')
      .amount(amount)
      .address(activeAccount.address)
      .build()

    teleport(ext)
  }

  const teleportToCoretimeChain = async (amount: string | number | bigint) => {
    if (!activeAccount || !relayApi) return
    setTeleportMessage(
      `Teleporting ${Number(amount) / 10 ** tokenDecimalsOnRelayChain} ${tokenSymbolOnRelayChain} to Coretime Chain. Please wait...`,
    )
    const ext = await Builder(relayApi)
      .to('CoretimeKusama')
      .amount(amount)
      .address(activeAccount.address)
      .build()

    teleport(ext)
  }

  const errorHandler = () => {
    setNotification({
      type: 'warn',
      message: 'Transaction was cancelled by the user.',
      isVisible: true,
    })
    setIsTeleporting(false)
  }

  const handleTeleport =
    ({
      onSuccess,
      onError,
      onResult = console.log,
    }: {
      onSuccess: (prams: TxCbOnSuccessParams) => void
      onError: (err: DispatchError) => void
      onResult?: (result: ISubmittableResult) => void
    }) =>
    (result: ISubmittableResult): void => {
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

  const transactionCallback = handleTeleport({
    onSuccess: ({ blockHash }) => {
      setIsTeleporting(false)
      setNotification({
        type: 'success',
        message: `Transaction finalized at blockHash ${blockHash}`,
        isVisible: true,
      })
    },
    onError: (error) => {
      setIsTeleporting(false)
      let errorMessage = 'An unexpected error occurred.'
      if (error instanceof Error) {
        errorMessage = error.message
        setNotification({
          type: 'danger',
          message: `Error in XCM transaction: ${errorMessage}`,
          isVisible: true,
        })
      } else {
        setNotification({ type: 'danger', message: errorMessage, isVisible: true })
      }
    },
    onResult: (result) => {
      console.log('Transaction result:', result)
    },
  })

  return {
    teleportToRelay,
    teleportToCoretimeChain,
    notification,
    setNotification,
    isTeleporting,
    teleportMessage,
  }
}
