import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, EllipsisVertical, KeySquare, ListChecks, PenLine, Search, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchDepartments } from '../../api'
import { toast } from 'react-toastify'

const GetDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [departmentsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadDepartments = async () => {
            setLoading(true);
            try {
                const data = await fetchDepartments();
                setDepartments(data);
                setFilteredDepartments(data);
            } catch (error) {
                toast.error('Failed to load departments.');
            } finally {
                setLoading(false);
            }
        };
        loadDepartments();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term) {
            const filtered = departments.filter((department) =>
                department.name.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredDepartments(filtered);
            setCurrentPage(1); // Reset to the first page when searching
        } else {
            setFilteredDepartments(departments);
        }
    };

    const toggleDropdown = (departmentId) => {
        setDropdownOpen(dropdownOpen === departmentId ? null : departmentId);
    };

    const handleEdit = (departmentId) => {
        navigate(`/department/edit/${departmentId}`);
    };

    const handleDelete = async (departmentId) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                await deleteDepartment(departmentId);
                setDepartments(departments.filter((department) => department.id !== departmentId));
                setFilteredDepartments(filteredDepartments.filter((department) => department.id !== departmentId));
                toast.success('Department deleted successfully.');
            } catch (error) {
                toast.error('Failed to delete department.');
            }
        }
    };

    // Pagination logic
    const indexOfLastDepartment = currentPage * departmentsPerPage;
    const indexOfFirstDepartment = indexOfLastDepartment - departmentsPerPage;
    const currentDepartments = filteredDepartments.slice(indexOfFirstDepartment, indexOfLastDepartment);

    const totalPages = Math.ceil(filteredDepartments.length / departmentsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>GetDepartments</div>
    )
}

export default GetDepartments