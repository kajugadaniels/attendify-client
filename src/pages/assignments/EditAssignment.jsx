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
        employees: [],
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
                    employees: assignmentData.employees
                        ? assignmentData.employees.map(empId => {
                            const emp = employeesData.find(e => e.id === empId);
                            return emp ? { value: emp.id, label: emp.name } : null;
                        }).filter(Boolean)
                        : [],
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
            employees: formData.employees ? formData.employees.map(option => option.value) : [],
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
        <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Edit Assignment</h2>
                <a
                    href="/assignments"
                    className="btn btn-primary flex items-center"
                >
                    <Eye className="mr-1 h-4 w-4" /> Go Back
                </a>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-md shadow-md p-6 max-w-3xl mx-auto">
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Assignment Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter assignment name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
                        <div>
                            <label className="block mb-2 font-medium">Employees</label>
                            <Select
                                name="employees"
                                options={employeeOptions}
                                value={formData.employees}
                                onChange={(option) => handleSelectChange('employees', option)}
                                placeholder="Select Employees"
                                isMulti
                                isClearable
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Notes</label>
                        <textarea
                            name="notes"
                            placeholder="Enter any notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="input h-24"
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <a href="/assignments" className="btn btn-secondary">
                            <ToggleLeft className="mr-1 h-4 w-4" /> Cancel
                        </a>
                        <button type="submit" disabled={loading} className="btn btn-primary">
                            {loading ? (
                                <div className="flex items-center">
                                    <span className="mr-2">Saving</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="31.415, 31.415" />
                                    </svg>
                                </div>
                            ) : 'Save'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditAssignment;
