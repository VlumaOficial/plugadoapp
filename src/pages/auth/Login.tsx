import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../integrations/supabase/client'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message === 'Invalid login credentials') {
          setError('E-mail ou senha incorretos.')
        } else {
          setError('Erro ao entrar. Tente novamente.')
        }
        return
      }

      navigate('/dashboard')
    } catch {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0B1520' }}>
      {/* Left Side - Branding (Desktop only) */}
      <div 
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12"
        style={{ background: 'linear-gradient(135deg, #0B1520 0%, #0F1D2E 100%)' }}
      >
        {/* Content */}
        <div className="text-center max-w-md">
          {/* Large Logo */}
          <div className="mb-8 flex justify-center">
            <svg width="96" height="96" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="ringGradLogin" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F5A623"/>
                  <stop offset="55%" stopColor="#C8B830"/>
                  <stop offset="100%" stopColor="#2EBF72"/>
                </linearGradient>
              </defs>
              <circle cx="28" cy="28" r="27" fill="url(#ringGradLogin)"/>
              <circle cx="28" cy="28" r="23" fill="#0B1520"/>
              <circle cx="17" cy="29" r="5.5" fill="white"/>
              <circle cx="39" cy="29" r="5.5" fill="white"/>
              <path d="M22 23 Q28 15 34 23" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
              <path d="M22 35 Q28 43 34 35" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
            </svg>
          </div>

          <h1 style={{ 
            fontFamily: 'Syne, sans-serif',
            background: 'linear-gradient(90deg, #F5A623, #2EBF72)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.1em',
            fontWeight: 800,
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>
            PLUGADO
          </h1>

          <p className="text-gray-300 text-lg mb-8" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Seu negócio sempre ligado
          </p>

          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F5A623]/20 flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-[#F5A623]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Gestão completa</h3>
                <p className="text-gray-400 text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>Controle estoque, pedidos e clientes em um só lugar</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2EBF72]/20 flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-[#2EBF72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Vendas rápidas</h3>
                <p className="text-gray-400 text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>Checkout otimizado para converter mais visitantes</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C8B830]/20 flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-[#C8B830]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Relatórios detalhados</h3>
                <p className="text-gray-400 text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>Analise seu desempenho e tome decisões inteligentes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div 
        className="w-full lg:w-1/2 flex flex-col items-center justify-center min-h-screen p-6 lg:p-12"
        style={{ backgroundColor: '#0B1520' }}
      >
        {/* Mobile Logo */}
        <div className="flex lg:hidden mb-6 items-center gap-3">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
            <defs>
              <linearGradient id="ringGradMobileLogin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5A623"/>
                <stop offset="55%" stopColor="#C8B830"/>
                <stop offset="100%" stopColor="#2EBF72"/>
              </linearGradient>
            </defs>
            <circle cx="28" cy="28" r="27" fill="url(#ringGradMobileLogin)"/>
            <circle cx="28" cy="28" r="23" fill="#0B1520"/>
            <circle cx="17" cy="29" r="5.5" fill="white"/>
            <circle cx="39" cy="29" r="5.5" fill="white"/>
            <path d="M22 23 Q28 15 34 23" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
            <path d="M22 35 Q28 43 34 35" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
          </svg>
          <h1 style={{ 
            fontFamily: 'Syne, sans-serif',
            background: 'linear-gradient(90deg, #F5A623, #2EBF72)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.1em',
            fontWeight: 800,
            fontSize: '1.5rem'
          }}>
            PLUGADO
          </h1>
        </div>

        {/* Card */}
        <div 
          className="w-full max-w-md"
          style={{ 
            backgroundColor: '#0F1D2E',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px',
            padding: '32px'
          }}
        >
          <h2 className="text-white text-2xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
            Bem-vindo de volta
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Entre na sua conta para gerenciar sua loja
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#0B1520] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all"
                placeholder="seu@email.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 pr-12 py-3 bg-[#0B1520] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white font-semibold rounded-full transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:ring-offset-2 focus:ring-offset-[#0B1520] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #F5A623 0%, #E8951C 100%)' }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-[#F5A623] hover:text-[#E8951C] font-medium transition-colors">
              Cadastre-se
            </Link>
          </p>
        </div>

        {/* Footer */}
        <a 
          href="https://vluma.com.br" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-6 flex items-center justify-center gap-1 text-gray-500 text-sm hover:text-gray-400 transition-colors"
        >
          Desenvolvido por{' '}
          <img src="/logo-vluma.png" alt="VLUMA" className="w-6 h-6 rounded-full object-cover inline mx-1"/>
          <span className="font-bold" style={{ fontFamily: 'Syne, sans-serif', background: 'linear-gradient(135deg, #F5A623 0%, #2EBF72 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            VLUMA
          </span>
        </a>
      </div>
    </div>
  )
}