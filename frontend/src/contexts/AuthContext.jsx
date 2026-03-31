import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        try {
          const response = await axios.get(`${API_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          })
          setUser(response.data.user)
          setToken(storedToken)
        } catch (err) {
          console.error('Auth check failed:', err)
          localStorage.removeItem('token')
          setToken(null)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const register = async (email, username, password, fullName) => {
    try {
      setError(null)
      setLoading(true)

      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        username,
        password,
        full_name: fullName
      })

      const { user: userData, token: newToken } = response.data

      setUser(userData)
      setToken(newToken)
      localStorage.setItem('token', newToken)

      return userData
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Gagal registrasi'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      setLoading(true)

      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      })

      const { user: userData, token: newToken } = response.data

      setUser(userData)
      setToken(newToken)
      localStorage.setItem('token', newToken)

      return userData
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Gagal login'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      if (token) {
        await axios.post(`${API_URL}/auth/logout`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setUser(null)
      setToken(null)
      localStorage.removeItem('token')
    }
  }

  const updateProfile = async (fullName, profilePictureUrl) => {
    try {
      setError(null)

      const response = await axios.put(`${API_URL}/auth/profile`, {
        full_name: fullName,
        profile_picture_url: profilePictureUrl
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      setUser(response.data.user)
      return response.data.user
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Gagal memperbarui profil'
      setError(errorMsg)
      throw err
    }
  }

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user && !!token,
    register,
    login,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
