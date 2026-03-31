import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import productRoutes from '../routes.js'
import authRoutes from '../authRoutes.js'
import orderRoutes from '../orderRoutes.js'

const app = express()

// Log environment on startup (for debugging)
console.log('🔍 Startup Check:')
console.log('- NODE_ENV:', process.env.NODE_ENV)
console.log('- SUPABASE_URL:', process.env.SUPABASE_URL ? '✓ Set' : '❌ Missing')
console.log('- SUPABASE_KEY:', process.env.SUPABASE_KEY ? '✓ Set' : '❌ Missing')
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '❌ Missing')

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:3001',
    process.env.FRONTEND_URL || '',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ''
  ].filter(url => url),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`)
  next()
})

// Routes
app.use('/api', productRoutes)
app.use('/api', orderRoutes)
app.use('/auth', authRoutes)

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: '🏺 Toko Gerabah API Running',
    service: 'Vercel Serverless',
    version: '1.0.0'
  })
})

// Health check
app.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: {
      NODE_ENV: process.env.NODE_ENV || 'development',
      hasSupabaseUrl: !!process.env.SUPABASE_URL,
      hasSupabaseKey: !!process.env.SUPABASE_KEY,
      hasJwtSecret: !!process.env.JWT_SECRET
    }
  }
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    health.warning = '⚠️ Missing Supabase credentials'
  }
  
  res.status(200).json(health)
})

// 404 handler
app.use('*', (req, res) => {
  console.log('⚠️ 404 Not Found:', req.path)
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method,
    hint: 'Check your API endpoint path'
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔴 Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  })
  
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error',
    path: req.path,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// Graceful error handler for unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('🔴 Unhandled Rejection:', reason)
})

console.log('✅ API Server initialized successfully')

export default app
