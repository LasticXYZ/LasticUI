'use client'
import PrimaryButton from '@/components/button/PrimaryButton'
import Modal from '@/components/modal/Modal'
import { FormControl, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material'
import { TxButtonProps, useInkathon, useTxButton } from '@poppyseed/lastic-sdk'
import { FC, useEffect, useState } from 'react'

interface PurchaseCreditsProps {
  isOpen: boolean
  onClose: () => void
}

const PurchaseCreditsModal: FC<PurchaseCreditsProps> = ({ isOpen, onClose }) => {
  const { api, activeSigner, activeAccount, activeChain } = useInkathon()
  const [dotAmount, setDotAmount] = useState<number | undefined>(0)
  const [receiver, setReceiver] = useState<string | undefined>(activeAccount?.address)

  useEffect(() => {
    if (!receiver) {
      setReceiver(activeAccount?.address)
    }
  }, [activeAccount])

  const planck = activeChain?.testnet
    ? BigInt(1e12 * (dotAmount || 0)) // ROC to Planck conversion
    : BigInt(1e10 * (dotAmount || 0)) // DOT to Planck conversion

  const tokenName = activeChain?.testnet ? 'ROC' : 'DOT'

  const txButtonProps: TxButtonProps = {
    api,
    setStatus: (status: string | null) => console.log('tx status:', status),
    attrs: {
      palletRpc: 'broker',
      callable: 'purchaseCredit',
      inputParams: [planck, receiver],
      paramFields: [
        { name: 'amount', type: 'number', optional: false },
        { name: 'beneficiary', type: 'Object', optional: false },
      ],
    },
    type: 'SIGNED-TX',
    activeAccount,
    activeSigner,
  }
  const { transaction, status, allParamsFilled } = useTxButton(txButtonProps)

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setDotAmount(0)
        setReceiver(activeAccount?.address)
        onClose()
      }}
      title="Purchase Credits"
    >
      <div className="flex flex-col p-4 ">
        <p className="font-semibold mb-4">{`How many ${tokenName}s do you want to spend?`}</p>
        <p className="italic text-xs mb-4">
          {'Note: Credits are non-transferable and non-refundable'}
        </p>

        <FormControl sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
          <OutlinedInput
            type="number"
            value={dotAmount}
            onChange={(e) => setDotAmount(parseFloat(e.target.value))}
            startAdornment={<InputAdornment position="start">{tokenName}</InputAdornment>}
            label="Amount"
          />
        </FormControl>

        <TextField
          sx={{ m: 1 }}
          label="Receiver Address"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          helperText={
            activeAccount?.address && receiver === activeAccount?.address
              ? 'Your wallet address'
              : 'Be aware: Not your wallet address'
          }
        />

        <div className="flex flex-col items-center justify-center pt-10 ">
          <PrimaryButton
            title="Purchase"
            onClick={transaction}
            disabled={!allParamsFilled() || !dotAmount || dotAmount <= 0 || !receiver}
          />
          <div className="mt-5 text-sm text-gray-16 ">{status}</div>
        </div>
      </div>
    </Modal>
  )
}

export default PurchaseCreditsModal
