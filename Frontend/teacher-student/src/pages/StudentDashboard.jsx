// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { motion } from "framer-motion";
// const baseUrl = import.meta.env.VITE_BASE_URL;

// const StudentDashboard = () => {
//   const [photoCount, setPhotoCount] = useState(null);

//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadedImage, setUploadedImage] = useState(null);
//   const [animationType, setAnimationType] = useState(null);
//   const [upcomingClasses, setUpcomingClasses] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const studentId = localStorage.getItem('ID');

//     const fetchPhotoCount = async () => {
//       try {
//         const res = await axios.get(`${baseUrl}/student-photos/photo_count/${studentId}`);
//         setPhotoCount(res.data.count);
//       } catch (error) {
//         console.error('Failed to fetch photo count:', error);
//       }
//     };

//     const fetchDashboardData = async () => {
//       try {
//         const response = await axios.get(`${baseUrl}/users/${studentId}`);
//         setDashboardData(response.data);
//         console.log("response ", response.data);
//       } catch (err) {
//         setError('Error fetching dashboard data');
//       }
//     };
//     const fetchUpcomingClasses = async () => {
//       try {
//         const response = await axios.get(`${baseUrl}/users/upcoming/${studentId}`);
//         setUpcomingClasses(response.data.upcomingClasses);
//       } catch (err) {
//         console.error("Error fetching upcoming classes:", err);
//         setError("Failed to load upcoming classes.");
//       }
//     };

//     if (studentId) {
//       fetchDashboardData();
//       fetchUpcomingClasses();
//       fetchPhotoCount();
//       console.log("Photo count",studentId, photoCount)
//       console.log("Dashboard Data", dashboardData);
//       console.log("Upcoming Class", upcomingClasses);
//     } else {
//       setError('Student ID not found in local storage');
//     }
//   }, []);

//   const handleViewAttendance = (courseId) => {
//     navigate(`/student/attendance-records/${courseId}`);
//   };

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   const handleAddPhoto = async () => {
//     const studentId = localStorage.getItem("ID");

//     if (!selectedFile) return;

//     const reader = new FileReader();
//     setLoading(true);
//     setAnimationType(null); // Reset animation before upload

//     reader.onload = async () => {
//       const base64Image = reader.result.split(",")[1];

//       try {
//         const response = await axios.post(`${baseUrl}/users/upload-image`, {
//           image: base64Image,
//           ID: studentId
//         });

//         console.log("Response from backend:", response.data);

//         if (response.data.success) {
//           setAnimationType("success");
//           toast.success("Successfully uploaded!");
//         } else {
//           setAnimationType("error");
//           toast.error("Failed to upload image: " + response.data.message);
//         }
//       } catch (err) {
//         console.error("Error uploading image:", err);
//         setAnimationType("error");
//         toast.error("Error uploading image");
//       } finally {
//         setLoading(false);
//         setTimeout(() => setAnimationType(null), 3000); // Hide animation after 3s
//         setSelectedFile(null);
//       }
//     };

//     reader.readAsDataURL(selectedFile);
//   };

//   if (!dashboardData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="flex flex-col items-center">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//           <p className="mt-4 text-lg font-medium text-gray-700">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   const totalClasses = dashboardData.enrolledCourses.reduce((sum, course) => sum + course.total_classes, 0);
//   const attendedClasses = dashboardData.enrolledCourses.reduce((sum, course) => sum + (course.total_classes > 0 ? 1 : 0), 0);
//   const attendancePercentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Dashboard Header */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//           <div className="flex items-center justify-between flex-wrap gap-4">
//             <div className="flex items-center space-x-4">
//               {uploadedImage ? (
//                 <img src={uploadedImage} alt="Student" className="w-16 h-16 rounded-full object-cover border-2 border-blue-500" />
//               ) : (
//                 <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl border-2 border-blue-500">
//                   {dashboardData.name.charAt(0)}
//                 </div>
//               )}
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-800">Hello, {dashboardData.name}</h1>
//                 <p className="text-gray-500">{dashboardData.uni_id}</p>
//                 {photoCount !== null && (
//                   <p className={`mt-1 font-medium ${photoCount >= 5 ? 'text-green-600' : 'text-red-500'}`}>
//                     {photoCount >= 5 ? '✔ Verified' : '✖ Unverified'}
//                   </p>
//                 )}
//               </div>
//             </div>
//             <button
//               onClick={() => navigate('/camera')}
//               className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 shadow-md"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
//               </svg>
//               <span>Upload Photo</span>
//             </button>
//           </div>
//         </div>


//         {/* Quick Stats Section */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//           {/* Total Courses */}
//           <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
//             <div className="rounded-full bg-blue-100 p-3 mr-4">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//               </svg>
//             </div>
//             <div>
//               <p className="text-gray-500 text-sm font-medium">Enrolled Courses</p>
//               <p className="text-2xl font-bold text-gray-800">{dashboardData.enrolledCourses.length}</p>
//             </div>
//           </div>

//           {/* Total Classes */}
//           <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
//             <div className="rounded-full bg-green-100 p-3 mr-4">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//             </div>
//             <div>
//               <p className="text-gray-500 text-sm font-medium">Total Classes</p>
//               <p className="text-2xl font-bold text-gray-800">{totalClasses}</p>
//             </div>
//           </div>

//           {/* Upcoming Classes */}
//           <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
//             <div className="rounded-full bg-purple-100 p-3 mr-4">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <div>
//               <p className="text-gray-500 text-sm font-medium">Upcoming Classes</p>
//               <p className="text-2xl font-bold text-gray-800">{upcomingClasses ? upcomingClasses.length : 0}</p>
//             </div>
//           </div>
//         </div>

//         {/* Enrolled Courses Section */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-bold text-gray-800 flex items-center">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//               </svg>
//               Enrolled Courses
//             </h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course ID</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Classes</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {dashboardData.enrolledCourses.map((course) => (
//                   <tr key={course.course_id} className="hover:bg-gray-50 transition duration-150">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">{course.course_id}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">{course.name}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">{course.total_classes}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <button
//                         onClick={() => handleViewAttendance(course.course_id)}
//                         className="inline-flex items-center px-3 py-1 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition duration-150"
//                       >
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                         </svg>
//                         View Attendance
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

        
//       </div>

//       {/* Add Photo Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//             <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
//             <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
//             <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//               <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                 <div className="sm:flex sm:items-start">
//                   <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                   </div>
//                   <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                     <h3 className="text-lg leading-6 font-medium text-gray-900">Upload Profile Photo</h3>
//                     <div className="mt-2">
//                       <p className="text-sm text-gray-500">
//                         Select an image to use as your profile photo. The photo will help in attendance recognition.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-4">
//                   <label htmlFor="photo-upload" className="block text-sm font-medium text-gray-700 mb-2">
//                     Photo
//                   </label>
//                   <div className="flex items-center">
//                     <div className="flex-1">
//                       <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//                         <div className="space-y-1 text-center">
//                           <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
//                             <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                           </svg>
//                           <div className="flex text-sm text-gray-600">
//                             <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
//                               <span>Upload a file</span>
//                               <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
//                             </label>
//                             <p className="pl-1">or drag and drop</p>
//                           </div>
//                           <p className="text-xs text-gray-500">
//                             PNG, JPG, GIF up to 10MB
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                 {/* Success Animation */}
//                 {animationType === "success" && (
//                   <motion.div
//                     initial={{ scale: 0.5, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     exit={{ scale: 0.5, opacity: 0 }}
//                     transition={{ duration: 0.5, ease: "easeOut" }}
//                     className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-md space-x-2 mr-3"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     <span>Successfully Added!</span>
//                   </motion.div>
//                 )}

//                 {/* Error Animation */}
//                 {animationType === "error" && (
//                   <motion.div
//                     initial={{ scale: 0.5, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     exit={{ scale: 0.5, opacity: 0 }}
//                     transition={{ duration: 0.5, ease: "easeOut" }}
//                     className="flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-md space-x-2 mr-3"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-5 w-5"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     <span>Failed to Add!</span>
//                   </motion.div>
//                 )}

//                 <button
//                   type="button"
//                   onClick={handleAddPhoto}
//                   disabled={loading || !selectedFile}
//                   className={`inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${(loading || !selectedFile) ? 'opacity-50 cursor-not-allowed' : ''
//                     }`}
//                 >
//                   {loading ? (
//                     <>
//                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Uploading...
//                     </>
//                   ) : 'Upload Photo'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Loading Screen */}
//       {loading && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded-lg shadow-xl flex items-center">
//             <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             <span className="text-gray-800 text-lg font-medium">Uploading your photo...</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentDashboard;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
const baseUrl = import.meta.env.VITE_BASE_URL;

const StudentDashboard = () => {
  const [photoCount, setPhotoCount] = useState(null);
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

    const fetchPhotoCount = async () => {
      try {
        const res = await axios.get(`${baseUrl}/student-photos/photo_count/${studentId}`);
        setPhotoCount(res.data.count);
      } catch (error) {
        console.error('Failed to fetch photo count:', error);
      }
    };

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/users/${studentId}`);
        setDashboardData(response.data);
        console.log("response ", response.data);
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
      fetchPhotoCount();
      console.log("Photo count",studentId, photoCount)
      console.log("Dashboard Data", dashboardData);
      console.log("Upcoming Class", upcomingClasses);
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
    setAnimationType(null);

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
        setTimeout(() => setAnimationType(null), 3000);
        setSelectedFile(null);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    toast.success('Logged out successfully!');
  };

  const handleResetPassword = () => {
    navigate('/reset-password');
  };

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalClasses = dashboardData.enrolledCourses.reduce((sum, course) => sum + course.total_classes, 0);
  const attendedClasses = dashboardData.enrolledCourses.reduce((sum, course) => sum + (course.total_classes > 0 ? 1 : 0), 0);
  const attendancePercentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Dashboard Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              {uploadedImage ? (
                <img src={uploadedImage} alt="Student" className="w-16 h-16 rounded-full object-cover border-2 border-blue-500" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl border-2 border-blue-500">
                  {dashboardData.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Hello, {dashboardData.name}</h1>
                <p className="text-gray-500">{dashboardData.uni_id}</p>
                {photoCount !== null && (
                  <div className="flex items-center">
                    {/* Text smoothly changes color */}
                    <p className={`mt-1 font-medium transition-colors duration-300 ${photoCount >= 5 ? 'text-green-600' : 'text-red-500'}`}>
                      {photoCount >= 5 ? '✔ Verified' : '✖ Unverified'}
                    </p>

                    {/* This block only renders if the user is not verified */}
                    {photoCount < 5 && (
                      <div className="relative group ml-2">
                        {/* Using an SVG icon instead of text '?' */}
                        <span className="cursor-help text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </span>

                        {/* Tooltip with fade-in/out transition */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg 
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          Please upload at least 8 photos to get verified
                          {/* Tooltip Arrow */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Button Group */}
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => navigate('/camera')}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                <span>Upload Photo</span>
              </button>
              
              {/* Reset Password Button */}
              <button
                onClick={handleResetPassword}
                className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Reset Password</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Total Courses */}
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Enrolled Courses</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardData.enrolledCourses.length}</p>
            </div>
          </div>

          {/* Total Classes */}
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Classes</p>
              <p className="text-2xl font-bold text-gray-800">{totalClasses}</p>
            </div>
          </div>

          {/* Upcoming Classes */}
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Upcoming Classes</p>
              <p className="text-2xl font-bold text-gray-800">{upcomingClasses ? upcomingClasses.length : 0}</p>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Enrolled Courses
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Classes</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.enrolledCourses.map((course) => (
                  <tr key={course.course_id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{course.course_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.total_classes}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewAttendance(course.course_id)}
                        className="inline-flex items-center px-3 py-1 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition duration-150"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Attendance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Photo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Upload Profile Photo</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Select an image to use as your profile photo. The photo will help in attendance recognition.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor="photo-upload" className="block text-sm font-medium text-gray-700 mb-2">
                    Photo
                  </label>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                              <span>Upload a file</span>
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {/* Success Animation */}
                {animationType === "success" && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-md space-x-2 mr-3"
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

                {/* Error Animation */}
                {animationType === "error" && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-md space-x-2 mr-3"
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

                <button
                  type="button"
                  onClick={handleAddPhoto}
                  disabled={loading || !selectedFile}
                  className={`inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${(loading || !selectedFile) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : 'Upload Photo'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Screen */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-800 text-lg font-medium">Uploading your photo...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;