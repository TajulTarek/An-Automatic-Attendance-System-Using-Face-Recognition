import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ManageSchedules from './pages/ManageSchedules';
import ViewAttendance from './pages/ViewAttendance';
import ViewCourses from './pages/ViewCourses';
import AttendanceRecords from './pages/AttendanceRecords';
import AttendanceDetails from './pages/AttendanceDetails'; // ✅ Import the new page
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="flex w-full">
        <Sidebar />
        <div className="w-[85%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base">
          <Routes>
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/manage-schedules" element={<ManageSchedules />} />
            <Route path="/teacher/view-attendance/:courseId" element={<ViewAttendance />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/view-courses" element={<ViewCourses />} />
            <Route path="/student/attendance-records/:courseId" element={<AttendanceRecords />} />
            <Route path="/attendance_details" element={<AttendanceDetails />} /> {/* ✅ New route added */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
