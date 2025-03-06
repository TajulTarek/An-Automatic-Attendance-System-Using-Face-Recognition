import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

const baseUrl = import.meta.env.VITE_BASE_URL;

const Login = ({}) => {
    const [uni_id, setuni_id] = useState('');
    const [password, setPassword] = useState('');
    const [usertype, setUsertype] = useState('users'); // Default user type

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
        <div className="min-h-screen flex items-center justify-center w-full">
            <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
                <h1 className="text-2xl font-bold mb-4">Login</h1>
                <form onSubmit={onSubmitHandler}>
                    <div className="mb-3 min-w-72">
                        <p className="text-sm font-medium text-gray-700 mb-2">Enter your ID</p>
                        <input
                            onChange={(e) => setuni_id(e.target.value)}
                            value={uni_id}
                            className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                            type="id"
                            placeholder="Enter your ID"
                            required
                        />
                    </div>
                    <div className="mb-3 min-w-72">
                        <p className="text-sm font-medium text-gray-700 mb-2">Password</p>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                            type="password"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div className="mb-3 min-w-72">
                        <p className="text-sm font-medium text-gray-700 mb-2">User Type</p>
                        <select
                            onChange={(e) => setUsertype(e.target.value)}
                            value={usertype}
                            className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
                            required
                        >
                            <option value="users">Student</option>
                            <option value="teachers">Teacher</option>
                        </select>
                    </div>
                    <button
                        className="mt-2 w-full py-2 px-4 rounded-md text-white bg-blue-500 hover:bg-blue-600"
                        type="submit"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
