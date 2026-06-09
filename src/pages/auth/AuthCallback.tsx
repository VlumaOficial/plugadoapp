import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../integrations/supabase/client'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Verificar se há erro na URL
    const hash = window.location.hash
    const params = new URLSearchParams(window.location.search)
    const errorDesc = params.get('error_description')

    if (errorDesc) {
      navigate('/login?erro=' + encodeURIComponent(errorDesc))
      return
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        navigate('/login?confirmado=true')
      } else if (event === 'SIGNED_OUT') {
        navigate('/login')
      }
    })

    // Processar hash do Supabase
    if (hash) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          navigate('/login?confirmado=true')
        }
      })
    }

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
