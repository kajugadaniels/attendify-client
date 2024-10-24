import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, EllipsisVertical, KeySquare, ListChecks, PenLine, Search, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchAssignments } from '../../api'
import { toast } from 'react-toastify'

const GetAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [filteredAssignments, setFilteredAssignments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [assignmentsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadAssignments = async () => {
            setLoading(true);
            try {
                const data = await fetchAssignments();
                setAssignments(data);
                setFilteredAssignments(data);
            } catch (error) {
                toast.error('Failed to load assignments.');
            } finally {
                setLoading(false);
            }
        };
        loadAssignments();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term) {
            const filtered = assignments.filter((assignment) =>
                assignment.name.toLowerCase().includes(term.toLowerCase()) ||
                assignment.field_name.toLowerCase().includes(term.toLowerCase()) ||
                assignment.department_name?.toLowerCase().includes(term.toLowerCase()) ||
                assignment.employee_assignments.employee_name?.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredAssignments(filtered);
            setCurrentPage(1); // Reset to the first page when searching
        } else {
            setFilteredAssignments(assignments);
        }
    };

    const toggleDropdown = (assignmentId) => {
        setDropdownOpen(dropdownOpen === assignmentId ? null : assignmentId);
    };

    const handleEdit = (assignmentId) => {
        navigate(`/assignment/edit/${assignmentId}`);
    };

    const handleDelete = async (assignmentId) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                await deleteAssignment(assignmentId);
                setAssignments(assignments.filter((assignment) => assignment.id !== assignmentId));
                setFilteredAssignments(filteredAssignments.filter((assignment) => assignment.id !== assignmentId));
                toast.success('assignment deleted successfully.');
            } catch (error) {
                toast.error('Failed to delete assignment.');
            }
        }
    };

    // Pagination logic
    const indexOfLastAssignment = currentPage * assignmentsPerPage;
    const indexOfFirstAssignment = indexOfLastAssignment - assignmentsPerPage;
    const currentAssignments = filteredAssignments.slice(indexOfFirstAssignment, indexOfLastAssignment);

    const totalPages = Math.ceil(filteredAssignments.length / assignmentsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>GetAssignments</div>
    )
}

export default GetAssignments