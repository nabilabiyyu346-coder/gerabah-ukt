import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { testConnection } from '../db.js'
import productRoutes from '../routes.js'
import authRoutes from '../authRoutes.js'
import orderRoutes from '../orderRoutes.js'

const app = express()

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

export default app
