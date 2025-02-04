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
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Assignments</h2>
                    <button
                        onClick={handleAddAssignment}
                        className="btn btn-primary flex items-center"
                    >
                        <Plus className="mr-1 h-4 w-4" /> Add New Assignment
                    </button>
                </div>
                {/* Search & Sort */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="relative w-56">
                        <input
                            type="text"
                            placeholder="Search assignments..."
                            className="input"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                        <Search className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
                    </div>
                    <select
                        className="input w-48"
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
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2">Assignment Name</th>
                                <th className="px-4 py-2">Field</th>
                                <th className="px-4 py-2">Department</th>
                                <th className="px-4 py-2">Supervisor</th>
                                <th className="px-4 py-2">Created Date</th>
                                <th className="px-4 py-2">Employees</th>
                                <th className="px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentAssignments.map(a => (
                                <tr key={a.id} className="border-b">
                                    <td className="px-4 py-2">{a.name}</td>
                                    <td className="px-4 py-2">{a.field_name || 'N/A'}</td>
                                    <td className="px-4 py-2">{a.department_name || 'N/A'}</td>
                                    <td className="px-4 py-2">{a.supervisor_name || 'N/A'}</td>
                                    <td className="px-4 py-2">{new Date(a.created_date).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 text-center">{a.total_employees}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex justify-center space-x-2">
                                            <button onClick={() => handleShowAssignment(a.id)} className="btn btn-outline-blue">
                                                <Eye className="mr-1 h-4 w-4" /> View
                                            </button>
                                            <button onClick={() => handleEditAssignment(a.id)} className="btn btn-outline-green">
                                                <Edit className="mr-1 h-4 w-4" /> Edit
                                            </button>
                                            <button onClick={() => handleEndAssignment(a.id)} className="btn btn-outline-orange">
                                                <StopCircle className="mr-1 h-4 w-4" /> End
                                            </button>
                                            <button onClick={() => handleDeleteAssignment(a.id)} className="btn btn-outline-red">
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
                <div className="flex justify-center items-center mt-4">
                    <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="btn btn-secondary"
                    >
                        First
                    </button>
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="btn btn-secondary"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="px-4">Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="btn btn-secondary"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="btn btn-secondary"
                    >
                        Last
                    </button>
                </div>
            </div>
        </>
    );
};

export default GetAssignments;
