# Authentication Implementation Guide

Panduan lengkap implementasi fitur authentication (Login & Logout) di Toko Gerabah

## 📋 Overview

Sistem authentication yang telah diimplementasikan:

- ✅ **Register** - Pendaftaran akun baru
- ✅ **Login** - Masuk ke akun
- ✅ **Logout** - Keluar dari akun
- ✅ **JWT Tokens** - Token-based authentication
- ✅ **Protected Routes** - Hanya user yang login bisa CRUD
- ✅ **User Context** - Global state management

## 🗄️ Database Setup

### 1. Create Users Table di Supabase

Jalankan SQL query ini di Supabase:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  profile_picture_url TEXT,
  role VARCHAR(50) DEFAULT 'customer',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can insert" ON users FOR INSERT WITH CHECK (true);
```

## 🔧 Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install bcrypt jsonwebtoken uuid
```

### 2. Update .env File

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=86400
PORT=5000
```

Generate random JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Backend Files

**Files yang dibuat/diupdate:**
- `auth.js` - JWT dan password utilities
- `authRoutes.js` - Auth endpoints (register, login, logout, me, profile)
- `routes.js` - Updated dengan authMiddleware
- `server.js` - Updated untuk include auth routes

### 4. Auth Endpoints

#### POST /auth/register
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "username",
    "password": "password123",
    "full_name": "Full Name"
  }'
```

#### POST /auth/login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### GET /auth/me
```bash
curl -X GET http://localhost:5000/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### POST /auth/logout
```bash
curl -X POST http://localhost:5000/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### PUT /auth/profile
```bash
curl -X PUT http://localhost:5000/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "full_name": "New Name",
    "profile_picture_url": "https://..."
  }'
```

## 🎨 Frontend Setup

### 1. Install Dependencies

Frontend sudah include react-router-dom di package.json

```bash
cd frontend
npm install
```

### 2. New Components

**Files yang dibuat:**
- `contexts/AuthContext.jsx` - Auth state management
- `components/Login.jsx` - Login page
- `components/Register.jsx` - Register page
- `components/ProtectedRoute.jsx` - Protected route wrapper
- `components/LoginRegister.css` - Styling

### 3. AuthContext Features

```javascript
const { 
  user,              // Current user object
  token,             // JWT token
  loading,           // Loading state
  error,             // Error message
  isAuthenticated,   // Boolean: is user logged in
  register,          // Register function
  login,             // Login function
  logout,            // Logout function
  updateProfile      // Update profile function
} = useAuth()
```

### 4. Usage Examples

#### Login Component
```jsx
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

function MyComponent() {
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (email, password) => {
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      // Error handling
    }
  }

  return (
    // Login form
  )
}
```

#### Protected Component
```jsx
import { useAuth } from '../contexts/AuthContext'

function AdminPanel() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <div>Please login first</div>
  }

  return <div>Welcome {user?.username}</div>
}
```

## 📡 API Integration

### Axios dengan Token

Semua requests ke protected endpoints harus include token:

```javascript
const token = localStorage.getItem('token')

const response = await axios.post(
  `${API_URL}/products`,
  productData,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
)
```

Token secara otomatis ditambahkan di App.jsx untuk semua CRUD operations.

## 🔒 Flow Diagram

```
User Visit App
    ↓
AuthContext checks localStorage for token
    ↓
If token exists → Fetch user data → Set user in context
If no token → user = null, isAuthenticated = false
    ↓
Navbar shows:
  - Login/Register buttons (if not authenticated)
  - Add Product button + User menu (if authenticated)
    ↓
User clicks "Tambah Produk"
    ↓
Check isAuthenticated
  - If false → Redirect to /login
  - If true → Open ProductModal
    ↓
Submit form
    ↓
Send to API with Authorization token
    ↓
Protected endpoint validates token
    ↓
If valid → CRUD operation success
If invalid → Return 401 error
```

## 🛡️ Security Features

1. **Password Hashing** - Gunakan bcrypt
2. **JWT Tokens** - Secure token-based auth
3. **Token Expiration** - 24 jam (configurable)
4. **Protected Routes** - Middleware validasi di backend
5. **CORS** - Prevent unauthorized access
6. **Input Validation** - Validasi di frontend & backend

## 🧪 Testing Authentication

### 1. Test Backend auth

```bash
# Start backend
cd backend
npm run dev

# Test register
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "full_name": "Test User"
  }'

# Output:
# {
#   "message": "Registrasi berhasil",
#   "user": {...},
#   "token": "..."
# }

# Copy token dari response
export TOKEN="your_token_here"

# Test login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Test protected endpoint (get current user)
curl -X GET http://localhost:5000/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Test create product (protected)
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Product",
    "price": 100000,
    "stock": 10
  }'
```

### 2. Test Frontend auth

```bash
# Start frontend
cd frontend
npm run dev

# Open http://localhost:3000 di browser

# Test flow:
1. Klik "Daftar" → Register akun
2. Login dengan akun baru
3. Lihat navbar berubah → nama user muncul
4. Try click "+ Tambah Produk" → Modal terbuka
5. Logout dari menu user
6. Try click "+ Tambah Produk" → Redirect ke login
```

## 📝 User Roles (Future Enhancement)

Sistem support roles untuk future enhancement:

```javascript
// User roles
- 'customer' (default)
- 'admin'
- 'seller' (opsional)

// Check role di frontend
const { user } = useAuth()
if (user?.role === 'admin') {
  // Show admin panel
}

// Check role di backend
const adminMiddleware = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Admin only' })
  }
  next()
}
```

## 🐛 Troubleshooting

### 1. "Token required" Error

**Problem**: 401 Unauthorized saat create/edit/delete produk

**Solution**:
- Check apakah user sudah login
- Verify token ada di localStorage
- Check JWT_SECRET di .env sama di backend

### 2. "Invalid token" Error

**Problem**: Token expired atau tidak valid

**Solution**:
- User perlu login ulang
- Check JWT_EXPIRE di .env (24jam = 86400)
- Verify JWT_SECRET di .env

### 3. CORS Error

**Problem**: `Access to XMLHttpRequest blocked by CORS`

**Solution**:
```javascript
// Di backend server.js, pastikan CORS enabled
app.use(cors({
  origin: 'http://localhost:3000',  
  credentials: true
}))
```

### 4. "Email already registered"

**Problem**: Email sudah terdaftar saat register

**Solution**:
- Gunakan email lain
- Atau check database apakah bisa delete user test

## 📚 Key Files

| File | Purpose |
|------|---------|
| `backend/auth.js` | JWT & password utilities |
| `backend/authRoutes.js` | Auth endpoints |
| `frontend/contexts/AuthContext.jsx` | Auth state management |
| `frontend/components/Login.jsx` | Login page |
| `frontend/components/Register.jsx` | Register page |
| `frontend/components/ProtectedRoute.jsx` | Protected route wrapper |

## 🚀 Next Steps

1. Install dependencies: `npm run install-all`
2. Create users table di Supabase
3. Configure .env files
4. Test register/login di backend
5. Test register/login di frontend
6. Start development: `npm run dev`

## 🔗 Related Documentation

- [AUTH_SETUP.md](AUTH_SETUP.md) - Database & security setup
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - All API endpoints
- [README.md](README.md) - Main documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide

---

**Authentication Ready for Production! 🔐**
