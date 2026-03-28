# Contributing Guide

Panduan untuk berkontribusi pada project Toko Gerabah

## 🛠️ Development Setup

### Prasyarat
- Node.js v18+
- npm v9+
- Git
- Supabase account

### Setup Lokal

1. Clone repository
```bash
git clone <repository-url>
cd gerabah-ukt
```

2. Install dependencies
```bash
npm run install-all
```

3. Setup environment variables marasah [QUICKSTART.md](QUICKSTART.md))

4. Start development server
```bash
npm run dev
```

## 📝 Code Style

### JavaScript/JSX Rules

- ✅ Use modern ES6+ syntax
- ✅ Use functional components di React (bukan class)
- ✅ Use destructuring untuk imports
- ✅ Use camelCase untuk variabel
- ✅ Use PascalCase untuk component names
- ✅ Add comments untuk logic yang kompleks
- ✅ Use const/let (avoid var)

### Example - Good Code

```jsx
// Good: Functional component dengan JSX
function ProductCard({ product, onEdit, onDelete }) {
  // Destructure props
  const { id, name, price } = product
  
  // Use arrow functions
  const handleClick = () => {
    onEdit(product)
  }

  return (
    <div className="product-card">
      <h3>{name}</h3>
      <p>Rp {price}</p>
    </div>
  )
}

export default ProductCard
```

### Example - Avoid

```jsx
// Bad: Class component (outdated)
class ProductCard extends React.Component {
  // Unnecessary complexity
}

// Bad: var keyword
var product = {};

// Bad: Long lines without proper formatting
const result = someFunction() && anotherFunction() || thirdFunction() ? true : false;
```

## 🎨 CSS/Styling Guidelines

### Variables to Use

```css
:root {
  --warna-cokelat: #8B6F47;
  --warna-cokelat-gelap: #6B5437;
  --warna-cokelat-muda: #D2B48C;
  --warna-putih: #FFFFFF;
  --warna-abu: #F5F5F5;
  --warna-shadow: rgba(139, 111, 71, 0.1);
}
```

### CSS Structure

```css
/* 1. Layout & Box Model */
.component {
  display: flex;
  width: 100%;
  padding: 16px;
  margin-bottom: 20px;
}

/* 2. Typography */
.component {
  font-size: 16px;
  font-weight: 600;
  color: var(--warna-cokelat);
  line-height: 1.4;
}

/* 3. styling & Effects */
.component {
  background-color: var(--warna-putih);
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--warna-shadow);
  transition: all 0.3s ease;
}

/* 4. Hover/Active States */
.component:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--warna-shadow);
}

/* 5. Responsive */
@media (max-width: 768px) {
  .component {
    padding: 12px;
  }
}
```

## 🔄 Git Workflow

### Branch Naming

```
feature/feature-name          # New feature
bugfix/bug-name              # Bug fix
refactor/refactor-name       # Refactoring
docs/documentation-name      # Documentation
```

### Commit Messages

```
feat: Add product search feature
fix: Fix CORS error in backend
docs: Update API documentation
style: Format code and fix styling
refactor: Reorganize component structure
```

### Pull Request Process

1. Create feature branch
```bash
git checkout -b feature/your-feature-name
```

2. Make changes dan commit
```bash
git commit -m "feat: Add your feature"
```

3. Push ke repository
```bash
git push origin feature/your-feature-name
```

4. Create Pull Request di GitHub

## 🧪 Testing Checklist

Sebelum submit PR, pastikan:

- [ ] Code sudah berjalan di lokal
- [ ] Tidak ada console errors
- [ ] Responsive design di mobile
- [ ] CRUD operations working (jika relevant)
- [ ] Error handling implemented
- [ ] Loading states shown
- [ ] No hardcoded values
- [ ] Environment variables used correctly
- [ ] Comments added untuk complex logic

## 🎯 Feature Request

Format untuk feature request:

```markdown
## Feature: [Feature Name]

### Description
Jelaskan apa yang ingin ditambahkan

### Why
Alasan mengapa feature ini penting

### Example Use Case
Contoh bagaimana feature ini akan digunakan

### Potential Implementation
Ide bagaimana cara implementasi

### Related Issues
Link ke issue yang related
```

## 🐛 Bug Report

Format untuk bug report:

```markdown
## Bug: [Bug Title]

### Description
Jelaskan bug dengan detail

### Steps to Reproduce
1. Step 1
2. Step 2
3. ...

### Expected Behavior
Apa yang seharusnya terjadi

### Actual Behavior
Apa yang benar-benar terjadi

### Environment
- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox
- Node version: v18.x
- npm version: 9.x

### Screenshots/Logs
Screenshot atau error logs jika ada
```

## 📚 Documentation

### README Guidelines

- Jelas dan concise
- Include setup instructions
- Include usage examples
- Include troubleshooting

### Code Comments

```javascript
// Good: Explain WHY, not WHAT
// We need to call this async function before rendering
const handleSubmit = async () => {
  // ...
}

// Bad: Explaining obvious things
// Set name to empty string
const name = ''

// Good: Explain complex logic
// Performance optimization: Only update if values changed
const memoizedValue = useMemo(() => {
  return expensiveCalculation(a, b)
}, [a, b])
```

## 🚀 Performance Tips

### React Optimization

```javascript
// Use memo untuk expensive components
const MemoizedComponent = React.memo(Component)

// Use useCallback untuk stable function references
const handleClick = useCallback(() => {
  // ...
}, [dependencies])

// Use useMemo untuk expensive calculations
const memoizedValue = useMemo(() => {
  return complexCalculation()
}, [dependencies])
```

### API Calls

```javascript
// BAD: Multiple calls
const fetchData = () => {
  fetch(url).then(...)
  fetch(url).then(...)
  fetch(url).then(...)
}

// GOOD: Single call or parallel
const fetchData = () => {
  Promise.all([
    fetch(url1),
    fetch(url2),
    fetch(url3)
  ]).then(...)
}
```

## 📦 Dependencies

Sebelum menambah dependency baru:

1. Check apakah sudah ada yang similar
2. Check ukuran dan performa impact
3. Check apakah masih di-maintain
4. Diskusikan dengan team

## 🔐 Security

### Never Commit

- API keys, credentials
- Passwords
- Private tokens
- Sensitive data

### Use Environment Variables

```javascript
// GOOD
const url = process.env.VITE_API_URL

// BAD
const url = 'https://api.example.com'
```

## 📞 Questions?

- Check dokumentasi di README.md
- Check existing issues di GitHub
- Create discussion issue

---

**Thank you for contributing! 🎉**
