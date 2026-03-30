import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import './Cart.css'

function Cart() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    return (
      <div className="not-auth">
        <div className="not-auth-content">
          <h2>📝 Silakan Login Terlebih Dahulu</h2>
          <p>Anda harus login untuk melanjutkan berbelanja</p>
          <button className="btn-primary" onClick={() => navigate('/login')}>
            Masuk Sekarang
          </button>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-content">
          <p className="empty-icon">🛒</p>
          <h2>Keranjang Anda Kosong</h2>
          <p>Mulai belanja gerabah berkualitas kami</p>
          <button className="btn-primary" onClick={() => navigate('/products')}>
            Lanjut Belanja
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>🛒 Keranjang Belanja</h1>
        <p>{getTotalItems()} produk</p>
      </div>

      <div className="cart-content">
        {/* Cart Items */}
        <div className="cart-items">
          {items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} />
                ) : (
                  <div className="placeholder">🏺</div>
                )}
              </div>

              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-description">{item.description?.substring(0, 80)}...</p>
                <p className="item-price">Rp {item.price?.toLocaleString()}</p>
              </div>

              <div className="item-quantity">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                <input 
                  type="number" 
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                  min="1"
                />
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>

              <div className="item-total">
                <p>Rp {(item.price * item.quantity).toLocaleString()}</p>
              </div>

              <button 
                className="btn-remove"
                onClick={() => removeFromCart(item.id)}
                title="Hapus dari keranjang"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="cart-summary">
          <div className="summary-card">
            <h3>Ringkasan Pesanan</h3>
            
            <div className="summary-row">
              <span>Subtotal ({getTotalItems()} produk)</span>
              <span>Rp {getTotalPrice().toLocaleString()}</span>
            </div>

            <div className="summary-row">
              <span>Ongkos Kirim</span>
              <span>Rp 0</span>
            </div>

            <div className="summary-row">
              <span>Pajak</span>
              <span>Rp 0</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <span>Rp {getTotalPrice().toLocaleString()}</span>
            </div>

            <button 
              className="btn-checkout"
              onClick={() => navigate('/checkout')}
            >
              💳 Lanjut ke Pembayaran
            </button>

            <button 
              className="btn-continue-shopping"
              onClick={() => navigate('/products')}
            >
              ← Lanjut Belanja
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
