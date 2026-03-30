import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './LoginRegister.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Email dan password wajib diisi')
      return
    }

    try {
      setLoading(true)
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <button 
        className="back-button"
        onClick={() => navigate('/')}
        title="Kembali ke halaman utama"
      >
        ← Kembali ke Beranda
      </button>

      <div className="auth-card">
        <div className="auth-header">
          <h1>🏺 Toko Gerabah</h1>
          <h2>Masuk</h2>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email Anda"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password Anda"
              required
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Sedang masuk...' : 'Masuk'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Belum punya akun?</p>
          <a href="/register" className="auth-link">Daftar di sini</a>
        </div>
      </div>
    </div>
  )
}

export default Login
