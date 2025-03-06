import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import sustlogo from '../assets/sustlogo.png';
import profile_icon from '../assets/profile_icon.png';

const Navbar = ({ setToken }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div className='flex items-center py-4 px-[6%] justify-between bg-gray-100 shadow-md'>
            <div className="flex items-center mr-auto">
                <Link to="/">
                    <img
                        src={sustlogo}
                        alt="logo"
                        className="w-[50px] h-auto sm:w-[50px] md:w-[120px] max-w-full cursor-pointer"
                    />
                </Link>
            </div>

            
            <div
                className="relative"
                onMouseEnter={() => setIsHovered(true)}  
                onMouseLeave={() => setIsHovered(false)} 
            >
                <img
                    src={profile_icon}
                    alt="Profile"
                    className="w-[40px] h-[40px] rounded-full cursor-pointer"
                />

                {isHovered && (
                    <button
                        onClick={() => setToken('')}
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
