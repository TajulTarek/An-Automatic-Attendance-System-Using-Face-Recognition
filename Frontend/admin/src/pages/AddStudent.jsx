import React, { useState } from 'react';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

const AddStudent = () => {
  // State for student form fields
  const [studentName, setStudentName] = useState('');
  const [studentID, setStudentID] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle adding the new student
  const handleAddStudent = async () => {
    if (studentName && studentID && studentEmail && password) {
      setLoading(true);

      try {
        const response = await axios.post(`${baseUrl}/users/add`, {
          name: studentName,
          uni_id: studentID,
          email: studentEmail,
          password: password,
        });

        // Handle successful student addition
        setStatusMessage('Student added successfully!');
        setStudentName('');
        setStudentID('');
        setStudentEmail('');
        setPassword('');
      } catch (err) {
        // Handle error
        setStatusMessage('Error adding student. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setStatusMessage('Please fill in all the fields.');
    }
  };

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Add New Student</h1>

      {/* Student Form */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Student Name"
          className="border p-2 rounded"
          onChange={(e) => setStudentName(e.target.value)}
          value={studentName}
        />
        <input
          type="text"
          placeholder="Student ID"
          className="border p-2 rounded"
          onChange={(e) => setStudentID(e.target.value)}
          value={studentID}
        />
        <input
          type="email"
          placeholder="Student Email"
          className="border p-2 rounded"
          onChange={(e) => setStudentEmail(e.target.value)}
          value={studentEmail}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={handleAddStudent}
          disabled={loading} // Disable button when loading
        >
          {loading ? 'Adding Student...' : 'Add Student'}
        </button>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div className={`mt-4 text-lg ${statusMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default AddStudent;
