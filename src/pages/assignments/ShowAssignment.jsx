import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAssignmentDetails, deleteAssignment } from '../../api';
import { toast } from 'react-toastify';
import { Eye, Edit, Trash2, StopCircle } from 'lucide-react';

const ShowAssignment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div>Loading assignment details...</div>;
    if (!assignment) return <div>No assignment found.</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Assignment Details</h2>
            <div className="space-y-2">
                <p><strong>Name:</strong> {assignment.name}</p>
                <p><strong>Field:</strong> {assignment.field_name || 'N/A'}</p>
                <p><strong>Department:</strong> {assignment.department_name || 'N/A'}</p>
                <p><strong>Supervisor:</strong> {assignment.supervisor_name || 'N/A'}</p>
                <p><strong>Created Date:</strong> {new Date(assignment.created_date).toLocaleDateString()}</p>
                <p><strong>Notes:</strong> {assignment.notes || 'N/A'}</p>
            </div>
            {assignment.attendance_history && assignment.attendance_history.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">Attendance History</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="border p-2">Employee</th>
                                    <th className="border p-2">Tag ID</th>
                                    <th className="border p-2">Department</th>
                                    <th className="border p-2">Date</th>
                                    <th className="border p-2">Attended</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignment.attendance_history.map(record => (
                                    <tr key={record.id}>
                                        <td className="border p-2">{record.employee_name || 'N/A'}</td>
                                        <td className="border p-2">{record.employee_tag_id || 'N/A'}</td>
                                        <td className="border p-2">{record.department_name || 'N/A'}</td>
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
                    onClick={() => navigate(`/assignment/${id}/edit`)}
                    className="flex items-center px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 transition"
                >
                    <Edit className="mr-2 h-4 w-4" /> Edit
                </button>
                <button
                    onClick={() => navigate(`/assignment/${id}/end`)}
                    className="flex items-center px-4 py-2 text-white bg-orange-600 rounded hover:bg-orange-700 transition"
                >
                    <StopCircle className="mr-2 h-4 w-4" /> End
                </button>
                <button
                    onClick={handleDelete}
                    className="flex items-center px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition"
                >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                </button>
                <button
                    onClick={() => navigate('/assignments')}
                    className="flex items-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                >
                    <Eye className="mr-2 h-4 w-4" /> Back to Assignments
                </button>
            </div>
        </div>
    );
};

export default ShowAssignment;
