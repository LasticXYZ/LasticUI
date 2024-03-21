interface InputFileProps {
    label: string;
    onChange: (file: File | null) => void;
    isError?: boolean;
  }
  
  const InputFile: React.FC<InputFileProps> = ({ label, accept, onChange, isError }) => (
    <div>
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <input
        className={`shadow appearance-none border ${isError ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
        type="file"
        accept='application/json'
        onChange={e => onChange(e.target.files ? e.target.files[0] : null)}
      />
      {isError && <p className="text-red-500 text-xs italic">Error message here.</p>}
    </div>
  );
  

  export default InputFile;