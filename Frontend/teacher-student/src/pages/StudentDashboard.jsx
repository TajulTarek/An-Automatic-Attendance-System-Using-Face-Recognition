import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
const baseUrl = import.meta.env.VITE_BASE_URL;

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [animationType, setAnimationType] = useState(null); 
  const [upcomingClasses, setUpcomingClasses] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const studentId = localStorage.getItem('ID');

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/users/${studentId}`);
        setDashboardData(response.data);
        console.log("response ",response.data);
      } catch (err) {
        setError('Error fetching dashboard data');
      }
    };
    const fetchUpcomingClasses = async () => {
      try {
        const response = await axios.get(`${baseUrl}/users/upcoming/${studentId}`);
        setUpcomingClasses(response.data.upcomingClasses);
      } catch (err) {
        console.error("Error fetching upcoming classes:", err);
        setError("Failed to load upcoming classes.");
      }
    };

    if (studentId) {
      fetchDashboardData();
      fetchUpcomingClasses();

      console.log("Dashboard Data",dashboardData);
      console.log("Upcoming Class",upcomingClasses);
    } else {
      setError('Student ID not found in local storage');
    }
  }, []);

  const handleViewAttendance = (courseId) => {
    navigate(`/student/attendance-records/${courseId}`);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleAddPhoto = async () => {
    const studentId = localStorage.getItem("ID");
    
    if (!selectedFile) return;

    const reader = new FileReader();
    setLoading(true);
    setAnimationType(null); // Reset animation before upload

    reader.onload = async () => {
      const base64Image = reader.result.split(",")[1];

      try {
        const response = await axios.post(`${baseUrl}/users/upload-image`, {
          image: base64Image,
          ID: studentId
        });

        console.log("Response from backend:", response.data);

        if (response.data.success) {
          setAnimationType("success");
          toast.success("Successfully uploaded!");
        } else {
          setAnimationType("error");
          toast.error("Failed to upload image: " + response.data.message);
        }
      } catch (err) {
        console.error("Error uploading image:", err);
        setAnimationType("error");
        toast.error("Error uploading image");
      } finally {
        setLoading(false);
        setTimeout(() => setAnimationType(null), 3000); // Hide animation after 3s
        setSelectedFile(null);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  if (!dashboardData) {
    return <div>Loading dashboard...</div>;
  }

  const totalClasses = dashboardData.enrolledCourses.reduce((sum, course) => sum + course.total_classes, 0);
  const attendedClasses = dashboardData.enrolledCourses.reduce((sum, course) => sum + (course.total_classes > 0 ? 1 : 0), 0);
  const attendancePercentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg space-y-6">
      {/* Header with Add Photo Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Hello {dashboardData.name}</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Add Photo
        </button>
      </div>

      {/* Show Uploaded Image */}
      {uploadedImage && <img src={uploadedImage} alt="Uploaded" className="w-32 h-32 rounded-lg mt-4" />}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Enrolled Courses Table */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700">Enrolled Courses</h2>
        <table className="min-w-full mt-4 border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-left text-gray-700">Course ID</th>
              <th className="px-4 py-2 border-b text-left text-gray-700">Course Name</th>
              <th className="px-4 py-2 border-b text-left text-gray-700">Total Classes</th>
              <th className="px-4 py-2 border-b text-left text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.enrolledCourses.map((course) => (
              <tr key={course.course_id}>
                <td className="px-4 py-2 border-b text-gray-600">{course.course_id}</td>
                <td className="px-4 py-2 border-b text-gray-600">{course.name}</td>
                <td className="px-4 py-2 border-b text-gray-600">{course.total_classes}</td>
                <td className="px-4 py-2 border-b text-gray-600">
                  <button
                    onClick={() => handleViewAttendance(course.course_id)}
                    className="text-blue-500 hover:underline"
                  >
                    View Attendance
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upcoming Classes Section */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700">Upcoming Classes</h2>
        {upcomingClasses && upcomingClasses.length > 0 ? (
          <table className="min-w-full mt-4 border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-left text-gray-700">Course ID</th>
                <th className="px-4 py-2 border-b text-left text-gray-700">Course Name</th>
                <th className="px-4 py-2 border-b text-left text-gray-700">Date</th>
                <th className="px-4 py-2 border-b text-left text-gray-700">Time</th>
              </tr>
            </thead>
            <tbody>
              {upcomingClasses.map((classItem) => (
                <tr key={classItem.course_id}>
                  <td className="px-4 py-2 border-b text-gray-600">{classItem.course_id}</td>
                  <td className="px-4 py-2 border-b text-gray-600">{classItem.course_name}</td>
                  <td className="px-4 py-2 border-b text-gray-600">{classItem.date}</td>
                  <td className="px-4 py-2 border-b text-gray-600">{classItem.start_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 mt-2">No upcoming classes.</p>
        )}
      </div>

      {/* Add Photo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Upload Photo</h2>
            <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
            <div className="flex justify-end space-x-4 items-center">

              {/* ✅ Success Animation */}
              {animationType === "success" && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg shadow-md space-x-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Successfully Added!</span>
                </motion.div>
              )}

              {/* ❌ Error Animation */}
              {animationType === "error" && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg shadow-md space-x-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Failed to Add!</span>
                </motion.div>
              )}
              
              {/* Upload Button */}
              <button
                onClick={handleAddPhoto}
                disabled={loading}
                className={`relative flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                {loading ? (
                  <>
                    <span className="mr-2">Uploading...</span>
                    <div className="w-4 h-4 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin"></div>
                  </>
                ) : (
                  "Upload"
                )}
              </button>

              {/* Cancel Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>

              
            </div>
          </div>
        </div>
      )}

      {/* Loading Screen */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xl">
          Uploading...
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
