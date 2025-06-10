import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ManageSchedules from './pages/ManageSchedules';
import ViewAttendance from './pages/ViewAttendance';
import AttendanceRecords from './pages/AttendanceRecords';
import AttendanceDetails from './pages/AttendanceDetails'; // ✅ Import the new page
import Login from './components/Login';
import Register from './components/Register';
import Camera from './components/Camera';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CameraPage from './components/Camera';
import ResetPassword from './pages/ResetPassword';
import PrivateRoute from './components/PrivateRoute';



const App = () => {
  const isLoggedIn = localStorage.getItem('ID');

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {isLoggedIn && <Navbar />} {/* ✅ show only if logged in */}
      <hr />
      <div className="flex w-full">
        {isLoggedIn && <Sidebar />} {/* ✅ show only if logged in */}
        <div className="w-[85%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<Login />} />

            {/* Protected routes */}
            <Route path="/teacher" element={<PrivateRoute><TeacherDashboard /></PrivateRoute>} />
            <Route path="/teacher/manage-schedules" element={<PrivateRoute><ManageSchedules /></PrivateRoute>} />
            <Route path="/teacher/view-attendance/:courseId" element={<PrivateRoute><ViewAttendance /></PrivateRoute>} />
            <Route path="/student" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
            <Route path="/student/attendance-records/:courseId" element={<PrivateRoute><AttendanceRecords /></PrivateRoute>} />
            <Route path="/attendance_details" element={<PrivateRoute><AttendanceDetails /></PrivateRoute>} />
            <Route path="/camera" element={<PrivateRoute><CameraPage /></PrivateRoute>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
