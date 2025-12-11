import { FC } from 'react';
import axios from 'axios';
import { Doctor } from '../page';

interface DeleteDoctorModalProps {
  doctorToDelete: Doctor;
  setIsDeletePopupOpen: (isOpen: boolean) => void;
  setDoctorToDelete: (doctor: Doctor | null) => void;
  handleAlert: (message: string, isSuccess: boolean) => void;
  setDoctors: (doctors: Doctor[]) => void;
}

const DeleteDoctorModal: FC<DeleteDoctorModalProps> = ({
  doctorToDelete,
  setIsDeletePopupOpen,
  setDoctorToDelete,
  handleAlert,
  setDoctors,
}) => {
    const handleDelete = async () => {
      try {
        const token = localStorage.getItem("authToken");
        await axios.delete(`http://localhost:8800/api/doctors/${doctorToDelete._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const response = await axios.get("http://localhost:8800/api/doctors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctors(response.data);
        handleAlert("Doctor deleted successfully!", true);
        setIsDeletePopupOpen(false);
        setDoctorToDelete(null);
      } catch (error) {
        console.error("Error deleting doctor:", error);
        handleAlert("Error deleting doctor. Please try again.", false);
      }
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Confirm Delete</h2>
          <p className="mb-4 text-center">Are you sure you want to remove this doctor?</p>
          <div className="flex justify-end space-x-2">
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              onClick={() => setIsDeletePopupOpen(false)}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default DeleteDoctorModal;
  