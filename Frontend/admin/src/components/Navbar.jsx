import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import sustlogo from '../assets/sustlogo.png';
import profile_icon from '../assets/profile_icon.png';

const Navbar = ({ setToken }) => {
    const [isHovered, setIsHovered] = useState(false);
    let hoverTimeout;
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        hoverTimeout = setTimeout(() => {
            setIsHovered(false);
        }, 300);
    };

    const handleLogout = () => {
        localStorage.removeItem('userType');
        localStorage.removeItem('ID');

        navigate('/login');
    };

    return (
        <div className='flex items-center py-3 px-6 justify-between bg-gradient-to-r blue-600 shadow-lg'>
            <div className="flex items-center mr-auto">
                <Link to="/" className="flex items-center">
                    <img
                        src={sustlogo}
                        alt="logo"
                        className="w-[50px] h-auto sm:w-[20px] md:w-[60px] max-w-full cursor-pointer transition-transform duration-300 hover:scale-105"
                    />
                    <span className="ml-3 text-black font-bold text-lg hidden md:block">SUST Attendance</span>
                </Link>
            </div>

            <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="flex items-center bg-white bg-opacity-20 rounded-full p-1 cursor-pointer hover:bg-opacity-30 transition-all duration-300">
                    <img
                        src={profile_icon}
                        alt="Profile"
                        className="w-[40px] h-[40px] rounded-full border-2 border-white"
                    />
                    <span className="text-black ml-2 mr-2 hidden md:block">Account</span>
                </div>

                {isHovered && (
                    <button
                        onClick={handleLogout}
                        className="absolute right-0 top-full mt-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md text-sm font-medium shadow-md transition-all duration-300 w-full md:w-auto"
                    >
                        Logout
                    </button>
                )}
            </div>
        </div>
    );
};

export default Navbar;