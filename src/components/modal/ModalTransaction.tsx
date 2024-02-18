// TransactionPopup.jsx
const ModalTranasaction = (
    { isVisible, message }:
    { isVisible: boolean, message: string }
    ) => {
    if (!isVisible) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <p>{message}</p>
        </div>
      </div>
    );
  };
  
export default ModalTranasaction;