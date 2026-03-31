import express from 'express'
import { supabase, supabaseAdmin } from './db.js'
import {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  generateId,
  isValidEmail,
  isValidPassword
} from './auth.js'

const router = express.Router()

// Middleware: Verify JWT token
export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token required' })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    req.userId = decoded.id
    req.userEmail = decoded.email
    req.userRole = decoded.role
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(401).json({ error: 'Authentication failed' })
  }
}

// REGISTER endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, username, password, full_name } = req.body

    // Validation
    if (!email || !username || !password) {
      return res.status(400).json({
        error: 'Email, username, dan password wajib diisi'
      })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Format email tidak valid' })
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        error: 'Password minimal 6 karakter'
      })
    }

    // Check if email/username exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${email},username.eq.${username}`)

    if (existingUser && existingUser.length > 0) {
      return res.status(400).json({
        error: 'Email atau username sudah terdaftar'
      })
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user - use supabaseAdmin to bypass RLS
    const userId = generateId()
    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          id: userId,
          email,
          username,
          password_hash: passwordHash,
          full_name: full_name || username,
          role: 'customer',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) throw error

    // Generate token
    const token = generateToken(newUser.id, newUser.email, newUser.username, newUser.role)

    // Return user data (without password)
    res.status(201).json({
      message: 'Registrasi berhasil',
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        full_name: newUser.full_name,
        role: newUser.role
      },
      token
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({
      error: 'Gagal registrasi',
      details: error.message
    })
  }
})

// LOGIN endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email dan password wajib diisi'
      })
    }

    // Find user by email - use supabaseAdmin to bypass RLS
    const { data: users, error: findError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)

    if (findError) throw findError

    if (!users || users.length === 0) {
      return res.status(401).json({
        error: 'Email atau password salah'
      })
    }

    const user = users[0]

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        error: 'Akun Anda telah dinonaktifkan'
      })
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password_hash)

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Email atau password salah'
      })
    }

    // Update last login - use supabaseAdmin
    await supabaseAdmin
      .from('users')
      .update({
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    // Generate token
    const token = generateToken(user.id, user.email, user.username, user.role)

    res.status(200).json({
      message: 'Login berhasil',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        role: user.role
      },
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      error: 'Gagal login',
      details: error.message
    })
  }
})

// GET CURRENT USER endpoint
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, username, full_name, role, profile_picture_url')
      .eq('id', req.userId)
      .single()

    if (error) throw error

    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' })
    }

    res.status(200).json({
      user
    })
  } catch (error) {
    console.error('Get current user error:', error)
    res.status(500).json({
      error: 'Gagal mengambil data user',
      details: error.message
    })
  }
})

// LOGOUT endpoint (optional - mainly for frontend)
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // Optional: Invalidate session di database
    res.status(200).json({
      message: 'Logout berhasil'
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      error: 'Gagal logout',
      details: error.message
    })
  }
})

// UPDATE PROFILE endpoint
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { full_name, profile_picture_url } = req.body

    const { data: updatedUser, error } = await supabaseAdmin
      .from('users')
      .update({
        full_name: full_name || undefined,
        profile_picture_url: profile_picture_url || undefined,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.userId)
      .select()
      .single()

    if (error) throw error

    res.status(200).json({
      message: 'Profil berhasil diperbarui',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        full_name: updatedUser.full_name,
        profile_picture_url: updatedUser.profile_picture_url,
        role: updatedUser.role
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      error: 'Gagal memperbarui profil',
      details: error.message
    })
  }
})

export default router
