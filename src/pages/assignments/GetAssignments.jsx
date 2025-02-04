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
    StopCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchAssignments, deleteAssignment } from '../../api';

const GetAssignments = () => {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

    const filteredAssignments = assignments.filter(a => {
        const term = searchTerm.toLowerCase();
        return a.name.toLowerCase().includes(term) ||
            (a.field_name && a.field_name.toLowerCase().includes(term)) ||
            (a.department_name && a.department_name.toLowerCase().includes(term));
    });

    const sortedAssignments = filteredAssignments.sort((a, b) => {
        const aDate = new Date(a.created_date);
        const bDate = new Date(b.created_date);
        return sortOrder === 'newest' ? bDate - aDate : aDate - bDate;
    });

    const totalPages = Math.ceil(sortedAssignments.length / itemsPerPage);
    const currentAssignments = sortedAssignments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
                <h2 className="mr-auto text-lg font-medium">Assignments</h2>
                <button
                    onClick={handleAddAssignment}
                    className="transition duration-200 border inline-flex items-center justify-center py-2 px-3 rounded-md font-medium bg-primary border-primary text-white mr-2 shadow-md"
                >
                    Add New Assignment
                    <span className="flex h-5 w-5 items-center justify-center ml-1">
                        <Plus className="stroke-1.5 h-4 w-4" />
                    </span>
                </button>
            </div>
            {/* Search & Sort */}
            <div className="intro-y col-span-12 mt-2 flex flex-wrap items-center gap-2 xl:flex-nowrap">
                <div className="relative w-56 text-slate-500">
                    <input
                        type="text"
                        placeholder="Search assignments..."
                        className="w-56 text-sm border shadow-sm rounded-md focus:ring-4 focus:ring-primary focus:border-primary"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <Search className="absolute inset-y-0 right-0 my-auto mr-3 h-4 w-4" />
                </div>
                <select
                    className="w-48 text-sm border shadow-sm rounded-md py-2 px-3 focus:ring-4 focus:ring-primary"
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
            <div className="intro-y col-span-12 overflow-auto 2xl:overflow-visible mt-4">
                <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                        <tr>
                            <th className="px-5 py-3">Assignment Name</th>
                            <th className="px-5 py-3 text-center">Field</th>
                            <th className="px-5 py-3 text-center">Department</th>
                            <th className="px-5 py-3 text-center">Supervisor</th>
                            <th className="px-5 py-3 text-center">Created Date</th>
                            <th className="px-5 py-3 text-center">Employees</th>
                            <th className="px-5 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentAssignments.map(a => (
                            <tr key={a.id} className="intro-x">
                                <td className="px-5 py-3">{a.name}</td>
                                <td className="px-5 py-3 text-center">{a.field_name || 'N/A'}</td>
                                <td className="px-5 py-3 text-center">{a.department_name || 'N/A'}</td>
                                <td className="px-5 py-3 text-center">{a.supervisor_name || 'N/A'}</td>
                                <td className="px-5 py-3 text-center">{new Date(a.created_date).toLocaleDateString()}</td>
                                <td className="px-5 py-3 text-center">{a.total_employees}</td>
                                <td className="px-5 py-3 text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <button onClick={() => handleShowAssignment(a.id)} className="text-blue-600 flex items-center">
                                            <Eye className="mr-1 h-4 w-4" /> View
                                        </button>
                                        <button onClick={() => handleEditAssignment(a.id)} className="text-green-600 flex items-center">
                                            <Edit className="mr-1 h-4 w-4" /> Edit
                                        </button>
                                        <button onClick={() => handleEndAssignment(a.id)} className="text-orange-600 flex items-center">
                                            <StopCircle className="mr-1 h-4 w-4" /> End
                                        </button>
                                        <button onClick={() => handleDeleteAssignment(a.id)} className="text-red-600 flex items-center">
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
            <div className="intro-y col-span-12 flex flex-wrap items-center mt-4">
                <nav className="w-full">
                    <ul className="flex gap-2">
                        <li>
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className="border py-2 px-2 rounded disabled:opacity-50"
                            >
                                First
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="border py-2 px-2 rounded disabled:opacity-50"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                        </li>
                        <li>
                            <span className="px-3 py-2 text-slate-700">
                                Page {currentPage} of {totalPages}
                            </span>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="border py-2 px-2 rounded disabled:opacity-50"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className="border py-2 px-2 rounded disabled:opacity-50"
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

export default GetAssignments;
