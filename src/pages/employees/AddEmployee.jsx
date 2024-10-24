import React, { useState, useEffect } from 'react'
import { Eye, Save } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { addEmployee } from '../../api'

const AddEmployee = () => {
    const [employeeData, setEmployeeData] = useState({
        name: '',
        email: '',
        phone_number: '',
        address: '',
        tag_id: '',
        nid: '',
        rssb_number: '',
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEmployeeData({
            ...employeeData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        if (employeeData.password !== employeeData.confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            const payload = { ...employeeData };
            delete payload.confirmPassword; // Remove confirmPassword before sending to backend
            await addEmployee(payload);
            toast.success('Employee registered successfully.');
            navigate('/employees');
        } catch (error) {
            console.error('Error adding employee:', error);

            if (error.response && error.response.data) {
                // Extract and display error messages from the backend
                const errorData = error.response.data;
                const errorMessages = Object.values(errorData)
                    .flat()
                    .join(' ');
                toast.error(errorMessages || 'An error occurred while adding the employee.');
            } else {
                toast.error(
                    error.message || 'An error occurred while adding the employee.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>AddEmployee</div>
    )
}

export default AddEmployee