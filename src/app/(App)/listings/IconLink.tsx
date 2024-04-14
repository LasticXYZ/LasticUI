interface IconLinkProps {
  label: string
  onClick: () => void
  icon: string // You can change this to your specific icon type or component if needed.
}

const IconLink: React.FC<IconLinkProps> = ({ label, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 text-blue-500 hover:text-blue-700"
    >
      {/* Replace this with your actual icon component or implementation */}
      <span className="material-icons">{icon}</span>
      <span>{label}</span>
    </button>
  )
}

export default IconLink
