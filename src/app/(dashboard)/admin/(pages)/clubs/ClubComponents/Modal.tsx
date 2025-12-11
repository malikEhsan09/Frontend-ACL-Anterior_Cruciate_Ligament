// components/Modal.js
"use client";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#333] bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
        <div>{children}</div>
        <div className="flex justify-end mt-4">
          <button
            className="bg-lightBlue text-white py-2 px-4 rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
