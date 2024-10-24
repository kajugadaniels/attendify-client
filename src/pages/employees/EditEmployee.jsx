import React, { useState, useEffect } from 'react'
import { Eye, Save } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { fetchEmployeeById, updateEmployee } from '../../api'

const EditEmployee = () => {
    const { id } = useParams();
    const [employeeData, setEmployeeData] = useState({
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
    const [healthFacilities, setHealthFacilities] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadEmployeeDetails = async () => {
            try {
                const data = await fetchEmployeeById(id);
                setEmployeeData(data);
            } catch (error) {
                toast.error('Failed to load employee details.');
                navigate('/employees');
            }
        };

        loadEmployeeDetails();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData({ ...employeeData, [name]: value });
    };

    const handleUpdateEmployee = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateEmployee(id, employeeData);
            toast.success('Employee updated successfully.');
            navigate('/employees');
        } catch (error) {
            toast.error(error.message || 'An error occurred while updating the employee.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>EditEmployee</div>
    )
}

export default EditEmployee