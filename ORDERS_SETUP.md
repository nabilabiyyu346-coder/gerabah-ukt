# SQL untuk Membuat Tabel Orders dan Order Items

Jalankan SQL queries berikut di Supabase SQL Editor:

## 1. Create Orders Table

```sql
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_price DECIMAL(15, 2) NOT NULL,
  shipping_address TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('bank_transfer', 'e_wallet', 'credit_card', 'cod')),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
```

## 2. Create Order Items Table

```sql
CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

## 3. Update Products Table (opsional - untuk kategori)

```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating DECIMAL(3, 1) DEFAULT 4.5;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sold_count INT DEFAULT 0;
```

## 4. Update Users Table (opsional - untuk order tracking)

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_orders INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_spent DECIMAL(15, 2) DEFAULT 0;
```

## Struktur Data

### Orders Table
| Column | Type | Deskripsi |
|--------|------|-----------|
| id | BIGSERIAL | Primary key |
| user_id | UUID | Foreign key ke users |
| total_price | DECIMAL | Harga total pesanan |
| shipping_address | TEXT | Alamat pengiriman |
| phone | VARCHAR | Nomor telepon |
| payment_method | VARCHAR | Metode pembayaran (bank_transfer, e_wallet, credit_card, cod) |
| status | VARCHAR | Status: pending, confirmed, shipped, delivered, cancelled |
| notes | TEXT | Catatan pesanan |
| created_at | TIMESTAMP | Waktu pesanan dibuat |
| updated_at | TIMESTAMP | Waktu update terakhir |

### Order Items Table
| Column | Type | Deskripsi |
|--------|------|-----------|
| id | BIGSERIAL | Primary key |
| order_id | BIGINT | Foreign key ke orders |
| product_id | BIGINT | Foreign key ke products |
| quantity | INT | Jumlah produk |
| price | DECIMAL | Harga produk saat order |
| created_at | TIMESTAMP | Waktu item ditambahkan |

## Testing

Setelah membuat tables, coba:

```bash
# Test di backend
curl http://localhost:5000/api/orders -H "Authorization: Bearer YOUR_TOKEN"
```

## Notes

- Foreign key `user_id` mereferensi `auth.users(id)` dari Supabase Auth
- Gunakan `ON DELETE CASCADE` untuk `orders` agar pesanan dihapus saat user dihapus
- Gunakan `ON DELETE RESTRICT` untuk `order_items` agar tidak bisa menghapus produk yang ada di order
