import axios from 'axios';

const API_BASE_URL =
    window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost'
        ? 'http://127.0.0.1:8000/api'
        : 'https://eps-api.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login/', { email, password });
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        let message = 'An error occurred during login. Please try again.';
        if (error.response) {
            message = error.response.data.error || error.response.data.detail || message;
        }
        return {
            success: false,
            message,
        };
    }
};

export const logout = async (token) => {
    try {
        const response = await api.post(
            '/auth/logout/',
            {},
            {
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );
        return {
            success: true,
            message: response.data.message,
        };
    } catch (error) {
        let message = 'An error occurred during logout. Please try again.';
        if (error.response) {
            message = error.response.data.error || error.response.data.detail || message;
        }
        return {
            success: false,
            message,
        };
    }
};

export const updateUser = async (data) => {
    console.log('Incoming data:', data);

    const sanitizedData = {
        email: data.email,
        name: data.name,
        password: data.password,
        phone_number: data.phone_number,
        role: data.role,
        status: data.status,
    };

    console.log('Sanitized data to be sent:', sanitizedData);
    try {
        const response = await api.put('/auth/profile-update/', sanitizedData, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.log('Error response from server:', error.response);
        throw error.response ? error.response.data : new Error('Failed to update account.');
    }
};

export const fetchUsers = async () => {
    try {
        const response = await api.get('/users/', {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response 
            ? error.response.data 
            : new Error('An error occurred while fetching users.');
    }
};

export const addUser = async (data) => {
    try {
        const response = await api.post('/auth/register/', data, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response
            ? error.response.data
            : new Error('An error occurred while adding the user.');
    }
};

export const fetchEmployees = async () => {
    try {
        const response = await api.get('/employees/', {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response 
            ? error.response.data 
            : new Error('An error occurred while fetching employees.');
    }
};

export const addEmployee = async (data) => {
    try {
        const response = await api.post('/employees/', data, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response
            ? error.response.data
            : new Error('An error occurred while adding the employee.');
    }
};

export const fetchEmployeeById = async (id) => {
    try {
        const response = await api.get(`/employee/${id}/`, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response
            ? error.response.data
            : new Error('An error occurred while fetching the employee.');
    }
};

export const updateEmployee = async (id, data) => {
    try {
        const response = await api.put(`/employee/${id}/`, data, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response
            ? error.response.data
            : new Error('An error occurred while updating the employee.');
    }
};

export const deleteEmployee = async (id) => {
    try {
        const response = await api.delete(`/employee/${id}/`, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response 
        ? error.response.data 
        : new Error('An error occurred while deleting the employee.');
    }
};

export const fetchFields = async () => {
    try {
        const response = await api.get('/fields/', {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response 
            ? error.response.data 
            : new Error('An error occurred while fetching fields.');
    }
};

export const addField = async (data) => {
    try {
        const response = await api.post('/fields/', data, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response
            ? error.response.data
            : new Error('An error occurred while adding the field.');
    }
};

export const fetchFieldById = async (id) => {
    try {
        const response = await api.get(`/field/${id}/`, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response
            ? error.response.data
            : new Error('An error occurred while fetching the field.');
    }
};

export const updateField = async (id, data) => {
    try {
        const response = await api.put(`/field/${id}/`, data, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response
            ? error.response.data
            : new Error('An error occurred while updating the field.');
    }
};

export const deleteField = async (id) => {
    try {
        const response = await api.delete(`/field/${id}/`, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response 
        ? error.response.data 
        : new Error('An error occurred while deleting the field.');
    }
};

export const fetchDepartments = async () => {
    try {
        const response = await api.get('/departments/', {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response 
            ? error.response.data 
            : new Error('An error occurred while fetching departments.');
    }
};

export const addDepartment = async (data) => {
    try {
        const response = await api.post('/departments/', data, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response
            ? error.response.data
            : new Error('An error occurred while adding the department.');
    }
};

export const fetchDepartmentById = async (id) => {
    try {
        const response = await api.get(`/department/${id}/`, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response
            ? error.response.data
            : new Error('An error occurred while fetching the department.');
    }
};

export const updateDepartment = async (id, data) => {
    try {
        const response = await api.put(`/department/${id}/`, data, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response
            ? error.response.data
            : new Error('An error occurred while updating the department.');
    }
};

export const deleteDepartment = async (id) => {
    try {
        const response = await api.delete(`/department/${id}/`, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response 
        ? error.response.data 
        : new Error('An error occurred while deleting the department.');
    }
};

export const fetchAssignments = async () => {
    try {
        const response = await api.get('/assignments/', {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response
            ? error.response.data 
            : new Error('An error occurred while fetching assignments.');
    }
};

export const addAssignment = async (data) => {
    try {
        const response = await api.post('/assignments/', data, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response
            ? error.response.data
            : new Error('An error occurred while adding the assignment.');
    }
};

export const fetchAssignmentById = async (id) => {
    try {
        const response = await api.get(`/assignment/${id}/`, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response
            ? error.response.data
            : new Error('An error occurred while fetching the assignment.');
    }
};

export const endAssignmentById = async (id, data) => {
    try {
        const response = await api.post(`/assignment/${id}/end/`, data, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("End Assignment Error:", error); // Add this line
        throw error.response
            ? error.response.data
            : new Error('An error occurred while ending the assignment.');
    }
};

export const fetchAttendance = async () => {
    try {
        const response = await api.get('/attendances/', {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response
            ? error.response.data 
            : new Error('An error occurred while fetching attendances.');
    }
};

// Get today's attendance
export const fetchTodayAttendance = async () => {
    try {
        const response = await api.get('/today-attendance/', {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response
            ? error.response.data
            : new Error('An error occurred while fetching today\'s attendance.');
    }
};

// Get department attendance
export const fetchDepartmentAttendance = async (departmentId) => {
    try {
        const response = await api.get(`/department-attendance/${departmentId}/`, {
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response
            ? error.response.data
            : new Error('An error occurred while fetching department attendance.');
    }
};