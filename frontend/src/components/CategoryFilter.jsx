import './CategoryFilter.css'

const CATEGORIES = [
  { name: 'Semua', value: '' },
  { name: 'Piring & Mangkuk', value: 'Piring & Mangkuk' },
  { name: 'Cangkir & Gelas', value: 'Cangkir & Gelas' },
  { name: 'Vas & Pot Bunga', value: 'Vas & Pot Bunga' },
  { name: 'Teko & Kendi', value: 'Teko & Kendi' },
  { name: 'Celengan & Box', value: 'Celengan & Box' },
  { name: 'Dekorasi Rumah', value: 'Dekorasi Rumah' },
  { name: 'Peralatan Dapur', value: 'Peralatan Dapur' },
  { name: 'Hadiah & Souvenir', value: 'Hadiah & Souvenir' },
  { name: 'Koleksi', value: 'Koleksi' },
  { name: 'Tradisional', value: 'Tradisional' },
  { name: 'Modern', value: 'Modern' },
  { name: 'Kontemporer', value: 'Kontemporer' },
  { name: 'Etnik', value: 'Etnik' }
]

function CategoryFilter({ selectedCategory, onCategoryChange }) {
  return (
    <div className="category-filter">
      <h3>🏷️ Filter Kategori</h3>
      <div className="category-buttons">
        {CATEGORIES.map(category => (
          <button
            key={category.value}
            className={`category-btn ${selectedCategory === category.value ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.value)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryFilter
