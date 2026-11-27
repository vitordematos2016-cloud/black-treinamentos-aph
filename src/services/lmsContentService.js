/**
 * ============================================================================
 * CAMADA DE SERVIÇO COMPARTILHADA — PORTAL DO ALUNO ↔ PAINEL ADMIN (CLEVE)
 * ============================================================================
 * Isola 100% dos dados da interface React (pronta para plugar o Supabase).
 * Tudo que o Cleve cria/aprova no Painel Admin (aulas 200h, PDFs, boletos,
 * comunicados, justificativas de falta e autorizações de certificado) reflete
 * ao vivo no Portal do Aluno via armazenamento sincronizado (localStorage hoje,
 * tabelas PostgreSQL + Supabase Storage em produção).
 */
import {
  CURSO_OFICIAL_200H,
  MODULOS_200H_ESTRUTURADOS,
  ATIVIDADES_INICIAIS_200H,
  PARCELAS_FINANCEIRO_DEMO,
  COMUNICADOS_OFICIAIS_200H,
} from '../data/courseContent200h';

const STORAGE_KEYS = {
  SESSION: 'black_aph_student_session_v1',
  PROGRESS: 'black_aph_student_progress_v1',
  NOTES: 'black_aph_student_notes_v1',
  JUSTIFICATIONS: 'black_aph_student_justifications_v1',
  READ_NOTICES: 'black_aph_student_read_notices_v1',
  INSTALLMENTS: 'black_aph_student_installments_v1',
  AVATAR: 'black_aph_student_avatar_v1',
  ANNOUNCEMENTS: 'black_aph_announcements_v1',
  MODULES: 'black_aph_course_modules_200h_v1',
  CERT_REQUESTS: 'black_aph_certificate_requests_v1',
  STUDENTS_ADMIN: 'black_aph_admin_students_200h_v1',
  EXPENSES_ADMIN: 'black_aph_admin_expenses_v1',
  ATTENDANCE_ADMIN: 'black_aph_admin_attendance_v1',
  ADMIN_PROFILE: 'black_aph_admin_profile_v1',
  LOCK_MIGRATION: 'black_aph_module_lock_migration_v2',
  LESSON_RATINGS: 'black_aph_lesson_ratings_v1',
  LESSON_COMMENTS: 'black_aph_lesson_comments_v1',
  CHAT_NOTIFICATIONS: 'black_aph_chat_notifications_v1',
  READ_CHAT_NOTIFS: 'black_aph_read_chat_notifs_v1',
  STUDENT_PASSWORDS: 'black_aph_student_passwords_v1',
};

function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignora erro de quota
  }
}

export function isSupabaseConfigured() {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  );
}

function ensureModuleLockPolicyMigration() {
  try {
    if (localStorage.getItem(STORAGE_KEYS.LOCK_MIGRATION)) return;
    localStorage.setItem(STORAGE_KEYS.LOCK_MIGRATION, '1');

    // Inicializa / restaura com política segura: somente Módulo 01 liberado até o professor liberar os próximos
    const existingMods = safeRead(STORAGE_KEYS.MODULES, null);
    if (Array.isArray(existingMods) && existingMods.length > 0) {
      const lockedMods = existingMods.map((m) => ({
        ...m,
        liberadoProfessor: m.modulo === '01',
      }));
      safeWrite(STORAGE_KEYS.MODULES, lockedMods);
    }

    // Zera conclusão simulada antiga para respeitar o fluxo real (Módulo 01 em diante)
    const freshProgress = {
      completedModuleIds: [],
      completedLessonIds: [],
      quizPassed: false,
      quizBestPct: null,
    };
    safeWrite(STORAGE_KEYS.PROGRESS, freshProgress);

    // Limpa eventuais solicitações de certificado criadas pela simulação antiga
    localStorage.removeItem(STORAGE_KEYS.CERT_REQUESTS);
  } catch {
    // ignora erro de storage
  }
}

/* ============================================================================
   1. CATÁLOGO & MÓDULOS DO CURSO APH 200H (EDITÁVEIS PELO ADMIN DO CLEVE!)
============================================================================ */
export function loadCourseModules200h() {
  ensureModuleLockPolicyMigration();
  const saved = safeRead(STORAGE_KEYS.MODULES, null);
  const source = Array.isArray(saved) && saved.length > 0 ? saved : MODULOS_200H_ESTRUTURADOS;
  return source.map((m) => ({
    ...m,
    liberadoProfessor:
      typeof m.liberadoProfessor === 'boolean' ? m.liberadoProfessor : m.modulo === '01',
  }));
}

export function saveCourseModules200h(modulesList) {
  safeWrite(STORAGE_KEYS.MODULES, modulesList);
}

function getLessonIdsForModules(moduleIds = []) {
  return loadCourseModules200h()
    .filter((m) => moduleIds.includes(m.modulo))
    .flatMap((m) => m.aulas.map((a) => a.id));
}

export function getCourseCatalog200h() {
  return {
    curso: CURSO_OFICIAL_200H,
    modulos: loadCourseModules200h(),
    atividadesIniciais: ATIVIDADES_INICIAIS_200H,
    dataSource: isSupabaseConfigured() ? 'supabase' : 'local_seed',
  };
}

/* ============================================================================
   2. SESSÃO, PROGRESSO, ANOTAÇÕES E FOTO DO ALUNO
============================================================================ */
export function loadStudentSession() {
  try {
    const tempRaw = sessionStorage.getItem(STORAGE_KEYS.SESSION);
    if (tempRaw) return JSON.parse(tempRaw);
  } catch {
    // ignora erro de sessionStorage
  }
  return safeRead(STORAGE_KEYS.SESSION, null);
}

export function saveStudentSession(session, rememberMe) {
  try {
    if (!session) {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      sessionStorage.removeItem(STORAGE_KEYS.SESSION);
      return;
    }
    const shouldRemember =
      typeof rememberMe === 'boolean'
        ? rememberMe
        : typeof session.rememberMe === 'boolean'
          ? session.rememberMe
          : true;
    const payload = JSON.stringify({ ...session, rememberMe: shouldRemember });
    if (shouldRemember) {
      localStorage.setItem(STORAGE_KEYS.SESSION, payload);
      sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    } else {
      sessionStorage.setItem(STORAGE_KEYS.SESSION, payload);
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  } catch {
    // ignora erro de storage
  }
}

export function loadStudentProgress() {
  ensureModuleLockPolicyMigration();
  const parsed = safeRead(STORAGE_KEYS.PROGRESS, null);
  if (parsed) {
    const completedModuleIds = Array.isArray(parsed.completedModuleIds)
      ? parsed.completedModuleIds
      : [];
    const completedLessonIds = Array.isArray(parsed.completedLessonIds)
      ? parsed.completedLessonIds
      : getLessonIdsForModules(completedModuleIds);
    return {
      ...parsed,
      completedModuleIds,
      completedLessonIds,
    };
  }
  return {
    completedModuleIds: [],
    completedLessonIds: [],
    quizPassed: false,
    quizBestPct: null,
  };
}

export function saveStudentProgress(progress) {
  safeWrite(STORAGE_KEYS.PROGRESS, progress);
}

export function loadModuleNotes() {
  return safeRead(STORAGE_KEYS.NOTES, {});
}

export function saveModuleNotes(notesMap) {
  safeWrite(STORAGE_KEYS.NOTES, notesMap);
}

export function loadLessonRatings() {
  const parsed = safeRead(STORAGE_KEYS.LESSON_RATINGS, {});
  return parsed && typeof parsed === 'object' ? parsed : {};
}

export function saveLessonRatings(ratingsMap) {
  safeWrite(STORAGE_KEYS.LESSON_RATINGS, ratingsMap);
}

export function loadLessonComments() {
  const parsed = safeRead(STORAGE_KEYS.LESSON_COMMENTS, {});
  return parsed && typeof parsed === 'object' ? parsed : {};
}

export function saveLessonComments(commentsMap) {
  safeWrite(STORAGE_KEYS.LESSON_COMMENTS, commentsMap);
}

const DISTINCT_STUDENT_NAME_PALETTE = [
  '#FFFFFF', // 1º aluno da conversa sempre em branco (iniciador / primeiro comentário)
  '#38BDF8', // 2º aluno — Azul Sky
  '#34D399', // 3º aluno — Esmeralda
  '#F472B6', // 4º aluno — Rosa
  '#A78BFA', // 5º aluno — Violeta
  '#22D3EE', // 6º aluno — Ciano
  '#FB923C', // 7º aluno — Laranja
  '#A3E635', // 8º aluno — Lima
  '#2DD4BF', // 9º aluno — Turquesa
  '#818CF8', // 10º aluno — Índigo Claro
];

/**
 * Mapeia deterministicamente a cor do nome de cada aluno em uma aula por ordem de chegada:
 * - O 1º aluno distinto da conversa sempre fica em branco (#FFFFFF).
 * - Do 2º em diante (2, 3, ..., 10+), cada novo aluno recebe uma cor distinta legível.
 */
export function buildLessonStudentColorMap(comments = []) {
  const map = new Map();
  let studentOrder = 0;

  comments.forEach((c) => {
    if (!c || c.authorRole === 'professor') return;
    const key = String(c.authorName || 'aluno').trim().toLowerCase();
    if (!map.has(key)) {
      const color =
        studentOrder < DISTINCT_STUDENT_NAME_PALETTE.length
          ? DISTINCT_STUDENT_NAME_PALETTE[studentOrder]
          : `hsl(${Math.round(((studentOrder - 9) * 137.508 + 25) % 360)}, 85%, 72%)`;
      map.set(key, { color, orderIndex: studentOrder });
      studentOrder += 1;
    }
  });

  return map;
}

export function getLessonParticipantColor(colorMap, authorName, authorRole = 'aluno') {
  if (authorRole === 'professor') return '#FFFFFF';
  const key = String(authorName || 'aluno').trim().toLowerCase();
  return colorMap.get(key)?.color || '#FFFFFF';
}

/* ============================================================================
   2B. NOTIFICAÇÕES DE DÚVIDAS & CHAT DAS AULAS (SEPARADAS DOS COMUNICADOS!)
============================================================================ */
export function loadChatNotifications() {
  const parsed = safeRead(STORAGE_KEYS.CHAT_NOTIFICATIONS, []);
  return Array.isArray(parsed) ? parsed : [];
}

export function saveChatNotifications(list) {
  safeWrite(STORAGE_KEYS.CHAT_NOTIFICATIONS, Array.isArray(list) ? list : []);
}

export function pushChatNotification(entry) {
  const current = loadChatNotifications();
  const next = [entry, ...current].slice(0, 80);
  saveChatNotifications(next);
  return next;
}

export function loadReadChatNotifIds(readerKey = 'default') {
  const parsed = safeRead(`${STORAGE_KEYS.READ_CHAT_NOTIFS}_${readerKey}`, []);
  return Array.isArray(parsed) ? parsed : [];
}

export function saveReadChatNotifIds(readerKey = 'default', ids = []) {
  safeWrite(
    `${STORAGE_KEYS.READ_CHAT_NOTIFS}_${readerKey}`,
    Array.from(new Set(ids))
  );
}

export function loadStudentAvatar(studentId = 'default') {
  try {
    return localStorage.getItem(`${STORAGE_KEYS.AVATAR}_${studentId}`) || '';
  } catch {
    return '';
  }
}

export function saveStudentAvatar(studentId = 'default', dataUrl = '') {
  try {
    if (!dataUrl) {
      localStorage.removeItem(`${STORAGE_KEYS.AVATAR}_${studentId}`);
    } else {
      localStorage.setItem(`${STORAGE_KEYS.AVATAR}_${studentId}`, dataUrl);
    }
  } catch {
    // ignora
  }
}

/* ============================================================================
   3. COMUNICADOS & NOTIFICAÇÕES PERSISTENTES (ADMIN → SININHO DO ALUNO)
============================================================================ */
export function loadAnnouncements() {
  const saved = safeRead(STORAGE_KEYS.ANNOUNCEMENTS, null);
  if (Array.isArray(saved) && saved.length > 0) return saved;
  return COMUNICADOS_OFICIAIS_200H;
}

export function saveAnnouncements(list) {
  safeWrite(STORAGE_KEYS.ANNOUNCEMENTS, list);
}

export function loadReadNoticeIds(studentId = 'default') {
  const parsed = safeRead(`${STORAGE_KEYS.READ_NOTICES}_${studentId}`, []);
  return Array.isArray(parsed) ? parsed : [];
}

export function saveReadNoticeIds(studentId = 'default', ids = []) {
  safeWrite(`${STORAGE_KEYS.READ_NOTICES}_${studentId}`, Array.from(new Set(ids)));
}

/* ============================================================================
   4. JUSTIFICATIVAS DE FALTA / ATESTADOS (ALUNO → ADMIN APROVA/RECUSA)
============================================================================ */
export function loadAbsenceJustifications() {
  const parsed = safeRead(STORAGE_KEYS.JUSTIFICATIONS, []);
  return Array.isArray(parsed) ? parsed : [];
}

export function saveAbsenceJustifications(list) {
  safeWrite(STORAGE_KEYS.JUSTIFICATIONS, list);
}

/* ============================================================================
   5. FINANCEIRO & BOLETOS 10X (ADMIN ANEXA/REMOVE → ALUNO VISUALIZA/BAIXA)
============================================================================ */
export function loadStudentInstallments() {
  const OVERDUE_DEMO_FLAG = 'black_aph_overdue_slice_v2';
  const PRICE_200_MIGRATION_FLAG = 'black_aph_installments_200_v1';
  const parsed = safeRead(STORAGE_KEYS.INSTALLMENTS, null);
  if (Array.isArray(parsed) && parsed.length > 0) {
    let working = parsed;
    let changed = false;

    try {
      // Migração oficial de mensalidade para R$ 200,00 (10x = R$ 2.000,00 total)
      if (!localStorage.getItem(PRICE_200_MIGRATION_FLAG)) {
        localStorage.setItem(PRICE_200_MIGRATION_FLAG, '1');
        working = working.map((p) =>
          p.valor === 'R$ 180,00' || p.valorCentavos === 18000 || !p.valorCentavos
            ? { ...p, valor: 'R$ 200,00', valorCentavos: 20000 }
            : p
        );
        changed = true;
      }

      // Migração única para corrigir status irreais de parcelas futuras de 2027 (evitar "Em atraso" em datas que vencem no futuro)
      if (!localStorage.getItem(OVERDUE_DEMO_FLAG)) {
        localStorage.setItem(OVERDUE_DEMO_FLAG, '1');
      }
      if (!localStorage.getItem('black_aph_fix_future_status_v1')) {
        localStorage.setItem('black_aph_fix_future_status_v1', '1');
        working = working.map((p) => {
          if (p.status === 'atrasada' && typeof p.vencimento === 'string') {
            const [d, m, y] = p.vencimento.split('/').map(Number);
            const due = new Date(y, m - 1, d);
            const today = new Date();
            if (due > today) {
              return { ...p, status: p.numero === 5 ? 'aberta' : p.numero < 5 ? 'paga' : 'futura' };
            }
          }
          return p;
        });
        changed = true;
      }

      if (changed) {
        safeWrite(STORAGE_KEYS.INSTALLMENTS, working);
      }
    } catch {
      // ignora
    }
    return working;
  }
  const seeded = PARCELAS_FINANCEIRO_DEMO.map((p) => ({
    ...p,
    valor: 'R$ 200,00',
    valorCentavos: 20000,
    boletoFileId: '',
    boletoNome: '',
    boletoTamanho: '',
    boletoTipo: '',
    boletoDataUrl: '',
  }));
  try {
    localStorage.setItem(OVERDUE_DEMO_FLAG, '1');
    localStorage.setItem(PRICE_200_MIGRATION_FLAG, '1');
    localStorage.setItem('black_aph_fix_future_status_v1', '1');
  } catch {
    // ignora
  }
  return seeded;
}

export function saveStudentInstallments(list) {
  safeWrite(STORAGE_KEYS.INSTALLMENTS, list);
}

/* ============================================================================
   6. SOLICITAÇÕES DE LIBERAÇÃO DE CERTIFICADO (ALUNO SOLICITA → CLEVE AUTORIZA!)
   Impede emissão automática com nome errado ou pegadinha — passa pelo Cleve!
============================================================================ */
const INITIAL_CERT_REQUESTS = [
  {
    id: 'cert-req-demo-01',
    studentId: 'alu-102',
    studentName: 'JULIANA ANDRADE PEREIRA',
    studentCpf: '112.648.209-15',
    turma: 'Turma 13/02/2027 • 200h',
    modulosConcluidos: 11,
    frequenciaPct: 92,
    notaProvaPct: 95,
    status: 'pending', // 'pending' | 'approved' | 'rejected'
    requestedAt: '22/11/2026',
    reviewedAt: '',
    reviewerNote: '',
  },
];

export function loadCertificateRequests() {
  const parsed = safeRead(STORAGE_KEYS.CERT_REQUESTS, null);
  if (Array.isArray(parsed)) return parsed;
  return INITIAL_CERT_REQUESTS;
}

export function saveCertificateRequests(list) {
  safeWrite(STORAGE_KEYS.CERT_REQUESTS, list);
}

export function getStudentCertificateRequest(studentId) {
  const list = loadCertificateRequests();
  return list.find((r) => r.studentId === studentId) || null;
}

/* ============================================================================
   7. ALUNOS, DESPESAS E CHAMADA DO ADMIN (100% FOCADO EM APH 200H)
============================================================================ */
const INITIAL_ADMIN_STUDENTS = [
  {
    id: 'demo-student-001',
    nome: 'VITOR MATOS',
    cpf: '108.492.739-00',
    email: 'vitor.matos@aluno.blackaph.com.br',
    telefone: '(45) 99837-8795',
    turma: 'Turma 13/02/2027 • Sábados',
    parcelasPagas: 4,
    parcelasTotal: 10,
    frequenciaPct: 88,
    progressoPct: 100,
    statusFinanceiro: 'Em dia',
    dataMatricula: '15/01/2027',
  },
  {
    id: 'alu-102',
    nome: 'JULIANA ANDRADE PEREIRA',
    cpf: '112.648.209-15',
    email: 'juliana.andrade@email.com',
    telefone: '(45) 99912-4410',
    turma: 'Turma 13/02/2027 • Sábados',
    parcelasPagas: 5,
    parcelasTotal: 10,
    frequenciaPct: 92,
    progressoPct: 100,
    statusFinanceiro: 'Em dia',
    dataMatricula: '18/01/2027',
  },
  {
    id: 'alu-103',
    nome: 'RAFAEL MARTINS SOUZA',
    cpf: '084.312.959-40',
    email: 'rafael.martins@email.com',
    telefone: '(45) 99844-1120',
    turma: 'Turma 13/02/2027 • Sábados',
    parcelasPagas: 4,
    parcelasTotal: 10,
    frequenciaPct: 84,
    progressoPct: 73,
    statusFinanceiro: 'Em dia',
    dataMatricula: '22/01/2027',
  },
  {
    id: 'alu-104',
    nome: 'CARLOS FERREIRA LIMA',
    cpf: '059.841.339-82',
    email: 'carlos.ferreira@email.com',
    telefone: '(45) 99701-8834',
    turma: 'Turma 13/02/2027 • Sábados',
    parcelasPagas: 3,
    parcelasTotal: 10,
    frequenciaPct: 79,
    progressoPct: 64,
    statusFinanceiro: 'Pendente',
    dataMatricula: '28/01/2027',
  },
  {
    id: 'alu-105',
    nome: 'AMANDA COSTA RIBEIRO',
    cpf: '093.120.479-08',
    email: 'amanda.costa@email.com',
    telefone: '(45) 99935-6219',
    turma: 'Turma 13/02/2027 • Sábados',
    parcelasPagas: 5,
    parcelasTotal: 10,
    frequenciaPct: 95,
    progressoPct: 82,
    statusFinanceiro: 'Em dia',
    dataMatricula: '02/02/2027',
  },
  {
    id: 'alu-106',
    nome: 'DIEGO SANTOS OLIVEIRA',
    cpf: '077.450.119-63',
    email: 'diego.santos@email.com',
    telefone: '(45) 99819-3044',
    turma: 'Turma 13/02/2027 • Sábados',
    parcelasPagas: 4,
    parcelasTotal: 10,
    frequenciaPct: 81,
    progressoPct: 55,
    statusFinanceiro: 'Em dia',
    dataMatricula: '05/02/2027',
  },
];

export function loadAdminStudents() {
  const parsed = safeRead(STORAGE_KEYS.STUDENTS_ADMIN, null);
  if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  return INITIAL_ADMIN_STUDENTS;
}

export function saveAdminStudents(list) {
  safeWrite(STORAGE_KEYS.STUDENTS_ADMIN, list);
}

export function updateStudentProfileContact({
  studentId = 'demo-student-001',
  email,
  telefone,
  nome,
}) {
  const students = loadAdminStudents();
  let changed = false;
  const nextStudents = students.map((student) => {
    if (student.id !== studentId) return student;
    changed = true;
    return {
      ...student,
      ...(typeof nome === 'string' && nome.trim() ? { nome: nome.trim().toUpperCase() } : {}),
      ...(typeof email === 'string' && email.trim() ? { email: email.trim() } : {}),
      ...(typeof telefone === 'string' && telefone.trim() ? { telefone: telefone.trim() } : {}),
    };
  });

  if (changed) {
    saveAdminStudents(nextStudents);
  }

  const currentSession = loadStudentSession();
  if (currentSession && currentSession.id === studentId) {
    saveStudentSession({
      ...currentSession,
      ...(typeof nome === 'string' && nome.trim() ? { nome: nome.trim().toUpperCase() } : {}),
      ...(typeof email === 'string' && email.trim() ? { email: email.trim() } : {}),
      ...(typeof telefone === 'string' && telefone.trim() ? { telefone: telefone.trim() } : {}),
    });
  }

  return nextStudents;
}

const INITIAL_EXPENSES = [
  { id: 'exp-1', descricao: 'Aluguel Sala / Estrutura Unicesumar', categoria: 'Estrutura', valor: 1850, data: '05/06/2027' },
  { id: 'exp-2', descricao: 'Insumos de Prática (Gaze, Ataduras, Luvas, Torniquetes)', categoria: 'Materiais APH', valor: 1240, data: '08/06/2027' },
  { id: 'exp-3', descricao: 'Ajuda de Custo Equipe de Instrutores', categoria: 'Equipe', valor: 2600, data: '12/06/2027' },
  { id: 'exp-4', descricao: 'Impressão de Apostilas e Certificados Couchê', categoria: 'Gráfica', valor: 680, data: '15/06/2027' },
];

export function loadAdminExpenses() {
  const parsed = safeRead(STORAGE_KEYS.EXPENSES_ADMIN, null);
  if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  return INITIAL_EXPENSES;
}

export function saveAdminExpenses(list) {
  safeWrite(STORAGE_KEYS.EXPENSES_ADMIN, list);
}

const DEFAULT_ATTENDANCE_SEED = {
  '2027-02-13': {
    'demo-student-001': 'presente',
    'alu-102': 'presente',
    'alu-103': 'presente',
    'alu-104': 'presente',
    'alu-105': 'presente',
    'alu-106': 'presente',
  },
  '2027-02-27': {
    'demo-student-001': 'presente',
    'alu-102': 'presente',
    'alu-103': 'justificada',
    'alu-104': 'falta',
    'alu-105': 'presente',
    'alu-106': 'presente',
  },
};

const DEFAULT_CONFIRMED_DAYS = {
  '2027-02-13': { savedAt: '13/02/2027 às 17:15' },
  '2027-02-27': { savedAt: '27/02/2027 às 17:10' },
};

export function loadAttendanceMap() {
  const saved = safeRead(STORAGE_KEYS.ATTENDANCE_ADMIN, null);
  if (saved && typeof saved === 'object') {
    return { ...DEFAULT_ATTENDANCE_SEED, ...saved };
  }
  return DEFAULT_ATTENDANCE_SEED;
}

export function saveAttendanceMap(map) {
  safeWrite(STORAGE_KEYS.ATTENDANCE_ADMIN, map);
}

export function loadConfirmedAttendanceDays() {
  const saved = safeRead('black_aph_confirmed_days_v1', null);
  if (saved && typeof saved === 'object') return saved;
  return DEFAULT_CONFIRMED_DAYS;
}

export function saveConfirmedAttendanceDays(map) {
  safeWrite('black_aph_confirmed_days_v1', map);
}

export function loadAdminProfile(defaultAvatar = '') {
  const saved = safeRead(STORAGE_KEYS.ADMIN_PROFILE, null);
  if (saved && saved.nome) return saved;
  return {
    nome: 'Cleverson da Cruz',
    cargo: 'Diretor & Coordenador',
    email: 'contato@blacktreinamentosaph.com.br',
    telefone: '(45) 99986-7555',
    avatarUrl: defaultAvatar,
  };
}

export function saveAdminProfile(profile) {
  safeWrite(STORAGE_KEYS.ADMIN_PROFILE, profile);
}

/* ============================================================================
   8. AUTENTICAÇÃO DO ALUNO (PRONTA PARA PLUGAR NO SUPABASE AUTH)
============================================================================ */
export function validateStrongPassword(password = '') {
  const cleaned = String(password || '').trim();
  const minLength = cleaned.length >= 6;
  const hasUppercase = /[A-ZÀ-Ý]/.test(cleaned);
  const hasSpecial = /[^A-Za-zÀ-ÿ0-9\s]/.test(cleaned);
  const missing = [];
  if (!minLength) missing.push('no mínimo 6 dígitos');
  if (!hasUppercase) missing.push('1 letra maiúscula');
  if (!hasSpecial) missing.push('1 caractere especial (ex: ! @ # $)');

  return {
    valid: minLength && hasUppercase && hasSpecial,
    checks: { minLength, hasUppercase, hasSpecial },
    error: missing.length > 0 ? `A senha deve conter ${missing.join(', ')}.` : '',
  };
}

export function getCustomStudentPassword(studentId = 'demo-student-001') {
  const map = safeRead(STORAGE_KEYS.STUDENT_PASSWORDS, {});
  return typeof map?.[studentId] === 'string' ? map[studentId] : '';
}

export function hasCustomStudentPassword(studentId = 'demo-student-001') {
  return getCustomStudentPassword(studentId).length >= 6;
}

export function saveCustomStudentPassword(studentId = 'demo-student-001', newPassword = '') {
  const cleaned = String(newPassword || '').trim();
  const check = validateStrongPassword(cleaned);
  if (!check.valid) return false;
  const map = safeRead(STORAGE_KEYS.STUDENT_PASSWORDS, {});
  safeWrite(STORAGE_KEYS.STUDENT_PASSWORDS, {
    ...(map && typeof map === 'object' ? map : {}),
    [studentId]: cleaned,
  });
  return true;
}

export function changeStudentPassword({
  studentId = 'demo-student-001',
  currentPassword = '',
  newPassword = '',
}) {
  const saved = getCustomStudentPassword(studentId);
  const next = String(newPassword || '').trim();
  const curr = String(currentPassword || '').trim();

  if (saved) {
    if (!curr) {
      return { ok: false, error: 'Informe sua senha atual para confirmar a alteração.' };
    }
    if (curr !== saved) {
      return { ok: false, error: 'A senha atual informada está incorreta.' };
    }
  }
  const strength = validateStrongPassword(next);
  if (!strength.valid) {
    return { ok: false, error: strength.error };
  }
  if (saved && next === saved) {
    return { ok: false, error: 'A nova senha precisa ser diferente da senha atual.' };
  }

  saveCustomStudentPassword(studentId, next);
  return { ok: true };
}

export async function authenticateStudent({
  identifier,
  password,
  skipPasswordCheck = false,
  rememberMe = true,
}) {
  const cleaned = (identifier || '').trim();
  const cleanedPassword = (password || '').trim();
  if (!cleaned || !cleanedPassword) {
    return {
      ok: false,
      error: 'Informe seu CPF ou e-mail e sua senha de acesso.',
    };
  }
  const strength = validateStrongPassword(cleanedPassword);
  if (!strength.valid) {
    return {
      ok: false,
      error: strength.error,
    };
  }

  const isCpf = /\d{3}/.test(cleaned) && !cleaned.includes('@');
  const students = loadAdminStudents();
  const demoStudent = students.find((s) => s.id === 'demo-student-001');
  const studentId = 'demo-student-001';

  const savedPassword = getCustomStudentPassword(studentId);
  if (!skipPasswordCheck && savedPassword && cleanedPassword !== savedPassword) {
    return {
      ok: false,
      error: 'Senha incorreta. Tente novamente ou clique em "Esqueci minha senha".',
    };
  }

  const session = {
    id: studentId,
    nome: demoStudent?.nome || 'VITOR MATOS',
    cpf: isCpf ? cleaned : demoStudent?.cpf || '108.492.739-00',
    email: demoStudent?.email || (cleaned.includes('@') ? cleaned : 'vitor.matos@aluno.blackaph.com.br'),
    telefone: demoStudent?.telefone || '(45) 99837-8795',
    turma: CURSO_OFICIAL_200H.turma,
    provider: isSupabaseConfigured() ? 'supabase' : 'demo',
    rememberMe: Boolean(rememberMe),
    loggedAt: new Date().toISOString(),
  };

  saveStudentSession(session, rememberMe);
  return { ok: true, session };
}

export function loginAsDemoStudent() {
  const students = loadAdminStudents();
  const demoStudent = students.find((s) => s.id === 'demo-student-001');
  const session = {
    id: 'demo-student-001',
    nome: demoStudent?.nome || 'VITOR MATOS',
    cpf: demoStudent?.cpf || '108.492.739-00',
    email: demoStudent?.email || 'vitor.matos@aluno.blackaph.com.br',
    telefone: demoStudent?.telefone || '(45) 99837-8795',
    turma: CURSO_OFICIAL_200H.turma,
    provider: 'demo',
    loggedAt: new Date().toISOString(),
  };
  saveStudentSession(session);
  return session;
}

export function logoutStudent() {
  saveStudentSession(null);
}
