import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserDetails, deleteUser } from '../../api';
import { toast } from 'react-toastify';
import { Eye, Edit, Trash2 } from 'lucide-react';

const ShowUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user details on mount
    useEffect(() => {
        const loadUser = async () => {
            try {
                const data = await fetchUserDetails(id);
                setUser(data);
            } catch (error) {
                toast.error('Failed to load user details.');
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, [id]);

    // Handle deletion with confirmation
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id);
                toast.success('User deleted successfully!');
                navigate('/users');
            } catch (error) {
                toast.error('Failed to delete user.');
            }
        }
    };

    if (loading) return <div>Loading user details...</div>;
    if (!user) return <div>No user found.</div>;

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4">User Details</h2>
            <div className="space-y-2">
                <p>
                    <strong>Name:</strong> {user.name || 'N/A'}
                </p>
                <p>
                    <strong>Email:</strong> {user.email || 'N/A'}
                </p>
                <p>
                    <strong>Phone Number:</strong> {user.phone_number || 'N/A'}
                </p>
                <p>
                    <strong>Role:</strong> {user.role || 'N/A'}
                </p>
                {/* Add more details if needed */}
            </div>
            <div className="mt-6 flex space-x-4">
                <button
                    onClick={() => navigate(`/user/${id}/edit`)}
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
                    onClick={() => navigate('/users')}
                    className="flex items-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                >
                    <Eye className="mr-2 h-4 w-4" />
                    Back to Users
                </button>
            </div>
        </div>
    );
};

export default ShowUser;
