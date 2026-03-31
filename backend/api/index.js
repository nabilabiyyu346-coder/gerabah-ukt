import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import productRoutes from '../routes.js'
import authRoutes from '../authRoutes.js'
import orderRoutes from '../orderRoutes.js'

console.log('[STARTUP] Initializing API...')
console.log('[STARTUP] NODE_ENV:', process.env.NODE_ENV)
console.log('[STARTUP] SUPABASE_URL:', !!process.env.SUPABASE_URL)
console.log('[STARTUP] SUPABASE_KEY:', !!process.env.SUPABASE_KEY)
console.log('[STARTUP] ✓ All routes loaded')

const app = express()

console.log('[STARTUP] Setting up middleware...')

// CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:3001',
    process.env.FRONTEND_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
    'https://gerabah-ukt.vercel.app'
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.path}`)
  next()
})

console.log('[STARTUP] Mounting routes...')

// Routes
app.use('/api', productRoutes)
app.use('/api', orderRoutes)
app.use('/auth', authRoutes)

console.log('[STARTUP] Setting up endpoints...')

// Root
app.get('/', (req, res) => {
  res.json({ 
    message: '🏺 Toko Gerabah API',
    version: '1.0.0',
    ts: new Date().toISOString()
  })
})

// Health
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    ts: new Date().toISOString(),
    env: {
      supabase: !!process.env.SUPABASE_URL,
      jwt: !!process.env.JWT_SECRET
    }
  })
})

// 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    path: req.path
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERR]', err.message)
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error'
  })
})

console.log('[STARTUP] ✅ API Ready')

export default app
