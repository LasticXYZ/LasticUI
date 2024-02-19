import { useEffect } from 'react';

interface ModalNotificationProps {
  type: keyof typeof notificationTypes;
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

export const notificationTypes = {
  success: 'success',
  info: 'info',
  danger: 'danger',
  warn: 'warning',
}

const ModalNotification: React.FC<ModalNotificationProps> = (
  { 
    isVisible, 
    message, 
    onClose 
  }) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVisible) {
      timer = setTimeout(onClose, 5000); // Set timeout for 5 seconds
    }
    return () => clearTimeout(timer); // Clear timeout on component unmount or if isVisible changes
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed max-w-screen-sm font-montserrat top-5 right-5 bg-red-6 p-4 rounded-lg shadow-lg">
      <div className="pr-5">
        <p>{message}</p>
      </div>
      <button onClick={onClose} className="absolute top-0 right-0 p-3">X</button>
    </div>
  );
};

export default ModalNotification;
