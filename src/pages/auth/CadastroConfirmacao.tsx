import { Link } from 'react-router-dom'

export default function CadastroConfirmacao() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: '#0B1520' }}>
      <div className="w-full max-w-md text-center" style={{ backgroundColor: '#0F1D2E', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '40px' }}>
        
        {/* Ícone */}
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #F5A623, #2EBF72)' }}>
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </div>

        <h2 className="text-white text-2xl font-bold mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
          Confirme seu e-mail
        </h2>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Enviamos um link de confirmação para o seu e-mail. Acesse sua caixa de entrada e clique no link para ativar sua conta.
        </p>

        <div className="bg-[#F5A623]/10 border border-[#F5A623]/20 rounded-lg px-4 py-3 mb-6">
          <p className="text-[#F5A623] text-xs">
            Não recebeu o e-mail? Verifique a pasta de spam ou lixo eletrônico.
          </p>
        </div>

        <Link
          to="/login"
          className="w-full py-3 text-white font-semibold rounded-full text-sm hover:opacity-90 transition-all inline-block"
          style={{ background: 'linear-gradient(135deg, #F5A623, #E8951C)' }}
        >
          Ir para o Login
        </Link>
      </div>

      {/* Rodapé VLUMA */}
      <a href="https://vluma.com.br" target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center justify-center gap-1 text-gray-500 text-xs hover:text-gray-400 transition-colors">
        Desenvolvido por
        <img src="/logo-vluma.png" alt="VLUMA" className="w-5 h-5 rounded-full object-cover mx-1"/>
        <span className="font-bold" style={{ fontFamily:'Syne,sans-serif', background:'linear-gradient(135deg,#F5A623,#2EBF72)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>VLUMA</span>
      </a>
    </div>
  )
}
