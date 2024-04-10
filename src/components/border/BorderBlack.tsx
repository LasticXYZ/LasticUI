const BorderBlack = ({
  children,
  className = '', // Default value is an empty string
}: {
  children: React.ReactNode
  className?: string // `className` prop is optional
}) => {
  return (
    <div className={`border border-gray-16 bg-gray-21 rounded-2xl bg-opacity-60 ${className}`}>
      {children}
    </div>
  )
}

export default BorderBlack
