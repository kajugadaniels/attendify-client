import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDepartmentDetails, deleteDepartment } from '../../api';
import { toast } from 'react-toastify';
import { Eye, Edit, Trash2 } from 'lucide-react';

const ShowDepartment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [department, setDepartment] = useState(null);
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load department details and attendance history
    useEffect(() => {
        const loadDepartment = async () => {
            try {
                const data = await fetchDepartmentDetails(id);
                setDepartment(data.department);
                setAttendanceHistory(data.attendance_history || []);
            } catch (error) {
                toast.error('Failed to load department details.');
            } finally {
                setLoading(false);
            }
        };
        loadDepartment();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                await deleteDepartment(id);
                toast.success('Department deleted successfully!');
                navigate('/departments');
            } catch (error) {
                toast.error('Failed to delete department.');
            }
        }
    };

    if (loading) return <div>Loading department details...</div>;
    if (!department) return <div>No department found.</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Department Details</h2>
            <div className="space-y-2">
                <p>
                    <strong>Name:</strong> {department.name || 'N/A'}
                </p>
                <p>
                    <strong>Day Salary:</strong> {department.day_salary ? `${department.day_salary} RWF` : 'N/A'}
                </p>
            </div>

            {attendanceHistory.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">Attendance History</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="border p-2">Employee Name</th>
                                    <th className="border p-2">Tag ID</th>
                                    <th className="border p-2">Date</th>
                                    <th className="border p-2">Attended</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceHistory.map(record => (
                                    <tr key={record.id}>
                                        <td className="border p-2">{record.employee_name || 'N/A'}</td>
                                        <td className="border p-2">{record.employee_tag_id || 'N/A'}</td>
                                        <td className="border p-2">{record.date || 'N/A'}</td>
                                        <td className="border p-2">{record.attended ? 'Yes' : 'No'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="mt-6 flex space-x-4">
                <button
                    onClick={() => navigate(`/department/${id}/edit`)}
                    className="flex items-center px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 transition"
                >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </button>
                <button
                    onClick={handleDelete}
                    className="flex items-center px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </button>
                <button
                    onClick={() => navigate('/departments')}
                    className="flex items-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                >
                    <Eye className="mr-2 h-4 w-4" />
                    Back to Departments
                </button>
            </div>
        </div>
    );
};

export default ShowDepartment;
