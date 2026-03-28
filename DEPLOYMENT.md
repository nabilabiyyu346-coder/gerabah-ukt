# Deployment Guide - Render.com

Panduan lengkap untuk deploy Toko Gerabah ke Render.com

## 🚀 Deploy Backend

### Step 1: Persiapan

1. Push semua code ke GitHub repository
2. Pastikan `.env` file tidak di-commit (sudah ada di `.gitignore`)
3. Buat akun di [render.com](https://render.com)

### Step 2: Buat Web Service untuk Backend

1. Login ke Render Dashboard
2. Klik **New +** → **Web Service**
3. Connect GitHub repository Anda
4. Pilih repository `gerabah-ukt`

### Step 3: Konfigurasi Backend

Isi form dengan data berikut:

| Field | Value |
|-------|-------|
| Name | `gerabah-backend` |
| Environment | `Node` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | `Free` (atau sesuai kebutuhan) |

### Step 4: Environment Variables

Pada bagian **Environment Variables**, tambahkan:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
PORT=10000
```

*Note: Gunakan port range yang disediakan Render*

### Step 5: Deploy

Klik **Create Web Service** dan tunggu deployment selesai.

**Backend URL**: `https://gerabah-backend.onrender.com/api`

---

## 🚀 Deploy Frontend

### Step 1: Build Preparation

Update `.env` file di frontend:

```
VITE_API_URL=https://gerabah-backend.onrender.com/api
```

Push ke GitHub

### Step 2: Buat Static Site untuk Frontend

1. Di Render Dashboard, klik **New +** → **Static Site**
2. Connect GitHub repository yang sama
3. Pilih repository `gerabah-ukt`

### Step 3: Konfigurasi Frontend

Isi form dengan data berikut:

| Field | Value |
|-------|-------|
| Name | `gerabah-frontend` |
| Build Command | `cd frontend && npm install && npm run build` |
| Publish Directory | `frontend/dist` |

### Step 4: Deploy

Klik **Create Static Site** dan tunggu deployment selesai.

**Frontend URL**: `https://gerabah-frontend.onrender.com`

---

## ✅ Testing Setelah Deploy

### 1. Test Backend

```bash
curl https://gerabah-backend.onrender.com/api/products
```

Should return: `[]` atau list of products

### 2. Test Frontend

Buka di browser: `https://gerabah-frontend.onrender.com`

### 3. Test CRUD Operations

- Tambah produk baru
- Edit produk
- Hapus produk
- Refresh page dan verifikasi data persisten

---

## 🔍 Monitoring & Logs

### Backend Logs

1. Buka Web Service di Render Dashboard
2. Klik **Logs** untuk melihat runtime logs
3. Check untuk error messages

### Frontend Logs

1. Buka Static Site di Render Dashboard
2. Klik **Deployment** untuk melihat build logs

---

## 🐛 Troubleshooting Deployment

### Build Gagal

**Error: Cannot find module**
- Pastikan `package.json` di root direktori
- Atau update Build Command sesuai struktur folder

**Solusi:**
```
cd backend && npm install
cd frontend && npm install && npm run build
```

### Backend Error (timeout)

**Check:**
- Supabase credentials di environment variables sudah benar?
- Network access dari Render ke Supabase diizinkan?

### Frontend tidak bisa connect ke Backend

**Check:**
- Backend URL di `VITE_API_URL` sudah benar?
- Backend sudah running dan accessible?
- CORS enabled di backend?

---

## 🔐 Production Checklist

- [x] Environment variables sudah dikonfigurasi
- [x] Database schema sudah dibuat di Supabase
- [x] CORS policy sudah diset (production domain)
- [x] Error handling sudah implementasi
- [x] HTTPS enabled (Render provides free SSL)
- [ ] Enable RLS di Supabase tables
- [ ] Setup database backups
- [ ] Monitor error logs regularly
- [ ] Test all CRUD operations
- [ ] Test mobile responsiveness

---

## 💡 Tips & Tricks

### Automatic Deploy

Render akan auto-deploy ketika ada push ke main/master branch

### Custom Domain

1. Di Render Dashboard → Static Site Settings
2. Klik **Custom Domain**
3. Follow instructions untuk setup domain

### Database Backup

Di Supabase:
1. Settings → Backup
2. Enable automatic backups
3. Set backup frequency

### Environment Variables Updates

Setelah update env variables:
1. Klik **Manual Deploy** di Render Dashboard
2. Atau push code baru ke GitHub (auto-redeploy)

---

## 📞 Support

Jika ada masalah:
1. Check Render logs
2. Check Supabase status
3. Test locally terlebih dahulu
4. Verify CORS settings

---

**Happy Deploying! 🎉**
