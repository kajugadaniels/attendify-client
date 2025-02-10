import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CloudUpload, Lightbulb, Eye, ToggleLeft } from 'lucide-react';
import { createEmployee } from '../../api';

const AddEmployee = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        nid: '',
        tag_id: '',
        email: '',
        phone_number: '',
        address: '',
        rssb_number: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await createEmployee(formData);
            toast.success('Employee created successfully!');
            navigate('/employees');
        } catch (error) {
            toast.error('Failed to create employee. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="intro-y col-span-12 mt-8 flex flex-wrap items-center xl:flex-nowrap">
                <h2 className="mr-auto text-lg font-medium">Add Employee</h2>
                <a
                    href="/employees"
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
                                    Add New Employee
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
                                        <div className="mt-3 w-full grid grid-cols-3 gap-3">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Enter name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full text-sm border-slate-200 shadow-sm rounded-md focus:ring-4 focus:ring-primary"
                                                required
                                            />
                                            <input
                                                type="number"
                                                name="nid"
                                                placeholder="Enter National ID"
                                                value={formData.nid}
                                                onChange={handleChange}
                                                className="w-full text-sm border-slate-200 shadow-sm rounded-md focus:ring-4 focus:ring-primary"
                                                required
                                            />
                                            <input
                                                type="number"
                                                name="tag_id"
                                                placeholder="Enter Tag ID"
                                                value={formData.tag_id}
                                                onChange={handleChange}
                                                className="w-full text-sm border-slate-200 shadow-sm rounded-md focus:ring-4 focus:ring-primary"
                                                required
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
                                                className="w-full text-sm border-slate-200 shadow-sm rounded-md focus:ring-4 focus:ring-primary"
                                                required
                                            />
                                            <input
                                                type="number"
                                                name="phone_number"
                                                placeholder="Enter Phone Number"
                                                value={formData.phone_number}
                                                onChange={handleChange}
                                                className="w-full text-sm border-slate-200 shadow-sm rounded-md focus:ring-4 focus:ring-primary"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Address & RSSB Number */}
                                    <div className="block sm:flex flex-col items-start pt-5 xl:flex-row">
                                        <label className="inline-block mb-2 xl:mr-10 xl:w-64">
                                            <div className="text-left">
                                                <div className="font-medium">Address & RSSB Number</div>
                                                <div className="mt-3 text-xs leading-relaxed text-slate-500">
                                                    Please enter the employee address and RSSB number.
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
                                                className="w-full text-sm border-slate-200 shadow-sm rounded-md focus:ring-4 focus:ring-primary"
                                                required
                                            />
                                            <input
                                                type="number"
                                                name="rssb_number"
                                                placeholder="Enter RSSB Number"
                                                value={formData.rssb_number}
                                                onChange={handleChange}
                                                className="w-full text-sm border-slate-200 shadow-sm rounded-md focus:ring-4 focus:ring-primary"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 flex flex-col md:flex-row justify-end gap-2">
                                <a
                                    href="/employees"
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

export default AddEmployee;
