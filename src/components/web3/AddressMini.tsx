import { useState } from 'react'

interface AddressMiniProps {
  value: string
  withSidebar?: boolean
}

const AddressMini: React.FC<AddressMiniProps> = ({ value, withSidebar = true }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Fallback for older environments
      const textarea = document.createElement('textarea')
      textarea.value = value
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const shortAddress = `${value.substring(0, 6)}...${value.substring(value.length - 4)}`

  return (
    <div
      className={`flex items-center ${withSidebar ? 'pl-4' : ''}`}
      onClick={handleCopy}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleCopy() }}
      title="Click to copy full address"
    >
      {withSidebar && (
        <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center mr-2">
          A
        </div>
      )}
      <span
        className={`text-sm font-medium cursor-pointer hover:text-blue-500 transition-colors ${
          copied ? 'text-green-500' : ''
        }`}
      >
        {copied ? 'Copied!' : shortAddress}
      </span>
    </div>
  )
}

export default AddressMini
