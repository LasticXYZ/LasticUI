interface ToggleProps {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
  }
  
  const ToggleComp: React.FC<ToggleProps> = ({ label, value, onChange }) => (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input type="checkbox" className="hidden" checked={value} onChange={e => onChange(e.target.checked)} />
        <div className="toggle-path bg-gray-200 w-9 h-5 rounded-full shadow-inner"></div>
        <div className={`toggle-circle absolute w-5 h-5 bg-white rounded-full shadow inset-y-0 left-0 ${value ? 'translate-x-full bg-blue-500' : 'translate-x-0 bg-gray-300'}`}></div>
      </div>
      <div className="ml-3 text-gray-700 font-medium">{label}</div>
    </label>
  );

  export default ToggleComp;


  