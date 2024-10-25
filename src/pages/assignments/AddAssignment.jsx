import React, { useState, useEffect, useRef } from 'react';
import { Eye, Save } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addAssignment, fetchEmployees, fetchFields, fetchDepartments } from '../../api';

const AddAssignment = () => {
    const [formData, setFormData] = useState({
        name: '',
        supervisor: '',
        field: '',
        department: '',
        employees: [],
    });
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);
    const [fields, setFields] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);
    const [showSupervisorDropdown, setShowSupervisorDropdown] = useState(false);
    const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
    const [searchTerms, setSearchTerms] = useState({
        employees: '',
        supervisor: ''
    });

    const navigate = useNavigate();

    const supervisorDropdownRef = useRef(null);
    const employeeDropdownRef = useRef(null);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [employeesData, fieldsData, departmentsData] = await Promise.all([
                    fetchEmployees(),
                    fetchFields(),
                    fetchDepartments()
                ]);
                setAllEmployees(employeesData);
                setFields(fieldsData);
                setDepartments(departmentsData);
            } catch (error) {
                console.error('Error fetching initial data:', error);
                toast.error('Failed to load initial data');
            }
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (supervisorDropdownRef.current && !supervisorDropdownRef.current.contains(event.target)) {
                setShowSupervisorDropdown(false);
            }
            if (employeeDropdownRef.current && !employeeDropdownRef.current.contains(event.target)) {
                setShowEmployeeDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddAssignment = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!selectedSupervisor) {
                toast.error('Please select a supervisor');
                return;
            }

            // Create array of employee IDs including selected employees AND supervisor
            const employeeIds = [
                selectedSupervisor.id,  // Add supervisor ID first
                ...employees.map(emp => emp.id)  // Then add other employee IDs
            ];

            const payload = {
                name: formData.name,
                supervisor: selectedSupervisor.id,
                field: formData.field,
                department: formData.department,
                employees: employeeIds // Now includes supervisor ID
            };

            console.log('Submitting payload:', payload); // For debugging

            await addAssignment(payload);
            toast.success('Assignment added successfully');
            navigate('/assignments');
        } catch (error) {
            console.error('Error adding assignment:', error);
            toast.error(error.message || 'Failed to add assignment');
        } finally {
            setLoading(false);
        }
    };

    const handleEmployeeSelect = (employee) => {
        if (!employees.some(emp => emp.id === employee.id) && employee.id !== selectedSupervisor?.id) {
            setEmployees(prev => [...prev, employee]);
            // Update formData with new employee ID
            setFormData(prev => ({
                ...prev,
                employees: [...prev.employees, employee.id]
            }));
        }
        setSearchTerms(prev => ({ ...prev, employees: '' }));
        setShowEmployeeDropdown(false);
    };

    const handleEmployeeRemove = (id) => {
        // Prevent removing if it's the supervisor
        if (id === selectedSupervisor?.id) {
            return;
        }
        setEmployees(prev => prev.filter(emp => emp.id !== id));
        setFormData(prev => ({
            ...prev,
            employees: prev.employees.filter(empId => empId !== id)
        }));
    };

    const handleSupervisorSelect = (supervisor) => {
        // If there was a previous supervisor, remove their ID from employees array
        if (selectedSupervisor) {
            setFormData(prev => ({
                ...prev,
                employees: prev.employees.filter(empId => empId !== selectedSupervisor.id)
            }));
        }

        setSelectedSupervisor(supervisor);
        setFormData(prev => ({
            ...prev,
            supervisor: supervisor.id,
        }));
        setSearchTerms(prev => ({ ...prev, supervisor: supervisor.name }));
        setShowSupervisorDropdown(false);

        // Remove new supervisor from employees list if they were previously selected
        setEmployees(prev => prev.filter(emp => emp.id !== supervisor.id));
    };

    const handleSearchChange = (type, value) => {
        setSearchTerms(prev => ({
            ...prev,
            [type]: value
        }));
        if (type === 'supervisor') {
            setShowSupervisorDropdown(true);
        }
    };

    const handleEmployeeFieldFocus = () => {
        setShowEmployeeDropdown(true);
        setSearchTerms(prev => ({ ...prev, employees: '' }));
    };

    const filteredEmployees = allEmployees
        .filter(emp =>
            emp.name.toLowerCase().includes(searchTerms.employees.toLowerCase()) &&
            emp.id !== selectedSupervisor?.id && // Exclude selected supervisor
            !employees.some(selectedEmp => selectedEmp.id === emp.id) // Exclude already selected employees
        );

    const filteredSupervisors = allEmployees
        .filter(sup =>
            sup.name.toLowerCase().includes(searchTerms.supervisor.toLowerCase())
        )
        .slice(0, 4);

    // Validation for submit button
    const isFormValid = formData.name &&
        formData.field &&
        formData.department &&
        selectedSupervisor;

    return (
        <div className="px-5 mt-16">
            <div className="container">
                <div className="grid grid-cols-12 gap-x-6 gap-y-10">
                    <div className="col-span-12 sm:col-span-10 sm:col-start-2">
                        <div className="flex flex-col gap-y-3 md:h-10 md:flex-row md:items-center">
                            <div className="text-base font-medium">
                                Add New Assignment
                            </div>
                            <div className="flex flex-col gap-x-3 gap-y-2 sm:flex-row md:ml-auto">
                                <Link to='/assignments' className="inline-flex items-center justify-center px-3 py-2 font-medium text-white transition duration-200 border rounded-md shadow-sm cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 bg-primary border-primary">
                                    <Eye className='mr-2 h-4 w-4 stroke-[1.3]' />
                                    Go Back
                                </Link>
                            </div>
                        </div>
                        <div className="mt-7">
                            <div className="flex flex-col box box--stacked">
                                <form onSubmit={handleAddAssignment} className="p-7">
                                    {/* Assignment Name Field */}
                                    <div className="flex-col block pt-5 mt-5 first:mt-0 first:pt-0 sm:flex xl:flex-row xl:items-center">
                                        <div className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:mr-14 xl:w-60">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">Assignment Name</div>
                                                    <div className="ml-2.5 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-500">Required</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full text-sm transition duration-200 ease-in-out rounded-md shadow-sm border-slate-200 placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Field Selection */}
                                    <div className="flex-col block pt-5 mt-5 first:mt-0 first:pt-0 sm:flex xl:flex-row xl:items-center">
                                        <div className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:mr-14 xl:w-60">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">Field</div>
                                                    <div className="ml-2.5 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-500">Required</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <select
                                                name="field"
                                                value={formData.field}
                                                onChange={handleInputChange}
                                                className="w-full text-sm transition duration-200 ease-in-out rounded-md shadow-sm border-slate-200 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary"
                                                required
                                            >
                                                <option value="">Select Field</option>
                                                {fields.map(field => (
                                                    <option key={field.id} value={field.id}>
                                                        {field.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Department Selection */}
                                    <div className="flex-col block pt-5 mt-5 first:mt-0 first:pt-0 sm:flex xl:flex-row xl:items-center">
                                        <div className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:mr-14 xl:w-60">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">Department</div>
                                                    <div className="ml-2.5 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-500">Required</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <select
                                                name="department"
                                                value={formData.department}
                                                onChange={handleInputChange}
                                                className="w-full text-sm transition duration-200 ease-in-out rounded-md shadow-sm border-slate-200 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary"
                                                required
                                            >
                                                <option value="">Select Department</option>
                                                {departments.map(dept => (
                                                    <option key={dept.id} value={dept.id}>
                                                        {dept.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Supervisor Selection with Search */}
                                    <div className="flex-col block pt-5 mt-5 first:mt-0 first:pt-0 sm:flex xl:flex-row xl:items-center">
                                        <div className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:mr-14 xl:w-60">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">Supervisor</div>
                                                    <div className="ml-2.5 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-500">Required</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 w-full mt-3 xl:mt-0" ref={supervisorDropdownRef}>
                                            <input
                                                type="text"
                                                name="supervisor"
                                                placeholder="Search supervisor..."
                                                value={searchTerms.supervisor}
                                                onChange={(e) => handleSearchChange('supervisor', e.target.value)}
                                                onFocus={() => setShowSupervisorDropdown(true)}
                                                className="w-full text-sm transition duration-200 ease-in-out rounded-md shadow-sm border-slate-200 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary"
                                            />
                                            {showSupervisorDropdown && (
                                                <div className="mt-2 overflow-y-auto border rounded-md shadow-sm max-h-40 bg-white absolute z-50">
                                                    {filteredSupervisors.length > 0 ? (
                                                        filteredSupervisors.map((sup) => (
                                                            <div
                                                                key={sup.id}
                                                                className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedSupervisor?.id === sup.id ? 'bg-primary text-white' : ''}`}
                                                                onClick={() => handleSupervisorSelect(sup)}
                                                            >
                                                                {sup.name}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="p-2 text-gray-500">No matching supervisors found</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Employees Selection with Search */}
                                    <div className="flex-col block pt-5 mt-5 first:mt-0 first:pt-0 sm:flex xl:flex-row xl:items-center">
                                        <div className="inline-block mb-2 sm:mb-0 sm:mr-5 sm:text-right xl:mr-14 xl:w-60">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">Employees</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 w-full mt-3 xl:mt-0" ref={employeeDropdownRef}>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="employees"
                                                    placeholder="Search employees..."
                                                    value={searchTerms.employees}
                                                    onChange={(e) => handleSearchChange('employees', e.target.value)}
                                                    onFocus={handleEmployeeFieldFocus}
                                                    className="w-full text-sm transition duration-200 ease-in-out rounded-md shadow-sm border-slate-200 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary"
                                                />
                                                {showEmployeeDropdown && (
                                                    <div className="mt-2 overflow-y-auto border rounded-md shadow-sm max-h-60 bg-white absolute z-40 w-full">
                                                        {filteredEmployees.length > 0 ? (
                                                            filteredEmployees.map((emp) => (
                                                                <div
                                                                    key={emp.id}
                                                                    className={`p-2 cursor-pointer hover:bg-gray-100 ${employees.some(selectedEmp => selectedEmp.id === emp.id) ? 'bg-primary/20' : ''}`}
                                                                    onClick={() => handleEmployeeSelect(emp)}
                                                                >
                                                                    {emp.name}
                                                                    {employees.some(selectedEmp => selectedEmp.id === emp.id) && (
                                                                        <span className="ml-2 text-primary">✓</span>
                                                                    )}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="p-2 text-gray-500">No matching employees found</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Selected Employees Tags */}
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {selectedSupervisor && (
                                                    <div className="inline-flex items-center px-2 py-1 text-sm text-white rounded-full bg-primary/80">
                                                        {selectedSupervisor.name}
                                                        <span className="ml-1 text-xs">(Supervisor)</span>
                                                    </div>
                                                )}
                                                {employees.map((emp) => (
                                                    <div
                                                        key={emp.id}
                                                        className="inline-flex items-center px-2 py-1 text-sm text-white rounded-full bg-primary"
                                                    >
                                                        {emp.name}
                                                        <button
                                                            type="button"
                                                            className="ml-2 text-xs hover:text-white/80"
                                                            onClick={() => handleEmployeeRemove(emp.id)}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex py-5 border-t border-slate-200/80 px-7 md:justify-end mt-5">
                                        <button
                                            type="submit"
                                            className={`inline-flex items-center justify-center w-full px-10 py-2 font-medium transition duration-200 border rounded-md shadow-sm cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 text-primary border-primary md:w-auto ${loading || !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                            disabled={loading || !isFormValid}
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
                                            {loading ? 'Saving...' : 'Add Assignment'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddAssignment;