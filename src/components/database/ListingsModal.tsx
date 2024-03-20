import PrimaryButton from '@/components/button/PrimaryButton'
import Modal from '@/components/modal/Modal'
import { RegionIdProps } from '@/types/broker'
import { truncateHash } from '@/utils/truncateHash'
import { encodeAddress } from '@polkadot/util-crypto'
import { useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import { FC, useState } from 'react'

interface Core {
    id: number;
    coreNumber: string;
    size: number;
    cost: number;
    reward: number;
    owner: string;
    currencyCost: string;
    currencyReward: string;
    mask: string;
    begin: string;
    end: string;
  }

interface Database {
    listings: Core[];
}

interface ListingsModalProps {
  isOpen: boolean
  onClose: () => void
  regionId: RegionIdProps
}

const ListingsModal: FC<ListingsModalProps> = ({ isOpen, onClose, regionId }) => {
  const {activeAccount, activeChain } = useInkathon()
  const [newOwner, setNewOwner] = useState('')
  let { tokenSymbol } = useBalance(activeAccount?.address, true)

  const listCoreForSale = async () => {
    const coreData: Core = {
      id: Date.now(), // Temporary unique ID, replace as needed
      coreNumber: regionId.core,
      size: 1, // Update this as per your logic
      cost: parseInt(newOwner), // Assuming newOwner is holding the cost
      reward: 0, // Update this as per your logic
      owner: activeAccount ? activeAccount.address : '',
      currencyCost: tokenSymbol,
      currencyReward: '', // Update this as per your logic
      mask: regionId.mask,
      begin: regionId.begin,
      end: '', // Update this as per your logic
    };

    try {
      const response = await fetch('/api/updateDatabase', { // Use your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listing: coreData }),
      });
      
      if (!response.ok) throw new Error('Failed to update database');
      alert('Core listed for sale successfully'); // Replace with more user-friendly feedback
    } catch (error) {
      console.error('Error listing core for sale:', error);
      alert('Error listing core for sale'); // Replace with more user-friendly feedback
    }
  };


  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`List Core Nb: ${regionId.core}`}
    >
      <div className="flex flex-col p-4">
        <div className="flex flex-col mb-4">
          <p className="text-lg font-semibold mb-2">List the Core Number {regionId.core}</p>
        <label htmlFor="newOwner" className="text-lg mb-2">
            For the Price of:
        </label>
          <div className='flex flex-row items-center w-full'>
            <input
                id="newOwner"
                className="text-lg border border-gray-300 w-full rounded-md p-2 mb-4 focus:ring-blue-500 focus:border-blue-500"
                type="number"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
            />
            <div className='ml-3 text-lg'>{tokenSymbol}</div>
          </div>
          <p className="text-lg mb-2">
            From:{' '}
            {activeAccount
              ? truncateHash(encodeAddress(activeAccount.address, activeChain?.ss58Prefix || 42), 8)
              : 'error'}
          </p>
          <p className="text-lg mb-2">Region Begin: {regionId.begin}</p>
          <p className="text-lg mb-2">Core Mask: {regionId.mask}</p>
          <div className='bg-red-4 p-4 border'> Danger! This feature is not yet production ready and prone to attacks! Interact at your own risk!</div>


          <div className="flex justify-center pt-5">
          <PrimaryButton
            title="List Core for Sale"
            onClick={listCoreForSale} 
          />
        </div>
        </div>
      </div>
    </Modal>
  )
}

export default ListingsModal
