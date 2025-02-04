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

    // Sort employees by ID (or by created_at if available)
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
            <div className="intro-y col-span-12 mt-8 flex flex-wrap items-center xl:flex-nowrap">
                <h2 className="mr-auto text-lg font-medium">Employees</h2>
                <button
                    onClick={handleAddEmployee}
                    className="transition duration-200 border inline-flex items-center justify-center py-2 px-3 rounded-md font-medium bg-primary border-primary text-white mr-2 shadow-md"
                >
                    Add New Employee
                    <span className="flex h-5 w-5 items-center justify-center ml-1">
                        <Plus className="stroke-1.5 h-4 w-4" />
                    </span>
                </button>
            </div>

            {/* SEARCH & FILTERS */}
            <div className="intro-y col-span-12 mt-2 flex flex-wrap items-center gap-2 xl:flex-nowrap">
                <div className="relative w-56 text-slate-500">
                    <input
                        type="text"
                        placeholder="Search name or phone..."
                        className="transition duration-200 ease-in-out text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary w-56 pr-10"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <Search className="stroke-1.5 absolute inset-y-0 right-0 my-auto mr-3 h-4 w-4" />
                </div>
            </div>

            <div className="intro-y col-span-12 overflow-auto 2xl:overflow-visible">
                <table className="w-full text-left border-separate border-spacing-y-[10px]">
                    <thead>
                        <tr>
                            <th className="font-medium px-5 py-3 whitespace-nowrap">Name</th>
                            <th className="font-medium px-5 py-3 whitespace-nowrap text-center">Email</th>
                            <th className="font-medium px-5 py-3 whitespace-nowrap text-center">Phone</th>
                            <th className="font-medium px-5 py-3 whitespace-nowrap text-center">Tag ID</th>
                            <th className="font-medium px-5 py-3 whitespace-nowrap text-center">RSSB Number</th>
                            <th className="font-medium px-5 py-3 whitespace-nowrap text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEmployees.map(employee => (
                            <tr key={employee.id} className="intro-x">
                                <td className="px-5 py-3 border-b whitespace-nowrap">{employee.name || 'N/A'}</td>
                                <td className="px-5 py-3 border-b text-center">{employee.email || 'N/A'}</td>
                                <td className="px-5 py-3 border-b text-center">{employee.phone_number || 'N/A'}</td>
                                <td className="px-5 py-3 border-b text-center">{employee.tag_id || 'N/A'}</td>
                                <td className="px-5 py-3 border-b text-center">{employee.rssb_number || 'N/A'}</td>
                                <td className="px-5 py-3 border-b text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <button onClick={() => handleShowEmployee(employee.id)} className="flex items-center text-blue-600">
                                            <Eye className="mr-1 h-4 w-4" /> View
                                        </button>
                                        <button onClick={() => handleEditEmployee(employee.id)} className="flex items-center text-green-600">
                                            <CheckSquare className="mr-1 h-4 w-4" /> Edit
                                        </button>
                                        <button onClick={() => handleDeleteEmployee(employee.id)} className="flex items-center text-danger">
                                            <Trash2 className="mr-1 h-4 w-4" /> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="intro-y col-span-12 flex flex-wrap items-center sm:flex-row sm:flex-nowrap mt-4">
                <nav className="w-full sm:mr-auto sm:w-auto">
                    <ul className="flex gap-2">
                        <li>
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className="transition duration-200 border py-2 px-2 rounded-md disabled:opacity-50"
                            >
                                First
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="transition duration-200 border py-2 px-2 rounded-md disabled:opacity-50"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                        </li>
                        <li>
                            <span className="px-3 py-2">
                                Page {currentPage} of {totalPages}
                            </span>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="transition duration-200 border py-2 px-2 rounded-md disabled:opacity-50"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className="transition duration-200 border py-2 px-2 rounded-md disabled:opacity-50"
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default GetEmployees;
