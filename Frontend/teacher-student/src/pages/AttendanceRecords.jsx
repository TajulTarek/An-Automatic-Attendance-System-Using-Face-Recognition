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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-blue-600 font-medium">Loading attendance records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 rounded-lg border border-red-200 text-red-700 flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        {error}
      </div>
    );
  }

  return (
    <div className="p-2 bg-gray-50 rounded-lg space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-200 to-gray-200 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-black flex items-center">
          <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          Attendance Records for {attendanceData.name}
        </h1>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Attendance Records</h2>
          <p className="text-gray-500 text-sm">Detailed student attendance for each class date</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead>
              <tr className="bg-gray-50">
                <th className="sticky left-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r w-48">
                  Student ID
                </th>
                {attendanceData.classDates.map((date, index) => (
                  <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b w-48">
                    <div className="flex flex-col">
                      <span>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <span className="text-gray-400 font-normal">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceData.studentIds.map((studentId, index) => {
                const attendanceList = attendanceData.studentAttendance[index];
                
                return (
                  <tr key={studentId} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="sticky left-0 bg-white hover:bg-blue-50 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r w-48">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          {studentId.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div>{studentId}</div>
                        </div>
                      </div>
                    </td>
                    {attendanceList.map((attendance, idx) => (
                      <td key={idx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-48">
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
                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex flex-col"
                              >
                                <span className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                  </svg>
                                  {`${firstTime} - ${lastTime}`}
                                </span>
                                <span className="text-sm text-green-600 font-semibold mt-1">
                                  {`(${hours > 0 ? `${hours}h ` : ''}${minutes}m)`}
                                </span>
                              </a>
                            );
                          })()
                        ) : (
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            Absent
                          </div>
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

      {/* Modal for Download Report */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-1/3 border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Download Report
            </h2>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Required Minutes for Full Attendance
              </label>
              <input
                type="number"
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={requiredMinutes}
                onChange={(e) => setRequiredMinutes(e.target.value)} // Allow empty string
                placeholder="Enter minutes"
              />
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg flex-1 flex items-center justify-center font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
                onClick={handleDownload}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download
              </button>
              <button
                className="bg-gray-100 text-gray-700 p-3 rounded-lg flex-1 flex items-center justify-center font-medium hover:bg-gray-200 transition-all"
                onClick={() => setShowDownloadModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Attendance Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setShowDownloadModal(true)} // Show the download modal
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Download Report (PDF/Excel)
        </button>
      </div>
    </div>
  );
};

export default AttendanceRecords;