import React from 'react'
import {
    CheckSquare,
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
    Eye,
    Plus,
    Search,
    Trash2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const GetEmployees = () => {
    const navigate = useNavigate()

    // Dummy employees data for demonstration purposes.
    const employees = [
        {
            id: 1,
            name: 'Jannet Doe',
            email: 'jannet@doe.com',
            phone_number: '1234567890',
            address: 'Address',
            tag_id: 1,
            nid: 2136287382737238,
            rssb_number: 362747278,
            avatar: 'https://midone-html.left4code.com/dist/images/fakers/preview-6.jpg'
        }
        // You can add more employees here...
    ]

    const handleAddEmployee = () => {
        navigate('/employee/add')
    }

    const handleShowEmployee = (employeeId) => {
        navigate(`/employee/${employeeId}`)
    }

    const handleEditEmployee = (employeeId) => {
        navigate(`/employee/${employeeId}/edit`)
    }

    const handleDeleteEmployee = (employeeId) => {
        toast.info(`Delete functionality not implemented yet for ID: ${employeeId}`)
    }

    return (
        <>
            <div className="intro-y col-span-12 mt-8 flex flex-wrap items-center xl:flex-nowrap">
                <h2 className="mr-auto text-lg font-medium">Employees</h2>
                <button
                    onClick={handleAddEmployee}
                    className="transition duration-200 border inline-flex items-center justify-center py-2 px-3 rounded-md font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&:hover:not(:disabled)]:bg-opacity-90 [&:hover:not(:disabled)]:border-opacity-90 [&:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed bg-primary border-primary text-white dark:border-primary mr-2 shadow-md"
                >
                    Add New Employee
                    <span className="flex h-5 w-5 items-center justify-center ml-1">
                        <Plus className="stroke-1.5 h-4 w-4" />
                    </span>
                </button>
            </div>

            <div className="mt-5 grid grid-cols-12 gap-6">
                {/* SEARCH & FILTERS */}
                <div className="intro-y col-span-12 mt-2 flex flex-wrap items-center gap-2 xl:flex-nowrap">
                    <div className="relative w-56 text-slate-500">
                        <input
                            type="text"
                            placeholder="Search name or phone..."
                            className="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-800/50 dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-800/50 [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 !box w-56 pr-10"
                        />
                        <Search className="stroke-1.5 absolute inset-y-0 right-0 my-auto mr-3 h-4 w-4" />
                    </div>

                    <input
                        type="date"
                        className="w-40 disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-800/50 transition duration-200 ease-in-out text-sm border-slate-200 shadow-sm rounded-md py-2 px-3 focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:bg-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50"
                    />

                    <input
                        type="date"
                        className="w-40 disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-800/50 transition duration-200 ease-in-out text-sm border-slate-200 shadow-sm rounded-md py-2 px-3 focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:bg-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50"
                    />

                    <select
                        className="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-800/50 transition duration-200 ease-in-out text-sm border-slate-200 shadow-sm rounded-md py-2 px-3 pr-8 focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:bg-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 !box w-48"
                    >
                        <option value="">Date Sort</option>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </div>

                <div className="intro-y col-span-12 overflow-auto 2xl:overflow-visible">
                    <table className="w-full text-left -mt-2 border-separate border-spacing-y-[10px]">
                        <thead>
                            <tr>
                                <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0">
                                    <input
                                        type="checkbox"
                                        className="transition-all duration-100 ease-in-out shadow-sm border-slate-200 cursor-pointer rounded focus:ring-4 focus:ring-offset-0 focus:ring-primary focus:ring-opacity-20 dark:bg-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50"
                                    />
                                </th>
                                <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0">
                                    Name
                                </th>
                                <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0 text-center">
                                    Email Address
                                </th>
                                <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0 text-center">
                                    Phone Number
                                </th>
                                <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0 text-center">
                                    Address
                                </th>
                                <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0 text-center">
                                    Tag ID
                                </th>
                                <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0 text-center">
                                    RSSB Number
                                </th>
                                <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0 text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr key={employee.id} className="intro-x">
                                    <td className="px-5 py-3 border-b dark:border-300 box w-10 whitespace-nowrap border-x-0 shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                        <input
                                            type="checkbox"
                                            className="transition-all duration-100 ease-in-out shadow-sm border-slate-200 cursor-pointer rounded focus:ring-4 focus:ring-offset-0 focus:ring-primary focus:ring-opacity-20 dark:bg-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50"
                                        />
                                    </td>
                                    <td className="px-5 py-3 border-b dark:border-300 box whitespace-nowrap border-x-0 !py-3.5 shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                        <div className="flex items-center">
                                            <div className="image-fit zoom-in h-9 w-9">
                                                <img
                                                    src={employee.avatar}
                                                    className="tooltip cursor-pointer rounded-lg border-white shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                                    alt="Employee avatar"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <span className="whitespace-nowrap font-medium">
                                                    {employee.name}
                                                </span>
                                                <div className="mt-0.5 whitespace-nowrap text-xs text-slate-500">
                                                    NID: {employee.nid}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 border-b dark:border-300 box whitespace-nowrap border-x-0 text-center shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                        {employee.email}
                                    </td>
                                    <td className="px-5 py-3 border-b dark:border-300 box whitespace-nowrap border-x-0 text-center shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                        {employee.phone_number}
                                    </td>
                                    <td className="px-5 py-3 border-b dark:border-300 box whitespace-nowrap border-x-0 text-center shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                        {employee.address}
                                    </td>
                                    <td className="px-5 py-3 border-b dark:border-300 box whitespace-nowrap border-x-0 text-center shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                        {employee.tag_id}
                                    </td>
                                    <td className="px-5 py-3 border-b dark:border-300 box whitespace-nowrap border-x-0 text-center shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                        {employee.rssb_number}
                                    </td>
                                    <td className="px-5 py-3 border-b dark:border-300 box w-56 border-x-0 shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                        <div className="flex items-center justify-center">
                                            <button
                                                className="mr-3 flex items-center text-blue-600"
                                                onClick={() => handleShowEmployee(employee.id)}
                                            >
                                                <Eye className="stroke-1.5 mr-1 h-4 w-4" />
                                                View
                                            </button>
                                            <button
                                                className="mr-3 flex items-center text-green-600"
                                                onClick={() => handleEditEmployee(employee.id)}
                                            >
                                                <CheckSquare className="stroke-1.5 mr-1 h-4 w-4" />
                                                Edit
                                            </button>
                                            <button
                                                className="flex items-center text-danger"
                                                onClick={() => handleDeleteEmployee(employee.id)}
                                            >
                                                <Trash2 className="stroke-1.5 mr-1 h-4 w-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination area */}
                <div className="intro-y col-span-12 flex flex-wrap items-center sm:flex-row sm:flex-nowrap mt-4">
                    <nav className="w-full sm:mr-auto sm:w-auto">
                        <ul className="flex w-full mr-0 sm:mr-auto sm:w-auto gap-2">
                            <li>
                                <button
                                    className="transition duration-200 border items-center justify-center py-2 px-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:focus:ring-slate-700 text-slate-800 dark:text-slate-300 border-transparent disabled:opacity-50"
                                >
                                    First
                                </button>
                            </li>
                            <li>
                                <button
                                    className="transition duration-200 border items-center justify-center py-2 px-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:focus:ring-slate-700 text-slate-800 dark:text-slate-300 border-transparent disabled:opacity-50"
                                >
                                    <ChevronLeft className="stroke-1.5 h-4 w-4" />
                                </button>
                            </li>

                            {/* Page indicator */}
                            <li>
                                <span className="px-3 py-2 text-slate-700 dark:text-slate-300">
                                    Page 1 of 1
                                </span>
                            </li>

                            <li>
                                <button
                                    className="transition duration-200 border items-center justify-center py-2 px-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:focus:ring-slate-700 text-slate-800 dark:text-slate-300 border-transparent disabled:opacity-50"
                                >
                                    <ChevronRight className="stroke-1.5 h-4 w-4" />
                                </button>
                            </li>
                            <li>
                                <button
                                    className="transition duration-200 border items-center justify-center py-2 px-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:focus:ring-slate-700 text-slate-800 dark:text-slate-300 border-transparent disabled:opacity-50"
                                >
                                    <ChevronsRight className="stroke-1.5 h-4 w-4" />
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default GetEmployees