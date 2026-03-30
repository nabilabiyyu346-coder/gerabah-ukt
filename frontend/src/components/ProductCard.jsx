import { useCart } from '../contexts/CartContext'
import './ProductCard.css'

function ProductCard({ product, onEdit, onDelete, isAdmin = false }) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product, 1)
    alert(`${product.name} ditambahkan ke keranjang!`)
  }

  return (
    <div className="product-card">
      <div className="product-image">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} />
        ) : (
          <div className="image-placeholder">🏺</div>
        )}
        {product.stock === 0 && (
          <div className="sold-badge">TERJUAL</div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {product.category && (
          <span className="product-category">{product.category}</span>
        )}
        <p className="product-description">{product.description}</p>
        
        <div className="product-footer">
          <div className="product-price">
            Rp {new Intl.NumberFormat('id-ID').format(product.price)}
          </div>
          <div className={`product-stock ${product.stock > 0 ? 'available' : 'sold'}`}>
            {product.stock > 0 ? `${product.stock} tersedia` : 'Terjual'}
          </div>
        </div>

        <div className="product-actions">
          {isAdmin ? (
            <>
              <button 
                className="btn-edit"
                onClick={() => onEdit(product)}
              >
                ✏️ Edit
              </button>
              <button 
                className="btn-delete"
                onClick={() => onDelete(product.id)}
              >
                🗑️ Hapus
              </button>
            </>
          ) : (
            <button 
              className="btn-add-to-cart"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              🛒 Tambah ke Keranjang
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
