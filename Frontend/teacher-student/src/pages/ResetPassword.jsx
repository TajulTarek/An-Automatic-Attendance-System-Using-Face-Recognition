import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const baseUrl = import.meta.env.VITE_BASE_URL;

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    name: '',
    uni_id: '',
    email: '',
    role: 'Student',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const navigate = useNavigate();

  // Auto-fill form with logged-in user data
  React.useEffect(() => {
    const userData = {
      name: localStorage.getItem('name') || '',
      uni_id: localStorage.getItem('uni_id') || '',
      email: localStorage.getItem('email') || '',
      role: localStorage.getItem('role') || 'Student'
    };
    
    if (userData.name) {
      setFormData(userData);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate user exists in database
  const validateUserExists = async () => {
    try {
      setValidating(true);
      console.log(`🔍 Validating user: ${formData.email}, ${formData.uni_id}`);

      const response = await axios.post(`${baseUrl}/api/users/validate-user`, {
        name: formData.name,
        uni_id: formData.uni_id,
        email: formData.email,
        role: formData.role
      });

      console.log(`✅ Validation response:`, response.data);
      return response.data;

    } catch (error) {
      console.error('❌ User validation error:', error);
      
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'User not found with provided information'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || 'Error validating user information'
      };
    } finally {
      setValidating(false);
    }
  };

const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.uni_id || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
  }
  
  if (!formData.newPassword || !formData.confirmPassword) {
    toast.error('Please enter and confirm the new password');
    return;
  }

  if (formData.newPassword !== formData.confirmPassword) {
    toast.error('Passwords do not match');
    return;
  }

    try {
      // Step 1: Validate user exists
      console.log(`🔍 Step 1: Validating user information...`);
      const validation = await validateUserExists();
      
      if (!validation.success) {
        toast.error(`❌ ${validation.message}`);
        
        // Show detailed error message
        const errorDetails = `
📋 User Information Not Found!

The following information doesn't match our records:
• Name: ${formData.name}
• University ID: ${formData.uni_id}
• Email: ${formData.email}
• Role: ${formData.role}

Please verify your information and try again.
        `.trim();
        
        alert(errorDetails);
        return;
      }

      console.log(`✅ User validation successful!`);
      //toast.success(`✅ User found! Processing password reset...`);

      // Step 2: Process password reset
      setLoading(true);
      //console.log(`🔄 Step 2: Requesting password reset for ${formData.email}`);
      
      const response = await axios.post(`${baseUrl}/api/users/reset-password`, {
        name: formData.name,
        uni_id: formData.uni_id,
        email: formData.email,
        role: formData.role,
        newPassword: formData.newPassword
      });

      console.log(`📧 Reset response:`, response.data);

      if (response.data.success) {
        //toast.success(`✅ Password reset instructions sent to ${formData.email}!`);
        
        // Show success alert WITHOUT showing the password
        // alert(`🔑 Password Reset Successful!\n\n` +
        //       `📧 Email: ${formData.email}\n` +
        //       `🆔 University ID: ${formData.uni_id}\n\n` +
        //       `New login credentials have been sent to your email.\n` +
        //       `Please check your inbox for detailed instructions.\n\n` +
        //   `⚠️ For security reasons, your new password is only sent via email.`);
        
        alert(`🔑 Password Reset Successful!\n`);
        
        // Navigate back after 3 seconds
        setTimeout(() => {
          navigate(-1);
        }, 1000);
        
      } else {
        toast.error(`❌ ${response.data.message}`);
      }

    } catch (error) {
      console.error('❌ Password reset error:', error);
      
      if (error.response?.data?.message) {
        toast.error(`❌ ${error.response.data.message}`);
      } else {
        toast.error('❌ Failed to send password reset request');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-gray-600">
            Enter your details to receive new login credentials via email
          </p>
        </div>

        {/* Reset Password Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleResetPassword} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            {/* University ID Field */}
            <div>
              <label htmlFor="uni_id" className="block text-sm font-medium text-gray-700 mb-2">
                University ID *
              </label>
              <input
                id="uni_id"
                name="uni_id"
                type="text"
                required
                value={formData.uni_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter your university ID"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter your email address"
              />
            </div>

            {/* Role Field */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
              </select>
            </div>

            {/* New Password Field */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password *
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter new password"
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>

            

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || validating}
              className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white transition duration-300 ${
                (loading || validating)
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500'
              }`}
            >
              {validating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Validating User Information...
                </>
              ) : loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Reset Instructions...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Send Reset Instructions
                </>
              )}
            </button>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Dashboard
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-700">
              <p className="font-semibold mb-1">📧 What happens next?</p>
              <ul className="space-y-1">
                <li>• Your information will be verified against our database</li>
                {/* <li>• A new password will be generated automatically</li> */}
                {/* <li>• Login credentials will be sent to your email</li> */}
                <li>• Use the new password to login to the system</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;