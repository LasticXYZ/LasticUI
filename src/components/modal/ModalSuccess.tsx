const ModalSuccess = (
    { isVisible, message, onClose } : 
    { isVisible: boolean, message: string, onClose: () => void }
    ) => {
    if (!isVisible) return null;
  
    return (
      <div className="fixed max-w-screen-sm font-montserrat top-5 right-5 bg-green-6 p-4 rounded-lg shadow-lg">
        <div className="pr-5">
          <p>{message}</p>
        </div>
        <button onClick={onClose} className="absolute top-0 right-0 p-3">X</button>
      </div>
    );
  };
  

export default ModalSuccess;