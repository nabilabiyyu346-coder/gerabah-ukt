import { useState, useEffect } from 'react'
import './ProductModal.css'

function ProductModal({ product, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image_url: ''
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        image_url: product.image_url || ''
      })
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.price || !formData.stock) {
      alert('Nama produk, harga, dan stok wajib diisi!')
      return
    }

    onSubmit(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Nama Produk *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Gerabah Guci Cokelat"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Deskripsi</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Deskripsi produk gerabah..."
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Harga (Rp) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Contoh: 150000"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stok *</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Contoh: 10"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image_url">URL Gambar</label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {formData.image_url && (
            <div className="image-preview">
              <img src={formData.image_url} alt="Preview" />
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-submit">
              {product ? 'Update Produk' : 'Tambah Produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductModal
