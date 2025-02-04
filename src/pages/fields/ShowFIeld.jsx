import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchFieldDetails, deleteField } from '../../api';
import { toast } from 'react-toastify';
import { Eye, Edit, Trash2 } from 'lucide-react';

const ShowField = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [field, setField] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load field details
    useEffect(() => {
        const loadField = async () => {
            try {
                const data = await fetchFieldDetails(id);
                setField(data);
            } catch (error) {
                toast.error('Failed to load field details.');
            } finally {
                setLoading(false);
            }
        };
        loadField();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this field?')) {
            try {
                await deleteField(id);
                toast.success('Field deleted successfully!');
                navigate('/fields');
            } catch (error) {
                toast.error('Failed to delete field.');
            }
        }
    };

    if (loading) return <div>Loading field details...</div>;
    if (!field) return <div>No field found.</div>;

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Field Details</h2>
            <div className="space-y-2">
                <p>
                    <strong>Name:</strong> {field.name || 'N/A'}
                </p>
                <p>
                    <strong>Address:</strong> {field.address || 'N/A'}
                </p>
            </div>
            <div className="mt-6 flex space-x-4">
                <button
                    onClick={() => navigate(`/field/${id}/edit`)}
                    className="flex items-center px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 transition"
                >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </button>
                <button
                    onClick={handleDelete}
                    className="flex items-center px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </button>
                <button
                    onClick={() => navigate('/fields')}
                    className="flex items-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                >
                    <Eye className="mr-2 h-4 w-4" />
                    Back to Fields
                </button>
            </div>
        </div>
    );
};

export default ShowField;
