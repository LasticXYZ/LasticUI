'use client'
import BoxesContainer from '@/components/activityBoxes/BoxesContainer'
import PrimaryButton from '@/components/button/PrimaryButton'
import Modal from '@/components/modal/Modal'
import { RegionIdProps } from '@/types/broker'
import { TxButtonProps, useInkathon, useTxButton } from '@poppyseed/lastic-sdk'
import { FC, useState } from 'react'

/**
 *
 * TODO.
 *
 *
 */

interface InterlaceCoreModalProps {
  isOpen: boolean
  onClose: () => void
  regionId: RegionIdProps
}

const InterlaceCoreModal: FC<InterlaceCoreModalProps> = ({ isOpen, onClose, regionId }) => {
  const { api, activeSigner, activeAccount, activeChain } = useInkathon()
  const [task, setTask] = useState(0)
  const [finality, setFinality] = useState('Provisional')

  const txButtonProps: TxButtonProps = {
    api, 
    setStatus: (status: string | null) => console.log('tx status:', status),
    attrs: {
      palletRpc: 'broker',
      callable: 'interlace',
      inputParams: [regionId, task, finality],
      paramFields: [
        { name: 'regionId', type: 'Object', optional: false },
        { name: 'task', type: 'Number', optional: false },
        { name: 'finality', type: 'String', optional: false },
      ],
    },
    type: 'SIGNED-TX',
    activeAccount,
    activeSigner,
  }

  const { transaction, status, allParamsFilled } = useTxButton(txButtonProps)

  if (!isOpen) return null

  const startTime = new Date('2023-01-01T01:00:00')
  const endTime = new Date('2023-01-01T11:40:00')
  const size: [number, number] = [40, 40] // Size of each SquareBox

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Create mask for Core NB: ${regionId.core} `}>
      <div className="flex flex-col p-4">
        <BoxesContainer startTime={startTime} endTime={endTime} size={size} />
        <div className="flex flex-col mb-4">
          <p className="text-lg mb-2">Region Begin: {regionId.begin}</p>
          <p className="text-md">Current Core Mask: {regionId.mask}</p>
        </div>
        <div className="flex justify-center pt-5">
          <PrimaryButton title="Assign Core" onClick={transaction} disabled={!allParamsFilled()} />
          <div className="mt-5 text-sm text-gray-16 ">{status}</div>
        </div>
      </div>
    </Modal>
  )
}

export default InterlaceCoreModal
