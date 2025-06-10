// import React from 'react';
// import { Link } from 'react-router-dom'; // Import Link from react-router-dom

// const AdminDashboard = () => {
//   // Sample data for Admin Dashboard
//   const activeCourses = 15;
//   const activeTeachers = 10;
//   const totalStudents = 250;

//   const attendanceStatistics = {
//     totalClasses: 100,
//     attendedClasses: 90,
//     attendancePercentage: (90 / 100) * 100,
//   };

//   return (
//     <div className="p-8 bg-white shadow-lg rounded-lg space-y-6">
//       {/* Header Section */}
//       <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>

//       {/* Overview Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         <div className="bg-gray-100 p-4 rounded-lg shadow">
//           <h2 className="text-xl font-semibold text-gray-700">Active Courses</h2>
//           <p className="text-gray-600 mt-2">{activeCourses} courses are currently active</p>
//         </div>
//         <div className="bg-gray-100 p-4 rounded-lg shadow">
//           <h2 className="text-xl font-semibold text-gray-700">Active Teachers</h2>
//           <p className="text-gray-600 mt-2">{activeTeachers} teachers are assigned</p>
//         </div>
//         <div className="bg-gray-100 p-4 rounded-lg shadow">
//           <h2 className="text-xl font-semibold text-gray-700">Total Students</h2>
//           <p className="text-gray-600 mt-2">{totalStudents} students are enrolled</p>
//         </div>
//       </div>

//       {/* Attendance Statistics Section */}
//       <div className="bg-gray-100 p-4 rounded-lg shadow">
//         <h2 className="text-xl font-semibold text-gray-700">Attendance Statistics</h2>
//         <p className="text-gray-600 mt-2">Total Classes: {attendanceStatistics.totalClasses}</p>
//         <p className="text-gray-600">Attended Classes: {attendanceStatistics.attendedClasses}</p>
//         <p className={`text-gray-600 ${attendanceStatistics.attendancePercentage < 75 ? 'text-red-500' : 'text-green-500'}`}>
//           Attendance: {attendanceStatistics.attendancePercentage.toFixed(2)}%
//         </p>
//       </div>

//       {/* Quick Actions Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         <Link to="/admin/create-courses">
//           <div className="bg-blue-500 text-white p-4 rounded-lg text-center shadow cursor-pointer">
//             <h3 className="text-xl font-semibold">Add Course</h3>
//           </div>
//         </Link>
//         <Link to="/admin/add-student">
//           <div className="bg-yellow-500 text-white p-4 rounded-lg text-center shadow cursor-pointer">
//             <h3 className="text-xl font-semibold">Add Student</h3>
//           </div>
//         </Link>
//         <Link to="/admin/add-teacher">
//           <div className="bg-green-500 text-white p-4 rounded-lg text-center shadow cursor-pointer">
//             <h3 className="text-xl font-semibold">Add Teacher</h3>
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

const AdminDashboard = () => {
  // Sample data for Admin Dashboard
  const activeCourses = 15;
  const activeTeachers = 10;
  const totalStudents = 250;

  const attendanceStatistics = {
    totalClasses: 100,
    attendedClasses: 90,
    attendancePercentage: (90 / 100) * 100,
  };

  // Enrollment requests state
  const [enrollmentStats, setEnrollmentStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });

  // Fetch enrollment statistics
  const fetchEnrollmentStats = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/enrollment/all`);
      const requests = response.data.data || [];
      
      const stats = {
        pending: requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        rejected: requests.filter(r => r.status === 'rejected').length,
        total: requests.length
      };
      
      setEnrollmentStats(stats);
    } catch (error) {
      console.error('Error fetching enrollment stats:', error);
    }
  };

  useEffect(() => {
    fetchEnrollmentStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchEnrollmentStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button 
          onClick={fetchEnrollmentStats}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Overview Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700">Active Courses</h2>
          <p className="text-gray-600 mt-2">{activeCourses} courses are currently active</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700">Active Teachers</h2>
          <p className="text-gray-600 mt-2">{activeTeachers} teachers are assigned</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700">Total Students</h2>
          <p className="text-gray-600 mt-2">{totalStudents} students are enrolled</p>
        </div>
      </div>

      {/* Enrollment Requests Statistics */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg shadow-md border">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">📋 Enrollment Requests</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-yellow-100 p-4 rounded-lg text-center border-l-4 border-yellow-500">
            <h3 className="text-2xl font-bold text-yellow-700">{enrollmentStats.pending}</h3>
            <p className="text-yellow-600">⏳ Pending</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center border-l-4 border-green-500">
            <h3 className="text-2xl font-bold text-green-700">{enrollmentStats.approved}</h3>
            <p className="text-green-600">✅ Approved</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg text-center border-l-4 border-red-500">
            <h3 className="text-2xl font-bold text-red-700">{enrollmentStats.rejected}</h3>
            <p className="text-red-600">❌ Rejected</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg text-center border-l-4 border-blue-500">
            <h3 className="text-2xl font-bold text-blue-700">{enrollmentStats.total}</h3>
            <p className="text-blue-600">📊 Total</p>
          </div>
        </div>
      </div>

      {/* Attendance Statistics Section */}
      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700">Attendance Statistics</h2>
        <p className="text-gray-600 mt-2">Total Classes: {attendanceStatistics.totalClasses}</p>
        <p className="text-gray-600">Attended Classes: {attendanceStatistics.attendedClasses}</p>
        <p className={`text-gray-600 ${attendanceStatistics.attendancePercentage < 75 ? 'text-red-500' : 'text-green-500'}`}>
          Attendance: {attendanceStatistics.attendancePercentage.toFixed(2)}%
        </p>
      </div>

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Add Course */}
        <Link to="/admin/create-courses">
          <div className="bg-blue-500 text-white p-6 rounded-lg text-center shadow-lg cursor-pointer hover:bg-blue-600 transition-colors">
            <div className="text-4xl mb-2">📚</div>
            <h3 className="text-xl font-semibold">Add Course</h3>
            <p className="text-blue-100 mt-2">Create new courses</p>
          </div>
        </Link>

        {/* Manage Enrollment Requests */}
        

<Link to="/admin/enrollment-management">
  <div className="bg-purple-500 text-white p-6 rounded-lg text-center shadow-lg cursor-pointer hover:bg-purple-600 transition-colors relative">
    <div className="text-4xl mb-2">📋</div>
    <h3 className="text-xl font-semibold">Enrollment Management</h3>
    <p className="text-purple-100 mt-2">Approve or reject requests</p>
    {enrollmentStats.pending > 0 && (
      <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
        {enrollmentStats.pending}
      </div>
    )}
  </div>
</Link>
        {/* <Link to="/admin/enrollment-requests">
          <div className="bg-purple-500 text-white p-6 rounded-lg text-center shadow-lg cursor-pointer hover:bg-purple-600 transition-colors relative">
            <div className="text-4xl mb-2">📋</div>
            <h3 className="text-xl font-semibold">Enrollment Requests</h3>
            <p className="text-purple-100 mt-2">Approve or reject requests</p>
            {enrollmentStats.pending > 0 && (
              <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                {enrollmentStats.pending}
              </div>
            )}
          </div>
        </Link> */}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-gray-50 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">🔔 Recent Activity</h2>
        <div className="space-y-3">
          {enrollmentStats.pending > 0 && (
            <div className="flex items-center p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <div className="text-yellow-500 mr-3">⏳</div>
              <div>
                <p className="text-gray-800 font-medium">
                  {enrollmentStats.pending} new enrollment request{enrollmentStats.pending > 1 ? 's' : ''} pending review
                </p>
                <p className="text-gray-600 text-sm">Click on "Enrollment Requests" to review</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
            <div className="text-blue-500 mr-3">📊</div>
            <div>
              <p className="text-gray-800 font-medium">System running smoothly</p>
              <p className="text-gray-600 text-sm">All services are operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;