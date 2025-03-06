import React, { useState } from 'react';

const CreateCourses = () => {
  // State for form data
  const [courseId, setCourseId] = useState('');
  const [courseName, setCourseName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [studentIds, setStudentIds] = useState('');
  const [courses, setCourses] = useState([]);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCourseData = {
      course_id: courseId,
      name: courseName,
      teacher_id: teacherId,
      student_ids: studentIds ? studentIds.split(',').map(id => id.trim()) : [],
      total_class: 0,
      classes: []
    };

    try {
      const response = await fetch(`${baseUrl}/courses/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCourseData),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Course created successfully');
        setCourses([...courses, newCourseData]);
      } else {
        console.error('Failed to create course');
      }
    } catch (error) {
      console.error('Error:', error);
    }

    // Reset form fields
    setCourseId('');
    setCourseName('');
    setTeacherId('');
    setStudentIds('');
  };

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Create Course</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600">Course ID</label>
            <input
              type="text"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600">Course Name</label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600">Teacher ID</label>
            <input
              type="text"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600">Student IDs (comma-separated)</label>
            <input
              type="text"
              value={studentIds}
              onChange={(e) => setStudentIds(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g. 2020331067,2020331002,2020331023"
              required
            />
          </div>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg">Create Course</button>
      </form>

      
    </div>
  );
};

export default CreateCourses;
