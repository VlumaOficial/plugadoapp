export interface Loja {
  id: string
  user_id: string
  nome_loja: string
  slug: string
  segmento: string | null
  logo_url: string | null
  ativo: boolean
  tipo_documento: 'cpf' | 'cnpj'
  numero_documento: string
  nome_responsavel: string
  endereco: string | null
  email_lgpd: string | null
  telefone: string | null
  criado_em: string
  atualizado_em: string
}
