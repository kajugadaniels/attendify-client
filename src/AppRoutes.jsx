import React from 'react'
import { AddUser, Dashboard, EditUser, GetUsers, Login, Profile } from './pages'
import UserLayout from './layouts/UserLayout'
import { Route, Routes } from 'react-router-dom'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<UserLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/profile" element={<Profile />} />

                <Route path="/users" element={<GetUsers />} />
                <Route path="/user/add" element={<AddUser />} />
                <Route path="/user/edit/:id" element={<EditUser />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes