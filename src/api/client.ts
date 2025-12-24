import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for JWT authentication (for future use)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken')
      // Could redirect to login page here when auth is implemented
      console.warn('Session expired - authentication required')
    }

    // Format error for better handling
    const formattedError = {
      message: error.response?.data?.message || error.message || 'Une erreur est survenue',
      status: error.response?.status,
      code: error.response?.data?.code,
      errors: error.response?.data?.errors, // Validation errors
    }

    return Promise.reject(formattedError)
  }
)
