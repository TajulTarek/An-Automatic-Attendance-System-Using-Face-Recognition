// components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem('ID'); // ✅ Adjust to your auth logic

    return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
