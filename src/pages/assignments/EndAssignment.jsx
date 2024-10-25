import React, { useState, useEffect } from 'react'
import { Eye, Save } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { endAssignmentById, fetchAssignmentById } from '../../api'

const EndAssignment = () => {
    const { id } = useParams();
    const [assignmentData, setAssignmentData] = useState({
        name: '',
        address: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadAssignmentDetails = async () => {
            try {
                const data = await fetchAssignmentById(id);
                setAssignmentData(data);
            } catch (error) {
                toast.error('Failed to load assignment details.');
                navigate('/assignments');
            }
        };

        loadAssignmentDetails();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAssignmentData({ ...assignmentData, [name]: value });
    };

    const handleEndAssignment = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await endAssignmentById(id, assignmentData);
            toast.success('Assignment updated successfully.');
            navigate('/assignments');
        } catch (error) {
            toast.error(error.message || 'An error occurred while updating the assignment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>EndAssignment</div>
    )
}

export default EndAssignment