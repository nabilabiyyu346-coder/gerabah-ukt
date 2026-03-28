import { useState } from 'react'
import './Navbar.css'

function Navbar({ onAddClick }) {
  const [searchQuery, setSearchQuery] = useState('')
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>🏺 Toko Gerabah Sejati</h1>
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

        <button className="add-btn" onClick={onAddClick}>
          + Tambah Produk
        </button>
      </div>
    </nav>
  )
}

export default Navbar
