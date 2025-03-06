import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_BASE_URL;

const AttendanceRecords = () => {
  const { courseId } = useParams();  // Get the courseId from the URL
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [requiredMinutes, setRequiredMinutes] = useState(''); // Initialize as empty string

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/courses/get_attendance/${courseId}`);
        setAttendanceData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching attendance data');
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [courseId]);  // Refetch when courseId changes

  // Function to handle the download button click
  const handleDownload = async () => {
    try {
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

      // Open the PDF in a new tab
      window.open(`${baseUrl}${filePath}`, '_blank');
    } catch (err) {
      console.error('Error downloading report:', err);
      alert('Failed to download the report. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading attendance records...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg space-y-6">
      {/* Header Section */}
      <h1 className="text-2xl font-bold text-gray-800">Attendance Records for {attendanceData.name}</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 border-b">Student</th>
              {attendanceData.classDates.map((date, index) => (
                <th key={index} className="p-4 border-b">{date}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendanceData.studentIds.map((studentId, index) => {
              const attendanceList = attendanceData.studentAttendance[index];
              return (
                <tr key={studentId} className="hover:bg-gray-50">
                  <td className="p-4 border-b">{studentId}</td>
                  {attendanceList.map((attendance, idx) => (
                    <td key={idx} className="p-4 border-b">
                      {attendance && attendance.length >= 2 ? (
                        (() => {
                          // Convert time string to HH:mm format in Bangladesh Time (GMT+6)
                          const convertToBangladeshTime = (time) => {
                            const [hours, minutes] = time.split(":").map(Number);
                            const date = new Date();
                            date.setUTCHours(hours + 6, minutes, 0, 0); // Convert to GMT+6
                            return date.toTimeString().slice(0, 5); // Extract HH:mm format
                          };

                          // Convert all attendance times to Bangladesh time
                          const attendanceTimes = attendance.map((time) => convertToBangladeshTime(time));

                          // Get first and last attendance times
                          const firstTime = attendanceTimes[0];
                          const lastTime = attendanceTimes[attendanceTimes.length - 1];

                          // Convert time to minutes
                          const timeToMinutes = (time) => {
                            const [hours, minutes] = time.split(":").map(Number);
                            return hours * 60 + minutes;
                          };

                          // Calculate the duration
                          const timeDiff = timeToMinutes(lastTime) - timeToMinutes(firstTime);
                          const hours = Math.floor(timeDiff / 60);
                          const minutes = timeDiff % 60;

                          // Encode full attendance array for passing in URL
                          const encodedAttendance = encodeURIComponent(JSON.stringify(attendanceTimes));

                          return (
                            <a
                              href={`/attendance_details?firstTime=${firstTime}&lastTime=${lastTime}&duration=${hours}hr${minutes}min&attendance=${encodedAttendance}`}
                              className="text-blue-500 hover:underline"
                            >
                              {`${firstTime} - ${lastTime}, (${hours > 0 ? `${hours} hr ` : ''}${minutes} min)`}
                              <br />

                            </a>
                          );
                        })()
                      ) : (
                        <span>Absent</span> // If less than 2 timestamps, mark as absent
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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

export default AttendanceRecords;