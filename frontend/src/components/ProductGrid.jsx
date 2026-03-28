import './ProductGrid.css'
import ProductCard from './ProductCard'

function ProductGrid({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-icon">🏺</p>
        <h2>Belum ada produk</h2>
        <p>Mulai dengan menambahkan produk gerabah pertama Anda!</p>
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
          />
        ))}
      </div>
    </div>
  )
}

export default ProductGrid
