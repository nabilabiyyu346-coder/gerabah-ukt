import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Profile.css'

function Profile() {
  const navigate = useNavigate()
  const { user, token, updateProfile, logout } = useAuth()
  const [fullName, setFullName] = useState('')
  const [profilePictureUrl, setProfilePictureUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '')
      setProfilePictureUrl(user.profile_picture_url || '')
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!fullName.trim()) {
      setError('Nama lengkap tidak boleh kosong')
      return
    }

    try {
      setLoading(true)
      await updateProfile(fullName, profilePictureUrl)
      setSuccess('Profil berhasil diperbarui!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal memperbarui profil')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      try {
        await logout()
        navigate('/login')
      } catch (err) {
        console.error('Logout error:', err)
        navigate('/login')
      }
    }
  }

  if (!user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Silakan login terlebih dahulu</p>
        <button 
          onClick={() => navigate('/login')}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          Ke Halaman Login
        </button>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button 
          className="back-btn"
          onClick={() => navigate('/')}
          title="Kembali ke beranda"
        >
          ← Kembali
        </button>
        <h1>👤 Profil Saya</h1>
      </div>

      <div className="profile-card">
        <div className="profile-info">
          <div className="profile-avatar">
            {profilePictureUrl ? (
              <img src={profilePictureUrl} alt={user.full_name} />
            ) : (
              <div className="avatar-placeholder">👤</div>
            )}
          </div>

          <div className="profile-details">
            <div className="detail-group">
              <label>Email:</label>
              <p className="detail-value">{user.email}</p>
            </div>
            <div className="detail-group">
              <label>Username:</label>
              <p className="detail-value">{user.username}</p>
            </div>
            <div className="detail-group">
              <label>Role:</label>
              <p className="detail-value">
                {user.role === 'admin' ? '👑 Admin' : '👤 Customer'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <h2>Edit Profil</h2>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

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
            <label htmlFor="profilePicture">URL Foto Profil</label>
            <input
              type="url"
              id="profilePicture"
              value={profilePictureUrl}
              onChange={(e) => setProfilePictureUrl(e.target.value)}
              placeholder="https://contoh.com/foto.jpg"
            />
            {profilePictureUrl && (
              <div className="preview-text">Preview: Foto akan muncul di atas ↑</div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-save"
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : '💾 Simpan Perubahan'}
          </button>
        </form>

        <div className="profile-actions">
          <button 
            className="btn-logout"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
