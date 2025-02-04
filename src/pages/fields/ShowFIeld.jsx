import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchFieldDetails, deleteField } from '../../api';
import { toast } from 'react-toastify';
import { Edit, Trash2, Eye } from 'lucide-react';

const ShowField = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [field, setField] = useState(null);
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [loading, setLoading] = useState(true);

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
                            <div className="truncate text-base font-medium">
                                Field Details
                            </div>
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
                                    {attendanceHistory.map((record) => (
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
};

export default ShowField;
