import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const baseUrl = import.meta.env.VITE_BASE_URL;

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [allSchedules, setAllSchedules] = useState([]);
  const [mySchedules, setMySchedules] = useState([]);
  const teacher_id = localStorage.getItem('ID'); // Assume ID is stored in localStorage
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [roomNumber, setRoomNumber] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [message, setMessage] = useState(null);
  const [roomData, setRoomData] = useState([]);
  const [showEndClassDialog, setShowEndClassDialog] = useState(false);
  const [roomToEndClass, setRoomToEndClass] = useState(null);

  // Fetch teacher info
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await axios.get(`${baseUrl}/teachers/${teacher_id}`);
        setTeacher(response.data); // Set teacher data from the API response
      } catch (error) {
        console.error('Error fetching teacher:', error);
      }
    };

    if (teacher_id) {
      fetchTeacher();
    }
  }, [teacher_id]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${baseUrl}/courses/rooms`); // API to get all rooms
        setRoomData(response.data);
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };

    fetchRooms();
  }, []);

  // Fetch schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        // Fetch all upcoming schedules
        const allSchedulesResponse = await axios.get(`${baseUrl}/teachers/schedules/upcoming`);
        setAllSchedules(allSchedulesResponse.data.upcomingClasses);

        // Fetch teacher's upcoming schedules
        const mySchedulesResponse = await axios.get(`${baseUrl}/teachers/schedules/${teacher_id}`);
        setMySchedules(mySchedulesResponse.data.upcomingClasses);
        // console.log(mySchedules)
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };

    fetchSchedules();
  }, [teacher_id]);

  if (!teacher) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-blue-400 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-blue-400 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-blue-400 rounded"></div>
              <div className="h-4 bg-blue-400 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleOpenDialog = (course) => {
    setSelectedCourse(course);
    setShowDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedCourse(null);
    setRoomNumber('');
  };

  // Handle starting the class
  const handleStartClass = async () => {
    if (!roomNumber) {
      toast.error("Please select a room number!");
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/courses/start-class`, {
        room_id: roomNumber,
        course_id: selectedCourse.id
      });

      // Show success message
      setTimeout(() => {
        window.location.reload(); // Refresh page after 3 seconds
      }, 200);
      //toast.success(response.data.message);

    } catch (error) {
      // Show error message
      toast.error(error.response?.data?.message || 'Error starting class.');
    }

    // Close dialog after starting class
    handleCloseDialog();
  };

  const handleEndClass = (roomId, course) => {
    setRoomToEndClass({ roomId, course });
    setShowEndClassDialog(true);
  };

  const handleConfirmEndClass = async () => {
    try {
      const response = await axios.post(`${baseUrl}/courses/end-class`, {
        room_id: roomToEndClass.roomId,
        course_id: roomToEndClass.course.id
      });

      // Show success message
      setTimeout(() => {
        window.location.reload(); // Refresh page after 3 seconds
      }, 200);
      //toast.success(response.data.message);
    } catch (error) {
      // Show error message
      toast.error(error.response?.data?.message || 'Error ending class.');
    }

    setShowEndClassDialog(false);
  };

  const handleCancelEndClass = () => {
    setShowEndClassDialog(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-6 px-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white">
            Welcome, <span className="italic">{teacher.name}</span>
          </h1>
          <p className="text-blue-100 mt-2">Teacher Dashboard</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Statistics Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Assigned Courses</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{teacher.courses?.length || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Active Classes</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {roomData.filter(room => room.current_course_id && teacher.courses.some(course => course.id === room.current_course_id)).length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Upcoming Classes</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">{mySchedules.length}</p>
          </div>
        </div> */}

        {/* Assigned Courses Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Assigned Courses</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Course ID</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teacher.courses.map((course) => (
                  <tr key={course.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{course.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {roomData.some((room) => room.current_course_id === course.id) ? (
                        <button
                          onClick={() => handleEndClass(roomData.find(room => room.current_course_id === course.id).room_id, course)}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          End Class
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenDialog(course)}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Start Class
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      <Link
                        to={`/teacher/view-attendance/${course.id}`}
                        className="inline-flex items-center hover:text-blue-800 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        View Attendance
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {teacher.courses.length === 0 && (
            <div className="py-8 px-6 text-center text-gray-500">
              No courses assigned yet.
            </div>
          )}
        </div>
      </div>

      {/* Start Class Modal Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="bg-blue-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Start Class</h2>
              <p className="text-blue-100 text-sm">{selectedCourse?.name}</p>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Room:</label>
              <select
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-6"
              >
                <option value="">Select Room</option>
                <option value="gallery 1">Gallery 1</option>
                <option value="gallery 2">Gallery 2</option>
              </select>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCloseDialog}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartClass}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Start Class
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* End Class Confirmation Modal */}
      {showEndClassDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="bg-red-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">End Class</h2>
              <p className="text-red-100 text-sm">{roomToEndClass?.course.name}</p>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-6">Are you sure you want to end this class? This action cannot be undone.</p>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCancelEndClass}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmEndClass}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  End Class
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;