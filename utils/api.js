// utils/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

    const response = await fetch(`${API_URL}${path}`, { ...options, headers });

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