import React, { useState, useEffect } from 'react';
import {
    CheckSquare,
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
    Eye,
    Plus,
    Search,
    Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchUsers } from '../../api';

const GetUsers = () => {
    const navigate = useNavigate();

    // State variables for users, search, filtering, sorting and pagination
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch users from the backend
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await fetchUsers();
                setUsers(data);
            } catch (error) {
                toast.error('Failed to fetch users');
            }
        };
        loadUsers();
    }, []);

    // Filter and sort users based on searchTerm, roleFilter, and sortOrder
    const filteredUsers = users
        .filter((user) => {
            const term = searchTerm.toLowerCase();
            const nameMatch = user.name?.toLowerCase().includes(term);
            const phoneMatch = user.phone_number?.toLowerCase().includes(term);
            const roleMatch = roleFilter ? user.role === roleFilter : true;
            return (nameMatch || phoneMatch) && roleMatch;
        })
        .sort((a, b) => {
            if (sortOrder === 'newest') {
                return b.id - a.id;
            } else {
                return a.id - b.id;
            }
        });

    // Pagination calculations
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const currentUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Event handlers
    const handleAddUser = () => {
        navigate('/user/add');
    };

    const handleShowUser = (userId) => {
        navigate(`/user/${userId}`);
    };

    const handleEditUser = (userId) => {
        navigate(`/user/${userId}/edit`);
    };

    const handleDeleteUser = (userId) => {
        toast.info(`Delete functionality not implemented yet for ID: ${userId}`);
    };

    return (
        <>
            <div className="intro-y col-span-12 mt-8 flex flex-wrap items-center xl:flex-nowrap">
                <h2 className="mr-auto text-lg font-medium">Users</h2>
                <button
                    onClick={handleAddUser}
                    className="transition duration-200 border inline-flex items-center justify-center py-2 px-3 rounded-md font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&:hover:not(:disabled)]:bg-opacity-90 [&:hover:not(:disabled)]:border-opacity-90 [&:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed bg-primary border-primary text-white dark:border-primary mr-2 shadow-md"
                >
                    Add New User
                    <span className="flex h-5 w-5 items-center justify-center ml-1">
                        <Plus className="stroke-1.5 h-4 w-4" />
                    </span>
                </button>
            </div>

            {/* SEARCH & FILTERS */}
            <div className="intro-y col-span-12 mt-2 flex flex-wrap items-center gap-2 xl:flex-nowrap">
                <div className="relative w-56 text-slate-500">
                    <input
                        type="text"
                        placeholder="Search name or phone..."
                        className="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-800/50 dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-800/50 [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 !box w-56 pr-10"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <Search className="stroke-1.5 absolute inset-y-0 right-0 my-auto mr-3 h-4 w-4" />
                </div>

                <select
                    className="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-800/50 transition duration-200 ease-in-out text-sm border-slate-200 shadow-sm rounded-md py-2 px-3 pr-8 focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:bg-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 !box w-48"
                    value={roleFilter}
                    onChange={(e) => {
                        setRoleFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                </select>

                <input
                    type="date"
                    className="w-40 disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-800/50 transition duration-200 ease-in-out text-sm border-slate-200 shadow-sm rounded-md py-2 px-3 focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:bg-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50"
                />

                <input
                    type="date"
                    className="w-40 disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-800/50 transition duration-200 ease-in-out text-sm border-slate-200 shadow-sm rounded-md py-2 px-3 focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:bg-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50"
                />

                <select
                    className="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-800/50 transition duration-200 ease-in-out text-sm border-slate-200 shadow-sm rounded-md py-2 px-3 pr-8 focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:bg-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 !box w-48"
                    value={sortOrder}
                    onChange={(e) => {
                        setSortOrder(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                </select>
            </div>

            <div className="intro-y col-span-12 overflow-auto 2xl:overflow-visible">
                <table className="w-full text-left -mt-2 border-separate border-spacing-y-[10px]">
                    <thead>
                        <tr>
                            <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0">
                                <input
                                    type="checkbox"
                                    className="transition-all duration-100 ease-in-out shadow-sm border-slate-200 cursor-pointer rounded focus:ring-4 focus:ring-offset-0 focus:ring-primary focus:ring-opacity-20 dark:bg-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50"
                                />
                            </th>
                            <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0">
                                Name
                            </th>
                            <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0 text-center">
                                Email
                            </th>
                            <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0 text-center">
                                Role
                            </th>
                            <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0 text-center">
                                Phone Number
                            </th>
                            <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0 text-center">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user) => (
                            <tr key={user.id} className="intro-x">
                                <td className="px-5 py-3 border-b dark:border-300 box w-10 whitespace-nowrap border-x-0 shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                    <input
                                        type="checkbox"
                                        className="transition-all duration-100 ease-in-out shadow-sm border-slate-200 cursor-pointer rounded focus:ring-4 focus:ring-offset-0 focus:ring-primary focus:ring-opacity-20 dark:bg-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50"
                                    />
                                </td>
                                <td className="px-5 py-3 border-b dark:border-300 box whitespace-nowrap border-x-0 !py-3.5 shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                    <div className="flex items-center">
                                        <div className="image-fit zoom-in h-9 w-9">
                                            <img
                                                src={user.avatar}
                                                className="tooltip cursor-pointer rounded-lg border-white shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                                alt="User avatar"
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <span className="whitespace-nowrap font-medium">
                                                {user.name}
                                            </span>
                                            <div className="mt-0.5 whitespace-nowrap text-xs text-slate-500">
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-3 border-b dark:border-300 box whitespace-nowrap border-x-0 text-center shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                    {user.email}
                                </td>
                                <td className="px-5 py-3 border-b dark:border-300 box whitespace-nowrap border-x-0 text-center shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                    {user.role}
                                </td>
                                <td className="px-5 py-3 border-b dark:border-300 box whitespace-nowrap border-x-0 text-center shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                    {user.phone_number}
                                </td>
                                <td className="px-5 py-3 border-b dark:border-300 box w-56 border-x-0 shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                    <div className="flex items-center justify-center">
                                        <button
                                            className="mr-3 flex items-center text-blue-600"
                                            onClick={() => handleShowUser(user.id)}
                                        >
                                            <Eye className="stroke-1.5 mr-1 h-4 w-4" />
                                            View
                                        </button>
                                        <button
                                            className="mr-3 flex items-center text-green-600"
                                            onClick={() => handleEditUser(user.id)}
                                        >
                                            <CheckSquare className="stroke-1.5 mr-1 h-4 w-4" />
                                            Edit
                                        </button>
                                        <button
                                            className="flex items-center text-danger"
                                            onClick={() => handleDeleteUser(user.id)}
                                        >
                                            <Trash2 className="stroke-1.5 mr-1 h-4 w-4" />
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="intro-y col-span-12 flex flex-wrap items-center sm:flex-row sm:flex-nowrap mt-4">
                <nav className="w-full sm:mr-auto sm:w-auto">
                    <ul className="flex w-full mr-0 sm:mr-auto sm:w-auto gap-2">
                        <li>
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className="transition duration-200 border items-center justify-center py-2 px-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:focus:ring-slate-700 text-slate-800 dark:text-slate-300 border-transparent disabled:opacity-50"
                            >
                                First
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="transition duration-200 border items-center justify-center py-2 px-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:focus:ring-slate-700 text-slate-800 dark:text-slate-300 border-transparent disabled:opacity-50"
                            >
                                <ChevronLeft className="stroke-1.5 h-4 w-4" />
                            </button>
                        </li>

                        <li>
                            <span className="px-3 py-2 text-slate-700 dark:text-slate-300">
                                Page {currentPage} of {totalPages}
                            </span>
                        </li>

                        <li>
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="transition duration-200 border items-center justify-center py-2 px-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:focus:ring-slate-700 text-slate-800 dark:text-slate-300 border-transparent disabled:opacity-50"
                            >
                                <ChevronRight className="stroke-1.5 h-4 w-4" />
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className="transition duration-200 border items-center justify-center py-2 px-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:focus:ring-slate-700 text-slate-800 dark:text-slate-300 border-transparent disabled:opacity-50"
                            >
                                <ChevronsRight className="stroke-1.5 h-4 w-4" />
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default GetUsers;
