import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CloudUpload, Eye, ToggleLeft } from 'lucide-react';
import { createField } from '../../api';

const AddField = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await createField(formData);
            toast.success('Field created successfully!');
            navigate('/fields');
        } catch (error) {
            toast.error('Failed to create field. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="intro-y col-span-12 mt-8 flex flex-wrap items-center xl:flex-nowrap">
                <h2 className="mr-auto text-lg font-medium">Add Field</h2>
                <a
                    href="/fields"
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
                                    Add New Field
                                </div>
                                <div className="mt-5">
                                    <div className="block sm:flex flex-col items-start pt-5 xl:flex-row">
                                        <label className="inline-block mb-2 xl:mr-10 xl:w-64">
                                            <div className="text-left">
                                                <div className="font-medium">Field Name</div>
                                                <div className="mt-3 text-xs leading-relaxed text-slate-500">
                                                    Please enter the field name.
                                                </div>
                                            </div>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Enter field name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full text-sm border-slate-200 shadow-sm rounded-md focus:ring-4 focus:ring-primary"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 flex flex-col md:flex-row justify-end gap-2">
                                <a
                                    href="/fields"
                                    className="transition duration-200 border shadow-sm inline-flex items-center justify-center px-3 rounded-md font-medium bg-white text-slate-500 w-full py-3 md:w-52"
                                >
                                    Cancel
                                    <span className="flex h-5 w-5 items-center justify-center ml-1">
                                        <ToggleLeft className="stroke-1.5 h-4 w-4" />
                                    </span>
                                </a>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="transition duration-200 border shadow-sm inline-flex items-center justify-center px-3 rounded-md font-medium bg-primary text-white w-full py-3 md:w-52 disabled:opacity-70"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <span className="mr-2">Saving</span>
                                            {/* Loading spinner SVG */}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="1.4rem"
                                                height="1.4rem"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                            >
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="#fff"
                                                    strokeWidth="4"
                                                    strokeDasharray="31.415, 31.415"
                                                >
                                                    <animateTransform
                                                        attributeName="transform"
                                                        type="rotate"
                                                        from="0 12 12"
                                                        to="360 12 12"
                                                        dur="1s"
                                                        repeatCount="indefinite"
                                                    />
                                                </circle>
                                            </svg>
                                        </div>
                                    ) : (
                                        'Save'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Tips Section */}
                    <div className="intro-y col-span-2 hidden 2xl:block">
                        <div className="sticky top-0">
                            <div className="relative mt-6 rounded-md border border-warning bg-warning/20 p-5">
                                <div className="text-lg font-medium">Tips</div>
                                <div className="mt-5 font-medium">Hiring</div>
                                <div className="mt-2 text-xs leading-relaxed text-slate-600">
                                    Provide correct details to ensure the system accurately manages attendance and payroll.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default AddField;
