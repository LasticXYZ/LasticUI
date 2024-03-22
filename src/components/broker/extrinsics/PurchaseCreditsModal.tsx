'use client'
import PrimaryButton from '@/components/button/PrimaryButton'
import Modal from '@/components/modal/Modal'
import { useBrokerConstants } from '@/utils/broker'
import { FormControl, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'
import { TxButtonProps, useInkathon, useTxButton } from '@poppyseed/lastic-sdk'
import { FC, useState } from 'react'

interface PurchaseCreditsProps {
  isOpen: boolean
  onClose: () => void
}

const PurchaseCreditsModal: FC<PurchaseCreditsProps> = ({ isOpen, onClose }) => {
  const { api, activeSigner, activeAccount, activeChain, relayApi } = useInkathon()
  const { brokerConstants } = useBrokerConstants(api)
  const [dotAmount, setDotAmount] = useState<number | undefined>(0)

  const planck: bigint = BigInt(1e10 * (dotAmount || 0))

  const txButtonProps: TxButtonProps = {
    api,
    setStatus: (status: string | null) => console.log('tx status:', status),
    attrs: {
      palletRpc: 'broker',
      callable: 'purchaseCredit',
      inputParams: [planck, activeAccount?.address],
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

  // console.log(api?.tx.broker.purchaseCredit)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Purchase Credits">
      <div className="flex flex-col p-4 ">
        <p className="font-semibold mb-4">How many DOTs do you want to spend?</p>

        <FormControl sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
          <OutlinedInput
            type="number"
            value={dotAmount}
            onChange={(e) => setDotAmount(parseFloat(e.target.value))}
            startAdornment={<InputAdornment position="start">DOT</InputAdornment>}
            label="Amount"
          />
        </FormControl>

        <div className="flex flex-col items-center justify-center pt-10 ">
          <PrimaryButton
            title="Purchase"
            onClick={transaction}
            disabled={!allParamsFilled() || !dotAmount || dotAmount <= 0}
          />
          <div className="mt-5 text-sm text-gray-16 ">{status}</div>
        </div>
      </div>
    </Modal>
  )
}

export default PurchaseCreditsModal
