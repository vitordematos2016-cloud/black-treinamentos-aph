# 🔍 Findings — Descobertas, Escopo e Restrições (APH Treinamentos)

## 1. Contexto do Cliente e Respostas da Fase 1 (Visão)
- **Cliente Final:** **Cleve** (Bombeiro / Especialista em Atendimento Pré-Hospitalar — **APH Treinamentos**).
- **1. Estrela Guia (Arquitetura Unificada "Águas Calmas"):**
  - Os 3 projetos (**Landing Page Comercial**, **Portal do Aluno LMS** e **Painel Administrativo**) serão **integrados em um único sistema**, porém com separação modular cristalina, código limpo e navegação independente sem bagunça ("sensação de águas calmas").
- **2. Integrações (Banco de Dados & Pagamentos):**
  - **Banco de Dados:** **Supabase** (PostgreSQL + Auth + Storage).
  - **Gateway de Pagamento:** Camada de pagamento pré-estruturada ("meio caminho andado" / Adapter Pattern) pronta para **Mercado Pago** e **Stripe** (suportando Pix, Cartão e Boleto), permitindo testar todo o fluxo imediatamente e plugar as credenciais definitivas quando o Cleve definir onde receberá.
- **3. Fonte da Verdade:**
  - **Supabase** como repositório central de todas as entidades (Cursos, Turmas, Alunos, Matrículas, Avaliações, Certificados, Empresas B2B, Instrutores e Financeiro), com camada de sincronização local/mock determinístico enquanto as chaves de produção do Supabase não forem inseridas no `.env`.
- **4. Payload de Entrega & Hospedagem:**
  - Hospedagem em **Hostinger VPS 2** (Aplicação Web).
  - **Estratégia Mobile:** Aplicação Web Responsiva com suporte a **PWA (Progressive Web App)** instalável na tela inicial do Android e iOS, evitando taxas de plataformas (US$ 25 Google Play / US$ 99/ano Apple + 15-30% de retenção em compras in-app).
- **5. Regras Comportamentais e Identidade:**
  - Tom de voz de **autoridade técnica, precisão tática de bombeiro/socorrista, confiança e clareza** ("salvar vidas com preparo real").
  - Regras determinísticas de negócio:
    - Liberação automática de matrícula após confirmação de pagamento.
    - Emissão automática do Certificado com código único e **QR Code verificável** somente ao atingir o critério de aprovação nas avaliações/aulas.
    - Cálculo automático de KPIs financeiros (Faturamento, Lucro Líquido, Margem % e Comissões de Instrutores).

---

## 2. Escopo Visual e Funcional dos 3 Projetos
### Projeto 1: Landing Page (Comercial)
- **Identidade Visual:** Dark/Preto profundo, acentos em Vermelho Emergência (`#E50914` / `#DC2626`), estética cinematográfica de alta fidelidade (GSAP + ScrollTrigger, micro-interações magnéticas, textura noise `0.05`) combinada ao universo tático/socorrista da **APH Treinamentos**.
- **Seções:**
  - Header/Navbar com Logo *APH Treinamentos* (Estrela da Vida vermelha), links (*Início, Cursos, Sobre, Depoimentos, Contato*) e CTA *Inscreva-se agora*.
  - Hero Section de alto impacto (*"Treinamentos em Atendimento Pré-Hospitalar (APH) — Aprenda a agir com segurança em situações de emergência e salve vidas"*).
  - Barra de autoridade: *Instrutor Especialista*, *Certificação Reconhecida*, *Aulas Teóricas e Práticas*, *Suporte Completo*.
  - Vitrine de Cursos & Agenda de Turmas, Treinamentos *In Company* (Empresas B2B), Validador Público de Certificados (QR Code) e Modal/Fluxo de Inscrição + Checkout (Pix, Cartão, Boleto).

### Projeto 2: Portal do Aluno (LMS — Desktop & Mobile App-like)
- **Ambiente:** *"Meu Ambiente de Estudos"*.
- **Menu Lateral (Desktop):** *Painel do Aluno, Meus Cursos, Atividades, Avaliações, Certificados, Materiais de Apoio*.
- **Menu Inferior (Mobile Responsivo / PWA):** *Início, Cursos, Avisos, Perfil*.
- **Destaques:**
  - Curso em andamento (*APH – Atendimento Pré-Hospitalar*, progresso `72%`, botão *"Continuar Aula →"* e player de aula).
  - Cards de resumo: **Aulas (38)**, **Atividades (12)**, **Avaliações (3)**, **Certificado (✓)**.
  - Simulador de provas/questionários, download de apostilas/protocolos/checklists e gerador de certificado com QR Code.

### Projeto 3: Painel Administrativo (Gestão Completa)
- **Menu Lateral:** *Visão Geral, Matrículas, Alunos, Cursos, Avaliações, Financeiro, Relatórios, Configurações*.
- **KPIs:**
  - **Matrículas (Mês):** `127` (`+28%`)
  - **Alunos Ativos:** `362` (`+17%`)
  - **Faturamento (Mês):** `R$ 18.940,00` (`+32%`)
  - **Lucro Líquido:** `R$ 11.320,00` (`Margem: 59,8%`)
  - **Gráfico:** *Faturamento (Últimos 6 Meses)* (Jun a Nov).
- **Cobertura dos 12 Módulos do Sistema:** Gestão de Cursos, Gestão de Alunos, Atividades e Avaliações, Certificados Automáticos, Pagamentos Integrados, Relatórios Gerenciais, Materiais de Apoio, Agenda e Turmas, Comunicação com Alunos, Cadastro de Empresas (In Company), Controle de Instrutores (Comissões) e Personalização da Plataforma.


---

## 4. Atualização Oficial do Briefing v2.0 — `BLACK Treinamentos - Resgate & APH`
*(Extraído de `Briefing_Oficial_BLACK_Treinamentos_Landing_Page_ATUALIZADO.pdf`)*

- **Marca Oficial Definitiva:** **BLACK Treinamentos — Resgate & APH** (Substitui o nome provisório "APH Treinamentos" do mockup; manter a logo original `logo black.jpeg` sem deformar).
- **Paleta Oficial:**
  - Preto: `#050505` (Header, Hero, blocos institucionais e rodapé)
  - Vermelho: `#ED101C` (CTAs, destaques, ícones e palavra "APH")
  - Branco: `#FFFFFF` (Títulos sobre fundo escuro e fundo da Seção 04 de Cursos para contraste)
  - Cinza Profundo: `#171717` (Cards escuros, navegação auxiliar e divisórias)
  - Cinza Claro: `#B8B8B8` (Textos secundários)
- **Estrutura de 10 Seções da Landing Page:**
  1. `01` Cabeçalho / Header (Fundo `#050505`, logo BLACK à esquerda, links *Início, Cursos, Sobre, Depoimentos, Contato*, botão vermelho *Inscreva-se agora*).
  2. `02` Hero Principal (Texto à esquerda, socorrista de capacete/uniforme vermelho e ambulância à direita com degradê escuro; título *"Treinamentos em Atendimento Pré-Hospitalar (APH)"* com APH em vermelho).
  3. `03` Faixa de Diferenciais (4 destaques: Instrutor especialista em APH, Informações sobre certificação, Aulas teóricas e práticas, Suporte ao aluno — sem afirmar reconhecimento oficial sem comprovação).
  4. `04` Nossos Treinamentos (Fundo claro branco/cinza para contraste; 3 cards de referência + **Curso de Socorrista APH** real com início em `13/02/2027`, Sábados à tarde, duração 8 meses, Local: Prédio da Unicesumar, até 10x boleto/cartão, WhatsApp `(45) 99986-7555`).
  5. `05` Conheça a Equipe (5 instrutores reais: **Cleverson Black**, **Iverson Rodrigo**, **Érica Raquel de Oliveira**, **Wagner Ricardo dos Santos "Brita"** e **Salete da Silva** — remover qualquer referência ao verde-limão das artes antigas).
  6. `06` Como Funcionam os Cursos (Jornada em 4 passos: Escolha o curso → Realize a inscrição → Comece a estudar → Conclua as exigências do treinamento).
  7. `07` Certificação (Bloco escuro com certificado ilustrativo, carga horária, critérios transparentes e previsão de validação por QR Code).
  8. `08` Depoimentos (Apenas relatos reais autorizados; ocultar se não houver).
  9. `09` Perguntas Frequentes (Acordeão acessível com as 10 perguntas oficiais do briefing).
  10. `10` Contato, Inscrição e Rodapé (Chamada *"Prepare-se para fazer a diferença quando cada segundo importa"*, CTAs *"Conhecer os treinamentos"* e *"Falar pelo WhatsApp"*).
- **Arquivos já localizados em `c:\Users\Nitro\Downloads\proposta-black\`:**
  - `logo black.jpeg`, `Mockup da Landing Page APH Treinamentos.png`, `Painel APH_ Emergência em Preparação.png`, `Painel admin APH Treinamentos em Destaque.png`, `Proposta Completa APH Treinamentos.png`, `infos complementares curso.jpeg`, `equipe de instrutor.jpeg`, `instrutor erika.jpeg`, `instrutor iverson.jpeg`, `instrutor salete.jpeg`, `instrutor wagner.jpeg`, `imagem jornal.png`.

## 5. Análise Detalhada das Imagens na Pasta `referencias/`
1. **`logo black.jpeg`**:
   - Logomarca oficial em fundo preto (`#000000`), tipografia geométrica inclinada branca `BLACK` com detalhes triangulares em vermelho (`#ED101C`) nas letras `A` e `K`, subtítulo `TREINAMENTOS` entre linhas vermelhas, `RESGATE &` em vermelho e `APH` em branco com linha de batimento cardíaco (ECG) vermelha abaixo.
2. **`imagem jornal.png` (Panfleto Editorial 2 Páginas — Descoberta Valiosa)**:
   - Contém a grade curricular oficial **"O QUE VOCÊ VAI APRENDER"** do Curso de Formação de Socorrista (APH), dividida em 6 pilares:
     1. **Verificação da Cena:** Avaliação de segurança, riscos e controle da cena.
     2. **Reconhecimento de Emergência:** Identificação de situações críticas, sinais e prioridade de atendimento.
     3. **Primeiros Socorros:** Condutas iniciais em emergências clínicas e traumáticas.
     4. **RCP (Ressuscitação Cardiopulmonar):** Técnicas de compressões torácicas e ventilação em manequim.
     5. **Imobilização e Transporte:** Técnicas de imobilização, uso de colar, prancha e movimentação segura.
     6. **Resgate e Remoção:** Noções de resgate em diferentes cenários, incluindo resgate veicular e áreas de risco.
   - Selo de destaque: **`✓ TEORIA E PRÁTICA`** (*"Aulas com conteúdo técnico atualizado, atividades práticas e simulações realistas para a sua formação como socorrista"*).
3. **`infos complementares curso.jpeg`**:
   - Confirma todos os dados da turma presencial: **Início Previsto: 13/02/2027**, **Aulas: Aos sábados (período da tarde)**, **Local: Prédio da Unicesumar**, **Duração: 8 meses**, **Parcelamento em até 10x no boleto ou cartão de crédito**, **WhatsApp: (45) 99986-7555**.
4. **`equipe de instrutor.jpeg` + `instrutor erika/iverson/salete/wagner.jpeg`**:
   - Fotos reais em alta resolução dos **5 instrutores** uniformizados (**Cleverson Black, Iverson Rodrigo, Érica Raquel de Oliveira, Wagner Ricardo dos Santos "Brita" e Salete da Silva**) e seus currículos detalhados (com cargas horárias como Resgatista e Socorrista 320h, Atualização APH 240h, BLS 30h, Brigada de Incêndio 20h, TCE 30h, Controle de Hemorragia 10h, Resgate Veicular Holmatro, APH Tático, etc.).

## 6. Atualização Oficial do Certificado (Frente e Verso — 200 Horas — 11 Módulos)
- **Arquivos oficiais adicionados em `referencias/` e copiados para `public/assets/`:**
  - `BLACK_Certificado_Frente_Modelo.png` → `/assets/certificado-frente.png`
  - `BLACK_Certificado_Verso_Conteudo.png` → `/assets/certificado-verso.png`
- **Dados Empresariais e Legais Extraídos do Certificado:**
  - **Razão / Nome Empresarial:** `BLACK TREINAMENTOS RESGATE E APH`
  - **CNPJ:** `58.279.230/0001-10`
  - **Cidade / UF:** `Guaraniaçu – PR`
  - **Diretor e Instrutor Responsável:** `Cleverson da Cruz` (`Cleverson Black`)
  - **Base Legal:** Curso de natureza livre, não regulamentado pelo MEC, conforme a **Lei nº 9.394/96 (LDB)**, destinado à capacitação e atualização profissional.
  - **Metodologia Oficial:** Aulas teóricas e práticas, estudo de casos, simulações realísticas e avaliação de aprendizagem.
  - **Carga Horária Total do Curso de Socorrista:** **200 horas** distribuídas em **11 módulos**:
    1. `01` — Introdução ao APH e Legislação (`10h`)
    2. `02` — Anatomia e Fisiologia Humana (`20h`)
    3. `03` — Avaliação da Vítima e Sinais Vitais (`20h`)
    4. `04` — Suporte Básico de Vida (SBV) (`30h`)
    5. `05` — Vias Aéreas e Ventilação (`20h`)
    6. `06` — Hemorragias e Controle de Sangramento (`20h`)
    7. `07` — Traumatismos e Imobilizações (`25h`)
    8. `08` — Urgências Clínicas (`20h`)
    9. `09` — Emergências Pediátricas (`15h`)
    10. `10` — Resgate e Transporte de Vítimas (`15h`)
    11. `11` — Simulações Realísticas e Prática Supervisionada (`5h`)
