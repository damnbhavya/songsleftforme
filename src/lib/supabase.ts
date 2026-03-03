import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const isConfigured = supabaseUrl !== '' && supabaseAnonKey !== '' &&
    !supabaseUrl.includes('your_supabase') && !supabaseAnonKey.includes('your_supabase')

if (!isConfigured) {
    console.warn('⚠️ Supabase credentials missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env')
}

// Use a dummy URL if not configured to prevent crash
export const supabase = createClient(
    isConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
    isConfigured ? supabaseAnonKey : 'placeholder'
)

export const isSupabaseConfigured = isConfigured

export interface Submission {
    id: string
    recipient_name: string | null
    message: string | null
    spotify_url: string
    created_at: string
}
