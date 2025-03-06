import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_BASE_URL;

const ViewAttendance = () => {
  const { courseId } = useParams();
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state for Add Schedule
  const [showModal, setShowModal] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    date: '',
    start_time: '',
    end_time: ''
  });

  // Modal state for Download Report
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [requiredMinutes, setRequiredMinutes] = useState(''); // Initialize as empty string

  useEffect(() => {
    // Fetch attendance data when component loads
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/courses/get_attendance/${courseId}`);
        setAttendanceData(response.data); // Set data to state
        setLoading(false); // Once data is fetched, stop loading
      } catch (err) {
        setError('Error fetching attendance data');
        setLoading(false);
      }
    };

    if (courseId) {
      fetchAttendanceData(); // Call API to fetch data when component mounts
    }
  }, [courseId]); // Run only when courseId changes

  const handleDownload = async () => {
    try {
      // Convert requiredMinutes to a number
      const minutes = Number(requiredMinutes);

      // Validate the input
      if (isNaN(minutes)) {
        alert('Please enter a valid number for required minutes.');
        return;
      }

      // Call the API to generate the PDF with the required minutes
      const response = await axios.get(`${baseUrl}/courses/generate_attendance_report/${courseId}`, {
        params: {
          requiredMinutes: minutes // Pass the required minutes to the API
        }
      });
      
      const filePath = response.data.filePath; // Get the file path from the response

      console.log(filePath)

      // Open the PDF in a new tab
      window.open(`${baseUrl}${filePath}`, '_blank');
    } catch (err) {
      console.error('Error downloading report:', err);
      alert('Failed to download the report. Please try again.');
    } finally {
      setShowDownloadModal(false); // Close the modal after downloading
    }
  };

  // Handle schedule form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleData({ ...scheduleData, [name]: value });
  };

  // Handle adding a schedule
  const handleAddSchedule = async () => {
    try {
      const response = await axios.post(`${baseUrl}/courses/addSchedule`, {
        course_id: courseId,
        ...scheduleData
      });
      alert('Schedule added successfully');
      setShowModal(false);
    } catch (err) {
      alert('Error adding schedule');
    }
  };

  // Display loading state or error message
  if (loading) {
    return <div>Loading attendance data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        {/* Heading */}
        <h1 className="text-3xl font-bold">Attendance for {attendanceData.name}</h1>
      </div>

      {/* Attendance Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-4 border-b w-48">Student</th>
                {attendanceData.classDates.map((date, index) => (
                  <th key={index} className="p-4 border-b w-48">{date}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendanceData.studentIds.map((studentId, index) => {
                const attendanceList = attendanceData.studentAttendance[index];

                return (
                  <tr key={studentId} className="hover:bg-gray-50">
                    <td className="p-4 border-b w-48">{studentId}</td>
                    {attendanceList.map((attendance, idx) => (
                      <td key={idx} className="p-4 border-b w-48">
                        {attendance && attendance.length >= 1 ? (
                          (() => {
                            const formatToHHMM = (time) => {
                              const [hours, minutes] = time.split(":").map(Number);
                              return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
                            };

                            const firstTime = formatToHHMM(attendance[0]);
                            const lastTime = formatToHHMM(attendance[attendance.length - 1]);

                            const timeToMinutes = (time) => {
                              const [hours, minutes] = time.split(":").map(Number);
                              return hours * 60 + minutes;
                            };

                            const timeDiff = timeToMinutes(lastTime) - timeToMinutes(firstTime);
                            const hours = Math.floor(timeDiff / 60);
                            const minutes = timeDiff % 60;

                            const encodedAttendance = encodeURIComponent(JSON.stringify(attendance));

                            return (
                              <a
                                href={`/attendance_details?firstTime=${firstTime}&lastTime=${lastTime}&duration=${hours}hr${minutes}min&attendance=${encodedAttendance}`}
                                className="text-blue-500 hover:underline"
                              >
                                {`${firstTime} - ${lastTime}, (${hours > 0 ? `${hours} hr ` : ''}${minutes} min)`}
                              </a>
                            );
                          })()
                        ) : (
                          <span>Absent</span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add Schedule */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Add Schedule</h2>
            <div className="space-y-4">
              <input
                type="date"
                name="date"
                className="border p-2 rounded w-full"
                value={scheduleData.date}
                onChange={handleInputChange}
              />
              <input
                type="time"
                name="start_time"
                className="border p-2 rounded w-full"
                value={scheduleData.start_time}
                onChange={handleInputChange}
              />
              <input
                type="time"
                name="end_time"
                className="border p-2 rounded w-full"
                value={scheduleData.end_time}
                onChange={handleInputChange}
              />
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={handleAddSchedule}
              >
                Save Schedule
              </button>
              <button
                className="bg-gray-500 text-white p-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Download Report */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Download Report</h2>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Required Minutes for Full Attendance
              </label>
              <input
                type="number"
                className="border p-2 rounded w-full"
                value={requiredMinutes}
                onChange={(e) => setRequiredMinutes(e.target.value)} // Allow empty string
                placeholder="Enter minutes"
              />
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={handleDownload}
              >
                Download
              </button>
              <button
                className="bg-gray-500 text-white p-2 rounded"
                onClick={() => setShowDownloadModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Attendance Button */}
      <div className="mt-6">
        <button
          onClick={() => setShowDownloadModal(true)} // Show the download modal
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600"
        >
          Download Report (PDF/Excel)
        </button>
      </div>
    </div>
  );
};

export default ViewAttendance;