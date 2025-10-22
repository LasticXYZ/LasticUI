import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

interface AddressMiniProps {
  value: string
  withSidebar?: boolean
}

const AddressMini: React.FC<AddressMiniProps> = ({ value, withSidebar = true }) => {
  const [copied, setCopied] = useState(false)
  const shortAddress = `${value.substring(0, 6)}…${value.substring(value.length - 4)}`

  const handleCopyAddress = async () => {
    // Fix 1: Check clipboard API availability
    if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
      toast.error('Clipboard API not available in this browser or context.')
      return
    }

    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      toast.success('Address copied to clipboard!')

      // Fix 2: Cleanup setTimeout properly
      const timeoutId = setTimeout(() => {
        setCopied(false)
      }, 2000)

      return () => clearTimeout(timeoutId)
    } catch (err) {
      toast.error('Failed to copy address')
      console.error('Failed to copy address:', err)
    }
  }

  // Fix 2 continued: Cleanup on unmount
  useEffect(() => {
    return () => {
      setCopied(false)
    }
  }, [])

  return (
    <div className={`flex items-center ${withSidebar ? 'pl-4' : ''}`}>
      {withSidebar && (
        <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center mr-2">
          A
        </div>
      )}
      {/* Fix 3: Use button for accessibility */}
      <button
        type="button"
        className={`text-sm font-medium cursor-pointer hover:text-blue-500 transition-colors ${copied ? 'text-green-500' : ''}`}
        onClick={handleCopyAddress}
        title="Click to copy full address"
        style={{ background: 'none', border: 'none', padding: 0, font: 'inherit' }}
      >
        {shortAddress}
      </button>
    </div>
  )
}

export default AddressMini
