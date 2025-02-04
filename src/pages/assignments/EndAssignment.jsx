import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FinishAssignment } from '../../api';
import { ToggleLeft } from 'lucide-react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const EndAssignment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!endDate) {
            toast.error('Please select an end date');
            return;
        }
        if (!reason) {
            toast.error('Please provide a reason');
            return;
        }
        try {
            setLoading(true);
            await FinishAssignment(id, { end_date: endDate, reason });
            toast.success('Assignment ended successfully');
            navigate('/assignments');
        } catch (error) {
            toast.error('Failed to end assignment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="bg-white rounded-md shadow-md p-6 max-w-xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4">End Assignment</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="input"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Reason</label>
                        <CKEditor
                            editor={ClassicEditor}
                            data={reason}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setReason(data);
                            }}
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/assignments')}
                            className="btn btn-secondary flex items-center"
                        >
                            <ToggleLeft className="mr-1 h-4 w-4" /> Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary flex items-center"
                        >
                            {loading ? 'Ending...' : 'End Assignment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EndAssignment;
