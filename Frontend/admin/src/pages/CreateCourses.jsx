import React, { useState, useEffect } from 'react';

const CreateCourses = () => {
  // Existing state declarations remain the same
  const [courseId, setCourseId] = useState('');
  const [courseName, setCourseName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [studentIds, setStudentIds] = useState('');
  const [courses, setCourses] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFocus, setActiveFocus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [showSuccessConfetti, setShowSuccessConfetti] = useState(false);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (courseId && courseName && teacherId && studentIds) {
      setLoading(true);

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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCourseData),
        });

        if (response.ok) {
          setStatusMessage('Course created successfully!');
          setShowSuccessConfetti(true);
          setTimeout(() => setShowSuccessConfetti(false), 3000);
          setCourses([...courses, newCourseData]);

          // Clear form
          setCourseId('');
          setCourseName('');
          setTeacherId('');
          setStudentIds('');
        } else {
          setStatusMessage('Error creating course. Please try again.');
        }
      } catch (error) {
        setStatusMessage('Error: Could not connect to server.');
      } finally {
        setLoading(false);
      }
    } else {
      setStatusMessage('Please fill in all fields.');
    }
  };

  // Confetti component from previous example
  const ConfettiDot = ({ delay, top, left }) => (
    <div
      className="absolute h-2 w-2 rounded-full"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#7209B7'][Math.floor(Math.random() * 5)],
        animation: `confettiDrop 1s ease-out ${delay}s both`
      }}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6 flex justify-center items-center">
      {/* Background decorations */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply opacity-10 blur-3xl"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply opacity-10 blur-3xl"></div>

      <div
        className="w-full max-w-2xl relative bg-white bg-opacity-80 backdrop-blur rounded-2xl shadow-xl overflow-hidden"
        style={{
          transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
          opacity: isLoaded ? 1 : 0,
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Decorative top bar */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Create New Course</h1>
            <p className="text-gray-600 mt-2">Enter course details to create a new class</p>
          </div>

          {/* Form fields */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Course ID */}
            <div className="relative">
              <label className={`absolute left-3 ${activeFocus === 'courseId' || courseId ? 'text-xs text-blue-600 top-1' : 'text-gray-500 top-1/2 -translate-y-1/2'} transition-all duration-200`}>
                Course ID
              </label>
              <input
                type="text"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                onFocus={() => setActiveFocus('courseId')}
                onBlur={() => setActiveFocus(null)}
                className={`w-full p-3 pt-6 border rounded-lg outline-none transition-all duration-300 ${activeFocus === 'courseId' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300'}`}
              />
            </div>

            {/* Similar structure for other fields */}
            {/* Course Name */}
            <div className="relative">
              <label className={`absolute left-3 ${activeFocus === 'courseName' || courseName ? 'text-xs text-blue-600 top-1' : 'text-gray-500 top-1/2 -translate-y-1/2'} transition-all duration-200`}>
                Course Name
              </label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                onFocus={() => setActiveFocus('courseName')}
                onBlur={() => setActiveFocus(null)}
                className={`w-full p-3 pt-6 border rounded-lg outline-none transition-all duration-300 ${activeFocus === 'courseName' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300'}`}
              />
            </div>

            {/* Teacher ID */}
            <div className="relative">
              <label className={`absolute left-3 ${activeFocus === 'teacherId' || teacherId ? 'text-xs text-blue-600 top-1' : 'text-gray-500 top-1/2 -translate-y-1/2'} transition-all duration-200`}>
                Teacher ID
              </label>
              <input
                type="text"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                onFocus={() => setActiveFocus('teacherId')}
                onBlur={() => setActiveFocus(null)}
                className={`w-full p-3 pt-6 border rounded-lg outline-none transition-all duration-300 ${activeFocus === 'teacherId' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300'}`}
              />
            </div>

            {/* Student IDs */}
            <div className="relative">
              <label className={`absolute left-3 ${activeFocus === 'studentIds' || studentIds ? 'text-xs text-blue-600 top-1' : 'text-gray-500 top-1/2 -translate-y-1/2'} transition-all duration-200`}>
                Student IDs (comma-separated)
              </label>
              <input
                type="text"
                value={studentIds}
                onChange={(e) => setStudentIds(e.target.value)}
                onFocus={() => setActiveFocus('studentIds')}
                onBlur={() => setActiveFocus(null)}
                className={`w-full p-3 pt-6 border rounded-lg outline-none transition-all duration-300 ${activeFocus === 'studentIds' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300'}`}
                placeholder="e.g. 2020331067,2020331002"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-lg font-medium relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Course...
                </div>
              ) : (
                'Create Course'
              )}
            </button>
          </form>

          {/* Status Message */}
          {statusMessage && (
            <div className={`p-4 rounded-lg ${statusMessage.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {statusMessage}
            </div>
          )}

          {/* Success Confetti */}
          {showSuccessConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 50 }).map((_, i) => (
                <ConfettiDot
                  key={i}
                  delay={Math.random() * 0.5}
                  top={Math.random() * 100}
                  left={Math.random() * 100}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes confettiDrop {
          0% { transform: translateY(-10px) rotate(0deg) scale(0); opacity: 0; }
          10% { transform: translateY(-10px) rotate(45deg) scale(1); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg) scale(0.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default CreateCourses;