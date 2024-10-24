import React, { useState, useEffect } from 'react'
import { Eye, Save } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { fetchFieldById, updateField } from '../../api'

const EditField = () => {
    const { id } = useParams();
    const [fieldData, setFieldData] = useState({
        name: '',
        address: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadFieldDetails = async () => {
            try {
                const data = await fetchFieldById(id);
                setFieldData(data);
            } catch (error) {
                toast.error('Failed to load field details.');
                navigate('/fields');
            }
        };

        loadFieldDetails();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFieldData({ ...fieldData, [name]: value });
    };

    const handleUpdateField = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateField(id, fieldData);
            toast.success('Field updated successfully.');
            navigate('/fields');
        } catch (error) {
            toast.error(error.message || 'An error occurred while updating the field.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>EditField</div>
    )
}

export default EditField