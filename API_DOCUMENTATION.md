# API Documentation - Toko Gerabah

Dokumentasi lengkap API untuk Toko Gerabah Backend

## 📋 Base URL

```
http://localhost:5000/api
```

Production:
```
https://gerabah-backend.onrender.com/api
```

## 📋 Content-Type

Semua request harus menggunakan:
```
Content-Type: application/json
```

---

## 🔍 GET - Ambil Semua Produk

### Endpoint
```
GET /products
```

### Response Success (200)
```json
[
  {
    "id": 1,
    "name": "Gerabah Guci Cokelat",
    "description": "Guci gerabah tradisional",
    "price": 150000,
    "stock": 20,
    "image_url": "https://...",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  {
    "id": 2,
    "name": "Gerabah Pasu Bunga",
    "description": "Pasu bunga gerabah",
    "price": 75000,
    "stock": 35,
    "image_url": "https://...",
    "created_at": "2024-01-16T14:20:00Z",
    "updated_at": "2024-01-16T14:20:00Z"
  }
]
```

### Example Request
```bash
curl -X GET http://localhost:5000/api/products \
  -H "Content-Type: application/json"
```

---

## 📄 GET - Ambil Produk Berdasarkan ID

### Endpoint
```
GET /products/:id
```

### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Integer | Product ID (required) |

### Response Success (200)
```json
{
  "id": 1,
  "name": "Gerabah Guci Cokelat",
  "description": "Guci gerabah tradisional",
  "price": 150000,
  "stock": 20,
  "image_url": "https://...",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Response Error (404)
```json
{
  "error": "Produk tidak ditemukan"
}
```

### Example Request
```bash
curl -X GET http://localhost:5000/api/products/1 \
  -H "Content-Type: application/json"
```

---

## ➕ POST - Tambah Produk Baru

### Endpoint
```
POST /products
```

### Request Body
```json
{
  "name": "Gerabah Kendi Tradisional",
  "description": "Kendi gerabah dengan desain klasik",
  "price": 120000,
  "stock": 15,
  "image_url": "https://example.com/image.jpg"
}
```

### Required Fields
- `name` (string) - Nama produk
- `price` (number) - Harga produk dalam Rupiah
- `stock` (integer) - Jumlah stok

### Optional Fields
- `description` (string) - Deskripsi produk
- `image_url` (string) - URL gambar produk

### Response Success (201)
```json
{
  "id": 5,
  "name": "Gerabah Kendi Tradisional",
  "description": "Kendi gerabah dengan desain klasik",
  "price": 120000,
  "stock": 15,
  "image_url": "https://example.com/image.jpg",
  "created_at": "2024-01-20T08:45:30Z",
  "updated_at": "2024-01-20T08:45:30Z"
}
```

### Response Error (400)
```json
{
  "error": "Nama, harga, dan stok wajib diisi"
}
```

### Example Request
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gerabah Kendi Tradisional",
    "description": "Kendi gerabah dengan desain klasik",
    "price": 120000,
    "stock": 15,
    "image_url": "https://example.com/image.jpg"
  }'
```

### Example Request (Python)
```python
import requests

url = "http://localhost:5000/api/products"
data = {
    "name": "Gerabah Kendi Tradisional",
    "description": "Kendi gerabah dengan desain klasik",
    "price": 120000,
    "stock": 15,
    "image_url": "https://example.com/image.jpg"
}

response = requests.post(url, json=data)
print(response.json())
```

### Example Request (JavaScript)
```javascript
const url = "http://localhost:5000/api/products";
const data = {
  name: "Gerabah Kendi Tradisional",
  description: "Kendi gerabah dengan desain klasik",
  price: 120000,
  stock: 15,
  image_url: "https://example.com/image.jpg"
};

fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 📝 PUT - Update Produk

### Endpoint
```
PUT /products/:id
```

### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Integer | Product ID (required) |

### Request Body
```json
{
  "name": "Gerabah Kendi Baru",
  "description": "Deskripsi produk yang diupdate",
  "price": 150000,
  "stock": 20,
  "image_url": "https://example.com/image-new.jpg"
}
```

### Required Fields
- `name` (string) - Nama produk
- `price` (number) - Harga produk
- `stock` (integer) - Jumlah stok

### Optional Fields
- `description` (string) - Deskripsi produk
- `image_url` (string) - URL gambar produk

### Response Success (200)
```json
{
  "id": 5,
  "name": "Gerabah Kendi Baru",
  "description": "Deskripsi produk yang diupdate",
  "price": 150000,
  "stock": 20,
  "image_url": "https://example.com/image-new.jpg",
  "created_at": "2024-01-20T08:45:30Z",
  "updated_at": "2024-01-20T09:15:00Z"
}
```

### Response Error (404)
```json
{
  "error": "Produk tidak ditemukan"
}
```

### Example Request
```bash
curl -X PUT http://localhost:5000/api/products/5 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gerabah Kendi Baru",
    "description": "Deskripsi produk yang diupdate",
    "price": 150000,
    "stock": 20,
    "image_url": "https://example.com/image-new.jpg"
  }'
```

---

## 🗑️ DELETE - Hapus Produk

### Endpoint
```
DELETE /products/:id
```

### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Integer | Product ID (required) |

### Response Success (200)
```json
{
  "message": "Produk berhasil dihapus",
  "data": {
    "id": 5,
    "name": "Gerabah Kendi Baru",
    "description": "Deskripsi produk",
    "price": 150000,
    "stock": 20,
    "image_url": "https://example.com/image.jpg",
    "created_at": "2024-01-20T08:45:30Z",
    "updated_at": "2024-01-20T09:15:00Z"
  }
}
```

### Response Error (404)
```json
{
  "error": "Produk tidak ditemukan"
}
```

### Example Request
```bash
curl -X DELETE http://localhost:5000/api/products/5 \
  -H "Content-Type: application/json"
```

---

## ✅ Health Check

### Endpoint
```
GET /health
```

### Response
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### Example Request
```bash
curl http://localhost:5000/health
```

---

## 🔄 Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request berhasil |
| 201 | Created - Resource berhasil dibuat |
| 400 | Bad Request - Validation error |
| 404 | Not Found - Resource tidak ditemukan |
| 500 | Internal Server Error - Server error |

---

## 🚨 Error Handling

Semua error responses menggunakan format:

```json
{
  "error": "Deskripsi error",
  "details": "Detail technical error (jika ada)"
}
```

---

## 🧪 Testing dengan REST Client

### VSCode REST Client Extension

Install extension: `REST Client` oleh Huachao Mao

Buat file `test.http`:

```http
### Get all products
GET http://localhost:5000/api/products

### Get product by ID
GET http://localhost:5000/api/products/1

### Create product
POST http://localhost:5000/api/products
Content-Type: application/json

{
  "name": "Test Product",
  "description": "Test Description",
  "price": 100000,
  "stock": 10
}

### Update product
PUT http://localhost:5000/api/products/1
Content-Type: application/json

{
  "name": "Updated Product",
  "description": "Updated Description",
  "price": 150000,
  "stock": 20
}

### Delete product
DELETE http://localhost:5000/api/products/1

### Health check
GET http://localhost:5000/health
```

---

## 📊 Response Examples

### Product Object
```json
{
  "id": 1,
  "name": "Gerabah Guci Cokelat",
  "description": "Guci gerabah tradisional dengan warna cokelat alami",
  "price": 150000,
  "stock": 20,
  "image_url": "https://example.com/guci-cokelat.jpg",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

### Empty Products List
```json
[]
```

---

## 💡 Tips

1. **Always use correct HTTP methods**
   - GET untuk read
   - POST untuk create
   - PUT untuk update
   - DELETE untuk delete

2. **Always include Content-Type header**
   ```
   -H "Content-Type: application/json"
   ```

3. **Validate input on frontend before sending**
   - Check required fields
   - Validate email/URL format
   - Check min/max values

4. **Handle errors gracefully**
   - Show user-friendly messages
   - Log errors for debugging
   - Retry on network failures

5. **Use async/await in JavaScript**
   ```javascript
   try {
     const response = await fetch(url, options);
     const data = await response.json();
   } catch (error) {
     console.error(error);
   }
   ```

---

**API Documentation Complete! 🎉**
