import React, { useState, useEffect } from 'react'
import { Eye, Save } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { addField } from '../../api'

const AddField = () => {
    const [fieldData, setFieldData] = useState({
        name: '',
        address: '',
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFieldData({
            ...fieldData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleAddField = async (e) => {
        e.preventDefault();
        if (fieldData.password !== fieldData.confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            const payload = { ...fieldData };
            delete payload.confirmPassword; // Remove confirmPassword before sending to backend
            await addField(payload);
            toast.success('Field registered successfully.');
            navigate('/fields');
        } catch (error) {
            console.error('Error adding field:', error);

            if (error.response && error.response.data) {
                // Extract and display error messages from the backend
                const errorData = error.response.data;
                const errorMessages = Object.values(errorData)
                    .flat()
                    .join(' ');
                toast.error(errorMessages || 'An error occurred while adding the field.');
            } else {
                toast.error(
                    error.message || 'An error occurred while adding the field.'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>AddField</div>
    )
}

export default AddField