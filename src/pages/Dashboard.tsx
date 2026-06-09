import { useNavigate } from 'react-router-dom'
import { supabase } from '../integrations/supabase/client'

export default function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#0B1520' }}>
      <h1 className="text-white text-2xl font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
        Dashboard — Em construção
      </h1>
      <button
        onClick={handleLogout}
        className="px-6 py-3 rounded-full text-white font-semibold"
        style={{ background: 'linear-gradient(135deg, #F5A623, #E8951C)' }}
      >
        Sair
      </button>
    </div>
  )
}
