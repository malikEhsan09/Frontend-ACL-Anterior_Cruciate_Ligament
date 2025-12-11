"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Edit,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Toast } from "@/components/ui/toast";
import styles from "./playersReport.module.css";

interface TimeSlot {
  startTime: string;
  endTime: string;
  status: string;
}

interface Schedule {
  _id: string;
  day: string;
  timings: TimeSlot[];
}

interface Toast {
  id: number;
  title: string;
  description: string;
  type: "success" | "error" | "info";
}

export default function DoctorSchedule() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("Newest");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const dataPerPage = 7;

  useEffect(() => {
    fetchSchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const userID = localStorage.getItem("userId");
      console.log("Doctor ID:", userID);
      const response = await fetch(
        `http://localhost:8800/api/doctor/schedule/${userID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch schedules");
      const data = await response.json();
      console.log("Doctor schedule data", data);
      setSchedules(data.schedule.slots);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      addToast("Error", "Failed to fetch schedules", "error");
    }
  };

  const currentData = schedules.slice(
    (currentPage - 1) * dataPerPage,
    currentPage * dataPerPage
  );

  const totalPages = Math.ceil(schedules.length / dataPerPage);

  const addToast = (
    title: string,
    description: string,
    type: "success" | "error" | "info"
  ) => {
    const id = Date.now();
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, title, description, type },
    ]);
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 3000);
  };
  return (
    <div className="p-2 mt-2">
      {/* Toast Container */}
      <div className={styles.toastContainer}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            description={toast.description}
            type={toast.type}
          />
        ))}
      </div>

      <div className="flex justify-between items-start mb-3 bg-[#F0F0F0] p-2 rounded-t-2xl">
        <div className="flex flex-col">
          <div className="flex items-center mb-2">
            <div className="w-3 h-8 bg-[#152f86b2] rounded-md mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-800">
              Report schedule
            </h2>
          </div>
            <span className="text-lightBlue ml-7">Results</span>
        </div>
        <div className="flex items-center">
          <label className="text-sm font-medium text-gray-600 mr-2">
            Sort by:
          </label>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-32 bg-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Newest">Newest</SelectItem>
              <SelectItem value="Oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
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
                  Day
                </th>
                <th className="py-3 px-6 text-left font-medium text-gray-500">
                  Time Slots
                </th>
                <th className="py-3 px-6 text-left font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {currentData.map((schedule, index) => (
                <tr key={schedule._id} className="border-t">
                  <td className="py-3 px-6 text-blue-600 font-bold">
                    {index + 1}
                  </td>
                  <td className="py-3 px-6">
                    <Badge
                      variant="outline"
                      className="bg-white text-gray-700 border-gray-300"
                    >
                      {schedule.day}
                    </Badge>
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex flex-wrap gap-2">
                      {schedule.timings.map((time, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-gray-100 text-gray-700"
                        >
                          {new Date(time.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex space-x-3">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                            >
                              <Eye className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Schedule</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                            >
                              <Edit className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Schedule</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              // onClick={() => setDeleteConfirmation({ id: schedule._id, isOpen: true })}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Schedule</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
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
          {Math.min(currentPage * dataPerPage, schedules.length)} of{" "}
          {schedules.length} entries
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
