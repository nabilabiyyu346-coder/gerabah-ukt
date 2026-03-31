# Vercel Deployment Troubleshooting 🔧

## "This Serverless Function has crashed" Error

### Penyebab Umum:

1. **❌ Missing Environment Variables** (PALING SERING!)
2. **❌ Supabase credentials tidak valid**
3. **❌ Import/syntax errors**
4. **❌ Dependencies tidak terinstall**

---

## 🔍 Step-by-Step Fix

### 1️⃣ CHECK ENVIRONMENT VARIABLES DI VERCEL DASHBOARD

**Go to:** https://vercel.com/dashboard/gerabah-ukt/backend

1. Click **Settings**
2. Go to **Environment Variables**
3. **Add these variables** (copy dari local `.env`):

```
SUPABASE_URL          → https://xxxxxxxxxxx.supabase.co
SUPABASE_KEY          → eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY → eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (ADA UNDERSCORE)
JWT_SECRET            → your_secret_key_min_32_chars
NODE_ENV              → production
```

**⚠️ PENTING:** Use **Supabase Service Role Key**, bukan biasa Key!

Cara dapat:
- Go: https://app.supabase.com → project gerabah-ukt → Settings → API
- Copy: **`service_role` secret** (jangan anon key)

### 2️⃣ CHECK API KEY FORMAT

Vercel env variables harus:
- ✅ Tidak ada quotes `""`
- ✅ Tidak ada spasi di awal/akhir
- ✅ Lengkap (jangan potong)

Verify dengan curl:
```bash
curl https://your-backend-name.vercel.app/health
```

Expected: JSON dengan status OK

### 3️⃣ DEPLOY ULANG SETELAH SET ENV VARIABLES

```bash
cd backend
vercel --prod
```

Tunggu hingga "✓ Ready" muncul

### 4️⃣ TEST ENDPOINTS

Setelah deploy ulang, cek:

```bash
# Health check
curl https://your-backend-name.vercel.app/health

# Root endpoint
curl https://your-backend-name.vercel.app/

# Get products
curl https://your-backend-name.vercel.app/api/products
```

Semua harus return JSON, bukan error 500

---

## 🐛 DEBUG MODE

### Check Logs di Vercel:
1. Go: https://vercel.com → select backend project
2. **Deployments** tab
3. Click latest deployment
4. **Logs** tab (bawah page)
5. Lihat errors yang muncul

### Tipe Error Umum:

**Error: "Cannot find module '@supabase/supabase-js'"**
- Solution: `npm install` di backend folder, push ke Git

**Error: "SUPABASE_URL is undefined"**
- Solution: Set env variables (lihat Step 1️⃣)

**Error: "jwt secret does not match"**
- Solution: Verify JWT_SECRET sama di production & local

**Error: "CORS error"**
- Already fixed in code ✓

---

## ✅ QUICK CHECKLIST

- [ ] Set semua env variables di Vercel Dashboard
- [ ] Frontend VITE_API_URL = `https://your-backend-name.vercel.app/api`
- [ ] Run `vercel --prod` di backend folder
- [ ] Test `/health` endpoint
- [ ] Frontend di-redeploy dengan env variable baru
- [ ] Test login dari frontend
- [ ] Test create order

---

## 🚨 JIKA MASIH ERROR

### Clear Vercel Cache & Rebuild:

```bash
cd backend

# Clear cache
vercel env pull  # Verify env variables loaded locally

# Force rebuild
rm -r .vercel
vercel --prod
```

### Atau Pull Environment dari Production:

```bash
vercel env pull .env.local
```

Then check `.env.local` for missing values.

---

## 📝 PRODUCTION ENV VARIABLES REFERENCE

Copy-paste ini ke Vercel Dashboard Environment Variables:

```
Key: SUPABASE_URL
Value: https://your-project.supabase.co

Key: SUPABASE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Key: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Key: JWT_SECRET
Value: your_very_long_random_secret_key

Key: NODE_ENV
Value: production
```

---

## 🎯 FINAL TEST

Frontend akses: `https://your-frontend-name.vercel.app`

Test flow:
1. Register new account
2. Login
3. Add product (jika admin)
4. Add to cart
5. Checkout
6. Check order history

Jika semua works = ✅ Deploy sukses!
