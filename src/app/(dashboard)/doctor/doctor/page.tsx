"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import styles from "./doctorList.module.css";
import axios from 'axios';

interface Doctor {
  _id: string;
  userID: string;
  email: string;
  name: string;
  medicalLicenseNo: string;
  specialization: string;
  phoneNumber: string;
  rating: number;
  numberOfRatings: number;
  verified: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export default function DoctorList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const dataPerPage = 7;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No token found');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8800/api/doctor/', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Doctors data", response.data);
        setDoctors(response.data);
      } catch (error) {
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  // const fetchDoctors = async () => {
  //   try {
  //     const token = localStorage.getItem("authToken");
  //     console.log("Doctor schedule Token:", token);

  //     const response = await fetch("http://localhost:8800/api/doctor/",{ method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       });
  //     console.log(`Doctor response: ${response}`);
  //     if (!response.ok) throw new Error("Failed to fetch doctors");
  //     const data = await response.json();
  //     setDoctors(data.doctors); // Ensure the API response structure matches this
  //   } catch (error) {
  //     console.error("Error fetching doctors:", error);
  //   }
  // };

  const currentData = doctors.slice(
    (currentPage - 1) * dataPerPage,
    currentPage * dataPerPage
  );

  const totalPages = Math.ceil(doctors.length / dataPerPage);

  return (
    <div className="p-2 mt-2">
      <div className="flex justify-between items-start mb-3 bg-[#F0F0F0] p-2 rounded-t-2xl">
        <div className="flex items-center">
          <div className="w-3 h-8 bg-[#152f86b2] rounded-md mr-3"></div>
          <h2 className="text-2xl font-bold text-gray-800">Doctor List</h2>
        </div>
      </div>

      <Card className="border-none shadow-none">
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left font-medium text-gray-500">
                  ID
                </th>
                <th className="py-3 px-6 text-left font-medium text-gray-500">
                  Name
                </th>
                <th className="py-3 px-6 text-left font-medium text-gray-500">
                  Specialization
                </th>
                <th className="py-3 px-6 text-left font-medium text-gray-500">
                  Phone
                </th>
                <th className="py-3 px-6 text-left font-medium text-gray-500">
                  Email
                </th>
                <th className="py-3 px-6 text-left font-medium text-gray-500">
                  Verified
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {currentData.map((doctor, index) => (
                <tr key={doctor._id} className="border-t">
                  <td className="py-3 px-6 text-blue-600 font-bold">
                    {index + 1 + (currentPage - 1) * dataPerPage}
                  </td>
                  <td className="py-3 px-6">
                    <Badge
                      variant="outline"
                      className="bg-white text-gray-700 border-gray-300"
                    >
                      {doctor.name}
                    </Badge>
                  </td>
                  <td className="py-3 px-6">{doctor.specialization}</td>
                  <td className="py-3 px-6">{doctor.phoneNumber}</td>
                  <td className="py-3 px-6">{doctor.email}</td>
                  <td className="py-3 px-6">
                    <Badge
                      variant="outline"
                      className={
                        doctor.verified
                          ? "bg-green-100 text-green-700 border-green-300"
                          : "bg-red-100 text-red-700 border-red-300"
                      }
                    >
                      {doctor.verified ? "Yes" : "No"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600 items-center ml-2">
          Showing {currentPage * dataPerPage - dataPerPage + 1} to{" "}
          {Math.min(currentPage * dataPerPage, doctors.length)} of{" "}
          {doctors.length} entries
        </p>
        <div className="flex space-x-2 items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
              className={
                currentPage === i + 1 ? "bg-[#4681BC] text-white" : "bg-white"
              }
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="bg-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
