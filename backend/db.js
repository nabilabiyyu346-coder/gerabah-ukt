import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseKey = process.env.SUPABASE_KEY || 'YOUR_SUPABASE_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Test connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('count(*)', { count: 'exact' })

    if (error) throw error
    console.log('✓ Supabase connection successful')
    return true
  } catch (error) {
    console.error('✗ Supabase connection failed:', error.message)
    return false
  }
}
