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
import { fetchDepartments, deleteDepartment } from '../../api';

const GetDepartments = () => {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                const data = await fetchDepartments();
                setDepartments(data);
            } catch (error) {
                toast.error('Failed to fetch departments');
            }
        };
        loadDepartments();
    }, []);

    // Filter by department name (you could extend this if needed)
    const filteredDepartments = departments.filter(dept => {
        const term = searchTerm.toLowerCase();
        return (dept.name || '').toLowerCase().includes(term);
    });

    // Sort by ID (assuming higher ID means newer)
    const sortedDepartments = filteredDepartments.sort((a, b) => {
        if (sortOrder === 'newest') {
            return b.id - a.id;
        } else {
            return a.id - b.id;
        }
    });

    const totalPages = Math.ceil(sortedDepartments.length / itemsPerPage);
    const currentDepartments = sortedDepartments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleAddDepartment = () => {
        navigate('/department/add');
    };

    const handleShowDepartment = (departmentId) => {
        navigate(`/department/${departmentId}`);
    };

    const handleEditDepartment = (departmentId) => {
        navigate(`/department/${departmentId}/edit`);
    };

    const handleDeleteDepartment = async (departmentId) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                await deleteDepartment(departmentId);
                toast.success('Department deleted successfully');
                setDepartments(prev => prev.filter(dept => dept.id !== departmentId));
            } catch (error) {
                toast.error('Failed to delete department.');
            }
        }
    };

    return (
        <>
            <div className="intro-y col-span-12 mt-8 flex flex-wrap items-center xl:flex-nowrap">
                <h2 className="mr-auto text-lg font-medium">Departments</h2>
                <button
                    onClick={handleAddDepartment}
                    className="transition duration-200 border inline-flex items-center justify-center py-2 px-3 rounded-md font-medium bg-primary border-primary text-white mr-2 shadow-md"
                >
                    Add New Department
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
                        placeholder="Search department..."
                        className="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-800/50 transition duration-200 ease-in-out text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:border-primary dark:bg-800 dark:border-transparent dark:focus:ring-slate-700 w-56 pr-10"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <Search className="stroke-1.5 absolute inset-y-0 right-0 my-auto mr-3 h-4 w-4" />
                </div>

                <select
                    className="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-800/50 transition duration-200 ease-in-out text-sm border-slate-200 shadow-sm rounded-md py-2 px-3 pr-8 focus:ring-4 focus:ring-primary dark:bg-800 dark:border-transparent dark:focus:ring-slate-700 w-48"
                    value={sortOrder}
                    onChange={(e) => {
                        setSortOrder(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                </select>
            </div>

            <div className="intro-y col-span-12 overflow-auto 2xl:overflow-visible">
                <table className="w-full text-left border-separate border-spacing-y-[10px]">
                    <thead>
                        <tr>
                            <th className="font-medium px-5 py-3 whitespace-nowrap">Name</th>
                            <th className="font-medium px-5 py-3 whitespace-nowrap text-center">Day Salary</th>
                            <th className="font-medium px-5 py-3 whitespace-nowrap text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentDepartments.map(department => (
                            <tr key={department.id} className="intro-x">
                                <td className="px-5 py-3 border-b whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="image-fit zoom-in h-9 w-9">
                                            <img
                                                src={department.avatar || 'https://cdn-icons-png.flaticon.com/512/10337/10337609.png'}
                                                className="tooltip cursor-pointer rounded-lg shadow-md"
                                                alt="department avatar"
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <span className="whitespace-nowrap font-medium">
                                                {department.name || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-3 border-b text-center">
                                    {department.day_salary ? `${department.day_salary} RWF` : 'N/A'}
                                </td>
                                <td className="px-5 py-3 border-b text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <button
                                            onClick={() => handleShowDepartment(department.id)}
                                            className="flex items-center text-blue-600"
                                        >
                                            <Eye className="mr-1 h-4 w-4" /> View
                                        </button>
                                        <button
                                            onClick={() => handleEditDepartment(department.id)}
                                            className="flex items-center text-green-600"
                                        >
                                            <CheckSquare className="mr-1 h-4 w-4" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDepartment(department.id)}
                                            className="flex items-center text-danger"
                                        >
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
                                className="transition duration-200 border py-2 px-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary dark:text-slate-300 disabled:opacity-50"
                            >
                                First
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="transition duration-200 border py-2 px-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary dark:text-slate-300 disabled:opacity-50"
                            >
                                <ChevronLeft className="h-4 w-4" />
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
                                className="transition duration-200 border py-2 px-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary dark:text-slate-300 disabled:opacity-50"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className="transition duration-200 border py-2 px-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary dark:text-slate-300 disabled:opacity-50"
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

export default GetDepartments;
