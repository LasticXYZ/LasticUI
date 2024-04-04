import React, { FC } from 'react'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode // <-- Add this line
}

export const WalletModal: FC<WalletModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50 overflow-scroll">
      <div
        className="absolute inset-0 bg-black opacity-50"
        style={{ height: '1000vh' }}
        onClick={onClose}
      ></div>
      <div className="relative w-96 bg-white p-6 rounded shadow-lg">
        <button className="absolute top-3 right-3" onClick={onClose}>
          X
        </button>
        <h2 className="text-2xl mb-4">Connect Wallet</h2>
        {children}
      </div>
    </div>
  )
}
