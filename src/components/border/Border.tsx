const Border = ({
  children,
  className = '', // Default value is an empty string
}: {
  children: React.ReactNode
  className?: string // `className` prop is optional
}) => {
  return (
    <div className={`border border-gray-9 bg-[#F6FDFF] rounded-2xl bg-opacity-60 ${className}`}>
      {children}
    </div>
  )
}

export default Border
