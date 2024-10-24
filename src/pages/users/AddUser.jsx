import React, { useState, useEffect } from 'react'
import { Eye, Save } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { addUser } from '../../api'

const AddUser = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        confirmPassword: '',
        role: '',
        status: 'Active',
        is_active: true,
        is_staff: false,
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData({
            ...userData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (userData.password !== userData.confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            const payload = { ...userData };
            delete payload.confirmPassword; // Remove confirmPassword before sending to backend
            await addUser(payload);
            toast.success('User registered successfully.');
            navigate('/users');
        } catch (error) {
            console.error('Error adding user:', error);

            if (error.response && error.response.data) {
                // Extract and display error messages from the backend
                const errorData = error.response.data;
                const errorMessages = Object.values(errorData)
                    .flat()
                    .join(' ');
                toast.error(errorMessages || 'An error occurred while adding the user.');
            } else {
                toast.error(
                    error.message || 'An error occurred while adding the user.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>AddUser</div>
    )
}

export default AddUser