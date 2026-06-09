import { useState, useRef, useEffect } from 'react'

interface ModalTermosProps {
  onAceitar: () => void
  onFechar: () => void
}

const TERMOS_USO = `Termos de Uso e Serviço da VLUMA

Seja Bem-Vindo ao Plugado (plugadoapp.com.br), plataforma operada por Simone Queiroz Dórea, inscrita no CNPJ 33.242.353/0001-57, com sede na R. Americano da Costa, 72, Machado, Salvador/BA, CEP 40.455-070.

Antes de explorar tudo o que temos a oferecer, é importante que você entenda e concorde com algumas regras básicas que regem o uso do nosso site plugadoapp.com.br e qualquer outro serviço digital que oferecemos.

Ao usar nosso site e serviços, você automaticamente concorda em seguir as regras que estabelecemos aqui. Caso não concorde com algo, por favor, considere não usar nossos serviços.

1. Aceitando os Termos

Ao navegar e usar o site da VLUMA, você concorda automaticamente com nossas regras e condições. Estamos sempre procurando melhorar, então esses termos podem mudar de vez em quando. Se fizermos alterações significativas, vamos postar as atualizações aqui no site. Continuar usando o site após essas mudanças significa que você aceita os novos termos.

2. Como Usar o Nosso Site

A maior parte do nosso site está aberta para você sem a necessidade de cadastro. No entanto, algumas seções especiais podem exigir que você crie uma conta. Pedimos que você seja honesto ao fornecer suas informações e que mantenha sua senha e login seguros. Se decidir compartilhar algum conteúdo conosco, como comentários, por favor, faça-o de maneira respeitosa e dentro da lei.

3. Sua Privacidade

Na VLUMA, a privacidade é um valor essencial. Ao interagir com nosso site, você aceita nossa Política de Privacidade, que detalha nossa abordagem responsável e conforme às leis para o manejo dos seus dados pessoais. Nosso compromisso é com a transparência e a segurança: explicamos como coletamos, usamos e protegemos suas informações, garantindo sua privacidade e oferecendo controle sobre seus dados.

Adotamos práticas de segurança para proteger suas informações contra acesso não autorizado e compartilhamento indevido, assegurando que qualquer cooperação com terceiros ocorra apenas com base na sua aprovação ou exigências legais claras, reafirmando nosso comprometimento com a sua confiança e segurança digital.

4. Direitos de Conteúdo

O conteúdo disponível no site da VLUMA, incluindo, mas não se limitando a, textos, imagens, ilustrações, designs, ícones, fotografias, programas de computador, videoclipes e áudios, constitui propriedade intelectual protegida tanto pela legislação nacional quanto por tratados internacionais sobre direitos autorais e propriedade industrial.

Ao acessar nosso site, você recebe uma licença limitada, não exclusiva e revogável para visualizar e usar o conteúdo para fins pessoais e não comerciais. Qualquer reprodução, distribuição, transmissão ou modificação do conteúdo, sem a devida autorização escrita da VLUMA, é estritamente proibida.

5. Cookies e Mais

Utilizamos cookies para melhorar sua experiência, coletando informações anônimas durante sua visita, como suas preferências de idioma, duração da visita, páginas acessadas, e outras estatísticas de uso. Esses dados nos ajudam a personalizar seu conteúdo, otimizar a navegação e melhorar continuamente o site.

Se você preferir limitar ou recusar o uso de cookies, a configuração pode ser ajustada através do seu navegador. Isso pode afetar a sua experiência no site, pois algumas funcionalidades dependem dos cookies para funcionar corretamente.

6. Explorando Links Externos

Nosso site pode incluir links para sites externos que achamos que podem ser do seu interesse. Note que não temos controle sobre esses sites externos e, portanto, não somos responsáveis pelo seu conteúdo ou políticas.

7. Mudanças e Atualizações

A evolução é parte de como operamos, o que significa que estes Termos de Uso podem passar por atualizações. Sempre que isso acontecer, você encontrará a versão mais recente disponível aqui. Continuar a acessar o site após essas mudanças indica que você concorda com os novos termos.

Dúvidas ou Comentários? Entre em contato através do e-mail lgpd@plugadoapp.com.br.`

const POLITICA_PRIVACIDADE = `Política de Privacidade da VLUMA

Bem-vindo à VLUMA, operada por Simone Queiroz Dórea, inscrita no CNPJ 33.242.353/0001-57, com sede na R. Americano da Costa, 72, Machado, Salvador/BA, CEP 40.455-070. Nosso compromisso é com a integridade e a segurança dos dados pessoais dos nossos usuários e clientes.

Esta Política de Privacidade aplica-se a todas as interações digitais realizadas em nosso site plugadoapp.com.br, serviços associados, aplicativos móveis e outras plataformas digitais sob nosso controle.

Ao acessar e utilizar nossas plataformas, você reconhece e concorda com as práticas descritas nesta política.

Definições

"Dados Pessoais" são informações que identificam ou podem identificar uma pessoa natural.
"Dados Pessoais Sensíveis" são informações que revelam características pessoais íntimas, como origem racial, convicções religiosas, opiniões políticas, dados genéticos ou biométricos.
"Tratamento de Dados Pessoais" abrange qualquer operação com Dados Pessoais, como coleta, registro, armazenamento, uso, compartilhamento ou destruição.
"Leis de Proteção de Dados" são todas as leis que regulamentam o Tratamento de Dados Pessoais, incluindo a LGPD (Lei Geral de Proteção de Dados Pessoais, Lei nº 13.709/18).

Dados Coletados e Motivos da Coleta

Nós coletamos e processamos os seguintes tipos de dados pessoais:

Informações Fornecidas por Você: Isso inclui nome, sobrenome, endereço de e-mail, endereço físico, informações de pagamento e quaisquer outras informações que você optar por fornecer ao criar uma conta, fazer uma compra ou interagir com nossos serviços.

Informações Coletadas Automaticamente: Quando você visita nosso site, coletamos automaticamente informações sobre seu dispositivo e sua interação com nosso site. Isso pode incluir dados como seu endereço IP, tipo de navegador, detalhes do dispositivo, fuso horário, páginas visitadas e informações sobre como você interage com nosso site.

Uso de Cookies e Tecnologias de Rastreamento

A VLUMA utiliza cookies para melhorar a experiência do usuário em nosso site plugadoapp.com.br, entender como nossos serviços são utilizados e otimizar nossas estratégias.

Tipos de Cookies Utilizados:

Cookies Essenciais: Essenciais para o funcionamento do site, permitindo que você navegue e use suas funcionalidades.

Cookies de Desempenho e Analíticos: Coletam informações sobre como os visitantes usam o nosso site, quais páginas são visitadas com mais frequência e se eles recebem mensagens de erro.

Cookies de Funcionalidade: Permitem que o site lembre de escolhas que você faz e forneça recursos aprimorados e mais pessoais.

Cookies de Publicidade e Redes Sociais: Usados para oferecer anúncios mais relevantes para você e seus interesses.

Finalidades do Processamento de Dados

Os dados coletados são utilizados para:

- Proporcionar, operar e melhorar nossos serviços e ofertas;
- Processar suas transações e enviar notificações relacionadas a suas compras;
- Personalizar sua experiência de usuário;
- Comunicar informações importantes, ofertas e promoções;
- Realizar análises internas para desenvolver e aprimorar nossos serviços;
- Cumprir obrigações legais e regulatórias aplicáveis.

Compartilhamento e Transferência de Dados Pessoais

Nós podemos compartilhar seus dados pessoais com terceiros nas seguintes circunstâncias:

- Com fornecedores de serviços e parceiros que nos auxiliam nas operações de negócio;
- Para cumprir com obrigações legais, responder a processos judiciais, ou proteger nossos direitos;
- Em caso de reestruturação corporativa, venda, fusão ou outra transferência de ativos.

Direitos dos Titulares dos Dados

Você possui diversos direitos em relação aos seus dados pessoais, incluindo:

- O direito de acesso, retificação ou exclusão de seus dados pessoais;
- O direito de limitar ou se opor ao nosso processamento de seus dados;
- O direito à portabilidade de dados;
- O direito de retirar seu consentimento a qualquer momento.

Para exercer esses direitos, entre em contato conosco através do e-mail lgpd@plugadoapp.com.br.

Segurança dos Dados

Implementamos medidas de segurança técnica e organizacional para proteger seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Nos comprometemos a notificar você e qualquer autoridade aplicável de quaisquer brechas de segurança de acordo com a legislação vigente.

Alterações na Política de Privacidade

Nossa Política de Privacidade pode ser atualizada periodicamente. A versão mais atual será sempre publicada em nosso site, indicando a data da última revisão.

Contato

Se tiver dúvidas ou preocupações sobre nossa Política de Privacidade ou práticas de dados, entre em contato pelo e-mail lgpd@plugadoapp.com.br. Estamos comprometidos em resolver quaisquer questões relacionadas à privacidade de nossos usuários e clientes.`

export default function ModalTermos({ onAceitar, onFechar }: ModalTermosProps) {
  const [aba, setAba] = useState<'termos' | 'politica'>('termos')
  const [termosLido, setTermosLido] = useState(false)
  const [politicaLida, setPoliticaLida] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const podeAceitar = termosLido && politicaLida

  useEffect(() => {
    // Reset scroll quando troca de aba
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [aba])

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    // Só marca como lido se o conteúdo realmente tem scroll e chegou ao final
    const temScroll = el.scrollHeight > el.clientHeight + 20
    const chegouFinal = el.scrollHeight - el.scrollTop <= el.clientHeight + 10
    if (temScroll && chegouFinal) {
      if (aba === 'termos') setTermosLido(true)
      if (aba === 'politica') setPoliticaLida(true)
    }
  }

  // Verificar ao trocar de aba se o conteúdo tem scroll
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    setTimeout(() => {
      const temScroll = el.scrollHeight > el.clientHeight + 20
      if (!temScroll) {
        if (aba === 'termos') setTermosLido(true)
        if (aba === 'politica') setPoliticaLida(true)
      }
    }, 300)
  }, [aba])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
      <div className="w-full max-w-2xl flex flex-col" style={{ backgroundColor: '#0F1D2E', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', maxHeight: '90vh' }}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <h2 className="text-white text-lg font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>
            Termos e Política de Privacidade
          </h2>
          <button onClick={onFechar} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Abas */}
        <div className="flex border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <button
            onClick={() => setAba('termos')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${aba === 'termos' ? 'text-[#F5A623] border-b-2 border-[#F5A623]' : 'text-gray-400'}`}
          >
            {termosLido && <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>}
            Termos de Uso
          </button>
          <button
            onClick={() => setAba('politica')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${aba === 'politica' ? 'text-[#F5A623] border-b-2 border-[#F5A623]' : 'text-gray-400'}`}
          >
            {politicaLida && <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>}
            Política de Privacidade
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6"
          style={{ minHeight: 0 }}
        >
          <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">
            {aba === 'termos' ? TERMOS_USO : POLITICA_PRIVACIDADE}
          </p>
          {!((aba === 'termos' && termosLido) || (aba === 'politica' && politicaLida)) && (
            <div className="mt-4 text-center">
              <p className="text-gray-500 text-xs">↓ Role até o final para continuar</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          {!podeAceitar && (
            <p className="text-gray-500 text-xs text-center mb-3">
              Leia os <span className={termosLido ? 'text-green-400' : 'text-[#F5A623]'}>Termos de Uso</span> e a <span className={politicaLida ? 'text-green-400' : 'text-[#F5A623]'}>Política de Privacidade</span> até o final para aceitar.
            </p>
          )}
          <button
            onClick={onAceitar}
            disabled={!podeAceitar}
            className={`w-full py-3 text-white font-semibold rounded-full text-sm transition-all ${podeAceitar ? 'hover:opacity-90' : 'opacity-40 cursor-not-allowed'}`}
            style={{ background: 'linear-gradient(135deg, #F5A623, #E8951C)' }}
          >
            {podeAceitar ? 'Li e aceito os termos' : 'Leia os documentos até o final'}
          </button>
        </div>
      </div>
    </div>
  )
}
