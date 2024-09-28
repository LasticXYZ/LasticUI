import { TxCbOnSuccessParams } from '@/app/[network]/(App)/teleport/page'
import { notificationTypes } from '@/components/modal/ModalNotification'
import { Builder, Extrinsic } from '@paraspell/sdk'
import { DispatchError } from '@polkadot/types/interfaces'
import { ISubmittableResult } from '@polkadot/types/types'
import { BN } from '@polkadot/util'
import { useBalance, useInkathon, useRelayBalance } from '@poppyseed/lastic-sdk'
import { useState } from 'react'

/** Small buffer for teleporting to prevent potential errors. Adjust it as needed. */
const BUFFER: BN = new BN(5 * 10 ** 9) // 0.005 ROC

const KSM_PARASPELL_CHAIN = 'CoretimeKusama'
const DOT_PARASPELL_CHAIN = 'CoretimePolkadot'

/**
 * Provides functionality to manage teleportation between blockchain networks.
 * It encapsulates logic for checking user balances on different chains, performing the teleportation action,
 * and managing UI notifications related to the teleportation process. It also handles updating the UI
 * state to reflect the ongoing status of a teleportation operation.
 *
 * @param onTeleportSuccess - An optional callback function that is called upon successful completion of the teleportation process. It is also called in auto teleport if funds are already sufficient.
 */
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

  /** State to indicate if a teleportation process is currently happening. */
  const [isTeleporting, setIsTeleporting] = useState(false)
  /** State for storing the current teleportation message. */
  const [teleportMessage, setTeleportMessage] = useState('Teleporting. Please wait...')

  const { api, relayApi, activeAccount, activeChain, activeRelayChain, activeSigner } =
    useInkathon()

  const PARASPELL_CHAIN =
    activeChain?.network === 'polkadot' ? DOT_PARASPELL_CHAIN : KSM_PARASPELL_CHAIN

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

  /**
   * Determines if there is already sufficient balance on the Relay chain.
   *
   * @param balanceNeeded - The amount of balance required as a BN object.
   * @returns A boolean indicating whether the balance is sufficient.
   */
  const hasRelayBalance = (balanceNeeded: BN) => {
    if (!balanceOnRelayChain) return false
    return balanceNeeded.lte(balanceOnRelayChain)
  }

  /**
   * Determines if there is sufficient balance on the Coretime chain.
   *
   * @param balanceNeeded - The amount of balance required as a BN object.
   * @returns A boolean indicating whether the balance is sufficient.
   */
  const hasCoretimeBalance = (balanceNeeded: BN) => {
    if (!balanceOnCoretimeChain) return false
    return balanceNeeded.lte(balanceOnCoretimeChain)
  }

  /**
   * Checks if the teleportation operation is feasible by comparing the required amount with the available balances.
   *
   * @param amountNeeded - The BN object representing the amount needed to successfully complete a teleportation.
   * @returns A boolean indicating whether teleportation is possible.
   */
  const canTeleport = (amountNeeded: BN) => {
    if (!balanceOnRelayChain || !balanceOnCoretimeChain) return false
    return balanceOnRelayChain.add(balanceOnCoretimeChain).sub(BUFFER).gte(amountNeeded)
  }

  /**
   * Handles the automatic teleportation logic, deciding whether and where to teleport based on the provided amount and destination.
   * It attempts the teleportation if the current balance is insufficient and the teleport operation is feasible.
   *
   * @param amount - The overall amount needed as a BN object.
   * @param teleportTo - The target chain for teleportation, either 'relay' or 'coretime'.
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

  /**
   * Executes the teleportation transaction using the provided extrinsic. This function is responsible for signing
   * and sending the transaction, showing notifications and triggering the callback function.
   *
   * @param ext - The extrinsic to be signed and sent, representing the teleportation command.
   */
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

  /**
   * Initiates the teleportation process to the Relay chain.
   *
   * @param amount - The amount to teleport.
   */
  const teleportToRelay = async (amount: string | number | bigint) => {
    if (!activeAccount || !api) return
    setTeleportMessage(
      `Teleporting ${Number(amount) / 10 ** tokenDecimalsOnCoretimeChain} ${tokenSymbolOnCoretimeChain} to Relay Chain. Please wait...`,
    )
    const ext = await Builder(api)
      .from(PARASPELL_CHAIN)
      .amount(amount)
      .address(activeAccount.address)
      .build()

    teleport(ext)
  }

  /**
   * Initiates the teleportation process to the Coretime chain.
   *
   * @param amount - The amount to teleport.
   */
  const teleportToCoretimeChain = async (amount: string | number | bigint) => {
    if (!activeAccount || !relayApi) return
    setTeleportMessage(
      `Teleporting ${Number(amount) / 10 ** tokenDecimalsOnRelayChain} ${tokenSymbolOnRelayChain} to Coretime Chain. Please wait...`,
    )
    const ext = await Builder(relayApi)
      .to(PARASPELL_CHAIN)
      .amount(amount)
      .address(activeAccount.address)
      .build()

    teleport(ext)
  }

  /** A general error handler for teleportation process errors. */
  const errorHandler = () => {
    setNotification({
      type: 'warn',
      message: 'Transaction was cancelled by the user.',
      isVisible: true,
    })
    setIsTeleporting(false)
  }

  /**
   * Handles the result of a teleportation transaction, triggering callbacks based on the transaction outcome.
   *
   * @param params - An object containing callbacks for success, error handling, and result processing.
   */
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
        //console.log('[EXEC] Finalized', result)
        //console.log(`[EXEC] blockHash ${result.status.asFinalized}`)
        onSuccess({ blockHash: result.status.asFinalized, txHash: result.txHash })
      }
    }

  /** Callback for processing teleportation transactions, and update notifications based on the transaction status. */
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
      //console.log('Transaction result:', result)
      setNotification({ type: 'success', message: `Transaction result ${result}`, isVisible: true })
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
