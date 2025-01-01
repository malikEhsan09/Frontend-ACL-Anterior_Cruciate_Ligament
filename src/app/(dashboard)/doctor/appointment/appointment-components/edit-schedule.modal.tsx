import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface EditScheduleModalProps {
  schedule: Schedule;
  onClose: () => void;
  onUpdate: (updatedSchedule: Schedule) => void;
}

export const EditScheduleModal: React.FC<EditScheduleModalProps> = ({ schedule, onClose, onUpdate }) => {
  const [editedSchedule, setEditedSchedule] = useState<Schedule>({ ...schedule });

  const handleDayChange = (newDay: string) => {
    setEditedSchedule({ ...editedSchedule, day: newDay });
  };

  const handleTimeSlotChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const newTimings = [...editedSchedule.timings];
    newTimings[index] = { ...newTimings[index], [field]: new Date(`2024-12-16T${value}:00.000Z`).toISOString() };
    setEditedSchedule({ ...editedSchedule, timings: newTimings });
  };

  const handleAddTimeSlot = () => {
    setEditedSchedule({
      ...editedSchedule,
      timings: [...editedSchedule.timings, { startTime: '', endTime: '', status: 'available' }],
    });
  };

  const handleRemoveTimeSlot = (index: number) => {
    const newTimings = editedSchedule.timings.filter((_, i) => i !== index);
    setEditedSchedule({ ...editedSchedule, timings: newTimings });
  };

  const handleSubmit = () => {
    onUpdate(editedSchedule);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Edit Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Day</label>
              <Select value={editedSchedule.day} onValueChange={handleDayChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Time Slots</label>
              {editedSchedule.timings.map((slot, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <Input
                    type="time"
                    value={new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    onChange={(e) => handleTimeSlotChange(index, 'startTime', e.target.value)}
                    className="flex-grow"
                  />
                  <Input
                    type="time"
                    value={new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    onChange={(e) => handleTimeSlotChange(index, 'endTime', e.target.value)}
                    className="flex-grow"
                  />
                  <Button variant="outline" onClick={() => handleRemoveTimeSlot(index)}>Remove</Button>
                </div>
              ))}
              <Button variant="outline" onClick={handleAddTimeSlot} className="mt-2">Add Time Slot</Button>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSubmit}>Update Schedule</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

