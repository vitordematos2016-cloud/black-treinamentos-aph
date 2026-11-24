# 📋 Task Plan — Ecossistema BLACK Treinamentos - Resgate & APH (Protocolo V.L.A.E.G.)

> **Status Atual:** `3 PROJETOS CONSTRUÍDOS E INTEGRADOS` → Em fase de **Refinamento Fino (Fase 4 — Estilo)** na Landing Page Comercial.
> **Marca Oficial:** `BLACK TREINAMENTOS RESGATE E APH` (CNPJ `58.279.230/0001-10` • `Guaraniaçu – PR`)
> **Cliente / Diretor Responsável:** Cleverson da Cruz (`Cleverson Black` / Cleve)
> **Desenvolvedor:** Vitor de Matos
> **Infraestrutura Alvo:** Supabase (Banco de Dados) + Mercado Pago / Stripe (Adapter pronto) + Hostinger VPS 2 (Web + Mobile Responsivo).

---

## 🟢 Protocolo 0, Fase 1 (Visão) e Fase 2 (Link) — CONCLUÍDOS
- [x] Memória do Projeto inicializada e mantida em tempo real (`task_plan.md`, `findings.md`, `progress.md`, `gemini.MD`).
- [x] POPs da Camada 1 criados em `architecture/` (`SOP-01`, `SOP-02`, `SOP-03`).
- [x] Schema completo do **Supabase** criado em `supabase_schema.sql` (cobrindo os 12 módulos).
- [x] Variáveis de ambiente documentadas em `.env.example` (Supabase, Mercado Pago e Stripe).
- [x] Ferramentas Python da Camada 3 criadas em `tools/` (`verify_links_handshake.py`, `prepare_assets.py`).

---

## 🟢 Fase 3: Construção dos 3 Projetos com Code-Splitting (`React.lazy`) — CONCLUÍDA
- [x] **Projeto 1: Landing Page Comercial (`/?view=landing`)**
  - `src/components/NavbarAndHero.jsx` + `src/components/Hero3DLogoStage.jsx` (Header + Hero com fundo desfocado dos socorristas, Logo 3D sem bordas escuras que sobe girando 5x, estoura raios vermelhos, pousa no ponto de referência e pode ser arrastada com retorno elástico + Faixa de 4 Diferenciais).
  - `src/components/CoursesSection.jsx` (Fundo claro de contraste + 3 cards + Destaque da Turma Presencial do **Curso de Socorrista 200 Horas** com início em `13/02/2027` aos sábados na Unicesumar + Tabela dos **11 Módulos Oficiais = 200h**).
  - `src/components/InstructorsShowcase.jsx` (Cartões Credenciais 3D Flip Frente e Verso dos 5 instrutores com efeito sonoro Web Audio API, giro em cascata e modal lado a lado).
  - `src/components/JourneyAndCertification.jsx` + `src/components/OfficialCertificateViewer.jsx` (Como Funciona em 4 passos + Certificado Oficial Frente e Verso de 200h com conformidade Lei nº 9.394/96 LDB + Depoimentos ocultos por padrão + FAQ de 10 perguntas + CTA Final e Rodapé com CNPJ `58.279.230/0001-10` e `Guaraniaçu – PR`).
- [x] **Projeto 2: Portal do Aluno — LMS + Versão Mobile (`/?view=aluno`)**
  - `src/components/StudentPortalLMS.jsx` (Sidebar de 10 itens, Progresso 72%, Sala de Aula com os 11 Módulos de 200h, Simulador de Avaliação Final, Materiais de Apoio, Emissão/Impressão limpa de 2 páginas do Certificado Oficial Frente e Verso e Modo Smartphone Mobile).
- [x] **Projeto 3: Painel Administrativo — Cleve (`/?view=admin`)**
  - `src/components/AdminDashboard.jsx` (KPIs de Matrículas, Alunos, Faturamento `R$ 18.940,00`, Lucro Líquido `R$ 11.320,00`, Gráfico de 6 meses, Matrículas por Curso, Tabela de Matrículas com Emissor de Certificado 200h em tempo real e Seletor de Gateway Mercado Pago / Stripe).

---

## 🟡 Fase 4: E — Estilo (Refinamento Seção por Seção com o Usuário)
- [x] Refinamento do Certificado Oficial (Frente + Verso 200h) e impressão limpa de 2 páginas A4.
- [x] Refinamento da Seção de Instrutores (Cartões 3D Flip Frente/Verso + Som 3D + Atualização `info iverson.png`).
- [x] Refinamento da Aba Início / Hero (Fundo desfocado dos socorristas + Logo 3D sem bordas escuras + Subida 5 giros + Raios vermelhos + Queda sem raio no chão + Arraste elástico).
- [ ] Próximos ajustes visuais solicitados pelo usuário nas seções seguintes.

---

## ⚪ Fase 5: G — Gatilho (Deploy Hostinger VPS 2 & Conexão Produção Supabase)
- [ ] Conectar credenciais definitivas do Supabase e do Gateway escolhido pelo Cleve no `.env`.
- [ ] Publicar na Hostinger VPS 2.
