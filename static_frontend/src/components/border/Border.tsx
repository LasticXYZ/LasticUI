const Border = ({
    children 
   } : {
       children: React.ReactNode
   }) => {    
    return (
        <div className="border border-gray-9 bg-white rounded-2xl bg-opacity-60">
            { children }
        </div>
    );
};

export default Border;