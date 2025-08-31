import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { cloudinaryConfig } from '../config/cloudinary';

const baseUrl = import.meta.env.VITE_BASE_URL;

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        registrationNumber: '',
        email: '',
        role: 'student'
    });
    const [idCardImage, setIdCardImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [cloudinaryUrl, setCloudinaryUrl] = useState('');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // ✅ Function to handle image selection and upload to Cloudinary
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIdCardImage(file);
            
            // Create local preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // 🚀 Upload to Cloudinary and get URL
            await uploadToCloudinary(file);
        }
    };

    // ✅ Function to upload to Cloudinary
    const uploadToCloudinary = async (file) => {
        try {
            console.log('🔄 Uploading to Cloudinary...');
            console.log('📁 File details:', {
                name: file.name,
                size: file.size,
                type: file.type
            });
            
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', cloudinaryConfig.uploadPreset);
            formData.append('cloud_name', cloudinaryConfig.cloudName);

            console.log('🚀 Uploading to:', `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`);
            console.log('📋 Upload preset:', cloudinaryConfig.uploadPreset);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            const result = await response.json();

            if (response.ok) {
                console.log('✅ Cloudinary upload successful!');
                console.log('📷 Image URL:', result.secure_url);
                console.log('🔗 Public ID:', result.public_id);
                console.log('📋 Full response:', result);
                
                // Store the Cloudinary URL
                setCloudinaryUrl(result.secure_url);
                
            } else {
                console.error('❌ Cloudinary upload failed:', result);
                console.error('❌ Error details:', result.error);
                toast.error('Failed to upload image. Please try again.');
            }

        } catch (error) {
            console.error('❌ Error uploading to Cloudinary:', error);
            toast.error('Error uploading image. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Check if image was uploaded to Cloudinary
        if (!cloudinaryUrl) {
            toast.error('Please wait for image upload to complete');
            setLoading(false);
            return;
        }

        // Send JSON data to backend
        const submitData = {
            name: formData.name,
            registrationNumber: formData.registrationNumber,
            email: formData.email,
            role: formData.role,
            idCardImage: cloudinaryUrl // Send Cloudinary URL as string
        };

        try {
            console.log('📤 Sending registration data:', submitData);

            const response = await axios.post(
                `${baseUrl}/api/enrollment/submit`,
                submitData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('📝 Registration response:', response.data);
            //toast.success('Registration request submitted successfully! You will be notified via email once reviewed.', { autoClose: 5000 });
            
            alert(
                "🔑 Registration Request Submitted Successfully!\n\n" +
                "📩 You will be notified via email once your request is reviewed.\n\n" +
                "📬 If you don’t see the email in your inbox, please check your spam or junk folder."
            );
              
            // Reset form
            setFormData({
                name: '',
                registrationNumber: '',
                email: '',
                role: 'student'
            });
            setIdCardImage(null);
            setImagePreview(null);
            setCloudinaryUrl('');

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/');
            }, 3000);
            
        } catch (error) {
            console.error('❌ Registration error:', error);
            toast.error(error.response?.data?.message || 'Error submitting registration request', { autoClose: 5000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Registration Request
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Submit your information to request access
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Registration Number / ID
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                name="registrationNumber"
                                value={formData.registrationNumber}
                                onChange={handleInputChange}
                                required
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter your registration number"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter your email address"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            I am a
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                </svg>
                            </div>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                            >
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ID Card Image
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        
                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="mt-3">
                                <img
                                    src={imagePreview}
                                    alt="ID Card Preview"
                                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                                />
                            </div>
                        )}

                        {/* Upload Status */}
                        {cloudinaryUrl && (
                            <div className="mt-2 text-sm text-green-600">
                                ✅ Image uploaded successfully
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={loading || !cloudinaryUrl}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <svg className="h-5 w-5 text-green-500 group-hover:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                            {loading ? 'Submitting Request...' : 'Submit Registration Request'}
                        </button>

                        <Link
                            to="/"
                            className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <svg className="h-5 w-5 text-gray-500 group-hover:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </span>
                            Back to Login
                        </Link>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm px-4">
                    <p className="text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        Your registration request will be review by an administrator. Once approved, your login credentials will be sent to your registered email address.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Register;