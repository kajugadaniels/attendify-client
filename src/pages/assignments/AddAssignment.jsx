import React, { useState, useEffect } from 'react'
import { Eye, Save } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { addAssignment, fetchEmployees } from '../../api'

const AddAssignment = () => {
    const [assignmentName, setAssignmentName] = useState('');
    const [employees, setEmployees] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const data = await fetchEmployees();
                setAllEmployees(data);
            } catch (error) {
                console.error('Error fetching employees:', error);
                toast.error(error.message || 'Failed to load employees.');
            }
        };
        loadEmployees();
    }, []);

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: assignmentName,
                employee_ids: employees.map((empl) => empl.id),
            };
            await addAssignment(payload);
            toast.success('Assignment added successfully.');
            navigate('/assignments');
        } catch (error) {
            toast.error(error.message || 'An error occurred while adding the role.');
        }
    };

    const handleEmployeeSelect = (employee) => {
        if (!employees.some((empl) => empl.id === employee.id)) {
            setEmployees([...employees, employee]);
        }
    };

    const handleEmployeeRemove = (id) => {
        setEmployees(employees.filter((perm) => perm.id !== id));
    };

    const filteredEmployees = allEmployees.filter((empl) =>
        empl.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>AddAssignment</div>
    )
}

export default AddAssignment