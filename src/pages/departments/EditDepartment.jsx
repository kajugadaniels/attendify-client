import React, { useState, useEffect } from 'react'
import { Eye, Save } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { fetchDepartmentById } from '../../api'

const EditDepartment = () => {
    const { id } = useParams();
    const [departmentData, setDepartmentData] = useState({
        name: '',
        address: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadDepartmentDetails = async () => {
            try {
                const data = await fetchDepartmentById(id);
                setDepartmentData(data);
            } catch (error) {
                toast.error('Failed to load department details.');
                navigate('/departments');
            }
        };

        loadDepartmentDetails();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDepartmentData({ ...departmentData, [name]: value });
    };

    const handleUpdateDepartment = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateDepartment(id, departmentData);
            toast.success('Department updated successfully.');
            navigate('/departments');
        } catch (error) {
            toast.error(error.message || 'An error occurred while updating the department.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>EditDepartment</div>
    )
}

export default EditDepartment