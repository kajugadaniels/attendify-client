import axios from 'axios';

const baseURL =
    import.meta.env.MODE === 'production'
        ? import.meta.env.VITE_API_BASE_URL_PROD
        : import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
    baseURL,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const loginUser = async (email, password) => {
    try {
        const response = await apiClient.post('/auth/login/', { email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const response = await apiClient.post('/auth/logout/')
        return response.data
    } catch (error) {
        throw error
    }
}

export const updateUserProfile = async (updateData) => {
    try {
        const response = await apiClient.patch('/auth/profile-update/', updateData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchUsers = async () => {
    try {
        const response = await apiClient.get('/users/');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createUser = async (userData) => {
    try {
        const response = await apiClient.post('/user/add/', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchUserDetails = async (userId) => {
    try {
        const response = await apiClient.get(`/user/${userId}/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const response = await apiClient.patch(`/user/${userId}/update/`, userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await apiClient.delete(`/user/${userId}/delete/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchFields = async () => {
    try {
        const response = await apiClient.get('/fields/');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createField = async (fieldData) => {
    try {
        const response = await apiClient.post('/field/add/', fieldData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchFieldDetails = async (fieldId) => {
    try {
        const response = await apiClient.get(`/field/${fieldId}/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateField = async (fieldId, fieldData) => {
    try {
        const response = await apiClient.patch(`/field/${fieldId}/update/`, fieldData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteField = async (fieldId) => {
    try {
        const response = await apiClient.delete(`/field/${fieldId}/delete/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};