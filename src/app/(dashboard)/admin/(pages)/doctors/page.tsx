"use client";
import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import Header from "./doctor-components/header";
import DoctorsTable from "./doctor-components/doctors-table";
import AddEditDoctorModal from "./modal/add-edit-doctor.modal";
import ViewDoctorModal from "./modal/view-doctor.modal";
import DeleteDoctorModal from "./modal/delete-doctor.modal";
import Pagination from "./doctor-components/pagination";

export interface Doctor {
  _id?: string;
  name: string;
  speciality: string;
  designation?: string;
  degree?: string;
  experience?: string;
  location: string;
  profileImage?: string | File | null;
  createdAt?: string;
  viewCount?: number;
  rating?: number | string;
}

const Doctors = () => {
  const dataPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("Newest");
  const [newDoctor, setNewDoctor] = useState<{
    name: string;
    speciality: string;
    designation: string;
    degree: string;
    experience: string;
    location: string;
    profileImage: File | null;
  }>({
    name: "",
    speciality: "",
    designation: "",
    degree: "",
    experience: "",
    location: "",
    profileImage: null,
  });
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [viewingDoctor, setViewingDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch doctors data from the API
  const fetchDoctorsData = React.useCallback(async () => {
    const authToken = localStorage.getItem("authToken");
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${authToken}`);
    headers.append("Content-Type", "application/json");

    try {
      console.log("Fetching doctors data...");
      const response = await fetch("http://localhost:8800/api/doctor/", {
        method: "GET",
        headers: headers,
      });
      if (!response.ok) throw new Error("Failed to fetch doctors data");

      const doctorData = await response.json();
      console.log("Doctors fetched successfully:", doctorData);

      const sortedData: Doctor[] =
        sortOrder === "Newest"
          ? doctorData.sort(
              (a: Doctor, b: Doctor) =>
                (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0)
            )
          : doctorData.sort(
              (a: Doctor, b: Doctor) =>
                (a.createdAt ? new Date(a.createdAt).getTime() : 0) - (b.createdAt ? new Date(b.createdAt).getTime() : 0)
            );

      setDoctors(sortedData);
      setTotalPages(Math.ceil(sortedData.length / dataPerPage));
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sortOrder]);

  useEffect(() => {
    fetchDoctorsData();
  }, [sortOrder, fetchDoctorsData]);

  const currentData = doctors.slice(
    (currentPage - 1) * dataPerPage,
    currentPage * dataPerPage
  );

  interface AlertHandler {
    (message: string, successState: boolean): void;
  }

  const handleAlert: AlertHandler = (message, successState) => {
    setAlertMessage(message);
    setSuccess(successState);
    setOpenAlert(true);
    setTimeout(() => setOpenAlert(false), 3000);
  };

  if (isLoading) {
    return <div>Loading Doctors...</div>;
  }

  return (
    <div className="p-2 mt-2">
      {openAlert && (
        <div className="fixed top-0 left-0 right-0 bg-white border border-gray-200 shadow-lg p-4 text-center mx-auto max-w-xl z-50 animate-slide-down rounded-lg">
          {success ? (
            <>
              <FaCheckCircle className="w-8 h-8 text-green-500 inline-block mr-2" />
              <span className="text-lg font-semibold text-green-600">
                {alertMessage}
              </span>
            </>
          ) : (
            <span className="text-lg font-semibold text-red-600">
              {alertMessage}
            </span>
          )}
        </div>
      )}

      <Header
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        setIsModalOpen={setIsModalOpen}
      />

      <DoctorsTable
        currentData={currentData}
        setViewingDoctor={(doctor: Doctor) => setViewingDoctor(doctor)}
        setIsViewModalOpen={setIsViewModalOpen}
        setDoctorToDelete={(doctor: Doctor) => setDoctorToDelete(doctor)}
        setIsDeletePopupOpen={setIsDeletePopupOpen}
        setEditingDoctor={(doctor: Doctor) => setEditingDoctor(doctor)}
        setIsModalOpen={setIsModalOpen}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={(page: number) => setCurrentPage(page)}
      />

      {isViewModalOpen && viewingDoctor && (
        <ViewDoctorModal
          viewingDoctor={viewingDoctor}
          setIsViewModalOpen={setIsViewModalOpen}
        />
      )}

      {isDeletePopupOpen && doctorToDelete && (
        <DeleteDoctorModal
          doctorToDelete={doctorToDelete}
          setIsDeletePopupOpen={setIsDeletePopupOpen}
          setDoctorToDelete={setDoctorToDelete}
          handleAlert={handleAlert}
          setDoctors={setDoctors}
        />
      )}

      {isModalOpen && (
        <AddEditDoctorModal
          editingDoctor={editingDoctor}
          newDoctor={newDoctor}
          setEditingDoctor={setEditingDoctor}
          setNewDoctor={(doctor) => {
            setNewDoctor({
              name: doctor.name,
              speciality: doctor.speciality,
              designation: doctor.designation || "",
              degree: doctor.degree || "",
              experience: doctor.experience || "",
              location: doctor.location,
              profileImage: doctor.profileImage instanceof File ? doctor.profileImage : null,
            });
          }}
          setDoctors={setDoctors}
          setIsModalOpen={setIsModalOpen}
          handleAlert={handleAlert}
        />
      )}
    </div>
  );
};

export default Doctors;
