import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

const ProtectedRoute = () => {
    const token = localStorage.getItem('token')
    const location = useLocation()

    if (!token) {
        // If no token found, redirect to login page
        toast.error('Unauthorized user cannot access that page.')
        return <Navigate to="/?error=unauthorized" state={{ from: location }} replace />
    }

    // Check if the token has expired
    const expirationTime = localStorage.getItem('tokenExpiration') || 0;
    if (Date.now() > expirationTime) {
        // If token expired, remove token and user data
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        toast.error('Session expired. Please log in again.')

        return <Navigate to="/?error=session_expired" state={{ from: location }} replace />
    }

    return <Outlet />
}

export default ProtectedRoute
