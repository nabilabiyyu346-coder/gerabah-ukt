import './ProductGrid.css'
import ProductCard from './ProductCard'

function ProductGrid({ products, onEdit, onDelete }) {
  const isAdmin = !!onEdit && !!onDelete

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-icon">🏺</p>
        <h2>Belum ada produk</h2>
        <p>{isAdmin ? 'Mulai dengan menambahkan produk gerabah pertama Anda!' : 'Maaf, produk sedang habis'}</p>
      </div>
    )
  }

  return (
    <div className="product-grid-container">
      <div className="product-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={onEdit}
            onDelete={onDelete}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </div>
  )
}

export default ProductGrid
