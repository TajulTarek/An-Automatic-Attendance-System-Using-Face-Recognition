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
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-700 font-medium">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <svg className="h-8 w-8 text-red-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 font-medium text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {attendanceData.name}
              </h1>
              <p className="text-gray-500">Course Attendance Overview</p>
            </div>
          </div>
          <div className="flex space-x-3">
            
            <button
              onClick={() => setShowDownloadModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm transition duration-150 flex items-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Report
            </button>
          </div>
        </div>

        {/* Attendance Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Students</p>
                <h3 className="text-2xl font-bold text-gray-800">{attendanceData.studentIds.length}</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Classes</p>
                <h3 className="text-2xl font-bold text-gray-800">{attendanceData.classDates.length}</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          
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
                            {index + 1}
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
      </div>



      {/* Modal for Download Report */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md mx-4 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Download Attendance Report</h2>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Minutes for Full Attendance</label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={requiredMinutes}
                onChange={(e) => setRequiredMinutes(e.target.value)}
                placeholder="Enter minutes"
              />
              <p className="mt-2 text-sm text-gray-500">
                Students must attend at least this many minutes to be considered present.
              </p>
            </div>

            <div className="mt-8 flex space-x-3">
              <button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition duration-150 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                onClick={handleDownload}
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Report
              </button>
              <button
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                onClick={() => setShowDownloadModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAttendance;