import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, EllipsisVertical, KeySquare, ListChecks, PenLine, Search, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchEmployees } from '../../api'
import { toast } from 'react-toastify'

const GetEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadEmployees = async () => {
            setLoading(true);
            try {
                const data = await fetchEmployees();
                setEmployees(data);
                setFilteredEmployees(data);
            } catch (error) {
                toast.error('Failed to load employees.');
            } finally {
                setLoading(false);
            }
        };
        loadEmployees();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term) {
            const filtered = employees.filter((employee) =>
                employee.name.toLowerCase().includes(term.toLowerCase()) ||
                employee.email?.toLowerCase().includes(term.toLowerCase()) ||
                employee.address?.toLowerCase().includes(term.toLowerCase()) ||
                employee.tag_id?.toLowerCase().includes(term.toLowerCase()) ||
                employee.nid?.toLowerCase().includes(term.toLowerCase()) ||
                employee.rssb_number?.toLowerCase().includes(term.toLowerCase()) ||
                employee.phone_number?.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredEmployees(filtered);
            setCurrentPage(1); // Reset to the first page when searching
        } else {
            setFilteredEmployees(employees);
        }
    };

    const toggleDropdown = (employeeId) => {
        setDropdownOpen(dropdownOpen === employeeId ? null : employeeId);
    };

    const handleEdit = (employeeId) => {
        navigate(`/employee/edit/${employeeId}`);
    };

    const handleDelete = async (employeeId) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await deleteEmployee(employeeId);
                setEmployees(employees.filter((employee) => employee.id !== employeeId));
                setFilteredEmployees(filteredEmployees.filter((employee) => employee.id !== employeeId));
                toast.success('Employee deleted successfully.');
            } catch (error) {
                toast.error('Failed to delete employee.');
            }
        }
    };

    // Pagination logic
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>GetEmployees</div>
    )
}

export default GetEmployees