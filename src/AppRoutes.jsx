import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import { AddEmployee, AddUser, Dashboard, EditEmployee, EditUser, GetAttendances, GetEmployees, GetUsers, Login, NotFound, Profile, ShowEmployee, ShowUser } from './pages'
import ProtectedRoute from './components/ProtectedRoute'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Login />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/dashboard" element={<Dashboard />} />

                    <Route path="/users" element={<GetUsers />} />
                    <Route path="/user/add" element={<AddUser />} />
                    <Route path="/user/:id" element={<ShowUser />} />
                    <Route path="/user/:id/edit" element={<EditUser />} />

                    <Route path="/employees" element={<GetEmployees />} />
                    <Route path="/employee/add" element={<AddEmployee />} />
                    <Route path="/employee/:id" element={<ShowEmployee />} />
                    <Route path="/employee/:id/edit" element={<EditEmployee />} />

                    <Route path="/attendance" element={<GetAttendances />} />
                </Route>
            </Route>

            <Route path='*' element={<NotFound />} />
        </Routes>
    )
}

export default AppRoutes
