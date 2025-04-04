// app/_components/Modal.js
import React from "react";

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-md">
        <button onClick={onClose} className="absolute top-2 right-2">X</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
