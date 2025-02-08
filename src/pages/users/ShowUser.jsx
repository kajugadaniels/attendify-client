import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserDetails, deleteUser } from '../../api';
import { toast } from 'react-toastify';
import { Edit, Trash2, Eye } from 'lucide-react';

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
        <div className="p-6">
            {/* Header */}
            <div className="intro-y mt-8 flex flex-col items-center sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">User Details</h2>
            </div>

            {/* BEGIN: User & Activity Details */}
            <div className="intro-y mt-5 grid grid-cols-11 gap-5">
                {/* Left Column: User Details */}
                <div className="col-span-12 lg:col-span-4 2xl:col-span-3">
                    <div className="box rounded-md p-5">
                        <div className="mb-5 flex items-center border-b border-slate-200/60 pb-5 dark:border-darkmode-400">
                            <div className="truncate text-base font-medium">
                                User Details
                            </div>
                            <button
                                onClick={() => navigate(`/user/${id}/edit`)}
                                className="ml-auto flex items-center text-primary hover:underline"
                            >
                                <Edit className="stroke-1.5 mr-2 h-4 w-4" />
                                Edit User
                            </button>
                        </div>
                        <div className="flex items-center">
                            <i data-lucide="user" className="stroke-1.5 mr-2 h-4 w-4 text-slate-500"></i>
                            <span className="font-medium">Name:</span>
                            <span className="ml-1">{user.name || 'N/A'}</span>
                        </div>
                        <div className="mt-3 flex items-center">
                            <i data-lucide="mail" className="stroke-1.5 mr-2 h-4 w-4 text-slate-500"></i>
                            <span className="font-medium">Email:</span>
                            <span className="ml-1">{user.email || 'N/A'}</span>
                        </div>
                        <div className="mt-3 flex items-center">
                            <i data-lucide="phone" className="stroke-1.5 mr-2 h-4 w-4 text-slate-500"></i>
                            <span className="font-medium">Phone:</span>
                            <span className="ml-1">{user.phone_number || 'N/A'}</span>
                        </div>
                        <div className="mt-3 flex items-center">
                            <i data-lucide="user-check" className="stroke-1.5 mr-2 h-4 w-4 text-slate-500"></i>
                            <span className="font-medium">Role:</span>
                            <span className="ml-1">{user.role || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: User Activity (Placeholder) */}
                <div className="col-span-12 lg:col-span-7 2xl:col-span-8">
                    <div className="box rounded-md p-5">
                        <div className="mb-5 flex items-center border-b border-slate-200/60 pb-5 dark:border-darkmode-400">
                            <div className="truncate text-base font-medium">
                                User Activity
                            </div>
                            <button
                                onClick={() => toast.info('Add note functionality coming soon!')}
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
                                            Activity
                                        </th>
                                        <th className="font-medium px-5 py-3 border-b-2 dark:border-darkmode-300 whitespace-nowrap text-right">
                                            Timestamp
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="[&:nth-of-type(odd)_td]:bg-slate-100 [&:nth-of-type(odd)_td]:dark:bg-darkmode-300 [&:nth-of-type(odd)_td]:dark:bg-opacity-50">
                                        <td className="px-5 py-3 border-b dark:border-darkmode-300 !py-4">
                                            No activity available.
                                        </td>
                                        <td className="px-5 py-3 border-b dark:border-darkmode-300 text-right">
                                            N/A
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {/* END: User & Activity Details */}

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
