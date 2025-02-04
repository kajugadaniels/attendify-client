import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEmployeeDetails, deleteEmployee } from '../../api';
import { toast } from 'react-toastify';
import { Eye, Edit, Trash2 } from 'lucide-react';

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

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Employee Details</h2>
            <div className="space-y-2">
                <p><strong>Name:</strong> {employee.name || 'N/A'}</p>
                <p><strong>Email:</strong> {employee.email || 'N/A'}</p>
                <p><strong>Phone Number:</strong> {employee.phone_number || 'N/A'}</p>
                <p><strong>Address:</strong> {employee.address || 'N/A'}</p>
                <p><strong>Tag ID:</strong> {employee.tag_id || 'N/A'}</p>
                <p><strong>National ID:</strong> {employee.nid || 'N/A'}</p>
                <p><strong>RSSB Number:</strong> {employee.rssb_number || 'N/A'}</p>
            </div>

            {attendanceHistory.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">Attendance History</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="border p-2">Date</th>
                                    <th className="border p-2">Department</th>
                                    <th className="border p-2">Attended</th>
                                    <th className="border p-2">Day Salary</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceHistory.map(record => (
                                    <tr key={record.id}>
                                        <td className="border p-2">{record.date || 'N/A'}</td>
                                        <td className="border p-2">{record.department_name || 'N/A'}</td>
                                        <td className="border p-2">{record.attended ? 'Yes' : 'No'}</td>
                                        <td className="border p-2">{record.day_salary || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="mt-6 flex space-x-4">
                <button
                    onClick={() => navigate(`/employee/${id}/edit`)}
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
