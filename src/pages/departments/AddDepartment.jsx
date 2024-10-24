import React, { useState, useEffect } from 'react'
import { Eye, Save } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { addDepartment } from '../../api'

const AddDepartment = () => {
    const [departmentData, setDepartmentData] = useState({
        name: '',
        address: '',
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDepartmentData({
            ...departmentData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleAddDepartment = async (e) => {
        e.preventDefault();
        if (departmentData.password !== departmentData.confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            const payload = { ...departmentData };
            await addDepartment(payload);
            toast.success('Department registered successfully.');
            navigate('/departments');
        } catch (error) {
            console.error('Error adding department:', error);

            if (error.response && error.response.data) {
                // Extract and display error messages from the backend
                const errorData = error.response.data;
                const errorMessages = Object.values(errorData)
                    .flat()
                    .join(' ');
                toast.error(errorMessages || 'An error occurred while adding the department.');
            } else {
                toast.error(
                    error.message || 'An error occurred while adding the department.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>AddDepartment</div>
    )
}

export default AddDepartment