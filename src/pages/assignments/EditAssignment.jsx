import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchAssignmentDetails, updateAssignment, fetchFields, fetchDepartments, fetchEmployees } from '../../api';
import { CloudUpload, Eye, ToggleLeft } from 'lucide-react';

const EditAssignment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        field: null,
        department: null,
        supervisor: null,
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [fieldOptions, setFieldOptions] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [employeeOptions, setEmployeeOptions] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const assignmentData = await fetchAssignmentDetails(id);
                const fieldsData = await fetchFields();
                const departmentsData = await fetchDepartments();
                const employeesData = await fetchEmployees();
                setFieldOptions(fieldsData.map(field => ({ value: field.id, label: field.name })));
                setDepartmentOptions(departmentsData.map(dept => ({ value: dept.id, label: dept.name })));
                setEmployeeOptions(employeesData.map(emp => ({ value: emp.id, label: emp.name })));
                setFormData({
                    name: assignmentData.name || '',
                    field: fieldsData.find(field => field.id === assignmentData.field)
                        ? { value: assignmentData.field, label: assignmentData.field_name }
                        : null,
                    department: departmentsData.find(dept => dept.id === assignmentData.department)
                        ? { value: assignmentData.department, label: assignmentData.department_name }
                        : null,
                    supervisor: employeesData.find(emp => emp.id === assignmentData.supervisor)
                        ? { value: assignmentData.supervisor, label: assignmentData.supervisor_name }
                        : null,
                    notes: assignmentData.notes || ''
                });
            } catch (error) {
                toast.error('Failed to load assignment details');
            } finally {
                setDataLoading(false);
            }
        };
        loadData();
    }, [id]);

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
            notes: formData.notes
        };
        try {
            setLoading(true);
            await updateAssignment(id, payload);
            toast.success('Assignment updated successfully!');
            navigate('/assignments');
        } catch (error) {
            toast.error('Failed to update assignment. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    if (dataLoading) return <div>Loading assignment details...</div>;

    return (
        <>
            <div className="intro-y col-span-12 mt-8 flex flex-wrap items-center xl:flex-nowrap">
                <h2 className="mr-auto text-lg font-medium">Edit Assignment</h2>
                <a
                    href="/assignments"
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
                            <div className="rounded-md border p-5">
                                <div className="flex items-center border-b pb-5 text-base font-medium">
                                    Edit Assignment
                                </div>
                                <div className="mt-5 space-y-4">
                                    <div>
                                        <label className="block mb-2 font-medium">Assignment Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Enter assignment name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full text-sm border rounded-md p-2 focus:ring-4 focus:ring-primary"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block mb-2 font-medium">Field</label>
                                            <Select
                                                name="field"
                                                options={fieldOptions}
                                                value={formData.field}
                                                onChange={(option) => handleSelectChange('field', option)}
                                                placeholder="Select Field"
                                                isClearable
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-medium">Department</label>
                                            <Select
                                                name="department"
                                                options={departmentOptions}
                                                value={formData.department}
                                                onChange={(option) => handleSelectChange('department', option)}
                                                placeholder="Select Department"
                                                isClearable
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-medium">Supervisor</label>
                                            <Select
                                                name="supervisor"
                                                options={employeeOptions}
                                                value={formData.supervisor}
                                                onChange={(option) => handleSelectChange('supervisor', option)}
                                                placeholder="Select Supervisor"
                                                isClearable
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-medium">Notes</label>
                                        <textarea
                                            name="notes"
                                            placeholder="Enter any notes"
                                            value={formData.notes}
                                            onChange={handleChange}
                                            className="w-full text-sm border rounded-md p-2 focus:ring-4 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 flex flex-col md:flex-row justify-end gap-2">
                                <a
                                    href="/assignments"
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
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.4rem" height="1.4rem" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="4" strokeDasharray="31.415, 31.415">
                                                    <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
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
            </form>
        </>
    );
};

export default EditAssignment;
