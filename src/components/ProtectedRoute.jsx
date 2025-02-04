import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
// Import the module using a namespace import
import * as jwt_decode from 'jwt-decode';

const ProtectedRoute = () => {
    const location = useLocation();
    const token = localStorage.getItem('token');

    if (token) {
        try {
            // Use jwt_decode.default to decode the token
            const decoded = jwt_decode.default(token);
            // Check if the token is expired (decoded.exp is in seconds)
            if (decoded.exp * 1000 < Date.now()) {
                // Token expired; clear storage and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                toast.error('Session expired. Please log in again.');
                return <Navigate to="/?error=session_expired" state={{ from: location }} replace />;
            }
        } catch (error) {
            // Invalid token; clear storage and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            toast.error('Invalid token. Please log in again.');
            return <Navigate to="/?error=invalid_token" state={{ from: location }} replace />;
        }
    } else {
        // No token found; notify and redirect
        toast.error('Unauthorized user cannot access that page.');
        return <Navigate to="/?error=unauthorized" state={{ from: location }} replace />;
    }

    // If token is valid, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;
