import { useState, useEffect } from 'react'
import { supabase } from '../../integrations/supabase/client'
import ModalTermos from '../../components/auth/ModalTermos'

export default function Cadastro() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [slugDisponivel, setSlugDisponivel] = useState<boolean | null>(null)
  const [slugValidando, setSlugValidando] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [processando, setProcessando] = useState(false)
  
  const [form, setForm] = useState({
    nome: '', email: '', senha: '', confirmarSenha: '',
    nomeLoja: '', slug: '', segmento: '',
    tipoDocumento: 'cpf', numeroDocumento: '',
    nomeResponsavel: '', endereco: '', emailLgpd: '', telefone: ''
  })

  useEffect(() => {
    if (form.nomeLoja) {
      const slug = form.nomeLoja.toLowerCase().normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '')
        .trim().replace(/\s+/g, '-').replace(/-+/g, '-')
      setForm(prev => ({ ...prev, slug }))
    }
  }, [form.nomeLoja])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (form.slug && form.slug.length >= 3) {
        setSlugValidando(true)
        try {
          const { data } = await supabase.rpc('slug_disponivel', { p_slug: form.slug })
          setSlugDisponivel(data)
        } catch { setSlugDisponivel(false) }
        finally { setSlugValidando(false) }
      } else { setSlugDisponivel(null) }
    }, 500)
    return () => clearTimeout(timer)
  }, [form.slug])

  const maskCPF = (v: string) => v.replace(/\D/g,'').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})/,'$1-$2').replace(/(-\d{2})\d+?$/,'$1')
  const maskCNPJ = (v: string) => v.replace(/\D/g,'').replace(/(\d{2})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1/$2').replace(/(\d{4})(\d)/,'$1-$2').replace(/(-\d{2})\d+?$/,'$1')
  const maskPhone = (v: string) => v.replace(/\D/g,'').replace(/(\d{2})(\d)/,'($1) $2').replace(/(\d{5})(\d)/,'$1-$2').replace(/(-\d{4})\d+?$/,'$1')

  const handleInputChange = (field: string, value: string) => {
    let v = value
    if (field === 'numeroDocumento') v = form.tipoDocumento === 'cpf' ? maskCPF(value) : maskCNPJ(value)
    else if (field === 'telefone') v = maskPhone(value)
    setForm(prev => ({ ...prev, [field]: v }))
  }

  const isEmailValido = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const isCPFValido = (cpf: string) => {
    const c = cpf.replace(/\D/g, '')
    if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false
    let sum = 0
    for (let i = 0; i < 9; i++) sum += parseInt(c[i]) * (10 - i)
    let r = (sum * 10) % 11
    if (r === 10 || r === 11) r = 0
    if (r !== parseInt(c[9])) return false
    sum = 0
    for (let i = 0; i < 10; i++) sum += parseInt(c[i]) * (11 - i)
    r = (sum * 10) % 11
    if (r === 10 || r === 11) r = 0
    return r === parseInt(c[10])
  }

  const isCNPJValido = (cnpj: string) => {
    const c = cnpj.replace(/\D/g, '')
    if (c.length !== 14 || /^(\d)\1+$/.test(c)) return false
    const calc = (c: string, n: number) => {
      let sum = 0
      let pos = n - 7
      for (let i = n; i >= 1; i--) {
        sum += parseInt(c[n - i]) * pos--
        if (pos < 2) pos = 9
      }
      return sum % 11 < 2 ? 0 : 11 - (sum % 11)
    }
    return calc(c, 12) === parseInt(c[12]) && calc(c, 13) === parseInt(c[13])
  }

  const validateStep1 = () => {
    if (!form.nome || !form.email || !form.senha || !form.confirmarSenha) { setError('Todos os campos são obrigatórios.'); return false }
    if (!isEmailValido(form.email)) { setError('E-mail inválido.'); return false }
    if (form.senha.length < 8) { setError('A senha deve ter no mínimo 8 caracteres.'); return false }
    if (form.senha !== form.confirmarSenha) { setError('As senhas não coincidem.'); return false }
    setError(''); return true
  }

  const validateStep2 = () => {
    if (!form.nomeLoja || !form.slug || !form.segmento) { setError('Todos os campos são obrigatórios.'); return false }
    if (form.slug.length < 3 || form.slug.length > 30) { setError('O slug deve ter entre 3 e 30 caracteres.'); return false }
    if (!slugDisponivel) { setError('Este slug já está em uso.'); return false }
    setError(''); return true
  }

  const validateStep3 = () => {
    if (!form.numeroDocumento || !form.nomeResponsavel) { setError('Documento e nome são obrigatórios.'); return false }
    if (form.tipoDocumento === 'cpf' && !isCPFValido(form.numeroDocumento)) { setError('CPF inválido.'); return false }
    if (form.tipoDocumento === 'cnpj' && !isCNPJValido(form.numeroDocumento)) { setError('CNPJ inválido.'); return false }
    if (!form.emailLgpd) { setError('E-mail de contato é obrigatório.'); return false }
  if (!isEmailValido(form.emailLgpd)) { setError('E-mail de contato inválido.'); return false }
    if (form.telefone && form.telefone.replace(/\D/g,'').length < 10) { setError('Telefone inválido.'); return false }
    setError(''); return true
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2)
    else if (step === 2 && validateStep2()) setStep(3)
  }

  const handleBack = () => { if (step > 1) { setStep(step - 1); setError('') } }

  const handleCreateAccount = () => {
    if (validateStep3()) setShowModal(true)
  }

  const handleAceitar = async () => {
    setShowModal(false)
        try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.senha,
        options: { data: { nome: form.nome } }
      })
      if (authError) { setError(authError.message); return }

      const userId = authData.user?.id
      if (!userId) { setError('Erro ao criar usuário.'); return }

      const { error: fnError } = await supabase.functions.invoke('criar-loja', {
        body: {
          user_id: userId,
          nome_loja: form.nomeLoja,
          slug: form.slug,
          segmento: form.segmento,
          tipo_documento: form.tipoDocumento,
          numero_documento: form.numeroDocumento.replace(/\D/g, ''),
          nome_responsavel: form.nomeResponsavel,
          endereco: form.endereco,
          email_lgpd: form.emailLgpd,
          telefone: form.telefone.replace(/\D/g, '')
        }
      })
      if (fnError) { setError('Erro ao salvar dados da loja.'); return }

      window.location.href = '/cadastro-confirmacao'
    } catch { setError('Erro inesperado. Tente novamente.'); setProcessando(false) }
  }

  const Logo = ({ size = 56 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
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

  const ic = "w-full px-3 py-2 bg-[#0B1520] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all text-sm"
  const lc = "block text-gray-300 text-xs mb-1"

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0B1520' }}>
      {/* Painel Esquerdo */}
      <div className="hidden lg:flex lg:w-5/12 flex-col items-center justify-center px-10" style={{ background: 'linear-gradient(135deg, #0B1520 0%, #0F1D2E 100%)' }}>
        <div className="text-center max-w-xs">
          <div className="mb-4 flex justify-center"><Logo size={72}/></div>
          <h1 style={{ fontFamily:'Syne,sans-serif', background:'linear-gradient(90deg,#F5A623,#2EBF72)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', letterSpacing:'0.1em', fontWeight:800, fontSize:'2rem', marginBottom:'0.5rem' }}>PLUGADO</h1>
          <p className="text-gray-400 text-sm mb-6">Seu negócio sempre ligado</p>
          <div className="space-y-3 text-left">
            {[
              { icon:'M5 13l4 4L19 7', color:'#F5A623', title:'Gestão completa', desc:'Pedidos e clientes em um só lugar' },
              { icon:'M13 10V3L4 14h7v7l9-11h-7z', color:'#2EBF72', title:'Vendas rápidas', desc:'Checkout para converter mais' },
              { icon:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color:'#C8B830', title:'Relatórios', desc:'Tome decisões com dados reais' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: item.color + '25' }}>
                  <svg className="w-3.5 h-3.5" style={{ color: item.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon}/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm" style={{ fontFamily:'Syne,sans-serif' }}>{item.title}</h3>
                  <p className="text-gray-400 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Painel Direito */}
      <div className="w-full lg:w-7/12 flex flex-col items-center justify-center min-h-screen px-6 py-8" style={{ backgroundColor: '#0B1520' }}>
        {/* Logo mobile */}
        <div className="flex lg:hidden mb-5 items-center gap-3">
          <Logo size={40}/>
          <h1 style={{ fontFamily:'Syne,sans-serif', background:'linear-gradient(90deg,#F5A623,#2EBF72)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', letterSpacing:'0.1em', fontWeight:800, fontSize:'1.4rem' }}>PLUGADO</h1>
        </div>

        {/* Card */}
        <div className="w-full max-w-lg" style={{ backgroundColor:'#0F1D2E', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'16px', padding:'28px' }}>
          <h2 className="text-white text-xl font-bold mb-1" style={{ fontFamily:'Syne,sans-serif' }}>Criar conta</h2>
          <p className="text-gray-400 text-xs mb-4">Cadastre sua loja e comece a vender</p>

          {/* Steps */}
          <div className="flex items-center mb-4">
            {[1,2,3].map(s => (
              <div key={s} className="flex items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${step >= s ? 'bg-[#F5A623] text-white' : 'bg-gray-700 text-gray-400'}`}>{s}</div>
                {s < 3 && <div className={`w-10 h-0.5 mx-1 ${step > s ? 'bg-[#F5A623]' : 'bg-gray-700'}`}/>}
              </div>
            ))}
          </div>

          {/* Erro */}
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2 rounded-lg text-xs mb-3">{error}</div>}

          {/* Etapa 1 */}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className={lc}>Nome completo *</label>
                <input type="text" value={form.nome} onChange={e => handleInputChange('nome', e.target.value)} className={ic} placeholder="Seu nome completo"/>
              </div>
              <div className="col-span-2">
                <label className={lc}>E-mail *</label>
                <input type="email" value={form.email} onChange={e => handleInputChange('email', e.target.value)} className={ic} placeholder="seu@email.com"/>
              </div>
              <div>
                <label className={lc}>Senha *</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={form.senha} onChange={e => handleInputChange('senha', e.target.value)} className={ic + ' pr-10'} placeholder="mín. 8 caracteres"/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPassword ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'}/></svg>
                  </button>
                </div>
              </div>
              <div>
                <label className={lc}>Confirmar senha *</label>
                <div className="relative">
                  <input type={showConfirmPassword ? 'text' : 'password'} value={form.confirmarSenha} onChange={e => handleInputChange('confirmarSenha', e.target.value)} className={ic + ' pr-10'} placeholder="••••••••"/>
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showConfirmPassword ? 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'}/></svg>
                  </button>
                </div>
              </div>
              <div className="col-span-2">
                <button type="button" onClick={handleNext} className="w-full py-2.5 text-white font-semibold rounded-full text-sm hover:opacity-90 transition-all" style={{ background:'linear-gradient(135deg,#F5A623,#E8951C)' }}>Próximo →</button>
              </div>
            </div>
          )}

          {/* Etapa 2 */}
          {step === 2 && (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className={lc}>Nome da loja *</label>
                <input type="text" value={form.nomeLoja} onChange={e => handleInputChange('nomeLoja', e.target.value)} className={ic} placeholder="Minha Loja"/>
              </div>
              <div>
                <label className={lc}>Slug *</label>
                <div className="relative">
                  <input type="text" value={form.slug} onChange={e => handleInputChange('slug', e.target.value)} className={ic + ' pr-8'} placeholder="minha-loja"/>
                  {slugValidando && <div className="absolute inset-y-0 right-0 pr-2 flex items-center"><div className="w-4 h-4 border-2 border-gray-500 border-t-[#F5A623] rounded-full animate-spin"/></div>}
                  {!slugValidando && slugDisponivel === true && <div className="absolute inset-y-0 right-0 pr-2 flex items-center"><svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg></div>}
                  {!slugValidando && slugDisponivel === false && <div className="absolute inset-y-0 right-0 pr-2 flex items-center"><svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></div>}
                </div>
                {form.slug && <p className="text-gray-500 text-xs mt-1">plugadoapp.com.br/{form.slug}</p>}
              </div>
              <div>
                <label className={lc}>Segmento *</label>
                <select value={form.segmento} onChange={e => handleInputChange('segmento', e.target.value)} className={ic}>
                  <option value="">Selecione...</option>
                  <option value="alimentacao">Alimentação</option>
                  <option value="moda">Moda</option>
                  <option value="beleza">Beleza</option>
                  <option value="pet_shop">Pet Shop</option>
                  <option value="servicos">Serviços</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div className="col-span-2 flex gap-3">
                <button type="button" onClick={handleBack} className="flex-1 py-2.5 text-white font-semibold rounded-full text-sm hover:opacity-90 transition-all" style={{ background:'linear-gradient(135deg,#374151,#1F2937)' }}>← Voltar</button>
                <button type="button" onClick={handleNext} className="flex-1 py-2.5 text-white font-semibold rounded-full text-sm hover:opacity-90 transition-all" style={{ background:'linear-gradient(135deg,#F5A623,#E8951C)' }}>Próximo →</button>
              </div>
            </div>
          )}

          {/* Etapa 3 */}
          {step === 3 && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lc}>Tipo de documento</label>
                <div className="flex gap-3 mt-1">
                  {['cpf','cnpj'].map(t => (
                    <label key={t} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" value={t} checked={form.tipoDocumento === t} onChange={e => { handleInputChange('tipoDocumento', e.target.value); handleInputChange('numeroDocumento', '') }} className="w-3.5 h-3.5 accent-[#F5A623]"/>
                      <span className="text-gray-300 text-sm uppercase">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className={lc}>{form.tipoDocumento === 'cpf' ? 'CPF' : 'CNPJ'} *</label>
                <input type="text" value={form.numeroDocumento} onChange={e => handleInputChange('numeroDocumento', e.target.value)} className={ic} placeholder={form.tipoDocumento === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}/>
              </div>
              <div className="col-span-2">
                <label className={lc}>{form.tipoDocumento === 'cpf' ? 'Nome completo' : 'Razão Social'} *</label>
                <input type="text" value={form.nomeResponsavel} onChange={e => handleInputChange('nomeResponsavel', e.target.value)} className={ic} placeholder={form.tipoDocumento === 'cpf' ? 'Seu nome completo' : 'Razão Social'}/>
              </div>
              <div className="col-span-2">
                <label className={lc}>Endereço</label>
                <input type="text" value={form.endereco} onChange={e => handleInputChange('endereco', e.target.value)} className={ic} placeholder="Rua, número, bairro, cidade"/>
              </div>
              <div>
                <label className={lc}>E-mail de contato *</label>
                <input type="email" value={form.emailLgpd} onChange={e => handleInputChange('emailLgpd', e.target.value)} className={ic} placeholder="contato@empresa.com"/>
              </div>
              <div>
                <label className={lc}>Telefone</label>
                <input type="text" value={form.telefone} onChange={e => handleInputChange('telefone', e.target.value)} className={ic} placeholder="(00) 00000-0000"/>
              </div>
              <div className="col-span-2 flex gap-3">
                <button type="button" onClick={handleBack} className="flex-1 py-2.5 text-white font-semibold rounded-full text-sm hover:opacity-90 transition-all" style={{ background:'linear-gradient(135deg,#374151,#1F2937)' }}>← Voltar</button>
                <button type="button" onClick={handleCreateAccount} disabled={processando} className="flex-1 py-2.5 text-white font-semibold rounded-full text-sm hover:opacity-90 transition-all disabled:opacity-50" style={{ background:'linear-gradient(135deg,#F5A623,#E8951C)' }}>{processando ? 'Processando...' : 'Criar conta'}</button>
              </div>
            </div>
          )}
        </div>

        {showModal && <ModalTermos onAceitar={handleAceitar} onFechar={() => setShowModal(false)}/>}

      {/* Rodapé VLUMA */}
        <a href="https://vluma.com.br" target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center gap-1 text-gray-500 text-xs hover:text-gray-400 transition-colors">
          Desenvolvido por
          <img src="/logo-vluma.png" alt="VLUMA" className="w-5 h-5 rounded-full object-cover mx-1"/>
          <span className="font-bold" style={{ fontFamily:'Syne,sans-serif', background:'linear-gradient(135deg,#F5A623,#2EBF72)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>VLUMA</span>
        </a>
      </div>
    </div>
  )
}
