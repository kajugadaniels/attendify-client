import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEmployeeDetails, deleteEmployee } from '../../api';
import { toast } from 'react-toastify';
import { Edit, Trash2, Eye, ChevronRight, ChevronLeft } from 'lucide-react';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';

const ShowEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
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

    // Ref for QR code download
    const qrCodeRef = useRef();

    // Load employee details and attendance history from API
    useEffect(() => {
        const loadEmployee = async () => {
            try {
                const data = await fetchEmployeeDetails(id);
                setEmployee(data.employee);
                setAttendanceHistory(data.attendance_history || []);
            } catch (error) {
                toast.error('Failed to load employee details.');
            } finally {
                setLoading(false);
            }
        };
        loadEmployee();
    }, [id]);

    // Handler for deletion
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await deleteEmployee(id);
                toast.success('Employee deleted successfully!');
                navigate('/employees');
            } catch (error) {
                toast.error('Failed to delete employee.');
            }
        }
    };

    // Compute total salary from filtered attendance history
    const computeTotalSalary = (records) => {
        return records.reduce((sum, rec) => sum + Number(rec.day_salary || 0), 0);
    };

    // Filter the attendance history based on the selected date range and search query.
    const filteredAttendance = attendanceHistory.filter((record) => {
        // Check if record.date is between filterStartDate and filterEndDate (inclusive)
        const withinDateRange =
            record.date >= filterStartDate && record.date <= filterEndDate;
        // Check if the search query matches the record date or department name (case-insensitive)
        const searchMatch =
            record.date.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
            (record.department_name || '').toLowerCase().includes(attendanceSearch.toLowerCase());
        return withinDateRange && searchMatch;
    });

    // Pagination calculations
    const totalRecords = filteredAttendance.length;
    const totalPages = Math.ceil(totalRecords / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedAttendance = filteredAttendance.slice(startIndex, startIndex + pageSize);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (loading) return <div>Loading employee details...</div>;
    if (!employee) return <div>No employee found.</div>;

    const totalSalary = computeTotalSalary(filteredAttendance);

    // Generate QR code value based on employee id
    const qrCodeValue = `https://www.fastfast.nexcodes.dev/employee/${employee.id}/details`;

    // Handler to download the generated QR code as an image
    const downloadQRCode = () => {
        if (qrCodeRef.current) {
            toPng(qrCodeRef.current)
                .then((dataUrl) => {
                    const link = document.createElement('a');
                    link.download = `employee_${employee.name}_qr_code.png`;
                    link.href = dataUrl;
                    link.click();
                })
                .catch((error) => {
                    console.error('Error generating QR code image:', error);
                    toast.error('Failed to download QR code.');
                });
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="intro-y mt-8 flex flex-col items-center sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">Employee Details</h2>
            </div>

            {/* Employee & Attendance Details */}
            <div className="intro-y mt-5 grid grid-cols-11 gap-5">
                {/* Left Column: Employee Details & QR Code */}
                <div className="col-span-12 lg:col-span-4 2xl:col-span-3">
                    <div className="box rounded-md p-5">
                        <div className="mb-5 flex items-center border-b border-slate-200/60 pb-5 dark:border-darkmode-400">
                            <div className="truncate text-base font-medium">Employee Details</div>
                            <button
                                onClick={() => navigate(`/employee/${id}/edit`)}
                                className="ml-auto flex items-center text-primary hover:underline"
                            >
                                <Edit className="stroke-1.5 mr-2 h-4 w-4" />
                                Edit Employee
                            </button>
                        </div>
                        <div className="flex items-center">
                            <i data-lucide="user" className="stroke-1.5 mr-2 h-4 w-4 text-slate-500"></i>
                            <span className="font-medium">Name:</span>
                            <span className="ml-1">{employee.name || 'N/A'}</span>
                        </div>
                        <div className="mt-3 flex items-center">
                            <i data-lucide="mail" className="stroke-1.5 mr-2 h-4 w-4 text-slate-500"></i>
                            <span className="font-medium">Email:</span>
                            <span className="ml-1">{employee.email || 'N/A'}</span>
                        </div>
                        <div className="mt-3 flex items-center">
                            <i data-lucide="phone" className="stroke-1.5 mr-2 h-4 w-4 text-slate-500"></i>
                            <span className="font-medium">Phone:</span>
                            <span className="ml-1">{employee.phone_number || 'N/A'}</span>
                        </div>
                        <div className="mt-3 flex items-center">
                            <i data-lucide="map-pin" className="stroke-1.5 mr-2 h-4 w-4 text-slate-500"></i>
                            <span className="font-medium">Address:</span>
                            <span className="ml-1">{employee.address || 'N/A'}</span>
                        </div>
                        <div className="mt-3 flex items-center">
                            <i data-lucide="hash" className="stroke-1.5 mr-2 h-4 w-4 text-slate-500"></i>
                            <span className="font-medium">Tag ID:</span>
                            <span className="ml-1">{employee.tag_id || 'N/A'}</span>
                        </div>
                        {/* QR Code Section */}
                        <div className="mt-6 flex flex-col items-center">
                            <div ref={qrCodeRef} className="p-4 bg-white rounded shadow">
                                <QRCode value={qrCodeValue} size={128} />
                            </div>
                            <button
                                onClick={downloadQRCode}
                                className="mt-4 transition duration-200 border shadow-sm inline-flex items-center justify-center py-2 px-3 rounded-md font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 bg-primary border-primary text-white"
                            >
                                Download QR Code
                            </button>
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
                                    <tr className="[&:nth-of-type(odd)_td]:bg-slate-100 [&:nth-of-type(odd)_td]:dark:bg-darkmode-300">
                                        <th className="font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap">Date</th>
                                        <th className="font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap">Department</th>
                                        <th className="font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap text-center">Attended</th>
                                        <th className="font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap text-right">Day Salary</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedAttendance.map((record) => (
                                        <tr key={record.id} className="border-t">
                                            <td className="px-5 py-3">{record.date || 'N/A'}</td>
                                            <td className="px-5 py-3">{record.department_name || 'N/A'}</td>
                                            <td className="px-5 py-3 text-center">{record.attended ? 'Yes' : 'No'}</td>
                                            <td className="px-5 py-3 text-right">{record.day_salary || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                {paginatedAttendance.length > 0 && (
                                    <tfoot>
                                        <tr>
                                            <td colSpan="3" className="font-medium px-5 py-3 border-t text-right">Total Salary:</td>
                                            <td className="font-medium px-5 py-3 border-t text-right">{totalSalary}</td>
                                        </tr>
                                    </tfoot>
                                )}
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
                                            <span className="px-3 py-2">Page {currentPage} of {totalPages}</span>
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
                    onClick={() => navigate('/employees')}
                    className="flex items-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                >
                    <Eye className="mr-2 h-4 w-4" />
                    Back to Employees
                </button>
            </div>
        </div>
    );
};

export default ShowEmployee;
