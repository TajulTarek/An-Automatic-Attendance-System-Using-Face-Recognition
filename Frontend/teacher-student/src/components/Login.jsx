import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

const baseUrl = import.meta.env.VITE_BASE_URL;

const Login = ({ }) => {
    const [uni_id, setuni_id] = useState('');
    const [password, setPassword] = useState('');
    const [usertype, setUsertype] = useState('users');

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        console.log(uni_id, password, usertype);

        // Prepare data based on usertype
        const payload = usertype === "teachers"
            ? { teacher_id: uni_id, password }
            : { uni_id, password };

        // API endpoint for login
        const endpoint = `${baseUrl}/${usertype}/login`;

        try {
            // Make the API request
            const response = await axios.post(endpoint, payload);

            // Handle the response
            if (response.data.success) {
                // Save user type and ID in localStorage
                localStorage.setItem("usertype", usertype);
                localStorage.setItem("ID", usertype === "teachers" ? response.data.user.teacher_id : response.data.user.uni_id);

                // Show success toast
                toast.success(response.data.message, { autoClose: 3000 });

                // Redirect to the appropriate page after 3 seconds
                setTimeout(() => {
                    if (usertype === "teachers") {
                        window.location.href = "/teacher";
                    } else {
                        window.location.href = "/student";
                    }
                }, 3000);
            } else {
                // Show error toast
                toast.error(response.data.message, { autoClose: 3000 });
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "An error occurred", { autoClose: 3000 });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="w-full max-w-md p-10 bg-white rounded-2xl shadow-xl transform transition-all">
                

                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h1>

                <form onSubmit={onSubmitHandler} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="uni_id">
                            University ID
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                id="uni_id"
                                onChange={(e) => setuni_id(e.target.value)}
                                value={uni_id}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                type="text"
                                placeholder="Enter your ID"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                type="password"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="usertype">
                            I am a
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                </svg>
                            </div>
                            <select
                                id="usertype"
                                onChange={(e) => setUsertype(e.target.value)}
                                value={usertype}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                                required
                            >
                                <option value="users">Student</option>
                                <option value="teachers">Teacher</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember_me" name="remember_me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </span>
                            Sign in
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-500">
                        Need an account? <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Contact administrator</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;