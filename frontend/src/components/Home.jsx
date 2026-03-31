import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import './Home.css'

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
        const response = await axios.get(`${apiUrl}/products`)
        setFeaturedProducts(response.data.slice(0, 6))
      } catch (err) {
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>🏺 Toko Gerabah Sejati</h1>
          <p>Keindahan Tradisional Dalam Setiap Karya</p>
          <p className="hero-subtitle">Gerabah autentik berkualitas tinggi, dibuat dengan cinta dan tradisi</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => document.querySelector('.featured-section').scrollIntoView({ behavior: 'smooth' })}>
              🛍️ Jelajahi Produk
            </button>
            {!isAuthenticated && (
              <button className="btn-secondary" onClick={() => navigate('/register')}>
                📝 Daftar Gratis
              </button>
            )}
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-illustration">
            🏺✨🎨
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="feature-card">
            <span className="feature-icon">🎯</span>
            <h3>100% Autentik</h3>
            <p>Setiap produk adalah karya seni asli dari pengrajin berpengalaman</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🚚</span>
            <h3>Pengiriman Aman</h3>
            <p>Kemasan premium memastikan gerabah Anda tiba dalam kondisi sempurna</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">💳</span>
            <h3>Pembayaran Mudah</h3>
            <p>Berbagai metode pembayaran untuk kemudahan Anda</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">⭐</span>
            <h3>Kepuasan Terjamin</h3>
            <p>Uang kembali 100% jika Anda tidak puas</p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2>✨ Produk Unggulan</h2>
          <p>Koleksi terbaik kami yang paling diminati</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner"></div>
            <p>Memuat produk...</p>
          </div>
        ) : (
          <div className="featured-grid">
            {featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <div key={product.id} className="featured-card">
                  <div className="featured-image">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} />
                    ) : (
                      <div className="placeholder-image">🏺</div>
                    )}
                  </div>
                  <div className="featured-content">
                    <h3>{product.name}</h3>
                    {product.category && (
                      <span className="featured-category">{product.category}</span>
                    )}
                    <p className="description">{product.description?.substring(0, 60)}...</p>
                    <div className="product-footer">
                      <span className="price">Rp {product.price?.toLocaleString()}</span>
                      <span className={`stock ${product.stock > 0 ? 'available' : 'sold'}`}>
                        {product.stock > 0 ? `${product.stock} tersedia` : 'Terjual'}
                      </span>
                    </div>
                    <button 
                      className="btn-add-cart"
                      onClick={() => navigate('/products')}
                      disabled={product.stock === 0}
                    >
                      🛒 Lihat Detail
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                <p>Belum ada produk. Silakan tambahkan produk baru!</p>
              </div>
            )}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button className="btn-primary-large" onClick={() => navigate('/products')}>
            Lihat Semua Produk →
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Siap Memulai Koleksi Anda?</h2>
        <p>Temukan gerabah pilihan yang sempurna untuk rumah atau hadiah istimewa</p>
        <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button className="btn-cta-primary" onClick={() => navigate('/products')}>
            Mulai Berbelanja
          </button>
          {isAuthenticated && (
            <button className="btn-cta-secondary" onClick={() => navigate('/cart')}>
              🛒 Lihat Keranjang
            </button>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
