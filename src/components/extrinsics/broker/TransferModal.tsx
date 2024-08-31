import PrimaryButton from '@/components/button/PrimaryButton'
import Modal from '@/components/modal/Modal'
import useTransferExtrinsic from '@/hooks/substrate/extrinsics' // Adjust the import path as needed
import { RegionIdProps } from '@/types/broker'
import { FC } from 'react'

interface TransferModalProps {
  isOpen: boolean
  onClose: () => void
  regionId: RegionIdProps
}

const TransferModal: FC<TransferModalProps> = ({ isOpen, onClose, regionId }) => {
  const { newOwner, handleNewOwnerChange, transaction, allParamsFilled, fromAddress } =
    useTransferExtrinsic({ regionId })

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Transfer Core Nb: ${regionId.core} To Another Account`}
    >
      <div className="flex flex-col p-4">
        <div className="flex flex-col mb-4">
          <p className="text-lg font-semibold mb-2">Transfer Core Nb: {regionId.core}</p>
          <p className="text-lg mb-2">From: {fromAddress}</p>
          <label htmlFor="newOwner" className="text-lg font-semibold mb-2">
            To:
          </label>
          <input
            id="newOwner"
            className="text-lg border rounded-md p-2 mb-4 focus:ring-blue-500 focus:border-blue-500"
            type="text"
            value={newOwner}
            onChange={handleNewOwnerChange}
          />
          <p className="text-lg mb-2">Region Begin: {regionId.begin}</p>
          <p className="text-md">Core Mask: {regionId.mask}</p>
        </div>
        <div className="flex justify-center pt-5">
          <PrimaryButton
            title="Transfer Core"
            onClick={transaction}
            disabled={!allParamsFilled()}
          />
          {/* <div className="mt-5 text-sm text-gray-16 ">{status}</div> */}
        </div>
      </div>
    </Modal>
  )
}

export default TransferModal
