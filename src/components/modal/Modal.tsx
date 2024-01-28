import { FC, ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string; // Add title prop for custom modal titles
  children?: ReactNode; // This line is already perfect for children content
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative w-96 bg-white p-10 overflow-hidden rounded shadow-lg">
        <button className="absolute top-3 right-3" onClick={onClose}>
          X
        </button>
        <h2 className="text-xl mb-4 font-syncopate font-bold">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;
