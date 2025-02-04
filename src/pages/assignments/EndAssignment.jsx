import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FinishAssignment } from '../../api';
import { ToggleLeft } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';

const EndAssignment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEditorChange = (content) => {
        setReason(content);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!endDate) {
            toast.error('Please select an end date');
            return;
        }
        if (!reason || reason.trim() === '') {
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
                            className="input w-full p-2 border rounded-md focus:ring-4 focus:ring-primary"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium">Reason</label>
                        <Editor
                            apiKey="i3abcww47drqq6h3s63beg0b86o1lfgudfzyqdfn67ufelpd"
                            value={reason}
                            onEditorChange={handleEditorChange}
                            init={{
                                height: 200,
                                menubar: false,
                                plugins: [
                                    'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                                    'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
                                ],
                                toolbar:
                                    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                tinycomments_mode: 'embedded',
                                tinycomments_author: 'Author name',
                                mergetags_list: [
                                    { value: 'First.Name', title: 'First Name' },
                                    { value: 'Email', title: 'Email' },
                                ],
                                ai_request: (request, respondWith) =>
                                    respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                            }}
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/assignments')}
                            className="btn btn-secondary flex items-center px-4 py-2 border rounded-md bg-white text-slate-500 hover:bg-gray-100 transition"
                        >
                            <ToggleLeft className="mr-1 h-4 w-4" /> Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary flex items-center px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-dark transition disabled:opacity-70"
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
