import PrimaryButton from '@/components/button/PrimaryButton'
import Modal from '@/components/modal/Modal'
import { CoreListing, networks, useListings } from '@/hooks/useListings'
import { RegionIdProps } from '@/types/broker'
import { Alert } from '@mui/material'
import { useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import { FC, useState } from 'react'

interface ListingsModalProps {
  isOpen: boolean
  onClose: () => void
  regionId: RegionIdProps
}

const ListingsModal: FC<ListingsModalProps> = ({ isOpen, onClose, regionId }) => {
  const { activeAccount, activeChain } = useInkathon()
  const [cost, setCost] = useState('')
  let { tokenSymbol, tokenDecimals } = useBalance(activeAccount?.address, true)

  const { statusMessage, addListing } = useListings()

  const listCoreForSale = async () => {
    if (!activeAccount) return

    const network = activeChain?.name as networks

    // get core end

    const coreData: CoreListing = {
      id: Date.now(), // Temporary unique ID, replace as needed

      coreNumber: Number(regionId.core),
      mask: regionId.mask,
      begin: regionId.begin.replace(/,/g, ''),

      cost: (parseFloat(cost) * 10 ** tokenDecimals).toString(),
      sellerAddress: activeAccount.address,
      network,
      status: 'listed',
      timestamp: new Date().toISOString(),
    }

    addListing(coreData).then(() => {
      setTimeout(() => {
        onClose()
      }, 3000)
    })
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`List Core Nb: ${regionId.core}`}>
      <div className="flex flex-col p-4">
        <div className="flex flex-col mb-4">
          <label htmlFor="newOwner" className="text-lg mb-2">
            For the price of:
          </label>

          <div className="flex flex-row items-center w-full">
            <input
              id="newOwner"
              className="text-lg border border-gray-300 w-full rounded-md p-2 mb-4 focus:ring-blue-500 focus:border-blue-500"
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
            <div className="ml-3 text-lg">{tokenSymbol}</div>
          </div>

          <Alert severity="warning">
            This feature is currently in Beta. Proceed at your own risk.
          </Alert>

          <div className="flex justify-center pt-5">
            <PrimaryButton
              title="List Core for Sale"
              onClick={listCoreForSale}
              disabled={!cost || !activeAccount || parseFloat(cost) < 0}
            />
          </div>
          <div className="self-center pt-5">{statusMessage}</div>
        </div>
      </div>
    </Modal>
  )
}

export default ListingsModal
