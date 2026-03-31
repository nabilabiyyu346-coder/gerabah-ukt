import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

// Generate JWT token
export const generateToken = (userId, email, username, role) => {
  const secret = process.env.JWT_SECRET || 'your-secret-key'
  const expiresIn = parseInt(process.env.JWT_EXPIRE || '86400', 10) // 24 hours default

  console.log('[AUTH] Token generation:', {
    userId,
    expiresIn,
    expiresInSeconds: expiresIn
  })

  return jwt.sign(
    {
      id: userId,
      email,
      username,
      role
    },
    secret,
    { expiresIn } // jwt library automatically converts seconds to expiration
  )
}

// Verify JWT token
export const verifyToken = (token) => {
  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key'
    const decoded = jwt.verify(token, secret)
    console.log('[AUTH] Token verified:', {
      userId: decoded.id,
      expiresAt: new Date(decoded.exp * 1000).toISOString()
    })
    return decoded
  } catch (error) {
    console.error('[AUTH] Token verification error:', {
      message: error.message,
      name: error.name,
      tokenAge: error.expiredAt ? `Expired at: ${error.expiredAt}` : 'N/A'
    })
    return null
  }
}

// Hash password
export const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10)
  } catch (error) {
    console.error('Error hashing password:', error)
    throw error
  }
}

// Compare password
export const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash)
  } catch (error) {
    console.error('Error comparing password:', error)
    throw error
  }
}

// Generate UUID
export const generateId = () => {
  return uuidv4()
}

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password strength
export const isStrongPassword = (password) => {
  // Min 8 chars, contain uppercase, lowercase, number, special char
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return strongRegex.test(password)
}

// Optional: weaker password validation
export const isValidPassword = (password) => {
  return password && password.length >= 6
}
