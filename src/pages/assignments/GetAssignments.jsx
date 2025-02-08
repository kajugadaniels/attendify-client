import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
    Eye,
    Plus,
    Search,
    Trash2,
    Edit,
    StopCircle,
    Handshake,
    CheckSquare
} from 'lucide-react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import {
    fetchAssignments,
    deleteAssignment,
    fetchFields,
    fetchDepartments
} from '../../api';

const GetAssignments = () => {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Additional filters state
    const [fieldFilter, setFieldFilter] = useState(null);
    const [departmentFilter, setDepartmentFilter] = useState(null);
    const [fieldOptions, setFieldOptions] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState([]);

    // Load assignments on mount
    useEffect(() => {
        const loadAssignments = async () => {
            try {
                const data = await fetchAssignments();
                setAssignments(data.results);
            } catch (error) {
                toast.error('Failed to fetch assignments.');
            }
        };
        loadAssignments();
    }, []);

    // Load filter options on mount
    useEffect(() => {
        const loadFilters = async () => {
            try {
                const fieldsData = await fetchFields();
                const departmentsData = await fetchDepartments();
                setFieldOptions(fieldsData.map(field => ({ value: field.id, label: field.name })));
                setDepartmentOptions(departmentsData.map(dept => ({ value: dept.id, label: dept.name })));
            } catch (error) {
                toast.error('Failed to load filter options.');
            }
        };
        loadFilters();
    }, []);

    // Filter assignments based on search term, field, and department filters
    const filteredAssignments = assignments.filter(a => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            a.name.toLowerCase().includes(term) ||
            (a.field_name && a.field_name.toLowerCase().includes(term)) ||
            (a.department_name && a.department_name.toLowerCase().includes(term));
        const matchesField = fieldFilter ? a.field === fieldFilter.value : true;
        const matchesDepartment = departmentFilter ? a.department === departmentFilter.value : true;
        return matchesSearch && matchesField && matchesDepartment;
    });

    // Sort assignments by created_date
    const sortedAssignments = filteredAssignments.sort((a, b) => {
        const aDate = new Date(a.created_date);
        const bDate = new Date(b.created_date);
        return sortOrder === 'newest' ? bDate - aDate : aDate - bDate;
    });

    // Pagination
    const totalPages = Math.ceil(sortedAssignments.length / itemsPerPage);
    const currentAssignments = sortedAssignments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Event handlers
    const handleAddAssignment = () => {
        navigate('/assignment/add');
    };

    const handleShowAssignment = (id) => {
        navigate(`/assignment/${id}`);
    };

    const handleEditAssignment = (id) => {
        navigate(`/assignment/${id}/edit`);
    };

    const handleEndAssignment = (id) => {
        navigate(`/assignment/${id}/end`);
    };

    const handleDeleteAssignment = async (id) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                await deleteAssignment(id);
                toast.success('Assignment deleted successfully.');
                setAssignments(prev => prev.filter(a => a.id !== id));
            } catch (error) {
                toast.error('Failed to delete assignment.');
            }
        }
    };

    return (
        <>
            <div className="intro-y col-span-12 mt-8 flex flex-wrap items-center xl:flex-nowrap">
                <h2 className="mr-auto text-lg font-medium">Users</h2>
                <button
                    onClick={handleAddAssignment}
                    className="transition duration-200 border inline-flex items-center justify-center py-2 px-3 rounded-md font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&:hover:not(:disabled)]:bg-opacity-90 [&:hover:not(:disabled)]:border-opacity-90 [&:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed bg-primary border-primary text-white dark:border-primary mr-2 shadow-md"
                >
                    Add New User
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
                            placeholder="Search assignments..."
                            className="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-800/50 dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-800/50 [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 !box w-56 pr-10"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                        <Search className="stroke-1.5 absolute inset-y-0 right-0 my-auto mr-3 h-4 w-4" />
                    </div>
                    <select
                        className="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-800/50 transition duration-200 ease-in-out text-sm border-slate-200 shadow-sm rounded-md py-2 px-3 pr-8 focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:bg-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 !box w-48"
                        value={sortOrder}
                        onChange={(e) => {
                            setSortOrder(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </select>
                    <Select
                        options={fieldOptions}
                        value={fieldFilter}
                        onChange={(option) => {
                            setFieldFilter(option);
                            setCurrentPage(1);
                        }}
                        placeholder="Filter by Field"
                        isClearable
                    />
                    <Select
                        options={departmentOptions}
                        value={departmentFilter}
                        onChange={(option) => {
                            setDepartmentFilter(option);
                            setCurrentPage(1);
                        }}
                        placeholder="Filter by Department"
                        isClearable
                    />
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
                                    Assignment
                                </th>
                                <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0 text-center">
                                    Field
                                </th>
                                <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0 text-center">
                                    Department
                                </th>
                                <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0 text-center">
                                    Supervisor
                                </th>
                                <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0 text-center">
                                    Started On
                                </th>
                                <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0 text-center">
                                    Ended On
                                </th>
                                <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0 text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentAssignments.map(a => (
                                <tr key={a.id} className="intro-x">
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
                                                    src={a.avatar || 'https://cdn-icons-png.flaticon.com/512/10337/10337609.png'}
                                                    className="tooltip cursor-pointer rounded-lg border-white shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                                    alt="User avatar"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <span className="whitespace-nowrap font-medium">
                                                    {a.name || 'N/A'}
                                                </span>
                                                <div className="mt-0.5 whitespace-nowrap text-xs text-slate-500">
                                                    Employees: {a.total_employees || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 border-b dark:border-300 box whitespace-nowrap border-x-0 text-center shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                        {a.field_name || 'N/A'}
                                    </td>
                                    <td className="px-5 py-3 border-b dark:border-300 box whitespace-nowrap border-x-0 text-center shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                        {a.department_name || 'N/A'}
                                    </td>
                                    <td className="px-5 py-3 border-b dark:border-300 box whitespace-nowrap border-x-0 text-center shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                        {a.supervisor_name || 'N/A'}
                                    </td>
                                    <td className="px-5 py-3 border-b dark:border-300 box whitespace-nowrap border-x-0 text-center shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                        {new Date(a.created_date).toLocaleDateString() || 'N/A'}
                                    </td>
                                    <td className="px-5 py-3 border-b dark:border-300 box whitespace-nowrap border-x-0 text-center shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                        {a.end_date || 'Still working'}
                                    </td>
                                    <td className="px-5 py-3 border-b dark:border-300 box w-56 border-x-0 shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                        <div className="flex items-center justify-center">
                                            <button
                                                className="mr-3 flex items-center text-blue-600"
                                                onClick={() => handleShowAssignment(a.id)}
                                            >
                                                <Eye className="stroke-1.5 mr-1 h-4 w-4" />
                                                View
                                            </button>
                                            <button
                                                className="mr-3 flex items-center text-green-600"
                                                onClick={() => handleEditAssignment(a.id)}
                                            >
                                                <CheckSquare className="stroke-1.5 mr-1 h-4 w-4" />
                                                Edit
                                            </button>
                                            <button
                                                className="mr-3 flex items-center text-green-600"
                                                onClick={() => handleEndAssignment(a.id)}
                                            >
                                                <Handshake className="stroke-1.5 mr-1 h-4 w-4" />
                                                End
                                            </button>
                                            <button
                                                className="flex items-center text-danger"
                                                onClick={() => handleDeleteAssignment(a.id)}
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

export default GetAssignments