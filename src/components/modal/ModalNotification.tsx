import { useEffect } from 'react'

interface ModalNotificationProps {
  type: keyof typeof notificationTypes
  isVisible: boolean
  message: string
  onClose: () => void
}

export const notificationTypes = {
  success: 'bg-green-6',
  info: 'bg-teal-3',
  danger: 'bg-red-6',
  warn: 'bg-yellow-2',
}

const ModalNotification: React.FC<ModalNotificationProps> = ({
  type,
  isVisible,
  message,
  onClose,
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isVisible) {
      timer = setTimeout(onClose, 5000) // Set timeout for 5 seconds
    }
    return () => clearTimeout(timer)
  }, [isVisible, onClose])

  const bgColor: string = notificationTypes[type]

  if (!isVisible) return null

  return (
    <div
      className={`${bgColor} fixed max-w-screen-sm font-montserrat top-5 right-5  p-4 rounded-2xl shadow-lg`}
    >
      <div className="pr-5">
        <p>{message}</p>
      </div>
      <button onClick={onClose} className="absolute top-0 right-0 p-3">
        X
      </button>
    </div>
  )
}

export default ModalNotification
