import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAssignmentDetails, deleteAssignment } from '../../api';
import { toast } from 'react-toastify';
import { Edit, Trash2, Eye, StopCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const ShowAssignment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);

    // Advanced filters for attendance history
    const todayString = new Date().toISOString().split('T')[0];
    const [filterStartDate, setFilterStartDate] = useState(todayString);
    const [filterEndDate, setFilterEndDate] = useState(todayString);
    const [attendanceSearch, setAttendanceSearch] = useState('');

    // Pagination states for attendance history
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        const loadAssignment = async () => {
            try {
                const data = await fetchAssignmentDetails(id);
                setAssignment(data);
            } catch (error) {
                toast.error('Failed to load assignment details.');
            } finally {
                setLoading(false);
            }
        };
        loadAssignment();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                await deleteAssignment(id);
                toast.success('Assignment deleted successfully!');
                navigate('/assignments');
            } catch (error) {
                toast.error('Failed to delete assignment.');
            }
        }
    };

    // Filter attendance history by date range and search query.
    const filteredAttendance = (assignment?.attendance_history || []).filter((record) => {
        const recordDate = record.date;
        const withinDateRange = recordDate >= filterStartDate && recordDate <= filterEndDate;
        const searchMatch =
            record.employee_name.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
            record.employee_tag_id.toLowerCase().includes(attendanceSearch.toLowerCase());
        return withinDateRange && searchMatch;
    });

    // Pagination calculations for attendance history.
    const totalRecords = filteredAttendance.length;
    const totalPages = Math.ceil(totalRecords / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedAttendance = filteredAttendance.slice(startIndex, startIndex + pageSize);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (loading) return <div>Loading assignment details...</div>;
    if (!assignment) return <div>No assignment found.</div>;

    return (
        <div className="p-6">
            {/* Header */}
            <div className="intro-y mt-8 flex flex-col items-center sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">Assignment Details</h2>
            </div>

            {/* BEGIN: Assignment & Attendance Details */}
            <div className="intro-y mt-5 grid grid-cols-11 gap-5">
                {/* Left Column: Assignment Details */}
                <div className="col-span-12 lg:col-span-4 2xl:col-span-3">
                    <div className="box rounded-md p-5">
                        <div className="mb-5 flex items-center border-b border-slate-200/60 pb-5 dark:border-darkmode-400">
                            <div className="truncate text-base font-medium">Assignment Details</div>
                            <button
                                onClick={() => navigate(`/assignment/${id}/edit`)}
                                className="ml-auto flex items-center text-primary hover:underline"
                            >
                                <Edit className="stroke-1.5 mr-2 h-4 w-4" />
                                Edit Assignment
                            </button>
                        </div>
                        <div className="flex items-center">
                            <i data-lucide="file-text" className="stroke-1.5 mr-2 h-4 w-4 text-slate-500"></i>
                            <span className="font-medium">Name:</span>
                            <span className="ml-1">{assignment.name || 'N/A'}</span>
                        </div>
                        <div className="mt-3 flex items-center">
                            <i data-lucide="slack" className="stroke-1.5 mr-2 h-4 w-4 text-slate-500"></i>
                            <span className="font-medium">Field:</span>
                            <span className="ml-1">{assignment.field_name || 'N/A'}</span>
                        </div>
                        <div className="mt-3 flex items-center">
                            <i data-lucide="grid" className="stroke-1.5 mr-2 h-4 w-4 text-slate-500"></i>
                            <span className="font-medium">Department:</span>
                            <span className="ml-1">{assignment.department_name || 'N/A'}</span>
                        </div>
                        <div className="mt-3 flex items-center">
                            <i data-lucide="user-check" className="stroke-1.5 mr-2 h-4 w-4 text-slate-500"></i>
                            <span className="font-medium">Supervisor:</span>
                            <span className="ml-1">{assignment.supervisor_name || 'N/A'}</span>
                        </div>
                        <div className="mt-3 flex items-center">
                            <i data-lucide="calendar" className="stroke-1.5 mr-2 h-4 w-4 text-slate-500"></i>
                            <span className="font-medium">Created Date:</span>
                            <span className="ml-1">
                                {assignment.created_date ? new Date(assignment.created_date).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                        <div className="mt-3 flex items-center">
                            <i data-lucide="message-circle" className="stroke-1.5 mr-2 h-4 w-4 text-slate-500"></i>
                            <span className="font-medium">Notes:</span>
                            <span className="ml-1">{assignment.notes || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Attendance History with Advanced Filters and Pagination */}
                {assignment.attendance_history && assignment.attendance_history.length > 0 && (
                    <div className="col-span-12 lg:col-span-7 2xl:col-span-8">
                        <div className="box rounded-md p-5">
                            <div className="mb-5 flex flex-col sm:flex-row items-center border-b border-slate-200/60 pb-5 dark:border-darkmode-400">
                                <div className="truncate text-base font-medium">Attendance History</div>
                                <div className="ml-auto flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                                    <input
                                        type="date"
                                        value={filterStartDate}
                                        onChange={(e) => {
                                            setFilterStartDate(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-40 border-slate-200 shadow-sm rounded-md py-2 px-3 focus:ring-4 focus:ring-primary"
                                    />
                                    <span className="text-slate-500">to</span>
                                    <input
                                        type="date"
                                        value={filterEndDate}
                                        onChange={(e) => {
                                            setFilterEndDate(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-40 border-slate-200 shadow-sm rounded-md py-2 px-3 focus:ring-4 focus:ring-primary"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search attendance..."
                                        value={attendanceSearch}
                                        onChange={(e) => {
                                            setAttendanceSearch(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-56 border-slate-200 shadow-sm rounded-md py-2 px-3 focus:ring-4 focus:ring-primary"
                                    />
                                </div>
                            </div>
                            <div className="-mt-3 overflow-auto lg:overflow-visible">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="[&:nth-of-type(odd)_td]:bg-slate-100 [&:nth-of-type(odd)_td]:dark:bg-darkmode-300 [&:nth-of-type(odd)_td]:dark:bg-opacity-50">
                                            <th className="font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap !py-5">
                                                Employee
                                            </th>
                                            <th className="font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap">
                                                Tag ID
                                            </th>
                                            <th className="font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap">
                                                Department
                                            </th>
                                            <th className="font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap">
                                                Date
                                            </th>
                                            <th className="font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap text-center">
                                                Attended
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedAttendance.map((record) => (
                                            <tr
                                                key={record.id}
                                                className="[&:nth-of-type(odd)_td]:bg-slate-100 [&:nth-of-type(odd)_td]:dark:bg-darkmode-300 [&:nth-of-type(odd)_td]:dark:bg-opacity-50"
                                            >
                                                <td className="px-5 py-3 border-b dark:border-darkmode-300 !py-4">
                                                    {record.employee_name || 'N/A'}
                                                </td>
                                                <td className="px-5 py-3 border-b dark:border-darkmode-300">
                                                    {record.employee_tag_id || 'N/A'}
                                                </td>
                                                <td className="px-5 py-3 border-b dark:border-darkmode-300">
                                                    {record.department_name || 'N/A'}
                                                </td>
                                                <td className="px-5 py-3 border-b dark:border-darkmode-300">
                                                    {record.date || 'N/A'}
                                                </td>
                                                <td className="px-5 py-3 border-b dark:border-darkmode-300 text-center">
                                                    {record.attended ? 'Yes' : 'No'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Controls */}
                            {totalRecords > pageSize && (
                                <div className="mt-4 flex justify-center">
                                    <nav className="w-full">
                                        <ul className="flex items-center justify-center gap-2">
                                            <li>
                                                <button
                                                    onClick={() => handlePageChange(1)}
                                                    disabled={currentPage === 1}
                                                    className="transition duration-200 border py-2 px-2 rounded-md disabled:opacity-50"
                                                >
                                                    First
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
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
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className="transition duration-200 border py-2 px-2 rounded-md disabled:opacity-50"
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={() => handlePageChange(totalPages)}
                                                    disabled={currentPage === totalPages}
                                                    className="transition duration-200 border py-2 px-2 rounded-md disabled:opacity-50"
                                                >
                                                    Last
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {/* END: Assignment & Attendance Details */}

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
                <button
                    onClick={() => navigate(`/assignment/${id}/edit`)}
                    className="flex items-center px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 transition"
                >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </button>
                <button
                    onClick={() => navigate(`/assignment/${id}/end`)}
                    className="flex items-center px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600 transition"
                >
                    <StopCircle className="mr-2 h-4 w-4" />
                    End
                </button>
                <button
                    onClick={handleDelete}
                    className="flex items-center px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </button>
                <button
                    onClick={() => navigate('/assignments')}
                    className="flex items-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                >
                    <Eye className="mr-2 h-4 w-4" />
                    Back to Assignments
                </button>
            </div>
        </div>
    );
};

export default ShowAssignment;
