import express from 'express'
import { supabase } from './db.js'
import { verifyToken } from './auth.js'

const router = express.Router()

// Create new order
router.post('/orders', verifyToken, async (req, res) => {
  try {
    const { items, total_price, shipping_address, phone, payment_method } = req.body
    const userId = req.user.id

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items harus berupa array dan tidak boleh kosong' })
    }

    if (!total_price || !shipping_address || !phone || !payment_method) {
      return res.status(400).json({ error: 'Semua field harus diisi' })
    }

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_price,
        shipping_address,
        phone,
        payment_method,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return res.status(400).json({ error: 'Gagal membuat pesanan' })
    }

    // Insert order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Order items insertion error:', itemsError)
      // Note: Order created but items failed. In production, should consider transaction
    }

    res.status(201).json({
      id: order.id,
      message: 'Pesanan berhasil dibuat'
    })

  } catch (err) {
    console.error('Create order error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get user orders
router.get('/orders', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch orders error:', error)
      return res.status(400).json({ error: 'Gagal memuat pesanan' })
    }

    // Get items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const { data: items } = await supabase
          .from('order_items')
          .select('*, products(name, image_url)')
          .eq('order_id', order.id)

        return {
          ...order,
          items: items || []
        }
      })
    )

    res.json(ordersWithItems)

  } catch (err) {
    console.error('Get orders error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get order detail
router.get('/orders/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (orderError || !order) {
      return res.status(404).json({ error: 'Pesanan tidak ditemukan' })
    }

    const { data: items } = await supabase
      .from('order_items')
      .select('*, products(id, name, image_url)')
      .eq('order_id', id)

    res.json({
      ...order,
      items: items || []
    })

  } catch (err) {
    console.error('Get order detail error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update order status (admin only - simplified, no role check in this version)
router.put('/orders/:id/status', verifyToken, async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status tidak valid' })
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return res.status(400).json({ error: 'Gagal update status' })
    }

    res.json(order)

  } catch (err) {
    console.error('Update order status error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
