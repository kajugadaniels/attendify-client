import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CloudUpload, Eye, Lightbulb, ToggleLeft } from 'lucide-react';
import { createAssignment, fetchFields, fetchDepartments, fetchEmployees } from '../../api';

const AddAssignment = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        field: null,
        department: null,
        supervisor: null,
        employees: [],
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [fieldOptions, setFieldOptions] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [employeeOptions, setEmployeeOptions] = useState([]);

    useEffect(() => {
        const loadSelectOptions = async () => {
            try {
                const fieldsData = await fetchFields();
                const departmentsData = await fetchDepartments();
                const employeesData = await fetchEmployees();
                setFieldOptions(fieldsData.map(field => ({ value: field.id, label: field.name })));
                setDepartmentOptions(departmentsData.map(dept => ({ value: dept.id, label: dept.name })));
                setEmployeeOptions(employeesData.map(emp => ({ value: emp.id, label: emp.name })));
            } catch (error) {
                toast.error('Failed to load select options');
            }
        };
        loadSelectOptions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, selectedOption) => {
        setFormData(prev => ({ ...prev, [name]: selectedOption }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            name: formData.name,
            field: formData.field ? formData.field.value : null,
            department: formData.department ? formData.department.value : null,
            supervisor: formData.supervisor ? formData.supervisor.value : null,
            employees: formData.employees ? formData.employees.map(option => option.value) : [],
            notes: formData.notes
        };
        try {
            setLoading(true);
            await createAssignment(payload);
            toast.success('Assignment created successfully!');
            navigate('/assignments');
        } catch (error) {
            toast.error('Failed to create assignment. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Header Section */}
            <div className="intro-y col-span-12 mt-8 flex flex-wrap items-center xl:flex-nowrap">
                <h2 className="mr-auto text-lg font-medium">Add Assignment</h2>
                <a
                    href="/assignments"
                    className="transition duration-200 border inline-flex items-center justify-center py-2 px-3 rounded-md font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:focus:ring-slate-700 dark:focus:ring-opacity-50 bg-primary border-primary text-white dark:border-primary mr-2 shadow-md"
                >
                    Go Back
                    <span className="flex h-5 w-5 items-center justify-center">
                        <Eye className="stroke-1.5 h-4 w-4" />
                    </span>
                </a>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit}>
                <div className="mt-5 grid grid-cols-11 gap-x-6 pb-20">
                    <div className="intro-y col-span-11 2xl:col-span-9">
                        <div className="intro-y box mt-5 p-5">
                            <div className="intro-y box mt-5 p-5">
                                <div className="rounded-md border border-slate-200/60 p-5 dark:border-darkmode-400">
                                    <div className="flex items-center border-b border-slate-200/60 pb-5 text-base font-medium dark:border-darkmode-400">
                                        Add New Assignment
                                    </div>
                                    <div className="mt-5">
                                        {/* Assignment Name & Field */}
                                        <div className="block sm:flex group form-inline mt-5 flex-col items-start pt-5 xl:flex-row">
                                            <label className="inline-block mb-2 xl:!mr-10 xl:w-64">
                                                <div className="text-left">
                                                    <div className="flex items-center">
                                                        <div className="font-medium">Assignment Name &amp; Field</div>
                                                        <div className="ml-2 rounded-md bg-slate-200 px-2 py-0.5 text-xs text-slate-600 dark:bg-darkmode-300 dark:text-slate-400">
                                                            Required
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 text-xs leading-relaxed text-slate-500">
                                                        Provide the assignment title and select a field.
                                                    </div>
                                                </div>
                                            </label>
                                            <div className="mt-3 w-full flex-1 xl:mt-0 grid grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="Enter assignment name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="disabled:bg-slate-100 dark:disabled:bg-darkmode-800/50 transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary dark:bg-darkmode-800"
                                                    required
                                                />
                                                <Select
                                                    name="field"
                                                    options={fieldOptions}
                                                    value={formData.field}
                                                    onChange={(option) => handleSelectChange('field', option)}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select Field"
                                                    isClearable
                                                />
                                            </div>
                                        </div>

                                        {/* Department & Supervisor */}
                                        <div className="block sm:flex group form-inline mt-5 flex-col items-start pt-5 xl:flex-row">
                                            <label className="inline-block mb-2 xl:!mr-10 xl:w-64">
                                                <div className="text-left">
                                                    <div className="flex items-center">
                                                        <div className="font-medium">Department &amp; Supervisor</div>
                                                        <div className="ml-2 rounded-md bg-slate-200 px-2 py-0.5 text-xs text-slate-600 dark:bg-darkmode-300 dark:text-slate-400">
                                                            Optional
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 text-xs leading-relaxed text-slate-500">
                                                        Choose the department and supervisor for this assignment.
                                                    </div>
                                                </div>
                                            </label>
                                            <div className="mt-3 w-full flex-1 xl:mt-0 grid grid-cols-2 gap-3">
                                                <Select
                                                    name="department"
                                                    options={departmentOptions}
                                                    value={formData.department}
                                                    onChange={(option) => handleSelectChange('department', option)}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select Department"
                                                    isClearable
                                                />
                                                <Select
                                                    name="supervisor"
                                                    options={employeeOptions}
                                                    value={formData.supervisor}
                                                    onChange={(option) => handleSelectChange('supervisor', option)}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select Supervisor"
                                                    isClearable
                                                />
                                            </div>
                                        </div>

                                        {/* Employees & Notes */}
                                        <div className="block sm:flex group form-inline mt-5 flex-col items-start pt-5 xl:flex-row">
                                            <label className="inline-block mb-2 xl:!mr-10 xl:w-64">
                                                <div className="text-left">
                                                    <div className="flex items-center">
                                                        <div className="font-medium">Employees</div>
                                                        <div className="ml-2 rounded-md bg-slate-200 px-2 py-0.5 text-xs text-slate-600 dark:bg-darkmode-300 dark:text-slate-400">
                                                            required
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 text-xs leading-relaxed text-slate-500">
                                                        Assign employees to this assignment.
                                                    </div>
                                                </div>
                                            </label>
                                            <div className="mt-3 w-full flex-1 xl:mt-0 grid grid-cols-1 gap-3">
                                                <Select
                                                    name="employees"
                                                    options={employeeOptions}
                                                    value={formData.employees}
                                                    onChange={(option) => handleSelectChange('employees', option)}
                                                    className="react-select-container"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select Employees"
                                                    isMulti
                                                    isClearable
                                                />
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        <div className="block sm:flex group form-inline mt-5 flex-col items-start pt-5 xl:flex-row">
                                            <label className="inline-block mb-2 xl:!mr-10 xl:w-64">
                                                <div className="text-left">
                                                    <div className="flex items-center">
                                                        <div className="font-medium">Assignment Notes</div>
                                                        <div className="ml-2 rounded-md bg-slate-200 px-2 py-0.5 text-xs text-slate-600 dark:bg-darkmode-300 dark:text-slate-400">
                                                            Optional
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 text-xs leading-relaxed text-slate-500">
                                                        Add any additional notes.
                                                    </div>
                                                </div>
                                            </label>
                                            <div className="mt-3 w-full flex-1 xl:mt-0 grid grid-cols-1 gap-3">
                                                <textarea
                                                    name="notes"
                                                    placeholder="Enter any notes"
                                                    value={formData.notes}
                                                    onChange={handleChange}
                                                    className="disabled:bg-slate-100 dark:disabled:bg-darkmode-800/50 transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary dark:bg-darkmode-800 h-24"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-5 flex flex-col justify-end gap-2 md:flex-row">
                                    <a
                                        href="/assignments"
                                        type="button"
                                        className="transition duration-200 border shadow-sm inline-flex items-center justify-center px-3 rounded-md font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 bg-white dark:bg-darkmode-800 text-slate-500 dark:text-slate-300 dark:focus:ring-slate-700 w-full py-3 md:w-52"
                                    >
                                        Cancel
                                        <span className="flex h-5 w-5 items-center justify-center ml-1">
                                            <ToggleLeft className="stroke-1.5 h-4 w-4" />
                                        </span>
                                    </a>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="transition duration-200 border shadow-sm inline-flex items-center justify-center px-3 rounded-md font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:focus:ring-slate-700 bg-primary border-primary text-white w-full py-3 md:w-52 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <div className="flex items-center">
                                                <span className="mr-2">Saving</span>
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
                    </div>

                    {/* Tips Section */}
                    <div className="intro-y col-span-2 hidden 2xl:block">
                        <div className="sticky top-0">
                            <div className="relative mt-6 rounded-md border border-warning bg-warning/20 p-5 dark:border-0 dark:bg-darkmode-600">
                                <Lightbulb className="stroke-1.5 absolute right-0 top-0 mr-3 mt-5 h-12 w-12 text-warning/80" />
                                <h2 className="text-lg font-medium">Tips</h2>
                                <div className="mt-5 font-medium">Assignment</div>
                                <div className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-500">
                                    Provide accurate details. Verify the assignment name, select the correct field, department, and supervisor. Also, assign the appropriate employees and add relevant notes if necessary.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default AddAssignment;
