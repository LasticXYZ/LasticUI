'use client'
import BoxesContainer from '@/components/activityBoxes/BoxesContainer'
import PrimaryButton from '@/components/button/PrimaryButton'
import Modal from '@/components/modal/Modal'
import { RegionIdProps } from '@/types/broker'
import { TxButtonProps, useInkathon, useTxButton } from '@poppyseed/lastic-sdk'
import { FC, useState } from 'react'
import {
  CoreMask,
  generateHexStringFromBooleans,
  getCoreMaskFromBits,
} from '../../../utils/common/commonFuncs'

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
  const [selectedMask, setSelectedMask] = useState<CoreMask | undefined>(undefined)
  const [hexCoreMask, setHexCoreMask] = useState<string | undefined>('0x00000000000000000000')

  const txButtonProps: TxButtonProps = {
    api,
    setStatus: (status: string | null) => console.log('tx status:', status),
    attrs: {
      palletRpc: 'broker',
      callable: 'interlace',
      inputParams: [regionId, selectedMask],
      paramFields: [
        { name: 'region_id', type: 'Object', optional: false },
        { name: 'pivot', type: 'CoreMask', optional: false },
      ],
    },
    type: 'SIGNED-TX',
    activeAccount,
    activeSigner,
  }

  const { transaction, status, allParamsFilled } = useTxButton(txButtonProps)

  const updateMask = (bits: Array<boolean>) => {
    const mask = getCoreMaskFromBits(bits)
    setSelectedMask(mask)
    const hexCoreMask = generateHexStringFromBooleans(bits)
    setHexCoreMask('0x'+ hexCoreMask)
    console.log(hexCoreMask)
    console.log(mask)
  }

  // TODO: take the start time from core
  const startTime = new Date('2023-01-01T01:00:00')
  const endTime = new Date('2023-01-01T11:40:00')
  // Size of each SquareBox
  const size: [number, number] = [40, 40]

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Create mask for Core NB: ${regionId.core} `}>
      <div className="flex flex-col p-4">
        <BoxesContainer
          startTime={startTime}
          endTime={endTime}
          size={size}
          onMaskUpdate={updateMask}
        />
        <div className="flex flex-col mb-4 mt-4">
          <p className="text-lg mb-2">Region Begin: {regionId.begin}</p>
          <p className="text-md">Current Core Mask: {regionId.mask}</p>
          <p className="text-md">New Core Mask: {hexCoreMask}</p>
        </div>
        <div className="flex justify-center pt-5">
          <PrimaryButton
            title="Interlace Core"
            onClick={transaction}
            disabled={!allParamsFilled()}
          />
          <div className="mt-5 text-sm text-gray-16 ">{status}</div>
        </div>
      </div>
    </Modal>
  )
}

export default InterlaceCoreModal
