# Deployment Guide - Vercel 🚀

## Overview
Deploy Frontend + Backend ke Vercel dengan serverless functions.

---

## 1️⃣ SETUP AWAL (Sebelum Deploy)

### Frontend
```bash
cd frontend
npm run build  # Test build locally
```

### Backend  
```bash
cd backend
# Pastikan tidak ada error saat import
node api/index.js
```

---

## 2️⃣ DEPLOY BACKEND KE VERCEL

### Langkah 1: Login & Connect Repo
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy dari folder backend
cd backend
vercel
```

### Langkah 2: Set Environment Variables di Vercel Dashboard
1. Buka https://vercel.com/dashboard
2. Pilih project backend-mu
3. Pergi ke **Settings → Environment Variables**
4. Tambahkan variables (copy dari `.env`):
   ```
   SUPABASE_URL = [nilai dari .env]
   SUPABASE_KEY = [nilai dari .env]
   SUPABASE_SERVICE_ROLE_KEY = [nilai dari .env]
   JWT_SECRET = [nilai dari .env]
   NODE_ENV = production
   ```

### Langkah 3: Get Backend URL
- Di Vercel Dashboard, copy Production URL backend
- Format: `https://your-backend-name.vercel.app`

---

## 3️⃣ DEPLOY FRONTEND KE VERCEL

### Langkah 1: Connect & Deploy
```bash
cd frontend
vercel
```

### Langkah 2: Set Environment Variables di Vercel Dashboard
1. Pilih project frontend-mu
2. **Settings → Environment Variables**
3. Tambahkan:
   ```
   VITE_API_URL = https://your-backend-name.vercel.app/api
   ```

### Langkah 3: Redeploy dengan Environment Variable
```bash
vercel --prod
```

---

## ✅ VERIFICATION CHECKLIST

### Backend:
- [ ] Bisa akses: `https://your-backend-name.vercel.app/health`
- [ ] Response: `{ "status": "OK", "message": "Server is running" }`
- [ ] `POST /auth/register` berfungsi
- [ ] `GET /api/products` berfungsi

### Frontend:
- [ ] Bisa buka homepage
- [ ] Login/Register bekerja
- [ ] Bisa lihat produk
- [ ] Bisa add to cart
- [ ] Checkout berfungsi
- [ ] Order history terlihat

---

## 🔧 TROUBLESHOOTING

### Error: "Cannot find module"
- Pastikan di `/api/index.js`, import paths relatif correct
- Jalankan `npm install` di backend folder

### Error: "CORS error"
- Backend sudah ada `cors()` middleware ✓
- Pastikan frontend VITE_API_URL tepat

### Error: "Cannot connect to Supabase"
- Check env variables di Vercel Dashboard sudah set
- Verify SUPABASE_URL dan SUPABASE_KEY benar

### Frontend shows "localhost:5000" errors
- Frontend perlu di-redeploy SETELAH backend deploy
- Pastikan VITE_API_URL env variable set di Vercel

---

## 📝 QUICK REDEPLOY

Setelah ada update:

```bash
# Backend
cd backend
vercel -prod

# Frontend  
cd frontend
vercel --prod
```

---

## 🌐 PRODUCTION FINAL MCC

**Backend URL:** `https://your-backend-name.vercel.app`
**Frontend URL:** `https://your-frontend-name.vercel.app`

Upload credentials safely (jangan push ke Git):
- `.env` (desktop only)
- `.env.production` (template only, no secrets)

Enjoy! 🎉
