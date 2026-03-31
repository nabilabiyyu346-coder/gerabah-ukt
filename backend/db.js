import { createClient } from '@supabase/supabase-js'

// Validate environment variables
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('[DB] Supabase initialization...')
console.log('[DB] URL exists:', !!supabaseUrl)
console.log('[DB] Key exists:', !!supabaseKey)
console.log('[DB] Service role key exists:', !!supabaseServiceRoleKey)

if (!supabaseUrl || !supabaseKey) {
  console.warn('[DB] ⚠️ Warning: Missing Supabase credentials')
  console.warn('[DB] Some endpoints will fail until credentials are set in Vercel Environment Variables')
}

// Regular client (dengan RLS)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
)

// Admin client (bypass RLS - untuk registration & admin operations)
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceRoleKey || supabaseKey || 'placeholder-key'
)

// Test connection
export const testConnection = async () => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('[DB] Skipping connection test - credentials not available')
      return false
    }

    console.log('[DB] Testing Supabase connection...')
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .limit(1)

    if (error) {
      console.error('[DB] Connection test failed:', error.message)
      return false
    }

    console.log('[DB] ✓ Connection successful')
    return true
  } catch (error) {
    console.error('[DB] Connection test error:', error.message)
    return false
  }
}
