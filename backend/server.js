import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { testConnection } from './db.js'
import productRoutes from './routes.js'
import authRoutes from './authRoutes.js'
import orderRoutes from './orderRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api', productRoutes)
app.use('/api', orderRoutes)
app.use('/auth', authRoutes)

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    message: 'Server is running'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found' 
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ 
    error: 'Internal server error',
    details: err.message 
  })
})

// Start server
const startServer = async () => {
  try {
    // Test Supabase connection
    const connected = await testConnection()
    
    if (!connected) {
      console.warn('⚠ Warning: Could not connect to Supabase. Check your credentials.')
    }

    app.listen(PORT, () => {
      console.log(`\n🏺 Toko Gerabah Backend Server`)
      console.log(`✓ Server running on http://localhost:${PORT}`)
      console.log(`✓ API endpoint: http://localhost:${PORT}/api`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
