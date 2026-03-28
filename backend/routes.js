import express from 'express'
import { supabase } from './db.js'

const router = express.Router()

// GET all products
router.get('/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    res.status(200).json(data || [])
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ 
      error: 'Gagal mengambil data produk',
      details: error.message 
    })
  }
})

// GET single product
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    if (!data) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' })
    }

    res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ 
      error: 'Gagal mengambil data produk',
      details: error.message 
    })
  }
})

// CREATE product
router.post('/products', async (req, res) => {
  try {
    const { name, description, price, stock, image_url } = req.body

    // Validation
    if (!name || !price || stock === undefined) {
      return res.status(400).json({ 
        error: 'Nama, harga, dan stok wajib diisi' 
      })
    }

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name,
          description: description || '',
          price: parseFloat(price),
          stock: parseInt(stock),
          image_url: image_url || null,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) throw error

    res.status(201).json(data)
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(500).json({ 
      error: 'Gagal menambah produk',
      details: error.message 
    })
  }
})

// UPDATE product
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, price, stock, image_url } = req.body

    // Validation
    if (!name || !price || stock === undefined) {
      return res.status(400).json({ 
        error: 'Nama, harga, dan stok wajib diisi' 
      })
    }

    const { data, error } = await supabase
      .from('products')
      .update({
        name,
        description: description || '',
        price: parseFloat(price),
        stock: parseInt(stock),
        image_url: image_url || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    if (!data) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' })
    }

    res.status(200).json(data)
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({ 
      error: 'Gagal memperbarui produk',
      details: error.message 
    })
  }
})

// DELETE product
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    if (!data) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' })
    }

    res.status(200).json({ 
      message: 'Produk berhasil dihapus',
      data 
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ 
      error: 'Gagal menghapus produk',
      details: error.message 
    })
  }
})

export default router
