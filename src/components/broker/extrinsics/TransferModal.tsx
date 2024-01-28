import PrimaryButton from '@/components/button/PrimaryButton';
import SecondaryButton from '@/components/button/SecondaryButton';
import Modal from '@/components/modal/Modal';
import { FC } from 'react';

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
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Transfer Core To Another Account'>
        <div className="flex flex-col">
            <div className="flex flex-row">
                <div className="flex flex-col">
                <p className="text-lg">From:</p>
                <p className="text-lg">To:</p>
                <p className="text-lg">Core Nb: {coreNb}</p>
                <p className="text-lg">Region Begin: {begin}</p>
                <p className='text-md'>Core Mask: {mask}</p>
                </div>
                <div className="flex flex-col">
                <p className="text-lg">0x1234567890</p>
                <p className="text-lg">0x1234567890</p>
                <p className="text-lg">1000</p>
                </div>
            </div>
            <div className="flex flex-row">
                <PrimaryButton title="Confirm" />
                <SecondaryButton title="Cancel" />
            </div>
        </div>
    </Modal>
  );
};

export default TransferModal; 