import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

// Generate JWT token
export const generateToken = (userId, email, username, role) => {
  const secret = process.env.JWT_SECRET || 'your-secret-key'
  const expiresIn = process.env.JWT_EXPIRE || 86400 // 24 hours

  return jwt.sign(
    {
      id: userId,
      email,
      username,
      role
    },
    secret,
    { expiresIn }
  )
}

// Verify JWT token
export const verifyToken = (token) => {
  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key'
    return jwt.verify(token, secret)
  } catch (error) {
    console.error('Token verification error:', error.message)
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
