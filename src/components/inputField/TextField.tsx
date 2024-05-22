import React, { FC } from 'react'

interface TextFieldProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  inputClassName?: string
}

const TextField: FC<TextFieldProps> = ({ label, value, onChange, className, inputClassName }) => {
  return (
    <div className={`flex flex-row justify-start items-center w-full space-x-4 ${className}`}>
      <label className="text-md font-semibold mb-2">{label}</label>
      <input
        className={`text-lg border w-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded-md p-2 mb-4 focus:ring-blue-500 focus:border-blue-500 ${inputClassName}`}
        type="text"
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default TextField
