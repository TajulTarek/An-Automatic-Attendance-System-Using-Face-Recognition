import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Sidebar = () => {
    const [usertype, setUsertype] = useState('');

    useEffect(() => {
        // Retrieve usertype from localStorage
        const storedUsertype = localStorage.getItem('usertype');
        setUsertype(storedUsertype);
    }, []);

    return (
        <div className='w-[12%] min-h-screen border-r-2'>
            <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>
                {usertype === 'teachers' && (
                    <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
                        to="/teacher">
                        <img className='w-5 h-5' src={assets.order_icon} alt="" />
                        <p className='hidden md:block'>Teachers Dashboard</p>
                    </NavLink>
                )}

                {usertype === 'users' && (
                    <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
                        to="/student">
                        <img className='w-5 h-5' src={assets.order_icon} alt="" />
                        <p className='hidden md:block'>Student Dashboard</p>
                    </NavLink>
                )}
            </div>
        </div>
    );
}

export default Sidebar;