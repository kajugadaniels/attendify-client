import axios from 'axios';

// const API_BASE_URL = 'http://127.0.0.1:8000/api';
const API_BASE_URL = 'https://eps-api.onrender.com/api';

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