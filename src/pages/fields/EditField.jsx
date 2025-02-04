import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CloudUpload, Eye, ToggleLeft } from 'lucide-react';
import { fetchFieldDetails, updateField } from '../../api';

const EditField = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', address: '' });
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    // Fetch field details from API (assuming response is { field: {...}, attendance_history: [...] })
    useEffect(() => {
        const loadField = async () => {
            try {
                const response = await fetchFieldDetails(id);
                if (response.field) {
                    setFormData({
                        name: response.field.name || '',
                        address: response.field.address || ''
                    });
                } else {
                    toast.error('Field data not found.');
                }
            } catch (error) {
                toast.error('Failed to load field details.');
            } finally {
                setDataLoading(false);
            }
        };
        loadField();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await updateField(id, formData);
            toast.success('Field updated successfully');
            navigate('/fields');
        } catch (error) {
            toast.error('Failed to update field');
        } finally {
            setLoading(false);
        }
    };

    if (dataLoading) return <div>Loading field details...</div>;

    return (
        <>
            <div className="intro-y col-span-12 mt-8 flex flex-wrap items-center xl:flex-nowrap">
                <h2 className="mr-auto text-lg font-medium">Edit Field</h2>
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
                                    Edit Field
                                </div>
                                <div className="mt-5">
                                    <div className="block sm:flex flex-col items-start pt-5 xl:flex-row">
                                        <label className="inline-block mb-2 xl:mr-10 xl:w-64">
                                            <div className="text-left">
                                                <div className="font-medium">Field Name &amp; Address</div>
                                                <div className="mt-3 text-xs leading-relaxed text-slate-500">
                                                    Please enter the field name and its address.
                                                </div>
                                            </div>
                                        </label>
                                        <div className="mt-3 w-full grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Enter field name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full text-sm border-slate-200 shadow-sm rounded-md focus:ring-4 focus:ring-primary"
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="address"
                                                placeholder="Enter field address"
                                                value={formData.address}
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
                                    {loading ? 'Saving' : 'Save'}
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

export default EditField;
