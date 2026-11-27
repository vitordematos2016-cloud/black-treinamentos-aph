/**
 * Fonte Única da Verdade — BLACK Treinamentos - Resgate & APH
 * Dados extraídos 100% do Briefing Oficial v2.0 (22/11/2026), das peças oficiais
 * e do Modelo Oficial de Certificado (Frente e Verso - 200 horas - CNPJ 58.279.230/0001-10).
 */

export const BRAND_CONFIG = {
  name: 'BLACK Treinamentos',
  subName: 'Resgate & APH',
  fullName: 'BLACK Treinamentos - Resgate & APH',
  corporateName: 'BLACK TREINAMENTOS RESGATE E APH',
  cnpj: '58.279.230/0001-10',
  cityState: 'Guaraniaçu – PR',
  directorCivilName: 'Cleverson da Cruz',
  directorPublicName: 'Cleverson Black',
  directorRole: 'Diretor e Instrutor Responsável',
  legalBasis:
    'Este curso é de natureza livre, não regulamentado pelo MEC, conforme a Lei nº 9.394/96 (LDB), destinado à capacitação e atualização profissional.',
  methodology:
    'Aulas teóricas e práticas, estudo de casos, simulações realísticas e avaliação de aprendizagem.',
  tagline: 'Formando profissionais preparados para agir quando cada segundo faz a diferença.',
  certMissionQuote: 'Mais que um curso, uma missão!',
  certBackQuote: 'Preparação hoje, mais vidas amanhã!',
  leaderQuote:
    '“Liderar é servir quando ninguém está olhando, é estar preparado quando tudo dá errado e é fazer a diferença quando alguém mais precisa.”',
  leaderAuthor: 'Cleverson Black (Cleverson da Cruz) — Diretor e Instrutor Responsável',
  pillars: ['COMPROMISSO', 'RESPEITO', 'TÉCNICA', 'VIDAS'],
  certSealPillars: ['DISCIPLINA', 'CONHECIMENTO', 'ATITUDE', 'VIDAS'],
  certFrontActions: ['PREVENIR', 'ORIENTAR', 'SOCORRER', 'SALVAR'],
  certBackValues: ['CONHECIMENTO', 'PRÁTICA', 'SEGURANÇA', 'VIDA'],
  whatsappNumber: '5545999867555',
  whatsappDisplay: '(45) 99986-7555',
  instagramHandle: '@black.treinamentos.resgate',
  instagramUrl: 'https://instagram.com/black.treinamentos.resgate',
  locationReference: 'Prédio da Unicesumar • Sede: Guaraniaçu – PR',
  colors: {
    black: '#050505',
    red: '#ED101C',
    white: '#FFFFFF',
    deepGray: '#171717',
    lightGray: '#B8B8B8',
  },
};

export const getWhatsAppUrl = (customMessage) => {
  const text = encodeURIComponent(
    customMessage ||
      'Olá! Vim pelo site da BLACK Treinamentos - Resgate & APH e gostaria de informações sobre as inscrições nos treinamentos.'
  );
  return `https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=${text}`;
};

export const getStudentWhatsAppUrl = (phone, customMessage) => {
  const digits = String(phone || '').replace(/\D/g, '');
  const fullNumber = digits
    ? digits.startsWith('55') && digits.length >= 12
      ? digits
      : `55${digits}`
    : BRAND_CONFIG.whatsappNumber;
  const text = encodeURIComponent(
    customMessage || 'Olá! Aqui é a Coordenação da BLACK Treinamentos (Curso APH 200h).'
  );
  return `https://wa.me/${fullNumber}?text=${text}`;
};

// CONTEÚDO PROGRAMÁTICO OFICIAL DO VERSO DO CERTIFICADO (11 MÓDULOS = 200 HORAS)
export const CONTEUDO_PROGRAMATICO_200H = [
  { modulo: '01', titulo: 'Introdução ao APH e Legislação', cargaHoraria: '10h', horas: 10 },
  { modulo: '02', titulo: 'Anatomia e Fisiologia Humana', cargaHoraria: '20h', horas: 20 },
  { modulo: '03', titulo: 'Avaliação da Vítima e Sinais Vitais', cargaHoraria: '20h', horas: 20 },
  { modulo: '04', titulo: 'Suporte Básico de Vida (SBV)', cargaHoraria: '30h', horas: 30 },
  { modulo: '05', titulo: 'Vias Aéreas e Ventilação', cargaHoraria: '20h', horas: 20 },
  { modulo: '06', titulo: 'Hemorragias e Controle de Sangramento', cargaHoraria: '20h', horas: 20 },
  { modulo: '07', titulo: 'Traumatismos e Imobilizações', cargaHoraria: '25h', horas: 25 },
  { modulo: '08', titulo: 'Urgências Clínicas', cargaHoraria: '20h', horas: 20 },
  { modulo: '09', titulo: 'Emergências Pediátricas', cargaHoraria: '15h', horas: 15 },
  { modulo: '10', titulo: 'Resgate e Transporte de Vítimas', cargaHoraria: '15h', horas: 15 },
  { modulo: '11', titulo: 'Simulações Realísticas e Prática Supervisionada', cargaHoraria: '5h', horas: 5 },
];

// SEÇÃO 03 — Faixa de Diferenciais
export const DIFERENCIAIS_LIST = [
  {
    id: 'instrutor',
    icon: 'Users',
    title: 'Instrutores Especialistas em APH',
    shortTitle: 'Instrutores Especialistas\nem APH',
    description: 'Equipe de profissionais com vivência real em resgate, defesa civil, SAMU e combate a incêndio.',
  },
  {
    id: 'certificacao',
    icon: 'Award',
    title: 'Certificado de 200 Horas',
    shortTitle: 'Certificação\n200 Horas (LDB)',
    description: 'Certificado frente e verso com os 11 módulos discriminados conforme a Lei nº 9.394/96 (LDB).',
  },
  {
    id: 'pratica',
    icon: 'ClipboardCheck',
    title: 'Aulas Teóricas e Práticas',
    shortTitle: 'Aulas Teóricas\ne Práticas',
    description: 'Simulações realísticas, estudo de casos, manequins de RCP e prática supervisionada.',
  },
  {
    id: 'suporte',
    icon: 'Headphones',
    title: 'Suporte Completo',
    shortTitle: 'Suporte\nCompleto',
    description: 'Orientação direta aos alunos antes, durante e após os módulos presenciais e teóricos.',
  },
];

// GRADE DE 6 PILARES DO JORNAL PROMOCIONAL (`imagem jornal.png`)
export const MODULOS_SOCORRISTA_JORNAL = [
  {
    numero: '01',
    titulo: 'Verificação da Cena',
    descricao: 'Avaliação de segurança, identificação de riscos potenciais, biossegurança e controle completo do perímetro da cena.',
    icone: 'ShieldAlert',
  },
  {
    numero: '02',
    titulo: 'Reconhecimento de Emergência',
    descricao: 'Identificação rápida de situações críticas, leitura de sinais vitais e definição de prioridade de atendimento (triagem).',
    icone: 'Activity',
  },
  {
    numero: '03',
    titulo: 'Primeiros Socorros',
    descricao: 'Condutas iniciais estruturadas em emergências clínicas e traumáticas, controle de hemorragias e vias aéreas.',
    icone: 'HeartPulse',
  },
  {
    numero: '04',
    titulo: 'RCP (Ressuscitação Cardiopulmonar)',
    descricao: 'Técnicas de compressões torácicas de alta qualidade, ventilação em manequim e Suporte Básico de Vida (30h).',
    icone: 'Zap',
  },
  {
    numero: '05',
    titulo: 'Imobilização e Transporte',
    descricao: 'Traumatismos e imobilizações (25h): colar cervical, prancha rígida e movimentação segura.',
    icone: 'Stretcher',
  },
  {
    numero: '06',
    titulo: 'Resgate e Simulações Realísticas',
    descricao: 'Resgate e transporte de vítimas (15h) + simulações realísticas e prática supervisionada em cenários críticos.',
    icone: 'Truck',
  },
];

// SEÇÃO 04 — Nossos Treinamentos
export const TREINAMENTOS_CATALOGO = [
  {
    id: 'aph-atendimento-pre-hospitalar',
    titulo: 'APH – Atendimento Pré-Hospitalar',
    subtitulo: 'Curso de Socorrista • Carga Horária: 200 Horas',
    modalidade: 'Presencial • 200 Horas (11 Módulos)',
    badgeDestaque: 'Turma 13/02/2027 • 200h',
    imagem: '/assets/curso-aph-rcp.jpg',
    cartazOriginal: '/assets/cartaz-socorrista.jpeg',
    jornalOriginal: '/assets/jornal-socorrista.png',
    descricaoCurta: 'Formação completa de Socorrista (200 horas em 11 módulos), com aulas teóricas, práticas e simulações realísticas.',
    descricaoCompleta:
      'Formação completa de Socorrista (Carga Horária Total de 200 horas distribuídas em 11 módulos oficiais) para atuar em situações de urgência, emergência e resgate, com estudo de casos e simulações realísticas supervisionadas.',
    turmaConfirmada: {
      nomeOficial: 'Curso de Socorrista - Atendimento Pré-Hospitalar (APH)',
      cargaHorariaTotal: '200 horas (11 módulos)',
      inicioPrevisto: '13/02/2027',
      diasTurno: 'Aos sábados (período da tarde)',
      duracao: '8 meses (200h)',
      local: 'Prédio da Unicesumar',
      condicaoPagamento: 'Parcelamento em até 10x no boleto ou cartão de crédito',
      contato: '(45) 99986-7555',
    },
    topicos: CONTEUDO_PROGRAMATICO_200H.map(
      (m) => `Mód. ${m.modulo}: ${m.titulo} (${m.cargaHoraria})`
    ),
    mensagemWhatsApp:
      'Olá! Quero saber mais e garantir minha inscrição no Curso de Socorrista - APH (200 horas • Início 13/02/2027 aos sábados na Unicesumar).',
  },
  {
    id: 'prevencao-combate-incendio',
    titulo: 'Prevenção e Combate a Incêndio',
    subtitulo: 'Brigada de Incêndio e Segurança Operacional',
    modalidade: 'Presencial / In Company',
    badgeDestaque: 'Treinamento Prático',
    imagem: '/assets/curso-combate-incendio.jpg',
    descricaoCurta: 'Uso correto de extintores, evacuação ordenada e ações preventivas de segurança e controle.',
    descricaoCompleta:
      'Treinamento prático controlado voltado para prevenção de sinistros, classes de fogo, manuseio seguro de agentes extintores e protocolos de evacuação de ambientes.',
    turmaConfirmada: null,
    topicos: [
      'Teoria do Fogo e Classes de Incêndio',
      'Inspeção e Manuseio Correto de Extintores',
      'Protocolos de Evacuação e Abandono de Área',
      'Prevenção de Acidentes e Controle de Pânico',
      'Primeiros Socorros Aplicados a Queimaduras e Inalação',
    ],
    mensagemWhatsApp:
      'Olá! Gostaria de informações sobre o treinamento de Prevenção e Combate a Incêndio / Brigada da BLACK Treinamentos.',
  },
  {
    id: 'imobilizacao-remocao-vitimas',
    titulo: 'Imobilização e Remoção de Vítimas',
    subtitulo: 'Traumatismos, Imobilizações e Transporte Seguro',
    modalidade: 'Presencial • Prática Intensiva',
    badgeDestaque: 'Técnica Operacional',
    imagem: '/assets/curso-imobilizacao-resgate.jpg',
    descricaoCurta: 'Técnicas seguras de imobilização, transporte tático e remoção de vítimas em cenários de trauma.',
    descricaoCompleta:
      'Capacitação focada na biomecânica do trauma, estabilização cervical, uso de prancha rígida, KED, talas moldáveis e movimentação segura sem agravar lesões.',
    turmaConfirmada: null,
    topicos: [
      'Biomecânica do Trauma e Avaliação Primária (XABCDE)',
      'Aplicação Técnica de Colar Cervical e Head Block',
      'Rolamento em Bloco (90° e 180°) e Pranchamento',
      'Imobilização de Fraturas e Controle de Sangramento',
      'Técnicas de Resgate e Transporte de Vítimas em Equipe',
    ],
    mensagemWhatsApp:
      'Olá! Gostaria de informações sobre o treinamento de Imobilização e Remoção de Vítimas da BLACK Treinamentos.',
  },
];

// ÁREAS DE ATUAÇÃO E CATEGORIAS
export const AREAS_ATUACAO_BLACK = [
  { id: 'aph', nome: 'APH (Atendimento Pré-Hospitalar)', status: 'Catálogo Principal' },
  { id: 'socorrista', nome: 'Curso de Socorrista (200 Horas)', status: 'Turma 13/02/2027' },
  { id: 'resgate-veicular', nome: 'Resgate Veicular', status: 'Especialidade Técnica' },
  { id: 'area-remota', nome: 'Resgate em Área Remota', status: 'Especialidade Técnica' },
  { id: 'brigada', nome: 'Brigada de Incêndio', status: 'Treinamento Prático' },
  { id: 'primeiros-socorros', nome: 'Primeiros Socorros & SBV', status: 'Capacitação' },
  { id: 'multiplas-vitimas', nome: 'Atendimento a Múltiplas Vítimas', status: 'Área de Atuação' },
  { id: 'gerenciamento-crise', nome: 'Gerenciamento de Crise', status: 'Abordagem Técnica' },
];

// SEÇÃO 05 — EQUIPE DE 5 INSTRUTORES REAIS
export const EQUIPE_INSTRUTORES = [
  {
    id: 'cleverson-black',
    nome: 'Cleverson Black (Cleverson da Cruz)',
    cargo: 'Diretor e Instrutor Responsável • APH',
    papelCurto: 'Diretor & Instrutor Responsável • Bombeiro Civil & Resgatista',
    destaqueLider: true,
    fotoPortrait: '/assets/instrutor-cleverson-portrait.jpg',
    fotoFull: '/assets/instrutor-cleverson-full.jpg',
    fichaOriginal: '/assets/instrutor-cleverson-card-original.jpeg',
    resumo:
      'Diretor e Instrutor Responsável da BLACK Treinamentos Resgate e APH. Bombeiro civil (2016), socorrista (2018), resgatista, agente de Defesa Civil (2019–atual), condutor de veículos de emergência e graduando no último período de Enfermagem.',
    frase:
      '“Liderar é servir quando ninguém está olhando, é estar preparado quando tudo dá errado e é fazer a diferença quando alguém mais precisa.”',
    formacao: [
      'Cursando último período de Enfermagem',
      'Bombeiro Civil (TK Treinamentos – 2016)',
      'Socorrista (Cenap – 2018)',
    ],
    experiencia: [
      'Diretor e Instrutor Responsável — BLACK Treinamentos Resgate e APH (Guaraniaçu – PR)',
      'Agente de Defesa Civil (2019 – atual)',
      'Socorrista Condutor (São Francisco Resgate – 2025 – atual)',
      'SMR – Resgate (2019)',
      'Resgatista e Condutor de Veículos de Emergência',
      'Agente de Segurança (Sprado, Delta)',
    ],
    cursosEspecializacoes: [
      'Resgate em Área Remota',
      'Salvamento Aquático',
      'Busca e Salvamento',
      'Gerenciamento de Crise Suicida – 4º GB Cascavel',
    ],
    areasAtuacao: [
      'Atendimento Pré-Hospitalar (APH)',
      'Resgate Veicular',
      'Condução de Viaturas de Emergência',
      'Primeiros Socorros',
      'Atendimento a Múltiplas Vítimas',
      'Formação e Capacitação de Socorristas',
    ],
  },
  {
    id: 'iverson-rodrigo',
    nome: 'Iverson Rodrigo',
    cargo: 'Instrutor de APH & Urgência e Emergência',
    papelCurto: 'Instrutor de APH • Téc. Enfermagem & Bombeiro Civil',
    destaqueLider: false,
    fotoPortrait: '/assets/instrutor-iverson-portrait.jpg',
    fotoFull: '/assets/instrutor-iverson-full.jpg',
    fichaOriginal: '/assets/instrutor-iverson-card-original.jpeg',
    resumo:
      'Professor de séries iniciais, Técnico de Enfermagem, Instrumentador Cirúrgico, acadêmico de Enfermagem, Bombeiro Civil, Socorrista e instrutor/ministrante de treinamentos.',
    frase:
      'Didática estruturada aliada à prática hospitalar, cirúrgica e pré-hospitalar para formar socorristas seguros.',
    formacao: [
      'Acadêmico de Enfermagem',
      'Técnico de Enfermagem',
      'Instrumentador Cirúrgico',
      'Professor de Séries Iniciais',
    ],
    experiencia: [
      'Instrutor e Ministrante de Treinamentos em APH',
      'Socorrista Operacional',
      'Bombeiro Civil',
      'Atuação em Urgência e Emergência',
    ],
    cursosEspecializacoes: [
      'Atendimento Pré-Hospitalar (APH)',
      'Anatomia, Fisiologia e Instrumentação Cirúrgica',
      'Didática e Metodologia de Ensino para Socorristas',
      'Suporte Básico de Vida (SBV) e Primeiros Socorros',
    ],
    areasAtuacao: [
      'Atendimento Pré-Hospitalar (APH)',
      'Urgência e Emergência',
      'Formação e Capacitação de Socorristas',
      'Primeiros Socorros',
    ],
  },
  {
    id: 'erika-raquel',
    nome: 'Érica Raquel de Oliveira',
    cargo: 'Instrutora de APH • Socorrista e Resgatista',
    papelCurto: 'Instrutora de APH • Resgate Rodoviário & BLS',
    destaqueLider: false,
    fotoPortrait: '/assets/instrutor-erika-portrait.jpg',
    fotoFull: '/assets/instrutor-erika-full.jpg',
    fichaOriginal: '/assets/instrutor-erika-card-original.jpeg',
    resumo:
      'Socorrista e resgatista, cursando Enfermagem, com experiência indicada em resgate na EPR Iguaçu (a partir de 2025) e sólida carga horária em APH, BLS, brigada de incêndio e resgate veicular.',
    frase:
      'Experiência prática em rodovias, controle de hemorragias e atendimento pré-hospitalar sob pressão.',
    formacao: [
      'Cursando Graduação em Enfermagem',
      'Formação Técnica como Socorrista e Resgatista',
    ],
    experiencia: [
      'Resgate Rodoviário — EPR Iguaçu (2025 – atual, conforme material)',
      'Atuação em Atendimento Pré-Hospitalar e Resgate',
    ],
    cursosEspecializacoes: [
      'Resgatista e Socorrista – 320h',
      'Atualização em Atendimento Pré-Hospitalar – 240h',
      'Atualização em APH Socorrista – 60h',
      'Noção Básica em Urgência e Emergência – 30h',
      'Suporte Básico de Vida (BLS) – 30h',
      'Atenção à Pessoa com Traumatismo Cranioencefálico (TCE) – 30h',
      'Brigada de Incêndio – 20h',
      'Gerenciamento de Crise – 10h | Controle de Hemorragia APH – 10h',
      'Resgate Veicular – 4h',
    ],
    areasAtuacao: [
      'Atendimento Pré-Hospitalar (APH)',
      'Resgate Veicular',
      'Primeiros Socorros',
      'Atendimento a Múltiplas Vítimas',
      'Formação e Capacitação de Socorristas',
    ],
  },
  {
    id: 'wagner-brita',
    nome: 'Wagner Ricardo dos Santos (“Brita”)',
    cargo: 'Instrutor de APH • Resgate Veicular & Tático',
    papelCurto: 'Instrutor de APH • Especialista em Resgate & Viaturas',
    destaqueLider: false,
    fotoPortrait: '/assets/instrutor-wagner-portrait.jpg',
    fotoFull: '/assets/instrutor-wagner-full.jpg',
    fichaOriginal: '/assets/instrutor-wagner-card-original.jpeg',
    resumo:
      'Graduado em Gestão Pública (UNIOESTE), com longo histórico em SMR Resgate (2003–2022), brigada comunitária de Guaraniaçu (2008–atual), SAMU e condução de viaturas de emergência.',
    frase:
      'Mais de duas décadas de experiência em operações de resgate rodoviário, extricação pesada e condução de emergência.',
    formacao: [
      'Graduação em Gestão Pública – UNIOESTE',
    ],
    experiencia: [
      'Socorrista – SMR Resgate (2003 – 2022)',
      'Brigada Comunitária de Guaraniaçu (2008 – atual)',
      'Condutor de Viatura de Emergência – 4º Grupamento de Bombeiros Cascavel',
      'CIS SAMU (fev a out/2022)',
      'Operador de Guincho Pesado – Rodovia das Cataratas (2000 – 2003)',
    ],
    cursosEspecializacoes: [
      'APH – SMR Resgate (2005)',
      'Curso de Resgate Veicular – Holmatro (2019)',
      'Veicular-Rescue – Rescue Treinamentos (2022)',
      'APH Combate (2022)',
      'APH Tático – Gustavo Korp PF (2022)',
    ],
    areasAtuacao: [
      'Resgate Veicular e Extricação Pesada',
      'Condução de Viaturas de Emergência',
      'Atendimento Pré-Hospitalar (APH) e APH Tático',
      'Atendimento a Múltiplas Vítimas',
      'Formação de Socorristas',
    ],
  },
  {
    id: 'salete-silva',
    nome: 'Salete da Silva',
    cargo: 'Instrutora de APH • Urgência, SMR & SAMU',
    papelCurto: 'Instrutora de APH • Experiência SMR & SAMU',
    destaqueLider: false,
    fotoPortrait: '/assets/instrutor-salete-portrait.jpg',
    fotoFull: '/assets/instrutor-salete-full.jpg',
    fichaOriginal: '/assets/instrutor-salete-card-original.jpeg',
    resumo:
      'Formação no Cenap (Cascavel), experiência consolidada no SMR (2016–2021) e atuação indicada no SAMU, com extensa carga horária em resgate, APH, BLS e controle de hemorragias.',
    frase:
      'Ética, disciplina nas rotinas de enfermagem e comunicação humanizada com pacientes e equipes médicas.',
    formacao: [
      'Cenap – Centro de Educação Profissional (Cascavel)',
      'Registro Profissional no Coren (conforme material)',
    ],
    experiencia: [
      'SMR Resgate (11/2016 – 12/2021)',
      'SAMU – Atendimento Móvel de Urgência (conforme material)',
    ],
    cursosEspecializacoes: [
      'Resgatista e Socorrista – 320h',
      'Atualização em Atendimento Pré-Hospitalar – 240h',
      'Atualização em APH Socorrista – 60h',
      'Noção Básica em Urgência e Emergência – 30h',
      'Suporte Básico de Vida (BLS) – 30h',
      'Atenção à Pessoa com Traumatismo Cranioencefálico (TCE) – 30h',
      'Brigada de Incêndio – 20h',
      'Gerenciamento de Crise – 10h | Controle de Hemorragia APH – 10h',
      'Resgate Veicular – 4h',
    ],
    areasAtuacao: [
      'Atendimento Pré-Hospitalar (APH)',
      'Primeiros Socorros e BLS',
      'Atendimento a Múltiplas Vítimas',
      'Resgate Veicular e Condução de Emergência',
      'Formação e Capacitação de Socorristas',
    ],
  },
];

// SEÇÃO 06 — Como Funcionam os Cursos (3 Etapas Diretas)
export const COMO_FUNCIONA_PASSOS = [
  {
    passo: '01',
    titulo: 'Realize a Inscrição',
    descricao:
      'Fale com nossa equipe oficial ou preencha sua pré-inscrição para confirmar vagas, documentação e condições de parcelamento (até 10x no boleto ou cartão).',
    icone: 'UserPlus',
  },
  {
    passo: '02',
    titulo: 'Aulas Teóricas e Práticas',
    descricao:
      'Participe das aulas teóricas, estudo de casos e simulações realísticas supervisionadas pelos 5 instrutores da BLACK Treinamentos.',
    icone: 'BookOpen',
  },
  {
    passo: '03',
    titulo: 'Certificado Oficial 200h',
    descricao:
      'Cumprindo as exigências e avaliações, você recebe seu Certificado de Conclusão (Frente e Verso com Conteúdo Programático de 200h) assinado pela diretoria.',
    icone: 'Award',
  },
];

// SEÇÃO 09 — Perguntas Frequentes (Top 4 Principais visíveis + Dúvidas Complementares sob demanda)
export const FAQ_OFICIAL = [
  {
    numero: '01',
    pergunta: 'Como funciona o formato híbrido das aulas?',
    resposta:
      'O Curso de Socorrista (200h) une aulas teóricas online no Portal do Aluno com práticas presenciais aos sábados à tarde na Unicesumar, ao longo de 8 meses de formação.',
  },
  {
    numero: '02',
    pergunta: 'Quem pode participar do treinamento?',
    resposta:
      'Qualquer pessoa que deseje aprender a salvar vidas, além de estudantes da saúde, socorristas, bombeiros civis, brigadistas e motoristas profissionais.',
  },
  {
    numero: '03',
    pergunta: 'Quais são as formas de pagamento?',
    resposta:
      'Parcelamento em até 10x no boleto ou no cartão de crédito, além de pagamento à vista via Pix com confirmação rápida de vaga.',
  },
  {
    numero: '04',
    pergunta: 'O certificado de 200h tem validade nacional?',
    resposta:
      'Sim. Concluindo as aulas e avaliações, você recebe certificado frente e verso de 200 horas válido em todo o Brasil conforme a Lei nº 9.394/96 (LDB).',
  },
  {
    numero: '05',
    pergunta: 'Existem atividades práticas e avaliação final?',
    resposta:
      'Sim. A metodologia inclui simulações realísticas supervisionadas pelos 5 instrutores, estudos de caso e avaliação teórica e prática.',
  },
  {
    numero: '06',
    pergunta: 'Posso estudar e acompanhar tudo pelo celular?',
    resposta:
      'Sim. O Portal do Aluno possui versão otimizada para celular para assistir aulas, baixar apostilas, acompanhar presença e acessar seu certificado.',
  },
  {
    numero: '07',
    pergunta: 'Como realizo minha inscrição ou tiro dúvidas?',
    resposta:
      'Converse diretamente com nossa coordenação oficial pelo WhatsApp para tirar suas últimas dúvidas e confirmar sua vaga agora mesmo:',
    ctaLabel: 'Falar Agora e Realizar Inscrição',
  },
];
