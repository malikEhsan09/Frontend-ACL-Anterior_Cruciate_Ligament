"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X } from "lucide-react";

// type Timing = {
//   startTime: string;
//   endTime: string;
//   status: "available" | "booked";
//   _id: string;
// };
interface Timing {
  startTime: string | Date;
  endTime: string | Date;
  status: "available" | "booked";
  _id: string;
}

type Slot = {
  day: string;
  timings: Timing[];
};

type Doctor = {
  _id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  doctorID: string;
  specialization: string;
  image: string;
  slots: Slot[];
};

type AvailableSlot = {
  day: string;
  timings: Timing[];
};

export default function BookAppointment() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState<boolean>(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");

  useEffect(() => {
    fetchDoctors();
    fetchAvailableSlots();
  }, []);

  const fetchDoctors = async () => {
    try {
      setIsLoadingDoctors(true);
      const response = await axios.get<{ schedule: Doctor[] }>(
        "http://localhost:8800/api/doctor/schedules"
      );

      console.log("doctor schedule", response.data.schedule);
      setDoctors(response.data.schedule || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setIsLoadingDoctors(false);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      setIsLoadingSlots(true);
      const response = await axios.get<{ availableSlots: AvailableSlot[] }>(
        "http://localhost:8800/api/appointment/slots"
      );

      console.log("available time slots ",response.data.availableSlots)
      setAvailableSlots(response.data.availableSlots || []);
    } catch (error) {
      console.error("Error fetching available slots:", error);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedTimeSlot) return;

    const userId = localStorage.getItem("userId");
    console.log(userId)
    const authToken = localStorage.getItem("authToken");

    console.log("selected time slot", selectedTimeSlot);

   const [day,startTime,endTime] = selectedTimeSlot.split("/");

    console.log(day); // "Monday"
console.log(startTime); // "2024-12-11T07:00:00.000Z"
console.log(endTime); 

    try {
      const requestData = {
        playerID: userId, // Replace with authenticated player ID
        doctorID: selectedDoctor.doctorID,
        scheduleID: selectedDoctor._id,
        day,
        startTime, // Already in ISO format
        endTime, // Already in ISO format
        appointmentType: "online", // or "physical" based on your requirements
      };

      console.log("Booking appointment request:", requestData);

      const response = await axios.post(
        "http://localhost:8800/api/appointment/book-appointment",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      alert(response.data.message); // Show success message
      fetchAvailableSlots(); // Refresh slots data
      setIsModalOpen(false);
      setSelectedDoctor(null);
      setSelectedTimeSlot("");
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    }
  };

  const formatTiming = (timing: Timing): string => {
    try {
      const startTime = new Date(timing.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const endTime = new Date(timing.endTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const statusLabel =
        timing.status === "available" ? "Available" : "Booked";
      return `${startTime} - ${endTime} (${statusLabel})`;
    } catch (error) {
      console.error("Error formatting timing:", error);
      return "Invalid timing data";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Available Appointments</h2>

      {isLoadingDoctors || isLoadingSlots ? (
        <p>Loading available appointments...</p>
      ) : doctors.length === 0 ? (
        <p>No available appointments.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Doctor</th>
              <th className="border border-gray-300 px-4 py-2">
                Specialization
              </th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Phone</th>
              <th className="border border-gray-300 px-4 py-2">
                Available Slots
              </th>
              <th className="border border-gray-300 px-4 py-2">Book</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={doctor.image} alt={doctor.userName} />
                      <AvatarFallback>
                        {doctor.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{doctor.userName}</span>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {doctor.specialization}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {doctor.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {doctor.phoneNumber}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {availableSlots.filter((slot) =>
                    doctor.slots.some(
                      (doctorSlot) => doctorSlot.day === slot.day
                    )
                  ).length > 0 ? (
                    <div>
                      {availableSlots
                        .filter((slot) =>
                          doctor.slots.some(
                            (doctorSlot) => doctorSlot.day === slot.day
                          )
                        )
                        .map((slot) => (
                          <div key={slot.day} className="mb-2">
                            <strong>{slot.day}:</strong>{" "}
                            <div className="flex flex-wrap gap-2">
                              {slot.timings.map((timing) => (
                                <span
                                  key={timing._id}
                                  className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                                >
                                  {formatTiming(timing)}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <span>No available slots</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      console.log("doctor selected", doctor);
                      setIsModalOpen(true);
                    }}
                  >
                    Book
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-lg p-4">
          <DialogHeader>
            <DialogTitle className="text-lg">
              Book Appointment with {selectedDoctor?.userName}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedDoctor(null);
              }}
              className="absolute right-4 top-4"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogHeader>

          {selectedDoctor && (
            <div>
              <h3 className="text-sm font-medium mb-3">Available Slots</h3>
              <RadioGroup
                value={selectedTimeSlot}
                onValueChange={setSelectedTimeSlot}
                className="space-y-2"
              >
                {availableSlots
                  .filter((slot) =>
                    selectedDoctor.slots.some(
                      (doctorSlot) => doctorSlot.day === slot.day
                    )
                  )
                  .map((slot) => (
                    <div key={slot.day} className="mb-2">
                      <h4 className="text-sm font-medium">{slot.day}</h4>
                      {slot.timings.map((timing) => (
                        <div
                          key={timing._id}
                          className="flex items-center space-x-2 rounded-md border p-2 mb-2 text-black"
                        >
                          <RadioGroupItem
                            value={`${slot.day}/${timing.startTime}/${timing.endTime}`} // Send both startTime and endTime
                            id={`${slot.day}-${timing.startTime}`}
                          />
                          <Label
                            htmlFor={`${slot.day}-${timing.startTime}`}
                            className="text-sm"
                          >
                            {formatTiming(timing)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  ))}
              </RadioGroup>

              <Button
                className="mt-4 w-full"
                onClick={handleBookAppointment}
                disabled={!selectedTimeSlot}
              >
                Confirm Appointment
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
