interface AddressMiniProps {
  value: string
  withSidebar?: boolean
}

const AddressMini: React.FC<AddressMiniProps> = ({ value, withSidebar = true }) => {
  // Assuming use of a utility to shorten addresses; you'll need to implement this based on your needs
  const shortAddress = `${value.substring(0, 6)}…${value.substring(value.length - 4)}`

  return (
    <div className={`flex items-center ${withSidebar ? 'pl-4' : ''}`}>
      {withSidebar && (
        <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center mr-2">
          A
        </div>
      )}{' '}
      {/* Placeholder for an avatar */}
      <span className="text-sm font-medium">{shortAddress}</span>
    </div>
  )
}

export default AddressMini
