# Token Invalid 10 Menit - Diagnosis & Fix ✅

## 🔍 ROOT CAUSE ANALYSIS

Likely culprit: **Supabase Connection Failure** 

When backend starts:
```
❌ Connection test failed: TypeError: fetch failed
```

This causes:
1. `/auth/me` endpoint fails
2. Frontend receives error
3. Frontend auto-logout (clear token)
4. → Session ends in ~10 menit ✗ (probably time of first request failure)

---

## ✅ FIXES APPLIED

### 1️⃣ Frontend (`AuthContext.jsx`)
- ✓ Don't auto-clear token on network error
- ✓ Keep token, only set user=null
- ✓ Added auto-refresh every 12 hours
- ✓ 5 second timeout on `/auth/me` request

### 2️⃣ Backend (`auth.js`)
- ✓ Fixed JWT_EXPIRE parsing with `parseInt()`
- ✓ Added logging to token generation
- ✓ Better error messages

### 3️⃣ Backend (`authRoutes.js`)
- ✓ Improved `/auth/me` endpoint logging
- ✓ Better error reporting

### 4️⃣ Config Files
- ✓ Added JWT_EXPIRE to `.env.production`
- ✓ Changed local NODE_ENV to `development` (was production)

---

## 🧪 TEST RESULTS

JWT Configuration: ✅ CORRECT
```
JWT_EXPIRE=86400 seconds = 1440 minutes
= 24 hours
Token should NOT expire in 10 minutes!
```

Token generation test: ✅ WORKING
```
Generated token expires: 2026-04-01 (24 hours from now)
Verification: ✅ Successfully verified
```

---

## 🚀 NEXT STEPS

### Step 1: Diagnose Supabase Connection
```bash
cd backend
node test-supabase.js
```

Expected output:
```
✅ Connection successful!
✓ Found X user(s)
```

If fail: Check
- [ ] Supabase URL valid
- [ ] Supabase Key valid
- [ ] Network/VPN not blocking
- [ ] Credentials not expired

### Step 2: Test Locally
```bash
# Terminal 1
cd backend
npm start
# Should show: ✓ Server running on http://localhost:5000

# Terminal 2
cd frontend
npm run dev
# Should show: ➜ Local: http://localhost:3000
```

### Step 3: Test Login & Token Persistence
1. Open: http://localhost:3000
2. Register/Login new account
3. Stay logged in for 15+ minutes
4. Refresh page (F5)
5. Should still be logged in ✓

### Step 4: If Token Still Expires Early
Check browser console (F12):
```
[AuthContext] Auth check failed: ...
```

This indicates `/auth/me` endpoint is failing.

---

## 📋 VERIFICATION CHECKLIST

Local Testing:
- [ ] `npm start` (backend) - no errors
- [ ] `npm run dev` (frontend) - no errors
- [ ] Register/login works
- [ ] Token stays valid after page refresh
- [ ] Token valid 24+ hours (or as configured)

Supabase Diagnostics:
- [ ] `node test-supabase.js` runs successfully
- [ ] Get correct number of users
- [ ] No "fetch failed" errors

Production (Vercel):
- [ ] `/health` endpoint works
- [ ] `SUPABASE_URL`, `KEY`, `SERVICE_ROLE_KEY` set in Vercel
- [ ] `JWT_EXPIRE` set to `86400` in Vercel
- [ ] `/auth/me` endpoint returns user data after login
- [ ] Token valid 24+ hours

---

## 🆘 IF PROBLEM PERSISTS

### Check Backend Logs (Vercel)
1. Go: https://vercel.com/dashboard
2. Select backend project
3. **Deployments** → Latest → **Logs**
4. Search for errors in `/auth/me` endpoint

### Check Frontend Logs
Open DevTools (F12):
1. **Console** tab
2. Search: `AuthContext`
3. See what errors are logged

### Manual Token Test
```bash
# Get token from login
TOKEN="your_token_here"

# Test /auth/me
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/auth/me

# Check response
# Should be: {"user": {...}}
# If 500 error: backend/Supabase issue
```

---

## 📝 CONFIGURATION REFERENCE

JWT Settings correct at:
```
Backend local:        ✓ JWT_EXPIRE=86400
Backend production:   ✓ JWT_EXPIRE=86400 (in Vercel env vars)
Frontend:            ✓ No JWT_EXPIRE needed (client doesn't generate tokens)
```

### Vercel Environment Variables (Backend)

Must set:
```
SUPABASE_URL              = https://xxxxx.supabase.co
SUPABASE_KEY              = eyJhbGc... (anon key)
SUPABASE_SERVICE_ROLE_KEY = eyJhbGc... (service role)
JWT_SECRET                = your-secret-key
JWT_EXPIRE                = 86400
NODE_ENV                  = production
```

---

## 🎯 EXPECTED BEHAVIOR AFTER FIXES

✅ Token valid 24 hours (or configured duration)
✅ Token persists after page refresh
✅ Network error ≠ automatic logout
✅ Token only clears on:
  - Explicit logout
  - Token genuinely expired (24+ hours)
  - User changes in browser (clear localStorage)

---

Ready to test? Run:
```bash
node test-supabase.js
npm start (backend)
npm run dev (frontend)
```

Report results! 🚀
