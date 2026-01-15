/**
 * API Configuration
 * 
 * This is the SINGLE SOURCE OF TRUTH for all API endpoints.
 * Change the API_BASE_URL here to update it across the entire application.
 */

// Change this URL when deploying or changing backend location
export const API_BASE_URL = 'http://top2000project.runasp.net/';

// You can also use environment variables (recommended for production):
// export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7003/api';

/**
 * API Endpoints
 * All endpoints are constructed from the base URL
 */
export const API_ENDPOINTS = {
    songs: {
        list: `${API_BASE_URL}/songs`,
        byTitle: (title) => `${API_BASE_URL}/songs/by-title/${encodeURIComponent(title)}`,
        byId: (id) => `${API_BASE_URL}/songs/${id}`,
        history: (id) => `${API_BASE_URL}/songs/${id}/history`
    },
    statistics: {
        droppedSongs: (year) => `${API_BASE_URL}/songs/statistics/dropped-songs?year=${year}`
    },
    auth: {
        login: `${API_BASE_URL}/auth/login`,
        register: `${API_BASE_URL}/auth/register`,
        refresh: `${API_BASE_URL}/auth/refresh-token`
    }
};

export default API_BASE_URL;
