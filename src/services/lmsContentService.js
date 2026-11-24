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

/* ============================================================================
   1. CATÁLOGO & MÓDULOS DO CURSO APH 200H (EDITÁVEIS PELO ADMIN DO CLEVE!)
============================================================================ */
export function loadCourseModules200h() {
  const saved = safeRead(STORAGE_KEYS.MODULES, null);
  if (Array.isArray(saved) && saved.length > 0) return saved;
  return MODULOS_200H_ESTRUTURADOS;
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
  return safeRead(STORAGE_KEYS.SESSION, null);
}

export function saveStudentSession(session) {
  try {
    if (!session) {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } else {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    }
  } catch {
    // ignora
  }
}

export function loadStudentProgress() {
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
  const defaultCompletedModules = ['01', '02', '03', '04', '05', '06', '07'];
  return {
    completedModuleIds: defaultCompletedModules,
    completedLessonIds: getLessonIdsForModules(defaultCompletedModules),
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
  const parsed = safeRead(STORAGE_KEYS.INSTALLMENTS, null);
  if (Array.isArray(parsed) && parsed.length > 0) {
    // Migração única para exibir as 4 fatias (Pagas, Em Aberto, Em Atraso, A Vencer) mantendo todos os boletos anexados
    try {
      if (!localStorage.getItem(OVERDUE_DEMO_FLAG)) {
        localStorage.setItem(OVERDUE_DEMO_FLAG, '1');
        const hasOverdue = parsed.some((p) => p.status === 'atrasada');
        if (!hasOverdue) {
          const migrated = parsed.map((p) =>
            p.numero === 4 ? { ...p, status: 'atrasada' } : p
          );
          safeWrite(STORAGE_KEYS.INSTALLMENTS, migrated);
          return migrated;
        }
      }
    } catch {
      // ignora
    }
    return parsed;
  }
  const seeded = PARCELAS_FINANCEIRO_DEMO.map((p) => ({
    ...p,
    status: p.numero === 4 ? 'atrasada' : p.status,
    valorCentavos: 18000,
    boletoFileId: '',
    boletoNome: '',
    boletoTamanho: '',
    boletoTipo: '',
    boletoDataUrl: '',
  }));
  try {
    localStorage.setItem(OVERDUE_DEMO_FLAG, '1');
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
export async function authenticateStudent({ identifier, password }) {
  const cleaned = (identifier || '').trim();
  if (!cleaned || !(password || '').trim()) {
    return {
      ok: false,
      error: 'Informe seu CPF ou e-mail e sua senha de acesso.',
    };
  }

  const isCpf = /\d{3}/.test(cleaned) && !cleaned.includes('@');
  const students = loadAdminStudents();
  const demoStudent = students.find((s) => s.id === 'demo-student-001');

  const session = {
    id: 'demo-student-001',
    nome: demoStudent?.nome || 'VITOR MATOS',
    cpf: isCpf ? cleaned : demoStudent?.cpf || '108.492.739-00',
    email: cleaned.includes('@') ? cleaned : demoStudent?.email || 'vitor.matos@aluno.blackaph.com.br',
    telefone: demoStudent?.telefone || '(45) 99837-8795',
    turma: CURSO_OFICIAL_200H.turma,
    provider: isSupabaseConfigured() ? 'supabase' : 'demo',
    loggedAt: new Date().toISOString(),
  };

  saveStudentSession(session);
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
