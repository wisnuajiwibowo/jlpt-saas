import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Ini pintu gerbang utama untuk membaca dan menyimpan data ke Supabase kamu
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
