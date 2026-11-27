/**
 * ============================================================================
 * REPOSITÓRIO ESCALÁVEL DE CONTEÚDO — CURSO DE SOCORRISTA APH (200 HORAS)
 * ============================================================================
 * Estrutura 100% compatível com o schema `supabase_schema.sql`.
 *
 * COMO ADICIONAR CONTEÚDO REAL (QUANDO O CLEVE ENVIAR AS 200H DE AULAS/PDFs):
 * 1. Basta adicionar/editar itens dentro do array `aulas` e `materiais` de cada módulo abaixo
 *    (ou inserir diretamente nas tabelas `modulos`, `aulas` e `materiais_apoio` do Supabase).
 * 2. Em `videoUrl`, cole o link do YouTube, Vimeo, Bunny Stream ou MP4 do Supabase Storage.
 * 3. Em `arquivoUrl`, cole o link do PDF no Supabase Storage.
 * 4. Nenhuma linha de interface (React) precisa ser alterada!
 */

export const CURSO_OFICIAL_200H = {
  id: 'socorrista-aph-200h',
  slug: 'curso-socorrista-aph-200h',
  titulo: 'Curso de Socorrista — APH',
  tituloCompleto: 'Curso de Socorrista — Atendimento Pré-Hospitalar (APH)',
  subtitulo: 'Formação presencial teórica e prática com 200 horas distribuídas em 11 módulos oficiais.',
  turma: 'Turma 13/02/2027 • Sábados (tarde)',
  dataInicioISO: '2027-02-13',
  dataFimISO: '2027-10-16',
  local: 'Prédio da Unicesumar • Guaraniaçu – PR',
  duracaoMeses: 8,
  cargaHorariaTotal: 200,
  frequenciaMinimaPct: 75,
  notaMinimaAprovacaoPct: 70,
  thumb: '/assets/curso-aph-rcp.jpg',
  instrutorPrincipal: 'Cleverson da Cruz & Equipe de 5 Instrutores',
};

/**
 * 11 MÓDULOS OFICIAIS DO CERTIFICADO (TOTAL = 200 HORAS)
 * Cada módulo suporta ilimitadas `aulas`, `materiais` e `checklistPratico`.
 */
export const MODULOS_200H_ESTRUTURADOS = [
  {
    id: 'mod-01',
    modulo: '01',
    titulo: 'Introdução ao APH e Legislação',
    cargaHoraria: '10h',
    cargaHorariaHoras: 10,
    resumo:
      'Fundamentos do Atendimento Pré-Hospitalar, atribuições legais do socorrista, ética, biossegurança, uso de EPIs e avaliação de segurança da cena.',
    aulas: [
      {
        id: 'm01-a01',
        ordem: 1,
        titulo: 'História, Princípios do APH e Papel do Socorrista',
        tipo: 'VIDEO',
        duracaoMin: 40,
        videoUrl: '',
        descricao: 'Conceitos iniciais, cadeia de sobrevivência e atuação em situações de urgência e emergência.',
        isDemoPlaceholder: true,
      },
      {
        id: 'm01-a02',
        ordem: 2,
        titulo: 'Legislação Aplicada, Omissão de Socorro e Consentimento',
        tipo: 'LEITURA',
        duracaoMin: 35,
        videoUrl: '',
        descricao: 'Aspectos legais da atuação em APH, responsabilidade civil e registro de ocorrências.',
        isDemoPlaceholder: true,
      },
      {
        id: 'm01-a03',
        ordem: 3,
        titulo: 'Biossegurança, EPIs e Segurança da Cena',
        tipo: 'PRATICA',
        duracaoMin: 50,
        videoUrl: '',
        descricao: 'Checklist de paramentação e protocolos para abordagem segura antes de tocar na vítima.',
        isDemoPlaceholder: true,
      },
    ],
    materiais: [
      {
        id: 'mat-m01-1',
        titulo: 'Apostila Módulo 01 — Introdução ao APH e Legislação (10h)',
        tipo: 'APOSTILA PDF',
        tamanho: '3.2 MB',
        arquivoUrl: '',
      },
    ],
    checklistPratico: [
      'Identificar riscos ambientais na cena antes da aproximação',
      'Realizar paramentação correta de luvas, óculos e máscara',
      'Aplicar protocolo de acionamento do serviço de emergência (SAMU 192 / SIATE 193)',
    ],
  },
  {
    id: 'mod-02',
    modulo: '02',
    titulo: 'Anatomia e Fisiologia Humana',
    cargaHoraria: '20h',
    cargaHorariaHoras: 20,
    resumo:
      'Estudo prático dos sistemas cardiovascular, respiratório, nervoso e musculoesquelético aplicado ao reconhecimento rápido de lesões.',
    aulas: [
      {
        id: 'm02-a01',
        ordem: 1,
        titulo: 'Sistema Cardiorrespiratório Aplicado ao APH',
        tipo: 'VIDEO',
        duracaoMin: 55,
        videoUrl: '',
        descricao: 'Funcionamento do coração, circulação sanguínea, oxigenação e trocas gasosas.',
        isDemoPlaceholder: true,
      },
      {
        id: 'm02-a02',
        ordem: 2,
        titulo: 'Sistema Nervoso, Coluna Vertebral e Órgãos Vitais',
        tipo: 'VIDEO',
        duracaoMin: 50,
        videoUrl: '',
        descricao: 'Anatomia topográfica essencial para avaliação de trauma cranioencefálico e raquimedular.',
        isDemoPlaceholder: true,
      },
    ],
    materiais: [
      {
        id: 'mat-m02-1',
        titulo: 'Atlas Prático de Anatomia e Fisiologia para Socorristas (20h)',
        tipo: 'APOSTILA PDF',
        tamanho: '6.8 MB',
        arquivoUrl: '',
      },
    ],
    checklistPratico: [
      'Localizar pontos anatômicos de pulso carotídeo e radial',
      'Reconhecer os quadrantes abdominais e estruturas vitais subjacentes',
    ],
  },
  {
    id: 'mod-03',
    modulo: '03',
    titulo: 'Avaliação da Vítima e Sinais Vitais',
    cargaHoraria: '20h',
    cargaHorariaHoras: 20,
    resumo:
      'Protocolo XABCDE completo, avaliação primária e secundária, escala de coma de Glasgow, aferição de sinais vitais e triagem.',
    aulas: [
      {
        id: 'm03-a01',
        ordem: 1,
        titulo: 'Protocolo XABCDE — Avaliação Primária Passo a Passo',
        tipo: 'VIDEO',
        duracaoMin: 60,
        videoUrl: '',
        descricao: 'Sequência padronizada para identificar e tratar ameaças imediatas à vida.',
        isDemoPlaceholder: true,
      },
      {
        id: 'm03-a02',
        ordem: 2,
        titulo: 'Aferição de Sinais Vitais, Pupilas e Escala de Glasgow',
        tipo: 'PRATICA',
        duracaoMin: 50,
        videoUrl: '',
        descricao: 'Prática de pulso, frequência respiratória, pressão arterial, saturação e perfusão capilar.',
        isDemoPlaceholder: true,
      },
    ],
    materiais: [
      {
        id: 'mat-m03-1',
        titulo: 'Protocolo XABCDE e Tabela de Referência de Sinais Vitais',
        tipo: 'PROTOCOLO',
        tamanho: '4.1 MB',
        arquivoUrl: '',
      },
    ],
    checklistPratico: [
      'Executar avaliação primária XABCDE em menos de 90 segundos',
      'Calcular corretamente a Escala de Coma de Glasgow',
      'Conduzir entrevista SAMPLE na avaliação secundária',
    ],
  },
  {
    id: 'mod-04',
    modulo: '04',
    titulo: 'Suporte Básico de Vida (SBV)',
    cargaHoraria: '30h',
    cargaHorariaHoras: 30,
    resumo:
      'Reconhecimento de parada cardiorrespiratória (PCR), manobras de RCP de alta qualidade em adultos, crianças e lactentes, e operação segura do DEA.',
    aulas: [
      {
        id: 'm04-a01',
        ordem: 1,
        titulo: 'Reconhecimento da PCR e RCP de Alta Qualidade (30:2)',
        tipo: 'VIDEO',
        duracaoMin: 65,
        videoUrl: '',
        descricao: 'Profundidade, frequência (100 a 120/min), retorno completo do tórax e minimização de pausas.',
        isDemoPlaceholder: true,
      },
      {
        id: 'm04-a02',
        ordem: 2,
        titulo: 'Operação do Desfibrilador Externo Automático (DEA)',
        tipo: 'PRATICA',
        duracaoMin: 55,
        videoUrl: '',
        descricao: 'Posicionamento das pás, segurança no choque e integração com ciclos de compressão.',
        isDemoPlaceholder: true,
      },
      {
        id: 'm04-a03',
        ordem: 3,
        titulo: 'Desobstrução de Vias Aéreas por Corpo Estranho (OVACE)',
        tipo: 'PRATICA',
        duracaoMin: 45,
        videoUrl: '',
        descricao: 'Manobra de Heimlich em adultos, gestantes, obesos e lactentes.',
        isDemoPlaceholder: true,
      },
    ],
    materiais: [
      {
        id: 'mat-m04-1',
        titulo: 'Manual Oficial de Suporte Básico de Vida — SBV (30h)',
        tipo: 'MANUAL PRÁTICO',
        tamanho: '7.4 MB',
        arquivoUrl: '',
      },
    ],
    checklistPratico: [
      'Executar 5 ciclos contínuos de RCP 30:2 mantendo ritmo entre 100 e 120 comp/min',
      'Aplicar o DEA com segurança verbal e visual antes do disparo',
    ],
  },
  {
    id: 'mod-05',
    modulo: '05',
    titulo: 'Vias Aéreas e Ventilação',
    cargaHoraria: '20h',
    cargaHorariaHoras: 20,
    resumo:
      'Manobras manuais de abertura de vias aéreas, cânula orofaríngea (Guedel), oxigenoterapia e ventilação com bolsa-valva-máscara (Ambu).',
    aulas: [
      {
        id: 'm05-a01',
        ordem: 1,
        titulo: 'Abertura Manual de Vias Aéreas (Chin-Lift e Jaw-Thrust)',
        tipo: 'VIDEO',
        duracaoMin: 45,
        videoUrl: '',
        descricao: 'Diferença entre vítimas clínicas e vítimas com suspeita de trauma cervical.',
        isDemoPlaceholder: true,
      },
      {
        id: 'm05-a02',
        ordem: 2,
        titulo: 'Oxigenoterapia, Aspiração e Ventilação com Ambu',
        tipo: 'PRATICA',
        duracaoMin: 55,
        videoUrl: '',
        descricao: 'Técnica C-E, vedação eficaz da máscara e seleção do dispositivo de oxigênio.',
        isDemoPlaceholder: true,
      },
    ],
    materiais: [
      {
        id: 'mat-m05-1',
        titulo: 'Protocolo de Manejo de Vias Aéreas e Oxigenoterapia (20h)',
        tipo: 'PROTOCOLO',
        tamanho: '4.6 MB',
        arquivoUrl: '',
      },
    ],
    checklistPratico: [
      'Medir e inserir corretamente a cânula orofaríngea (Guedel)',
      'Executar vedação C-E eficaz com bolsa-valva-máscara',
    ],
  },
  {
    id: 'mod-06',
    modulo: '06',
    titulo: 'Hemorragias e Controle de Sangramento',
    cargaHoraria: '20h',
    cargaHorariaHoras: 20,
    resumo:
      'Classificação de hemorragias, controle de sangramento exsanguinante, compressão direta, preenchimento de feridas, torniquete tático e estado de choque.',
    aulas: [
      {
        id: 'm06-a01',
        ordem: 1,
        titulo: 'Hemorragias Externas, Internas e Reconhecimento do Choque',
        tipo: 'VIDEO',
        duracaoMin: 50,
        videoUrl: '',
        descricao: 'Sinais precoces de choque hipovolêmico e prioridades no X do XABCDE.',
        isDemoPlaceholder: true,
      },
      {
        id: 'm06-a02',
        ordem: 2,
        titulo: 'Aplicação Técnica de Torniquete, Bandagem e Curativo Compressivo',
        tipo: 'PRATICA',
        duracaoMin: 60,
        videoUrl: '',
        descricao: 'Prática realista de estancamento sob pressão e registro do horário de aplicação.',
        isDemoPlaceholder: true,
      },
    ],
    materiais: [
      {
        id: 'mat-m06-1',
        titulo: 'Guia Stop The Bleed & Controle de Hemorragias BLACK (20h)',
        tipo: 'MANUAL PRÁTICO',
        tamanho: '5.9 MB',
        arquivoUrl: '',
      },
    ],
    checklistPratico: [
      'Aplicar torniquete tático em menos de 30 segundos com cessação do pulso distal',
      'Executar preenchimento de ferida (wound packing) com compressão contínua',
    ],
  },
  {
    id: 'mod-07',
    modulo: '07',
    titulo: 'Traumatismos e Imobilizações',
    cargaHoraria: '25h',
    cargaHorariaHoras: 25,
    resumo:
      'Atendimento a fraturas, luxações, trauma craniano, torácico e abdominal, restrição de movimento da coluna (RMC), colar cervical e prancha rígida.',
    aulas: [
      {
        id: 'm07-a01',
        ordem: 1,
        titulo: 'Cinemática do Trauma e Fraturas / Imobilização de Membros',
        tipo: 'VIDEO',
        duracaoMin: 55,
        videoUrl: '',
        descricao: 'Avaliação neurovascular distal antes e após talas moldáveis e imobilizações.',
        isDemoPlaceholder: true,
      },
      {
        id: 'm07-a02',
        ordem: 2,
        titulo: 'Colar Cervical, Rolamento em Bloco e Prancha Rígida',
        tipo: 'PRATICA',
        duracaoMin: 70,
        videoUrl: '',
        descricao: 'Coordenação de equipe (líder na cabeça), tirantes aranha e head-block.',
        isDemoPlaceholder: true,
      },
    ],
    materiais: [
      {
        id: 'mat-m07-1',
        titulo: 'Manual Prático de Traumatismos e Imobilizações (25h)',
        tipo: 'MANUAL PRÁTICO',
        tamanho: '8.9 MB',
        arquivoUrl: '',
      },
    ],
    checklistPratico: [
      'Mensurar e instalar o colar cervical mantendo alinhamento neutro',
      'Liderar rolamento em bloco 90° com 3 ou 4 socorristas em prancha rígida',
    ],
  },
  {
    id: 'mod-08',
    modulo: '08',
    titulo: 'Urgências Clínicas',
    cargaHoraria: '20h',
    cargaHorariaHoras: 20,
    resumo:
      'Reconhecimento e conduta inicial em AVC, infarto agudo do miocárdio (IAM), convulsões, hipoglicemia, crises asmáticas, anafilaxia e intoxicações.',
    aulas: [
      {
        id: 'm08-a01',
        ordem: 1,
        titulo: 'Emergências Cardiovasculares e Neurológicas (IAM e AVC — SAMU)',
        tipo: 'VIDEO',
        duracaoMin: 55,
        videoUrl: '',
        descricao: 'Escala de Cincinnati para AVC, dor torácica típica e janela terapêutica.',
        isDemoPlaceholder: true,
      },
      {
        id: 'm08-a02',
        ordem: 2,
        titulo: 'Convulsões, Diabetes, Crise Respiratória e Intoxicações Exógenas',
        tipo: 'VIDEO',
        duracaoMin: 50,
        videoUrl: '',
        descricao: 'Proteção da vítima em crise convulsiva e avaliação clínica orientada.',
        isDemoPlaceholder: true,
      },
    ],
    materiais: [
      {
        id: 'mat-m08-1',
        titulo: 'Caderno de Urgências Clínicas no APH (20h)',
        tipo: 'APOSTILA PDF',
        tamanho: '5.1 MB',
        arquivoUrl: '',
      },
    ],
    checklistPratico: [
      'Aplicar a Escala de Cincinnati (Sorriso, Abraço, Mensagem)',
      'Estabilizar vítima em posição lateral de segurança pós-convulsão',
    ],
  },
  {
    id: 'mod-09',
    modulo: '09',
    titulo: 'Emergências Pediátricas',
    cargaHoraria: '15h',
    cargaHorariaHoras: 15,
    resumo:
      'Particularidades anatômicas da criança e do lactente, triângulo de avaliação pediátrica, engasgo infantil, febre/convulsão febril e suporte pediátrico.',
    aulas: [
      {
        id: 'm09-a01',
        ordem: 1,
        titulo: 'Triângulo de Avaliação Pediátrica e Sinais de Alerta',
        tipo: 'VIDEO',
        duracaoMin: 45,
        videoUrl: '',
        descricao: 'Aparência, esforço respiratório e circulação cutânea em crianças e bebês.',
        isDemoPlaceholder: true,
      },
      {
        id: 'm09-a02',
        ordem: 2,
        titulo: 'Desengasgo e RCP em Bebês e Crianças',
        tipo: 'PRATICA',
        duracaoMin: 50,
        videoUrl: '',
        descricao: '5 golpes interescapulares + 5 compressões torácicas em lactentes e manejo familiar.',
        isDemoPlaceholder: true,
      },
    ],
    materiais: [
      {
        id: 'mat-m09-1',
        titulo: 'Guia de Emergências Pediátricas e Neonatais (15h)',
        tipo: 'GUIA DE CAMPO',
        tamanho: '4.4 MB',
        arquivoUrl: '',
      },
    ],
    checklistPratico: [
      'Executar manobra de desobstrução em lactente com segurança de coluna cervical',
      'Demonstrar RCP pediátrica com 1 e 2 socorristas',
    ],
  },
  {
    id: 'mod-10',
    modulo: '10',
    titulo: 'Resgate e Transporte de Vítimas',
    cargaHoraria: '15h',
    cargaHorariaHoras: 15,
    resumo:
      'Técnicas de extração rápida, remoção emergencial, transporte em maca/prancha em terrenos irregulares, ergonomia do socorrista e passagem de caso.',
    aulas: [
      {
        id: 'm10-a01',
        ordem: 1,
        titulo: 'Chave de Rautek, Extração Rápida e Retirada de Veículo',
        tipo: 'PRATICA',
        duracaoMin: 55,
        videoUrl: '',
        descricao: 'Quando priorizar retirada imediata sob risco iminente de incêndio ou colapso.',
        isDemoPlaceholder: true,
      },
      {
        id: 'm10-a02',
        ordem: 2,
        titulo: 'Transporte Seguro em Equipe e Passagem de Plantão (MIST)',
        tipo: 'PRATICA',
        duracaoMin: 45,
        videoUrl: '',
        descricao: 'Comunicação objetiva com a equipe hospitalar e ambulância de suporte avançado.',
        isDemoPlaceholder: true,
      },
    ],
    materiais: [
      {
        id: 'mat-m10-1',
        titulo: 'Manual de Resgate, Extração e Transporte Seguro (15h)',
        tipo: 'MANUAL PRÁTICO',
        tamanho: '5.0 MB',
        arquivoUrl: '',
      },
    ],
    checklistPratico: [
      'Executar Chave de Rautek protegendo a coluna cervical',
      'Realizar passagem de caso estruturada pelo método MIST',
    ],
  },
  {
    id: 'mod-11',
    modulo: '11',
    titulo: 'Simulações Realísticas e Prática Supervisionada',
    cargaHoraria: '5h',
    cargaHorariaHoras: 5,
    resumo:
      'Cenários simulados integrados com múltiplas vítimas, trabalho sob pressão, liderança de cena e avaliação prática final supervisionada pelos 5 instrutores.',
    aulas: [
      {
        id: 'm11-a01',
        ordem: 1,
        titulo: 'Cenário Integrado de Trauma e Suporte de Vida (Avaliação Prática)',
        tipo: 'PRATICA',
        duracaoMin: 120,
        videoUrl: '',
        descricao: 'Simulação completa avaliada por Cleverson da Cruz e equipe BLACK Treinamentos.',
        isDemoPlaceholder: true,
      },
    ],
    materiais: [
      {
        id: 'mat-m11-1',
        titulo: 'Checklist Oficial das Simulações Realísticas Finais (5h)',
        tipo: 'CHECKLIST',
        tamanho: '2.8 MB',
        arquivoUrl: '',
      },
    ],
    checklistPratico: [
      'Concluir cenário simulado completo integrando XABCDE, controle de sangramento e transporte',
      'Atingir nota mínima de 70% na Avaliação Final de Aprendizagem',
    ],
  },
];

export const ATIVIDADES_INICIAIS_200H = [
  {
    id: 'atv-1',
    modulo: 'Mód. 03',
    titulo: 'Estudo de Caso — Avaliação Primária (XABCDE) e Sinais Vitais',
    prazo: 'Concluída em 10/04/2027',
    status: 'concluida',
    tipo: 'Estudo de Caso',
  },
  {
    id: 'atv-2',
    modulo: 'Mód. 04',
    titulo: 'Prática Supervisionada — RCP de Alta Qualidade e Uso do DEA',
    prazo: 'Concluída em 08/05/2027',
    status: 'concluida',
    tipo: 'Aula Prática',
  },
  {
    id: 'atv-3',
    modulo: 'Mód. 07',
    titulo: 'Atividade Prática — Prancha Rígida, Colar Cervical e Imobilizações',
    prazo: 'Entrega / Prática até 24/07/2027',
    status: 'pendente',
    tipo: 'Simulação Prática',
  },
  {
    id: 'atv-4',
    modulo: 'Mód. 11',
    titulo: 'Avaliação Final de Aprendizagem — Curso de Socorrista (200h)',
    prazo: 'Obrigatória (mínimo 70%) para liberar Certificado 200h',
    status: 'pendente',
    tipo: 'Avaliação Online',
    opensQuiz: true,
  },
];

export const FREQUENCIA_PRESENCIAL_DEMO = {
  totalSabadosRealizados: 16,
  presencasConfirmadas: 14,
  faltasJustificadas: 1,
  faltasNaoJustificadas: 1,
  percentualAtual: 88,
  minimoExigido: 75,
  ultimosSabados: [
    { data: '13/02/2027', tema: 'Aula Inaugural • Mód. 01 Introdução ao APH', status: 'presente' },
    { data: '20/02/2027', tema: 'Mód. 02 Anatomia e Fisiologia Aplicada', status: 'presente' },
    { data: '27/02/2027', tema: 'Mód. 03 Avaliação da Vítima (XABCDE)', status: 'presente' },
    { data: '06/03/2027', tema: 'Mód. 04 Prática de SBV e DEA (Unicesumar)', status: 'presente' },
    { data: '13/03/2027', tema: 'Mód. 05 Vias Aéreas e Ventilação', status: 'justificada' },
    { data: '20/03/2027', tema: 'Mód. 06 Controle de Hemorragias e Torniquete', status: 'presente' },
  ],
};

export const PARCELAS_FINANCEIRO_DEMO = [
  { numero: 1, vencimento: '10/02/2027', valor: 'R$ 200,00', status: 'paga', metodo: 'PIX' },
  { numero: 2, vencimento: '10/03/2027', valor: 'R$ 200,00', status: 'paga', metodo: 'PIX' },
  { numero: 3, vencimento: '10/04/2027', valor: 'R$ 200,00', status: 'paga', metodo: 'Cartão' },
  { numero: 4, vencimento: '10/05/2027', valor: 'R$ 200,00', status: 'paga', metodo: 'PIX' },
  { numero: 5, vencimento: '10/06/2027', valor: 'R$ 200,00', status: 'aberta', metodo: 'Boleto / PIX' },
  { numero: 6, vencimento: '10/07/2027', valor: 'R$ 200,00', status: 'futura', metodo: 'Boleto / PIX' },
  { numero: 7, vencimento: '10/08/2027', valor: 'R$ 200,00', status: 'futura', metodo: 'Boleto / PIX' },
  { numero: 8, vencimento: '10/09/2027', valor: 'R$ 200,00', status: 'futura', metodo: 'Boleto / PIX' },
  { numero: 9, vencimento: '10/10/2027', valor: 'R$ 200,00', status: 'futura', metodo: 'Boleto / PIX' },
  { numero: 10, vencimento: '10/11/2027', valor: 'R$ 200,00', status: 'futura', metodo: 'Boleto / PIX' },
];

export const COMUNICADOS_OFICIAIS_200H = [
  {
    id: 'com-1',
    data: 'Turma 2027 • Diretoria',
    titulo: 'Orientações para Simulações Realísticas aos Sábados (Prédio da Unicesumar)',
    mensagem:
      'Lembramos aos alunos da Turma de Socorrista APH (200h) para comparecerem com calçado fechado e roupa confortável nas aulas práticas de imobilização, controle de hemorragias e transporte de vítimas.',
    autor: 'Cleverson da Cruz — Diretor e Instrutor Responsável',
  },
  {
    id: 'com-2',
    data: 'Coordenação Pedagógica',
    titulo: 'Critérios Oficiais para Liberação do Certificado Frente e Verso (200 Horas)',
    mensagem:
      'Para liberar a impressão oficial do seu Certificado (200h — Lei 9.394/96), é necessário concluir todos os 11 módulos, manter frequência presencial mínima de 75% aos sábados e obter nota igual ou superior a 70% na Avaliação Final.',
    autor: 'BLACK Treinamentos Resgate e APH',
  },
];

export const QUIZ_QUESTIONS_200H = [
  {
    id: 1,
    pergunta:
      '1. No Módulo 06 (Hemorragias e Controle de Sangramento - 20h), qual é a conduta prioritária diante de uma hemorragia exsanguinante em extremidade?',
    opcoes: [
      'A) Exposição da vítima sem controle de sangramento',
      'B) Compressão direta imediata / aplicação técnica de torniquete tático',
      'C) Aguardar transporte sem intervir na lesão',
      'D) Elevar os membros inferiores apenas',
    ],
    correta: 1,
  },
  {
    id: 2,
    pergunta:
      '2. No Módulo 01 (Introdução ao APH e Legislação - 10h) e Módulo 03 (Avaliação da Vítima - 20h), qual é o primeiro passo obrigatório do socorrista?',
    opcoes: [
      'A) Iniciar compressões torácicas sem olhar o entorno',
      'B) Retirar o capacete da vítima imediatamente',
      'C) Avaliação e segurança da cena + biossegurança (EPI)',
      'D) Movimentar a vítima sem prancha rígida',
    ],
    correta: 2,
  },
  {
    id: 3,
    pergunta:
      '3. No Módulo 04 (Suporte Básico de Vida - SBV - 30h), qual é a relação padrão de compressões e ventilações na RCP de adulto?',
    opcoes: [
      'A) 15 compressões para 2 ventilações',
      'B) 30 compressões para 2 ventilações (100 a 120 comp/min)',
      'C) 50 compressões para 5 ventilações',
      'D) Apenas ventilações contínuas',
    ],
    correta: 1,
  },
];
