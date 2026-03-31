# Pre-Deployment Checklist ✅

Jangan deploy sebelum semua ini done!

## Frontend Checklist

- [ ] **Environment Variable File**
  - [ ] `.env.production` exist dengan VITE_API_URL
  - [ ] `vercel.json` sudah ada

- [ ] **Code Quality**
  - [ ] Tidak ada hardcoded `localhost:5000` (kecuali fallback)
  - [ ] Semua component pakai `import.meta.env.VITE_API_URL`
  - [ ] Build successfully: `npm run build`
  - [ ] No console errors di DevTools

- [ ] **Build Output**
  - [ ] Folder `dist/` ada dan terisi
  - [ ] `index.html` di dalam `dist/`

- [ ] **Testing Locally**
  - [ ] `npm run dev` berfungsi
  - [ ] Login/Register works
  - [ ] Produk bisa ditampilkan
  - [ ] Cart & Checkout works
  - [ ] Order history loads

## Backend Checklist

- [ ] **Environment Variable File**
  - [ ] `.env.production` ada sebagai template
  - [ ] `vercel.json` sudah ada
  - [ ] `/api/index.js` exist

- [ ] **Code Quality**
  - [ ] Tidak ada `server.js` import errors
  - [ ] Semua dependencies di `package.json`
  - [ ] `"type": "module"` di package.json
  - [ ] Middleware setup benar (CORS, JSON parser)

- [ ] **Routes Check**
  - [ ] `/health` endpoint works
  - [ ] `/auth/*` routes exist
  - [ ] `/api/products` routes exist
  - [ ] `/api/orders` routes exist

- [ ] **Database**
  - [ ] Supabase URL valid
  - [ ] Tables exist: `products`, `users`, `orders`, `order_items`
  - [ ] RLS policies configured

- [ ] **Testing Locally**
  - [ ] `npm start` atau `node server.js` works
  - [ ] API endpoints responding
  - [ ] Database queries berhasil
  - [ ] No console errors

## Pre-Deployment System

- [ ] **Git**
  - [ ] `.gitignore` contains `.env` (no secrets pushed)
  - [ ] Committed semua perubahan

- [ ] **Credentials**
  - [ ] Supabase URL copied
  - [ ] Supabase Key copied
  - [ ] Service Role Key copied
  - [ ] JWT_SECRET ready

- [ ] **Infrastructure**
  - [ ] Vercel account active
  - [ ] GitHub repo connected (optional tapi recommended)
  - [ ] Domain ready (atau pakai Vercel domain)

## Deployment Order

1. **Deploy Backend FIRST**
   - Get the Vercel URL
   - Set env variables
   - Verify endpoints work

2. **Deploy Frontend SECOND**
   - Set VITE_API_URL to backend Vercel URL
   - Redeploy to pick up env variables
   - Test user flows

3. **Verify Production**
   - Test login
   - Test create order
   - Check database has records
   - Test success page shows

## Rollback Plan

If something broke:

```bash
# Backend - revert to previous
vercel rollback

# Frontend - revert to previous  
vercel rollback

# Or redeploy current code
vercel --prod
```

---

**Ready to deploy?** ✨
