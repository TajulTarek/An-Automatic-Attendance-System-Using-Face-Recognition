import React, { useState } from 'react';

const baseUrl = import.meta.env.VITE_BASE_URL;

const ManageSchedules = () => {
  const [scheduleData, setScheduleData] = useState([
    { course: 'CS101', date: '2025-01-18', time: '10:00 AM' },
    { course: 'Data Structures', date: '2025-01-20', time: '2:00 PM' },
  ]);

  const handleAddSchedule = () => {
    // Handle schedule addition logic here
    alert('Adding new schedule');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Schedules</h1>

      {/* Calendar View */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Calendar View</h2>
        {/* Here you can add a calendar component */}
        <div className="border border-gray-300 p-4 rounded-lg">
          <p className="text-center text-gray-500">Calendar goes here (Use a calendar library like react-calendar)</p>
        </div>
      </div>

      {/* Schedule List */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Current Schedules</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-4 border-b">Course</th>
                <th className="p-4 border-b">Date</th>
                <th className="p-4 border-b">Time</th>
                <th className="p-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((schedule, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4 border-b">{schedule.course}</td>
                  <td className="p-4 border-b">{schedule.date}</td>
                  <td className="p-4 border-b">{schedule.time}</td>
                  <td className="p-4 border-b">
                    <button className="text-blue-500 hover:underline">Edit</button>
                    <button className="text-red-500 hover:underline ml-4">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Schedule */}
      <div className="mt-6 flex gap-4">
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600"
          onClick={handleAddSchedule}
        >
          Add New Schedule
        </button>
      </div>

      {/* Recurring Classes */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Set Recurring Classes</h2>
        <div className="flex gap-4">
          <select className="p-2 border rounded">
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600">
            Set Recurrence
          </button>
        </div>
      </div>

      {/* Assign CRs */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Assign Class Representatives (CR)</h2>
        <button className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-yellow-600">
          Assign CR
        </button>
      </div>

      {/* Automated Reminders */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Automated Reminders</h2>
        <div className="flex gap-4">
          <input type="text" className="p-2 border rounded" placeholder="Enter reminder details" />
          <button className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-600">
            Set Reminder
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageSchedules;
