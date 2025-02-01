import React from 'react'
import { AddAssignment, AddDepartment, AddEmployee, AddField, AddUser, Dashboard, EditAssignment, EditDepartment, EditEmployee, EditField, EditUser, EndAssignment, GetAssignments, GetAttendances, GetDepartments, GetEmployees, GetFields, GetUsers, Login, Profile, ShowAssignment } from './pages'
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

                <Route path="/employees" element={<GetEmployees />} />
                <Route path="/employee/add" element={<AddEmployee />} />
                <Route path="/employee/edit/:id" element={<EditEmployee />} />

                <Route path="/fields" element={<GetFields />} />
                <Route path="/field/add" element={<AddField />} />
                <Route path="/field/edit/:id" element={<EditField />} />

                <Route path="/departments" element={<GetDepartments />} />
                <Route path="/department/add" element={<AddDepartment />} />
                <Route path="/department/edit/:id" element={<EditDepartment />} />

                <Route path="/assignments" element={<GetAssignments />} />
                <Route path="/assignment/add" element={<AddAssignment />} />
                <Route path="/assignment/edit/:id" element={<EditAssignment />} />
                <Route path="/assignment/:id/end" element={<EndAssignment />} />
                <Route path="/assignment/:id" element={<ShowAssignment />} />

                <Route path="/attendance" element={<GetAttendances />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes