import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://vaprblwtmeoypfxbbclx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhcHJibHd0bWVveXBmeGJiY2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NDYxMzUsImV4cCI6MjA5NjQyMjEzNX0.A55elBet9uSu1hVuY6YTR5Cs-EmVWnNtBWqm5rffEaA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
