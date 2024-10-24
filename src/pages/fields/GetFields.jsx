import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, EllipsisVertical, KeySquare, ListChecks, PenLine, Search, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchFields } from '../../api'
import { toast } from 'react-toastify'

const GetFields = () => {
    const [fields, setFields] = useState([]);
    const [filteredFields, setFilteredFields] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [fieldsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadFields = async () => {
            setLoading(true);
            try {
                const data = await fetchFields();
                setFields(data);
                setFilteredFields(data);
            } catch (error) {
                toast.error('Failed to load fields.');
            } finally {
                setLoading(false);
            }
        };
        loadFields();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term) {
            const filtered = fields.filter((field) =>
                field.name.toLowerCase().includes(term.toLowerCase()) ||
                field.adrress?.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredFields(filtered);
            setCurrentPage(1); // Reset to the first page when searching
        } else {
            setFilteredFields(fields);
        }
    };

    const toggleDropdown = (fieldId) => {
        setDropdownOpen(dropdownOpen === fieldId ? null : fieldId);
    };

    const handleEdit = (fieldId) => {
        navigate(`/field/edit/${fieldId}`);
    };

    const handleDelete = async (fieldId) => {
        if (window.confirm('Are you sure you want to delete this field?')) {
            try {
                await deleteField(fieldId);
                setFields(fields.filter((field) => field.id !== fieldId));
                setFilteredFields(filteredFields.filter((field) => field.id !== fieldId));
                toast.success('field deleted successfully.');
            } catch (error) {
                toast.error('Failed to delete field.');
            }
        }
    };

    // Pagination logic
    const indexOfLastField = currentPage * fieldsPerPage;
    const indexOfFirstField = indexOfLastField - fieldsPerPage;
    const currentFields = filteredFields.slice(indexOfFirstField, indexOfLastField);

    const totalPages = Math.ceil(filteredFields.length / fieldsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>GetFields</div>
    )
}

export default GetFields