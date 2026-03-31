# Cara Dapat Environment Variables untuk Vercel 🔐

## 1. SUPABASE_URL & SUPABASE_KEY

### Step 1: Buka Supabase Dashboard
- Go: https://app.supabase.com
- Click project: **gerabah-ukt**
- Go to: **Settings → API**

### Step 2: Copy Values
Cari section "Project API keys"

```
✅ Project URL          → SUPABASE_URL
✅ Anon public key      → SUPABASE_KEY  
✅ Service role secret  → SUPABASE_SERVICE_ROLE_KEY ⚠️ PENTING!
```

**PENTING:** Ada 3 keys di situ, pastikan ambil yang tepat!

---

## 2. SUPABASE_SERVICE_ROLE_KEY ⚠️

### Cari di Supabase:
- Go: https://app.supabase.com → gerabah-ukt
- **Settings → API**
- Scroll ke "Service role secret"
- **Copy** (jangan share ke public!)

### Kenapa penting?
- Regular key = pake RLS (restricted)
- Service role = bypass RLS (untuk admin operations)
- Backend WAJIB pakai service role untuk registrasi & orders!

---

## 3. JWT_SECRET

### Generate random secret:
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Atau pakai online generator
https://generate-random.org/
```

Minimal 32 characters, mix huruf + angka + simbol.

---

## 4. VERCEL ENVIRONMENT SETUP

### Di Vercel Dashboard:

**Go to:** https://vercel.com/dashboard

1. Select **gerabah-ukt** project (backend)
2. Click **Settings**
3. Left sidebar → **Environment Variables**
4. Click **Add New**

Paste each variable:

| Variable Name | Value | Scope |
|---|---|---|
| SUPABASE_URL | `https://xxxxx.supabase.co` | Production |
| SUPABASE_KEY | `eyJhbG...` (anon key) | Production |
| SUPABASE_SERVICE_ROLE_KEY | `eyJhbG...` (service role) | Production |
| JWT_SECRET | `abcdef...` (random 32+) | Production |
| NODE_ENV | `production` | Production |

5. Click **"Save"** untuk setiap variable

---

## 5. VERIFIKASI & REDEPLOY

Setelah set variables:

```bash
cd backend
vercel --prod
```

Tunggu hingga ready, then test:

```bash
curl https://your-backend.vercel.app/health
```

Expected output:
```json
{
  "status": "healthy",
  "timestamp": "2026-03-31T10:00:00.000Z",
  "environment": {
    "hasSupabaseUrl": true,
    "hasSupabaseKey": true,
    "hasJwtSecret": true
  }
}
```

Kalau `hasSupabase*` masih `false` = env variables belum tersetel dengan benar di Vercel!

---

## ⚠️ COMMON MISTAKES

❌ Salah menggunakan Anon Key sebagai Service Role Key
❌ Copy URL tanpa protokol `https://`
❌ Ada space/newline di awal/akhir value
❌ Paste ke Production, tapi hanya Production yang perlu
❌ Lupa set `NODE_ENV=production`

---

## 🔄 KALO BINGUNG

1. **Pull current environment dari Vercel:**
   ```bash
   cd backend
   vercel env pull
   ```
   
2. **Check file `.env` local:**
   ```bash
   cat .env
   ```
   
3. **Compare dengan apa yang di Vercel Dashboard**

4. **Jika berbeda, tambah/update di Vercel Dashboard**

5. **Redeploy:**
   ```bash
   vercel --prod
   ```

---

## ✅ SUKSES INDICATORS

- ✅ `/health` endpoint return 200 OK
- ✅ `hasSupabaseUrl`, `hasSupabaseKey`, `hasJwtSecret` = true
- ✅ Frontend bisa login
- ✅ Backend create order tanpa error
- ✅ Supabase console lihat data orders/order_items

**Jika semua ✅, deploy BERHASIL!** 🎉
