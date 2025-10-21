import { useState } from 'react'
import toast from 'react-hot-toast'

interface AddressMiniProps {
  value: string
  withSidebar?: boolean
}

const AddressMini: React.FC<AddressMiniProps> = ({ value, withSidebar = true }) => {
  const [copied, setCopied] = useState(false)
  // Assuming use of a utility to shorten addresses; you'll need to implement this based on your needs
  const shortAddress = `${value.substring(0, 6)}…${value.substring(value.length - 4)}`

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      toast.success('Address copied to clipboard!')

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      toast.error('Failed to copy address')
      console.error('Failed to copy address:', err)
    }
  }

  return (
    <div className={`flex items-center ${withSidebar ? 'pl-4' : ''}`}>
      {withSidebar && (
        <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center mr-2">
          A
        </div>
      )}{' '}
      {/* Placeholder for an avatar */}
      <span
        className={`text-sm font-medium cursor-pointer hover:text-blue-500 transition-colors ${copied ? 'text-green-500' : ''}`}
        onClick={handleCopyAddress}
        title="Click to copy full address"
      >
        {shortAddress}
      </span>
    </div>
  )
}

export default AddressMini
