import jwt from 'jsonwebtoken'
import 'dotenv/config'

// Test JWT generation dan expiry
const secret = process.env.JWT_SECRET || 'your-secret-key'
const expiresIn = parseInt(process.env.JWT_EXPIRE || '86400', 10)

console.log('\n🔐 JWT Configuration Test')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('SECRET exists:', !!process.env.JWT_SECRET)
console.log('EXPIRE value (env):', process.env.JWT_EXPIRE)
console.log('EXPIRE value (parsed):', expiresIn)
console.log('EXPIRE duration:', `${expiresIn} seconds = ${Math.floor(expiresIn / 60)} minutes`)

// Generate test token
console.log('\n📝 Generating test token...')
const testPayload = {
  id: 'test-user-123',
  email: 'test@example.com',
  username: 'testuser',
  role: 'customer'
}

const token = jwt.sign(testPayload, secret, { expiresIn })
console.log('✓ Token generated')
console.log('Token:', token.substring(0, 50) + '...')

// Verify token immediately
console.log('\n✅ Verifying immediately...')
try {
  const decoded = jwt.verify(token, secret)
  console.log('✓ Token valid')
  console.log('Expires at:', new Date(decoded.exp * 1000).toISOString())
  console.log('Time until expiry:', `${decoded.exp - Math.floor(Date.now() / 1000)} seconds`)
} catch (err) {
  console.error('✗ Verification failed:', err.message)
}

// Simulate expired token
console.log('\n⏰ Creating expired token (1 second expiry)...')
const expiredToken = jwt.sign(testPayload, secret, { expiresIn: 1 })

setTimeout(() => {
  console.log('\nWaiting 2 seconds...')
  try {
    jwt.verify(expiredToken, secret)
    console.log('✓ Token still valid (unexpected)')
  } catch (err) {
    console.log('✓ Token expired as expected:', err.message)
  }
}, 2000)

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
