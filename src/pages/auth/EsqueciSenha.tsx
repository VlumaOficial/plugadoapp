import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../integrations/supabase/client'

export default function EsqueciSenha() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { setError('Informe seu e-mail.'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://dev.plugadoapp.com.br/redefinir-senha'
    })
    setLoading(false)
    if (error) { setError('Erro ao enviar e-mail. Tente novamente.'); return }
    setEnviado(true)
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
        
        {!enviado ? (
          <>
            <h2 className="text-white text-xl font-bold mb-2" style={{ fontFamily:'Syne,sans-serif' }}>Esqueci minha senha</h2>
            <p className="text-gray-400 text-sm mb-6">Informe seu e-mail e enviaremos um link para redefinir sua senha.</p>

            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-lg text-sm mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0B1520] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all"
                  placeholder="seu@email.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-white font-semibold rounded-full text-sm hover:opacity-90 transition-all disabled:opacity-50"
                style={{ background:'linear-gradient(135deg,#F5A623,#E8951C)' }}
              >
                {loading ? 'Enviando...' : 'Enviar link de redefinição'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background:'linear-gradient(135deg,#F5A623,#2EBF72)' }}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <h2 className="text-white text-xl font-bold mb-2" style={{ fontFamily:'Syne,sans-serif' }}>E-mail enviado!</h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Enviamos um link para <strong className="text-white">{email}</strong>. Verifique sua caixa de entrada e clique no link para redefinir sua senha.
            </p>
            <p className="text-gray-500 text-xs mb-6">Não recebeu? Verifique a pasta de spam.</p>
          </div>
        )}

        <p className="text-center text-gray-400 text-sm mt-6">
          <Link to="/login" className="text-[#F5A623] hover:text-[#E8951C] font-medium transition-colors">← Voltar para o login</Link>
        </p>
      </div>

      <a href="https://vluma.com.br" target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center justify-center gap-1 text-gray-500 text-xs hover:text-gray-400 transition-colors">
        Desenvolvido por
        <img src="/logo-vluma.png" alt="VLUMA" className="w-5 h-5 rounded-full object-cover mx-1"/>
        <span className="font-bold" style={{ fontFamily:'Syne,sans-serif', background:'linear-gradient(135deg,#F5A623,#2EBF72)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>VLUMA</span>
      </a>
    </div>
  )
}
