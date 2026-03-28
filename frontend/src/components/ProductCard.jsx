import './ProductCard.css'

function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="product-card">
      <div className="product-image">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} />
        ) : (
          <div className="image-placeholder">🏺</div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-footer">
          <div className="product-price">
            Rp {new Intl.NumberFormat('id-ID').format(product.price)}
          </div>
          <div className="product-stock">
            Stock: {product.stock}
          </div>
        </div>

        <div className="product-actions">
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
        </div>
      </div>
    </div>
  )
}

export default ProductCard
