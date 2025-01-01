import React, { useState } from 'react';

const TimeSlotSelector = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedDate || !startTime || !endTime) {
      alert('Please select a date, start time, and end time.');
      return;
    }

    // Combine date with time
    const formattedStartTime = new Date(`${selectedDate}T${startTime}:00`).toISOString();
    const formattedEndTime = new Date(`${selectedDate}T${endTime}:00`).toISOString();

    console.log('Selected Time Slot:', {
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    });
  };

  return (
    <div>
      <h2>Select Time Slot</h2>
      <form onSubmit={handleSubmit}>
        {/* Date Picker */}
        <div>
          <label>Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            required
          />
        </div>

        {/* Start Time Picker */}
        <div>
          <label>Start Time:</label>
          <input
            type="time"
            value={startTime}
            onChange={handleStartTimeChange}
            required
          />
        </div>

        {/* End Time Picker */}
        <div>
          <label>End Time:</label>
          <input
            type="time"
            value={endTime}
            onChange={handleEndTimeChange}
            required
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default TimeSlotSelector;
