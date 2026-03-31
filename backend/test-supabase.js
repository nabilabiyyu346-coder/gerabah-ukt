import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

console.log('\n🔍 Supabase Connection Diagnostic')
console.log('═'.repeat(50))

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_KEY

console.log('\n1️⃣ Environment Check:')
console.log('├─ URL exists:', !!url)
console.log('├─ URL value:', url ? `${url.substring(0, 30)}...` : 'MISSING')
console.log('├─ Key exists:', !!key)
console.log('├─ Key length:', key ? key.length : 0)
console.log('└─ NODE_ENV:', process.env.NODE_ENV)

if (!url || !key) {
  console.error('\n❌ Missing credentials!')
  process.exit(1)
}

console.log('\n2️⃣ Creating Supabase client...')
const client = createClient(url, key)
console.log('✓ Client created')

console.log('\n3️⃣ Testing connection...')
try {
  const { data, error } = await client.from('users').select('id').limit(1)
  
  if (error) {
    console.error('❌ Query failed:', error.message)
    console.error('Error code:', error.code)
    console.error('Error details:', error)
  } else {
    console.log('✅ Connection successful!')
    console.log(`✓ Found ${data.length} user(s)`)
  }
} catch (err) {
  console.error('❌ Connection error:', err.message)
  console.error('Error type:', err.name)
  
  // Check if it's a network error
  if (err.message.includes('fetch failed')) {
    console.log('\n⚠️  Likely causes:')
    console.log('  - Network connectivity issue')
    console.log('  - VPN/Firewall blocking')
    console.log('  - DNS resolution failure')
    console.log('  - Invalid SUPABASE_URL format')
  }
}

console.log('\n═'.repeat(50) + '\n')
