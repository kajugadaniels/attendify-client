import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FinishAssignment } from '../../api';
import { ToggleLeft } from 'lucide-react';

const EndAssignment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!endDate) {
            toast.error('Please select an end date');
            return;
        }
        try {
            setLoading(true);
            await FinishAssignment(id, { end_date: endDate });
            toast.success('Assignment ended successfully');
            navigate('/assignments');
        } catch (error) {
            toast.error('Failed to end assignment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4">End Assignment</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2 font-medium">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full border rounded-md p-2 focus:ring-4 focus:ring-primary"
                        required
                    />
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/assignments')}
                        className="flex items-center px-4 py-2 bg-white border rounded-md text-slate-500 hover:bg-gray-100 transition"
                    >
                        Cancel
                        <span className="ml-2">
                            <ToggleLeft className="h-4 w-4" />
                        </span>
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition disabled:opacity-70"
                    >
                        {loading ? 'Ending...' : 'End Assignment'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EndAssignment;
