interface InputAddressMultiProps {
  available: string[]
  label: string
  maxCount: number
  onChange: (items: string[]) => void
  value: string[]
  help?: string
}

const InputAddressMulti: React.FC<InputAddressMultiProps> = ({
  available,
  label,
  maxCount,
  onChange,
  value,
  help,
}) => {
  const handleChange = (selected: string) => {
    if (value.includes(selected)) {
      onChange(value.filter((item) => item !== selected))
    } else if (value.length < maxCount) {
      onChange([...value, selected])
    }
  }

  return (
    <div>
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <div className="flex flex-wrap items-center gap-2">
        {available.map((address, idx) => (
          <button
            key={idx}
            className={`px-2 py-1 text-xs font-medium ${value.includes(address) ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-full`}
            onClick={() => handleChange(address)}
          >
            {address}
          </button>
        ))}
      </div>
      {help && <p className="text-sm text-gray-600 mt-2">{help}</p>}
    </div>
  )
}

export default InputAddressMulti
