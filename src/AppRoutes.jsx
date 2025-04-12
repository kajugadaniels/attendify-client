import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import { AddAssignment, AddDepartment, AddEmployee, AddField, AddUser, Dashboard, EditAssignment, EditDepartment, EditEmployee, EditField, EditUser, EmployeeDetails, EndAssignment, GetAssignments, GetAttendances, GetDepartments, GetEmployees, GetFields, GetUsers, Login, NotFound, Profile, ShowAssignment, ShowDepartment, ShowEmployee, ShowField, ShowUser } from './pages'
import ProtectedRoute from './components/ProtectedRoute'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path="/student/:id/details" element={<EmployeeDetails />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/dashboard" element={<Dashboard />} />

                    <Route path="/users" element={<GetUsers />} />
                    <Route path="/user/add" element={<AddUser />} />
                    <Route path="/user/:id" element={<ShowUser />} />
                    <Route path="/user/:id/edit" element={<EditUser />} />

                    <Route path="/fields" element={<GetFields />} />
                    <Route path="/field/add" element={<AddField />} />
                    <Route path="/field/:id" element={<ShowField />} />
                    <Route path="/field/:id/edit" element={<EditField />} />

                    <Route path="/departments" element={<GetDepartments />} />
                    <Route path="/department/add" element={<AddDepartment />} />
                    <Route path="/department/:id" element={<ShowDepartment />} />
                    <Route path="/department/:id/edit" element={<EditDepartment />} />

                    <Route path="/students" element={<GetEmployees />} />
                    <Route path="/student/add" element={<AddEmployee />} />
                    <Route path="/student/:id" element={<ShowEmployee />} />
                    <Route path="/student/:id/edit" element={<EditEmployee />} />

                    <Route path="/assignments" element={<GetAssignments />} />
                    <Route path="/assignment/add" element={<AddAssignment />} />
                    <Route path="/assignment/:id" element={<ShowAssignment />} />
                    <Route path="/assignment/:id/edit" element={<EditAssignment />} />
                    <Route path="/assignment/:id/end" element={<EndAssignment />} />

                    <Route path="/attendance" element={<GetAttendances />} />
                </Route>
            </Route>

            <Route path='*' element={<NotFound />} />
        </Routes>
    )
}

export default AppRoutes
