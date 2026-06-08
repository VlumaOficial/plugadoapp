import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../integrations/supabase/client'

export default function Cadastro() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [slugDisponivel, setSlugDisponivel] = useState<boolean | null>(null)
  const [slugValidando, setSlugValidando] = useState(false)

  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    nomeLoja: '',
    slug: '',
    segmento: '',
    tipoDocumento: 'cpf',
    numeroDocumento: '',
    nomeResponsavel: '',
    endereco: '',
    emailLgpd: '',
    telefone: ''
  })

  // Auto-generate slug from store name
  useEffect(() => {
    if (form.nomeLoja) {
      const slug = form.nomeLoja
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
      setForm(prev => ({ ...prev, slug }))
    }
  }, [form.nomeLoja])

  // Validate slug availability (debounced)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (form.slug && form.slug.length >= 3) {
        setSlugValidando(true)
        try {
          const { data } = await supabase.rpc('slug_disponivel', { p_slug: form.slug })
          setSlugDisponivel(data)
        } catch {
          setSlugDisponivel(false)
        } finally {
          setSlugValidando(false)
        }
      } else {
        setSlugDisponivel(null)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [form.slug])

  // Mask CPF
  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  // Mask CNPJ
  const maskCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  // Mask phone
  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  }

  const handleInputChange = (field: string, value: string) => {
    let maskedValue = value

    if (field === 'numeroDocumento') {
      maskedValue = form.tipoDocumento === 'cpf' ? maskCPF(value) : maskCNPJ(value)
    } else if (field === 'telefone') {
      maskedValue = maskPhone(value)
    }

    setForm(prev => ({ ...prev, [field]: maskedValue }))
  }

  const validateStep1 = () => {
    if (!form.nome || !form.email || !form.senha || !form.confirmarSenha) {
      setError('Todos os campos são obrigatórios.')
      return false
    }
    if (form.senha.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres.')
      return false
    }
    if (form.senha !== form.confirmarSenha) {
      setError('As senhas não coincidem.')
      return false
    }
    setError('')
    return true
  }

  const validateStep2 = () => {
    if (!form.nomeLoja || !form.slug || !form.segmento) {
      setError('Todos os campos são obrigatórios.')
      return false
    }
    if (form.slug.length < 3 || form.slug.length > 30) {
      setError('O slug deve ter entre 3 e 30 caracteres.')
      return false
    }
    if (!slugDisponivel) {
      setError('Este slug já está em uso. Escolha outro.')
      return false
    }
    setError('')
    return true
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleCreateAccount = () => {
    // TODO: Open ModalTermos
    console.log('Abrir ModalTermos')
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
          <div className="mb-6 flex justify-center">
            <svg width="72" height="72" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="ringGradCadastro" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F5A623"/>
                  <stop offset="55%" stopColor="#C8B830"/>
                  <stop offset="100%" stopColor="#2EBF72"/>
                </linearGradient>
              </defs>
              <circle cx="28" cy="28" r="27" fill="url(#ringGradCadastro)"/>
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
            fontSize: '2.2rem',
            marginBottom: '0.75rem'
          }}>
            PLUGADO
          </h1>

          <p className="text-gray-300 text-sm mb-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Seu negócio sempre ligado
          </p>

          <div className="space-y-3 text-left">
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
              <linearGradient id="ringGradMobileCadastro" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5A623"/>
                <stop offset="55%" stopColor="#C8B830"/>
                <stop offset="100%" stopColor="#2EBF72"/>
              </linearGradient>
            </defs>
            <circle cx="28" cy="28" r="27" fill="url(#ringGradMobileCadastro)"/>
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
            Criar conta
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Cadastre sua loja e comece a vender
          </p>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= s 
                      ? 'bg-[#F5A623] text-white' 
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div 
                    className={`w-12 h-0.5 mx-2 ${
                      step > s ? 'bg-[#F5A623]' : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Error Message */}
          <div className="min-h-[44px] mb-2">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Step 1: Access Data */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm mb-2">Nome completo *</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className="w-full px-4 py-3 bg-[#0B1520] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all"
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm mb-2">E-mail *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-[#0B1520] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Senha *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.senha}
                    onChange={(e) => handleInputChange('senha', e.target.value)}
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

              <div>
                <label className="block text-gray-300 text-sm mb-2">Confirmar senha *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={form.confirmarSenha}
                    onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                    className="w-full px-4 pr-12 py-3 bg-[#0B1520] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? (
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

              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-3 text-white font-semibold rounded-full transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:ring-offset-2 focus:ring-offset-[#0B1520]"
                  style={{ background: 'linear-gradient(135deg, #F5A623 0%, #E8951C 100%)' }}
                >
                  Próximo →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Store Data */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm mb-2">Nome da loja *</label>
                <input
                  type="text"
                  value={form.nomeLoja}
                  onChange={(e) => handleInputChange('nomeLoja', e.target.value)}
                  className="w-full px-4 py-3 bg-[#0B1520] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all"
                  placeholder="Minha Loja"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Slug *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="w-full px-4 pr-10 py-3 bg-[#0B1520] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all"
                    placeholder="minha-loja"
                  />
                  {slugValidando && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <div className="w-5 h-5 border-2 border-gray-500 border-t-[#F5A623] rounded-full animate-spin" />
                    </div>
                  )}
                  {!slugValidando && slugDisponivel === true && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  {!slugValidando && slugDisponivel === false && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                </div>
                {form.slug && (
                  <p className="text-gray-500 text-xs mt-2">
                    plugadoapp.com.br/{form.slug}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Segmento *</label>
                <select
                  value={form.segmento}
                  onChange={(e) => handleInputChange('segmento', e.target.value)}
                  className="w-full px-4 py-3 bg-[#0B1520] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all"
                >
                  <option value="">Selecione...</option>
                  <option value="alimentacao">Alimentação</option>
                  <option value="moda">Moda</option>
                  <option value="beleza">Beleza</option>
                  <option value="pet_shop">Pet Shop</option>
                  <option value="servicos">Serviços</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3 text-white font-semibold rounded-full transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:ring-offset-2 focus:ring-offset-[#0B1520]"
                  style={{ background: 'linear-gradient(135deg, #374151 0%, #1F2937 100%)' }}
                >
                  ← Voltar
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3 text-white font-semibold rounded-full transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:ring-offset-2 focus:ring-offset-[#0B1520]"
                  style={{ background: 'linear-gradient(135deg, #F5A623 0%, #E8951C 100%)' }}
                >
                  Próximo →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Legal Data */}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Tipo de documento</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="cpf"
                      checked={form.tipoDocumento === 'cpf'}
                      onChange={(e) => handleInputChange('tipoDocumento', e.target.value)}
                      className="w-4 h-4 accent-[#F5A623]"
                    />
                    <span className="text-gray-300">CPF</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="cnpj"
                      checked={form.tipoDocumento === 'cnpj'}
                      onChange={(e) => handleInputChange('tipoDocumento', e.target.value)}
                      className="w-4 h-4 accent-[#F5A623]"
                    />
                    <span className="text-gray-300">CNPJ</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  {form.tipoDocumento === 'cpf' ? 'CPF' : 'CNPJ'} *
                </label>
                <input
                  type="text"
                  value={form.numeroDocumento}
                  onChange={(e) => handleInputChange('numeroDocumento', e.target.value)}
                  className="w-full px-4 py-2 bg-[#0B1520] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all"
                  placeholder={form.tipoDocumento === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm mb-2">
                  {form.tipoDocumento === 'cpf' ? 'Nome completo' : 'Razão Social'} *
                </label>
                <input
                  type="text"
                  value={form.nomeResponsavel}
                  onChange={(e) => handleInputChange('nomeResponsavel', e.target.value)}
                  className="w-full px-4 py-2 bg-[#0B1520] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all"
                  placeholder={form.tipoDocumento === 'cpf' ? 'Seu nome completo' : 'Razão Social da empresa'}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm mb-2">Endereço</label>
                <input
                  type="text"
                  value={form.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                  className="w-full px-4 py-2 bg-[#0B1520] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all"
                  placeholder="Rua, número, bairro, cidade"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">E-mail LGPD</label>
                <input
                  type="email"
                  value={form.emailLgpd}
                  onChange={(e) => handleInputChange('emailLgpd', e.target.value)}
                  className="w-full px-4 py-2 bg-[#0B1520] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all"
                  placeholder="lgpd@empresa.com"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">Telefone</label>
                <input
                  type="text"
                  value={form.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  className="w-full px-4 py-2 bg-[#0B1520] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3 text-white font-semibold rounded-full transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:ring-offset-2 focus:ring-offset-[#0B1520]"
                  style={{ background: 'linear-gradient(135deg, #374151 0%, #1F2937 100%)' }}
                >
                  ← Voltar
                </button>
                <button
                  type="button"
                  onClick={handleCreateAccount}
                  className="flex-1 py-3 text-white font-semibold rounded-full transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:ring-offset-2 focus:ring-offset-[#0B1520]"
                  style={{ background: 'linear-gradient(135deg, #F5A623 0%, #E8951C 100%)' }}
                >
                  Criar conta
                </button>
              </div>
            </div>
          )}

          {/* Sign In Link */}
          {step !== 3 && (
            <p className="text-center text-gray-400 text-sm mt-6">
              Já tem conta?{' '}
              <Link to="/login" className="text-[#F5A623] hover:text-[#E8951C] font-medium transition-colors">
                Entre
              </Link>
            </p>
          )}
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