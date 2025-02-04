import React, { useState, useEffect } from 'react';
import {
    CheckSquare,
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
    Eye,
    Plus,
    Search,
    Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchEmployees, deleteEmployee } from '../../api';

const GetEmployees = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const data = await fetchEmployees();
                setEmployees(data);
            } catch (error) {
                toast.error('Failed to fetch employees');
            }
        };
        loadEmployees();
    }, []);

    // Filter employees based on search term (name or phone)
    const filteredEmployees = employees.filter((employee) => {
        const term = searchTerm.toLowerCase();
        return (
            (employee.name || '').toLowerCase().includes(term) ||
            (employee.phone_number || '').toLowerCase().includes(term)
        );
    });

    // Sort employees by ID (assuming higher ID means newer)
    const sortedEmployees = filteredEmployees.sort((a, b) => b.id - a.id);

    const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);
    const currentEmployees = sortedEmployees.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleAddEmployee = () => {
        navigate('/employee/add');
    };

    const handleShowEmployee = (employeeId) => {
        navigate(`/employee/${employeeId}`);
    };

    const handleEditEmployee = (employeeId) => {
        navigate(`/employee/${employeeId}/edit`);
    };

    const handleDeleteEmployee = async (employeeId) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await deleteEmployee(employeeId);
                toast.success('Employee deleted successfully');
                setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
            } catch (error) {
                toast.error('Failed to delete employee');
            }
        }
    };

    return (
        <>
            {/* Header */}
            <div className="intro-y col-span-12 mt-8 flex flex-wrap items-center xl:flex-nowrap">
                <h2 className="mr-auto text-lg font-medium">Employees</h2>
                <button
                    onClick={handleAddEmployee}
                    className="transition duration-200 border inline-flex items-center justify-center py-2 px-3 rounded-md font-medium dark:focus:ring-slate-700 dark:focus:ring-opacity-50 bg-primary border-primary text-white dark:border-primary mr-2 shadow-md"
                >
                    Add New Employee
                    <span className="flex h-5 w-5 items-center justify-center ml-1">
                        <Plus className="stroke-1.5 h-4 w-4" />
                    </span>
                </button>
            </div>

            {/* SEARCH */}
            <div className="intro-y col-span-12 mt-2 flex flex-wrap items-center gap-2 xl:flex-nowrap">
                <div className="relative w-56 text-slate-500">
                    <input
                        type="text"
                        placeholder="Search name or phone..."
                        className="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-800/50 dark:disabled:border-transparent transition duration-200 ease-in-out text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:border-primary focus:border-opacity-40 dark:bg-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 !box w-56 pr-10"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <Search className="stroke-1.5 absolute inset-y-0 right-0 my-auto mr-3 h-4 w-4" />
                </div>
            </div>

            {/* TABLE */}
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
                                Email
                            </th>
                            <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0 text-center">
                                Phone
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
                        {currentEmployees.map(employee => (
                            <tr key={employee.id} className="intro-x">
                                <td className="px-5 py-3 border-b dark:border-300 box whitespace-nowrap border-x-0 shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                    <input
                                        type="checkbox"
                                        className="transition-all duration-100 ease-in-out shadow-sm border-slate-200 cursor-pointer rounded focus:ring-4 focus:ring-offset-0 focus:ring-primary focus:ring-opacity-20 dark:bg-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50"
                                    />
                                </td>
                                <td className="px-5 py-3 border-b dark:border-300 box whitespace-nowrap border-x-0 shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                    <div className="flex items-center">
                                        <div className="image-fit zoom-in h-9 w-9">
                                            <img
                                                src={
                                                    employee.avatar ||
                                                    'https://cdn-icons-png.flaticon.com/512/10337/10337609.png'
                                                }
                                                className="tooltip cursor-pointer rounded-lg border-white shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                                alt="Field avatar"
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <span className="whitespace-nowrap font-medium">
                                                {employee.name || 'N/A'}
                                            </span>
                                            <div className="mt-0.5 whitespace-nowrap text-xs text-slate-500">
                                                Tag ID: {employee.tag_id || 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-3 border-b dark:border-300 box whitespace-nowrap border-x-0 text-center shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                    {employee.email || 'N/A'}
                                </td>
                                <td className="px-5 py-3 border-b dark:border-300 box whitespace-nowrap border-x-0 text-center shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                    {employee.phone_number || 'N/A'}
                                </td>
                                <td className="px-5 py-3 border-b dark:border-300 box whitespace-nowrap border-x-0 text-center shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                    {employee.rssb_number || 'N/A'}
                                </td>
                                <td className="px-5 py-3 border-b dark:border-300 box w-56 border-x-0 text-center shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                    <div className="flex items-center justify-center">
                                        <button
                                            onClick={() => handleShowEmployee(employee.id)}
                                            className="mr-3 flex items-center text-blue-600"
                                        >
                                            <Eye className="stroke-1.5 mr-1 h-4 w-4" />
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleEditEmployee(employee.id)}
                                            className="mr-3 flex items-center text-green-600"
                                        >
                                            <CheckSquare className="stroke-1.5 mr-1 h-4 w-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteEmployee(employee.id)}
                                            className="flex items-center text-danger"
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

            {/* PAGINATION */}
            <div className="intro-y col-span-12 flex flex-wrap items-center sm:flex-row sm:flex-nowrap mt-4">
                <nav className="w-full sm:mr-auto sm:w-auto">
                    <ul className="flex w-full mr-0 sm:mr-auto sm:w-auto gap-2">
                        <li>
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className="transition duration-200 border items-center justify-center py-2 px-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:focus:ring-slate-700 text-slate-800 dark:text-slate-300 border-transparent disabled:opacity-50"
                            >
                                First
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="transition duration-200 border items-center justify-center py-2 px-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:focus:ring-slate-700 text-slate-800 dark:text-slate-300 border-transparent disabled:opacity-50"
                            >
                                <ChevronLeft className="stroke-1.5 h-4 w-4" />
                            </button>
                        </li>
                        <li>
                            <span className="px-3 py-2 text-slate-700 dark:text-slate-300">
                                Page {currentPage} of {totalPages}
                            </span>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="transition duration-200 border items-center justify-center py-2 px-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:focus:ring-slate-700 text-slate-800 dark:text-slate-300 border-transparent disabled:opacity-50"
                            >
                                <ChevronRight className="stroke-1.5 h-4 w-4" />
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className="transition duration-200 border items-center justify-center py-2 px-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:focus:ring-slate-700 text-slate-800 dark:text-slate-300 border-transparent disabled:opacity-50"
                            >
                                <ChevronsRight className="stroke-1.5 h-4 w-4" />
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default GetEmployees;
