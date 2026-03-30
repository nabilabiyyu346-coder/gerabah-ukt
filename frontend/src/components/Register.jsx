import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './LoginRegister.css'

function Register() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!email || !username || !password || !confirmPassword || !fullName) {
      setError('Semua field wajib diisi')
      return
    }

    if (password !== confirmPassword) {
      setError('Password tidak cocok')
      return
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }

    try {
      setLoading(true)
      await register(email, username, password, fullName)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal registrasi')
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
          <h2>Daftar Akun</h2>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName">Nama Lengkap</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

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
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Pilih username"
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
              placeholder="Minimal 6 karakter"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Konfirmasi Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Sedang membuat akun...' : 'Daftar'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Sudah punya akun?</p>
          <a href="/login" className="auth-link">Masuk di sini</a>
        </div>
      </div>
    </div>
  )
}

export default Register
