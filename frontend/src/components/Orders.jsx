import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from './Navbar'
import axios from 'axios'
import './Orders.css'

function Orders() {
  const navigate = useNavigate()
  const { user, token, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    fetchOrders()
  }, [isAuthenticated, token])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      const response = await axios.get(`${apiUrl}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log('Orders fetched:', response.data)
      setOrders(response.data || [])
      setError('')
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err.response?.data?.error || 'Gagal memuat pesanan')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { icon: '⏳', label: 'Menunggu Pembayaran', color: 'warning' },
      'confirmed': { icon: '✅', label: 'Dikonfirmasi', color: 'info' },
      'shipped': { icon: '📦', label: 'Dikirim', color: 'info' },
      'delivered': { icon: '🎉', label: 'Terima', color: 'success' },
      'cancelled': { icon: '❌', label: 'Dibatalkan', color: 'danger' }
    }
    return statusMap[status] || { icon: '❓', label: status, color: 'secondary' }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="not-auth">
        <p>Silakan login untuk melihat pesanan Anda</p>
        <button onClick={() => navigate('/login')}>Masuk</button>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="orders-container">
        <div className="orders-header">
          <h1>📦 Pesanan Saya</h1>
          <p className="user-info">👤 {user?.full_name || user?.username}</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
            <button onClick={() => setError('')}>✕</button>
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Memuat pesanan...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-orders">
            <p className="empty-icon">📭</p>
            <h2>Belum ada pesanan</h2>
            <p>Mulai belanja gerabah berkualitas kami</p>
            <button className="btn-primary" onClick={() => navigate('/products')}>
              🛍️ Belanja Sekarang
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => {
              const statusInfo = getStatusBadge(order.status)
              const isExpanded = expandedOrder === order.id
              
              return (
                <div key={order.id} className="order-card">
                  <div 
                    className="order-header-row"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="order-summary">
                      <div className="order-number">
                        <strong>Pesanan #{order.id?.substring(0, 8).toUpperCase()}</strong>
                        <span className={`status-badge status-${statusInfo.color}`}>
                          {statusInfo.icon} {statusInfo.label}
                        </span>
                      </div>
                      <div className="order-date">
                        📅 {formatDate(order.created_at)}
                      </div>
                    </div>
                    <div className="order-total">
                      <span className="total-label">Total:</span>
                      <span className="total-amount">
                        Rp {order.total_price?.toLocaleString('id-ID') || '0'}
                      </span>
                    </div>
                    <span className="expand-icon">
                      {isExpanded ? '▼' : '▶'}
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="order-details">
                      <div className="detail-section">
                        <h4>📦 Produk</h4>
                        <div className="items-list">
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item, idx) => (
                              <div key={idx} className="item-row">
                                <span className="item-name">
                                  {item.products?.name || 'Produk'}
                                </span>
                                <span className="item-qty">x{item.quantity}</span>
                                <span className="item-price">
                                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="no-items">Tidak ada item</p>
                          )}
                        </div>
                      </div>

                      <div className="detail-section">
                        <h4>🚚 Pengiriman</h4>
                        <p className="address">{order.shipping_address}</p>
                        <p className="phone">📞 {order.phone}</p>
                      </div>

                      <div className="detail-section">
                        <h4>💳 Metode Pembayaran</h4>
                        <p className="payment-method">
                          {order.payment_method === 'bank_transfer' && '🏦 Transfer Bank'}
                          {order.payment_method === 'e_wallet' && '📱 E-Wallet'}
                          {order.payment_method === 'credit_card' && '💳 Kartu Kredit'}
                          {order.payment_method === 'cod' && '🚪 Bayar di Tempat'}
                        </p>
                      </div>

                      {order.notes && (
                        <div className="detail-section">
                          <h4>📝 Catatan</h4>
                          <p className="notes">{order.notes}</p>
                        </div>
                      )}

                      <div className="order-actions">
                        <button 
                          className="btn-receipt"
                          onClick={() => window.print()}
                        >
                          🖨️ Cetak Receipt
                        </button>
                        <button 
                          className="btn-reorder"
                          onClick={() => navigate('/products')}
                        >
                          🔄 Belanja Lagi
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default Orders
