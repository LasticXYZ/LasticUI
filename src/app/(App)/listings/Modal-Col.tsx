import React, { ReactNode } from 'react'

// Define the props for the component using an interface
interface ModalColumnsProps {
  children?: ReactNode
  hint?: ReactNode
}

// Define the replacement component for Modal.Columns
const ModalColumns: React.FC<ModalColumnsProps> = ({ children, hint }) => {
  return (
    <div className="flex flex-col">
      {children && <div className="bg-gray-2 dark:bg-gray-19 p-5 rounded-lg">{children}</div>}
      {hint && (
        <div className="bg-gray-1 dark:bg-gray-18  my-1 p-2 rounded-lg">
          {typeof hint === 'string' ? <p>{hint}</p> : hint}
        </div>
      )}
    </div>
  )
}

export default ModalColumns
