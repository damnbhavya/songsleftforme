import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const isConfigured = supabaseUrl !== '' && supabaseAnonKey !== '' &&
    !supabaseUrl.includes('your_supabase') && !supabaseAnonKey.includes('your_supabase')

if (!isConfigured) {
    console.warn('⚠️ Supabase credentials missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env')
}

// fall back to a dummy url so the app doesn't crash without credentials
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
    song_title: string | null
    created_at: string
}
