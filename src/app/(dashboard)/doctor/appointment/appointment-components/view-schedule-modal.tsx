import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

interface ViewScheduleModalProps {
  schedule: Schedule;
  onClose: () => void;
}

export const ViewScheduleModal: React.FC<ViewScheduleModalProps> = ({ schedule, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>View Schedule - {schedule.day}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Time Slots:</h3>
              <div className="flex flex-wrap gap-2">
                {schedule.timings.map((slot, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                    {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Badge>
                ))}
              </div>
            </div>
            <Button onClick={onClose} className="w-full mt-4">Close</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

