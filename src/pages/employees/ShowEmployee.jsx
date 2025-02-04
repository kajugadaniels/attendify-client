import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEmployeeDetails, deleteEmployee } from '../../api';
import { toast } from 'react-toastify';
import { Edit, Trash2, Eye } from 'lucide-react';

const ShowEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load employee details from API
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

    if (loading) return <div>Loading employee details...</div>;
    if (!employee) return <div>No employee found.</div>;

    // Sum up all the day_salary values from attendanceHistory
    const totalSalary = attendanceHistory.reduce(
        (sum, record) => sum + (Number(record.day_salary) || 0),
        0
    );

    return (
        <div className="p-6">
            {/* Header */}
            <div className="intro-y mt-8 flex flex-col items-center sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">Employee Details</h2>
            </div>

            {/* BEGIN: Employee & Attendance Details */}
            <div className="intro-y mt-5 grid grid-cols-11 gap-5">
                {/* Left Column: Employee Details */}
                <div className="col-span-12 lg:col-span-4 2xl:col-span-3">
                    <div className="box rounded-md p-5">
                        <div className="mb-5 flex items-center border-b border-slate-200/60 pb-5 dark:border-darkmode-400">
                            <div className="truncate text-base font-medium">
                                Employee Details
                            </div>
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
                        <div className="mt-3 flex items-center">
                            <i data-lucide="credit-card" className="stroke-1.5 mr-2 h-4 w-4 text-slate-500"></i>
                            <span className="font-medium">National ID:</span>
                            <span className="ml-1">{employee.nid || 'N/A'}</span>
                        </div>
                        <div className="mt-3 flex items-center">
                            <i data-lucide="dollar-sign" className="stroke-1.5 mr-2 h-4 w-4 text-slate-500"></i>
                            <span className="font-medium">RSSB Number:</span>
                            <span className="ml-1">{employee.rssb_number || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Attendance History */}
                <div className="col-span-12 lg:col-span-7 2xl:col-span-8">
                    <div className="box rounded-md p-5">
                        <div className="mb-5 flex items-center border-b border-slate-200/60 pb-5 dark:border-darkmode-400">
                            <div className="truncate text-base font-medium">
                                Attendance History
                            </div>
                            <button
                                onClick={() => toast.info('Add attendance note functionality coming soon!')}
                                className="ml-auto flex items-center text-primary hover:underline"
                            >
                                <i data-lucide="plus" className="stroke-1.5 mr-2 h-4 w-4"></i>
                                Add Note
                            </button>
                        </div>
                        <div className="-mt-3 overflow-auto lg:overflow-visible">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="[&:nth-of-type(odd)_td]:bg-slate-100 [&:nth-of-type(odd)_td]:dark:bg-darkmode-300 [&:nth-of-type(odd)_td]:dark:bg-opacity-50">
                                        <th className="font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap !py-5">
                                            Date
                                        </th>
                                        <th className="font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap">
                                            Department
                                        </th>
                                        <th className="font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap text-center">
                                            Attended
                                        </th>
                                        <th className="font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap text-right">
                                            Day Salary
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceHistory.map((record) => (
                                        <tr
                                            key={record.id}
                                            className="[&:nth-of-type(odd)_td]:bg-slate-100 [&:nth-of-type(odd)_td]:dark:bg-darkmode-300 [&:nth-of-type(odd)_td]:dark:bg-opacity-50"
                                        >
                                            <td className="px-5 py-3 border-b dark:border-darkmode-300 !py-4">
                                                {record.date || 'N/A'}
                                            </td>
                                            <td className="px-5 py-3 border-b dark:border-darkmode-300">
                                                {record.department_name || 'N/A'}
                                            </td>
                                            <td className="px-5 py-3 border-b dark:border-darkmode-300 text-center">
                                                {record.attended ? 'Yes' : 'No'}
                                            </td>
                                            <td className="px-5 py-3 border-b dark:border-darkmode-300 text-right">
                                                {record.day_salary || 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                {attendanceHistory.length > 0 && (
                                    <tfoot>
                                        <tr>
                                            <td colSpan="3" className="font-medium px-5 py-3 border-t dark:border-darkmode-300 text-right">
                                                Total Salary:
                                            </td>
                                            <td className="font-medium px-5 py-3 border-t dark:border-darkmode-300 text-right">
                                                {totalSalary}
                                            </td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {/* END: Employee & Attendance Details */}

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
