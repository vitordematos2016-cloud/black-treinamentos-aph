# 📈 Progress Log — Ecossistema APH Treinamentos

## [2026-11-22] Protocolo 0: Inicialização (V.L.A.E.G.)
- **O que foi feito:**
  - Leitura e mapeamento completo da imagem de arquitetura comercial/funcional da **APH Treinamentos** (3 projetos + 12 módulos + fluxo completo do aluno + versão mobile).
  - Inicialização dos arquivos `task_plan.md`, `findings.md`, `progress.md` e `gemini.MD`.

## [2026-11-22] Fase 1: V — Visão (Respostas de Descoberta & Blueprint)
- **O que foi feito:**
  - Consolidação das 5 respostas do usuário:
    1. **Arquitetura Integrada "Águas Calmas":** Os 3 projetos integrados no mesmo ecossistema, mas com rotas e pastas perfeitamente isoladas e organizadas.
    2. **Integrações:** **Supabase** para banco de dados + camada de pagamento pré-estruturada (Adapter Pattern) para **Mercado Pago** e **Stripe** (aguardando definição final do cliente **Cleve**, bombeiro).
    3. **Fonte da Verdade:** **Supabase** (com fallback local reativo para uso imediato).
    4. **Payload de Entrega:** Hospedagem na **Hostinger VPS 2** e estratégia **Web Responsiva + PWA** para mobile (sem custos e comissões da Apple/Google).
    5. **Regras Comportamentais & Sequência:** Definidas regras sugeridas para o negócio de APH do Cleve e proposta a ordem de construção: **1º Landing Page Comercial** → **2º Portal do Aluno (LMS + Mobile)** → **3º Painel Administrativo**.
- **Erros encontrados:** Nenhum.
- **Próximo Passo:** Aguardar o "OK / Pode continuar" do usuário para iniciar a Fase 2 (Link) e a construção do Projeto 1 (Landing Page Comercial) integrado à base dos 3 projetos.

## [2026-11-22] Fase 2: L — Link (Conectividade, Schema Supabase & POPs A.N.T.)
- **O que foi feito:**
  - Criação do arquivo `.env.example` estruturado para **Supabase**, **Mercado Pago** e **Stripe**.
  - Criação do schema completo de banco de dados do Supabase em `supabase_schema.sql` cobrindo todas as tabelas dos 12 módulos da **APH Treinamentos**.
  - Criação dos POPs da Camada 1 (`architecture/`):
    - `architecture/SOP-01_ecossistema_dados_supabase.md`
    - `architecture/SOP-02_gateway_pagamentos_mp_stripe.md`
    - `architecture/SOP-03_fluxo_aluno_certificado_qrcode.md`
  - Criação e execução do script de Handshake da Camada 3 (`tools/verify_links_handshake.py`), gerando o relatório `.tmp/handshake_report.json`.
- **Próximo Passo:** Receber as referências visuais do usuário para iniciar o desenvolvimento fiel do **Projeto 1 (Landing Page Comercial)** integrado à arquitetura dos 3 projetos.

## [2026-11-22] Fase 3 & 4: Construção Completa da Landing Page `BLACK Treinamentos - Resgate & APH`
- **O que foi feito:**
  - Processamento determinístico dos ativos visuais (`tools/prepare_assets.py`):
    - Extração limpa da logomarca oficial `BLACK Treinamentos - Resgate & APH`.
    - Extração e tratamento das fotos dos **5 instrutores reais** (Cleverson Black, Iverson Rodrigo, Érica Raquel de Oliveira, Wagner Ricardo dos Santos "Brita" e Salete da Silva) eliminando o fundo verde-limão das artes antigas.
    - Extração limpa da foto do socorrista do Hero e das miniaturas dos 3 cursos de referência do mockup.
  - Construção completa das **10 seções oficiais do Briefing PDF** em React + Tailwind CSS:
    - `01. Header` + `02. Hero` + `03. Faixa de Diferenciais` (`src/components/NavbarAndHero.jsx`).
    - `04. Nossos Treinamentos` em fundo claro de alto contraste + Destaque da Turma Presencial do **Curso de Socorrista (13/02/2027 - Unicesumar)** + Grade de 6 Módulos extraída de `imagem jornal.png` (`src/components/CoursesSection.jsx`).
    - `05. Apresentação Especial da Equipe de 5 Instrutores` com Manifesto do Cleverson Black, Seletor Interativo dos 5 Especialistas, Dossiê Operacional Completo e Lightbox das fichas originais (`src/components/InstructorsShowcase.jsx`).
    - `06. Como Funcionam (4 passos)` + `07. Certificação (com modelo visual e consulta de código)` + `08. Depoimentos (oculto por padrão conforme PDF, com botão de teste)` + `09. FAQ Acordeão (10 perguntas oficiais)` + `10. CTA Final, Modal de Pré-Inscrição e Rodapé` (`src/components/JourneyAndCertification.jsx`).
- **Status:** Build validado e servidor local ativo em `http://localhost:5173`.

## [2026-11-22] Construção Completa do Projeto 2: Portal do Aluno (LMS + Versão Mobile App)
- **O que foi feito:**
  - Extração determinística dos ativos visuais de `Painel APH_ Emergência em Preparação.png` via `tools/prepare_assets.py` (`lms-hero-banner.jpg`, `lms-sidebar-ambulancia.jpg`, `lms-curso-1..4.jpg`, `lms-manual-aph.jpg`, `lms-certificado-thumb.jpg`, `lms-avatar-aluno.jpg`).
  - Construção 1:1 do **Portal do Aluno (LMS)** em `src/components/StudentPortalLMS.jsx`:
    - Sidebar esquerda com a logo oficial `BLACK Treinamentos`, os 10 menus exatos da referência (*Painel do Aluno, Meus Cursos, Atividades, Avaliações, Certificados, Materiais de Apoio, Calendário, Comunicados [2], Suporte, Configurações*) e o card inferior da ambulância (*"Emergência é preparação!"*).
    - Topbar com *"Meu Ambiente de Estudos"*, busca em tempo real, botão de alternância para a **Versão Mobile (Smartphone App)**, sino com badge `2` e perfil do aluno **Vitor Matos**.
    - Banner principal do curso em andamento (*APH – Atendimento Pré-Hospitalar*) com botões *"Continuar Curso"* e *"Ver Módulos"*.
    - Faixa de 4 indicadores (*6 Cursos Matriculados, 38 Aulas Assistidas, 12 Atividades Concluídas, 3 Certificados Emitidos*).
    - Seção *Meus Cursos* com os 4 cards horizontais e barras de progresso (*72%, 0%, 45%, 100%*).
    - Cards inferiores de *Materiais de Apoio* (com o Manual de APH) e *Certificados*.
    - Coluna direita com os 3 widgets: *Meu Progresso Geral (Donut 72% + 3 pílulas)*, *Próximas Atividades* e *Calendário de Estudos (Novembro 2026)*.
    - Modais funcionais de Sala de Aula, Simulador de Avaliação Online de APH, Biblioteca de Materiais e Certificado com QR Code + Modo Smartphone Mobile.
  - Integração no `src/App.jsx` com barra flutuante inferior permitindo alternar com 1 clique entre `1. Landing Page` e `2. Portal do Aluno (LMS)`.

## [2026-11-22] Construção Completa do Projeto 3: Painel Administrativo (Gestão e Controle — Cleve)
- **O que foi feito:**
  - Construção 1:1 do **Painel Administrativo** em `src/components/AdminDashboard.jsx` fiel à referência `Painel admin APH Treinamentos em Destaque.png`:
    - Sidebar esquerda com a logo oficial `BLACK Treinamentos - Resgate & APH`, subtítulo *"Gestão e Controle"*, os 3 grupos de navegação (*PAINEL PRINCIPAL*, *GESTÃO FINANCEIRA*, *OPERAÇÕES*) e o card inferior *"Suporte Interno"*.
    - Topbar com *"Painel de Controle — Gestão completa dos cursos, alunos, matrículas e resultados"*, busca em tempo real, sino com badge `3` e perfil **Cleve (Administrador)**.
    - Linha 1 (4 KPIs com sparklines SVG): `127 Matrículas (Mês) ▲ +28%`, `362 Alunos Ativos ▲ +17%`, `6 Cursos Ativos` e `298 Certificados Emitidos ▲ +35%`.
    - Linha 2 (3 Cards Financeiros): `Faturamento (Mês) R$ 18.940,00 (▲ +32%)`, `Lucro Líquido (Mês) R$ 11.320,00 (Margem 59,8%)` e DRE Resumo (`Receitas R$ 18.940,00`, `Despesas R$ 7.620,00`, `Lucro R$ 11.320,00`).
    - Linha 3 (3 Gráficos Centrais): Gráfico de barras *Faturamento dos Últimos 6 Meses* (`Jun R$ 8.420` a `Nov R$ 18.940`), Gráfico Donut *Matrículas por Curso* (`127 Matrículas` distribuídas nos 5 segmentos) e *Desempenho Geral* (`Conclusão 82,4%`, `Aprovação 91,7%`, `Evasão 8,3%`).
    - Linha 4 (Operação): Tabela *Últimas Matrículas* (*Rafael Martins, Juliana Andrade, Carlos Ferreira, Mariana Lopes, Diego Silva*), *Pendências e Ações* e grade 3x2 de *Ações Rápidas* (com modais funcionais para registrar Nova Matrícula atualizando os KPIs na hora, Configurar Gateway Mercado Pago / Stripe, Gerenciar os 5 Instrutores e Disparar Comunicados).
  - Barra flutuante unificada em `src/App.jsx` conectando os 3 projetos (`1. Landing Page`, `2. Portal do Aluno`, `3. Painel Admin`).

## [2026-11-22] Integração do Certificado Oficial (Frente e Verso — 200h) nas 3 Páginas
- **O que foi feito:**
  - Criação do componente `src/components/OfficialCertificateViewer.jsx` com visualização interativa da **Frente (Certificado de Conclusão)**, **Verso (Conteúdo Programático 200h - 11 Módulos)** e modo **Lado a Lado**, além de preenchimento dinâmico de Nome, CPF, Período e Data sobre o modelo oficial.
  - Atualização da **Página 1 (Landing Page)**:
    - Inclusão da tabela oficial dos **11 Módulos (200 horas)** do Curso de Socorrista em `src/components/CoursesSection.jsx`.
    - Inclusão do Certificado Oficial (Frente e Verso), da base legal **Lei nº 9.394/96 (LDB)** e dos dados empresariais (**CNPJ 58.279.230/0001-10 • Guaraniaçu – PR • Diretor e Instrutor Responsável: Cleverson da Cruz**) em `src/components/JourneyAndCertification.jsx`.
  - Atualização da **Página 2 (Portal do Aluno LMS)**:
    - Sala de aula atualizada com os **11 Módulos Oficiais (200h)**, miniatura do certificado real no dashboard e modal de emissão do Certificado (Frente e Verso) preenchido com os dados do aluno **Vitor Matos**.
  - Atualização da **Página 3 (Painel Administrativo)**:
    - Inclusão do **Emissor Oficial de Certificados (200h)** onde o **Cleve (`Cleverson da Cruz`)** pode clicar em *"Emitir 200h"* em qualquer aluno da tabela de matrículas, editar Nome, CPF, Período e Data ao vivo e imprimir/gerar o PDF Frente e Verso.

## [2026-11-22] Atualização da Seção 05: Cartões 3D Flip Interativos dos 5 Instrutores (Frente Capa + Verso Qualificações)
- **O que foi feito:**
  - Cópia automática dos 10 arquivos de cartões oficiais (`capa black/iverson/erika/wagner/salete.png` e `info black/iverson/erica/wagner/salete.png`) para `public/assets/card-*-frente.png` e `public/assets/card-*-verso.png`.
  - Redesenho da seção **Conheça Nossa Equipe de Instrutores** (`src/components/InstructorsShowcase.jsx`) com **Cartões Credenciais 3D Interativos (3D Flip Cards)**:
    - Ao clicar em qualquer cartão, ele gira 180° em 3D (`perspective: 1400px`, `rotateY(180deg)` com física elástica suave e reflexo holográfico no hover), revelando o verso oficial com todas as qualificações, formação, experiência e áreas de atuação.
    - Botão global **"Girar Todos os 5 Cartões (Ver Todos os Currículos)"** para virar todos os crachás de uma só vez.
    - Botão **"Ampliar"** em cada cartão para abrir o modal de alta resolução com **Frente e Verso lado a lado**.

## [2026-11-22] Refinamentos de Alta Fidelidade & Performance
- **1. Impressão Limpa do Certificado Oficial (2 Páginas A4 sem escritas externas):**
  - Atualizado `src/components/OfficialCertificateViewer.jsx` com motor de renderização Canvas 2x (`1536x2048`) + `iframe` de impressão isolado (`@page { size: A4 portrait; margin: 0mm; }`), imprimindo exclusivamente a **Folha 1 (Frente com Nome, CPF, Período e Data)** e a **Folha 2 (Verso com Conteúdo Programático 200h - 11 Módulos)**.
- **2. Cartões Credenciais 3D Flip dos 5 Instrutores + Áudio Físico (Web Audio API):**
  - Atualizado `src/components/InstructorsShowcase.jsx` com as capas (`capa *.png`) e versos (`info *.png`, incluindo `info iverson.png` atualizado) dos 5 instrutores.
  - Adicionado giro 3D de 180° ao clicar, efeito cascata ao girar todos os 5 cartões e sintetizador sonoro Web Audio API (*Whoosh* + *Snap* tático) com botão de ativar/silenciar.
- **3. Otimização e Leveza dos 3 Projetos Juntos (Code-Splitting):**
  - Aplicado `React.lazy()` + `Suspense` em `src/App.jsx` separando os pacotes compilados de `StudentPortalLMS` (~9.4 KB gzip) e `AdminDashboard` (~9.5 KB gzip) para que a Landing Page Comercial carregue zero peso extra.
- **4. Hero Section com Logo 3D sem Bordas Escuras + Raios Vermelhos + Fundo Desfocado dos Socorristas:**
  - Extraída a geometria pura da Logo 3D (`public/assets/logo-3d-hero-noborder.png`) via `tools/prepare_assets.py` sem nenhum fundo preto ou halo escuro.
  - Adicionada a imagem dos dois socorristas com a ambulância (`public/assets/hero-bg-socorristas.jpg`) levemente desfocada (`blur`) no fundo de toda a seção Início (`src/components/NavbarAndHero.jsx`).
  - Coreografia em `src/components/Hero3DLogoStage.jsx`: sobe girando 5x → para reta no alto e estoura raios vermelhos (`#ED101C`) → desce suave para o ponto de referência (sem raio no chão) → permite arrastar para os lados e soltar para retornar com mola elástica.

## [2026-11-22] Refinamento do Header / Barra Fixa de Navegação (Giroflex Ambulância + Logo HD + Scroll-Spy)
- **O que foi feito:**
  - Gerada versão de alta nitidez da logo para o cabeçalho (`public/assets/logo-header-sharp.png`) com filtro *UnsharpMask*, recorte justo e aumento de escala (`h-12 sm:h-14 lg:h-[58px]`) mais centralizada no container.
  - Transformado o Header fixo em uma barra moderna contornada por uma **luz vermelha (`#ED101C`) e branca (`#FFFFFF`) girando 360° continuamente** em volta de toda a borda (`.navbar-ambulance-border` em `src/index.css`), remetendo ao giroflex de uma ambulância.
  - Implementado **Scroll-Spy em tempo real** em `src/components/NavbarAndHero.jsx`: conforme o usuário rola a página para baixo ou para cima (`Início`, `Cursos`, `Equipe`, `Como Funciona`, `Certificação`, `FAQ`, `Contato`), a aba correspondente acende automaticamente com cápsula iluminada, LED pulsante vermelho/branco e barra inferior.

## [2026-11-22] Limpeza Visual do Palco 3D + Raios Discretos ao Clicar/Tocar (PC e Mobile)
- **O que foi feito:**
  - Removidos os dois botões/etiquetas inferiores (*"Arraste a Logo 3D para os lados e solte"* e *"Repetir Entrada 3D + Raios"*) de `src/components/Hero3DLogoStage.jsx`.
  - Mantido o efeito completo de entrada (subida girando 5x + estouro de raios + descida) exclusivamente ao abrir/recarregar a página.
  - Adicionado disparo de raios vermelhos modernos e discretos (`triggerRedLightning`) diretamente a partir da Logo 3D sempre que o usuário clicar (no PC) ou tocar (no celular) em cima da logo, mantendo também o arraste lateral com retorno elástico ao soltar.

## [2026-11-22] Redesenho 1:1 da Seção de Cursos (`#cursos` — Socorrista de Costas com Ambulância)
- **O que foi feito:**
  - Salvas automaticamente na pasta `referencias/` as duas imagens enviadas pelo usuário (`referencias/ref-layout-secao-curso-socorrista.jpg` e `referencias/socorrista-costas-ambulancia.jpg`) e copiada a foto para `public/assets/socorrista-costas-ambulancia.jpg`.
  - Redesenho 1:1 de `src/components/CoursesSection.jsx` fiel à referência enviada:
    - Fundo escuro cinematográfico (`#050505`) com os feixes diagonais vermelhos nos cantos superior esquerdo e inferior direito.
    - Socorrista de costas com capacete vermelho, Estrela da Vida azul, mochila de APH vermelha e ambulância iluminada ao fundo posicionado exatamente no centro entre a coluna da esquerda e o card da direita.
    - Coluna esquerda com pílula `TURMA PRESENCIAL • CARGA HORÁRIA TOTAL: 200 HORAS`, título em 3 linhas com `(APH)` em vermelho, descrição, grade 2x2 dos 4 cards, botão principal `Garantir Inscrição • (45) 99986-7555` e os 3 botões inferiores (`Ver Certificado 200h`, `Panfleto`, `Cartaz`) com micro-interações sutis sem exagero.
    - Coluna direita com o card flutuante contornado em vermelho `Conteúdo Programático (11 Módulos • 200h)` e barra de rolagem vermelha.

## [2026-11-22] Redesenho 1:1 da Seção 06 (`#como-funciona` — Como Funcionam os Treinamentos)
- **O que foi feito:**
  - Salva automaticamente a referência enviada em `referencias/como-funciona-ref.png`.
  - Gerada a composição de fundo `public/assets/como-funciona-bg-direita.jpg` reutilizando a imagem do socorrista de costas com a ambulância, reenquadrada com o socorrista posicionado na extrema direita (ao lado do Card 04) e a ambulância iluminada ao fundo.
  - Atualizada a Seção 06 em `src/components/JourneyAndCertification.jsx`:
    - Cabeçalho alinhado à esquerda com pílula `METODOLOGIA CLARA & TRANSPARENTE`, título `Como Funcionam os Treinamentos` (com *Treinamentos* em itálico vermelho) e linha de pulso cardíaco (ECG) vermelha abaixo do subtítulo.
    - 4 Cards translúcidos com borda vermelha luminosa (`01` a `04`, com o ícone do card `04` em vermelho sólido brilhante) ocupando os ~78% esquerdos para deixar o socorrista da direita 100% visível.

## [2026-11-22] Redesenho 1:1 da Seção 07 (`#certificacao` — Certificação Oficial 200h)
- **O que foi feito:**
  - Salva automaticamente a referência enviada em `referencias/certificacao-ref.jpg`.
  - Gerada a imagem `public/assets/certificacao-bg-esquerda.jpg` com proporção 100% natural e nítida (sem blur) dos dois socorristas, da vítima na prancha amarela e da ambulância enquadrados na esquerda para PC/Tablet, utilizando a versão vertical dedicada (`hero-bg-socorristas-mobile.png`) no Mobile.
  - Atualizada a Seção 07 em `src/components/JourneyAndCertification.jsx` e `src/components/OfficialCertificateViewer.jsx`:
    - 4 Pílulas de pilares com ícones vermelhos e borda luminosa (*Prevenir, Orientar, Socorrer, Salvar*).
    - Cards com borda vermelha brilhante (*200 Horas em 11 Módulos no Verso* com ícone de relógio e *Base Legal Transparente — Lei nº 9.394/96 (LDB)* com ícone de balança) e validador com botão `✓ Validar`.
    - Card direito com contorno vermelho luminoso e os dois certificados (Frente e Verso) limpos sem botões sobrepondo o topo direito.

## [2026-11-23] ✅ MARCO OFICIAL: Projeto 1 (Landing Page Comercial) DECLARADO CONCLUÍDO
- **Resumo do que foi finalizado na Landing Page:**
  - Todas as seções refinadas 1:1 com referências exatas (Header Giroflex + Scroll-Spy, Hero com Logo 3D + Raios Vermelhos, Cursos com Socorrista Central e 11 Módulos 200h, Equipe com 5 Crachás 3D Flip + Tilt Holográfico + Áudio Tático, Como Funciona com ECG vivo e etapas interativas, Certificação com foto contínua e brilho dourado nos diplomas, FAQ com Estrela da Vida + Cobra em neon sem linhas de recorte e acordeão suave, Contato com borda giratória de emergência + arte 3D pop-out + giroflex na ambulância, Rodapé neon + assinatura estratégica “Desenvolvido por Matos Soluções” abrindo modal com card do Vitor de Matos e WhatsApp `(45) 99837-8795`).
  - Auditoria e polimento completo de responsividade Mobile (centralização, eliminação de imagens duplicadas, botões full-width, sem colisões com a barra flutuante).
- **Próxima Etapa Ativa:** **Projeto 2 — Portal do Aluno (LMS + Versão Mobile App)** (`http://localhost:5173/?view=aluno`).
