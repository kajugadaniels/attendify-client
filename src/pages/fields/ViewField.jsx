import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchFieldDetails, deleteField } from '../../api';
import { toast } from 'react-toastify';
import { Edit, Trash2, Eye, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

const ViewField = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [field, setField] = useState(null);
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Advanced filter states for attendance history
    const todayString = new Date().toISOString().split('T')[0];
    const [filterStartDate, setFilterStartDate] = useState(todayString);
    const [filterEndDate, setFilterEndDate] = useState(todayString);
    const [attendanceSearch, setAttendanceSearch] = useState('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Load field details and attendance history from the API
    useEffect(() => {
        const loadField = async () => {
            try {
                const data = await fetchFieldDetails(id);
                setField(data.field);
                setAttendanceHistory(data.attendance_history || []);
            } catch (error) {
                toast.error('Failed to load field details.');
            } finally {
                setLoading(false);
            }
        };
        loadField();
    }, [id]);

    // Handler for deletion
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this field?')) {
            try {
                await deleteField(id);
                toast.success('Field deleted successfully!');
                navigate('/fields');
            } catch (error) {
                toast.error('Failed to delete field.');
            }
        }
    };

    // Filter the attendance history based on date range and search query.
    const filteredAttendance = attendanceHistory.filter((record) => {
        const recordDate = record.date;
        const withinDateRange =
            recordDate >= filterStartDate && recordDate <= filterEndDate;
        const searchMatch =
            record.employee_name.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
            record.employee_tag_id.toLowerCase().includes(attendanceSearch.toLowerCase());
        return withinDateRange && searchMatch;
    });

    // Pagination calculation
    const totalRecords = filteredAttendance.length;
    const totalPages = Math.ceil(totalRecords / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedAttendance = filteredAttendance.slice(startIndex, startIndex + pageSize);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Helper: Format date in YYYY-MM-DD format
    const formatDate = (dateStr) => dateStr;

    if (loading) return <div>Loading field details...</div>;
    if (!field) return <div>No field found.</div>;

    return (
        <div className="p-6">
            {/* Header */}
            <div className="intro-y mt-8 flex flex-col items-center sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">Field Details</h2>
            </div>

            {/* BEGIN: Field & Attendance Details */}
            <div className="intro-y mt-5 grid grid-cols-11 gap-5">
                {/* Left Column: Field Details */}
                <div className="col-span-12 lg:col-span-4 2xl:col-span-3">
                    <div className="box rounded-md p-5">
                        <div className="mb-5 flex items-center border-b border-slate-200/60 pb-5 dark:border-darkmode-400">
                            <div className="truncate text-base font-medium">Field Details</div>
                            <button
                                onClick={() => navigate(`/field/${id}/edit`)}
                                className="ml-auto flex items-center text-primary hover:underline"
                            >
                                <Edit className="stroke-1.5 mr-2 h-4 w-4" />
                                Edit Field
                            </button>
                        </div>
                        <div className="flex items-center">
                            <i data-lucide="info" className="stroke-1.5 mr-2 h-4 w-4 text-slate-500"></i>
                            <span className="font-medium">Name:</span>
                            <span className="ml-1">{field.name || 'N/A'}</span>
                        </div>
                        <div className="mt-3 flex items-center">
                            <i data-lucide="map-pin" className="stroke-1.5 mr-2 h-4 w-4 text-slate-500"></i>
                            <span className="font-medium">Address:</span>
                            <span className="ml-1">{field.address || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Attendance History */}
                <div className="col-span-12 lg:col-span-7 2xl:col-span-8">
                    <div className="box rounded-md p-5">
                        <div className="mb-5 flex flex-col sm:flex-row items-center border-b border-slate-200/60 pb-5 dark:border-darkmode-400">
                            <div className="truncate text-base font-medium">Attendance History</div>
                            <div className="ml-auto flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                                {/* Date Range Filters */}
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
                                {/* Search Filter */}
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
                                            Employee Name
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

                            {filteredAttendance.length === 0 && (
                                <div className="text-center py-4 text-slate-500">
                                    No attendance records found for the selected date range.
                                </div>
                            )}
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
            </div>
            {/* END: Field & Attendance Details */}

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
                <button
                    onClick={handleDelete}
                    className="flex items-center px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </button>
                <button
                    onClick={() => navigate('/fields')}
                    className="flex items-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                >
                    <Eye className="mr-2 h-4 w-4" />
                    Back to Fields
                </button>
            </div>
        </div>
    );
}

export default ViewField