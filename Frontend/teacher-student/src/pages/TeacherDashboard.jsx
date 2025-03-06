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
    return <div>Loading...</div>;
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
      alert("Please select a room number!");
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
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Hello! {teacher.name}</h1>

      {/* Assigned Courses Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Assigned Courses</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-4 border-b">Course ID</th>
                <th className="p-4 border-b">Course Name</th>
                <th className="p-4 border-b">Actions</th>
                <th className="p-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teacher.courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="p-4 border-b">{course.id}</td>
                  <td className="p-4 border-b">{course.name}</td>
                  <td className="p-4 border-b">
                    {roomData.some((room) => room.current_course_id === course.id) ? (
                      <button
                        onClick={() => handleEndClass(roomData.find(room => room.current_course_id === course.id).room_id, course)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        End Class
                      </button>
                    ) : (
                      <button
                          onClick={() => handleOpenDialog(course)} // Replace 'Room1' with actual room selection logic
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Start Class
                      </button>
                    )}
                  </td>

                  <td className="p-4 border-b">
                    <Link
                      to={`/teacher/view-attendance/${course.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      View Attendance
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal Dialog Box */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Start Class - {selectedCourse?.name}</h2>
            <label className="block mb-2">Select Room:</label>
            <select
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="">Select Room</option>
              <option value="gallery 1">Gallery 1</option>
              <option value="gallery 2">Gallery 2</option>
            </select>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseDialog}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleStartClass}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dialog Box for Confirming End Class */}
      {showEndClassDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Are you sure you want to end the class?</h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelEndClass}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEndClass}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes, End Class
              </button>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default TeacherDashboard;
