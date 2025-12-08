// utils/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import axios from 'axios';

const API = axios.create({
    baseURL: API_URL && API_URL.endsWith('/api') ? API_URL : `${API_URL || 'http://localhost:8000'}/api`,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            alert('Your session has expired. Please log in again.');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const generateMockTest = (testConfig) => API.post('/student/tests/generate/', testConfig);
export const fetchTestSession = (testId) => API.get(`/student/tests/${testId}/session/`);
export const submitMockTest = (testId, answers) => API.post(`/student/tests/${testId}/submit/`, { answers });
export const fetchTestAnalytics = (testId) => API.get(`/student/tests/${testId}/analytics/`);
export const fetchTestHistory = () => API.get('/student/tests/history/');

// --- ADMIN: CATEGORY MANAGEMENT ---
export const fetchAllCategories = () => API.get('/admin/categories/');
export const createCategory = (data) => API.post('/admin/categories/', data);
export const deleteCategory = (id) => API.delete(`/admin/categories/${id}/`);

// --- ADMIN: QUESTION BANK MANAGEMENT ---
export const fetchAllQuestions = () => API.get('/admin/questions/');
export const fetchQuestion = (id) => API.get(`/admin/questions/${id}/`);
export const createQuestion = (data) => API.post('/admin/questions/', data);
export const updateQuestion = (id, data) => API.put(`/admin/questions/${id}/`, data);
export const deleteQuestion = (id) => API.delete(`/admin/questions/${id}/`);

const apiFetch = async (path, options = {}) => {
    const token = localStorage.getItem('access_token');

    const headers = {
        ...options.headers,
    };

    // Add the Authorization header if a token exists
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // If we are sending FormData, we don't set Content-Type
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    let baseUrl = API_URL || 'http://localhost:8000';
    if (!baseUrl.endsWith('/api')) {
        baseUrl += '/api';
    }

    // If path starts with /api/, remove it to avoid duplication with baseUrl
    const finalPath = path.startsWith('/api/') ? path.slice(4) : path;

    const response = await fetch(`${baseUrl}${finalPath}`, { ...options, headers });

    // This is the crucial part: check for 401 Unauthorized
    if (response.status === 401) {
        // Clear tokens from storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        // Show the popup message
        alert('Your session has expired. Please log in again.');

        // Redirect to the login page
        window.location.href = '/login';

        // Throw an error to stop further execution
        throw new Error('Session expired');
    }

    return response;
};

export default apiFetch;