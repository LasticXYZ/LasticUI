import { Dialog } from '@headlessui/react'
import { FC, ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children?: ReactNode
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" open={isOpen} onClose={onClose}>
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay, show behind modal */}
        <Dialog.Overlay className="fixed inset-0 bg-black dark:bg-gray-20 dark:text-white opacity-30" />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white text-black dark:bg-gray-21 dark:text-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button type="button" className="" onClick={onClose}>
              <span className="sr-only">Close</span>X
            </button>
          </div>

          <Dialog.Title
            as="h2"
            className="text-2xl mb-4 dark:text-white font-unbounded uppercase font-bold"
          >
            {title}
          </Dialog.Title>

          <div className="mt-2">{children}</div>
        </div>
      </div>
    </Dialog>
  )
}

export default Modal
