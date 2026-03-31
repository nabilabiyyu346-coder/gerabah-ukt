# Vercel Crash Fix - Complete Checklist ✅

Status: "This Serverless Function has crashed" but infrastructure OK

---

## 🎯 LANGKAH 1: VERIFY VERCEL ENV VARIABLES

### Go to: https://vercel.com/dashboard

1. **Select Backend Project** → gerabah-ukt
2. **Settings** → **Environment Variables**
3. **Check setiap variable:**
   - [ ] `SUPABASE_URL` - Must start with `https://`
   - [ ] `SUPABASE_KEY` - Long token string
   - [ ] `SUPABASE_SERVICE_ROLE_KEY` - MUST contain underscore (_)
   - [ ] `JWT_SECRET` - Random string, 32+ characters
   - [ ] `NODE_ENV` - Set to `production`

### ⚠️ COMMON MISTAKES:
- ❌ Value has quotes: `"https://..."`  → REMOVE quotes
- ❌ Extra spaces at start/end → TRIM
- ❌ Wrong key (using anon instead of service_role) → CHECK again
- ❌ Missing variables → ALL 5 MUST exist

---

## 🎯 LANGKAH 2: REDEPLOY WITH NEW CODE

```bash
cd c:\gerabah-ukt\backend
git add -A
git commit -m "Fix serverless function initialization"
vercel --prod
```

Wait for: ✓ Deployment successful

---

## 🎯 LANGKAH 3: TEST ENDPOINTS

### Test Health Check:
```bash
curl https://your-backend.vercel.app/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "ts": "2026-03-31T10:00:00.000Z",
  "env": {
    "supabase": true,
    "jwt": true
  }
}
```

If shows `"supabase": false` or `"jwt": false` → **env variables not set correctly**

### Test Root Endpoint:
```bash
curl https://your-backend.vercel.app/
```

**Expected:**
```json
{
  "message": "🏺 Toko Gerabah API",
  "version": "1.0.0"
}
```

### Test Products Endpoint:
```bash
curl https://your-backend.vercel.app/api/products
```

**Expected:** JSON array of products (or `[]` if none exist)

---

## 🎯 LANGKAH 4: CHECK VERCEL LOGS

### In Vercel Dashboard:

1. Select backend project
2. **Deployments** tab (top)
3. Click latest deployment
4. **Logs** tab (scroll to "Function Logs")
5. Cari error message yang muncul

### Common Log Errors:

**"Cannot find module"**
→ Dependency missing or import path wrong
→ Run: `npm install` locally, commit, redeploy

**"SUPABASE_URL is undefined"**
→ Env variable tidak set
→ Set di Vercel Dashboard, redeploy

**"Connection refused"**
→ Supabase creds invalid
→ Verify credentials di Supabase Dashboard

---

## 🎯 LANGKAH 5: IF STILL CRASHES

### Pull environment dari Vercel Pro confirm:
```bash
cd backend
vercel env pull
```

Check file `.env`:
```bash
cat .env
```

Compare dengan apa yg di database (Supabase Dashboard):
- Settings → API → Project URL
- Settings → API → Anon public key
- Settings → API → Service role secret

Kalo ada beda, update di Vercel Dashboard.

### Clear Vercel Cache:
```bash
# Remove Vercel cache file
rm -r .vercel

# Redeploy
vercel --prod
```

---

## 🚨 ADVANCED DEBUGGING

### Option 1: Test Supabase Connection Directly

Create file `test-supabase.js`:
```javascript
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_KEY

if (!url || !key) {
  console.error('Missing credentials')
  process.exit(1)
}

const client = createClient(url, key)
const { data, error } = await client.from('products').select('id').limit(1)

if (error) {
  console.error('❌ Connection failed:', error.message)
} else {
  console.log('✅ Connection OK', data)
}
```

Run:
```bash
cd backend
node test-supabase.js
```

### Option 2: Test JWT Secret

Create file `test-jwt.js`:
```javascript
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const secret = process.env.JWT_SECRET

if (!secret || secret.length < 10) {
  console.error('❌ JWT_SECRET invalid or missing')
  process.exit(1)
}

const token = jwt.sign({ id: 'test' }, secret, { expiresIn: '1h' })
const decoded = jwt.verify(token, secret)

console.log('✅ JWT working:', decoded)
```

Run:
```bash
cd backend
node test-jwt.js
```

---

## ✅ VERIFICATION CHECKLIST

Backend Vercel:
- [ ] `/health` endpoint returns 200 OK
- [ ] `"supabase": true` in health response
- [ ] `"jwt": true` in health response
- [ ] `/api/products` returns data or empty array
- [ ] No 500 errors in Vercel logs

Frontend Vercel:
- [ ] Set `VITE_API_URL` to backend Vercel URL
- [ ] Redeployed frontend after setting env var
- [ ] frontend can reach backend (test in browser console)

Full Flow:
- [ ] Can register new user
- [ ] Can login
- [ ] Can see products
- [ ] Can add to cart
- [ ] Can checkout
- [ ] Order appears in Supabase

---

## 📞 JIKA MASIH STUCK

Send screenshot of:
1. Vercel logs (Deployments → Latest → Logs)
2. Response dari `/health` endpoint
3. Supabase Project Settings → API (block out sensitive keys)
4. Your .env local (block out keys)

---

### 🟢 SUCCESS INDICATORS:

✅ All health checks pass
✅ Env variables show: supabase=true, jwt=true
✅ No 500 errors in Vercel logs
✅ Frontend can communicate with backend
✅ Full checkout flow works end-to-end

**Jika SEMUA ✅ = DEPLOY BERHASIL!** 🎉
