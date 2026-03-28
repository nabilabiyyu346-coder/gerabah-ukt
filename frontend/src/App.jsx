import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import ProductGrid from './components/ProductGrid'
import ProductModal from './components/ProductModal'
import axios from 'axios'

function App() {
  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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

  useEffect(() => {
    fetchProducts()
  }, [])

  // Add product
  const handleAddProduct = async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/products`, formData)
      setProducts([...products, response.data])
      setShowModal(false)
      setError(null)
    } catch (err) {
      console.error('Error adding product:', err)
      setError('Gagal menambah produk')
    }
  }

  // Update product
  const handleUpdateProduct = async (id, formData) => {
    try {
      const response = await axios.put(`${API_URL}/products/${id}`, formData)
      setProducts(products.map(p => p.id === id ? response.data : p))
      setEditingProduct(null)
      setShowModal(false)
      setError(null)
    } catch (err) {
      console.error('Error updating product:', err)
      setError('Gagal memperbarui produk')
    }
  }

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await axios.delete(`${API_URL}/products/${id}`)
        setProducts(products.filter(p => p.id !== id))
        setError(null)
      } catch (err) {
        console.error('Error deleting product:', err)
        setError('Gagal menghapus produk')
      }
    }
  }

  const handleOpenModal = (product = null) => {
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

  return (
    <div className="App">
      <Navbar onAddClick={() => handleOpenModal()} />
      
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Memuat produk...</p>
        </div>
      ) : (
        <ProductGrid 
          products={products}
          onEdit={handleOpenModal}
          onDelete={handleDeleteProduct}
        />
      )}

      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={handleCloseModal}
          onSubmit={handleSubmitModal}
        />
      )}
    </div>
  )
}

export default App
