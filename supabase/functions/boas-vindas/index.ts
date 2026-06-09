import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const emailTemplate = (nomeLoja: string) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0B1520; padding: 40px 20px;">

  <!-- Logo -->
  <div style="text-align: center; margin-bottom: 32px;">
    <svg width="48" height="48" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 10px;">
      <defs>
        <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F5A623"/>
          <stop offset="55%" stop-color="#C8B830"/>
          <stop offset="100%" stop-color="#2EBF72"/>
        </linearGradient>
      </defs>
      <circle cx="28" cy="28" r="27" fill="url(#rg)"/>
      <circle cx="28" cy="28" r="23" fill="#0B1520"/>
      <circle cx="17" cy="29" r="5.5" fill="white"/>
      <circle cx="39" cy="29" r="5.5" fill="white"/>
      <path d="M22 23 Q28 15 34 23" stroke="white" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <path d="M22 35 Q28 43 34 35" stroke="white" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    </svg>
    <span style="font-size: 22px; font-weight: 800; letter-spacing: 3px; color: #F5A623; vertical-align: middle;">PLUGADO</span>
  </div>

  <!-- Card -->
  <div style="background-color: #0F1D2E; border: 1px solid #1E3A5F; border-radius: 16px; padding: 40px 32px; text-align: center;">

    <!-- Ícone -->
    <div style="width: 64px; height: 64px; border-radius: 50%; background-color: #2EBF72; margin: 0 auto 24px; text-align: center;">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-top: 16px;">
        <path d="M5 13l4 4L19 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <h2 style="color: #F7F9FB; font-size: 22px; font-weight: 700; margin: 0 0 12px;">
      Sua loja está ativa! 🎉
    </h2>

    <p style="color: #8A9BB0; font-size: 14px; line-height: 1.7; margin: 0 0 8px;">
      Bem-vindo ao <strong style="color: #F7F9FB;">Plugado</strong>!
    </p>

    <p style="color: #8A9BB0; font-size: 14px; line-height: 1.7; margin: 0 0 32px;">
      Sua loja <strong style="color: #F5A623;">${nomeLoja}</strong> foi criada com sucesso e já está pronta para receber pedidos.
    </p>

    <a href="https://dev.plugadoapp.com.br/login" style="display: inline-block; background-color: #F5A623; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 50px; font-size: 15px; font-weight: 600;">
      Acessar minha loja
    </a>

    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #1E3A5F;">
      <p style="color: #8A9BB0; font-size: 13px; margin: 0 0 8px;">O que você pode fazer agora:</p>
      <table cellpadding="0" cellspacing="0" style="width: 100%; text-align: left;">
        <tr>
          <td style="padding: 8px 0; color: #8A9BB0; font-size: 13px;">✅ &nbsp;Cadastrar seus produtos</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #8A9BB0; font-size: 13px;">✅ &nbsp;Personalizar sua vitrine</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #8A9BB0; font-size: 13px;">✅ &nbsp;Compartilhar seu link e começar a vender</td>
        </tr>
      </table>
    </div>
  </div>

  <!-- Rodapé -->
  <div style="text-align: center; margin-top: 24px;">
    <p style="color: #4A5568; font-size: 12px; margin: 0;">
      © 2025 <strong style="color: #F5A623;">PLUGADO</strong> · 
      <a href="https://plugadoapp.com.br" style="color: #8A9BB0; text-decoration: none;">plugadoapp.com.br</a>
    </p>
    <p style="color: #4A5568; font-size: 11px; margin: 6px 0 0;">
      Operado por CNPJ 33.242.353/0001-57
    </p>
  </div>

</div>
`

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id } = await req.json()

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'user_id obrigatório.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Buscar dados do usuário e loja
    const { data: userData } = await supabase.auth.admin.getUserById(user_id)
    const { data: lojaData } = await supabase
      .from('lojas')
      .select('nome_loja')
      .eq('user_id', user_id)
      .single()

    if (!userData?.user?.email || !lojaData) {
      return new Response(
        JSON.stringify({ error: 'Usuário ou loja não encontrados.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Enviar e-mail via SMTP do Supabase
    const { error: emailError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: userData.user.email,
    })

    // Usar o mailer interno do Supabase
    await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
      },
      body: JSON.stringify({
        to: userData.user.email,
        subject: 'Bem-vindo ao Plugado! Sua loja está ativa 🎉',
        html: emailTemplate(lojaData.nome_loja)
      })
    })

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Erro interno.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
