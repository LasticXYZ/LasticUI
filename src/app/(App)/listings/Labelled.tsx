interface LabelledProps {
    label: string;
    labelExtra?: React.ReactNode;
    children: React.ReactNode;
  }
  
  const Labelled: React.FC<LabelledProps> = ({ label, labelExtra, children }) => {
    return (
      <div className="flex flex-col mb-4">
        <div className="flex justify-between">
          <label className="text-sm font-semibold text-gray-700">{label}</label>
          {labelExtra}
        </div>
        {children}
      </div>
    );
  };

  
  export default Labelled;