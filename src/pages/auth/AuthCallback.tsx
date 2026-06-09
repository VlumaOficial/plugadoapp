import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../integrations/supabase/client'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        navigate('/login?confirmado=true')
      } else {
        navigate('/login')
      }
    })
    return () => subscription.unsubscribe()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0B1520' }}>
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-gray-500 border-t-[#F5A623] rounded-full animate-spin mx-auto mb-4"/>
        <p className="text-gray-400 text-sm">Processando confirmação...</p>
      </div>
    </div>
  )
}
