import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import './Checkout.css'

function Checkout() {
  const navigate = useNavigate()
  const { items, getTotalPrice, clearCart } = useCart()
  const { user, token, isAuthenticated } = useAuth()
  
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    paymentMethod: 'bank_transfer'
  })

  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState(null)

  if (!isAuthenticated) {
    return (
      <div className="not-auth-checkout">
        <h2>Silakan Login untuk Melanjutkan</h2>
        <button className="btn-primary" onClick={() => navigate('/login')}>
          Masuk Sekarang
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="empty-checkout">
        <h2>Keranjang Anda Kosong</h2>
        <button className="btn-primary" onClick={() => navigate('/cart')}>
          Kembali ke Keranjang
        </button>
      </div>
    )
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      alert('Silakan lengkapi semua field')
      return
    }

    setLoading(true)
    try {
      // Buat order object
      const order = {
        user_id: user?.id,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total_price: getTotalPrice(),
        shipping_address: `${formData.address}, ${formData.city}, ${formData.province} ${formData.postalCode}`,
        phone: formData.phone,
        payment_method: formData.paymentMethod,
        status: 'pending'
      }

      // Simpan order ke backend
      const response = await axios.post(
        'http://localhost:5000/api/orders',
        order,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      setOrderId(response.data.id)
      setOrderPlaced(true)
      clearCart()

    } catch (err) {
      console.error('Error placing order:', err)
      alert('Gagal membuat pesanan: ' + (err.response?.data?.error || err.message))
    } finally {
      setLoading(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="checkout-success">
        <div className="success-content">
          <div className="success-icon">✓</div>
          <h2>Pesanan Berhasil!</h2>
          <p>Terima kasih telah berbelanja di Toko Gerabah Sejati</p>
          
          <div className="order-details">
            <div className="detail-row">
              <span>Nomor Pesanan</span>
              <span className="detail-value">#{orderId}</span>
            </div>
            <div className="detail-row">
              <span>Total Pembayaran</span>
              <span className="detail-value">Rp {getTotalPrice().toLocaleString()}</span>
            </div>
            <div className="detail-row">
              <span>Status</span>
              <span className="detail-value status-pending">Menunggu Pembayaran</span>
            </div>
          </div>

          <p className="info-text">
            💳 Silakan lakukan pembayaran sesuai metode yang dipilih. 
            Pesanan Anda akan diproses setelah kami mengkonfirmasi pembayaran.
          </p>

          <div className="success-buttons">
            <button className="btn-primary" onClick={() => navigate('/')}>
              Kembali ke Beranda
            </button>
            <button className="btn-secondary" onClick={() => navigate('/products')}>
              Lanjut Belanja
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-container">
      <h1>💳 Checkout</h1>

      <div className="checkout-content">
        {/* Checkout Form */}
        <form className="checkout-form" onSubmit={handleSubmit}>
          <section className="form-section">
            <h3>📍 Alamat Pengiriman</h3>
            
            <div className="form-group">
              <label>Nama Lengkap *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="email@example.com"
                />
              </div>
              <div className="form-group">
                <label>Nomor Telepon *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+62 812-3456-7890"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Alamat Lengkap *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                placeholder="Jalan, No. Rumah, Kelurahan"
                rows="3"
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Kota/Kabupaten *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  placeholder="Nama kota"
                />
              </div>
              <div className="form-group">
                <label>Provinsi *</label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  required
                  placeholder="Nama provinsi"
                />
              </div>
              <div className="form-group">
                <label>Kode Pos *</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  required
                  placeholder="12345"
                />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h3>💳 Metode Pembayaran</h3>
            
            <div className="payment-methods">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={formData.paymentMethod === 'bank_transfer'}
                  onChange={handleInputChange}
                />
                <span>Transfer Bank</span>
              </label>
              
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="e_wallet"
                  checked={formData.paymentMethod === 'e_wallet'}
                  onChange={handleInputChange}
                />
                <span>E-Wallet (GCash, OVO, Dana)</span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit_card"
                  checked={formData.paymentMethod === 'credit_card'}
                  onChange={handleInputChange}
                />
                <span>Kartu Kredit</span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                />
                <span>Bayar di Tempat (COD)</span>
              </label>
            </div>
          </section>

          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? '⏳ Memproses...' : '✓ Lanjutkan ke Pembayaran'}
          </button>
        </form>

        {/* Order Summary */}
        <aside className="checkout-summary">
          <h3>📦 Ringkasan Pesanan</h3>
          
          <div className="summary-items">
            {items.map(item => (
              <div key={item.id} className="summary-item">
                <div>
                  <p className="item-name">{item.name}</p>
                  <p className="item-qty">x{item.quantity}</p>
                </div>
                <p className="item-price">Rp {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="summary-divider"></div>

          <div className="summary-calculation">
            <div className="calc-row">
              <span>Subtotal</span>
              <span>Rp {getTotalPrice().toLocaleString()}</span>
            </div>
            <div className="calc-row">
              <span>Ongkos Kirim</span>
              <span>Rp 0</span>
            </div>
            <div className="calc-row">
              <span>Diskon</span>
              <span>Rp 0</span>
            </div>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">
            <span>Total</span>
            <span>Rp {getTotalPrice().toLocaleString()}</span>
          </div>

          <button 
            type="button"
            className="btn-back-to-cart"
            onClick={() => navigate('/cart')}
          >
            ← Kembali ke Keranjang
          </button>
        </aside>
      </div>
    </div>
  )
}

export default Checkout
