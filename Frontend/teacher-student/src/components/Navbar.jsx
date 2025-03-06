import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

import sustlogo from '../assets/sustlogo.png';
import profile_icon from '../assets/profile_icon.png';

const Navbar = ({ setToken }) => {
    const [isHovered, setIsHovered] = useState(false);
    let hoverTimeout;
    const navigate = useNavigate(); // Initialize useNavigate

    const handleMouseEnter = () => {
        clearTimeout(hoverTimeout);
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        hoverTimeout = setTimeout(() => {
            setIsHovered(false);
        }, 300); // Adjust the delay time as needed (300ms in this case)
    };

    const handleLogout = () => {
        localStorage.removeItem('userType');
        localStorage.removeItem('ID');
        
        navigate('/login'); 
    };

    return (
        <div className='flex items-center py-4 px-[3%] justify-between bg-gray-100 shadow-md'>
            <div className="flex items-center mr-auto">
                <Link to="/">
                    <img
                        src={sustlogo}
                        alt="logo"
                        className="w-[50px] h-auto sm:w-[20px] md:w-[60px] max-w-full cursor-pointer"
                    />
                </Link>
            </div>

            <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <img
                    src={profile_icon}
                    alt="Profile"
                    className="w-[40px] h-[40px] rounded-full cursor-pointer"
                />

                {isHovered && (
                    <button
                        onClick={handleLogout} // Use the handleLogout function
                        className="absolute right-0 top-full mt-2 bg-gray-400 text-white px-4 py-2 rounded-full text-sm sm:text-base"
                    >
                        Logout
                    </button>
                )}
            </div>
        </div>
    );
};

export default Navbar;