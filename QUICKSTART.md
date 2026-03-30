# Toko Gerabah - Quick Start Guide

Panduan cepat untuk memulai development Toko Gerabah

## 📦 Prerequisites

Pastikan sudah terinstall:
- Node.js v18+ ([Download](https://nodejs.org/))
- npm v9+
- Git

Verifikasi dengan:
```bash
node --version
npm --version
```

## 🚀 Quick Start (Development)

### 1. Clone/Setup Folder

```bash
cd c:\gerabah-ukt
```

### 2. Install Dependencies

#### Opsi A: Install semua sekaligus
```bash
npm run install-all
```

#### Opsi B: Install manual

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

### 3. Setup Supabase

1. Buat akun di [supabase.com](https://supabase.com)
2. Buat project baru
3. Jalankan SQL queries dari:
   - [DATABASE_SETUP.md](DATABASE_SETUP.md) - untuk products table
   - [AUTH_SETUP.md](AUTH_SETUP.md) - untuk users table
4. Copy credentials:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`

### 4. Configure Environment Variables

**Backend (.env):**
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=86400
PORT=5000
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
```

### 5. Run Development Server

#### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```
Backend running at: `http://localhost:5000`

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```
Frontend running at: `http://localhost:3000`

#### Or run both together:
```bash
npm run dev
```
(Requires `concurrently` package)

## 🧪 Testing

### Test Backend API

```bash
# Get all products (public endpoint)
curl http://localhost:5000/api/products

# Register new user
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "full_name": "Test User"
  }'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Save token dari response, kemudian:

# Get current user
curl http://localhost:5000/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create product (protected endpoint)
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test Product",
    "price": 50000,
    "stock": 10
  }'
```

### Test Frontend

Buka browser: `http://localhost:3000`

Try:
- ✅ Click "Daftar" → Register akun
- ✅ Login dengan akun baru
- ✅ Lihat navbar → username muncul
- ✅ Click "+ Tambah Produk" → Modal terbuka
- ✅ Tambah produk baru
- ✅ Edit produk
- ✅ Logout dari user menu

## 📁 File Structure

```
gerabah-ukt/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProductModal.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── routes.js
│   ├── package.json
│   └── .env
├── README.md
├── DEPLOYMENT.md
├── DATABASE_SETUP.md
└── QUICKSTART.md
```

## 🌐 Production Build

### Build Frontend
```bash
cd frontend
npm run build
# Output di folder: frontend/dist
```

### Build Backend
Backend doesn't need build, just deploy Node.js files

## 📚 Useful Commands

```bash
# Frontend Commands
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview build

# Backend Commands
npm run dev          # Development with nodemon
npm start            # Production run

# Root Commands
npm run install-all  # Install all dependencies
npm run dev          # Run both frontend & backend
npm run build        # Build both
```

## 🐛 Debugging

### Backend Logs
- Check terminal output saat `npm run dev`
- Error biasanya berkaitan Supabase connection

### Frontend Logs
- Open browser DevTools (F12)
- Check Console tab untuk errors
- Check Network tab untuk API calls

### Common Issues

**Error: Cannot GET /api/products**
- Backend belum running
- Check port 5000 sudah available

**Error: Supabase connection failed**
- Check .env credentials
- Verify table "products" sudah dibuat

**Error: CORS error**
- Backend CORS config perlu di-update
- Check server.js `cors()` middleware

## 📞 Need Help?

1. Check [README.md](README.md) untuk dokumentasi lengkap
2. Check [DATABASE_SETUP.md](DATABASE_SETUP.md) untuk database setup
3. Check [DEPLOYMENT.md](DEPLOYMENT.md) untuk deployment guide

## ✅ Development Checklist

- [ ] Node.js v18+ terinstall
- [ ] Supabase project dibuat
- [ ] Database tables dibuat (products & users)
- [ ] .env files sudah dikonfigurasi
- [ ] Backend running di port 5000
- [ ] Frontend running di port 3000
- [ ] Can register new account
- [ ] Can login
- [ ] Can see user info in navbar
- [ ] Can create product
- [ ] Can read products
- [ ] Can update product
- [ ] Can delete product
- [ ] Can logout

## 🎯 Next Steps

1. Tes semua CRUD operations
2. Customize styling sesuai brand
3. Add more features (search, filter, categories, etc.)
4. Deploy ke Render.com
5. Monitor logs dan performance

---

**Happy Coding! 🚀**
