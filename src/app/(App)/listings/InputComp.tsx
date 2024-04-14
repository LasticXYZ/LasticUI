interface InputProps {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  isError?: boolean
  autoFocus?: boolean
}

const InputComp: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  isError,
  autoFocus,
}) => (
  <div>
    <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
    <input
      className={`shadow appearance-none border ${isError ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoFocus={autoFocus}
    />
    {isError && <p className="text-red-500 text-xs italic">Error message here.</p>}
  </div>
)

export default InputComp
