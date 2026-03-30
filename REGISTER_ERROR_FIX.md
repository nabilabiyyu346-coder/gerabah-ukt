# Mengatasi Register Error: Row-Level Security (RLS)

## Error yang Muncul

```
{
  code: '42501',
  message: 'new row violates row-level security policy for table "users"'
}
```

## Penyebab

RLS (Row-Level Security) policy pada tabel `users` mencegah insert dari unauthenticated client. Perlu menggunakan **Service Role Key** untuk bypass RLS saat registration.

## Solusi

### Step 1: Ambil Service Role Key dari Supabase

1. Buka [Supabase Dashboard](https://app.supabase.com)
2. Login ke project Anda
3. Ke **Settings** → **API**
4. Cari section **Service Role** 
5. Copy **`Service Role Key`** (jangan copy anon key!)

### Step 2: Update Backend .env

Edit `backend/.env`:

```env
SUPABASE_URL=https://mkulloawaqfqxsrakhje.supabase.co
SUPABASE_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh...
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=86400
PORT=5000
```

**⚠️ PENTING**: 
- Service Role Key LEBIH POWERFUL dari anon key
- Jangan share di public/frontend!
- Hanya gunakan di backend .env

### Step 3: Restart Backend

```bash
# Kill process lama
Get-Process | Where-Object { $_.ProcessName -like "*node*" } | Stop-Process -Force

# Jalankan ulang dari root directory
cd c:\gerabah-ukt
npm run dev
```

### Step 4: Test Register

1. Buka http://localhost:3000/register
2. Isi form dan submit
3. Seharusnya register berhasil sekarang! ✅

## Teknis Penjelasan

```javascript
// db.js
export const supabase = createClient(url, SUPABASE_KEY)      // anon key - dengan RLS
export const supabaseAdmin = createClient(url, SERVICE_KEY)  // service role - bypass RLS

// authRoutes.js - Register
const { data: newUser } = await supabaseAdmin.from('users').insert([...])  // ✅ Bisa insert
```

## Checklist

- [ ] Sudah copy Service Role Key dari Supabase
- [ ] Sudah update `backend/.env` dengan key
- [ ] Sudah restart backend server
- [ ] Test register di frontend
- [ ] Registrasi berhasil! 🎉

## Troubleshooting

**Masih error 42501?**
- Pastikan .env file sudah disave
- Pastikan backend sudah di-restart
- Check console backend untuk error message lebih detail

**Bingung cari Service Role Key?**
- Di dashboard Supabase, cari **Settings** → **API**
- Di section **Project API Keys**, ada dua key:
  - **anon public**: Untuk frontend (terbatas, ada RLS)
  - **service_role secret**: Untuk backend (powerful, bypass RLS)
- Gunakan yang **service_role secret**

**Key tidak muncul?**
- Verify Anda sudah login ke dashboard
- Verify Anda ke project yang benar
- Refresh page
