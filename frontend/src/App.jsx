import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import Navbar from './components/Navbar'
import Home from './components/Home'
import ProductGrid from './components/ProductGrid'
import ProductModal from './components/ProductModal'
import CategoryFilter from './components/CategoryFilter'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import axios from 'axios'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial' }}>
          <h1>❌ Ada Error</h1>
          <pre style={{ textAlign: 'left', background: '#f5f5f5', padding: '10px' }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      )
    }

    return this.props.children
  }
}

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { isAuthenticated, token, user } = useAuth()

  const API_URL = 'http://localhost:5000/api'

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/products`)
      setProducts(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Gagal memuat produk')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchProducts()
  }, [])

  // Add product
  const handleAddProduct = async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/products`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setProducts([...products, response.data])
      setShowModal(false)
      setError(null)
    } catch (err) {
      console.error('Error adding product:', err)
      setError(err.response?.data?.error || 'Gagal menambah produk')
    }
  }

  // Update product
  const handleUpdateProduct = async (id, formData) => {
    try {
      const response = await axios.put(`${API_URL}/products/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setProducts(products.map(p => p.id === id ? response.data : p))
      setEditingProduct(null)
      setShowModal(false)
      setError(null)
    } catch (err) {
      console.error('Error updating product:', err)
      setError(err.response?.data?.error || 'Gagal memperbarui produk')
    }
  }

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await axios.delete(`${API_URL}/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        setProducts(products.filter(p => p.id !== id))
        setError(null)
      } catch (err) {
        console.error('Error deleting product:', err)
        setError(err.response?.data?.error || 'Gagal menghapus produk')
      }
    }
  }

  const handleOpenModal = (product = null) => {
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }
    
    if (user?.role !== 'admin') {
      setError('Hanya admin yang dapat menambah/mengedit produk')
      return
    }
    
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProduct(null)
  }

  const handleSubmitModal = (formData) => {
    if (editingProduct) {
      handleUpdateProduct(editingProduct.id, formData)
    } else {
      handleAddProduct(formData)
    }
  }

  // Filter products berdasarkan kategori
  const filteredProducts = selectedCategory 
    ? products.filter(p => p.category === selectedCategory)
    : products

  return (
    <>
      <Navbar onAddClick={() => handleOpenModal()} />
      
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Memuat produk...</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
              Menampilkan {filteredProducts.length} dari {products.length} produk
              {selectedCategory && ` di kategori "${selectedCategory}"`}
            </div>
            <ProductGrid 
              products={filteredProducts}
              onEdit={user?.role === 'admin' ? handleOpenModal : undefined}
              onDelete={user?.role === 'admin' ? handleDeleteProduct : undefined}
            />
          </>
        )}
      </div>

      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={handleCloseModal}
          onSubmit={handleSubmitModal}
        />
      )}
    </>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
