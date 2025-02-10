import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AppRoutes from './AppRoutes'
import './assets/css/app.css'

const App = () => {
    useEffect(() => {
        // Listen for changes in localStorage (for token updates across tabs)
        window.addEventListener('storage', () => {
            // Force page reload when token changes
            if (!localStorage.getItem('token')) {
                window.location.reload()
            }
        })
    }, [])

    return (
        <Router>
            <AppRoutes />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={true}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="light"
            />
        </Router>
    )
}

export default App
