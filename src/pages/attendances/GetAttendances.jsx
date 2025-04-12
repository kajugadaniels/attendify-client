import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
    Eye,
    Search,
    Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, isSameDay } from 'date-fns';
import { fetchAssignments, fetchAttendances, markAttendance } from '../../api';

const GetAttendances = () => {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Filters & search states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedField, setSelectedField] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [sortOrder, setSortOrder] = useState({ value: 'newest', label: 'Newest' });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // 7-day window: dayOffsets = [-2, -1, 0, 1, 2, 3, 4]
    const dayOffsets = [-2, -1, 0, 1, 2, 3, 4];
    const daysArray = dayOffsets.map(offset => {
        const d = new Date();
        d.setDate(d.getDate() + offset);
        return d;
    });

    // Fetch assignments and attendance records on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const assignmentsData = await fetchAssignments(); // Expected structure: { results: [...] }
                setAssignments(assignmentsData.results || []);
                const attendanceData = await fetchAttendances(); // Expected to return an array
                setAttendances(attendanceData);
            } catch (err) {
                setError('Failed to fetch attendance.');
                toast.error(
                    err.response?.data?.message?.detail ||
                    err.response?.data?.detail ||
                    'Error fetching attendance records.'
                );
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Build filter options from assignments for Field and Department
    const fieldOptions = Array.from(new Set(assignments.map(a => a.field))).map(f => {
        const assignment = assignments.find(a => a.field === f);
        return { value: f, label: assignment ? assignment.field_name : f };
    });
    const departmentOptions = Array.from(new Set(assignments.map(a => a.department))).map(d => {
        const assignment = assignments.find(a => a.department === d);
        return { value: d, label: assignment ? assignment.department_name : d };
    });

    // Extract unique employees from assignments (applying field/department filters)
    const uniqueEmployees = [];
    const employeeMap = {};
    assignments.forEach(a => {
        if (selectedField && a.field !== selectedField.value) return;
        if (selectedDepartment && a.department !== selectedDepartment.value) return;
        a.employee_assignments.forEach(ea => {
            if (!employeeMap[ea.employee]) {
                employeeMap[ea.employee] = {
                    id: ea.employee,
                    name: ea.employee_name,
                    tag_id: ea.employee_tag_id
                };
            }
        });
    });
    for (let key in employeeMap) {
        uniqueEmployees.push(employeeMap[key]);
    }
    if (sortOrder.value === 'newest') {
        uniqueEmployees.sort((a, b) => b.id - a.id);
    } else {
        uniqueEmployees.sort((a, b) => a.id - b.id);
    }

    // For each employee, compute total day_salary for today's attendance and generate a 7-day status array
    const employeeAttendanceData = uniqueEmployees.map(emp => {
        const empAttendances = attendances.filter(r => r.employee_tag_id === emp.tag_id);
        const totalDaySalary = empAttendances
            .filter(r => isSameDay(new Date(r.date), new Date()))
            .reduce((sum, r) => sum + Number(r.day_salary || 0), 0);
        const attendanceStatus = daysArray.map(day => {
            const record = empAttendances.find(r => isSameDay(new Date(r.date), day));
            if (record) return "Present";
            else {
                if (day > new Date()) return "Future";
                else return "Absent";
            }
        });
        return { ...emp, totalDaySalary, attendanceStatus };
    });

    // Filter employees based on search (name or tag_id)
    const filteredEmployees = employeeAttendanceData.filter(emp => {
        return (
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.tag_id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Pagination for filtered employees
    const totalRecords = filteredEmployees.length;
    const totalPages = Math.ceil(totalRecords / pageSize);
    const paginatedData = filteredEmployees.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleShowEmployee = (employeeId) => {
        navigate(`/student/${employeeId}`);
    };

    // Handler for marking attendance for an employee using his tag_id
    const handleMarkAttendance = async (emp) => {
        try {
            const response = await markAttendance([emp.tag_id]);
            // Check if backend returned errors
            if (response.errors && Object.keys(response.errors).length > 0) {
                const errorMsg = response.errors[emp.tag_id] || "Attendance error.";
                toast.error(errorMsg);
            } else {
                toast.success(response.message);
                // Optionally, refresh attendances after marking
                const attendanceData = await fetchAttendances();
                setAttendances(attendanceData);
            }
        } catch (error) {
            console.error('Error marking attendance:', error);
            toast.error('Failed to mark attendance.');
        }
    };

    const formatDate = (dateObj) => dateObj.toISOString().split('T')[0];

    if (loading)
        return <div className="text-center py-10">Loading attendance data...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
    if (filteredEmployees.length === 0)
        return (
            <div className="text-center py-10">
                <h3 className="text-lg font-medium">No Attendance Found</h3>
                <p className="mt-2 text-slate-500">
                    Looks like no employees match your criteria.
                </p>
            </div>
        );

    return (
        <>
            {/* Header */}
            <div className="intro-y col-span-12 mt-8 flex flex-wrap items-center xl:flex-nowrap">
                <h2 className="mr-auto text-lg font-medium">
                    Employee Attendance (7-Day Window)
                </h2>
            </div>

            <div className="mt-5 grid grid-cols-12 gap-6">
                {/* SEARCH & FILTERS */}
                <div className="intro-y col-span-12 mt-2 flex flex-wrap items-center gap-2 xl:flex-nowrap">
                    {/* Search by name or tag */}
                    <div className="relative w-56 text-slate-500">
                        <input
                            type="text"
                            placeholder="Search name or tag..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-800/50 transition duration-200 ease-in-out text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 dark:bg-800 dark:border-transparent dark:focus:ring-slate-700 !box w-56 pr-10"
                        />
                        <Search className="stroke-1.5 absolute inset-y-0 right-0 my-auto mr-3 h-4 w-4" />
                    </div>
                    {/* Field Filter */}
                    <div className="w-44">
                        <Select
                            options={fieldOptions}
                            value={selectedField}
                            onChange={value => {
                                setSelectedField(value);
                                setCurrentPage(1);
                            }}
                            placeholder="Filter by Field"
                            isClearable
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>
                    {/* Department Filter */}
                    <div className="w-44">
                        <Select
                            options={departmentOptions}
                            value={selectedDepartment}
                            onChange={value => {
                                setSelectedDepartment(value);
                                setCurrentPage(1);
                            }}
                            placeholder="Filter by Dept."
                            isClearable
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>
                    {/* Sort Order */}
                    <div className="w-44">
                        <Select
                            options={[
                                { value: 'newest', label: 'Newest' },
                                { value: 'oldest', label: 'Oldest' }
                            ]}
                            value={sortOrder}
                            onChange={value => {
                                setSortOrder(value);
                                setCurrentPage(1);
                            }}
                            placeholder="Sort Order"
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="intro-y col-span-12 overflow-auto 2xl:overflow-visible">
                    <table className="w-full text-left -mt-2 border-separate border-spacing-y-[10px]">
                        <thead>
                            <tr>
                                <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0">
                                    Select
                                </th>
                                <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0">
                                    Name
                                </th>
                                {daysArray.map((d, idx) => (
                                    <th
                                        key={idx}
                                        className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0 text-center"
                                    >
                                        {formatDate(d)}
                                    </th>
                                ))}
                                <th className="font-medium px-5 py-3 dark:border-300 whitespace-nowrap border-b-0 text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((emp, idx) => (
                                <tr key={idx} className="intro-x">
                                    <td className="px-5 py-3 border-b dark:border-300 box w-10 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            className="transition-all duration-200 ease-in-out shadow-sm border-slate-200 cursor-pointer rounded"
                                        />
                                    </td>
                                    <td className="px-5 py-3 border-b dark:border-300 box whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="image-fit zoom-in h-9 w-9">
                                                <img
                                                    src="https://cdn-icons-png.flaticon.com/512/10337/10337609.png"
                                                    alt="employee avatar"
                                                    className="tooltip cursor-pointer rounded-lg shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <span className="whitespace-nowrap font-medium">
                                                    {emp.name}
                                                </span>
                                                <div className="mt-0.5 whitespace-nowrap text-xs text-slate-500">
                                                    TAG ID: {emp.tag_id}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    {emp.attendanceStatus.map((status, dayIdx) => {
                                        let bgColor = 'bg-slate-400';
                                        if (status === 'Present') bgColor = 'bg-success';
                                        else if (status === 'Absent') bgColor = 'bg-danger';
                                        else if (status === 'Future') bgColor = 'bg-warning';
                                        return (
                                            <td key={dayIdx} className="px-5 py-3 border-b dark:border-300 box text-center">
                                                <span className={`px-3 py-1 inline-block rounded-full text-xs text-white ${bgColor}`}>
                                                    {status}
                                                </span>
                                            </td>
                                        );
                                    })}
                                    <td className="px-5 py-3 border-b dark:border-300 box text-center">
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={() => handleShowEmployee(emp.id)}
                                                className="mr-3 flex items-center text-blue-600"
                                            >
                                                <Eye className="stroke-1.5 mr-1 h-4 w-4" /> View
                                            </button>
                                            <button
                                                onClick={() => handleMarkAttendance(emp)}
                                                className="mr-3 flex items-center text-success"
                                            >
                                                <Calendar className="stroke-1.5 mr-1 h-4 w-4" /> Mark Attendance
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredEmployees.length > 0 && (
                    <div className="intro-y col-span-12 flex flex-wrap items-center sm:flex-row sm:flex-nowrap mt-4">
                        <nav className="w-full sm:mr-auto sm:w-auto">
                            <ul className="flex gap-2">
                                <li>
                                    <button
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage === 1}
                                        className="transition duration-200 border items-center justify-center py-2 px-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary text-slate-800 dark:text-slate-300 border-transparent disabled:opacity-50"
                                    >
                                        First
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="transition duration-200 border items-center justify-center py-2 px-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary text-slate-800 dark:text-slate-300 border-transparent disabled:opacity-50"
                                    >
                                        <ChevronLeft className="stroke-1.5 h-4 w-4" />
                                    </button>
                                </li>
                                <li>
                                    <span className="px-3 py-2 text-slate-700 dark:text-slate-300">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="transition duration-200 border items-center justify-center py-2 px-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary text-slate-800 dark:text-slate-300 border-transparent disabled:opacity-50"
                                    >
                                        <ChevronRight className="stroke-1.5 h-4 w-4" />
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="transition duration-200 border items-center justify-center py-2 px-2 rounded-md cursor-pointer focus:ring-4 focus:ring-primary text-slate-800 dark:text-slate-300 border-transparent disabled:opacity-50"
                                    >
                                        <ChevronsRight className="stroke-1.5 h-4 w-4" />
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </>
    );
};

export default GetAttendances;
