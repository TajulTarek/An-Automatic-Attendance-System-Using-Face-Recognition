import React, { useState, useEffect } from 'react';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

const AddTeacher = () => {
  // State declarations
  const [teacherID, setTeacherID] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFocus, setActiveFocus] = useState(null);
  const [showSuccessConfetti, setShowSuccessConfetti] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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
        setShowSuccessConfetti(true);
        setTimeout(() => setShowSuccessConfetti(false), 3000);

        // Clear form
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

  // Confetti component
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6 flex justify-center items-center">
      {/* Background decoration elements */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply opacity-10 blur-3xl"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply opacity-10 blur-3xl"></div>

      <div
        className="w-full max-w-md relative bg-white bg-opacity-80 backdrop-blur rounded-2xl shadow-xl overflow-hidden"
        style={{
          transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
          opacity: isLoaded ? 1 : 0,
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Decorative top bar */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        <div className="p-8 space-y-6">
          {/* Header with animations */}
          <div
            style={{
              transform: isLoaded ? 'translateY(0)' : 'translateY(-20px)',
              opacity: isLoaded ? 1 : 0,
              transition: 'all 0.5s ease',
              transitionDelay: '0.1s'
            }}
          >
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Add New Teacher</h1>
            <p className="text-gray-600 text-sm">Enter teacher details to register in the system</p>
          </div>

          {/* Teacher Form with staggered animations */}
          <div className="space-y-5">
            {/* Teacher ID Field */}
            <div
              style={{
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                opacity: isLoaded ? 1 : 0,
                transition: 'all 0.5s ease',
                transitionDelay: '0.2s'
              }}
              className="relative"
            >
              <label className={`absolute left-3 ${activeFocus === 'id' || teacherID ? 'text-xs text-indigo-600 top-1' : 'text-gray-500 top-1/2 -translate-y-1/2'} transition-all duration-200`}>
                Teacher ID
              </label>
              <input
                type="text"
                className={`w-full p-3 pt-6 border rounded-lg outline-none transition-all duration-300 ${activeFocus === 'id' ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-300'}`}
                value={teacherID}
                onChange={(e) => setTeacherID(e.target.value)}
                onFocus={() => setActiveFocus('id')}
                onBlur={() => setActiveFocus(null)}
              />
            </div>

            {/* Teacher Name Field */}
            <div
              style={{
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                opacity: isLoaded ? 1 : 0,
                transition: 'all 0.5s ease',
                transitionDelay: '0.3s'
              }}
              className="relative"
            >
              <label className={`absolute left-3 ${activeFocus === 'name' || teacherName ? 'text-xs text-indigo-600 top-1' : 'text-gray-500 top-1/2 -translate-y-1/2'} transition-all duration-200`}>
                Teacher Name
              </label>
              <input
                type="text"
                className={`w-full p-3 pt-6 border rounded-lg outline-none transition-all duration-300 ${activeFocus === 'name' ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-300'}`}
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                onFocus={() => setActiveFocus('name')}
                onBlur={() => setActiveFocus(null)}
              />
            </div>

            {/* Teacher Email Field */}
            <div
              style={{
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                opacity: isLoaded ? 1 : 0,
                transition: 'all 0.5s ease',
                transitionDelay: '0.4s'
              }}
              className="relative"
            >
              <label className={`absolute left-3 ${activeFocus === 'email' || teacherEmail ? 'text-xs text-indigo-600 top-1' : 'text-gray-500 top-1/2 -translate-y-1/2'} transition-all duration-200`}>
                Email Address
              </label>
              <input
                type="email"
                className={`w-full p-3 pt-6 border rounded-lg outline-none transition-all duration-300 ${activeFocus === 'email' ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-300'}`}
                value={teacherEmail}
                onChange={(e) => setTeacherEmail(e.target.value)}
                onFocus={() => setActiveFocus('email')}
                onBlur={() => setActiveFocus(null)}
              />
            </div>

            {/* Password Field */}
            <div
              style={{
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                opacity: isLoaded ? 1 : 0,
                transition: 'all 0.5s ease',
                transitionDelay: '0.5s'
              }}
              className="relative"
            >
              <label className={`absolute left-3 ${activeFocus === 'password' || password ? 'text-xs text-indigo-600 top-1' : 'text-gray-500 top-1/2 -translate-y-1/2'} transition-all duration-200`}>
                Password
              </label>
              <input
                type="password"
                className={`w-full p-3 pt-6 border rounded-lg outline-none transition-all duration-300 ${activeFocus === 'password' ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-gray-300'}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setActiveFocus('password')}
                onBlur={() => setActiveFocus(null)}
              />
            </div>

            {/* Submit Button */}
            <div
              style={{
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                opacity: isLoaded ? 1 : 0,
                transition: 'all 0.5s ease',
                transitionDelay: '0.6s'
              }}
            >
              <button
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-lg font-medium relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleAddTeacher}
                disabled={loading}
                style={{
                  transform: loading ? 'scale(0.98)' : 'scale(1)'
                }}
              >
                <div className="relative flex items-center justify-center">
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding Teacher...
                    </>
                  ) : (
                    'Add Teacher'
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-4 rounded-lg ${statusMessage.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'} flex items-center`}
              style={{
                animation: 'fadeInUp 0.5s ease-out forwards'
              }}
            >
              {statusMessage.includes('Error') ? (
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
              )}
              {statusMessage}
            </div>
          )}
        </div>

        {/* Success Confetti */}
        {showSuccessConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
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

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes confettiDrop {
          0% {
            transform: translateY(-10px) rotate(0deg) scale(0);
            opacity: 0;
          }
          10% {
            transform: translateY(-10px) rotate(45deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg) scale(0.5);
            opacity: 0;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AddTeacher;