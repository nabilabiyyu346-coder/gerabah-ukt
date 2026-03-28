import axios from 'axios'

// Create axios instance
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 second timeout
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add token if exists
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

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('Response error:', error.response.status, error.response.data)
    } else if (error.request) {
      // Request made but no response
      console.error('Request error:', error.request)
    } else {
      // Error in request setup
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default apiClient
