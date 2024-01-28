import PrimaryButton from '@/components/button/PrimaryButton';
import Modal from '@/components/modal/Modal';
import { truncateHash } from '@/utils/truncateHash';
import { encodeAddress } from '@polkadot/util-crypto';
import { TxButtonProps, useInkathon, useTxButton } from '@poppyseed/lastic-sdk';
import { FC, useState } from 'react';


interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  coreNb: string;
  mask: string;
  begin: string;
} 

const TransferModal: FC<TransferModalProps> = ({ 
    isOpen,
    onClose,
    coreNb,
    begin,
    mask,
}) => {

  const { api, activeSigner, activeAccount, activeChain } = useInkathon()
  const [newOwner, setNewOwner] = useState('');

  const txButtonProps: TxButtonProps = {
    api, // api is guaranteed to be defined here
    setStatus: (status: string | null) => console.log('tx status:', status),
    attrs: {
      palletRpc: 'broker',
      callable: 'transfer',
      inputParams: [{ begin, coreNb, mask }, newOwner],
      paramFields: [
        { name: 'regionId', type: 'Object', optional: false },
        { name: 'newOwner', type: 'String', optional: false },
      ],
    },
    type: 'SIGNED-TX',
    activeAccount,
    activeSigner,
  }

  const { transaction, status, allParamsFilled } = useTxButton(txButtonProps)


  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Transfer Core Nb: ${coreNb} To Another Account`}>
        <div className="flex flex-col">
            <div className="flex flex-row">
                <div className="flex flex-col">
                <p className="text-lg">Transfer Core Nb: {coreNb}</p>
                <p className="text-lg">From: {activeAccount ? truncateHash(encodeAddress(activeAccount.address, activeChain?.ss58Prefix || 42), 8) :  'error'}</p>
                <label className="text-lg">To: </label>
                <label className="text-lg">To: </label>
                <input 
                  className="text-lg" 
                  type="text" 
                  value={newOwner} 
                  onChange={(e) => setNewOwner(e.target.value)}
                />
                <p className="text-lg">Region Begin: {begin}</p>
                <p className='text-md'>Core Mask: {mask}</p>
                </div>
            </div>
            <div className="flex justify-center pt-5">
                <PrimaryButton title="buy core" onClick={transaction} disabled={!allParamsFilled()} />
                <div className="mt-5" style={{ overflowWrap: 'break-word' }}>
                    {status}
                </div>            
                </div>
        </div>
    </Modal>
  );
};

export default TransferModal; 