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
import { fetchFields, deleteField } from '../../api';

const GetFields = () => {
    const navigate = useNavigate();
    const [fields, setFields] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch fields from the API on component mount
    useEffect(() => {
        const loadFields = async () => {
            try {
                const data = await fetchFields();
                setFields(data);
            } catch (error) {
                toast.error('Failed to fetch fields');
            }
        };
        loadFields();
    }, []);

    // Filter fields based on search term (searching in name and address)
    const filteredFields = fields.filter(field => {
        const term = searchTerm.toLowerCase();
        return (
            (field.name || '').toLowerCase().includes(term) ||
            (field.address || '').toLowerCase().includes(term)
        );
    });

    // Sort fields by ID (assuming higher ID means newer)
    const sortedFields = filteredFields.sort((a, b) => {
        return sortOrder === 'newest' ? b.id - a.id : a.id - b.id;
    });

    const totalPages = Math.ceil(sortedFields.length / itemsPerPage);
    const currentFields = sortedFields.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Event handlers
    const handleAddField = () => {
        navigate('/field/add');
    };

    const handleShowField = (fieldId) => {
        navigate(`/field/${fieldId}`);
    };

    const handleEditField = (fieldId) => {
        navigate(`/field/${fieldId}/edit`);
    };

    const handleDeleteField = async (fieldId) => {
        if (window.confirm('Are you sure you want to delete this field?')) {
            try {
                await deleteField(fieldId);
                toast.success('Field deleted successfully');
                setFields(prev => prev.filter(field => field.id !== fieldId));
            } catch (error) {
                toast.error('Failed to delete field.');
            }
        }
    };

    return (
        <>
            {/* Header */}
            <div className="intro-y col-span-12 mt-8 flex flex-wrap items-center xl:flex-nowrap">
                <h2 className="mr-auto text-lg font-medium">Fields</h2>
                <button
                    onClick={handleAddField}
                    className="transition duration-200 border inline-flex items-center justify-center py-2 px-3 rounded-md font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:focus:ring-slate-700 dark:focus:ring-opacity-50 bg-primary border-primary text-white dark:border-primary mr-2 shadow-md"
                >
                    Add New Field
                    <span className="flex h-5 w-5 items-center justify-center ml-1">
                        <Plus className="stroke-1.5 h-4 w-4" />
                    </span>
                </button>
            </div>

            {/* SEARCH & SORT */}
            <div className="intro-y col-span-12 mt-2 flex flex-wrap items-center gap-2 xl:flex-nowrap">
                <div className="relative w-56 text-slate-500">
                    <input
                        type="text"
                        placeholder="Search name or address..."
                        className="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-800/50 dark:disabled:border-transparent transition duration-200 ease-in-out text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:border-primary focus:border-opacity-40 dark:bg-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 !box w-56 pr-10"
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

            {/* TABLE */}
            <div className="intro-y col-span-12 overflow-auto 2xl:overflow-visible">
                <table className="w-full text-left -mt-2 border-separate border-spacing-y-[10px]">
                    <thead>
                        <tr>
                            <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0">
                                Name
                            </th>
                            <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0 text-center">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentFields.map(field => (
                            <tr key={field.id} className="intro-x">
                                <td className="px-5 py-3 border-b dark:border-300 box whitespace-nowrap border-x-0 shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                    <div className="flex items-center">
                                        <div className="image-fit zoom-in h-9 w-9">
                                            <img
                                                src={
                                                    field.avatar ||
                                                    'https://cdn-icons-png.flaticon.com/512/10337/10337609.png'
                                                }
                                                className="tooltip cursor-pointer rounded-lg border-white shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                                alt="Field avatar"
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <span className="whitespace-nowrap font-medium">
                                                {field.name || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-3 border-b dark:border-300 box w-56 border-x-0 text-center shadow-[5px_3px_5px_#00000005] dark:bg-600">
                                    <div className="flex items-center justify-center">
                                        <button
                                            onClick={() => handleShowField(field.id)}
                                            className="mr-3 flex items-center text-blue-600"
                                        >
                                            <Eye className="stroke-1.5 mr-1 h-4 w-4" />
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleEditField(field.id)}
                                            className="mr-3 flex items-center text-green-600"
                                        >
                                            <CheckSquare className="stroke-1.5 mr-1 h-4 w-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteField(field.id)}
                                            className="flex items-center text-danger"
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

            {/* PAGINATION */}
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

export default GetFields;
