interface InputNumberProps {
    label: string;
    value: number | string;
    onChange: (value: number) => void;
    isError?: boolean;
  }
  
  const InputNumber: React.FC<InputNumberProps> = ({ label, value, onChange, isError }) => (
    <div>
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <input
        className={`shadow appearance-none border ${isError ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
      {isError && <p className="text-red-500 text-xs italic">Error message here.</p>}
    </div>
  );
  
  export default InputNumber;