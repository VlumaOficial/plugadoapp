import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const {
      user_id, nome_loja, slug, segmento,
      tipo_documento, numero_documento,
      nome_responsavel, endereco,
      email_lgpd, telefone
    } = body

    if (!user_id || !nome_loja || !slug || !tipo_documento || !numero_documento || !nome_responsavel || !email_lgpd) {
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios faltando.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Usar service_role para bypass de RLS
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Inserir loja
    const { error: lojaError } = await supabase.from('lojas').insert({
      user_id,
      nome_loja,
      slug,
      segmento,
      tipo_documento,
      numero_documento,
      nome_responsavel,
      endereco,
      email_lgpd,
      telefone
    })

    if (lojaError) {
      return new Response(
        JSON.stringify({ error: lojaError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Registrar aceite dos termos
    await supabase.from('aceites_termos').insert({
      user_id,
      versao_termos: '1.0',
      versao_politica: '1.0'
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
