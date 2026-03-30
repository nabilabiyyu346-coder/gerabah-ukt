import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseKey = process.env.SUPABASE_KEY || 'YOUR_SUPABASE_KEY'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SUPABASE_SERVICE_ROLE_KEY'

// Regular client (dengan RLS)
export const supabase = createClient(supabaseUrl, supabaseKey)

// Admin client (bypass RLS - untuk registration & admin operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

// Test connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .limit(1)

    if (error) throw error
    console.log('✓ Supabase connection successful')
    return true
  } catch (error) {
    console.error('✗ Supabase connection failed:', error.message)
    return false
  }
}
