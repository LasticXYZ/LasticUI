import PrimaryButton from '@/components/button/PrimaryButton'
import Modal from '@/components/modal/Modal'
import { CoreListing, networks, useListings } from '@/hooks/useListings'
import { RegionIdProps } from '@/types/broker'
import { Alert } from '@mui/material'
import { useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import { FC, useState } from 'react'

const LASTIC_ADDRESS = process.env.NEXT_PUBLIC_LASTIC_ADDRESS

interface ListingsModalProps {
  isOpen: boolean
  onClose: () => void
  regionId: RegionIdProps
}

const ListingsModal: FC<ListingsModalProps> = ({ isOpen, onClose, regionId }) => {
  const { activeAccount, activeChain } = useInkathon()
  const [cost, setCost] = useState('')
  let { tokenSymbol, tokenDecimals } = useBalance(activeAccount?.address, true)
  const { statusMessage, addListing, isLoading } = useListings()
  const [buttonDisabled, setButtonDisabled] = useState(false)

  const listCoreForSale = async () => {
    try {
      if (!activeAccount) return
      setButtonDisabled(true)

      const network = activeChain?.name as networks

      const coreData: Omit<CoreListing, 'id'> = {
        coreNumber: Number(regionId.core),
        mask: regionId.mask,
        begin: regionId.begin.replace(/,/g, ''),

        cost: (parseFloat(cost) * 10 ** tokenDecimals).toString(),
        sellerAddress: activeAccount.address,
        network,
        status: 'listed',
      }

      addListing(coreData).then((res) => {
        if (res) {
          setTimeout(() => {
            onClose()
            setButtonDisabled(false)
          }, 3000)
        } else setButtonDisabled(false)
      })
    } catch {
      setButtonDisabled(false)
    }
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`List Core Nb: ${regionId.core}`}>
      <div className="flex flex-col p-4">
        <div className="flex flex-col mb-4">
          <Alert severity="warning">
            This feature is currently a Proof of Concept. Proceed at your own risk and double check
            every tx.
          </Alert>

          <label htmlFor="newOwner" className="text-lg mb-2 mt-5">
            List for the price of:
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

          <div className="flex justify-center pt-5">
            <PrimaryButton
              title="List Core for Sale"
              onClick={listCoreForSale}
              disabled={
                !cost || !activeAccount || parseFloat(cost) < 0 || buttonDisabled || isLoading
              }
            />
          </div>
          <div className="self-center pt-5">{statusMessage}</div>
        </div>
      </div>
    </Modal>
  )
}

export default ListingsModal
