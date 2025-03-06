import React, { useState } from 'react';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

const AddTeacher = () => {
  // State for teacher info
  const [teacherID, setTeacherID] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddTeacher = async () => {
    if (teacherID && teacherName && teacherEmail && password) {
      setLoading(true);

      try {
        const response = await axios.post(`${baseUrl}/teachers/add`, {
          teacher_id: teacherID,
          name: teacherName,
          email: teacherEmail,
          password: password,
        });

        setStatusMessage('Teacher added successfully!');
        setTeacherID('');
        setTeacherName('');
        setTeacherEmail('');
        setPassword('');
      } catch (err) {
        setStatusMessage('Error adding teacher. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setStatusMessage('Please fill in all the fields.');
    }
  };

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Add Teacher</h1>

      {/* Teacher Info Form */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Teacher ID"
          className="border p-2 rounded"
          onChange={(e) => setTeacherID(e.target.value)}
          value={teacherID}
        />
        <input
          type="text"
          placeholder="Teacher Name"
          className="border p-2 rounded"
          onChange={(e) => setTeacherName(e.target.value)}
          value={teacherName}
        />
        <input
          type="email"
          placeholder="Teacher Email"
          className="border p-2 rounded"
          onChange={(e) => setTeacherEmail(e.target.value)}
          value={teacherEmail}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        {/* Add Teacher Button */}
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={handleAddTeacher}
          disabled={loading}
        >
          {loading ? 'Adding Teacher...' : 'Add Teacher'}
        </button>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div className="mt-4 text-center text-gray-700">
          <p>{statusMessage}</p>
        </div>
      )}
    </div>
  );
};

export default AddTeacher;
