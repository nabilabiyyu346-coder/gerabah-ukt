# Toko Gerabah - Pottery Shop Website

Website marketplace toko gerabah dengan fitur CRUD lengkap, menggunakan React-Vite, Node.js, dan Supabase.

## 📋 Fitur

✅ **CRUD Operations** - Create, Read, Update, Delete produk gerabah
✅ **Modern UI** - Desain seperti Lazada dengan warna cokelat kayu cendana
✅ **Responsive Design** - Mobile-friendly interface
✅ **Real-time Database** - Integrasi Supabase
✅ **Error Handling** - Notifikasi error yang user-friendly
✅ **Loading State** - Indikator loading saat fetch data

## 🏗️ Struktur Project

```
gerabah-ukt/
├── frontend/                 # React-Vite Frontend
│   ├── src/
│   │   ├── components/      # React Components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProductModal.jsx
│   │   ├── App.jsx          # Main App Component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global Styles
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── backend/                  # Node.js/Express Backend
    ├── server.js            # Main server file
    ├── routes.js            # API routes
    ├── db.js                # Supabase config
    ├── package.json
    └── .env                 # Environment variables
```

## 🎨 Warna Dominan

- **Primary Brown (Cokelat Kayu Cendana)**: `#8B6F47`
- **Dark Brown**: `#6B5437`
- **Light Brown**: `#D2B48C`
- **White**: `#FFFFFF`
- **Light Gray**: `#F5F5F5`

## 🚀 Instalasi & Setup

### 1. Supabase Setup

1. Buat akun di [supabase.com](https://supabase.com)
2. Buat project baru
3. Buat table `products` dengan schema:

```sql
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. Copy URL dan API Key dari Supabase

### 2. Backend Setup

```bash
cd backend
npm install

# Edit .env file dengan credentials Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# Start development server
npm run dev
# atau untuk production
npm start
```

Backend akan berjalan di `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## 📡 API Endpoints

### GET - Ambil semua produk
```
GET /api/products
```

### GET - Ambil produk berdasarkan ID
```
GET /api/products/:id
```

### POST - Tambah produk baru
```
POST /api/products
Content-Type: application/json

{
  "name": "Gerabah Guci",
  "description": "Guci gerabah tradisional",
  "price": 150000,
  "stock": 10,
  "image_url": "https://..."
}
```

### PUT - Update produk
```
PUT /api/products/:id
Content-Type: application/json

{
  "name": "Gerabah Guci Baru",
  "description": "Deskripsi baru",
  "price": 200000,
  "stock": 15,
  "image_url": "https://..."
}
```

### DELETE - Hapus produk
```
DELETE /api/products/:id
```

## 🌐 Deployment

### Deploy Backend ke Render.com

1. Push code ke GitHub
2. Buat akun di [render.com](https://render.com)
3. New → Web Service
4. Pilih repository Anda
5. Konfigurasi:
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
7. Deploy

Backend URL: `https://your-app.onrender.com/api`

### Deploy Frontend ke Render.com

1. Di Render, buat Static Site baru
2. Pilih repository Anda
3. Konfigurasi:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. Update environment variable di frontend:
   - `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy

## 📝 Penggunaan

1. **Tambah Produk**: Klik tombol "+ Tambah Produk" di navbar
2. **Edit Produk**: Klik tombol "✏️ Edit" pada setiap produk
3. **Hapus Produk**: Klik tombol "🗑️ Hapus" (akan ada konfirmasi)
4. **Cari Produk**: Gunakan search bar (fitur dapat dikembangkan lebih lanjut)

## 🛠️ Teknologi

### Frontend
- React 18.2
- Vite 5.0
- React Router DOM 6.20
- Axios
- CSS3 (Custom styling dengan variabel CSS)

### Backend
- Node.js & Express
- Supabase (PostgreSQL)
- CORS
- dotenv

## 📦 Dependency Installation

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
npm install
```

## 🧪 Testing

### Test Backend
```bash
# Test endpoint di terminal
curl http://localhost:5000/api/products
```

### Test Frontend
Buka `http://localhost:3000` di browser

## 🔐 Security Tips

- Jangan commit file `.env`
- Gunakan environment variables untuk sensitive data
- Enable Row Level Security (RLS) di Supabase untuk production
- Validate semua input di server
- Gunakan HTTPS di production

## 🐛 Troubleshooting

**Error: Cannot GET /api/products**
- Pastikan backend sudah running di port 5000
- Check CORS configuration

**Error: Supabase connection failed**
- Pastikan credentials di .env benar
- Test koneksi Supabase di dashboard

**Image tidak muncul**
- Pastikan URL image valid dan accessible
- Periksa CORS settings Supabase

## 📚 Dokumentasi Lebih Lanjut

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Express Documentation](https://expressjs.com)
- [Render Documentation](https://render.com/docs)

## 👨‍💻 Pengembangan Lebih Lanjut

Ideas untuk improvement:
- ✨ Fitur search dan filter
- 🏷️ Kategori produk
- ⭐ Rating & review
- 🛒 Shopping cart
- 💳 Payment gateway
- 📦 Order tracking
- 👤 User authentication
- 📊 Admin dashboard

## 📄 Lisensi

Project ini bebas digunakan untuk keperluan pribadi atau komersial.

---

**Dibuat dengan ❤️ untuk Toko Gerabah**
