import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../integrations/supabase/client'

export default function RedefinirSenha() {
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase injeta a sessão via hash na URL após clicar no link do e-mail
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Sessão ativa — pode redefinir
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!senha || !confirmarSenha) { setError('Preencha todos os campos.'); return }
    if (senha.length < 8) { setError('A senha deve ter no mínimo 8 caracteres.'); return }
    if (senha !== confirmarSenha) { setError('As senhas não coincidem.'); return }

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.updateUser({ password: senha })
    setLoading(false)

    if (error) { setError('Erro ao redefinir senha. O link pode ter expirado.'); return }

    setSucesso(true)
    setTimeout(() => navigate('/login'), 3000)
  }

  const Logo = () => (
    <svg width="44" height="44" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5A623"/>
          <stop offset="55%" stopColor="#C8B830"/>
          <stop offset="100%" stopColor="#2EBF72"/>
        </linearGradient>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#rg)"/>
      <circle cx="28" cy="28" r="23" fill="#0B1520"/>
      <circle cx="17" cy="29" r="5.5" fill="white"/>
      <circle cx="39" cy="29" r="5.5" fill="white"/>
      <path d="M22 23 Q28 15 34 23" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M22 35 Q28 43 34 35" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
    </svg>
  )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8" style={{ backgroundColor: '#0B1520' }}>

      <div className="mb-8 flex items-center gap-3">
        <Logo/>
        <h1 style={{ fontFamily:'Syne,sans-serif', background:'linear-gradient(90deg,#F5A623,#2EBF72)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', letterSpacing:'0.1em', fontWeight:800, fontSize:'1.6rem' }}>PLUGADO</h1>
      </div>

      <div className="w-full max-w-md" style={{ backgroundColor:'#0F1D2E', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px', padding:'32px' }}>

        {!sucesso ? (
          <>
            <h2 className="text-white text-xl font-bold mb-2" style={{ fontFamily:'Syne,sans-serif' }}>Nova senha</h2>
            <p className="text-gray-400 text-sm mb-6">Digite sua nova senha abaixo.</p>

            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-lg text-sm mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">Nova senha</label>
                <div className="relative">
                  <input
                    type={showSenha ? 'text' : 'password'}
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    className="w-full px-4 pr-12 py-3 bg-[#0B1520] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all"
                    placeholder="mín. 8 caracteres"
                  />
                  <button type="button" onClick={() => setShowSenha(!showSenha)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showSenha ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'}/>
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-1">Confirmar nova senha</label>
                <div className="relative">
                  <input
                    type={showConfirmar ? 'text' : 'password'}
                    value={confirmarSenha}
                    onChange={e => setConfirmarSenha(e.target.value)}
                    className="w-full px-4 pr-12 py-3 bg-[#0B1520] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowConfirmar(!showConfirmar)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showConfirmar ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'}/>
                    </svg>
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-white font-semibold rounded-full text-sm hover:opacity-90 transition-all disabled:opacity-50"
                style={{ background:'linear-gradient(135deg,#F5A623,#E8951C)' }}
              >
                {loading ? 'Salvando...' : 'Salvar nova senha'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background:'linear-gradient(135deg,#2EBF72,#1A9955)' }}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h2 className="text-white text-xl font-bold mb-2" style={{ fontFamily:'Syne,sans-serif' }}>Senha redefinida!</h2>
            <p className="text-gray-400 text-sm">Você será redirecionado para o login em instantes...</p>
          </div>
        )}
      </div>

      <a href="https://vluma.com.br" target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center justify-center gap-1 text-gray-500 text-xs hover:text-gray-400 transition-colors">
        Desenvolvido por
        <img src="/logo-vluma.png" alt="VLUMA" className="w-5 h-5 rounded-full object-cover mx-1"/>
        <span className="font-bold" style={{ fontFamily:'Syne,sans-serif', background:'linear-gradient(135deg,#F5A623,#2EBF72)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>VLUMA</span>
      </a>
    </div>
  )
}
