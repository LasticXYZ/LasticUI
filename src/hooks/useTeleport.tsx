import { TxCbOnSuccessParams } from '@/app/(App)/teleport/page'
import { notificationTypes } from '@/components/modal/ModalNotification'
import { DispatchError } from '@polkadot/types/interfaces'
import { ISubmittableResult } from '@polkadot/types/types'
import { BN } from '@polkadot/util'
import { useBalance, useInkathon, useRelayBalance } from '@poppyseed/lastic-sdk'
import { Builder, Extrinsic } from '@poppyseed/xcm-sdk'
import { useState } from 'react'

/** Small buffer for teleporting to prevent potential errors. Adjust it as needed. */
const BUFFER: BN = new BN(5 * 10 ** 9) // 0.005 ROC

export const useTeleport = (onTeleportSuccess?: () => void) => {
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

  const hasRelayBalance = (balanceNeeded: BN) => {
    if (!balanceOnRelayChain) return false
    return balanceNeeded.lte(balanceOnRelayChain)
  }

  const hasCoretimeBalance = (balanceNeeded: BN) => {
    if (!balanceOnCoretimeChain) return false
    return balanceNeeded.lte(balanceOnCoretimeChain)
  }

  const canTeleport = (amountNeeded: BN) => {
    if (!balanceOnRelayChain || !balanceOnCoretimeChain) return false
    return balanceOnRelayChain.add(balanceOnCoretimeChain).sub(BUFFER).gte(amountNeeded)
  }

  /**
   * functionality for auto teleport.
   *
   * @remarks only tries teleporting if balance is not sufficient
   * @param amount
   * @param teleportTo
   */
  const autoTeleport = async (amount: BN, teleportTo: 'relay' | 'coretime') => {
    if (!balanceOnRelayChain || !balanceOnCoretimeChain) return

    // check if balance is already enough
    const hasSufficientBalance =
      teleportTo === 'relay' ? hasRelayBalance(amount) : hasCoretimeBalance(amount)
    if (hasSufficientBalance) {
      if (onTeleportSuccess) onTeleportSuccess()
      return
    }

    // check if teleport is possible and teleport
    if (canTeleport(amount)) {
      const teleportAmount =
        teleportTo === 'relay'
          ? amount.sub(balanceOnRelayChain).add(BUFFER)
          : amount.sub(balanceOnCoretimeChain).add(BUFFER)
      console.log('teleportAmount:', teleportAmount.toString())

      teleportTo === 'relay'
        ? await teleportToRelay(BigInt(teleportAmount.toString(10)))
        : await teleportToCoretimeChain(BigInt(teleportAmount.toString(10)))
      return
    }

    setNotification({
      type: 'warn',
      message: 'Insufficient balance to teleport. Please top up your balance.',
      isVisible: true,
    })
  }

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
      if (onTeleportSuccess) onTeleportSuccess()
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
    autoTeleport,
    notification,
    setNotification,
    isTeleporting,
    teleportMessage,
    canTeleport,
    hasCoretimeBalance,
    hasRelayBalance,
  }
}
