# SQL untuk Menambahkan Kategori di Products Table

Jalankan SQL queries berikut di Supabase SQL Editor:

## 1. Add Category Column to Products

```sql
-- Add category column
ALTER TABLE products 
ADD COLUMN category VARCHAR(100);

-- Add available categories as enum type (optional untuk constraint)
CREATE TYPE product_category AS ENUM (
  'Piring & Mangkuk',
  'Cangkir & Gelas',
  'Vas & Pot Bunga',
  'Teko & Kendi',
  'Celengan & Box',
  'Dekorasi Rumah',
  'Peralatan Dapur',
  'Hadiah & Souvenir',
  'Koleksi',
  'Tradisional',
  'Modern',
  'Kontemporer',
  'Etnik'
);

-- Update products table to use enum (opsional)
-- ALTER TABLE products 
-- MODIFY COLUMN category TYPE product_category;

-- Add index untuk faster category filtering
CREATE INDEX idx_products_category ON products(category);
```

## 2. Update Existing Products (Optional)

```sql
-- Set default category untuk existing products
UPDATE products 
SET category = 'Piring & Mangkuk' 
WHERE category IS NULL;
```

## Struktur Kategori

### By Function (Paling Penting)
- Piring & Mangkuk (Plates & Bowls)
- Cangkir & Gelas (Cups & Glasses)
- Vas & Pot Bunga (Vases & Flower Pots)
- Teko & Kendi (Teapots & Pitchers)
- Celengan & Box (Piggy Banks & Boxes)

### By Purpose
- Dekorasi Rumah (Home Decor)
- Peralatan Dapur (Kitchenware)
- Hadiah & Souvenir (Gifts & Souvenirs)
- Koleksi (Collectibles)

### By Style
- Tradisional (Traditional)
- Modern (Modern)
- Kontemporer (Contemporary)
- Etnik (Ethnic)

## Testing

Setelah add column, test query:

```sql
SELECT category, COUNT(*) as total 
FROM products 
GROUP BY category;
```

## Notes

- Gunakan `VARCHAR(100)` untuk fleksibilitas
- Atau gunakan `ENUM` type untuk strict validation
- Index pada `category` membantu performa filter
- Bisa update kategori existing products via UI
