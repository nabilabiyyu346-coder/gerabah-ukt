# Database Setup - Supabase

Panduan setup database di Supabase untuk Toko Gerabah

## 🗄️ Create Table: Products

### SQL Query

Copy dan jalankan SQL query berikut di Supabase:

```sql
-- Create products table
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index untuk faster queries
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies (untuk development, allow all)
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON products
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON products
  FOR DELETE USING (true);
```

### Alternative: GUI Method

1. Login ke Supabase Dashboard
2. Go to **SQL Editor**
3. Paste SQL query di atas
4. Klik **RUN**

---

## 🔑 Get Credentials

### Step 1: Dapatkan Supabase URL

1. Di Supabase Dashboard, klik **Settings** (gear icon)
2. Pilih **API**
3. Copy **Project URL** - ini adalah `SUPABASE_URL`

### Step 2: Dapatkan API Key

1. Di halaman yang sama, lihat **API Keys**
2. Copy key yang ada (biasanya `anon` key)
3. Ini adalah `SUPABASE_KEY`

### Step 3: Configure Backend

Edit `backend/.env`:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=5000
```

---

## 📊 Table Schema Details

### Columns

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Primary key, auto-increment |
| `name` | VARCHAR(255) | Nama produk (required) |
| `description` | TEXT | Deskripsi produk |
| `price` | NUMERIC(10,2) | Harga produk (required) |
| `stock` | INTEGER | Jumlah stok (required) |
| `image_url` | TEXT | URL gambar produk |
| `created_at` | TIMESTAMP | Waktu dibuat (auto) |
| `updated_at` | TIMESTAMP | Waktu terakhir diupdate (auto) |

---

## 📝 Sample Data

Masukkan data sample:

```sql
INSERT INTO products (name, description, price, stock, image_url) VALUES
(
  'Gerabah Guci Cokelat',
  'Guci gerabah tradisional dengan warna cokelat alami. Cocok untuk hiasan atau keperluan sehari-hari.',
  150000,
  20,
  'https://via.placeholder.com/300?text=Guci+Cokelat'
),
(
  'Gerabah Pasu Bunga',
  'Pasu bunga gerabah dengan desain elegan dan polos. Ukuran sedang, cocok untuk tanaman hias.',
  75000,
  35,
  'https://via.placeholder.com/300?text=Pasu+Bunga'
),
(
  'Gerabah Kendi Tradisional',
  'Kendi gerabah tradisional dengan desain klasik. Sempurna untuk dekorasi rumah tradisional.',
  120000,
  15,
  'https://via.placeholder.com/300?text=Kendi'
),
(
  'Gerabah Pigura Unik',
  'Pigura gerabah dengan ukiran unik. Bisa digunakan untuk meletakkan foto atau barang emas.',
  85000,
  25,
  'https://via.placeholder.com/300?text=Pigura'
),
(
  'Gerabah Vas Dekorasi',
  'Vas gerabah untuk dekorasi ruang tamu. Warna cokelat muda yang elegant dan minimalis.',
  95000,
  30,
  'https://via.placeholder.com/300?text=Vas'
);
```

---

## 🔐 Row Level Security (RLS)

### For Development (Allow All)

Sudah di-include dalam SQL query di atas.

### For Production (Restricted)

Gunakan policies yang lebih ketat:

```sql
-- Hanya authenticated users yang bisa update/delete
CREATE POLICY "Enable update for users" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for users" ON products
  FOR DELETE USING (auth.role() = 'authenticated');
```

---

## 🧪 Test Connection

### Method 1: Menggunakan Supabase CLI

```bash
npm install -g supabase
supabase projects list
```

### Method 2: Menggunakan Backend

```bash
# Di backend directory
npm run dev

# Check logs untuk "Supabase connection successful"
```

### Method 3: cURL Command

```bash
curl -H "apikey: YOUR_SUPABASE_KEY" \
  https://YOUR_PROJECT.supabase.co/rest/v1/products?select=*
```

---

## 📈 Performance Optimization

### Create Indexes

```sql
-- Sudah included dalam setup di atas
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Optional: untuk search
CREATE INDEX idx_products_name ON products(name);
```

### Enable Caching

Di Supabase dashboard:
1. Settings → API
2. Enable **HTTP Caching**

---

## 🛡️ Backup Strategy

### Automatic Backups

1. Di Supabase Dashboard → Settings
2. Klik **Database**
3. Enable **Point in Time Recovery (PITR)**

### Manual Export

1. Dashboard → Settings
2. Klik **Backups**
3. Klik **Request Backup** atau **Create Manual Backup**

---

## 🔄 Database Queries

### Common Queries

```sql
-- Get all products
SELECT * FROM products ORDER BY created_at DESC;

-- Get product by ID
SELECT * FROM products WHERE id = 1;

-- Count total products
SELECT COUNT(*) as total FROM products;

-- Get products by price range
SELECT * FROM products WHERE price >= 100000 AND price <= 200000;

-- Update created_at timestamp
UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = 1;

-- Delete all products (⚠️ be careful!)
DELETE FROM products;
```

---

## 🆘 Troubleshooting

### Connection Error

**Problem**: `Failed to connect to Supabase`

**Solution**:
1. Check credentials di `.env`
2. Verify URL format: `https://xxxxx.supabase.co`
3. Check internet connection
4. Test di Supabase dashboard

### Table Not Found

**Problem**: `relation "products" does not exist`

**Solution**:
1. Run the SQL query di atas
2. Refresh dashboard
3. Verify table is created

### Permission Denied (RLS)

**Problem**: `new row violates row-level security policy`

**Solution**:
1. Check RLS policies
2. Disable RLS untuk development
3. Or adjust policies

---

## 📚 References

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Database Setup Complete! 🎉**
