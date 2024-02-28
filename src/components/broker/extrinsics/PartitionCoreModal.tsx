'use client'
import PrimaryButton from '@/components/button/PrimaryButton'
import Modal from '@/components/modal/Modal'
import { RegionIdProps } from '@/types/broker'
import { StaticDateTimePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { TxButtonProps, useInkathon, useTxButton } from '@poppyseed/lastic-sdk'
import { FC, useState } from 'react'

/**
 *
 * TODO. Still in progress!
 *
 *
 */

interface PartitionCoreModalProps {
  isOpen: boolean
  onClose: () => void
  regionId: RegionIdProps
}

const PartitionCoreModal: FC<PartitionCoreModalProps> = ({ isOpen, onClose, regionId }) => {
  const { api, activeSigner, activeAccount, activeChain } = useInkathon()
  const [pivot, setPivot] = useState()
  const txButtonProps: TxButtonProps = {
    api, // api is guaranteed to be defined here
    setStatus: (status: string | null) => console.log('tx status:', status),
    attrs: {
      palletRpc: 'broker',
      callable: 'partition',
      inputParams: [regionId, pivot],
      paramFields: [
        { name: 'regionId', type: 'Object', optional: false },
        { name: 'pivot', type: 'string', optional: false }, // unsure if string is correct
      ],
    },
    type: 'SIGNED-TX',
    activeAccount,
    activeSigner,
  }
  const { transaction, status, allParamsFilled } = useTxButton(txButtonProps)

  let timestep = 8

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Split Core ${regionId.core} `}>
      <div className="flex flex-col p-4 ">
        <p className="font-semibold mb-4">Where do you want to split?</p>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <StaticDateTimePicker orientation="landscape" disablePast />
        </LocalizationProvider>

        <div className="flex justify-center pt-10">
          <PrimaryButton title="Split Core" onClick={transaction} disabled={!allParamsFilled()} />
          <div className="mt-5 text-sm text-gray-16 ">{status}</div>
        </div>
      </div>
    </Modal>
  )
}

export default PartitionCoreModal
