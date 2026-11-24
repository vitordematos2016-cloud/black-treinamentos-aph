# SOP-01: Arquitetura de Dados "Águas Calmas" & Supabase (12 Módulos)

## 1. Objetivo
Garantir uma separação limpa e determinística entre os **3 Projetos** da **APH Treinamentos** (Cleve), mantendo uma única Fonte da Verdade no **Supabase** (com fallback local reativo para desenvolvimento/demonstração imediata).

## 2. Separação Modular ("Águas Calmas")
- **Módulo 1 (`/`) — Landing Page Comercial:** Vitrine de alta conversão, agenda de turmas, solicitação de treinamento *In Company* (B2B), validação pública de certificados por QR Code e Checkout integrado.
- **Módulo 2 (`/aluno`) — Portal do Aluno (LMS + Mobile PWA):** Ambiente de estudos com videoaulas, apostilas/protocolos, atividades, provas online com correção imediata e emissão de certificado.
- **Módulo 3 (`/admin`) — Painel Administrativo:** Gestão completa dos 12 módulos, KPIs financeiros (Matrículas, Alunos Ativos, Faturamento, Lucro Líquido e Margem %) e gráficos de evolução.

## 3. Entidades dos 12 Módulos no Supabase
1. `cursos` & `curso_modulos` & `aulas` (Módulo 1: Gestão de Cursos)
2. `alunos` & `matriculas` (Módulo 2: Gestão de Alunos)
3. `atividades_avaliacoes` & `submissoes_alunos` (Módulo 3: Atividades e Avaliações)
4. `certificados` (Módulo 4: Certificados Automáticos com QR Code)
5. `transacoes_pagamento` (Módulo 5: Pagamentos Integrados MP/Stripe)
6. `relatorios_financeiros` (Módulo 6: Relatórios Gerenciais)
7. `materiais_apoio` (Módulo 7: Apostilas, Protocolos e Checklists)
8. `turmas_agenda` (Módulo 8: Agenda, Datas, Locais e Vagas)
9. `comunicados_notificacoes` (Módulo 9: Comunicação com Alunos)
10. `empresas_b2b` (Módulo 10: Cadastro de Empresas / In Company)
11. `instrutores` (Módulo 11: Controle de Instrutores e Comissões)
12. `configuracoes_plataforma` (Módulo 12: Personalização da Plataforma)

## 4. Casos de Borda
- Se `VITE_SUPABASE_URL` estiver vazio no `.env`, o repositório de dados deve operar automaticamente em modo `LOCAL_SYNC_STORE` com os dados iniciais oficiais da APH Treinamentos, sincronizando alterações em tempo real entre as 3 rotas (`/`, `/aluno`, `/admin`).
