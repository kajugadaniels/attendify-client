import React, { useState, useEffect } from 'react'
import { Eye, Save } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { endAssignmentById, fetchAssignmentById } from '../../api'

const EndAssignment = () => {
    const { id } = useParams();
    const [assignmentData, setAssignmentData] = useState({
        end_date: '',
        note: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadAssignmentDetails = async () => {
            try {
                const data = await fetchAssignmentById(id);
                setAssignmentData(data);
            } catch (error) {
                toast.error('Failed to load assignment details.');
                navigate('/assignments');
            }
        };

        loadAssignmentDetails();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAssignmentData({ ...assignmentData, [name]: value });
    };

    const handleEndAssignment = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await endAssignmentById(id, assignmentData);
            toast.success('Assignment updated successfully.');
            navigate('/assignments');
        } catch (error) {
            toast.error(error.message || 'An error occurred while updating the assignment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-5 mt-16">
            <div className="container">
                <div className="grid grid-cols-12 gap-x-6 gap-y-10">
                    <div className="col-span-12 sm:col-span-10 sm:col-start-2">
                        <div className="flex flex-col gap-y-3 md:h-10 md:flex-row md:items-center">
                            <div className="text-base font-medium group-[.mode--light]:text-white">
                                End Assignment({assignmentData.name})
                                <br />
                                <span><b>Supervisor:</b> {assignmentData.supervisor_name}</span>
                            </div>
                            <div className="flex flex-col gap-x-3 gap-y-2 sm:flex-row md:ml-auto">
                                <Link
                                    to="/assignments"
                                    className="inline-flex items-center justify-center px-3 py-2 font-medium text-white transition duration-200 border rounded-md shadow-sm cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 bg-primary border-primary"
                                >
                                    <Eye className="mr-2 h-4 w-4 stroke-[1.3]" />
                                    Go Back
                                </Link>
                            </div>
                        </div>
                        <div className="mt-7">
                            <div className="flex flex-col box box--stacked">
                                <form onSubmit={handleEndAssignment} className="p-7">
                                    {/* Date */}
                                    <div className="flex-col block pt-5 mt-5 sm:flex xl:flex-row xl:items-center">
                                        <div className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:mr-14 xl:w-60">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">
                                                        End Time
                                                    </div>
                                                    <div className="ml-2.5 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                                                        Required
                                                    </div>
                                                </div>
                                                <div className="mt-1.5 text-xs leading-relaxed text-slate-500/80 xl:mt-3">
                                                    Provide time assignment ended.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <div className="flex flex-col items-center md:flex-row">
                                                <input
                                                    type="date"
                                                    name="end_date"
                                                    value={assignmentData.end_date}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter full name"
                                                    className="w-full text-sm transition duration-200 ease-in-out rounded-md shadow-sm border-slate-200 placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Note */}
                                    <div className="flex-col block pt-5 mt-5 sm:flex xl:flex-row xl:items-center">
                                        <div className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:mr-14 xl:w-60">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">
                                                        Note
                                                    </div>
                                                    <div className="ml-2.5 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                                                        Required
                                                    </div>
                                                </div>
                                                <div className="mt-1.5 text-xs leading-relaxed text-slate-500/80 xl:mt-3">
                                                    Provide note on how assignment was performed.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <div className="flex flex-col items-center md:flex-row">
                                                <textarea
                                                    type="text"
                                                    name="note"
                                                    value={assignmentData.note}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter note"
                                                    className="w-full text-sm transition duration-200 ease-in-out rounded-md shadow-sm border-slate-200 placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary"
                                                    rows="6"
                                                    required
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button with Loading */}
                                    <div className="flex py-5 border-t border-slate-200/80 px-7 md:justify-end">
                                        <button
                                            type="submit"
                                            className={`inline-flex items-center justify-center w-full px-10 py-2 font-medium transition duration-200 border rounded-md shadow-sm cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 text-primary border-primary md:w-auto ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <svg
                                                    className="w-5 h-5 mr-2 animate-spin"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                                                    ></path>
                                                </svg>
                                            ) : (
                                                <Save className="-ml-2 mr-2 h-4 w-4 stroke-[1.3]" />
                                            )}
                                            {loading ? 'Ending...' : 'End Assignment'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EndAssignment