import React, { FC, useState } from 'react'

interface InputFileProps {
  label: string
  icon: React.ReactNode
  onChange: (data: Uint8Array) => void
  onCancel: () => void
}

const InputFile: FC<InputFileProps> = ({ label, icon, onChange, onCancel }) => {
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const arrayBuffer = await file.arrayBuffer()
      onChange(new Uint8Array(arrayBuffer))
      setFileName(file.name)
    }
  }

  const handleCancel = () => {
    onCancel()
    setFileName(null)
  }

  return (
    <div className="input-file-wrappe flex items-center justify-between space-x-2 p-2 border rounded-lg bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
      <label className="input-file-label px-2 flex items-center space-x-2 cursor-pointer">
        <span className="icon h-5 w-5 text-gray-800 dark:text-gray-500">{icon}</span>
        <span>{label}</span>
        <input type="file" onChange={handleFileChange} className="hidden" />
      </label>
      {fileName && (
        <span className="file-name text-sm text-gray-500 dark:text-gray-300">{fileName}</span>
      )}
      <button onClick={handleCancel} className="px-2 cancel-button text-red-500 hover:text-red-700">
        Cancel
      </button>
    </div>
  )
}

export default InputFile
