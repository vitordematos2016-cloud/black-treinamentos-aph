-- ============================================================================
-- APH TREINAMENTOS — SCHEMA OFICIAL SUPABASE (PostgreSQL)
-- Cobre os 3 Projetos (Landing Page, Portal do Aluno LMS, Painel Admin)
-- e todos os 12 Módulos do Sistema.
-- ============================================================================

create extension if not exists "uuid-ossp";

-- 1. INSTRUTORES (Módulo 11: Controle de Instrutores, Permissões e Comissões)
create table if not exists public.instrutores (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  registro_profissional text not null,
  especialidade text not null,
  email text unique not null,
  telefone text,
  comissao_percentual numeric(5,2) not null default 20.00,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

-- 2. CURSOS (Módulo 1: Gestão de Cursos e Carga Horária)
create table if not exists public.cursos (
  id uuid primary key default uuid_generate_v4(),
  titulo text not null,
  slug text unique not null,
  descricao text not null,
  carga_horaria_horas integer not null,
  preco_centavos integer not null,
  modalidade text not null check (modalidade in ('ONLINE', 'PRESENCIAL', 'HIBRIDO', 'IN_COMPANY')),
  total_aulas integer not null default 38,
  total_atividades integer not null default 12,
  total_avaliacoes integer not null default 3,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3. TURMAS E AGENDA (Módulo 8: Agenda, Datas, Locais e Vagas)
create table if not exists public.turmas (
  id uuid primary key default uuid_generate_v4(),
  curso_id uuid not null references public.cursos(id) on delete cascade,
  instrutor_id uuid references public.instrutores(id) on delete set null,
  codigo text unique not null,
  data_inicio date not null,
  local text not null,
  turno text not null default 'Integral',
  vagas_totais integer not null default 30,
  vagas_ocupadas integer not null default 0,
  status text not null default 'ABERTA' check (status in ('ABERTA', 'LOTADA', 'EM_ANDAMENTO', 'CONCLUIDA')),
  created_at timestamptz not null default now()
);

-- 4. MATERIAIS DE APOIO (Módulo 7: Apostilas, Protocolos e Checklists)
create table if not exists public.materiais_apoio (
  id uuid primary key default uuid_generate_v4(),
  curso_id uuid not null references public.cursos(id) on delete cascade,
  titulo text not null,
  tipo text not null check (tipo in ('APOSTILA', 'PROTOCOLO', 'CHECKLIST')),
  formato text not null default 'PDF',
  tamanho_mb numeric(5,2) not null default 2.5,
  arquivo_url text not null,
  created_at timestamptz not null default now()
);

-- 5. EMPRESAS B2B (Módulo 10: Cadastro de Empresas e Treinamentos In Company)
create table if not exists public.empresas_b2b (
  id uuid primary key default uuid_generate_v4(),
  razao_social text not null,
  cnpj text unique not null,
  contato_nome text not null,
  contato_email text not null,
  contato_telefone text not null,
  qtd_colaboradores integer not null default 15,
  status_orcamento text not null default 'EM_ANALISE' check (status_orcamento in ('EM_ANALISE', 'PROPOSTA_ENVIADA', 'APROVADO', 'CONCLUIDO')),
  valor_orcamento_centavos integer not null default 0,
  created_at timestamptz not null default now()
);

-- 6. ALUNOS (Módulo 2: Gestão de Alunos)
create table if not exists public.alunos (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  email text unique not null,
  telefone text not null,
  cpf text unique not null,
  empresa_id uuid references public.empresas_b2b(id) on delete set null,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

-- 7. MATRÍCULAS E PROGRESSO LMS (Módulos 2, 3, 4 e 5)
create table if not exists public.matriculas (
  id uuid primary key default uuid_generate_v4(),
  aluno_id uuid not null references public.alunos(id) on delete cascade,
  curso_id uuid not null references public.cursos(id) on delete cascade,
  turma_id uuid references public.turmas(id) on delete set null,
  gateway_provider text not null default 'MERCADO_PAGO' check (gateway_provider in ('MERCADO_PAGO', 'STRIPE')),
  metodo_pagamento text not null check (metodo_pagamento in ('PIX', 'CARTAO', 'BOLETO')),
  status_pagamento text not null default 'PENDENTE' check (status_pagamento in ('PENDENTE', 'APROVADO', 'RECUSADO', 'RECORRENTE_ATIVO')),
  valor_pago_centavos integer not null,
  progresso_percentual integer not null default 0 check (progresso_percentual between 0 and 100),
  aulas_concluidas integer not null default 0,
  atividades_concluidas integer not null default 0,
  avaliacoes_concluidas integer not null default 0,
  nota_final numeric(4,2) default 0.00,
  created_at timestamptz not null default now()
);

-- 8. CERTIFICADOS AUTOMÁTICOS COM QR CODE (Módulo 4)
create table if not exists public.certificados (
  id uuid primary key default uuid_generate_v4(),
  matricula_id uuid unique not null references public.matriculas(id) on delete cascade,
  codigo_validacao text unique not null,
  qr_code_url text not null,
  carga_horaria_horas integer not null,
  nota_final numeric(4,2) not null,
  emitido_em timestamptz not null default now()
);

-- 9. COMUNICAÇÃO E AVISOS (Módulo 9)
create table if not exists public.comunicados (
  id uuid primary key default uuid_generate_v4(),
  titulo text not null,
  mensagem text not null,
  canal text not null default 'PORTAL_E_EMAIL' check (canal in ('PORTAL', 'EMAIL', 'WHATSAPP', 'PORTAL_E_EMAIL')),
  destinatario text not null default 'TODOS_ALUNOS',
  enviado_em timestamptz not null default now()
);

-- 10. CONFIGURAÇÕES DA PLATAFORMA (Módulo 12: Personalização e White-label)
create table if not exists public.configuracoes_plataforma (
  id integer primary key default 1,
  nome_marca text not null default 'APH Treinamentos',
  responsavel_tecnico text not null default 'Cleve — Bombeiro & Instrutor Chefe',
  cor_primaria text not null default '#E50914',
  cor_fundo text not null default '#0A0A0C',
  dominio_proprio text not null default 'aphtreinamentos.com.br',
  gateway_ativo text not null default 'MERCADO_PAGO' check (gateway_ativo in ('MERCADO_PAGO', 'STRIPE')),
  nota_minima_aprovacao numeric(4,2) not null default 7.00,
  updated_at timestamptz not null default now()
);
