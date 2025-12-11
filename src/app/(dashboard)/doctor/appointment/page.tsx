"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Eye, Trash2, Edit, Plus, Calendar, Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Toast } from "@/components/ui/toast";
import { ViewScheduleModal } from "./appointment-components/view-schedule-modal";
import { EditScheduleModal } from "./appointment-components/edit-schedule.modal";
import { ConfirmationDialog } from "./appointment-components/confirmation-dialog";
import styles from "./appointment.module.css";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("Newest");
  // const [selectedDay, setSelectedDay] = useState("");
  const [timeSlots, setTimeSlots] = useState<{ startTime: string; endTime: string }[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [viewSchedule, setViewSchedule] = useState<Schedule | null>(null);
  const [editSchedule, setEditSchedule] = useState<Schedule | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string; isOpen: boolean }>({ id: '', isOpen: false });
  const dataPerPage = 7;

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDay, setSelectedDay] = useState("");
  // const [timeSlots, setTimeSlots] = useState([]);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");

  // Handle adding a time slot
  // const handleAddTimeSlot = () => {
  //   if (!selectedStartTime || !selectedEndTime) return;

  //   setTimeSlots([
  //     ...timeSlots,
  //     { startTime: selectedStartTime, endTime: selectedEndTime },
  //   ]);

  //   setSelectedStartTime("");
  //   setSelectedEndTime("");
  // };

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

  const handleAddTimeSlot = () => {
    if (!selectedDate || !selectedStartTime || !selectedEndTime) {
      alert("Please select a date, start time, and end time.");
      return;
    }

    const formattedStartTime = new Date(`${selectedDate}T${selectedStartTime}:00`);
    const formattedEndTime = new Date(`${selectedDate}T${selectedEndTime}:00`);

    if (isNaN(formattedStartTime.getTime()) || isNaN(formattedEndTime.getTime())) {
      alert("Invalid time format");
      return;
    }

    setTimeSlots([
      ...timeSlots,
      { 
        startTime: formattedStartTime.toISOString(), 
        endTime: formattedEndTime.toISOString() 
      },
    ]);

    setSelectedStartTime("");
    setSelectedEndTime("");
  };
  

  // const handleAddTimeSlot = () => {
  //   setTimeSlots([...timeSlots, { startTime: "", endTime: "" }]);
  // };

  const handleCreateSchedule = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Auth token is missing");
        addToast("Error", "Authentication token is missing.", "error");
        return;
      }
  
      console.log("Doctor schedule Token:", token);
  
      // Check if required fields are selected
      if (!selectedDay || timeSlots.length === 0 || !selectedDate) {
        addToast("Error", "Please fill in all required fields.", "error");
        return;
      }
  
      // Format time slots with selectedDate
      const formattedSlots = timeSlots.map((slot) => {
        // Combine the selectedDate and the time to form a full date-time string
        const startTime = new Date(slot.startTime);
        const endTime = new Date(slot.endTime);

        console.log("Start Time:", startTime);
        console.log("End Time:", endTime);
      
        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
          throw new Error('Invalid start or end time');
        }
      
        return {
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          status: "available",
        };
      });
      
      // POST request
      const response = await fetch(
        "http://localhost:8800/api/doctor/create-schedule",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            slots: [
              {
                day: selectedDay,
                timings: formattedSlots,
              },
            ],
          }),
        }
      );
  
      // Handle response
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to create schedule");
      }
  
      const data = await response.json();
  
      // Update schedules and reset fields
      setSchedules((prevSchedules) => [
        ...prevSchedules,
        ...data.schedule.slots,
      ]);
  
      setIsModalOpen(false);
      setSelectedDay("");
      setTimeSlots([]);
  
      addToast(
        "Schedule Created",
        `New schedule for ${selectedDay} has been created successfully.`,
        "success"
      );
    } catch (error) {
      console.error("Error creating schedule:", error);
      const message = error instanceof Error ? error.message : "Failed to create schedule";
      addToast("Error", message, "error");
    }
  };
  

  const handleViewSchedule = (schedule: Schedule) => {
    setViewSchedule(schedule);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditSchedule(schedule);
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:8800/api/doctor/schedule/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ scheduleId }),
      });

      if (!response.ok) throw new Error("Failed to delete schedule");

      setSchedules(schedules.filter((schedule) => schedule._id !== scheduleId));
      addToast(
        "Schedule Deleted",
        "The selected schedule has been deleted successfully.",
        "success"
      );
    } catch (error) {
      console.error("Error deleting schedule:", error);
      addToast("Error", "Failed to delete schedule", "error");
    }
  };

  const handleUpdateSchedule = async (updatedSchedule: Schedule) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:8800/api/doctor/schedule/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedSchedule),
      });

      if (!response.ok) throw new Error("Failed to update schedule");

      const updatedData = await response.json();
      setSchedules(schedules.map(schedule => 
        schedule._id === updatedData._id ? updatedData : schedule
      ));
      setEditSchedule(null);
      addToast(
        "Schedule Updated",
        "The schedule has been updated successfully.",
        "success"
      );
    } catch (error) {
      console.error("Error updating schedule:", error);
      addToast("Error", "Failed to update schedule", "error");
    }
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
              Schedule Management
            </h2>
          </div>
          <Button
            className="text-md font-semibold px-2 p-1 rounded-md text-white bg-[#4681BC] mt-1 ml-3 hover:bg-[#3A6FA4] hover:cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Schedule
          </Button>
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
                          {new Date(time.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                          {new Date(time.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                              onClick={() => handleViewSchedule(schedule)}
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
                              onClick={() => handleEditSchedule(schedule)}
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
                              onClick={() => setDeleteConfirmation({ id: schedule._id, isOpen: true })}
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

      {/* Create Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
         <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Schedule</CardTitle>
        <CardDescription>Set your availability for appointments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Day Picker */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Day</label>
          <div className="relative">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full p-2 border rounded-md bg-white"
            >
              <option value="" disabled>Select a day</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Picker */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Date</label>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              placeholder="Select Date"
            />
          </div>
        </div>

        {/* Time Slot Inputs */}
        <div className="space-y-4">
          <label className="text-sm font-medium">Add Time Slot</label>
          <div className="flex items-center space-x-4">
            {/* Start Time Picker */}
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <Input
                type="time"
                value={selectedStartTime}
                onChange={(e) => setSelectedStartTime(e.target.value)}
                placeholder="Start Time"
              />
            </div>

            {/* End Time Picker */}
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <Input
                type="time"
                value={selectedEndTime}
                onChange={(e) => setSelectedEndTime(e.target.value)}
                placeholder="End Time"
              />
            </div>

            {/* Add Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddTimeSlot}
              className="bg-white"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Display Added Time Slots */}
        {timeSlots.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Added Time Slots</label>
            <ul className="space-y-2">
              {timeSlots.map((slot, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-2 border rounded-md bg-gray-50"
                >
                  <span className="text-sm font-medium">
                    Start: {new Date(slot.startTime).toLocaleString()} <br />
                    End: {new Date(slot.endTime).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" className="bg-white"
          onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </Button>
          <Button className="bg-[#4681BC] text-white hover:bg-[#3A6FA4]"
          onClick={handleCreateSchedule}
          >
            Create Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
        </div>
      )}

      {/* View Schedule Modal */}
      {viewSchedule && (
        <ViewScheduleModal
          schedule={viewSchedule}
          onClose={() => setViewSchedule(null)}
        />
      )}

      {/* Edit Schedule Modal */}
      {editSchedule && (
        <EditScheduleModal
          schedule={editSchedule}
          onClose={() => setEditSchedule(null)}
          onUpdate={handleUpdateSchedule}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ id: '', isOpen: false })}
        onConfirm={() => {
          handleDeleteSchedule(deleteConfirmation.id);
          setDeleteConfirmation({ id: '', isOpen: false });
        }}
        title="Delete Schedule"
        message="Are you sure you want to delete this schedule? This action cannot be undone."
      />
    </div>
  );
}



  // <div key={index} className="flex items-center space-x-2">
                  //   <Clock className="h-4 w-4" />
                  //   <Input
                  //     type="time"
                  //     value={slot}
                  //     onChange={(e) =>
                  //       handleTimeSlotChange(index, e.target.value)
                  //     }
                  //     className="flex-grow bg-white"
                  //   />
                  // </div>

