import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CloudUpload, Lightbulb, Eye, ToggleLeft } from 'lucide-react';
import { fetchEmployeeDetails, updateEmployee } from '../../api';

const EditEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        nid: null,
        email: '',
        phone_number: '',
        address: '',
        school_name: ''
    });
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    // Load employee details and extract from data.employee
    useEffect(() => {
        const loadEmployee = async () => {
            try {
                const data = await fetchEmployeeDetails(id);
                setFormData({
                    name: data.employee.name || '',
                    nid: data.employee.nid || '',
                    email: data.employee.email || '',
                    phone_number: data.employee.phone_number || '',
                    address: data.employee.address || '',
                    school_name: data.employee.school_name || ''
                });
            } catch (error) {
                toast.error('Failed to load employee details.');
            } finally {
                setDataLoading(false);
            }
        };
        loadEmployee();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await updateEmployee(id, formData);
            toast.success('Employee updated successfully!');
            navigate('/students');
        } catch (error) {
            toast.error('Failed to update employee.');
        } finally {
            setLoading(false);
        }
    };

    if (dataLoading) return <div>Loading employee details...</div>;

    return (
        <>
            <div className="intro-y col-span-12 mt-8 flex flex-wrap items-center xl:flex-nowrap">
                <h2 className="mr-auto text-lg font-medium">Edit Employee</h2>
                <a
                    href="/students"
                    className="transition duration-200 border inline-flex items-center justify-center py-2 px-3 rounded-md font-medium bg-primary border-primary text-white mr-2 shadow-md"
                >
                    Go Back
                    <span className="flex h-5 w-5 items-center justify-center ml-1">
                        <Eye className="stroke-1.5 h-4 w-4" />
                    </span>
                </a>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mt-5 grid grid-cols-11 gap-x-6 pb-20">
                    <div className="intro-y col-span-11 2xl:col-span-9">
                        <div className="intro-y box mt-5 p-5">
                            <div className="rounded-md border border-slate-200/60 p-5">
                                <div className="flex items-center border-b pb-5 text-base font-medium">
                                    Edit Employee
                                </div>
                                <div className="mt-5">
                                    {/* Name, National ID, Tag ID */}
                                    <div className="block sm:flex flex-col items-start pt-5 xl:flex-row">
                                        <label className="inline-block mb-2 xl:mr-10 xl:w-64">
                                            <div className="text-left">
                                                <div className="font-medium">Name & National ID</div>
                                                <div className="mt-3 text-xs leading-relaxed text-slate-500">
                                                    Please enter the employee name and national ID.
                                                </div>
                                            </div>
                                        </label>
                                        <div className="mt-3 w-full grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Enter name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 group-[.form-inline]:flex-1 group-[.input-group]:rounded-none group-[.input-group]:[&:not(:first-child)]:border-l-transparent group-[.input-group]:first:rounded-l group-[.input-group]:last:rounded-r group-[.input-group]:z-10"
                                                required
                                            />
                                            <input
                                                type="number"
                                                name="nid"
                                                placeholder="Enter National ID (Optional)"
                                                value={formData.nid}
                                                onChange={handleChange}
                                                className="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 group-[.form-inline]:flex-1 group-[.input-group]:rounded-none group-[.input-group]:[&:not(:first-child)]:border-l-transparent group-[.input-group]:first:rounded-l group-[.input-group]:last:rounded-r group-[.input-group]:z-10"
                                            />
                                        </div>
                                    </div>

                                    {/* Email & Phone Number */}
                                    <div className="block sm:flex flex-col items-start pt-5 xl:flex-row">
                                        <label className="inline-block mb-2 xl:mr-10 xl:w-64">
                                            <div className="text-left">
                                                <div className="font-medium">Email & Phone</div>
                                                <div className="mt-3 text-xs leading-relaxed text-slate-500">
                                                    Please enter the employee email and phone number.
                                                </div>
                                            </div>
                                        </label>
                                        <div className="mt-3 w-full grid grid-cols-2 gap-3">
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Enter Email Address"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 group-[.form-inline]:flex-1 group-[.input-group]:rounded-none group-[.input-group]:[&:not(:first-child)]:border-l-transparent group-[.input-group]:first:rounded-l group-[.input-group]:last:rounded-r group-[.input-group]:z-10"
                                                required
                                            />
                                            <input
                                                type="number"
                                                name="phone_number"
                                                placeholder="Enter Phone Number"
                                                value={formData.phone_number}
                                                onChange={handleChange}
                                                className="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 group-[.form-inline]:flex-1 group-[.input-group]:rounded-none group-[.input-group]:[&:not(:first-child)]:border-l-transparent group-[.input-group]:first:rounded-l group-[.input-group]:last:rounded-r group-[.input-group]:z-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Address & School Name */}
                                    <div className="block sm:flex flex-col items-start pt-5 xl:flex-row">
                                        <label className="inline-block mb-2 xl:mr-10 xl:w-64">
                                            <div className="text-left">
                                                <div className="font-medium">Address & School Name</div>
                                                <div className="mt-3 text-xs leading-relaxed text-slate-500">
                                                    Please enter the employee address and School Name.
                                                </div>
                                            </div>
                                        </label>
                                        <div className="mt-3 w-full grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                name="address"
                                                placeholder="Enter Address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 group-[.form-inline]:flex-1 group-[.input-group]:rounded-none group-[.input-group]:[&:not(:first-child)]:border-l-transparent group-[.input-group]:first:rounded-l group-[.input-group]:last:rounded-r group-[.input-group]:z-10"
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="school_name"
                                                placeholder="Enter School Name"
                                                value={formData.school_name}
                                                onChange={handleChange}
                                                className="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80 group-[.form-inline]:flex-1 group-[.input-group]:rounded-none group-[.input-group]:[&:not(:first-child)]:border-l-transparent group-[.input-group]:first:rounded-l group-[.input-group]:last:rounded-r group-[.input-group]:z-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 flex flex-col md:flex-row justify-end gap-2">
                                <a
                                    href="/students"
                                    className="transition duration-200 border shadow-sm inline-flex items-center justify-center px-3 rounded-md font-medium bg-white text-slate-500 w-full py-3 md:w-52"
                                >
                                    Cancel
                                    <span className="flex h-5 w-5 items-center justify-center ml-1">
                                        <ToggleLeft className="stroke-1.5 h-4 w-4" />
                                    </span>
                                </a>
                                <button
                                    type="submit"
                                    className="transition duration-200 border shadow-sm inline-flex items-center justify-center px-3 rounded-md font-medium bg-primary text-white w-full py-3 md:w-52 disabled:opacity-70"
                                >
                                    Save
                                    <span className="flex h-5 w-5 items-center justify-center ml-1">
                                        <CloudUpload className="stroke-1.5 h-4 w-4" />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="intro-y col-span-2 hidden 2xl:block">
                        <div className="sticky top-0">
                            <div className="relative mt-6 rounded-md border border-warning bg-warning/20 p-5">
                                <Lightbulb className="stroke-1.5 absolute right-0 top-0 mr-3 mt-5 h-12 w-12 text-warning/80" />
                                <h2 className="text-lg font-medium">Tips</h2>
                                <div className="mt-5 font-medium">Hiring</div>
                                <div className="mt-2 text-xs leading-relaxed text-slate-600">
                                    <div>
                                        Provide correct details to ensure the system accurately manages attendance and payroll.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default EditEmployee;
