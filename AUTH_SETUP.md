# User Authentication - Supabase Setup

Panduan setup authentication di Supabase untuk Toko Gerabah

## 🗄️ Create Table: Users

### SQL Query

Jalankan SQL query berikut di Supabase:

```sql
-- Create users table
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

-- Create index untuk faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text OR role = 'admin');

CREATE POLICY "Public can insert new users (registration)" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text OR role = 'admin');
```

## 🔑 Import Users Table

Jika SQL tidak bisa langsung dijalankan:

1. Di Supabase Dashboard → **SQL Editor**
2. Klik **New Query**
3. Paste SQL di atas
4. Klik **RUN**

## 📊 Table Schema: Users

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, auto-generated |
| `email` | VARCHAR | Email address (unique) |
| `username` | VARCHAR | Username for login (unique) |
| `password_hash` | VARCHAR | Hashed password (never store plain) |
| `full_name` | VARCHAR | User's full name |
| `profile_picture_url` | TEXT | Avatar/profile picture URL |
| `role` | VARCHAR | User role (customer, admin) |
| `is_active` | BOOLEAN | Account status |
| `last_login` | TIMESTAMP | Last login time |
| `created_at` | TIMESTAMP | Account created time (auto) |
| `updated_at` | TIMESTAMP | Last update time (auto) |

## 🔐 Password Security

**PENTING**: Jangan pernah menyimpan password plain text!

Gunakan **bcrypt** untuk hashing:

```bash
npm install bcrypt
```

### Password Hashing (Backend)
```javascript
const bcrypt = require('bcrypt')

// Hash password saat register
const hashedPassword = await bcrypt.hash(password, 10)

// Verify password saat login
const isValid = await bcrypt.compare(password, hashPassword)
```

## 🔄 Sample Users

Masukkan data sample (pastikan password di-hash):

```sql
-- Note: Password hashes di bawah adalah untuk demo saja
-- Gunakan bcrypt.hash() di aplikasi untuk generate real hashes

INSERT INTO users (email, username, password_hash, full_name, role) VALUES
(
  'admin@gerabah.com',
  'admin',
  '$2b$10$example_hashed_password_1',
  'Admin Toko',
  'admin'
),
(
  'customer@example.com',
  'customer1',
  '$2b$10$example_hashed_password_2',
  'John Customer',
  'customer'
),
(
  'user@gerabah.com',
  'user123',
  '$2b$10$example_hashed_password_3',
  'Jane User',
  'customer'
);
```

## 🔑 JWT Authentication

### JWT Token Structure

```
Header.Payload.Signature

Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "id": "user-uuid",
  "email": "user@example.com",
  "username": "username",
  "role": "customer",
  "iat": 1234567890,
  "exp": 1234571490
}

Signature: HMACSHA256(header + payload, secret_key)
```

### Token Expiration

```javascript
// Access Token: 24 jam
const ACCESS_TOKEN_EXPIRE = 24 * 60 * 60

// Refresh Token: 7 hari (opsional)
const REFRESH_TOKEN_EXPIRE = 7 * 24 * 60 * 60
```

## 📝 API Endpoints untuk Auth

### 1. Register

```
POST /auth/register

Body:
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "full_name": "Full Name"
}

Response (201):
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "username",
  "full_name": "Full Name",
  "role": "customer",
  "token": "jwt_token_here"
}
```

### 2. Login

```
POST /auth/login

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "username",
  "full_name": "Full Name",
  "role": "customer",
  "token": "jwt_token_here"
}
```

### 3. Logout

```
POST /auth/logout

Headers:
{
  "Authorization": "Bearer jwt_token_here"
}

Response (200):
{
  "message": "Logout berhasil"
}
```

### 4. Get Current User

```
GET /auth/me

Headers:
{
  "Authorization": "Bearer jwt_token_here"
}

Response (200):
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "username",
  "full_name": "Full Name",
  "role": "customer"
}
```

## 🔒 Middleware Authentication

Middleware untuk protect routes yang memerlukan login:

```javascript
// Backend: auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'Token required' })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    req.userRole = decoded.role
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// Protect route
app.get('/api/protected-route', authMiddleware, (req, res) => {
  // Only accessible with valid token
})
```

## 🧪 Testing Auth Endpoints

### Register User

```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "full_name": "Test User"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Current User

```bash
curl -X GET http://localhost:5000/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Logout

```bash
curl -X POST http://localhost:5000/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔐 Environment Variables

Update `.env` backend dengan:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_secret_key_here_make_it_random
JWT_EXPIRE=86400
PORT=5000
```

Generate random JWT_SECRET:

```bash
# Di terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📚 Frontend Auth Context

State management untuk authentication:

```javascript
// Frontend: AuthContext
const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    // Login logic
  }

  const register = async (email, username, password, fullName) => {
    // Register logic
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
```

## ✅ Security Checklist

- [x] Use HTTPS in production
- [x] Hash passwords dengan bcrypt
- [x] Store token di localStorage (atau cookie)
- [x] Validate input di backend
- [x] Use JWT dengan expiration
- [x] Enable CORS dengan allowed origins
- [x] Protect sensitive endpoints
- [x] Log security events
- [ ] Implement rate limiting
- [ ] Implement 2FA (optional)

## 🆘 Troubleshooting

### Unique Constraint Error

**Problem**: `duplicate key value violates unique constraint`

**Solution**:
1. Email/username sudah ada di database
2. Check dengan query: `SELECT * FROM users WHERE email = 'email@example.com'`
3. Delete atau gunakan email lain

### Invalid Token Error

**Problem**: `Invalid token`

**Solution**:
1. Token expired setelah 24 jam
2. User perlu login ulang
3. Check JWT_SECRET di .env

### CORS Error

**Problem**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Check CORS middleware di backend
2. Ensure frontend URL allowed
3. Check credentials mode di frontend fetch

---

**Authentication Ready! 🔐**
