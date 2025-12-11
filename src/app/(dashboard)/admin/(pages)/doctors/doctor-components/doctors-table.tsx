import { Eye, Trash, Edit3 } from "lucide-react";
import Image from "next/image";
import { Doctor } from "../page";

interface DoctorsTableProps {
  currentData: Doctor[];
  setViewingDoctor: (doctor: Doctor) => void;
  setIsViewModalOpen: (isOpen: boolean) => void;
  setDoctorToDelete: (doctor: Doctor) => void;
  setIsDeletePopupOpen: (isOpen: boolean) => void;
  setEditingDoctor: (doctor: Doctor) => void;
  setIsModalOpen: (isOpen: boolean) => void;
}

const DoctorsTable: React.FC<DoctorsTableProps> = ({
  currentData,
  setViewingDoctor,
  setIsViewModalOpen,
  setDoctorToDelete,
  setIsDeletePopupOpen,
  setEditingDoctor,
  setIsModalOpen,
}) => (
  <table className="min-w-full bg-white border border-gray-200 rounded-md mt-[-1rem]">
    <thead className="bg-gray-50">
      <tr>
        {["ID", "Profile Image", "Name", "Speciality", "Location", "Views", "Rating", "Action"].map((header) => (
          <th key={header} className="py-3 px-6 text-left font-medium text-gray-500">
            {header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="text-gray-700">
      {currentData.map((doctor, index) => (
        <tr key={index} className="border-t">
          <td className="py-3 px-6 text-primary font-bold">{index + 1}</td>
          <td className="py-3 px-6">
            {doctor.profileImage && typeof doctor.profileImage === "string" ? (
              <Image
                src={doctor.profileImage}
                alt="Doctor"
                className="w-10 h-10 rounded-full object-cover"
                width={70}
                height={89}
              />
            ) : (
              "N/A"
            )}
          </td>
          <td className="py-3 px-6">{doctor.name}</td>
          <td className="py-3 px-6">{doctor.speciality}</td>
          <td className="py-3 px-6">{doctor.location}</td>
          <td className="py-3 px-6">{doctor.viewCount || 0}</td>
          <td className="py-3 px-6">{doctor.rating || "No ratings"}</td>
          <td className="py-3 px-6">
            <div className="flex justify-center space-x-3">
              <button
                className="hover:text-gray-800"
                onClick={() => {
                  setViewingDoctor(doctor);
                  setIsViewModalOpen(true);
                }}
              >
                <Eye className="h-5 w-5" />
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => {
                  setDoctorToDelete(doctor);
                  setIsDeletePopupOpen(true);
                }}
              >
                <Trash className="h-5 w-5" />
              </button>
              <button
                className="text-primary hover:text-primary/80"
                onClick={() => {
                  setEditingDoctor(doctor);
                  setIsModalOpen(true);
                }}
              >
                <Edit3 className="h-5 w-5" />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default DoctorsTable;
