import React, { FC } from 'react'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode // <-- Add this line
}

export const WalletModal: FC<WalletModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black dark:opacity-70 opacity-50" onClick={onClose}></div>
      <div className="relative w-96 bg-white dark:bg-gray-22 p-6 rounded-2xl shadow-lg">
        <button className="absolute top-3 right-3" onClick={onClose}>
          X
        </button>
        <h2 className="text-2xl mb-4">Connect Wallet</h2>
        {children}
      </div>
    </div>
  )
}
