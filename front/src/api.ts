import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token dynamically
export function setAuthToken(token: string | null) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
}

// if a token exists in localStorage (fresh page load), set it immediately so initial requests include it
try {
  const existing = localStorage.getItem('authToken');
  if (existing) setAuthToken(existing);
} catch (e) {
  // ignore (e.g., when localStorage is not available in some environments)
}

export default api;
