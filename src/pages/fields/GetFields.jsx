import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, EllipsisVertical, KeySquare, ListChecks, PenLine, Search, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { deleteField, fetchFields } from '../../api'
import { toast } from 'react-toastify'

const GetFields = () => {
    const [fields, setFields] = useState([]);
    const [filteredFields, setFilteredFields] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [fieldsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadFields = async () => {
            setLoading(true);
            try {
                const data = await fetchFields();
                setFields(data);
                setFilteredFields(data);
            } catch (error) {
                toast.error('Failed to load fields.');
            } finally {
                setLoading(false);
            }
        };
        loadFields();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term) {
            const filtered = fields.filter((field) =>
                field.name.toLowerCase().includes(term.toLowerCase()) ||
                field.adrress?.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredFields(filtered);
            setCurrentPage(1); // Reset to the first page when searching
        } else {
            setFilteredFields(fields);
        }
    };

    const toggleDropdown = (fieldId) => {
        setDropdownOpen(dropdownOpen === fieldId ? null : fieldId);
    };

    const handleEdit = (fieldId) => {
        navigate(`/field/edit/${fieldId}`);
    };

    const handleDelete = async (fieldId) => {
        if (window.confirm('Are you sure you want to delete this field?')) {
            try {
                await deleteField(fieldId);
                setFields(fields.filter((field) => field.id !== fieldId));
                setFilteredFields(filteredFields.filter((field) => field.id !== fieldId));
                toast.success('field deleted successfully.');
            } catch (error) {
                toast.error('Failed to delete field.');
            }
        }
    };

    // Pagination logic
    const indexOfLastField = currentPage * fieldsPerPage;
    const indexOfFirstField = indexOfLastField - fieldsPerPage;
    const currentFields = filteredFields.slice(indexOfFirstField, indexOfLastField);

    const totalPages = Math.ceil(filteredFields.length / fieldsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="px-5 mt-16">
            <div className="container">
                <div className="grid grid-cols-12 gap-x-6 gap-y-10">
                    <div className="col-span-12">
                        <div className="flex flex-col gap-y-3 md:h-10 md:flex-row md:items-center">
                            <div className="text-base font-medium group-[.mode--light]:text-white">
                                Fields
                            </div>
                            <div className="flex flex-col gap-x-3 gap-y-2 sm:flex-row md:ml-auto">
                                <Link to='/field/add' className="inline-flex items-center justify-center px-3 py-2 font-medium text-white transition duration-200 border rounded-md shadow-sm cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 bg-primary border-primary">
                                    <PenLine className='mr-2 h-4 w-4 stroke-[1.3]' />
                                    Add New Field
                                </Link>
                            </div>
                        </div>
                        <div className="mt-3.5 flex flex-col gap-8">
                            <div className="flex flex-col box box--stacked">
                                <div className="flex flex-col p-5 gap-y-2 sm:flex-row sm:items-center">
                                    <div>
                                        <div className="relative">
                                            <Search className="absolute inset-y-0 left-0 z-10 my-auto ml-3 h-4 w-4 stroke-[1.3] text-slate-500" />
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={handleSearch}
                                                placeholder="Search fields..."
                                                className="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 [&[type='file']]:border file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:border-r-[1px] file:border-slate-100/10 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-500/70 hover:file:bg-200 group-[.form-inline]:flex-1 group-[.input-group]:rounded-none group-[.input-group]:[&:not(:first-child)]:border-l-transparent group-[.input-group]:first:rounded-l group-[.input-group]:last:rounded-r group-[.input-group]:z-10 rounded-[0.5rem] pl-9 sm:w-64"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="overflow-auto xl:overflow-visible">
                                    {loading ? (
                                        <div className="py-5 text-center">Loading fields...</div>
                                    ) : (
                                        <table className="w-full text-left border-b border-slate-200/60">
                                            <thead>
                                                <tr>
                                                    <td className="w-5 px-5 py-4 font-medium border-t border-b bg-slate-50 text-slate-500">
                                                        <input type="checkbox" className="transition-all duration-100 ease-in-out rounded shadow-sm cursor-pointer border-slate-200 focus:ring-4 focus:ring-primary focus:ring-opacity-20" />
                                                    </td>
                                                    <td className="px-5 py-4 font-medium border-t border-b bg-slate-50 text-slate-500">
                                                        Name
                                                    </td>
                                                    <td className="px-5 py-4 font-medium border-t border-b bg-slate-50 text-slate-500">
                                                        Address
                                                    </td>
                                                    <td className="w-20 px-5 py-4 font-medium text-center border-t border-b bg-slate-50 text-slate-500">
                                                        Action
                                                    </td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentFields.map((field) => (
                                                    <tr key={field.id} className="[&_td]:last:border-b-0">
                                                        <td className="px-5 py-4 border-b border-dashed">
                                                            <input type="checkbox" className="transition-all duration-100 ease-in-out rounded shadow-sm cursor-pointer border-slate-200 focus:ring-4 focus:ring-primary focus:ring-opacity-20" />
                                                        </td>
                                                        <td className="px-5 py-4 border-b border-dashed">
                                                            {field.name || 'N/A'}
                                                        </td>
                                                        <td className="px-5 py-4 border-b border-dashed">
                                                            {field.address || 'N/A'}
                                                        </td>
                                                        <td className="relative px-5 py-4 border-b border-dashed">
                                                            <div className="flex items-center justify-center">
                                                                <div className="relative h-5">
                                                                    <button
                                                                        className="w-5 h-5 cursor-pointer text-slate-500"
                                                                        onClick={() => toggleDropdown(field.id)}
                                                                    >
                                                                        <EllipsisVertical className="stroke-[1] w-5 h-5 fill-slate-400/70 stroke-slate-400/70" />
                                                                    </button>
                                                                    <div className={`dropdown-menu absolute right-0 mt-2 z-[9999] ${dropdownOpen === field.id ? 'block' : 'hidden'}`}>
                                                                        <div className="w-40 p-2 bg-white rounded-md shadow-lg dropdown-content">
                                                                            <button
                                                                                onClick={() => handleEdit(field.id)}
                                                                                className="flex items-center p-2 transition duration-300 ease-in-out rounded-md cursor-pointer hover:bg-slate-200/60"
                                                                            >
                                                                                <ListChecks className="stroke-[1] mr-2 h-4 w-4" />
                                                                                Edit
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDelete(field.id)}
                                                                                className="flex items-center p-2 transition duration-300 ease-in-out rounded-md cursor-pointer hover:bg-slate-200/60 text-danger"
                                                                            >
                                                                                <Trash2 className="stroke-[1] mr-2 h-4 w-4" />
                                                                                Delete
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                                <div className="flex flex-col-reverse flex-wrap items-center p-5 flex-reverse gap-y-2 sm:flex-row">
                                    <nav className="flex-1 w-full mr-auto sm:w-auto">
                                        <ul className="flex w-full mr-0 sm:mr-auto sm:w-auto">
                                            <li className="flex-1 sm:flex-initial">
                                                <button
                                                    onClick={() => paginate(1)}
                                                    disabled={currentPage === 1}
                                                    className="transition duration-200 border items-center justify-center py-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 hover:bg-opacity-90 hover:border-opacity-90 text-center disabled:opacity-70 disabled:cursor-not-allowed min-w-0 sm:min-w-[40px] shadow-none font-normal flex border-transparent text-slate-800 sm:mr-2 dark:text-slate-300 px-1 sm:px-3"
                                                >
                                                    <ChevronsLeft className="stroke-[1] h-4 w-4" />
                                                </button>
                                            </li>
                                            <li className="flex-1 sm:flex-initial">
                                                <button
                                                    onClick={() => paginate(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className="transition duration-200 border items-center justify-center py-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 hover:bg-opacity-90 hover:border-opacity-90 text-center disabled:opacity-70 disabled:cursor-not-allowed min-w-0 sm:min-w-[40px] shadow-none font-normal flex border-transparent text-slate-800 sm:mr-2 dark:text-slate-300 px-1 sm:px-3"
                                                >
                                                    <ChevronLeft className="stroke-[1] h-4 w-4" />
                                                </button>
                                            </li>
                                            <li className="flex-1 sm:flex-initial">
                                                <span className="transition duration-200 border items-center justify-center py-2 rounded-md min-w-0 sm:min-w-[40px] shadow-none font-normal flex border-transparent text-slate-800 sm:mr-2 dark:text-slate-300 px-1 sm:px-3">
                                                    Page {currentPage} of {totalPages}
                                                </span>
                                            </li>
                                            <li className="flex-1 sm:flex-initial">
                                                <button
                                                    onClick={() => paginate(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className="transition duration-200 border items-center justify-center py-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 hover:bg-opacity-90 hover:border-opacity-90 text-center disabled:opacity-70 disabled:cursor-not-allowed min-w-0 sm:min-w-[40px] shadow-none font-normal flex border-transparent text-slate-800 sm:mr-2 dark:text-slate-300 px-1 sm:px-3"
                                                >
                                                    <ChevronRight className="stroke-[1] h-4 w-4" />
                                                </button>
                                            </li>
                                            <li className="flex-1 sm:flex-initial">
                                                <button
                                                    onClick={() => paginate(totalPages)}
                                                    disabled={currentPage === totalPages}
                                                    className="transition duration-200 border items-center justify-center py-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 hover:bg-opacity-90 hover:border-opacity-90 text-center disabled:opacity-70 disabled:cursor-not-allowed min-w-0 sm:min-w-[40px] shadow-none font-normal flex border-transparent text-slate-800 sm:mr-2 dark:text-slate-300 px-1 sm:px-3"
                                                >
                                                    <ChevronsRight className="stroke-[1] h-4 w-4" />
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GetFields