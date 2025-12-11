import React from "react";
import { Phone } from "lucide-react";
import { BsFileEarmarkMedicalFill } from "react-icons/bs";
import { FaHandsHoldingCircle } from "react-icons/fa6";

interface DoctorFormData {
  medicalLicenseNo: string;
  specialization: string;
  phoneNumber: string;
  [key: string]: string | boolean; // Allow other properties
}

interface DoctorFormProps {
  formData: DoctorFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// components/DoctorForm.js
export default function DoctorForm({ formData, handleChange }: DoctorFormProps) {
    return (
      <div>
        <div className="mb-4 relative">
          <label className="block text-gray-700 font-bold mb-2">Medical License Number</label>
        
           <div className="relative flex items-center">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <BsFileEarmarkMedicalFill className="w-6 h-6" />
                </span>
                <input
                  type="text"
                  name="medicalLicenseNo"
                  placeholder="Enter your medical license number"
                  value={formData.medicalLicenseNo}
                  onChange={handleChange}
                  className="w-full text-[18px] pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition duration-200 text-lg"
                />
              </div>
        </div>
      
      {/*Specialization  */}
         <div className="mb-4 relative">
          <label className="block text-gray-700 font-bold mb-2">Specialization</label>
        
           <div className="relative flex items-center">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <FaHandsHoldingCircle  className="w-6 h-6" />
                </span>
                <input
                  type="text"
                  name="specialization"
                  placeholder="Enter your specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full text-[18px] pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition duration-200 text-lg"
                />
              </div>
        </div>

    
          <div className="mb-4 relative">
          <label className="block text-gray-700 font-bold mb-2">Phone Number</label>
        
           <div className="relative flex items-center">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <Phone className="w-6 h-6" />
                </span>
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Enter your phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full text-[18px] pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition duration-200 text-lg"
                />
              </div>
        </div>
      </div>
    );
  }
  