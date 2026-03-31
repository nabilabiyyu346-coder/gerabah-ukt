import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import './Navbar.css'

function Navbar({ onAddClick }) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { getTotalItems, clearCart } = useCart()
  
  const handleLogout = async () => {
    try {
      await logout()
      clearCart() // Clear cart for logged out user
      navigate('/login')
    } catch (err) {
      console.error('Logout error:', err)
      clearCart()
      navigate('/login')
    }
  }

  const handleProfileClick = () => {
    setShowUserMenu(false)
    navigate('/profile')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <a href="/" style={{ cursor: 'pointer', textDecoration: 'none' }}>
            <h1>🏺 Toko Gerabah Sejati</h1>
          </a>
        </div>
        
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Cari gerabah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">🔍</button>
        </div>

        <div className="navbar-actions">
          <a href="/products" className="nav-link">
            🛍️ Belanja
          </a>
          
          <button 
            className="cart-btn"
            onClick={() => navigate('/cart')}
            title="Keranjang"
          >
            🛒 
            {getTotalItems() > 0 && (
              <span className="cart-badge">{getTotalItems()}</span>
            )}
          </button>

          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <button className="add-btn" onClick={onAddClick}>
                  + Tambah Produk
                </button>
              )}
              <div className="user-menu">
                <button 
                  className="user-button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  👤 {user?.username}
                </button>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <p><strong>{user?.full_name}</strong></p>
                      <p className="user-email">{user?.email}</p>
                    </div>
                    <hr />
                    <button className="dropdown-item" onClick={handleProfileClick}>
                      ⚙️ Profil
                    </button>
                    <button className="dropdown-item logout" onClick={handleLogout}>
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <a href="/login" className="auth-link">
                Masuk
              </a>
              <a href="/register" className="add-btn">
                Daftar
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
