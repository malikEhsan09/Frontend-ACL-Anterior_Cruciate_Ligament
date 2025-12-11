import axios from 'axios';
import { Doctor } from '../page';

interface NewDoctor {
  name: string;
  speciality: string;
  designation: string;
  degree: string;
  experience: string;
  location: string;
  profileImage: File | null;
}

interface AddEditDoctorModalProps {
  editingDoctor: Doctor | null;
  newDoctor: NewDoctor;
  setEditingDoctor: (doctor: Doctor | null) => void;
  setNewDoctor: (doctor: NewDoctor) => void;
  setDoctors: (doctors: Doctor[]) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  handleAlert: (message: string, success: boolean) => void;
}

const AddEditDoctorModal = ({
    editingDoctor,
    newDoctor,
    setEditingDoctor,
    setNewDoctor,
    setDoctors,
    setIsModalOpen,
    handleAlert,
  }: AddEditDoctorModalProps) => {
    interface FormDataDoctor extends Omit<Doctor, 'profileImage'> {
        profileImage: File | null;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const adminId = localStorage.getItem("userId");
        const formData = new FormData();
        
        // Convert editingDoctor or newDoctor to FormDataDoctor format
        const doctorData: FormDataDoctor = editingDoctor 
            ? {
                ...editingDoctor,
                profileImage: editingDoctor.profileImage instanceof File 
                    ? editingDoctor.profileImage 
                    : null
              }
            : newDoctor;

        (Object.keys(doctorData) as (keyof FormDataDoctor)[]).forEach((key) => {
            if (doctorData[key] != null && key !== '_id' && key !== 'createdAt' && key !== 'viewCount' && key !== 'rating') {
                const value = doctorData[key];
                if (value instanceof File) {
                    formData.append(key, value);
                } else if (typeof value === 'string') {
                    formData.append(key, value);
                }
            }
        });
        formData.append("createdBy", adminId || "");

        try {
            const token = localStorage.getItem("authToken");
            const endpoint = editingDoctor
                ? `http://localhost:8800/api/doctors/${editingDoctor._id}`
                : "http://localhost:8800/api/doctors/submit";
            const method: 'patch' | 'post' = editingDoctor ? "patch" : "post";

            await axios[method](endpoint, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            const response = await axios.get("http://localhost:8800/api/doctors", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDoctors(response.data);
            handleAlert(
                editingDoctor ? "Doctor updated successfully!" : "Doctor added successfully!",
                true
            );
            setIsModalOpen(false);
            setEditingDoctor(null);
            setNewDoctor({
                name: "",
                speciality: "",
                designation: "",
                degree: "",
                experience: "",
                location: "",
                profileImage: null,
            });
        } catch (error) {
            console.error("Error submitting doctor:", error);
            handleAlert("Error submitting doctor. Please try again.", false);
        }
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {editingDoctor ? "Edit Doctor Information" : "Add New Doctor"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {(["name", "speciality", "designation", "degree", "experience", "location"] as const).map((field) => (
                <div key={field}>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    type="text"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={editingDoctor 
                      ? (typeof editingDoctor[field] === 'string' ? editingDoctor[field] : '') 
                      : newDoctor[field] || ''}
                    onChange={(e) =>
                      editingDoctor
                        ? setEditingDoctor({ ...editingDoctor, [field]: e.target.value })
                        : setNewDoctor({ ...newDoctor, [field]: e.target.value })
                    }
                    required
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Profile Image</label>
              <input
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                type="file"
                onChange={(e) =>
                  editingDoctor
                    ? setEditingDoctor({ ...editingDoctor, profileImage: e.target.files ? e.target.files[0] : null })
                    : setNewDoctor({ ...newDoctor, profileImage: e.target.files ? e.target.files[0] : null })
                }
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingDoctor(null);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary text-white py-2 px-4 rounded hover:bg-primary/90"
              >
                {editingDoctor ? "Update Doctor" : "Add Doctor"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default AddEditDoctorModal;
  