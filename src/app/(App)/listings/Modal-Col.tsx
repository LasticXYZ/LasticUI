import React, { ReactNode } from 'react';

// Define the props for the component using an interface
interface ModalColumnsProps {
  children?: ReactNode;
  hint?: ReactNode;
}

// Define the replacement component for Modal.Columns
const ModalColumns: React.FC<ModalColumnsProps> = ({ children, hint }) => {
  return (
    <div className="flex flex-col gap-5 my-5">
      {children && (
        <div className="bg-gray-100 p-5 rounded-lg">
          {children}
        </div>
      )}
      {hint && (
        <div className="bg-gray-100 p-5 rounded-lg">
          {typeof hint === 'string' ? <p>{hint}</p> : hint}
        </div>
      )}
    </div>
  );
};

export default ModalColumns;
