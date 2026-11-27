import React, { useState, useMemo, useEffect } from 'react';
import {
  Home,
  Users,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Megaphone,
  Award,
  Search,
  Bell,
  Plus,
  Upload,
  Trash2,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Edit3,
  Clock,
  DollarSign,
  TrendingUp,
  Receipt,
  Video,
  Send,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Download,
  Camera,
  ArrowLeft,
  Settings,
  Sparkles,
  Phone,
  Mail,
  Paperclip,
  PlayCircle,
  CheckCheck,
  Zap,
  Filter,
  Lock,
  Unlock,
  MessageSquare,
  Banknote,
  Smartphone,
  KeyRound,
  User,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import {
  BRAND_CONFIG,
  EQUIPE_INSTRUTORES,
  getStudentWhatsAppUrl,
} from '../data/blackData';
import OfficialCertificateViewer from './OfficialCertificateViewer';
import PaymentReceiptModal, { buildReceiptCode } from './PaymentReceiptModal';
import {
  KpiSparklineChart,
  RevenueProfitChart,
  InstallmentsDonutChart,
} from './AdminCharts';
import {
  loadAdminStudents,
  saveAdminStudents,
  loadCourseModules200h,
  saveCourseModules200h,
  loadAbsenceJustifications,
  saveAbsenceJustifications,
  loadStudentInstallments,
  saveStudentInstallments,
  loadAnnouncements,
  saveAnnouncements,
  loadCertificateRequests,
  saveCertificateRequests,
  loadAdminExpenses,
  saveAdminExpenses,
  loadAttendanceMap,
  saveAttendanceMap,
  loadConfirmedAttendanceDays,
  saveConfirmedAttendanceDays,
  loadAdminProfile,
  saveAdminProfile,
  loadStudentSession,
  saveStudentSession,
  loadLessonComments,
  saveLessonComments,
  buildLessonStudentColorMap,
  getLessonParticipantColor,
  loadChatNotifications,
  pushChatNotification,
  loadReadChatNotifIds,
  saveReadChatNotifIds,
  saveCustomStudentPassword,
  validateStrongPassword,
  formatCpfInput,
  formatPhoneInput,
} from '../services/lmsContentService';
import {
  saveFileToVault,
  loadFileUrlFromVault,
  deleteFileFromVault,
} from '../services/localFileVault';

const SPARKLINE_MATRICULAS = [
  { label: 'Nov', valor: 14 },
  { label: 'Dez', valor: 19 },
  { label: 'Jan', valor: 26 },
  { label: 'Fev', valor: 34 },
  { label: 'Mar', valor: 41 },
  { label: 'Abr', valor: 48 },
];

const SPARKLINE_ALUNOS = [
  { label: 'Nov', valor: 28 },
  { label: 'Dez', valor: 34 },
  { label: 'Jan', valor: 40 },
  { label: 'Fev', valor: 46 },
  { label: 'Mar', valor: 51 },
  { label: 'Abr', valor: 56 },
];

const SPARKLINE_FREQUENCIA = [
  { label: 'Sáb 1', valor: 84 },
  { label: 'Sáb 2', valor: 86 },
  { label: 'Sáb 3', valor: 83 },
  { label: 'Sáb 4', valor: 89 },
  { label: 'Sáb 5', valor: 91 },
  { label: 'Sáb 6', valor: 88 },
];

const SPARKLINE_CERTIFICADOS = [
  { label: 'T1', valor: 18 },
  { label: 'T2', valor: 24 },
  { label: 'T3', valor: 29 },
  { label: 'T4', valor: 36 },
  { label: 'T5', valor: 42 },
  { label: 'T6', valor: 49 },
];

const REVENUE_DATA_6M = [
  { mes: 'Jan', faturamento: 9600, despesas: 4100, lucro: 5500 },
  { mes: 'Fev', faturamento: 12400, despesas: 4900, lucro: 7500 },
  { mes: 'Mar', faturamento: 13800, despesas: 5300, lucro: 8500 },
  { mes: 'Abr', faturamento: 15200, despesas: 5800, lucro: 9400 },
  { mes: 'Mai', faturamento: 16900, despesas: 6150, lucro: 10750 },
  { mes: 'Jun', faturamento: 18400, despesas: 6370, lucro: 12030 },
];

const REVENUE_DATA_12M = [
  { mes: 'Jul', faturamento: 6800, despesas: 3100, lucro: 3700 },
  { mes: 'Ago', faturamento: 7400, despesas: 3400, lucro: 4000 },
  { mes: 'Set', faturamento: 8100, despesas: 3600, lucro: 4500 },
  { mes: 'Out', faturamento: 8900, despesas: 3900, lucro: 5000 },
  { mes: 'Nov', faturamento: 9200, despesas: 4000, lucro: 5200 },
  { mes: 'Dez', faturamento: 10100, despesas: 4300, lucro: 5800 },
  ...REVENUE_DATA_6M,
];

const CLASS_SATURDAYS = [
  { iso: '2027-02-13', label: '13/02/2027 — Aula Inaugural e Legislação APH (Mód. 01)' },
  { iso: '2027-02-27', label: '27/02/2027 — Anatomia e Fisiologia Humana (Mód. 02)' },
  { iso: '2027-03-13', label: '13/03/2027 — Avaliação da Vítima XABCDE (Mód. 03)' },
  { iso: '2027-03-27', label: '27/03/2027 — Suporte Básico de Vida e DEA (Mód. 04)' },
  { iso: '2027-04-17', label: '17/04/2027 — Vias Aéreas e Ventilação (Mód. 05)' },
  { iso: '2027-05-08', label: '08/05/2027 — Hemorragias e Torniquete (Mód. 06)' },
  { iso: '2027-06-05', label: '05/06/2027 — Traumatismos e Imobilizações (Mód. 07)' },
  { iso: '2027-07-03', label: '03/07/2027 — Urgências Clínicas (Mód. 08)' },
  { iso: '2027-08-07', label: '07/08/2027 — Emergências Pediátricas (Mód. 09)' },
  { iso: '2027-09-04', label: '04/09/2027 — Resgate e Transporte de Vítimas (Mód. 10)' },
  { iso: '2027-10-16', label: '16/10/2027 — Simulação Realística Final 200h (Mód. 11)' },
];

const CONFETTI_PARTICLES = [
  { tx: '-110px', ty: '-70px', rot: '-45deg', color: '#ED101C' },
  { tx: '-75px', ty: '-105px', rot: '35deg', color: '#FACC15' },
  { tx: '-35px', ty: '-120px', rot: '-25deg', color: '#10B981' },
  { tx: '0px', ty: '-130px', rot: '60deg', color: '#38BDF8' },
  { tx: '40px', ty: '-118px', rot: '-50deg', color: '#C084FC' },
  { tx: '82px', ty: '-98px', rot: '40deg', color: '#ED101C' },
  { tx: '115px', ty: '-64px', rot: '-30deg', color: '#FACC15' },
  { tx: '-92px', ty: '-38px', rot: '75deg', color: '#34D399' },
  { tx: '96px', ty: '-32px', rot: '-65deg', color: '#FF6B74' },
  { tx: '-20px', ty: '-90px', rot: '25deg', color: '#FFFFFF' },
  { tx: '24px', ty: '-86px', rot: '-40deg', color: '#FDE047' },
  { tx: '58px', ty: '-66px', rot: '50deg', color: '#60A5FA' },
];

export default function AdminDashboard() {
  // 7 ABAS REAIS 100% FUNCIONAIS — ZERO BOTÃO MORTO!
  // 'inicio' | 'alunos' | 'conteudo' | 'presenca' | 'financeiro' | 'comunicados' | 'certificados' | 'perfil-admin'
  const [activeTab, setActiveTab] = useState('inicio');
  const [chartRange, setChartRange] = useState('6m'); // '6m' | '12m'
  const [financeSubTab, setFinanceSubTab] = useState('boletos'); // 'boletos' | 'despesas' | 'gateway'
  const [searchQuery, setSearchQuery] = useState('');
  const [studentStatusFilter, setStudentStatusFilter] = useState('todos'); // 'todos' | 'Em dia' | 'Pendente'
  const [hoveredKpi, setHoveredKpi] = useState(null); // 'red' | 'blue' | 'green' | 'purple'
  const [showCelebration, setShowCelebration] = useState(false);
  const [autoDueReminders, setAutoDueReminders] = useState({ d5: true, d1: true, d0: true });
  const [toast, setToast] = useState(null);

  // Estados Sincronizados ao Vivo com o Portal do Aluno
  const [students, setStudents] = useState(() => loadAdminStudents());
  const [selectedFinanceStudentId, setSelectedFinanceStudentId] = useState(
    () => loadStudentSession()?.id || 'demo-student-001'
  );
  const [modules200h, setModules200h] = useState(() => loadCourseModules200h());
  const [justifications, setJustifications] = useState(() => loadAbsenceJustifications());
  const [installments, setInstallments] = useState(() =>
    loadStudentInstallments(loadStudentSession()?.id || 'demo-student-001')
  );
  const [announcements, setAnnouncements] = useState(() => loadAnnouncements());
  const [certRequests, setCertRequests] = useState(() => loadCertificateRequests());
  const [expenses, setExpenses] = useState(() => loadAdminExpenses());
  const [attendanceMap, setAttendanceMap] = useState(() => loadAttendanceMap());
  const [confirmedDays, setConfirmedDays] = useState(() => loadConfirmedAttendanceDays());
  const [attendanceDirty, setAttendanceDirty] = useState(false);
  const [activeGateway, setActiveGateway] = useState('MERCADO_PAGO');
  const defaultAdminPhoto = EQUIPE_INSTRUTORES[0]?.fotoPortrait || '/assets/lms-avatar-aluno.jpg';
  const [adminProfile, setAdminProfile] = useState(() => loadAdminProfile(defaultAdminPhoto));

  // Estados de Formulários das Abas
  const [showNewStudentForm, setShowNewStudentForm] = useState(false);
  const [newStudent, setNewStudent] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
  });
  const [editingStudent, setEditingStudent] = useState(null);
  const [dossierStudent, setDossierStudent] = useState(null);
  const [dossierPwdDraft, setDossierPwdDraft] = useState('');
  const [confirmRemoveStudentId, setConfirmRemoveStudentId] = useState(null);
  const [deleteTargetStudent, setDeleteTargetStudent] = useState(null);

  // Editor de Conteúdo (11 Módulos 200h)
  const [selectedModIdx, setSelectedModIdx] = useState(0);
  const [studioSubTab, setStudioSubTab] = useState('aulas'); // 'aulas' | 'materiais' | 'duvidas'
  const [showNewLessonForm, setShowNewLessonForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [newLesson, setNewLesson] = useState({
    titulo: '',
    tipo: 'VIDEO',
    duracaoMin: '45',
    videoUrl: '',
    descricao: '',
  });
  const [newMaterial, setNewMaterial] = useState({
    titulo: '',
    tipo: 'APOSTILA PDF',
    arquivoUrl: '',
  });
  const [lessonComments, setLessonComments] = useState(() => loadLessonComments());
  const [chatNotifications, setChatNotifications] = useState(() => loadChatNotifications());
  const [readAdminChatIds, setReadAdminChatIds] = useState(() =>
    loadReadChatNotifIds('admin-cleve')
  );
  const [adminReplyDrafts, setAdminReplyDrafts] = useState({});
  const [adminReplyTargets, setAdminReplyTargets] = useState({}); // { [aulaId]: { parentId, authorName } | null }

  // Chamada Presencial
  const [selectedSaturday, setSelectedSaturday] = useState('2027-03-13');
  const [presencaSubTab, setPresencaSubTab] = useState('chamada'); // 'chamada' | 'atestados' | 'quadro'
  const [attendanceFilter, setAttendanceFilter] = useState('todos'); // 'todos' | 'presente' | 'justificada' | 'falta'
  const [attendanceSearch, setAttendanceSearch] = useState('');
  const [justificationFilter, setJustificationFilter] = useState('todas'); // 'todas' | 'pendentes' | 'aprovadas' | 'recusadas'
  const [previewAttachment, setPreviewAttachment] = useState(null);
  const [receiptModalParcela, setReceiptModalParcela] = useState(null);
  const [paymentModalState, setPaymentModalState] = useState(null);

  // Nova Despesa
  const [newExpense, setNewExpense] = useState({
    descricao: '',
    categoria: 'Materiais APH',
    valor: '',
  });

  // Novo Comunicado + Controle de Destinatários (Todos | 1 ou vários alunos selecionados)
  const [newNotice, setNewNotice] = useState({
    titulo: '',
    categoria: 'Turma 2027 • Diretoria',
    mensagem: '',
  });
  const [noticeTargetMode, setNoticeTargetMode] = useState('all'); // 'all' | 'selected'
  const [selectedNoticeStudentIds, setSelectedNoticeStudentIds] = useState([]);
  const [noticeStudentSearch, setNoticeStudentSearch] = useState('');
  const [noticesMuralOpen, setNoticesMuralOpen] = useState(true);
  const [showAllNotices, setShowAllNotices] = useState(false);

  // Emissor Oficial de Certificados + Conferência de Solicitações
  const [certEditor, setCertEditor] = useState({
    studentName: 'VITOR MATOS',
    studentCpf: '108.492.739-00',
    periodStart: '13/02/2027',
    periodEnd: '16/10/2027',
    issueDate: '18 de Outubro de 2027.',
  });
  const [editingCertReq, setEditingCertReq] = useState(null);

  const showToast = (message, tone = 'success') => setToast({ message, tone });

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3600);
    return () => clearTimeout(t);
  }, [toast]);

  // Recarrega dúvidas e comentários sempre que abrir Estúdio de Aulas ou sub-aba Dúvidas
  useEffect(() => {
    if (activeTab === 'conteudo') {
      setLessonComments(loadLessonComments());
      setChatNotifications(loadChatNotifications());
      setReadAdminChatIds(loadReadChatNotifIds('admin-cleve'));
    }
  }, [activeTab, studioSubTab, selectedModIdx]);

  // Recarrega parcelas ao trocar o aluno selecionado no Financeiro
  useEffect(() => {
    setInstallments(loadStudentInstallments(selectedFinanceStudentId));
  }, [selectedFinanceStudentId]);

  // Sincronização em tempo real quando o aluno envia justificativa ou solicita certificado no Portal
  useEffect(() => {
    const syncAll = () => {
      setJustifications(loadAbsenceJustifications());
      setLessonComments(loadLessonComments());
      setChatNotifications(loadChatNotifications());
      setReadAdminChatIds(loadReadChatNotifIds('admin-cleve'));
      setCertRequests(loadCertificateRequests());
      setInstallments(loadStudentInstallments(selectedFinanceStudentId));
      setAnnouncements(loadAnnouncements());
      setModules200h(loadCourseModules200h());
      setStudents(loadAdminStudents());
    };
    window.addEventListener('focus', syncAll);
    window.addEventListener('storage', syncAll);
    return () => {
      window.removeEventListener('focus', syncAll);
      window.removeEventListener('storage', syncAll);
    };
  }, [selectedFinanceStudentId]);

  // Contadores Reais de Pendências
  const pendingCertRequests = useMemo(
    () => certRequests.filter((r) => r.status === 'pending'),
    [certRequests]
  );
  const approvedCertCount = useMemo(
    () => certRequests.filter((r) => r.status === 'approved').length + 48,
    [certRequests]
  );
  const pendingJustifications = useMemo(
    () => justifications.filter((j) => j.status === 'Em análise pela Secretaria'),
    [justifications]
  );
  const openInstallmentsCount = useMemo(
    () => installments.filter((p) => p.status === 'aberta' || p.status === 'atrasada').length,
    [installments]
  );

  const avgFrequency = useMemo(() => {
    if (!students.length) return 0;
    return Math.round(students.reduce((acc, s) => acc + (s.frequenciaPct || 0), 0) / students.length);
  }, [students]);

  const totalExpenses = useMemo(
    () => expenses.reduce((acc, e) => acc + Number(e.valor || 0), 0),
    [expenses]
  );

  const monthlyRevenue = 18400;
  const netProfit = Math.max(0, monthlyRevenue - totalExpenses);
  const profitMarginPct = monthlyRevenue > 0 ? ((netProfit / monthlyRevenue) * 100).toFixed(1) : '0.0';

  // Sincroniza o mês atual (Jun) do gráfico com os valores reais de Despesas e Lucro do painel!
  const revenueChartData = useMemo(() => {
    const base = chartRange === '6m' ? REVENUE_DATA_6M : REVENUE_DATA_12M;
    return base.map((row, idx) =>
      idx === base.length - 1
        ? { ...row, faturamento: monthlyRevenue, despesas: totalExpenses, lucro: netProfit }
        : row
    );
  }, [chartRange, monthlyRevenue, totalExpenses, netProfit]);

  // Dados reais para o Gráfico Circular 3D (Situação das Parcelas 10x da Turma APH 200h)
  const donutData = useMemo(() => {
    const pagas = installments.filter((p) => p.status === 'paga').length;
    const abertas = installments.filter((p) => p.status === 'aberta').length;
    const atrasadas = installments.filter((p) => p.status === 'atrasada').length;
    const futuras = installments.filter((p) => p.status === 'futura').length;
    const total = Math.max(1, pagas + abertas + atrasadas + futuras);
    return [
      { name: 'Pagas', value: pagas, pct: Math.round((pagas / total) * 100), color: '#10B981' },
      { name: 'Em Aberto', value: abertas, pct: Math.round((abertas / total) * 100), color: '#F59E0B' },
      { name: 'Em Atraso', value: atrasadas, pct: Math.round((atrasadas / total) * 100), color: '#ED101C' },
      { name: 'A Vencer', value: futuras, pct: Math.round((futuras / total) * 100), color: '#3B82F6' },
    ];
  }, [installments]);

  const formatBRL = (val) =>
    Number(val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  /* ==========================================================================
     HANDLERS DETERMINÍSTICOS (100% SINCRONIZADOS COM O PORTAL DO ALUNO)
  ========================================================================== */
  const handleAddStudent = (e) => {
    e.preventDefault();
    const formattedCpf = formatCpfInput(newStudent.cpf);
    if (!newStudent.nome.trim() || formattedCpf.replace(/\D/g, '').length !== 11) {
      showToast('Preencha o nome completo e os 11 dígitos do CPF (000.000.000-00).', 'info');
      return;
    }
    const cleanPhone = newStudent.telefone.trim()
      ? formatPhoneInput(newStudent.telefone)
      : '(45) 99999-0000';
    if (newStudent.telefone.trim() && cleanPhone.replace(/\D/g, '').length < 10) {
      showToast('Informe um WhatsApp válido com DDD e número: (45) 99999-9999.', 'info');
      return;
    }
    const created = {
      id: `alu-${Date.now()}`,
      nome: newStudent.nome.trim().toUpperCase(),
      cpf: formattedCpf,
      email: newStudent.email.trim() || 'aluno@blackaph.com.br',
      telefone: cleanPhone,
      turma: 'Turma 13/02/2027 • Sábados',
      parcelasPagas: 1,
      parcelasTotal: 10,
      frequenciaPct: 100,
      progressoPct: 0,
      statusFinanceiro: 'Em dia',
      dataMatricula: new Date().toLocaleDateString('pt-BR'),
    };
    const next = [created, ...students];
    setStudents(next);
    saveAdminStudents(next);
    setNewStudent({ nome: '', cpf: '', email: '', telefone: '' });
    setShowNewStudentForm(false);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 1650);
    showToast(`🎉 Nova matrícula confirmada! ${created.nome} já está na Turma APH 200h!`);
  };

  const handleSaveStudentEdit = (e) => {
    e.preventDefault();
    if (!editingStudent) return;
    const cleanName = editingStudent.nome.trim().toUpperCase();
    const cleanCpf = formatCpfInput(editingStudent.cpf);
    if (!cleanName || cleanCpf.replace(/\D/g, '').length !== 11) {
      showToast('Informe o nome completo e um CPF válido com 11 dígitos (000.000.000-00).', 'info');
      return;
    }

    const cleanPhone = editingStudent.telefone.trim()
      ? formatPhoneInput(editingStudent.telefone)
      : editingStudent.telefone;
    if (editingStudent.telefone.trim() && cleanPhone.replace(/\D/g, '').length < 10) {
      showToast('Informe um WhatsApp válido com DDD e número: (45) 99999-9999.', 'info');
      return;
    }

    const next = students.map((s) =>
      s.id === editingStudent.id
        ? { ...editingStudent, nome: cleanName, cpf: cleanCpf, telefone: cleanPhone }
        : s
    );
    setStudents(next);
    saveAdminStudents(next);

    // Se editou o aluno logado no Portal do Aluno (ex: correção de Nome/CPF do diploma!), sincroniza na hora!
    const activeSession = loadStudentSession();
    if (activeSession && activeSession.id === editingStudent.id) {
      saveStudentSession({ ...activeSession, nome: cleanName, cpf: cleanCpf });
    }
    setEditingStudent(null);
    showToast(`Dados oficiais de ${cleanName} atualizados e sincronizados com o Portal do Aluno ✓`);
  };

  // Conteúdo 200h (11 Módulos)
  const activeMod = modules200h[selectedModIdx] || modules200h[0];

  const handleToggleModuleRelease = (moduloCode) => {
    let becameUnlocked = false;
    const next = modules200h.map((m) => {
      if (m.modulo !== moduloCode) return m;
      becameUnlocked = !m.liberadoProfessor;
      return { ...m, liberadoProfessor: becameUnlocked };
    });
    setModules200h(next);
    saveCourseModules200h(next);
    showToast(
      becameUnlocked
        ? `Módulo ${moduloCode} LIBERADO para os alunos no Portal ✓`
        : `Módulo ${moduloCode} BLOQUEADO novamente para os alunos.`
    );
  };

  const handleProfessorReplyComment = (aula, e, overrideModulo = null, directTarget = null) => {
    e.preventDefault();
    const text = (adminReplyDrafts[aula.id] || '').trim();
    if (!text) return;
    const target = directTarget || adminReplyTargets[aula.id] || null;
    const targetModulo = overrideModulo || activeMod.modulo;
    const rawProf = (adminProfile?.nome || '').trim();
    const profName =
      !rawProf || rawProf.toLowerCase().includes('cleverson') ? 'Cleverson Black' : rawProf;

    const replyEntry = {
      id: `cmt-prof-${Date.now()}`,
      ...(target
        ? {
            parentId: target.parentId,
            replyToName: target.authorName,
            replyToSnippet: target.snippet,
          }
        : {}),
      lessonId: aula.id,
      moduloNumero: targetModulo,
      aulaTitulo: aula.titulo,
      authorName: profName,
      authorRole: 'professor',
      text,
      createdAt: new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    const latestMap = loadLessonComments();
    const next = {
      ...latestMap,
      [aula.id]: [...(latestMap[aula.id] || []), replyEntry],
    };
    setLessonComments(next);
    saveLessonComments(next);

    // Envia notificação separada de Conversa/Dúvida para os alunos (destacando Professor!)
    const profNotif = {
      id: `chatnotif-${replyEntry.id}`,
      commentId: replyEntry.id,
      lessonId: aula.id,
      moduloNumero: targetModulo,
      aulaTitulo: aula.titulo,
      authorName: profName,
      authorRole: 'professor',
      replyToName: target?.authorName || null,
      replyToSnippet: target?.snippet || null,
      text,
      createdAt: replyEntry.createdAt,
      timestamp: Date.now(),
    };
    const nextNotifs = pushChatNotification(profNotif);
    setChatNotifications(nextNotifs);

    // Marca a própria resposta do professor e dúvidas dessa aula como lidas no painel Admin
    const lessonUnreads = nextNotifs
      .filter((n) => n.id === profNotif.id || n.lessonId === aula.id)
      .map((n) => n.id);
    const updatedRead = Array.from(new Set([...readAdminChatIds, ...lessonUnreads]));
    setReadAdminChatIds(updatedRead);
    saveReadChatNotifIds('admin-cleve', updatedRead);

    setAdminReplyDrafts((prev) => ({ ...prev, [aula.id]: '' }));
    setAdminReplyTargets((prev) => ({ ...prev, [aula.id]: null }));
    showToast(`Resposta de ${profName} enviada — alunos notificados em Dúvidas & Chat ✓`);
  };

  const handleAddLesson = (e) => {
    e.preventDefault();
    if (!newLesson.titulo.trim()) return;
    const next = modules200h.map((m, idx) => {
      if (idx !== selectedModIdx) return m;
      const nextOrdem = m.aulas.length + 1;
      return {
        ...m,
        aulas: [
          ...m.aulas,
          {
            id: `m${m.modulo}-a${Date.now()}`,
            ordem: nextOrdem,
            titulo: newLesson.titulo.trim(),
            tipo: newLesson.tipo,
            duracaoMin: Number(newLesson.duracaoMin) || 45,
            videoUrl: newLesson.videoUrl.trim(),
            descricao: newLesson.descricao.trim() || 'Aula oficial do Curso de Socorrista APH (200h).',
          },
        ],
      };
    });
    setModules200h(next);
    saveCourseModules200h(next);
    setNewLesson({ titulo: '', tipo: 'VIDEO', duracaoMin: '45', videoUrl: '', descricao: '' });
    showToast(`Aula adicionada ao Módulo ${activeMod.modulo} — já visível no Portal do Aluno ✓`);
  };

  const handleRemoveLesson = (lessonId) => {
    const next = modules200h.map((m, idx) => {
      if (idx !== selectedModIdx) return m;
      const filtered = m.aulas
        .filter((a) => a.id !== lessonId)
        .map((a, i) => ({ ...a, ordem: i + 1 }));
      return { ...m, aulas: filtered };
    });
    setModules200h(next);
    saveCourseModules200h(next);
    showToast('Aula removida do módulo.', 'info');
  };

  const handleSaveLessonEdit = (e) => {
    e.preventDefault();
    if (!editingLesson || !editingLesson.titulo.trim()) return;
    const next = modules200h.map((m, idx) => {
      if (idx !== selectedModIdx) return m;
      return {
        ...m,
        aulas: m.aulas.map((a) =>
          a.id === editingLesson.id
            ? {
                ...a,
                titulo: editingLesson.titulo.trim(),
                tipo: editingLesson.tipo,
                duracaoMin: Number(editingLesson.duracaoMin) || 40,
                videoUrl: (editingLesson.videoUrl || '').trim(),
                descricao: (editingLesson.descricao || '').trim() || a.descricao,
              }
            : a
        ),
      };
    });
    setModules200h(next);
    saveCourseModules200h(next);
    setEditingLesson(null);
    showToast(`Aula atualizada no Módulo ${activeMod.modulo} — sincronizada com o Portal do Aluno ✓`);
  };

  const handleMoveLessonOrder = (lessonId, direction) => {
    const next = modules200h.map((m, idx) => {
      if (idx !== selectedModIdx) return m;
      const currentIdx = m.aulas.findIndex((a) => a.id === lessonId);
      const targetIdx = currentIdx + direction;
      if (currentIdx < 0 || targetIdx < 0 || targetIdx >= m.aulas.length) return m;
      const copy = [...m.aulas];
      const [moved] = copy.splice(currentIdx, 1);
      copy.splice(targetIdx, 0, moved);
      return {
        ...m,
        aulas: copy.map((a, i) => ({ ...a, ordem: i + 1 })),
      };
    });
    setModules200h(next);
    saveCourseModules200h(next);
  };

  const handleAddMaterial = (e) => {
    e.preventDefault();
    if (!newMaterial.titulo.trim()) return;
    const next = modules200h.map((m, idx) => {
      if (idx !== selectedModIdx) return m;
      return {
        ...m,
        materiais: [
          ...m.materiais,
          {
            id: `mat-${Date.now()}`,
            titulo: newMaterial.titulo.trim(),
            tipo: newMaterial.tipo,
            tamanho: 'PDF Oficial',
            arquivoUrl: newMaterial.arquivoUrl.trim(),
          },
        ],
      };
    });
    setModules200h(next);
    saveCourseModules200h(next);
    setNewMaterial({ titulo: '', tipo: 'APOSTILA PDF', arquivoUrl: '' });
    showToast(`Apostila adicionada ao Módulo ${activeMod.modulo} — já visível no Portal do Aluno ✓`);
  };

  const handleUploadMaterialFile = async (file) => {
    if (!file) return;
    const kb = Math.max(1, Math.round(file.size / 1024));
    const sizeLabel = kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
    const fileId = `mat-pdf-${activeMod.modulo}-${Date.now()}`;
    try {
      await saveFileToVault(fileId, file);
      const titleClean =
        newMaterial.titulo.trim() || file.name.replace(/\.[^/.]+$/, '');
      const next = modules200h.map((m, idx) => {
        if (idx !== selectedModIdx) return m;
        return {
          ...m,
          materiais: [
            ...m.materiais,
            {
              id: `mat-${Date.now()}`,
              titulo: titleClean,
              tipo: file.name.toLowerCase().endsWith('.pdf') ? 'APOSTILA PDF' : 'MATERIAL',
              tamanho: sizeLabel,
              arquivoUrl: '',
              arquivoFileId: fileId,
              arquivoNome: file.name,
              arquivoTipo: file.type || 'application/pdf',
            },
          ],
        };
      });
      setModules200h(next);
      saveCourseModules200h(next);
      setNewMaterial({ titulo: '', tipo: 'APOSTILA PDF', arquivoUrl: '' });
      showToast(`Arquivo "${file.name}" (${sizeLabel}) enviado para o Módulo ${activeMod.modulo} ✓`);
    } catch {
      showToast('Não foi possível salvar o arquivo localmente.', 'info');
    }
  };

  const handleRemoveMaterial = (matId) => {
    const target = activeMod?.materiais?.find((mat) => mat.id === matId);
    if (target?.arquivoFileId) deleteFileFromVault(target.arquivoFileId);
    const next = modules200h.map((m, idx) => {
      if (idx !== selectedModIdx) return m;
      return { ...m, materiais: m.materiais.filter((mat) => mat.id !== matId) };
    });
    setModules200h(next);
    saveCourseModules200h(next);
    showToast('Material removido.', 'info');
  };

  // Presença e Justificativas (Aprovar / Recusar / Excluir atestados do Portal do Aluno)
  const syncStudentFrequencySnapshot = (nextMap, targetConfirmed = confirmedDays) => {
    const confirmedIsoList = CLASS_SATURDAYS.map((s) => s.iso).filter((iso) =>
      Boolean(targetConfirmed[iso])
    );
    if (confirmedIsoList.length === 0) return;
    const updatedStudents = students.map((st) => {
      let okCount = 0;
      confirmedIsoList.forEach((iso) => {
        const val = nextMap[iso]?.[st.id] || 'presente';
        if (val === 'presente' || val === 'justificada') okCount += 1;
      });
      const pct = Math.round((okCount / confirmedIsoList.length) * 100);
      return { ...st, frequenciaPct: pct };
    });
    setStudents(updatedStudents);
    saveAdminStudents(updatedStudents);
  };

  const findJustificationMatch = (j) => {
    const sat = CLASS_SATURDAYS.find(
      (s) => j?.data && s.label.toLowerCase().startsWith(String(j.data).trim().toLowerCase())
    );
    const cpfDigits = String(j?.alunoCpf || '').replace(/\D/g, '');
    const nameClean = String(j?.alunoNome || '').trim().toUpperCase();
    const student = students.find((st) => {
      const stCpf = String(st.cpf || '').replace(/\D/g, '');
      if (cpfDigits && stCpf && cpfDigits === stCpf) return true;
      return Boolean(nameClean && String(st.nome || '').trim().toUpperCase() === nameClean);
    });
    return { sat, student };
  };

  const handleReviewJustification = (id, nextStatus) => {
    const target = justifications.find((j) => j.id === id);
    const next = justifications.map((j) => (j.id === id ? { ...j, status: nextStatus } : j));
    setJustifications(next);
    saveAbsenceJustifications(next);

    if (nextStatus.includes('Aprovada') && target) {
      const { sat, student } = findJustificationMatch(target);
      if (sat && student) {
        const nextMap = {
          ...attendanceMap,
          [sat.iso]: {
            ...(attendanceMap[sat.iso] || {}),
            [student.id]: 'justificada',
          },
        };
        setAttendanceMap(nextMap);
        saveAttendanceMap(nextMap);
        syncStudentFrequencySnapshot(nextMap);
        showToast(
          `✓ Atestado aprovado e falta justificada na chamada de ${target.data} (${student.nome}).`
        );
        return;
      }
    }
    showToast(`Justificativa atualizada para: ${nextStatus} ✓`);
  };

  const handleApplyJustificationToAttendance = (j) => {
    const { sat, student } = findJustificationMatch(j);
    if (!sat || !student) {
      showToast('Não foi possível vincular automaticamente a data ou o aluno na chamada.', 'info');
      return;
    }
    const nextMap = {
      ...attendanceMap,
      [sat.iso]: {
        ...(attendanceMap[sat.iso] || {}),
        [student.id]: 'justificada',
      },
    };
    setAttendanceMap(nextMap);
    saveAttendanceMap(nextMap);
    syncStudentFrequencySnapshot(nextMap);
    setSelectedSaturday(sat.iso);
    setPresencaSubTab('chamada');
    showToast(`✓ Presença de ${student.nome} marcada como Justificada em ${j.data}.`);
  };

  const handleDeleteJustification = (id) => {
    const target = justifications.find((j) => j.id === id);
    if (target?.anexoFileId) deleteFileFromVault(target.anexoFileId);
    const next = justifications.filter((j) => j.id !== id);
    setJustifications(next);
    saveAbsenceJustifications(next);
    showToast('Registro de justificativa removido.', 'info');
  };

  const handleExportAttendanceCsv = () => {
    const confirmedList = CLASS_SATURDAYS.filter((sat) => Boolean(confirmedDays[sat.iso]));
    const cols = confirmedList.length > 0 ? confirmedList : CLASS_SATURDAYS;
    const headers = [
      'Aluno',
      'CPF',
      ...cols.map((s) => s.label.split(' — ')[0]),
      'Presentes',
      'Justificadas',
      'Faltas',
      'Frequencia_%',
    ];
    const rows = students.map((st) => {
      let p = 0;
      let j = 0;
      let f = 0;
      const marks = cols.map((sat) => {
        const v = attendanceMap[sat.iso]?.[st.id] || 'presente';
        if (v === 'presente') {
          p += 1;
          return 'P';
        }
        if (v === 'justificada') {
          j += 1;
          return 'J';
        }
        f += 1;
        return 'F';
      });
      const pct = Math.round(((p + j) / Math.max(1, cols.length)) * 100);
      return [st.nome, st.cpf, ...marks, p, j, f, `${pct}%`];
    });
    const csv = [headers, ...rows]
      .map((line) => line.map((cell) => `"${String(cell || '').replace(/"/g, '""')}"`).join(';'))
      .join('\n');
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `black-aph-frequencia-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast(`Planilha de frequência (${students.length} alunos) exportada ✓`);
  };

  const handleSetAttendance = (studentId, status) => {
    const next = {
      ...attendanceMap,
      [selectedSaturday]: {
        ...(attendanceMap[selectedSaturday] || {}),
        [studentId]: status,
      },
    };
    setAttendanceMap(next);
    setAttendanceDirty(true);
  };

  const handleMarkAllPresent = () => {
    const dayMap = {};
    students.forEach((s) => {
      dayMap[s.id] = 'presente';
    });
    const next = { ...attendanceMap, [selectedSaturday]: dayMap };
    setAttendanceMap(next);
    setAttendanceDirty(true);
    showToast(`Todos os ${students.length} alunos marcados como Presentes — clique em "Confirmar e Salvar Chamada" abaixo.`, 'info');
  };

  const handleConfirmAttendance = () => {
    // Garante que todos os alunos da turma fiquem registrados neste sábado
    const dayMap = {};
    students.forEach((s) => {
      dayMap[s.id] = attendanceMap[selectedSaturday]?.[s.id] || 'presente';
    });
    const nextMap = { ...attendanceMap, [selectedSaturday]: dayMap };
    setAttendanceMap(nextMap);
    saveAttendanceMap(nextMap);

    const now = new Date();
    const stamp = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
    const nextConfirmed = {
      ...confirmedDays,
      [selectedSaturday]: { savedAt: stamp },
    };
    setConfirmedDays(nextConfirmed);
    saveConfirmedAttendanceDays(nextConfirmed);

    // Recalcula a % de frequência real de cada aluno considerando todos os sábados confirmados!
    const confirmedIsoList = CLASS_SATURDAYS.map((s) => s.iso).filter((iso) => Boolean(nextConfirmed[iso]));
    if (confirmedIsoList.length > 0) {
      const updatedStudents = students.map((st) => {
        let okCount = 0;
        confirmedIsoList.forEach((iso) => {
          const val = nextMap[iso]?.[st.id] || 'presente';
          if (val === 'presente' || val === 'justificada') okCount += 1;
        });
        const pct = Math.round((okCount / confirmedIsoList.length) * 100);
        return { ...st, frequenciaPct: pct };
      });
      setStudents(updatedStudents);
      saveAdminStudents(updatedStudents);
    }

    setAttendanceDirty(false);
    const satInfo = CLASS_SATURDAYS.find((s) => s.iso === selectedSaturday);
    showToast(
      `✓ Chamada confirmada e salva (${satInfo?.label.split(' — ')[0] || selectedSaturday})! Demonstrativo e frequência da turma atualizados.`
    );
  };

  const selectedFinanceStudent =
    students.find((s) => s.id === selectedFinanceStudentId) ||
    students.find((s) => s.id === 'demo-student-001') ||
    students[0] || { id: 'demo-student-001', nome: 'VITOR MATOS', cpf: '108.492.739-00' };

  const getPortalTargetStudent = () => selectedFinanceStudent;

  const handleSendDueReminderToPortal = (parcela) => {
    const isOverdue = parcela.status === 'atrasada';
    const targetStudent = getPortalTargetStudent();
    const created = {
      id: `com-boleto-${parcela.numero}-${Date.now()}`,
      data: `Financeiro • ${new Date().toLocaleDateString('pt-BR')}`,
      titulo: isOverdue
        ? `⚠ Lembrete: Parcela ${parcela.numero}/10 em atraso (Venc. ${parcela.vencimento})`
        : `Lembrete de Vencimento: Parcela ${parcela.numero}/10 (${parcela.vencimento})`,
      mensagem: isOverdue
        ? `Identificamos que a Parcela ${parcela.numero}/10 (${parcela.valor}, vencimento ${parcela.vencimento}) consta em aberto. Acesse a aba Financeiro do Portal do Aluno para visualizar seu boleto ou copiar o PIX.`
        : `Sua Parcela ${parcela.numero}/10 (${parcela.valor}) vence em ${parcela.vencimento}. O boleto já pode ser conferido na aba Financeiro do Portal do Aluno.`,
      autor: `${adminProfile.nome} — Secretaria Financeira`,
      targetType: 'selected',
      targetStudentIds: [targetStudent.id],
      targetLabels: [targetStudent.nome],
    };
    const next = [created, ...announcements];
    setAnnouncements(next);
    saveAnnouncements(next);
    showToast(`Lembrete da Parcela ${parcela.numero}/10 enviado para ${targetStudent.nome} ✓`);
  };

  // Abertura confiável de PDFs e Imagens salvos no IndexedDB (funciona entre Admin <-> Aluno!)
  const closePreviewAttachment = () => {
    if (previewAttachment?.isObjectUrl && previewAttachment?.url) {
      URL.revokeObjectURL(previewAttachment.url);
    }
    setPreviewAttachment(null);
  };

  const handleOpenAttachment = async ({ fileId, dataUrl, name, type }) => {
    if (fileId) {
      try {
        const record = await loadFileUrlFromVault(fileId);
        if (record?.url) {
          setPreviewAttachment({
            name: name || record.name || 'Arquivo',
            type: type || record.type || '',
            url: record.url,
            isObjectUrl: true,
          });
          return;
        }
      } catch {
        // continua para fallback
      }
    }
    if (dataUrl && dataUrl.startsWith('data:')) {
      setPreviewAttachment({
        name: name || 'Arquivo',
        type: type || '',
        url: dataUrl,
        isObjectUrl: false,
      });
      return;
    }
    showToast('Este arquivo foi anexado antes da atualização. Clique em "Trocar Boleto" para reanexá-lo.', 'info');
  };

  // Boletos & Despesas (IndexedDB — aceita PDF e Imagens de qualquer tamanho sem quebrar!)
  const handleUploadBoleto = async (parcelaNumero, file) => {
    if (!file) return;
    const kb = Math.max(1, Math.round(file.size / 1024));
    const sizeLabel = kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
    const inferredType =
      file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/png');
    const fileId = `boleto-p${parcelaNumero}-${Date.now()}`;

    try {
      const existing = installments.find((p) => p.numero === parcelaNumero);
      if (existing?.boletoFileId) {
        await deleteFileFromVault(existing.boletoFileId);
      }
      await saveFileToVault(fileId, file);

      const next = installments.map((p) =>
        p.numero === parcelaNumero
          ? {
              ...p,
              boletoFileId: fileId,
              boletoNome: file.name,
              boletoTamanho: sizeLabel,
              boletoTipo: inferredType,
              boletoDataUrl: '',
            }
          : p
      );
      setInstallments(next);
      saveStudentInstallments(next, selectedFinanceStudentId);
      setStudents(loadAdminStudents());
      showToast(`Boleto da Parcela ${parcelaNumero}/10 anexado (${sizeLabel}) — já abre no Portal do Aluno ✓`);
    } catch {
      showToast('Não foi possível salvar o arquivo localmente. Tente novamente.', 'info');
    }
  };

  const handleRemoveBoleto = async (parcelaNumero) => {
    const existing = installments.find((p) => p.numero === parcelaNumero);
    if (existing?.boletoFileId) {
      await deleteFileFromVault(existing.boletoFileId);
    }
    const next = installments.map((p) =>
      p.numero === parcelaNumero
        ? {
            ...p,
            boletoFileId: '',
            boletoNome: '',
            boletoTamanho: '',
            boletoTipo: '',
            boletoDataUrl: '',
          }
        : p
    );
    setInstallments(next);
    saveStudentInstallments(next, selectedFinanceStudentId);
    setStudents(loadAdminStudents());
    showToast(`Boleto da Parcela ${parcelaNumero}/10 removido.`, 'info');
  };

  const toDateInputISO = (dateStr) => {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(String(dateStr || '').trim());
    if (match) return `${match[3]}-${match[2]}-${match[1]}`;
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')}`;
  };

  const formatBrDateFromISO = (isoStr) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(isoStr || '').trim());
    if (match) return `${match[3]}/${match[2]}/${match[1]}`;
    return new Date().toLocaleDateString('pt-BR');
  };

  const openPaymentEditorModal = (parcela, forcedStatus = null) => {
    const now = new Date();
    const defaultDateISO = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(now.getDate()).padStart(2, '0')}`;
    const defaultHora = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const existingPagoDate = parcela.pagoDataISO || (parcela.pagoEm ? toDateInputISO(parcela.pagoEm) : defaultDateISO);
    const timeMatch = /(\d{2}:\d{2})/.exec(String(parcela.pagoEm || ''));
    const existingHora = parcela.pagoHora || (timeMatch ? timeMatch[1] : defaultHora);

    const normalizedMetodo =
      parcela.metodo && parcela.metodo !== 'Boleto / PIX'
        ? parcela.metodo === 'Cartão'
          ? 'Cartão de Crédito'
          : parcela.metodo
        : 'PIX';

    setPaymentModalState({
      numero: parcela.numero,
      valor: parcela.valor,
      vencimento: parcela.vencimento,
      previousStatus: parcela.status,
      status: forcedStatus || (parcela.status === 'paga' ? 'paga' : 'paga'),
      metodo: normalizedMetodo,
      pagoDataISO: existingPagoDate,
      pagoHora: existingHora,
      recebidoPor: parcela.recebidoPor || adminProfile.nome || 'Cleverson da Cruz',
      observacaoPagamento: parcela.observacaoPagamento || '',
    });
  };

  const handleSavePaymentModal = (e) => {
    e.preventDefault();
    if (!paymentModalState) return;

    const {
      numero,
      previousStatus,
      status,
      metodo,
      pagoDataISO,
      pagoHora,
      recebidoPor,
      observacaoPagamento,
    } = paymentModalState;

    const activeStudent = selectedFinanceStudent;
    const paidDateBr = formatBrDateFromISO(pagoDataISO);
    const cleanHora = (pagoHora || '14:00').slice(0, 5);
    const stamp = `${paidDateBr} às ${cleanHora}`;
    let updatedPaidParcela = null;

    const next = installments.map((p) => {
      if (p.numero !== numero) return p;
      if (status === 'paga') {
        const existingCodes = installments
          .filter((item) => item.numero !== p.numero && item.comprovanteCodigo)
          .map((item) => item.comprovanteCodigo);
        const receiptCode =
          p.comprovanteCodigo ||
          buildReceiptCode(p, activeStudent.nome, activeStudent.cpf, existingCodes);
        const updated = {
          ...p,
          status: 'paga',
          metodo,
          pagoEm: stamp,
          pagoDataISO,
          pagoHora: cleanHora,
          recebidoPor: (recebidoPor || adminProfile.nome || 'Secretaria BLACK').trim(),
          observacaoPagamento: (observacaoPagamento || '').trim(),
          comprovanteCodigo: receiptCode,
        };
        updatedPaidParcela = updated;
        return updated;
      }
      return {
        ...p,
        status,
        metodo: 'Boleto / PIX',
        pagoEm: '',
        pagoDataISO: '',
        pagoHora: '',
        recebidoPor: '',
        observacaoPagamento: '',
      };
    });

    setInstallments(next);
    saveStudentInstallments(next, activeStudent.id);
    setStudents(loadAdminStudents());
    setPaymentModalState(null);

    if (updatedPaidParcela) {
      if (previousStatus !== 'paga') {
        const now = new Date();
        const receiptNotice = {
          id: `com-comprovante-p${updatedPaidParcela.numero}-${Date.now()}`,
          data: `Comprovante Oficial • ${now.toLocaleDateString('pt-BR')}`,
          titulo: `✓ Pagamento Confirmado — Parcela ${String(updatedPaidParcela.numero).padStart(2, '0')}/10`,
          mensagem: `Pagamento da Parcela ${updatedPaidParcela.numero}/10 (${updatedPaidParcela.valor}) registrado via ${updatedPaidParcela.metodo} em ${updatedPaidParcela.pagoEm}. Comprovante nº ${updatedPaidParcela.comprovanteCodigo} disponível no Financeiro.`,
          autor: `${adminProfile.nome} — Secretaria Financeira`,
          targetType: 'selected',
          targetStudentIds: [activeStudent.id],
          targetLabels: [activeStudent.nome],
        };
        const nextNotices = [receiptNotice, ...announcements];
        setAnnouncements(nextNotices);
        saveAnnouncements(nextNotices);
      }
      showToast(
        `✓ Parcela ${updatedPaidParcela.numero}/10 salva (${updatedPaidParcela.metodo} • ${updatedPaidParcela.pagoEm}) para ${activeStudent.nome}!`
      );
    } else {
      showToast(
        `Status da Parcela ${numero}/10 de ${activeStudent.nome} atualizado com sucesso.`,
        'info'
      );
    }
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    const val = Number(String(newExpense.valor).replace(',', '.'));
    if (!newExpense.descricao.trim() || !val) return;
    const created = {
      id: `exp-${Date.now()}`,
      descricao: newExpense.descricao.trim(),
      categoria: newExpense.categoria,
      valor: val,
      data: new Date().toLocaleDateString('pt-BR'),
    };
    const next = [created, ...expenses];
    setExpenses(next);
    saveAdminExpenses(next);
    setNewExpense({ descricao: '', categoria: 'Materiais APH', valor: '' });
    showToast('Despesa registrada e Lucro Líquido recalculado ✓');
  };

  const handleRemoveExpense = (id) => {
    const next = expenses.filter((e) => e.id !== id);
    setExpenses(next);
    saveAdminExpenses(next);
  };

  // Comunicados (Sincronizado ao vivo com o sininho do Portal do Aluno — Todos ou Selecionados!)
  const toggleNoticeStudent = (studentId) => {
    setSelectedNoticeStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const handlePublishAnnouncement = (e) => {
    e.preventDefault();
    if (!newNotice.titulo.trim() || !newNotice.mensagem.trim()) return;

    if (noticeTargetMode === 'selected' && selectedNoticeStudentIds.length === 0) {
      showToast('Selecione pelo menos 1 aluno destinatário (ou mude para "Todos os Alunos").', 'info');
      return;
    }

    const pickedStudents = students.filter((s) => selectedNoticeStudentIds.includes(s.id));
    const created = {
      id: `com-${Date.now()}`,
      data: `${newNotice.categoria} • ${new Date().toLocaleDateString('pt-BR')}`,
      titulo: newNotice.titulo.trim(),
      mensagem: newNotice.mensagem.trim(),
      autor: `${adminProfile.nome} — ${adminProfile.cargo}`,
      targetType: noticeTargetMode,
      targetStudentIds: noticeTargetMode === 'selected' ? selectedNoticeStudentIds : [],
      targetLabels: noticeTargetMode === 'selected' ? pickedStudents.map((s) => s.nome) : [],
    };
    const next = [created, ...announcements];
    setAnnouncements(next);
    saveAnnouncements(next);
    setNewNotice({ titulo: '', categoria: 'Turma 2027 • Diretoria', mensagem: '' });

    if (noticeTargetMode === 'all') {
      showToast(`Comunicado enviado para Todos os Alunos (${students.length}) ✓`);
    } else if (pickedStudents.length === 1) {
      showToast(`Comunicado enviado exclusivamente para ${pickedStudents[0].nome} ✓`);
    } else {
      showToast(`Comunicado enviado para ${pickedStudents.length} alunos selecionados ✓`);
    }
  };

  const handleAdminAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = 256;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
        const compressed = canvas.toDataURL('image/jpeg', 0.85);
        const updated = { ...adminProfile, avatarUrl: compressed };
        setAdminProfile(updated);
        saveAdminProfile(updated);
        showToast('Foto do Administrador atualizada ✓');
      };
      img.src = typeof reader.result === 'string' ? reader.result : '';
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSaveAdminProfile = (e) => {
    e.preventDefault();
    const cleaned = {
      ...adminProfile,
      nome: adminProfile.nome.trim() || 'Cleverson da Cruz',
      cargo: adminProfile.cargo.trim() || 'Diretor & Coordenador',
    };
    setAdminProfile(cleaned);
    saveAdminProfile(cleaned);
    showToast('Configurações do Administrador salvas com sucesso ✓');
  };

  const adminInitials = (adminProfile.nome || 'CC')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

  const handleRemoveAnnouncement = (id) => {
    const next = announcements.filter((a) => a.id !== id);
    setAnnouncements(next);
    saveAnnouncements(next);
    showToast('Comunicado removido.', 'info');
  };

  // AUTORIZAÇÃO DE CERTIFICADO PELO CLEVE (Conferência de Nome/CPF anti-pegadinha!)
  const handleApproveCertRequest = (req, customName, customCpf) => {
    const finalName = (customName || req.studentName).trim().toUpperCase();
    const finalCpf = (customCpf || req.studentCpf).trim();

    const next = certRequests.map((r) =>
      r.id === req.id
        ? {
            ...r,
            studentName: finalName,
            studentCpf: finalCpf,
            status: 'approved',
            reviewedAt: new Date().toLocaleDateString('pt-BR'),
            reviewerNote: 'Conferido e autorizado pela Coordenação.',
          }
        : r
    );
    setCertRequests(next);
    saveCertificateRequests(next);

    // Sincroniza nome/CPF oficial caso o Cleve tenha corrigido na conferência
    const nextStudents = students.map((s) =>
      s.id === req.studentId ? { ...s, nome: finalName, cpf: finalCpf } : s
    );
    setStudents(nextStudents);
    saveAdminStudents(nextStudents);

    const activeSession = loadStudentSession();
    if (activeSession && activeSession.id === req.studentId) {
      saveStudentSession({ ...activeSession, nome: finalName, cpf: finalCpf });
    }

    setCertEditor((prev) => ({ ...prev, studentName: finalName, studentCpf: finalCpf }));
    setEditingCertReq(null);
    showToast(`Certificado de ${finalName} AUTORIZADO e liberado no Portal do Aluno ✓`);
  };

  const handleRejectCertRequest = (req) => {
    const next = certRequests.map((r) =>
      r.id === req.id
        ? {
            ...r,
            status: 'rejected',
            reviewedAt: new Date().toLocaleDateString('pt-BR'),
            reviewerNote:
              'Verificamos pendência nos dados cadastrais (Nome/CPF). Entre em contato com a Coordenação pelo WhatsApp.',
          }
        : r
    );
    setCertRequests(next);
    saveCertificateRequests(next);
    setEditingCertReq(null);
    showToast(`Solicitação de ${req.studentName} devolvida para conferência.`, 'info');
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.cpf.includes(searchQuery) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      studentStatusFilter === 'todos'
        ? true
        : studentStatusFilter === 'aptos'
          ? (s.progressoPct || 0) >= 100 && (s.frequenciaPct || 0) >= 75
          : s.statusFinanceiro === studentStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Estatísticas vivas para Alunos, Aptidão ao Certificado, Chamada e Despesas
  const studentsEmDiaCount = students.filter((s) => s.statusFinanceiro === 'Em dia').length;
  const studentsPendentesCount = students.length - studentsEmDiaCount;
  const studentsAptosCount = students.filter(
    (s) => (s.progressoPct || 0) >= 100 && (s.frequenciaPct || 0) >= 75
  ).length;

  const handleExportStudentsCsv = () => {
    const header = ['Nome Completo', 'CPF', 'Email', 'WhatsApp', 'Turma', 'Progresso (%)', 'Frequencia (%)', 'Parcelas Pagas', 'Status Financeiro', 'Data Matricula'];
    const rows = filteredStudents.map((s) => [
      s.nome,
      s.cpf,
      s.email || '',
      s.telefone || '',
      s.turma || 'Turma 13/02/2027',
      `${s.progressoPct ?? 0}%`,
      `${s.frequenciaPct ?? 0}%`,
      `${s.parcelasPagas ?? 0}/${s.parcelasTotal ?? 10}`,
      s.statusFinanceiro || 'Em dia',
      s.dataMatricula || '',
    ]);
    const csvContent =
      '\uFEFF' +
      [header, ...rows]
        .map((cols) => cols.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';'))
        .join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BLACK_Alunos_APH200h_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast(`Planilha CSV gerada com ${filteredStudents.length} aluno(s) ✓`);
  };

  const handleRemoveStudent = (studentId) => {
    if (students.length <= 1) {
      showToast('Mantenha pelo menos 1 aluno cadastrado na turma.', 'info');
      setConfirmRemoveStudentId(null);
      setDeleteTargetStudent(null);
      return;
    }
    const target = students.find((s) => s.id === studentId);
    const next = students.filter((s) => s.id !== studentId);
    setStudents(next);
    saveAdminStudents(next);
    if (selectedFinanceStudentId === studentId && next[0]) {
      setSelectedFinanceStudentId(next[0].id);
    }
    setConfirmRemoveStudentId(null);
    setDeleteTargetStudent(null);
    if (dossierStudent?.id === studentId) setDossierStudent(null);
    showToast(`Matrícula de ${target?.nome || 'aluno'} excluída com sucesso.`, 'info');
  };

  const saturdaySummary = useMemo(() => {
    let presentes = 0;
    let justificadas = 0;
    let faltas = 0;
    students.forEach((s) => {
      const st = attendanceMap[selectedSaturday]?.[s.id] || 'presente';
      if (st === 'presente') presentes += 1;
      else if (st === 'justificada') justificadas += 1;
      else faltas += 1;
    });
    const pct = students.length > 0 ? Math.round(((presentes + justificadas) / students.length) * 100) : 0;
    return { presentes, justificadas, faltas, pct };
  }, [students, attendanceMap, selectedSaturday]);

  const expensesByCategory = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      const cat = e.categoria || 'Outros';
      map[cat] = (map[cat] || 0) + Number(e.valor || 0);
    });
    return Object.entries(map);
  }, [expenses]);

  const dynamicSparkMatriculas = useMemo(
    () => [...SPARKLINE_MATRICULAS.slice(0, -1), { label: 'Atual', valor: students.length + 42 }],
    [students.length]
  );
  const dynamicSparkAlunos = useMemo(
    () => [...SPARKLINE_ALUNOS.slice(0, -1), { label: 'Atual', valor: students.length + 50 }],
    [students.length]
  );
  const dynamicSparkFreq = useMemo(
    () => [...SPARKLINE_FREQUENCIA.slice(0, -1), { label: 'Atual', valor: avgFrequency }],
    [avgFrequency]
  );
  const dynamicSparkCerts = useMemo(
    () => [...SPARKLINE_CERTIFICADOS.slice(0, -1), { label: 'Atual', valor: approvedCertCount }],
    [approvedCertCount]
  );

  const unreadStudentChats = useMemo(
    () =>
      chatNotifications.filter((n) => {
        if (n.authorRole !== 'aluno' || readAdminChatIds.includes(n.id)) return false;
        if (n.commentId && n.lessonId) {
          const list = lessonComments[n.lessonId] || [];
          return list.some((c) => c.id === n.commentId);
        }
        return true;
      }),
    [chatNotifications, readAdminChatIds, lessonComments]
  );

  // Lista unificada de TODAS as mensagens enviadas pelos alunos (em todos os 11 módulos!)
  const allStudentMessagesFeed = useMemo(() => {
    const entries = [];
    modules200h.forEach((mod, modIndex) => {
      mod.aulas.forEach((aula) => {
        const cmts = lessonComments[aula.id] || [];
        cmts.forEach((c) => {
          if (c.authorRole === 'professor') return;
          const isUnread = unreadStudentChats.some(
            (n) => n.commentId === c.id || (n.lessonId === aula.id && n.text === c.text)
          );
          const hasProfReplyAfter = cmts.some(
            (other, idx) =>
              idx > cmts.indexOf(c) &&
              other.authorRole === 'professor' &&
              (!other.parentId || other.parentId === c.id)
          );
          entries.push({
            comment: c,
            aula,
            mod,
            modIndex,
            isUnread,
            hasProfReplyAfter,
          });
        });
      });
    });
    return entries.reverse();
  }, [modules200h, lessonComments, unreadStudentChats]);

  // 7 ABAS REAIS DA SIDEBAR
  const sidebarItems = [
    { id: 'inicio', label: 'Visão Geral', desc: 'Gráficos e resumo', icon: Home },
    { id: 'alunos', label: 'Alunos e Matrículas', desc: `${students.length} alunos • APH 200h`, icon: Users },
    {
      id: 'conteudo',
      label: 'Aulas e PDFs (200h)',
      desc: '11 módulos oficiais',
      icon: BookOpen,
      badge: unreadStudentChats.length,
    },
    {
      id: 'presenca',
      label: 'Presença e Atestados',
      desc: 'Chamada e justificativas',
      icon: CalendarCheck,
      badge: pendingJustifications.length,
    },
    {
      id: 'financeiro',
      label: 'Financeiro e Boletos',
      desc: 'Parcelas 10x e despesas',
      icon: CreditCard,
      badge: openInstallmentsCount,
    },
    { id: 'comunicados', label: 'Comunicados', desc: 'Avisos para a turma', icon: Megaphone },
    {
      id: 'certificados',
      label: 'Certificados (200h)',
      desc: 'Autorizar e emitir A4',
      icon: Award,
      badge: pendingCertRequests.length,
    },
  ];

  const totalPendingAlerts = pendingCertRequests.length + pendingJustifications.length;

  return (
    <div className="min-h-screen bg-[#07080C] bg-[radial-gradient(ellipse_65%_45%_at_55%_0%,rgba(237,16,28,0.08)_0%,rgba(7,8,12,0)_68%)] text-white flex flex-col lg:flex-row font-sans selection:bg-[#ED101C] selection:text-white pb-24 lg:pb-16">
      {/* FOGOS / CONFETES CELEBRATÓRIOS AO MATRICULAR NOVO ALUNO */}
      {showCelebration && (
        <div
          className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          aria-hidden="true"
        >
          <div className="relative">
            {CONFETTI_PARTICLES.map((p, idx) => (
              <span
                key={idx}
                className="confetti-spark absolute block w-2.5 h-2.5 rounded-sm shadow-lg"
                style={{
                  backgroundColor: p.color,
                  boxShadow: `0 0 10px ${p.color}`,
                  '--tx': p.tx,
                  '--ty': p.ty,
                  '--rot': p.rot,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* TOAST GLOBAL */}
      {toast && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-[95] sm:max-w-sm bg-[#12141E]/95 backdrop-blur-xl border border-[#ED101C]/70 rounded-2xl px-4 py-3.5 shadow-[0_18px_50px_rgba(0,0,0,0.75)] flex items-start gap-3">
          {toast.tone === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-[#ED101C] shrink-0 mt-0.5" />
          )}
          <p className="text-xs sm:text-sm text-white/95 leading-relaxed flex-1">{toast.message}</p>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-white/50 hover:text-white p-0.5"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =====================================================================
          SIDEBAR ESQUERDA PREMIUM — TUDO AGRUPADO NO TOPO E FIXO NA ROLAGEM!
      ===================================================================== */}
      <aside className="w-full lg:w-[278px] lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto bg-gradient-to-b from-[#0D0E14] to-[#08090D] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-start shrink-0">
        {/* LOGO BLACK HD — CENTRALIZADA NO MOBILE, TABLET E DESKTOP! */}
        <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3.5 sm:pb-4 border-b border-white/10 flex items-center justify-center lg:flex-col lg:items-center lg:text-center relative overflow-hidden shrink-0">
          <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-52 h-32 rounded-full bg-[#ED101C]/14 blur-2xl" />
          <button
            type="button"
            onClick={() => setActiveTab('inicio')}
            className="relative flex flex-col items-center text-center focus:outline-none group"
          >
            <img
              src="/assets/logo-header-sharp.png"
              alt="BLACK Treinamentos - Resgate & APH"
              className="w-[154px] sm:w-[178px] lg:w-[214px] h-auto object-contain transition-transform duration-300 group-hover:scale-[1.03] contrast-[1.08] brightness-[1.05]"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
            />
            <span className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11px] text-white/80 font-semibold mt-2.5 sm:mt-3 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ED101C] animate-pulse" />
              <span>Painel Administrativo • Gestão</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('perfil-admin')}
            className="lg:hidden absolute right-3.5 top-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.06] border border-white/15 text-[11px] font-bold text-white active:scale-95 transition-all"
            aria-label="Configurações do Administrador"
          >
            <Settings className="w-3.5 h-3.5 text-[#ED101C]" />
            <span className="hidden xs:inline sm:inline">Perfil</span>
          </button>
        </div>

        {/* 7 ABAS DO MENU — SWIPE SUAVE NO MOBILE/TABLET E FIXAS NO DESKTOP */}
        <nav
          className="px-3 py-2.5 lg:p-3.5 flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar snap-x gap-1.5 shrink-0"
          aria-label="Menu Administrativo"
        >
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`relative w-auto lg:w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all duration-200 shrink-0 group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ED101C] to-[#C80B15] text-white shadow-[0_8px_26px_rgba(237,16,28,0.42)] ring-1 ring-white/20'
                    : 'text-white/75 hover:text-white hover:bg-white/[0.06] hover:translate-x-0.5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 transition-transform duration-200 ${
                      isActive ? 'scale-105' : 'text-white/65 group-hover:text-[#FF5A65]'
                    }`}
                  />
                  <div>
                    <span className="block text-xs sm:text-sm font-bold leading-tight whitespace-nowrap">
                      {item.label}
                    </span>
                    <span
                      className={`hidden lg:block text-[11px] mt-0.5 ${
                        isActive ? 'text-white/85' : 'text-white/45'
                      }`}
                    >
                      {item.desc}
                    </span>
                  </div>
                </div>
                {item.badge > 0 && (
                  <span
                    className={`min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-extrabold flex items-center justify-center shrink-0 tabular-nums ${
                      isActive
                        ? 'bg-white text-[#ED101C]'
                        : 'bg-[#ED101C] text-white shadow-[0_0_10px_rgba(237,16,28,0.6)]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* CARD DO CLEVE LOGO ABAIXO DO MENU — SOBE E DESCE JUNTO COM TODOS OS OUTROS! */}
        <div className="hidden lg:block px-3.5 pt-3 pb-5 border-t border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab('perfil-admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`w-full p-3 rounded-2xl border flex items-center justify-between gap-2.5 text-left transition-all duration-200 group ${
              activeTab === 'perfil-admin'
                ? 'bg-gradient-to-r from-[#23090D] to-[#14161F] border-[#ED101C]/80 shadow-[0_0_20px_rgba(237,16,28,0.22)]'
                : 'bg-white/[0.03] border-white/10 hover:border-[#ED101C]/50 hover:bg-white/[0.06]'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {adminProfile.avatarUrl ? (
                <img
                  src={adminProfile.avatarUrl}
                  alt={adminProfile.nome}
                  className="w-11 h-11 rounded-full object-cover object-top border-2 border-[#ED101C]/80 shadow-md shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#ED101C] to-[#7A070E] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                  {adminInitials}
                </div>
              )}
              <div className="min-w-0">
                <strong className="text-xs font-bold text-white block truncate">
                  {adminProfile.nome}
                </strong>
                <span className="text-[11px] text-emerald-400 font-semibold block truncate">
                  ● {adminProfile.cargo}
                </span>
                <span className="text-[10px] text-white/50 group-hover:text-white/80 block transition-colors">
                  Editar perfil / foto →
                </span>
              </div>
            </div>
            <Settings className="w-4 h-4 text-white/45 group-hover:text-white group-hover:rotate-45 transition-all duration-300 shrink-0" />
          </button>
        </div>
      </aside>

      {/* =====================================================================
          ÁREA PRINCIPAL — ESPAÇOSA, CENTRALIZADA E COM CONTRASTE PREMIUM
      ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOPBAR EXECUTIVA */}
        <header className="bg-[#0B0C11]/92 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 lg:px-10 py-3.5 sm:py-4 flex items-center justify-between gap-3 sticky top-0 z-30">
          <div className="min-w-0">
            <h1 className="font-display font-extrabold text-base sm:text-2xl text-white tracking-tight truncate">
              {activeTab === 'inicio'
                ? 'Painel de Controle — Visão Geral'
                : activeTab === 'alunos'
                ? 'Alunos e Matrículas (APH 200h)'
                : activeTab === 'conteudo'
                ? 'Estúdio de Aulas e Apostilas (11 Módulos • 200h)'
                : activeTab === 'presenca'
                ? 'Presença Presencial e Atestados'
                : activeTab === 'financeiro'
                ? 'Financeiro, Boletos (10x) e Despesas'
                : activeTab === 'comunicados'
                ? 'Comunicados Oficiais da Turma'
                : activeTab === 'perfil-admin'
                ? 'Configurações do Administrador'
                : 'Autorização e Emissão de Certificados (200h)'}
            </h1>
            <p className="text-xs text-white/70 font-medium hidden sm:block mt-0.5 truncate">
              {BRAND_CONFIG.corporateName} • CNPJ {BRAND_CONFIG.cnpj} • {BRAND_CONFIG.cityState}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {totalPendingAlerts > 0 && (
              <button
                type="button"
                onClick={() =>
                  setActiveTab(pendingCertRequests.length > 0 ? 'certificados' : 'presenca')
                }
                className="relative px-2.5 sm:px-3.5 py-2 rounded-xl bg-[#1E080C] hover:bg-[#ED101C] border border-[#ED101C]/65 text-white text-xs font-bold inline-flex items-center gap-1.5 sm:gap-2 transition-all hover:-translate-y-0.5"
              >
                <Bell className="w-4 h-4 text-[#FF6B74] shrink-0" />
                <span className="sm:hidden">{totalPendingAlerts}</span>
                <span className="hidden sm:inline">
                  {totalPendingAlerts} {totalPendingAlerts === 1 ? 'pendência' : 'pendências'}
                </span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveTab('comunicados')}
              className="px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-white/25 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all hover:-translate-y-0.5"
              title="Enviar Aviso"
            >
              <Megaphone className="w-3.5 h-3.5 text-[#FF5A65]" />
              <span className="hidden sm:inline">Enviar Aviso</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('alunos');
                setShowNewStudentForm(true);
              }}
              className="cta-btn-shimmer px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#ED101C] to-[#C80B15] hover:brightness-110 text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-[0_6px_22px_rgba(237,16,28,0.4)] transition-all hover:-translate-y-0.5"
              title="Nova Matrícula"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Matrícula</span>
            </button>
          </div>
        </header>

        <main
          key={activeTab}
          className="admin-tab-enter flex-1 w-full max-w-[1480px] mx-auto px-4 sm:px-8 lg:px-10 py-5 sm:py-8 space-y-6"
        >
          {/* =================================================================
              ABA 1: VISÃO GERAL — 4 CARDS NEON COM DISPARO DE RAIO NO HOVER + GRÁFICOS!
          ================================================================= */}
          {activeTab === 'inicio' && (
            <div className="space-y-6">
              {/* LINHA 1: 4 CARDS COLORIDOS (RAIO DE LUZ DISPARA PARA CIMA AO PASSAR O MOUSE OU CLICAR!) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Card 1: Vermelho — Matrículas */}
                <div
                  onClick={() => {
                    setHoveredKpi('red');
                    setActiveTab('alunos');
                  }}
                  onMouseEnter={() => setHoveredKpi('red')}
                  onMouseLeave={() => setHoveredKpi(null)}
                  role="button"
                  tabIndex={0}
                  className="group cursor-pointer rounded-2xl bg-gradient-to-br from-[#2E0B10] via-[#16121A] to-[#11131B] border border-[#ED101C]/50 hover:border-[#FF3B47] hover:shadow-[0_10px_32px_rgba(237,16,28,0.28)] p-4 sm:p-5 flex items-center justify-between gap-2 transition-all duration-300 hover:-translate-y-1 shadow-lg"
                >
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-white/75 block">
                      Matrículas (APH 200h)
                    </span>
                    <strong className="font-display font-extrabold text-3xl text-white mt-1 block tabular-nums">
                      {students.length + 42}
                    </strong>
                    <span className="text-xs font-bold text-emerald-400 mt-1 block">
                      ▲ +18% este mês
                    </span>
                  </div>
                  <KpiSparklineChart
                    data={dynamicSparkMatriculas}
                    idSuffix="red"
                    isActive={hoveredKpi === 'red'}
                  />
                </div>

                {/* Card 2: Azul — Alunos Ativos */}
                <div
                  onClick={() => {
                    setHoveredKpi('blue');
                    setActiveTab('alunos');
                  }}
                  onMouseEnter={() => setHoveredKpi('blue')}
                  onMouseLeave={() => setHoveredKpi(null)}
                  role="button"
                  tabIndex={0}
                  className="group cursor-pointer rounded-2xl bg-gradient-to-br from-[#0B2042] via-[#111726] to-[#11131B] border border-blue-500/50 hover:border-sky-400 hover:shadow-[0_10px_32px_rgba(56,189,248,0.25)] p-4 sm:p-5 flex items-center justify-between gap-2 transition-all duration-300 hover:-translate-y-1 shadow-lg"
                >
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-white/75 block">
                      Alunos Ativos (Turma)
                    </span>
                    <strong className="font-display font-extrabold text-3xl text-white mt-1 block tabular-nums">
                      {students.length + 50}
                    </strong>
                    <span className="text-xs font-bold text-sky-300 mt-1 block">
                      Turma 13/02/2027
                    </span>
                  </div>
                  <KpiSparklineChart
                    data={dynamicSparkAlunos}
                    idSuffix="blue"
                    isActive={hoveredKpi === 'blue'}
                  />
                </div>

                {/* Card 3: Verde — Frequência Média Presencial */}
                <div
                  onClick={() => {
                    setHoveredKpi('green');
                    setActiveTab('presenca');
                  }}
                  onMouseEnter={() => setHoveredKpi('green')}
                  onMouseLeave={() => setHoveredKpi(null)}
                  role="button"
                  tabIndex={0}
                  className="group cursor-pointer rounded-2xl bg-gradient-to-br from-[#092C20] via-[#101B1D] to-[#11131B] border border-emerald-500/50 hover:border-emerald-400 hover:shadow-[0_10px_32px_rgba(34,255,102,0.22)] p-4 sm:p-5 flex items-center justify-between gap-2 transition-all duration-300 hover:-translate-y-1 shadow-lg"
                >
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-white/75 block">
                      Frequência Média
                    </span>
                    <strong className="font-display font-extrabold text-3xl text-white mt-1 block tabular-nums">
                      {avgFrequency}%
                    </strong>
                    <span className="text-xs font-bold text-emerald-400 mt-1 block">
                      Mínimo exigido: 75%
                    </span>
                  </div>
                  <KpiSparklineChart
                    data={dynamicSparkFreq}
                    unit="%"
                    idSuffix="green"
                    isActive={hoveredKpi === 'green'}
                  />
                </div>

                {/* Card 4: Roxo — Certificados 200h */}
                <div
                  onClick={() => {
                    setHoveredKpi('purple');
                    setActiveTab('certificados');
                  }}
                  onMouseEnter={() => setHoveredKpi('purple')}
                  onMouseLeave={() => setHoveredKpi(null)}
                  role="button"
                  tabIndex={0}
                  className="group cursor-pointer rounded-2xl bg-gradient-to-br from-[#2B1247] via-[#181427] to-[#11131B] border border-purple-500/50 hover:border-purple-400 hover:shadow-[0_10px_32px_rgba(192,132,252,0.25)] p-4 sm:p-5 flex items-center justify-between gap-2 transition-all duration-300 hover:-translate-y-1 shadow-lg"
                >
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-white/75 block">
                      Certificados (200h)
                    </span>
                    <strong className="font-display font-extrabold text-3xl text-white mt-1 block tabular-nums">
                      {approvedCertCount}
                    </strong>
                    <span
                      className={`text-xs font-bold mt-1 block ${
                        pendingCertRequests.length > 0 ? 'text-amber-300' : 'text-purple-300'
                      }`}
                    >
                      {pendingCertRequests.length > 0
                        ? `${pendingCertRequests.length} aguardando aprovação`
                        : 'Todos conferidos ✓'}
                    </span>
                  </div>
                  <KpiSparklineChart
                    data={dynamicSparkCerts}
                    idSuffix="purple"
                    isActive={hoveredKpi === 'purple'}
                  />
                </div>
              </div>

              {/* LINHA 2: GRÁFICOS REAIS INTERATIVOS (FATURAMENTO x LUCRO + QUEIJO 3D) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7 admin-glass-card rounded-3xl p-5 sm:p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-display font-extrabold text-base sm:text-lg text-white">
                        Faturamento × Lucro Líquido (APH 200h)
                      </h2>
                      <p className="text-xs text-white/60">
                        Passe o mouse sobre os meses para ver receita, despesas e lucro exatos.
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-[#090B10] p-1 rounded-xl border border-white/10">
                      {[
                        { id: '6m', label: '6 meses' },
                        { id: '12m', label: '12 meses' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setChartRange(opt.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            chartRange === opt.id
                              ? 'bg-[#ED101C] text-white shadow-red-glow-sm'
                              : 'text-white/65 hover:text-white'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <RevenueProfitChart data={revenueChartData} />

                  <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-3 border-t border-white/10 text-center sm:text-left text-[11px] sm:text-sm">
                    <div className="min-w-0">
                      <span className="text-white/60 flex items-center justify-center sm:justify-start gap-1 text-[10px] sm:text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                        <span className="truncate">Faturamento</span>
                      </span>
                      <strong className="text-amber-300 font-mono block truncate mt-0.5">{formatBRL(monthlyRevenue)}</strong>
                    </div>
                    <div className="min-w-0">
                      <span className="text-white/60 flex items-center justify-center sm:justify-start gap-1 text-[10px] sm:text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-[#ED101C] shrink-0" />
                        <span className="truncate">Despesas</span>
                      </span>
                      <strong className="text-[#FF5A65] font-mono block truncate mt-0.5">{formatBRL(totalExpenses)}</strong>
                    </div>
                    <div className="min-w-0">
                      <span className="text-white/60 flex items-center justify-center sm:justify-start gap-1 text-[10px] sm:text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        <span className="truncate">Lucro ({profitMarginPct}%)</span>
                      </span>
                      <strong className="text-emerald-400 font-mono block truncate mt-0.5">{formatBRL(netProfit)}</strong>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 admin-glass-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-4 overflow-hidden min-w-0">
                  <div>
                    <h2 className="font-display font-extrabold text-base sm:text-lg text-white">
                      Situação Financeira — Turma APH 200h
                    </h2>
                    <p className="text-xs text-white/60">
                      Acompanhamento em tempo real das 10 parcelas do aluno.
                    </p>
                  </div>

                  <InstallmentsDonutChart
                    data={donutData}
                    centerValue={`${installments.length}x`}
                    centerLabel="Parcelas"
                  />

                  <button
                    type="button"
                    onClick={() => setActiveTab('financeiro')}
                    className="group w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-[#ED101C] border border-white/10 hover:border-[#ED101C] text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Abrir Gestão de Boletos e Despesas</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>

              {/* LINHA 3: PENDÊNCIAS REAIS + AÇÕES RÁPIDAS COM DESTAQUE VISUAL BLACK */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-7 admin-glass-card rounded-3xl border-t-2 border-t-[#ED101C] p-5 sm:p-6 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-display font-extrabold text-base sm:text-lg text-white flex items-center gap-2.5">
                      <span className="w-9 h-9 rounded-xl bg-[#ED101C]/20 border border-[#ED101C]/50 shadow-[0_0_16px_rgba(237,16,28,0.28)] flex items-center justify-center shrink-0">
                        <AlertCircle className="w-4 h-4 text-[#FF5A65]" />
                      </span>
                      <div>
                        <span className="block leading-tight">Pendências Reais para Aprovação</span>
                        <span className="text-[11px] font-normal text-white/55 block">
                          Ações prioritárias aguardando conferência de {adminProfile.nome.split(' ')[0]}
                        </span>
                      </div>
                    </h2>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/45 text-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.2)] shrink-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Ao vivo</span>
                    </span>
                  </div>

                  <div className="space-y-3 my-auto">
                    {[
                      {
                        tab: 'certificados',
                        count: pendingCertRequests.length,
                        icon: Award,
                        title:
                          pendingCertRequests.length === 1
                            ? '1 certificado aguardando conferência'
                            : pendingCertRequests.length > 1
                              ? `${pendingCertRequests.length} certificados aguardando conferência`
                              : 'Certificados oficiais em dia',
                        desc: 'Conferir Nome completo e CPF antes de liberar a impressão A4 (200h).',
                        badgeText:
                          pendingCertRequests.length > 0
                            ? `${pendingCertRequests.length} pendente${pendingCertRequests.length > 1 ? 's' : ''}`
                            : 'Em dia ✓',
                        accentCard:
                          pendingCertRequests.length > 0
                            ? 'bg-gradient-to-r from-[#230B11] via-[#17121B] to-[#12141E] border-[#ED101C]/55 hover:border-[#FF5A65] shadow-[0_10px_28px_rgba(237,16,28,0.12)]'
                            : 'bg-gradient-to-r from-[#131722] to-[#10131C] border-white/15 hover:border-amber-400/45',
                        borderLeft: pendingCertRequests.length > 0 ? 'border-l-[#ED101C]' : 'border-l-amber-400/70',
                        iconBox: 'bg-amber-500/20 border-amber-400/50 text-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.2)]',
                        badgeCls:
                          pendingCertRequests.length > 0
                            ? 'bg-[#ED101C] text-white shadow-red-glow-sm'
                            : 'bg-emerald-500/15 border border-emerald-400/40 text-emerald-300',
                      },
                      {
                        tab: 'presenca',
                        count: pendingJustifications.length,
                        icon: CalendarCheck,
                        title:
                          pendingJustifications.length === 1
                            ? '1 atestado ou justificativa recebida'
                            : pendingJustifications.length > 1
                              ? `${pendingJustifications.length} atestados ou justificativas recebidos`
                              : 'Atestados de frequência conferidos',
                        desc: 'Visualizar anexo enviado pelo aluno e aprovar ou recusar a justificativa.',
                        badgeText:
                          pendingJustifications.length > 0
                            ? `${pendingJustifications.length} para analisar`
                            : 'Tudo conferido ✓',
                        accentCard:
                          pendingJustifications.length > 0
                            ? 'bg-gradient-to-r from-[#0B1E18] via-[#121920] to-[#12141E] border-emerald-400/50 hover:border-emerald-300 shadow-[0_10px_28px_rgba(16,185,129,0.12)]'
                            : 'bg-gradient-to-r from-[#0E1A18] to-[#11141E] border-emerald-500/25 hover:border-emerald-400/55',
                        borderLeft: 'border-l-emerald-400',
                        iconBox: 'bg-emerald-500/20 border-emerald-400/45 text-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.18)]',
                        badgeCls:
                          pendingJustifications.length > 0
                            ? 'bg-emerald-500 text-black font-extrabold'
                            : 'bg-emerald-500/15 border border-emerald-400/35 text-emerald-300',
                      },
                      {
                        tab: 'financeiro',
                        count: openInstallmentsCount,
                        icon: CreditCard,
                        title:
                          openInstallmentsCount === 1
                            ? '1 parcela em aberto aguardando pagamento'
                            : openInstallmentsCount > 1
                              ? `${openInstallmentsCount} parcelas em aberto ou em atraso`
                              : 'Parcelas do aluno selecionado em dia',
                        desc: 'Dar baixa em PIX, Cartão ou Dinheiro com horário, ou anexar boleto PDF.',
                        badgeText:
                          openInstallmentsCount > 0
                            ? `${openInstallmentsCount} em aberto`
                            : 'Quitadas ✓',
                        accentCard:
                          openInstallmentsCount > 0
                            ? 'bg-gradient-to-r from-[#21150A] via-[#191418] to-[#12141E] border-amber-400/45 hover:border-amber-300 shadow-[0_10px_28px_rgba(245,158,11,0.12)]'
                            : 'bg-gradient-to-r from-[#141722] to-[#10131C] border-white/15 hover:border-amber-400/45',
                        borderLeft: openInstallmentsCount > 0 ? 'border-l-amber-400' : 'border-l-sky-400',
                        iconBox: 'bg-[#ED101C]/20 border-[#ED101C]/50 text-[#FF6B74] shadow-[0_0_14px_rgba(237,16,28,0.2)]',
                        badgeCls:
                          openInstallmentsCount > 0
                            ? 'bg-amber-500/20 border border-amber-400/60 text-amber-200'
                            : 'bg-emerald-500/15 border border-emerald-400/35 text-emerald-300',
                      },
                      {
                        tab: 'conteudo',
                        count: unreadStudentChats.length,
                        icon: MessageSquare,
                        title:
                          unreadStudentChats.length === 1
                            ? '1 dúvida de aluno no chat das aulas'
                            : unreadStudentChats.length > 1
                              ? `${unreadStudentChats.length} dúvidas de alunos nas aulas`
                              : 'Dúvidas do chat das aulas respondidas',
                        desc: 'Responder perguntas dos alunos diretamente nos módulos e acompanhar avaliações.',
                        badgeText:
                          unreadStudentChats.length > 0
                            ? `${unreadStudentChats.length} nova${unreadStudentChats.length > 1 ? 's' : ''}`
                            : 'Respondidas ✓',
                        accentCard:
                          unreadStudentChats.length > 0
                            ? 'bg-gradient-to-r from-[#0C1829] via-[#131724] to-[#12141E] border-sky-400/50 hover:border-sky-300 shadow-[0_10px_28px_rgba(56,189,248,0.12)]'
                            : 'bg-gradient-to-r from-[#0F1522] to-[#11141E] border-sky-400/25 hover:border-sky-400/55',
                        borderLeft: 'border-l-sky-400',
                        iconBox: 'bg-sky-500/20 border-sky-400/45 text-sky-300 shadow-[0_0_14px_rgba(56,189,248,0.18)]',
                        badgeCls:
                          unreadStudentChats.length > 0
                            ? 'bg-sky-500 text-black font-extrabold'
                            : 'bg-sky-500/15 border border-sky-400/35 text-sky-300',
                      },
                    ].map((row) => {
                      const RowIcon = row.icon;
                      return (
                        <button
                          key={row.tab}
                          type="button"
                          onClick={() => {
                            setActiveTab(row.tab);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`group w-full p-3.5 sm:p-4 rounded-2xl border border-l-4 ${row.borderLeft} ${row.accentCard} flex items-center justify-between gap-3 text-left transition-all duration-200 hover:-translate-y-0.5`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${row.iconBox}`}>
                              <RowIcon className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <strong className="text-sm text-white leading-snug">
                                  {row.title}
                                </strong>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold whitespace-nowrap ${row.badgeCls}`}>
                                  {row.badgeText}
                                </span>
                              </div>
                              <span className="text-xs text-white/70 block mt-0.5 truncate">
                                {row.desc}
                              </span>
                            </div>
                          </div>
                          <span className="w-8 h-8 rounded-xl bg-white/[0.06] group-hover:bg-[#ED101C] border border-white/10 group-hover:border-[#ED101C] flex items-center justify-center text-white/70 group-hover:text-white transition-all shrink-0">
                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* AÇÕES RÁPIDAS COM GRADIENTE, ÍCONES LUMINOSOS E CONTADORES */}
                <div className="lg:col-span-5 admin-glass-card rounded-3xl border-t-2 border-t-amber-400 p-5 sm:p-6 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/45 shadow-[0_0_16px_rgba(251,191,36,0.2)] flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4 text-amber-300" />
                      </span>
                      <div>
                        <h2 className="font-display font-extrabold text-base sm:text-lg text-white leading-tight">
                          Ações Rápidas
                        </h2>
                        <p className="text-[11px] text-white/60">
                          Atalhos diretos para a rotina da coordenação
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 my-auto">
                    {[
                      {
                        label: 'Autorizar Certificados',
                        sub: 'Diploma A4 • 200h',
                        icon: Award,
                        tab: 'certificados',
                        badge: pendingCertRequests.length,
                        cardCls:
                          'bg-gradient-to-br from-[#21160B] via-[#151722] to-[#11131B] border-amber-400/35 hover:border-amber-300 hover:shadow-[0_10px_24px_rgba(245,158,11,0.22)]',
                        iconCls: 'bg-amber-500/20 border-amber-400/50 text-amber-300',
                      },
                      {
                        label: 'Financeiro 10x',
                        sub: 'PIX, Cartão, Dinheiro',
                        icon: CreditCard,
                        tab: 'financeiro',
                        badge: openInstallmentsCount,
                        cardCls:
                          'bg-gradient-to-br from-[#230B10] via-[#161520] to-[#11131B] border-[#ED101C]/40 hover:border-[#FF5A65] hover:shadow-[0_10px_24px_rgba(237,16,28,0.26)]',
                        iconCls: 'bg-[#ED101C]/20 border-[#ED101C]/55 text-[#FF6B74]',
                      },
                      {
                        label: 'Subir Aulas / PDFs',
                        sub: '11 módulos e dúvidas',
                        icon: BookOpen,
                        tab: 'conteudo',
                        badge: unreadStudentChats.length,
                        cardCls:
                          'bg-gradient-to-br from-[#0C1929] via-[#131722] to-[#11131B] border-sky-400/35 hover:border-sky-300 hover:shadow-[0_10px_24px_rgba(56,189,248,0.22)]',
                        iconCls: 'bg-sky-500/20 border-sky-400/50 text-sky-300',
                      },
                      {
                        label: 'Fazer Chamada',
                        sub: 'Sábados e atestados',
                        icon: CalendarCheck,
                        tab: 'presenca',
                        badge: pendingJustifications.length,
                        cardCls:
                          'bg-gradient-to-br from-[#0B1E17] via-[#131722] to-[#11131B] border-emerald-400/35 hover:border-emerald-300 hover:shadow-[0_10px_24px_rgba(16,185,129,0.22)]',
                        iconCls: 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300',
                      },
                      {
                        label: 'Enviar Comunicado',
                        sub: 'Geral ou individual',
                        icon: Megaphone,
                        tab: 'comunicados',
                        badge: 0,
                        cardCls:
                          'bg-gradient-to-br from-[#1C1028] via-[#151622] to-[#11131B] border-purple-400/35 hover:border-purple-300 hover:shadow-[0_10px_24px_rgba(168,85,247,0.22)]',
                        iconCls: 'bg-purple-500/20 border-purple-400/50 text-purple-300',
                      },
                      {
                        label: 'Gerenciar Alunos',
                        sub: `${students.length} matriculados`,
                        icon: Users,
                        tab: 'alunos',
                        badge: 0,
                        cardCls:
                          'bg-gradient-to-br from-[#1E0C12] via-[#161722] to-[#11131B] border-[#ED101C]/35 hover:border-[#FF5A65] hover:shadow-[0_10px_24px_rgba(237,16,28,0.24)]',
                        iconCls: 'bg-[#ED101C]/20 border-[#ED101C]/50 text-[#FF5A65]',
                      },
                    ].map((act) => {
                      const ActIcon = act.icon;
                      return (
                        <button
                          key={act.label}
                          type="button"
                          onClick={() => {
                            setActiveTab(act.tab);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`relative p-4 rounded-2xl border flex flex-col items-center justify-center text-center gap-2 transition-all duration-200 hover:-translate-y-0.5 group ${act.cardCls}`}
                        >
                          {act.badge > 0 && (
                            <span className="absolute top-2.5 right-2.5 min-w-[20px] h-5 px-1.5 rounded-full bg-[#ED101C] text-white text-[10px] font-mono font-extrabold flex items-center justify-center shadow-red-glow-sm">
                              {act.badge}
                            </span>
                          )}
                          <span className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${act.iconCls}`}>
                            <ActIcon className="w-5 h-5" />
                          </span>
                          <div>
                            <span className="text-xs sm:text-[13px] font-extrabold text-white block leading-tight">
                              {act.label}
                            </span>
                            <span className="text-[10.5px] text-white/60 block mt-0.5 leading-tight">
                              {act.sub}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              ABA 2: ALUNOS E MATRÍCULAS (IDENTIDADE BLACK + GRADE COMPACTA 2 COLUNAS)
          ================================================================= */}
          {activeTab === 'alunos' && (
            <div className="space-y-5">
              {/* 4 KPIs Executivos na Identidade BLACK (Sobriedade Dark + Vermelho Emergência) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: 'Total Matriculados',
                    value: students.length,
                    sub: 'Turma 13/02/2027 • Unicesumar',
                    pct: 100,
                    icon: Users,
                    filterTarget: 'todos',
                    cardCls:
                      'bg-gradient-to-br from-[#19090D] via-[#0F1118] to-[#0A0B10] border-t-2 border-t-[#ED101C] border-white/10 hover:border-[#ED101C]/65',
                    iconCls: 'bg-[#ED101C]/15 border-[#ED101C]/45 text-[#FF5A65]',
                    valueCls: 'text-white',
                    barCls: 'bg-[#ED101C]',
                  },
                  {
                    label: 'Financeiro em Dia',
                    value: studentsEmDiaCount,
                    sub: `${Math.round((studentsEmDiaCount / Math.max(1, students.length)) * 100)}% da turma regular`,
                    pct: Math.round((studentsEmDiaCount / Math.max(1, students.length)) * 100),
                    icon: CheckCircle2,
                    filterTarget: 'Em dia',
                    cardCls:
                      'bg-gradient-to-br from-[#13151D] via-[#0F1118] to-[#0A0B10] border-t-2 border-t-emerald-400/80 border-white/10 hover:border-emerald-400/50',
                    iconCls: 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300',
                    valueCls: 'text-emerald-400',
                    barCls: 'bg-emerald-400',
                  },
                  {
                    label: 'Com Pendência',
                    value: studentsPendentesCount,
                    sub: studentsPendentesCount > 0 ? 'Clique para filtrar parcelas' : 'Nenhuma pendência ✓',
                    pct: Math.round((studentsPendentesCount / Math.max(1, students.length)) * 100),
                    icon: AlertCircle,
                    filterTarget: 'Pendente',
                    cardCls:
                      'bg-gradient-to-br from-[#190A0D] via-[#0F1118] to-[#0A0B10] border-t-2 border-t-[#ED101C]/80 border-white/10 hover:border-[#ED101C]/60',
                    iconCls: 'bg-[#ED101C]/15 border-[#ED101C]/45 text-[#FF6B74]',
                    valueCls: studentsPendentesCount > 0 ? 'text-[#FF6B74]' : 'text-white',
                    barCls: 'bg-[#ED101C]',
                  },
                  {
                    label: 'Aptos ao Diploma 200h',
                    value: studentsAptosCount,
                    sub: `Frequência média da turma: ${avgFrequency}%`,
                    pct: Math.round((studentsAptosCount / Math.max(1, students.length)) * 100),
                    icon: Award,
                    filterTarget: 'aptos',
                    cardCls:
                      'bg-gradient-to-br from-[#161318] via-[#0F1118] to-[#0A0B10] border-t-2 border-t-amber-400/80 border-white/10 hover:border-amber-400/55',
                    iconCls: 'bg-amber-500/15 border-amber-400/40 text-amber-300',
                    valueCls: 'text-white',
                    barCls: 'bg-amber-400',
                  },
                ].map((stat) => {
                  const StatIcon = stat.icon;
                  return (
                    <button
                      key={stat.label}
                      type="button"
                      onClick={() => setStudentStatusFilter(stat.filterTarget)}
                      className={`text-left rounded-2xl p-4 sm:p-5 border shadow-[0_12px_30px_rgba(0,0,0,0.45)] transition-all duration-200 hover:-translate-y-0.5 space-y-2.5 ${stat.cardCls}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-semibold text-white/65 block">
                            {stat.label}
                          </span>
                          <strong className={`font-display font-extrabold text-2xl sm:text-3xl mt-1 block tabular-nums ${stat.valueCls}`}>
                            {stat.value}
                          </strong>
                        </div>
                        <span className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${stat.iconCls}`}>
                          <StatIcon className="w-5 h-5" />
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="w-full h-1 rounded-full bg-white/[0.07] overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${stat.barCls}`}
                            style={{ width: `${Math.max(8, stat.pct)}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-white/50 block">{stat.sub}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Barra de Comando: Busca + Filtros + Exportar + Nova Matrícula */}
              <div className="admin-glass-card rounded-2xl p-3.5 sm:p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
                <div className="flex flex-col md:flex-row md:items-center gap-2.5 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-[#ED101C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar por nome, CPF ou e-mail..."
                      className="w-full bg-[#090B10] border border-white/15 focus:border-[#ED101C] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-white/40 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:inline-flex items-center gap-1 bg-[#090B10] border border-white/10 p-1 rounded-xl">
                    {[
                      { id: 'todos', label: `Todos (${students.length})` },
                      { id: 'Em dia', label: `Em dia (${studentsEmDiaCount})` },
                      { id: 'Pendente', label: `Pendentes (${studentsPendentesCount})` },
                      { id: 'aptos', label: `Aptos 200h (${studentsAptosCount})` },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setStudentStatusFilter(f.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-center whitespace-nowrap ${
                          studentStatusFilter === f.id
                            ? 'bg-[#ED101C] text-white shadow-red-glow-sm'
                            : 'text-white/65 hover:text-white'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleExportStudentsCsv}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-xs font-bold text-white/85 hover:text-white inline-flex items-center gap-1.5 transition-colors"
                    title="Baixar lista da turma filtrada em CSV / Excel"
                  >
                    <Download className="w-3.5 h-3.5 text-[#FF5A65]" />
                    <span>Exportar CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewStudentForm((v) => !v)}
                    className="cta-btn-shimmer px-4 py-2 rounded-xl bg-gradient-to-r from-[#ED101C] to-[#C80B15] text-white text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-1.5 shadow-[0_6px_22px_rgba(237,16,28,0.38)] hover:-translate-y-0.5 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{showNewStudentForm ? 'Fechar Cadastro' : 'Matricular Novo Aluno'}</span>
                  </button>
                </div>
              </div>

              {showNewStudentForm && (
                <form
                  onSubmit={handleAddStudent}
                  className="admin-tab-enter p-6 rounded-3xl bg-gradient-to-br from-[#200B10] via-[#131520] to-[#11131B] border border-[#ED101C]/60 shadow-[0_14px_40px_rgba(237,16,28,0.18)] space-y-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono font-bold uppercase text-[#FF6B74] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Cadastro Oficial — Curso de Socorrista APH (200h)</span>
                      </span>
                      <h3 className="font-display font-extrabold text-lg text-white mt-0.5">
                        Matricular Novo Aluno na Turma 13/02/2027
                      </h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-white/70 mb-1">
                        Nome Completo (vai no Diploma) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: JOÃO DA SILVA"
                        value={newStudent.nome}
                        onChange={(e) => setNewStudent({ ...newStudent, nome: e.target.value })}
                        className="w-full bg-[#090B10] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#ED101C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-white/70 mb-1">
                        CPF Oficial *
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={14}
                        required
                        placeholder="000.000.000-00"
                        value={newStudent.cpf}
                        onChange={(e) =>
                          setNewStudent({ ...newStudent, cpf: formatCpfInput(e.target.value) })
                        }
                        className="w-full bg-[#090B10] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-[#ED101C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-white/70 mb-1">
                        E-mail de Acesso
                      </label>
                      <input
                        type="email"
                        placeholder="aluno@email.com"
                        value={newStudent.email}
                        onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                        className="w-full bg-[#090B10] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#ED101C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-white/70 mb-1">
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={15}
                        placeholder="(45) 99999-0000"
                        value={newStudent.telefone}
                        onChange={(e) =>
                          setNewStudent({ ...newStudent, telefone: formatPhoneInput(e.target.value) })
                        }
                        className="w-full bg-[#090B10] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-[#ED101C] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowNewStudentForm(false)}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-xs font-extrabold text-white shadow-red-glow-sm inline-flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Salvar Matrícula</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Lista Vertical BLACK (Um embaixo do outro, colunas alinhadas e compactas) */}
              {filteredStudents.length === 0 ? (
                <div className="admin-glass-card rounded-3xl p-10 text-center space-y-3">
                  <Users className="w-10 h-10 text-white/30 mx-auto" />
                  <strong className="text-base text-white block">
                    Nenhum aluno encontrado com esse filtro
                  </strong>
                  <p className="text-xs text-white/55">
                    Limpe a busca ou clique em "Todos" para visualizar toda a turma APH 200h.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setStudentStatusFilter('todos');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#ED101C] text-xs font-bold text-white"
                  >
                    Mostrar Todos ({students.length})
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl bg-[#0B0C11] border border-white/12 overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.55)]">
                  {/* Cabeçalho discreto de colunas no Desktop */}
                  <div className="hidden lg:grid lg:grid-cols-12 items-center gap-3 px-4 py-2.5 bg-[#12131B] border-b border-white/10 text-[10.5px] font-mono font-bold uppercase tracking-wider text-white/50">
                    <div className="col-span-4">Aluno &amp; Matrícula</div>
                    <div className="col-span-2">Progresso 200h</div>
                    <div className="col-span-1 text-center">Freq.</div>
                    <div className="col-span-2">Financeiro 10x</div>
                    <div className="col-span-3 text-right">Ações</div>
                  </div>

                  <div className="divide-y divide-white/[0.06]">
                    {filteredStudents.map((s) => {
                      const initials = (s.nome || 'AL')
                        .trim()
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join('')
                        .toUpperCase();
                      const isApto = (s.progressoPct || 0) >= 100 && (s.frequenciaPct || 0) >= 75;
                      const isPending = s.statusFinanceiro !== 'Em dia';
                      const modulosConcluidosEst = Math.round(((s.progressoPct || 0) / 100) * 11);

                      const openDossier = () => {
                        setDossierStudent(s);
                        setDossierPwdDraft('');
                        setConfirmRemoveStudentId(null);
                      };
                      const openFinance = () => {
                        setSelectedFinanceStudentId(s.id);
                        setFinanceSubTab('boletos');
                        setActiveTab('financeiro');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      };
                      const openDiploma = () => {
                        setCertEditor((prev) => ({
                          ...prev,
                          studentName: s.nome,
                          studentCpf: s.cpf,
                        }));
                        setActiveTab('certificados');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      };

                      return (
                        <div
                          key={s.id}
                          className={`group border-l-4 transition-colors ${
                            isPending
                              ? 'border-l-[#ED101C] bg-[#180A0D]/70 hover:bg-[#220C11]/80'
                              : 'border-l-[#ED101C]/75 hover:border-l-[#ED101C] hover:bg-white/[0.03]'
                          }`}
                        >
                          {/* LAYOUT MOBILE DISCRETO E COMPACTO (< LG) — MESMA IDEIA HORIZONTAL DO DESKTOP */}
                          <div className="lg:hidden px-3 py-2.5 space-y-2">
                            {/* Linha 1: Avatar + Nome/CPF + Pílula Financeira */}
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <button
                                  type="button"
                                  onClick={openDossier}
                                  className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ED101C] to-[#7D060D] border border-[#FF7A83]/50 text-white text-[11px] font-display font-extrabold flex items-center justify-center shrink-0"
                                >
                                  {initials}
                                </button>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <button
                                      type="button"
                                      onClick={openDossier}
                                      className="font-display font-extrabold text-[13px] text-white truncate text-left"
                                    >
                                      {s.nome}
                                    </button>
                                    {isApto && (
                                      <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/45 text-emerald-300 text-[9px] font-bold shrink-0">
                                        ★ 200h
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] font-mono text-white/55 block truncate">
                                    {s.cpf} • {s.telefone}
                                  </span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={openFinance}
                                className={`px-2 py-1 rounded-lg border text-[10.5px] font-mono font-bold inline-flex items-center gap-1 shrink-0 ${
                                  isPending
                                    ? 'bg-[#ED101C]/20 border-[#ED101C]/60 text-[#FF8C93]'
                                    : 'bg-emerald-500/12 border-emerald-500/35 text-emerald-300'
                                }`}
                              >
                                <span>
                                  {s.parcelasPagas}/{s.parcelasTotal} •{' '}
                                  {isPending ? 'Pend.' : 'Em dia'}
                                </span>
                              </button>
                            </div>

                            {/* Linha 2: Progresso + Frequência + Ações discretas */}
                            <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-white/[0.06]">
                              <div className="flex items-center gap-2 text-[10.5px] min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono font-bold text-white">
                                    {s.progressoPct}%
                                  </span>
                                  <div className="w-10 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${
                                        s.progressoPct >= 100 ? 'bg-emerald-400' : 'bg-[#ED101C]'
                                      }`}
                                      style={{ width: `${Math.min(100, s.progressoPct || 0)}%` }}
                                    />
                                  </div>
                                </div>
                                <span className="text-white/30">•</span>
                                <span
                                  className={`font-mono font-bold ${
                                    s.frequenciaPct >= 75 ? 'text-emerald-300' : 'text-amber-300'
                                  }`}
                                >
                                  Freq. {s.frequenciaPct}%
                                </span>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={openDossier}
                                  className="px-2 py-1 rounded-md bg-white/[0.06] border border-white/12 text-white text-[10.5px] font-bold inline-flex items-center gap-1"
                                  title="Abrir Prontuário"
                                >
                                  <User className="w-3 h-3 text-[#FF5A65]" />
                                  <span>Ficha</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingStudent({ ...s })}
                                  className="p-1.5 rounded-md bg-white/[0.05] border border-white/10 text-white/80"
                                  title="Editar"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={openDiploma}
                                  className="p-1.5 rounded-md bg-amber-500/15 border border-amber-500/35 text-amber-300"
                                  title="Diploma"
                                >
                                  <Award className="w-3 h-3" />
                                </button>
                                <a
                                  href={getStudentWhatsAppUrl(
                                    s.telefone,
                                    `Olá ${s.nome}! Aqui é a Coordenação da BLACK Treinamentos (Curso APH 200h).`
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-md bg-emerald-500/15 border border-emerald-500/35 text-emerald-300"
                                  title={`Chamar ${s.nome} no WhatsApp (${s.telefone})`}
                                >
                                  <Phone className="w-3 h-3" />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => setDeleteTargetStudent(s)}
                                  className="p-1.5 rounded-md bg-white/[0.04] border border-white/10 text-white/60 hover:text-[#FF5A65]"
                                  title="Excluir aluno"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* LAYOUT DESKTOP (>= LG) */}
                          <div className="hidden lg:grid lg:grid-cols-12 items-center gap-3 px-4 py-3.5">
                            {/* Coluna 1: Identificação BLACK */}
                            <div className="col-span-4 flex items-center gap-3 min-w-0">
                              <button
                                type="button"
                                onClick={openDossier}
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ED101C] to-[#7D060D] border border-[#FF7A83]/50 text-white text-xs font-display font-extrabold flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                                title="Abrir Prontuário Completo"
                              >
                                {initials}
                              </button>
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={openDossier}
                                    className="font-display font-extrabold text-sm text-white hover:text-[#FF6B74] text-left truncate transition-colors"
                                  >
                                    {s.nome}
                                  </button>
                                  {isApto ? (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/45 text-emerald-300 text-[9.5px] font-bold whitespace-nowrap">
                                      ★ Apto 200h
                                    </span>
                                  ) : isPending ? (
                                    <span className="px-2 py-0.5 rounded-full bg-[#ED101C]/25 border border-[#ED101C]/60 text-[#FF8C93] text-[9.5px] font-bold whitespace-nowrap">
                                      Pendência
                                    </span>
                                  ) : null}
                                </div>
                                <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-white/55 mt-0.5">
                                  <span className="font-mono text-white/75">{s.cpf}</span>
                                  <span>•</span>
                                  <span>{s.telefone}</span>
                                </div>
                              </div>
                            </div>

                            {/* Coluna 2: Progresso 200h */}
                            <div className="col-span-2">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="font-mono font-bold text-white">{s.progressoPct}%</span>
                                <span className="text-[10px] font-mono text-white/45">
                                  {modulosConcluidosEst}/11 mód.
                                </span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    s.progressoPct >= 100 ? 'bg-emerald-400' : 'bg-[#ED101C]'
                                  }`}
                                  style={{ width: `${Math.min(100, s.progressoPct || 0)}%` }}
                                />
                              </div>
                            </div>

                            {/* Coluna 3: Frequência */}
                            <div className="col-span-1 flex items-center justify-center">
                              <span
                                className={`px-2 py-1 rounded-lg font-mono text-xs font-bold border ${
                                  s.frequenciaPct >= 75
                                    ? 'bg-emerald-500/12 border-emerald-500/35 text-emerald-300'
                                    : 'bg-amber-500/15 border-amber-400/40 text-amber-300'
                                }`}
                              >
                                {s.frequenciaPct}%
                              </span>
                            </div>

                            {/* Coluna 4: Financeiro Clicável */}
                            <div className="col-span-2 flex items-center justify-start">
                              <button
                                type="button"
                                onClick={openFinance}
                                title="Abrir parcelas 10x (PIX, Cartão, Dinheiro)"
                                className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold inline-flex items-center gap-1.5 transition-all hover:scale-[1.03] whitespace-nowrap ${
                                  isPending
                                    ? 'bg-[#ED101C]/20 hover:bg-[#ED101C] border-[#ED101C]/60 text-[#FF8C93] hover:text-white'
                                    : 'bg-emerald-500/12 hover:bg-emerald-600 border-emerald-500/35 text-emerald-300 hover:text-white'
                                }`}
                              >
                                <CreditCard className="w-3.5 h-3.5 shrink-0" />
                                <span>
                                  {s.parcelasPagas}/{s.parcelasTotal} • {s.statusFinanceiro}
                                </span>
                              </button>
                            </div>

                            {/* Coluna 5: Ações (todas em 1 única linha) */}
                            <div className="col-span-3 flex items-center justify-end gap-1.5 flex-nowrap">
                              <button
                                type="button"
                                onClick={openDossier}
                                className="px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-[#ED101C] border border-white/12 hover:border-[#ED101C] text-white text-xs font-bold inline-flex items-center gap-1 transition-all shrink-0"
                                title="Abrir Prontuário Completo e Redefinir Senha"
                              >
                                <User className="w-3.5 h-3.5 text-[#FF5A65] group-hover:text-white" />
                                <span>Prontuário</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingStudent({ ...s })}
                                className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/15 border border-white/10 text-white/80 hover:text-white inline-flex items-center justify-center transition-all shrink-0"
                                title="Editar Nome, CPF ou WhatsApp"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={openDiploma}
                                className="p-1.5 rounded-lg bg-amber-500/15 hover:bg-[#ED101C] border border-amber-500/40 hover:border-[#ED101C] text-amber-300 hover:text-white inline-flex items-center justify-center transition-all shrink-0"
                                title="Emitir ou Autorizar Diploma 200h"
                              >
                                <Award className="w-3.5 h-3.5" />
                              </button>
                              <a
                                href={getStudentWhatsAppUrl(
                                  s.telefone,
                                  `Olá ${s.nome}! Aqui é a Coordenação da BLACK Treinamentos (Curso APH 200h).`
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-600 border border-emerald-500/35 text-emerald-300 hover:text-white inline-flex items-center justify-center transition-all shrink-0"
                                title={`Chamar ${s.nome} no WhatsApp (${s.telefone})`}
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <button
                                type="button"
                                onClick={() => setDeleteTargetStudent(s)}
                                className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-[#ED101C] border border-white/10 hover:border-[#ED101C] text-white/60 hover:text-white inline-flex items-center justify-center transition-all shrink-0"
                                title="Excluir matrícula do aluno"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              ABA 3: ESTÚDIO DE AULAS E PDFs (200H — STICKY + SUB-ABAS + EDITOR REAL)
          ================================================================= */}
          {activeTab === 'conteudo' && (() => {
            const unlockedModulesCount = modules200h.filter((m) => m.liberadoProfessor).length;
            const totalLessonsCount = modules200h.reduce((acc, m) => acc + m.aulas.length, 0);
            const activeModCommentsCount = activeMod.aulas.reduce(
              (acc, a) => acc + (lessonComments[a.id]?.length || 0),
              0
            );
            const activeModUnreadCount = unreadStudentChats.filter(
              (n) => n.moduloNumero === activeMod.modulo
            ).length;

            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Coluna Esquerda STICKY dos 11 Módulos (sem espaço vazio ao rolar!) */}
                <div className="lg:col-span-4 lg:sticky lg:top-6 admin-glass-card rounded-3xl border-t-2 border-t-[#ED101C] p-4 sm:p-5 space-y-3">
                  <div className="space-y-2 pb-3 border-b border-white/10">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#FF5A65] block">
                          Grade Oficial APH
                        </span>
                        <strong className="font-display font-extrabold text-sm sm:text-base text-white">
                          11 Módulos • 200 Horas
                        </strong>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-mono font-bold text-white/80">
                        {totalLessonsCount} {totalLessonsCount === 1 ? 'aula' : 'aulas'}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] text-white/60 mb-1">
                        <span>Módulos liberados</span>
                        <strong className="font-mono text-emerald-300">
                          {unlockedModulesCount}/11 liberados
                        </strong>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#ED101C] to-emerald-400 transition-all duration-500"
                          style={{ width: `${Math.round((unlockedModulesCount / 11) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 max-h-[62vh] overflow-y-auto pr-1">
                    {modules200h.map((m, idx) => {
                      const active = idx === selectedModIdx;
                      const modHasUnread = unreadStudentChats.some((n) => n.moduloNumero === m.modulo);
                      const lessonCountLabel =
                        m.aulas.length === 1 ? '1 aula' : `${m.aulas.length} aulas`;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setSelectedModIdx(idx);
                            setEditingLesson(null);
                          }}
                          className={`w-full p-3 rounded-2xl text-left flex items-center justify-between gap-3 transition-all duration-200 border ${
                            active
                              ? 'bg-gradient-to-r from-[#ED101C] to-[#B80913] border-[#FF6B74]/60 text-white shadow-[0_8px_24px_rgba(237,16,28,0.35)]'
                              : 'bg-[#141722]/90 hover:bg-[#1B1F2E] border-white/[0.07] hover:border-white/20 text-white/85'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`w-8 h-8 rounded-xl font-mono text-xs font-extrabold flex items-center justify-center shrink-0 ${
                                active
                                  ? 'bg-white/20 text-white'
                                  : 'bg-white/[0.06] text-[#FF6B74]'
                              }`}
                            >
                              {m.modulo}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <strong className="text-xs sm:text-sm block truncate">
                                  {m.titulo}
                                </strong>
                                {modHasUnread && (
                                  <span
                                    className="w-2 h-2 rounded-full bg-sky-400 animate-pulse shrink-0"
                                    title="Nova dúvida de aluno"
                                  />
                                )}
                              </div>
                              <span
                                className={`text-[11px] flex items-center gap-1.5 mt-0.5 ${
                                  active ? 'text-white/90' : 'text-white/55'
                                }`}
                              >
                                {m.liberadoProfessor ? (
                                  <span
                                    className={`inline-flex items-center gap-1 font-bold ${
                                      active ? 'text-emerald-200' : 'text-emerald-400'
                                    }`}
                                  >
                                    <Unlock className="w-3 h-3" />
                                    <span>Liberado</span>
                                  </span>
                                ) : (
                                  <span
                                    className={`inline-flex items-center gap-1 font-semibold ${
                                      active ? 'text-amber-200' : 'text-amber-300/90'
                                    }`}
                                  >
                                    <Lock className="w-3 h-3" />
                                    <span>Bloqueado</span>
                                  </span>
                                )}
                                <span>• {lessonCountLabel}</span>
                                <span>• {m.cargaHoraria}</span>
                              </span>
                            </div>
                          </div>
                          <ChevronRight
                            className={`w-4 h-4 shrink-0 transition-transform ${
                              active ? 'translate-x-0.5' : 'text-white/40'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Estúdio do Módulo Selecionado (Compacto, Sub-Abas Claras & Sem Rolagem Desalinhada) */}
                <div className="lg:col-span-8 space-y-5">
                  {/* Banner Hero do Módulo */}
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#280A0F] via-[#151722] to-[#11131B] border border-[#ED101C]/45 p-5 sm:p-6 shadow-xl space-y-4">
                    <div className="pointer-events-none absolute -right-12 -top-12 w-52 h-52 rounded-full bg-[#ED101C]/15 blur-3xl" />
                    <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#ED101C]/20 border border-[#ED101C]/50 text-[#FF6B74] text-[11px] font-mono font-bold">
                            MÓDULO {activeMod.modulo} • {activeMod.cargaHoraria}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Sincronizado ao vivo</span>
                          </span>
                        </div>
                        <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                          {activeMod.titulo}
                        </h2>
                        {activeMod.resumo && (
                          <p className="text-xs text-white/65 leading-relaxed max-w-2xl">
                            {activeMod.resumo}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleModuleRelease(activeMod.modulo)}
                          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 border transition-all ${
                            activeMod.liberadoProfessor
                              ? 'bg-emerald-500/15 hover:bg-amber-500/20 border-emerald-500/55 hover:border-amber-400 text-emerald-300 hover:text-amber-200'
                              : 'bg-[#ED101C] hover:bg-[#C80B15] border-[#FF6B74]/60 text-white shadow-red-glow-sm'
                          }`}
                        >
                          {activeMod.liberadoProfessor ? (
                            <>
                              <Unlock className="w-4 h-4 shrink-0" />
                              <span>Liberado • Bloquear</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 shrink-0" />
                              <span>Liberar Módulo {activeMod.modulo}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Navegação por Sub-Abas do Estúdio */}
                    <div className="relative grid grid-cols-3 gap-1.5 bg-[#090B10]/90 border border-white/10 p-1.5 rounded-2xl">
                      {[
                        {
                          id: 'aulas',
                          label: 'Aulas e Vídeos',
                          short: 'Aulas',
                          icon: PlayCircle,
                          count: activeMod.aulas.length,
                          alert: false,
                        },
                        {
                          id: 'materiais',
                          label: 'Apostilas e PDFs',
                          short: 'Apostilas',
                          icon: FileText,
                          count: activeMod.materiais.length,
                          alert: false,
                        },
                        {
                          id: 'duvidas',
                          label: 'Dúvidas e Chat',
                          short: 'Dúvidas',
                          icon: MessageSquare,
                          count: activeModUnreadCount > 0 ? activeModUnreadCount : activeModCommentsCount,
                          alert: activeModUnreadCount > 0,
                        },
                      ].map((tab) => {
                        const TabIcon = tab.icon;
                        const active = studioSubTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setStudioSubTab(tab.id)}
                            className={`py-2.5 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
                              active
                                ? 'bg-gradient-to-r from-[#ED101C] to-[#C80B15] text-white shadow-[0_6px_18px_rgba(237,16,28,0.38)]'
                                : 'text-white/70 hover:text-white hover:bg-white/[0.04]'
                            }`}
                          >
                            <TabIcon className="w-4 h-4 shrink-0" />
                            <span className="sm:hidden truncate">{tab.short}</span>
                            <span className="hidden sm:inline truncate">{tab.label}</span>
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold ${
                                tab.alert
                                  ? 'bg-sky-400 text-black'
                                  : active
                                    ? 'bg-white/20 text-white'
                                    : 'bg-white/10 text-white/75'
                              }`}
                            >
                              {tab.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* SUB-ABA 1: AULAS & CONEXÃO DE VÍDEOS */}
                  {studioSubTab === 'aulas' && (
                    <div className="admin-glass-card rounded-3xl p-5 sm:p-6 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-display font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                            <PlayCircle className="w-5 h-5 text-[#ED101C]" />
                            <span>
                              Aulas do Módulo {activeMod.modulo} ({activeMod.aulas.length})
                            </span>
                          </h3>
                          <p className="text-xs text-white/55 mt-0.5">
                            Clique em <strong className="text-white/80">Editar / Vídeo</strong> em qualquer aula para colar o link do YouTube, Vimeo ou MP4.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowNewLessonForm((v) => !v)}
                          className="cta-btn-shimmer px-4 py-2 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-red-glow-sm transition-all"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{showNewLessonForm ? 'Fechar Cadastro' : 'Cadastrar Nova Aula'}</span>
                        </button>
                      </div>

                      {showNewLessonForm && (
                        <form
                          onSubmit={(e) => {
                            handleAddLesson(e);
                            setShowNewLessonForm(false);
                          }}
                          className="admin-tab-enter p-5 rounded-2xl bg-[#0B0D14] border border-[#ED101C]/45 space-y-4 shadow-[0_14px_35px_rgba(237,16,28,0.12)]"
                        >
                          <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-lg bg-[#ED101C]/20 border border-[#ED101C]/45 flex items-center justify-center">
                                <Video className="w-3.5 h-3.5 text-[#FF5A65]" />
                              </span>
                              <strong className="text-sm text-white">Nova Aula — Módulo {activeMod.modulo}</strong>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
                            <div className="sm:col-span-6">
                              <label className="block text-[11px] font-bold text-white/75 mb-1.5">
                                1. Título da Aula *
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="Ex: Aplicação de Torniquete Tático na Prática"
                                value={newLesson.titulo}
                                onChange={(e) => setNewLesson({ ...newLesson, titulo: e.target.value })}
                                className="w-full bg-[#141722] border border-white/15 focus:border-[#ED101C] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                            <div className="sm:col-span-3">
                              <label className="block text-[11px] font-bold text-white/75 mb-1.5">
                                2. Formato
                              </label>
                              <select
                                value={newLesson.tipo}
                                onChange={(e) => setNewLesson({ ...newLesson, tipo: e.target.value })}
                                className="w-full bg-[#141722] border border-white/15 focus:border-[#ED101C] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                              >
                                <option value="VIDEO">Videoaula</option>
                                <option value="SLIDES">Slides / Apresentação</option>
                                <option value="IMAGEM">Imagem / Protocolo Visual</option>
                                <option value="PRATICA">Aula Prática</option>
                                <option value="LEITURA">Leitura / Protocolo</option>
                              </select>
                            </div>
                            <div className="sm:col-span-3">
                              <label className="block text-[11px] font-bold text-white/75 mb-1.5">
                                3. Duração (min)
                              </label>
                              <input
                                type="number"
                                min="5"
                                placeholder="45"
                                value={newLesson.duracaoMin}
                                onChange={(e) => setNewLesson({ ...newLesson, duracaoMin: e.target.value })}
                                className="w-full bg-[#141722] border border-white/15 focus:border-[#ED101C] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none"
                              />
                            </div>
                            <div className="sm:col-span-12">
                              <label className="block text-[11px] font-bold text-white/75 mb-1.5">
                                4. Link do Vídeo, Slide ou Imagem (YouTube / Vimeo / MP4 / URL da Imagem — opcional)
                              </label>
                              <input
                                type="url"
                                placeholder="https://www.youtube.com/embed/..."
                                value={newLesson.videoUrl}
                                onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                                className="w-full bg-[#141722] border border-white/15 focus:border-[#ED101C] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setShowNewLessonForm(false)}
                              className="px-4 py-2 rounded-xl bg-white/10 text-xs font-bold text-white"
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-red-glow-sm"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Salvar Nova Aula</span>
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="space-y-3">
                        {activeMod.aulas.map((aula, aIdx) => {
                          const badgeCls =
                            aula.tipo === 'PRATICA'
                              ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                              : aula.tipo === 'SLIDES' || aula.tipo === 'IMAGEM'
                                ? 'bg-sky-500/15 border-sky-500/35 text-sky-300'
                                : aula.tipo === 'LEITURA'
                                  ? 'bg-amber-500/15 border-amber-500/35 text-amber-300'
                                  : 'bg-[#ED101C]/15 border-[#ED101C]/40 text-[#FF6B74]';
                          const isEditingThis = editingLesson?.id === aula.id;

                          return (
                            <div
                              key={aula.id}
                              className={`rounded-2xl border transition-all ${
                                isEditingThis
                                  ? 'bg-[#17121A] border-[#ED101C]/65 shadow-[0_12px_30px_rgba(237,16,28,0.16)]'
                                  : 'bg-[#141722] hover:bg-[#191D2B] border-white/10 hover:border-white/20'
                              }`}
                            >
                              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-start gap-3.5 min-w-0">
                                  <span className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 font-mono text-xs font-extrabold text-white flex items-center justify-center shrink-0">
                                    {String(aula.ordem).padStart(2, '0')}
                                  </span>
                                  <div className="min-w-0">
                                    <strong className="text-sm sm:text-base text-white block leading-snug">
                                      {aula.titulo}
                                    </strong>
                                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                      <span className={`px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold ${badgeCls}`}>
                                        {aula.tipo}
                                      </span>
                                      <span className="text-xs text-white/60 inline-flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {aula.duracaoMin} min
                                      </span>
                                      <span
                                        className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${
                                          aula.videoUrl
                                            ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                                            : 'bg-amber-500/10 border-amber-400/30 text-amber-200/85'
                                        }`}
                                      >
                                        {aula.videoUrl ? 'Vídeo conectado ✓' : 'Aguardando vídeo'}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-end gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    disabled={aIdx === 0}
                                    onClick={() => handleMoveLessonOrder(aula.id, -1)}
                                    className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/15 disabled:opacity-30 border border-white/10 text-white/75"
                                    title="Subir ordem"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={aIdx === activeMod.aulas.length - 1}
                                    onClick={() => handleMoveLessonOrder(aula.id, 1)}
                                    className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/15 disabled:opacity-30 border border-white/10 text-white/75"
                                    title="Descer ordem"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setEditingLesson(isEditingThis ? null : { ...aula })
                                    }
                                    className={`px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border transition-all ${
                                      isEditingThis
                                        ? 'bg-[#ED101C] border-[#ED101C] text-white'
                                        : 'bg-white/[0.08] hover:bg-[#ED101C] border-white/15 hover:border-[#ED101C] text-white'
                                    }`}
                                    title="Editar título, duração ou conectar link do vídeo"
                                  >
                                    <Video className="w-3.5 h-3.5" />
                                    <span>{isEditingThis ? 'Fechar Edição' : 'Editar / Vídeo'}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveLesson(aula.id)}
                                    className="p-2 rounded-xl bg-white/5 hover:bg-[#ED101C]/25 border border-white/10 hover:border-[#ED101C]/45 text-white/65 hover:text-[#FF6B74] transition-all"
                                    title="Remover aula"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {isEditingThis && (
                                <form
                                  onSubmit={handleSaveLessonEdit}
                                  className="px-4 pb-4 pt-3 border-t border-white/10 space-y-3"
                                >
                                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                    <div className="sm:col-span-6">
                                      <label className="block text-[11px] font-bold text-white/70 mb-1">
                                        Título da Aula
                                      </label>
                                      <input
                                        type="text"
                                        required
                                        value={editingLesson.titulo}
                                        onChange={(e) =>
                                          setEditingLesson((prev) => ({
                                            ...prev,
                                            titulo: e.target.value,
                                          }))
                                        }
                                        className="w-full bg-[#090B10] border border-white/15 focus:border-[#ED101C] rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none"
                                      />
                                    </div>
                                    <div className="sm:col-span-3">
                                      <label className="block text-[11px] font-bold text-white/70 mb-1">
                                        Formato
                                      </label>
                                      <select
                                        value={editingLesson.tipo}
                                        onChange={(e) =>
                                          setEditingLesson((prev) => ({
                                            ...prev,
                                            tipo: e.target.value,
                                          }))
                                        }
                                        className="w-full bg-[#090B10] border border-white/15 focus:border-[#ED101C] rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none"
                                      >
                                        <option value="VIDEO">Videoaula</option>
                                        <option value="SLIDES">Slides / Apresentação</option>
                                        <option value="IMAGEM">Imagem / Protocolo Visual</option>
                                        <option value="PRATICA">Aula Prática</option>
                                        <option value="LEITURA">Leitura / Protocolo</option>
                                      </select>
                                    </div>
                                    <div className="sm:col-span-3">
                                      <label className="block text-[11px] font-bold text-white/70 mb-1">
                                        Duração (min)
                                      </label>
                                      <input
                                        type="number"
                                        min="5"
                                        value={editingLesson.duracaoMin}
                                        onChange={(e) =>
                                          setEditingLesson((prev) => ({
                                            ...prev,
                                            duracaoMin: e.target.value,
                                          }))
                                        }
                                        className="w-full bg-[#090B10] border border-white/15 focus:border-[#ED101C] rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none"
                                      />
                                    </div>
                                    <div className="sm:col-span-12">
                                      <label className="block text-[11px] font-bold text-white/70 mb-1">
                                        URL do Vídeo / YouTube / Vimeo / MP4 ou Imagem
                                      </label>
                                      <input
                                        type="url"
                                        placeholder="https://www.youtube.com/embed/... ou https://..."
                                        value={editingLesson.videoUrl || ''}
                                        onChange={(e) =>
                                          setEditingLesson((prev) => ({
                                            ...prev,
                                            videoUrl: e.target.value,
                                          }))
                                        }
                                        className="w-full bg-[#090B10] border border-white/15 focus:border-[#ED101C] rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setEditingLesson(null)}
                                      className="px-3.5 py-2 rounded-xl bg-white/10 text-xs font-bold text-white"
                                    >
                                      Cancelar
                                    </button>
                                    <button
                                      type="submit"
                                      className="px-4 py-2 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-red-glow-sm"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Salvar Alterações da Aula</span>
                                    </button>
                                  </div>
                                </form>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SUB-ABA 2: APOSTILAS E PROTOCOLOS PDF */}
                  {studioSubTab === 'materiais' && (
                    <div className="admin-glass-card rounded-3xl p-5 sm:p-6 space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-display font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                            <FileText className="w-5 h-5 text-amber-400" />
                            <span>
                              Apostilas e Protocolos PDF — Módulo {activeMod.modulo} ({activeMod.materiais.length})
                            </span>
                          </h3>
                          <p className="text-xs text-white/55 mt-0.5">
                            Suba o arquivo PDF do seu computador ou cole o link direto da apostila.
                          </p>
                        </div>

                        <label className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer transition-all shadow-[0_6px_18px_rgba(245,158,11,0.16)]">
                          <Upload className="w-4 h-4" />
                          <span>Subir PDF / Imagem do Computador</span>
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleUploadMaterialFile(f);
                              e.target.value = '';
                            }}
                          />
                        </label>
                      </div>

                      {activeMod.materiais.length === 0 ? (
                        <div className="p-8 rounded-2xl bg-[#0C0E15] border border-dashed border-white/15 text-center space-y-2">
                          <FileText className="w-8 h-8 text-amber-400/60 mx-auto" />
                          <strong className="text-sm text-white block">
                            Nenhuma apostila cadastrada neste módulo ainda
                          </strong>
                          <span className="text-xs text-white/55 block">
                            Use o botão acima para subir um PDF ou cole o link abaixo.
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {activeMod.materiais.map((mat) => (
                            <div
                              key={mat.id}
                              className="p-4 rounded-2xl bg-[#151824] border border-white/10 flex flex-wrap items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/35 text-amber-300 flex items-center justify-center shrink-0">
                                  <FileText className="w-4 h-4" />
                                </span>
                                <div className="min-w-0">
                                  <strong className="text-sm text-white block truncate">
                                    {mat.titulo}
                                  </strong>
                                  <span className="text-xs text-white/60">
                                    {mat.tipo} {mat.tamanho ? `• ${mat.tamanho}` : ''} •{' '}
                                    {mat.arquivoFileId
                                      ? 'Arquivo enviado ✓'
                                      : mat.arquivoUrl
                                        ? 'Link PDF ativo ✓'
                                        : 'Modelo pronto para anexar PDF'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {mat.arquivoFileId && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleOpenAttachment({
                                        fileId: mat.arquivoFileId,
                                        name: mat.arquivoNome || mat.titulo,
                                        type: mat.arquivoTipo,
                                      })
                                    }
                                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
                                  >
                                    Abrir
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMaterial(mat.id)}
                                  className="p-2 rounded-xl bg-white/5 hover:bg-[#ED101C]/25 text-white/65 hover:text-[#FF6B74] transition-colors"
                                  title="Remover material"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <form
                        onSubmit={handleAddMaterial}
                        className="p-4 rounded-2xl bg-[#0B0D14] border border-white/15 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
                      >
                        <div className="sm:col-span-5">
                          <label className="block text-[11px] font-bold text-white/70 mb-1">
                            Nome da Apostila / Protocolo
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: Protocolo PHTLS — Controle de Hemorragias"
                            value={newMaterial.titulo}
                            onChange={(e) => setNewMaterial({ ...newMaterial, titulo: e.target.value })}
                            className="w-full bg-[#141722] border border-white/15 focus:border-[#ED101C] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                          />
                        </div>
                        <div className="sm:col-span-5">
                          <label className="block text-[11px] font-bold text-white/70 mb-1">
                            Link do PDF (Google Drive / Storage)
                          </label>
                          <input
                            type="url"
                            placeholder="https://..."
                            value={newMaterial.arquivoUrl}
                            onChange={(e) => setNewMaterial({ ...newMaterial, arquivoUrl: e.target.value })}
                            className="w-full bg-[#141722] border border-white/15 focus:border-[#ED101C] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                          />
                        </div>
                        <button
                          type="submit"
                          className="sm:col-span-2 py-2.5 px-3 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs font-extrabold shadow-red-glow-sm"
                        >
                          + Salvar Link
                        </button>
                      </form>
                    </div>
                  )}

                  {/* SUB-ABA 3: DÚVIDAS & COMENTÁRIOS DOS ALUNOS (CAIXA GERAL + CHAT DO MÓDULO) */}
                  {studioSubTab === 'duvidas' && (
                    <div className="space-y-5">
                      {/* CAIXA DE ENTRADA UNIFICADA: TODAS AS MENSAGENS DOS ALUNOS EM TODOS OS MÓDULOS */}
                      <div className="admin-glass-card rounded-3xl border-t-2 border-t-[#ED101C] p-5 sm:p-6 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h3 className="font-display font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                              <Bell className="w-5 h-5 text-[#ED101C]" />
                              <span>Caixa de Dúvidas dos Alunos (Todos os Módulos)</span>
                            </h3>
                            <p className="text-xs text-white/55 mt-0.5">
                              Todas as mensagens enviadas pelos alunos aparecem aqui para você ler e responder na hora.
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {unreadStudentChats.length > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const nextIds = Array.from(
                                    new Set([
                                      ...readAdminChatIds,
                                      ...chatNotifications.map((n) => n.id),
                                    ])
                                  );
                                  setReadAdminChatIds(nextIds);
                                  saveReadChatNotifIds('admin-cleve', nextIds);
                                  showToast('Todas as dúvidas marcadas como lidas ✓');
                                }}
                                className="px-3 py-1 rounded-full bg-[#ED101C]/15 hover:bg-[#ED101C] border border-[#ED101C]/45 text-[#FF8C93] hover:text-white text-[11px] font-bold transition-colors"
                              >
                                Marcar lidas ({unreadStudentChats.length})
                              </button>
                            )}
                            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-white/75">
                              {allStudentMessagesFeed.length}{' '}
                              {allStudentMessagesFeed.length === 1 ? 'pergunta' : 'perguntas'}
                            </span>
                          </div>
                        </div>

                        {allStudentMessagesFeed.length === 0 ? (
                          <div className="p-6 rounded-2xl bg-[#0B0D14] border border-dashed border-white/15 text-center space-y-1.5">
                            <MessageSquare className="w-7 h-7 text-white/30 mx-auto" />
                            <strong className="text-sm text-white block">
                              Nenhuma dúvida enviada pelos alunos ainda
                            </strong>
                            <span className="text-xs text-white/50 block">
                              Assim que um aluno comentar em qualquer aula de qualquer módulo, a mensagem aparece aqui com botão para responder.
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                            {allStudentMessagesFeed.map(({ comment, aula, mod, modIndex, isUnread, hasProfReplyAfter }) => (
                              <div
                                key={comment.id}
                                className={`p-4 rounded-2xl border space-y-3 ${
                                  isUnread
                                    ? 'bg-[#1D0B0F] border-[#ED101C]/65'
                                    : 'bg-[#11131C] border-white/10'
                                }`}
                              >
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <strong className="text-sm font-extrabold text-white">
                                        {comment.authorName}
                                      </strong>
                                      {isUnread && (
                                        <span className="px-2 py-0.5 rounded-full bg-[#ED101C] text-white text-[10px] font-bold">
                                          Nova dúvida
                                        </span>
                                      )}
                                      {hasProfReplyAfter ? (
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
                                          Respondida ✓
                                        </span>
                                      ) : (
                                        <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[10px] font-bold">
                                          Aguardando resposta
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[11px] font-mono text-white/55 block mt-0.5">
                                      Módulo {mod.modulo} • Aula {aula.ordem}: {aula.titulo} • {comment.createdAt}
                                    </span>
                                  </div>

                                  {modIndex !== selectedModIdx && (
                                    <button
                                      type="button"
                                      onClick={() => setSelectedModIdx(modIndex)}
                                      className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/15 border border-white/15 text-[11px] font-bold text-white/80 shrink-0"
                                    >
                                      Ir p/ Módulo {mod.modulo} →
                                    </button>
                                  )}
                                </div>

                                <div className="p-3 rounded-xl bg-[#090A0F] border border-white/[0.08] text-xs sm:text-sm text-white/95 leading-relaxed">
                                  {comment.text}
                                </div>

                                <form
                                  onSubmit={(e) =>
                                    handleProfessorReplyComment(aula, e, mod.modulo, {
                                      parentId: comment.id,
                                      authorName: comment.authorName,
                                      authorRole: 'aluno',
                                      snippet: comment.text,
                                    })
                                  }
                                  className="flex items-center gap-2"
                                >
                                  <input
                                    type="text"
                                    value={adminReplyDrafts[aula.id] || ''}
                                    onChange={(e) =>
                                      setAdminReplyDrafts((prev) => ({
                                        ...prev,
                                        [aula.id]: e.target.value,
                                      }))
                                    }
                                    placeholder={`Responder para ${comment.authorName}...`}
                                    className="flex-1 bg-[#090A0F] border border-white/15 focus:border-[#ED101C] rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none"
                                  />
                                  <button
                                    type="submit"
                                    className="px-3.5 py-2 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs font-bold shrink-0"
                                  >
                                    Responder
                                  </button>
                                </form>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="admin-glass-card rounded-3xl p-5 sm:p-6 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-display font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-[#ED101C]" />
                            <span>Chat Completo por Aula — Módulo {activeMod.modulo}</span>
                            {activeModUnreadCount > 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-[#ED101C] text-white text-[10px] font-extrabold animate-pulse">
                                {activeModUnreadCount === 1 ? 'Nova dúvida' : `${activeModUnreadCount} novas`}
                              </span>
                            )}
                          </h3>
                          <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-white/70">
                            {activeModCommentsCount === 1 ? '1 mensagem' : `${activeModCommentsCount} mensagens`}
                          </span>
                        </div>

                      <div className="space-y-3">
                        {activeMod.aulas.map((aula) => {
                          const cmts = lessonComments[aula.id] || [];
                          const cmtsLabel =
                            cmts.length === 1 ? '1 comentário' : `${cmts.length} comentários`;
                          return (
                            <div
                              key={aula.id}
                              className="p-4 rounded-2xl bg-[#11131B] border border-white/10 space-y-3"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <strong className="text-xs sm:text-sm text-white">
                                  Aula {aula.ordem} — {aula.titulo}
                                </strong>
                                <span className="text-[11px] font-mono text-white/55">
                                  {cmtsLabel}
                                </span>
                              </div>

                              {cmts.length > 0 && (() => {
                                const adminStudentColorMap = buildLessonStudentColorMap(cmts);
                                return (
                                  <div className="space-y-2.5 h-60 overflow-y-auto p-3 rounded-xl bg-[#0A0B10] border border-white/[0.06]">
                                    {cmts.map((c) => {
                                      const isProf = c.authorRole === 'professor';
                                      const displayAuthor = isProf
                                        ? c.authorName?.toLowerCase().includes('cleverson')
                                          ? 'Cleverson Black'
                                          : c.authorName || 'Cleverson Black'
                                        : c.authorName;
                                      const authorColor = getLessonParticipantColor(
                                        adminStudentColorMap,
                                        displayAuthor,
                                        c.authorRole
                                      );
                                      const parentMsg = c.parentId && cmts.find((p) => p.id === c.parentId);
                                      const quotedSnippet = c.replyToSnippet || parentMsg?.text;

                                      return (
                                        <div
                                          key={c.id}
                                          className={`flex ${isProf ? 'justify-end' : 'justify-start'}`}
                                        >
                                          <div
                                            className={`w-fit max-w-[85%] rounded-2xl px-3 py-2 text-xs border ${
                                              isProf
                                                ? 'rounded-br-sm bg-gradient-to-br from-[#3A0B12] to-[#1D080D] border-[#ED101C]/60'
                                                : 'rounded-bl-sm bg-[#161822] border-white/[0.08]'
                                            }`}
                                          >
                                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                              <strong
                                                className="text-[11px] font-extrabold"
                                                style={{ color: authorColor }}
                                              >
                                                {displayAuthor}
                                              </strong>
                                              {isProf && (
                                                <span className="px-1.5 py-0.5 rounded-full bg-[#ED101C] text-white text-[9.5px] font-bold">
                                                  (Professor)
                                                </span>
                                              )}
                                              <span className="text-[10px] text-white/40 font-mono">
                                                {c.createdAt}
                                              </span>
                                            </div>

                                            {quotedSnippet && (
                                              <div className="mb-1 px-2 py-1 rounded bg-black/35 border-l-2 border-[#ED101C] text-[10.5px] text-white/70">
                                                <strong className="block text-white text-[10px]">
                                                  {c.replyToName || parentMsg?.authorName}
                                                </strong>
                                                <span className="block truncate max-w-[220px]">
                                                  {quotedSnippet}
                                                </span>
                                              </div>
                                            )}

                                            <p className="text-white/90 leading-relaxed">{c.text}</p>

                                            {!isProf && (
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  setAdminReplyTargets((prev) => ({
                                                    ...prev,
                                                    [aula.id]: {
                                                      parentId: c.id,
                                                      authorName: displayAuthor,
                                                      authorRole: c.authorRole,
                                                      snippet: c.text,
                                                    },
                                                  }))
                                                }
                                                className="mt-1 text-[10.5px] font-bold text-[#FF5A65] hover:underline"
                                              >
                                                Responder →
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })()}

                              {adminReplyTargets[aula.id] && (
                                <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-[#ED101C]/15 border border-[#ED101C]/40 text-[11px] text-white">
                                  <span>
                                    Respondendo para{' '}
                                    <strong>{adminReplyTargets[aula.id].authorName}</strong>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setAdminReplyTargets((prev) => ({ ...prev, [aula.id]: null }))
                                    }
                                    className="text-white/70 hover:text-white font-bold"
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              )}

                              <form
                                onSubmit={(e) => handleProfessorReplyComment(aula, e)}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="text"
                                  value={adminReplyDrafts[aula.id] || ''}
                                  onChange={(e) =>
                                    setAdminReplyDrafts((prev) => ({
                                      ...prev,
                                      [aula.id]: e.target.value,
                                    }))
                                  }
                                  placeholder={
                                    adminReplyTargets[aula.id]
                                      ? `Responder para ${adminReplyTargets[aula.id].authorName}...`
                                      : `Responder ou comentar como Cleverson Black (Professor)...`
                                  }
                                  className="flex-1 bg-[#090A0F] border border-white/15 focus:border-[#ED101C] rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none"
                                />
                                <button
                                  type="submit"
                                  className="px-3.5 py-2 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs font-bold shrink-0"
                                >
                                  Responder
                                </button>
                              </form>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* =================================================================
              ABA 4: PRESENÇA DOS SÁBADOS (11 MÓDULOS) & ATESTADOS RECEBIDOS
          ================================================================= */}
          {activeTab === 'presenca' && (() => {
            const confirmedList = CLASS_SATURDAYS.filter((sat) => Boolean(confirmedDays[sat.iso]));
            const totalStudents = Math.max(1, students.length);
            const activeSatIndex = CLASS_SATURDAYS.findIndex((s) => s.iso === selectedSaturday);
            const activeSatInfo = CLASS_SATURDAYS[activeSatIndex] || CLASS_SATURDAYS[0];
            const [activeSatDate, activeSatTopic] = (activeSatInfo?.label || '').split(' — ');

            const approvedJustifications = justifications.filter((j) =>
              String(j.status || '').includes('Aprovada')
            );
            const rejectedJustifications = justifications.filter((j) =>
              String(j.status || '').includes('Recusada')
            );

            const filteredJustifications = justifications.filter((j) => {
              const st = String(j.status || '');
              if (justificationFilter === 'pendentes') return st === 'Em análise pela Secretaria';
              if (justificationFilter === 'aprovadas') return st.includes('Aprovada');
              if (justificationFilter === 'recusadas') return st.includes('Recusada');
              return true;
            });

            const filteredChamadaStudents = students.filter((s) => {
              const st = attendanceMap[selectedSaturday]?.[s.id] || 'presente';
              const matchesStatus = attendanceFilter === 'todos' || st === attendanceFilter;
              const q = attendanceSearch.trim().toLowerCase();
              const matchesQuery =
                !q ||
                String(s.nome || '').toLowerCase().includes(q) ||
                String(s.cpf || '').toLowerCase().includes(q);
              return matchesStatus && matchesQuery;
            });

            const pendingJustLabel =
              pendingJustifications.length === 1
                ? '1 atestado aguardando análise'
                : `${pendingJustifications.length} atestados aguardando análise`;

            return (
              <div className="space-y-6">
                {/* 4 KPIs Executivos BLACK da Chamada e Atestados */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                  {[
                    {
                      id: 'presentes',
                      label: 'Presentes no Sábado',
                      value: saturdaySummary.presentes,
                      sub: `${Math.round((saturdaySummary.presentes / totalStudents) * 100)}% de ${students.length} alunos`,
                      pct: Math.round((saturdaySummary.presentes / totalStudents) * 100),
                      icon: CheckCheck,
                      iconBox: 'bg-emerald-500/12 border-emerald-500/35 text-emerald-400',
                      barCls: 'bg-emerald-400',
                      textCls: 'text-emerald-400',
                      topBorder: 'border-t-emerald-400',
                      onClick: () => {
                        setPresencaSubTab('chamada');
                        setAttendanceFilter((prev) => (prev === 'presente' ? 'todos' : 'presente'));
                      },
                    },
                    {
                      id: 'justificadas',
                      label: 'Justificadas & Atestados',
                      value: saturdaySummary.justificadas,
                      sub:
                        pendingJustifications.length > 0
                          ? pendingJustLabel
                          : `${justifications.length} atestado(s) no histórico`,
                      pct: Math.round((saturdaySummary.justificadas / totalStudents) * 100),
                      icon: FileText,
                      iconBox: 'bg-amber-500/12 border-amber-400/35 text-amber-300',
                      barCls: 'bg-amber-400',
                      textCls: 'text-amber-300',
                      topBorder: 'border-t-amber-400',
                      onClick: () => setPresencaSubTab('atestados'),
                    },
                    {
                      id: 'faltas',
                      label: 'Faltas no Dia',
                      value: saturdaySummary.faltas,
                      sub: saturdaySummary.faltas === 0 ? 'Turma 100% coberta' : 'Mínimo exigido: 75%',
                      pct: Math.round((saturdaySummary.faltas / totalStudents) * 100),
                      icon: AlertCircle,
                      iconBox: 'bg-[#ED101C]/12 border-[#ED101C]/40 text-[#FF5A65]',
                      barCls: 'bg-[#ED101C]',
                      textCls: 'text-[#FF5A65]',
                      topBorder: 'border-t-[#ED101C]',
                      onClick: () => {
                        setPresencaSubTab('chamada');
                        setAttendanceFilter((prev) => (prev === 'falta' ? 'todos' : 'falta'));
                      },
                    },
                    {
                      id: 'aproveitamento',
                      label: 'Aproveitamento do Dia',
                      value: `${saturdaySummary.pct}%`,
                      sub: `${confirmedList.length} de ${CLASS_SATURDAYS.length} sábados salvos`,
                      pct: saturdaySummary.pct,
                      icon: CalendarCheck,
                      iconBox:
                        saturdaySummary.pct >= 75
                          ? 'bg-sky-500/12 border-sky-400/35 text-sky-300'
                          : 'bg-[#ED101C]/12 border-[#ED101C]/40 text-[#FF5A65]',
                      barCls: saturdaySummary.pct >= 75 ? 'bg-sky-400' : 'bg-[#ED101C]',
                      textCls: saturdaySummary.pct >= 75 ? 'text-sky-300' : 'text-[#FF5A65]',
                      topBorder: saturdaySummary.pct >= 75 ? 'border-t-sky-400' : 'border-t-[#ED101C]',
                      onClick: () => setPresencaSubTab('quadro'),
                    },
                  ].map((kpi) => {
                    const KpiIcon = kpi.icon;
                    return (
                      <button
                        key={kpi.id}
                        type="button"
                        onClick={kpi.onClick}
                        className={`admin-glass-card rounded-2xl p-4 sm:p-5 border-t-2 ${kpi.topBorder} text-left hover:-translate-y-0.5 transition-all group`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[11px] sm:text-xs text-white/60 block truncate">
                              {kpi.label}
                            </span>
                            <strong
                              className={`font-display font-extrabold text-2xl sm:text-3xl mt-1 block tabular-nums ${kpi.textCls}`}
                            >
                              {kpi.value}
                            </strong>
                          </div>
                          <span
                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${kpi.iconBox}`}
                          >
                            <KpiIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </span>
                        </div>
                        <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden mt-3">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${kpi.barCls}`}
                            style={{ width: `${Math.min(100, Math.max(4, kpi.pct))}%` }}
                          />
                        </div>
                        <span className="text-[10px] sm:text-[11px] text-white/45 block mt-2 truncate">
                          {kpi.id === 'justificadas' && pendingJustifications.length === 0
                            ? justifications.length === 1
                              ? '1 atestado no histórico'
                              : `${justifications.length} atestados no histórico`
                            : kpi.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Sub-abas CENTRALIZADAS BLACK */}
                <div className="flex justify-center">
                  <div className="w-full max-w-2xl grid grid-cols-3 gap-1.5 bg-[#0D0F16] border border-white/10 p-1.5 rounded-2xl shadow-lg">
                    {[
                      {
                        id: 'chamada',
                        short: 'Chamada',
                        label: 'Chamada do Sábado',
                        icon: CalendarCheck,
                        badge: confirmedDays[selectedSaturday] && !attendanceDirty ? null : '!',
                        badgeRed: false,
                      },
                      {
                        id: 'atestados',
                        short: 'Atestados',
                        label: 'Atestados Recebidos',
                        icon: FileText,
                        badge:
                          pendingJustifications.length > 0
                            ? String(pendingJustifications.length)
                            : justifications.length > 0
                            ? String(justifications.length)
                            : null,
                        badgeRed: pendingJustifications.length > 0,
                      },
                      {
                        id: 'quadro',
                        short: '11 Sábados',
                        label: 'Quadro 11 Sábados',
                        icon: Users,
                        badge: `${confirmedList.length}/${CLASS_SATURDAYS.length}`,
                        badgeRed: false,
                      },
                    ].map((sub) => {
                      const SubIcon = sub.icon;
                      const isActive = presencaSubTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => setPresencaSubTab(sub.id)}
                          className={`py-2.5 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
                            isActive
                              ? 'bg-[#ED101C] text-white shadow-[0_6px_18px_rgba(237,16,28,0.35)]'
                              : 'text-white/65 hover:text-white hover:bg-white/[0.04]'
                          }`}
                        >
                          <SubIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                          <span className="sm:hidden truncate">{sub.short}</span>
                          <span className="hidden sm:inline truncate">{sub.label}</span>
                          {sub.badge && (
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold leading-none ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : sub.badgeRed
                                  ? 'bg-[#ED101C] text-white'
                                  : 'bg-white/10 text-white/75'
                              }`}
                            >
                              {sub.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* =========================================================
                    SUB-ABA 1: CHAMADA PRESENCIAL DO SÁBADO
                ========================================================= */}
                {presencaSubTab === 'chamada' && (
                  <div className="space-y-4">
                    {/* Faixa compacta de alerta caso exista atestado aguardando análise */}
                    {pendingJustifications.length > 0 && (
                      <div className="rounded-2xl bg-[#180C10] border border-[#ED101C]/40 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                          <span className="w-2 h-2 rounded-full bg-[#ED101C] animate-pulse shrink-0" />
                          <strong className="text-white">{pendingJustLabel}</strong>
                          <span className="text-white/60 hidden sm:inline">
                            enviado pelo Portal do Aluno para sua aprovação.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setJustificationFilter('pendentes');
                            setPresencaSubTab('atestados');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#ED101C] hover:brightness-110 text-white text-xs font-bold inline-flex items-center gap-1 transition-all"
                        >
                          <span>Revisar Agora</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="admin-glass-card rounded-3xl p-4 sm:p-6 space-y-5">
                      {/* Cabeçalho do Sábado Ativo + Seletor Rápido */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
                        <div className="flex items-start sm:items-center gap-3 min-w-0">
                          <span className="w-10 h-10 rounded-xl bg-[#ED101C]/15 border border-[#ED101C]/40 flex items-center justify-center shrink-0">
                            <CalendarCheck className="w-5 h-5 text-[#FF5A65]" />
                          </span>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[11px] font-mono font-bold uppercase text-[#FF6B74]">
                                Módulo {String(Math.max(0, activeSatIndex) + 1).padStart(2, '0')} • {activeSatDate}
                              </span>
                              {confirmedDays[selectedSaturday] && !attendanceDirty ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/35 text-emerald-300">
                                  ✓ Salva
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 border border-amber-400/40 text-amber-300">
                                  {attendanceDirty ? 'Alteração pendente' : 'Aguardando confirmação'}
                                </span>
                              )}
                            </div>
                            <h2 className="font-display font-extrabold text-base sm:text-lg text-white truncate mt-0.5">
                              {activeSatTopic || 'Lista de Chamada Presencial (Unicesumar)'}
                            </h2>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto min-w-0">
                          <select
                            value={selectedSaturday}
                            onChange={(e) => {
                              setSelectedSaturday(e.target.value);
                              setAttendanceDirty(false);
                            }}
                            className="w-full sm:w-auto max-w-full truncate bg-[#090B10] border border-white/15 focus:border-[#ED101C] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-semibold focus:outline-none"
                          >
                            {CLASS_SATURDAYS.map((s) => (
                              <option key={s.iso} value={s.iso}>
                                {confirmedDays[s.iso] ? '✓ ' : '○ '}
                                {s.label}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={handleMarkAllPresent}
                            className="w-full sm:w-auto justify-center px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-emerald-600 border border-white/15 hover:border-emerald-400 text-white/85 hover:text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all shrink-0"
                          >
                            <CheckCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Marcar Todos Presentes</span>
                          </button>
                        </div>
                      </div>

                      {/* Mini-trilha navegável dos 11 Sábados (1 clique troca a chamada) */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                        {CLASS_SATURDAYS.map((sat, idx) => {
                          const isSaved = Boolean(confirmedDays[sat.iso]);
                          const isCurrent = selectedSaturday === sat.iso;
                          const shortDate = sat.label.slice(0, 5);
                          return (
                            <button
                              key={sat.iso}
                              type="button"
                              onClick={() => {
                                setSelectedSaturday(sat.iso);
                                setAttendanceDirty(false);
                              }}
                              title={sat.label}
                              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-mono font-bold inline-flex items-center gap-1.5 shrink-0 transition-all ${
                                isCurrent
                                  ? 'bg-[#ED101C] border-[#FF6B74] text-white shadow-[0_4px_14px_rgba(237,16,28,0.35)]'
                                  : isSaved
                                  ? 'bg-[#0C1018] border-emerald-500/30 text-white/80 hover:border-emerald-400/60'
                                  : 'bg-[#090B10] border-white/10 text-white/45 hover:text-white/80'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isCurrent
                                    ? 'bg-white'
                                    : isSaved
                                    ? 'bg-emerald-400'
                                    : 'bg-white/25'
                                }`}
                              />
                              <span>M{String(idx + 1).padStart(2, '0')}</span>
                              <span className="opacity-70">{shortDate}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Barra de Busca + Filtro Rápido da Chamada */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                        <div className="relative flex-1 min-w-0">
                          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            value={attendanceSearch}
                            onChange={(e) => setAttendanceSearch(e.target.value)}
                            placeholder="Buscar aluno na chamada por nome ou CPF..."
                            className="w-full bg-[#090B10] border border-white/10 focus:border-[#ED101C] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-white/35 focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {[
                            { id: 'todos', label: `Todos (${students.length})` },
                            { id: 'presente', label: `Presentes (${saturdaySummary.presentes})` },
                            { id: 'justificada', label: `Justificadas (${saturdaySummary.justificadas})` },
                            { id: 'falta', label: `Faltas (${saturdaySummary.faltas})` },
                          ].map((f) => (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => setAttendanceFilter(f.id)}
                              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                                attendanceFilter === f.id
                                  ? 'bg-[#ED101C] border-[#ED101C] text-white'
                                  : 'bg-[#090B10] border-white/10 text-white/60 hover:text-white'
                              }`}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Lista Discreta e Limpa dos Alunos */}
                      <div className="rounded-2xl bg-[#090B10] border border-white/10 divide-y divide-white/[0.06] overflow-hidden">
                        {filteredChamadaStudents.length === 0 ? (
                          <div className="p-8 text-center text-xs text-white/50">
                            Nenhum aluno encontrado com esse filtro na chamada.
                          </div>
                        ) : (
                          filteredChamadaStudents.map((s) => {
                            const st = attendanceMap[selectedSaturday]?.[s.id] || 'presente';
                            const stripeCls =
                              st === 'presente'
                                ? 'border-l-emerald-400'
                                : st === 'justificada'
                                ? 'border-l-amber-400'
                                : 'border-l-[#ED101C]';
                            const initials = (s.nome || 'AL')
                              .trim()
                              .split(/\s+/)
                              .slice(0, 2)
                              .map((w) => w[0])
                              .join('')
                              .toUpperCase();
                            return (
                              <div
                                key={s.id}
                                className={`px-3.5 sm:px-4 py-3 hover:bg-white/[0.025] border-l-[3px] ${stripeCls} flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-extrabold text-white flex items-center justify-center shrink-0">
                                    {initials}
                                  </span>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <strong className="text-xs sm:text-sm text-white truncate">
                                        {s.nome}
                                      </strong>
                                      <span
                                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                                          (s.frequenciaPct || 0) >= 75
                                            ? 'bg-emerald-500/10 text-emerald-300'
                                            : 'bg-[#ED101C]/15 text-[#FF6B74]'
                                        }`}
                                      >
                                        {s.frequenciaPct || 0}% geral
                                      </span>
                                    </div>
                                    <span className="text-[11px] text-white/45 font-mono block">
                                      {s.cpf}
                                    </span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 sm:flex items-center gap-1.5 w-full sm:w-auto shrink-0">
                                  {[
                                    {
                                      id: 'presente',
                                      label: '✓ Presente',
                                      activeCls:
                                        'bg-emerald-600/90 text-white border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.28)]',
                                    },
                                    {
                                      id: 'justificada',
                                      label: 'Justificada',
                                      activeCls:
                                        'bg-amber-600/90 text-white border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.28)]',
                                    },
                                    {
                                      id: 'falta',
                                      label: 'Falta',
                                      activeCls:
                                        'bg-[#ED101C] text-white border-[#FF6B74] shadow-[0_0_12px_rgba(237,16,28,0.35)]',
                                    },
                                  ].map((opt) => (
                                    <button
                                      key={opt.id}
                                      type="button"
                                      onClick={() => handleSetAttendance(s.id, opt.id)}
                                      className={`px-2 sm:px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all active:scale-95 text-center ${
                                        st === opt.id
                                          ? opt.activeCls
                                          : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white hover:bg-white/[0.08]'
                                      }`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Rodapé de Confirmação da Chamada */}
                      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                        <div className="flex flex-wrap items-center gap-2.5 text-xs">
                          {confirmedDays[selectedSaturday] && !attendanceDirty ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/12 border border-emerald-400/35 text-emerald-300 font-bold">
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              <span>Chamada salva em {confirmedDays[selectedSaturday].savedAt}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/45 text-amber-300 font-bold">
                              <AlertCircle className="w-4 h-4 shrink-0" />
                              <span>
                                {attendanceDirty
                                  ? 'Alterações pendentes — confirme para salvar o resultado'
                                  : 'Chamada ainda não confirmada neste sábado'}
                              </span>
                            </span>
                          )}
                          <span className="text-white/55 font-mono">
                            {saturdaySummary.presentes}P • {saturdaySummary.justificadas}J •{' '}
                            {saturdaySummary.faltas}F ({saturdaySummary.pct}%)
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={handleConfirmAttendance}
                          className="cta-btn-shimmer w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 text-white text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(16,185,129,0.32)] transition-all hover:-translate-y-0.5 shrink-0"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            {confirmedDays[selectedSaturday] && !attendanceDirty
                              ? 'Reconfirmar e Salvar Chamada'
                              : 'Confirmar e Salvar Chamada ✓'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* =========================================================
                    SUB-ABA 2: JUSTIFICATIVAS DE FALTA E ATESTADOS RECEBIDOS
                ========================================================= */}
                {presencaSubTab === 'atestados' && (
                  <div className="admin-glass-card rounded-3xl p-4 sm:p-6 border-l-4 border-l-[#ED101C] space-y-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-[#ED101C]/15 border border-[#ED101C]/40 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-[#FF5A65]" />
                        </span>
                        <div>
                          <h2 className="font-display font-extrabold text-base sm:text-lg text-white">
                            Justificativas de Falta e Atestados ({justifications.length})
                          </h2>
                          <p className="text-xs text-white/60">
                            Aprovar um atestado vincula automaticamente a falta como Justificada na chamada correspondente.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        {[
                          { id: 'todas', label: `Todas (${justifications.length})` },
                          { id: 'pendentes', label: `Pendentes (${pendingJustifications.length})` },
                          { id: 'aprovadas', label: `Aprovadas (${approvedJustifications.length})` },
                          { id: 'recusadas', label: `Recusadas (${rejectedJustifications.length})` },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setJustificationFilter(tab.id)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all ${
                              justificationFilter === tab.id
                                ? 'bg-[#ED101C] border-[#ED101C] text-white'
                                : 'bg-[#090B10] border-white/10 text-white/65 hover:text-white'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {filteredJustifications.length === 0 ? (
                      <div className="p-8 rounded-2xl bg-[#090B10] border border-dashed border-white/15 flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                        <div>
                          <strong className="text-sm text-white block">
                            {justificationFilter === 'pendentes'
                              ? 'Nenhum atestado aguardando análise'
                              : 'Nenhuma justificativa encontrada neste filtro'}
                          </strong>
                          <span className="text-xs text-white/55">
                            Quando o aluno enviar um atestado no Portal do Aluno, ele aparecerá aqui com visualização do arquivo.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-[#090B10] border border-white/10 divide-y divide-white/[0.06] overflow-hidden">
                        {filteredJustifications.map((j) => {
                          const isApproved = String(j.status || '').includes('Aprovada');
                          const isRejected = String(j.status || '').includes('Recusada');
                          const isPending = !isApproved && !isRejected;
                          const { sat, student } = findJustificationMatch(j);
                          const alreadyApplied =
                            Boolean(sat && student) &&
                            attendanceMap[sat.iso]?.[student.id] === 'justificada';

                          return (
                            <div
                              key={j.id}
                              className={`p-4 hover:bg-white/[0.02] border-l-[3px] flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 transition-colors ${
                                isApproved
                                  ? 'border-l-emerald-400'
                                  : isRejected
                                  ? 'border-l-[#ED101C]'
                                  : 'border-l-amber-400'
                              }`}
                            >
                              <div className="min-w-0 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-mono font-bold text-[#FF5A65]">
                                    Aula de {j.data} • {j.motivo}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                      isApproved
                                        ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                                        : isRejected
                                        ? 'bg-[#ED101C]/15 border-[#ED101C]/40 text-[#FF6B74]'
                                        : 'bg-amber-500/15 border-amber-400/40 text-amber-300'
                                    }`}
                                  >
                                    {isApproved ? '✓ Aprovada' : isRejected ? 'Recusada' : '⏳ Em análise'}
                                  </span>
                                  {isApproved && alreadyApplied && (
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.05] text-white/60">
                                      Vinculada à chamada
                                    </span>
                                  )}
                                </div>
                                <strong className="text-sm text-white block">
                                  {j.alunoNome || 'VITOR MATOS'} {j.alunoCpf ? `(${j.alunoCpf})` : ''}
                                </strong>
                                <p className="text-xs text-white/60">
                                  {j.detalhes}
                                  {j.anexo ? ` • Anexo: ${j.anexo}` : ''}
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 shrink-0">
                                {(j.anexoFileId || j.anexoDataUrl) && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleOpenAttachment({
                                        fileId: j.anexoFileId,
                                        dataUrl: j.anexoDataUrl,
                                        name: j.anexo || 'Atestado',
                                        type: j.anexoTipo,
                                      })
                                    }
                                    className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/10 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-[#FF5A65]" />
                                    <span>Ver Anexo</span>
                                  </button>
                                )}

                                {isPending && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleReviewJustification(j.id, '✓ Aprovada pela Coordenação')
                                      }
                                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                                    >
                                      Aprovar ✓
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleReviewJustification(j.id, 'Recusada pela Coordenação')
                                      }
                                      className="px-3 py-1.5 rounded-xl bg-white/[0.07] hover:bg-[#ED101C] text-white text-xs font-bold transition-colors"
                                    >
                                      Recusar
                                    </button>
                                  </>
                                )}

                                {isApproved && !alreadyApplied && sat && student && (
                                  <button
                                    type="button"
                                    onClick={() => handleApplyJustificationToAttendance(j)}
                                    className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/35 text-amber-200 text-xs font-bold transition-colors"
                                  >
                                    Justificar na Chamada
                                  </button>
                                )}

                                {isApproved && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleReviewJustification(j.id, 'Recusada pela Coordenação')
                                    }
                                    className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-[#ED101C]/20 border border-white/10 hover:border-[#ED101C]/40 text-white/60 hover:text-[#FF6B74] text-[11px] font-semibold transition-colors"
                                    title="Alterar decisão para Recusada"
                                  >
                                    Revogar
                                  </button>
                                )}

                                {isRejected && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleReviewJustification(j.id, '✓ Aprovada pela Coordenação')
                                    }
                                    className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-400/40 text-white/70 hover:text-emerald-300 text-[11px] font-semibold transition-colors"
                                  >
                                    Aprovar ✓
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleDeleteJustification(j.id)}
                                  className="p-2 rounded-xl bg-white/[0.04] hover:bg-[#ED101C]/20 border border-white/10 hover:border-[#ED101C]/45 text-white/45 hover:text-[#FF6B74] transition-colors"
                                  title="Excluir registro"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* =========================================================
                    SUB-ABA 3: DEMONSTRATIVO DE 11 SÁBADOS & QUADRO POR ALUNO
                ========================================================= */}
                {presencaSubTab === 'quadro' && (
                  <div className="admin-glass-card rounded-3xl p-4 sm:p-6 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-white/10">
                      <div>
                        <span className="text-[11px] font-mono font-bold uppercase text-[#FF6B74] block">
                          Relatório Vivo da Turma APH 200h
                        </span>
                        <h2 className="font-display font-extrabold text-lg sm:text-xl text-white mt-0.5">
                          Demonstrativo de Dias e Presenças ({confirmedList.length} de {CLASS_SATURDAYS.length} sábados salvos)
                        </h2>
                        <p className="text-xs text-white/60">
                          Clique em qualquer sábado abaixo para abrir a chamada dele na hora, ou exporte o quadro consolidado.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-3 text-[11px] font-bold">
                          <span className="inline-flex items-center gap-1.5 text-emerald-300">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />P = Presente
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-amber-300">
                            <span className="w-2 h-2 rounded-full bg-amber-400" />J = Justificada
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-[#FF6B74]">
                            <span className="w-2 h-2 rounded-full bg-[#ED101C]" />F = Falta
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleExportAttendanceCsv}
                          className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/15 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all"
                        >
                          <Download className="w-3.5 h-3.5 text-[#FF5A65]" />
                          <span>Exportar CSV</span>
                        </button>
                      </div>
                    </div>

                    {/* A) Grade Clicável dos 11 Sábados */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {CLASS_SATURDAYS.map((sat, idx) => {
                        const isSaved = Boolean(confirmedDays[sat.iso]);
                        const isSelected = selectedSaturday === sat.iso;
                        let pCount = 0;
                        let jCount = 0;
                        let fCount = 0;
                        students.forEach((st) => {
                          const v = attendanceMap[sat.iso]?.[st.id] || 'presente';
                          if (v === 'presente') pCount += 1;
                          else if (v === 'justificada') jCount += 1;
                          else fCount += 1;
                        });
                        const totalSt = Math.max(1, students.length);
                        const dayPct = Math.round(((pCount + jCount) / totalSt) * 100);
                        const [dateLabel, topicLabel] = sat.label.split(' — ');

                        return (
                          <button
                            key={sat.iso}
                            type="button"
                            onClick={() => {
                              setSelectedSaturday(sat.iso);
                              setAttendanceDirty(false);
                              setPresencaSubTab('chamada');
                            }}
                            className={`p-3.5 rounded-2xl border text-left transition-all hover:-translate-y-0.5 space-y-2.5 ${
                              isSelected
                                ? 'bg-[#1A0B0F] border-[#ED101C] shadow-[0_0_18px_rgba(237,16,28,0.2)]'
                                : isSaved
                                ? 'bg-[#0C0F18] border-white/10 hover:border-emerald-400/50'
                                : 'bg-[#090B10] border-white/[0.07] hover:border-white/20 opacity-75 hover:opacity-100'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-mono font-bold text-white/80">
                                {dateLabel}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  isSaved
                                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-white/5 text-white/50 border border-white/10'
                                }`}
                              >
                                {isSaved ? `✓ ${dayPct}%` : `Mód. ${String(idx + 1).padStart(2, '0')}`}
                              </span>
                            </div>

                            <strong className="text-xs text-white block truncate" title={topicLabel}>
                              {topicLabel}
                            </strong>

                            {isSaved ? (
                              <>
                                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden flex">
                                  <div
                                    className="bg-emerald-400 h-full"
                                    style={{ width: `${(pCount / totalSt) * 100}%` }}
                                  />
                                  <div
                                    className="bg-amber-400 h-full"
                                    style={{ width: `${(jCount / totalSt) * 100}%` }}
                                  />
                                  <div
                                    className="bg-[#ED101C] h-full"
                                    style={{ width: `${(fCount / totalSt) * 100}%` }}
                                  />
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-mono text-white/65">
                                  <span className="text-emerald-300">{pCount}P</span>
                                  <span className="text-amber-300">{jCount}J</span>
                                  <span className="text-[#FF6B74]">{fCount}F</span>
                                  <span className="text-white/45">Abrir chamada →</span>
                                </div>
                              </>
                            ) : (
                              <span className="text-[11px] text-white/45 block">
                                Aguardando chamada presencial
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* B) Matriz Demonstrativa por Aluno × Dias Confirmados */}
                    {confirmedList.length > 0 && (
                      <div className="rounded-2xl bg-[#090B10] border border-white/10 overflow-hidden">
                        <div className="px-4 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
                          <strong className="text-xs sm:text-sm text-white">
                            Quadro Demonstrativo por Aluno (Sábados Confirmados)
                          </strong>
                          <span className="text-[11px] text-white/50 font-mono">
                            Mínimo p/ Certificado: 75%
                          </span>
                        </div>

                        {/* Versão Mobile Discreta (sem tabela estourada!) */}
                        <div className="md:hidden divide-y divide-white/[0.06]">
                          {students.map((st) => {
                            let pTot = 0;
                            let jTot = 0;
                            let fTot = 0;
                            const cells = confirmedList.map((sat) => {
                              const v = attendanceMap[sat.iso]?.[st.id] || 'presente';
                              if (v === 'presente') pTot += 1;
                              else if (v === 'justificada') jTot += 1;
                              else fTot += 1;
                              return { iso: sat.iso, shortDate: sat.label.slice(0, 5), v };
                            });
                            const pct = Math.round(
                              ((pTot + jTot) / Math.max(1, confirmedList.length)) * 100
                            );
                            return (
                              <div key={st.id} className="p-3.5 space-y-2.5">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="min-w-0">
                                    <strong className="text-xs text-white block truncate">
                                      {st.nome}
                                    </strong>
                                    <span className="text-[10px] font-mono text-white/55">
                                      <span className="text-emerald-300">{pTot}P</span> •{' '}
                                      <span className="text-amber-300">{jTot}J</span> •{' '}
                                      <span className="text-[#FF6B74]">{fTot}F</span>
                                    </span>
                                  </div>
                                  <span
                                    className={`px-2 py-1 rounded-lg font-mono font-bold text-[10px] border shrink-0 ${
                                      pct >= 75
                                        ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                                        : 'bg-[#ED101C]/20 border-[#ED101C]/50 text-[#FF6B74]'
                                    }`}
                                  >
                                    {pct}% {pct >= 75 ? '✓ Apto' : '⚠ Atenção'}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {cells.map((cell) => (
                                    <span
                                      key={cell.iso}
                                      className={`px-1.5 py-0.5 rounded-md font-mono text-[10px] font-bold border ${
                                        cell.v === 'presente'
                                          ? 'bg-emerald-500/12 border-emerald-400/30 text-emerald-300'
                                          : cell.v === 'justificada'
                                          ? 'bg-amber-500/12 border-amber-400/30 text-amber-300'
                                          : 'bg-[#ED101C]/15 border-[#ED101C]/40 text-[#FF6B74]'
                                      }`}
                                    >
                                      {cell.shortDate}{' '}
                                      {cell.v === 'presente' ? 'P' : cell.v === 'justificada' ? 'J' : 'F'}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Versão Desktop Executiva (Tabela com coluna Aluno fixa) */}
                        <div className="hidden md:block overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="border-b border-white/10 bg-white/[0.02] text-white/60">
                                <th className="py-3 px-4 font-bold sticky left-0 bg-[#090B10] z-10">
                                  Aluno
                                </th>
                                {confirmedList.map((sat) => {
                                  const shortDate = sat.label.slice(0, 5);
                                  return (
                                    <th
                                      key={sat.iso}
                                      className="py-3 px-2 font-mono text-center whitespace-nowrap"
                                      title={sat.label}
                                    >
                                      {shortDate}
                                    </th>
                                  );
                                })}
                                <th className="py-3 px-3 font-bold text-center whitespace-nowrap">
                                  Resumo
                                </th>
                                <th className="py-3 px-4 font-bold text-right whitespace-nowrap">
                                  Frequência
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.05]">
                              {students.map((st) => {
                                let pTot = 0;
                                let jTot = 0;
                                let fTot = 0;
                                const cells = confirmedList.map((sat) => {
                                  const v = attendanceMap[sat.iso]?.[st.id] || 'presente';
                                  if (v === 'presente') pTot += 1;
                                  else if (v === 'justificada') jTot += 1;
                                  else fTot += 1;
                                  return { iso: sat.iso, v };
                                });
                                const pct = Math.round(
                                  ((pTot + jTot) / Math.max(1, confirmedList.length)) * 100
                                );
                                return (
                                  <tr key={st.id} className="hover:bg-white/[0.025] transition-colors">
                                    <td className="py-3 px-4 font-bold text-white whitespace-nowrap sticky left-0 bg-[#090B10]">
                                      {st.nome}
                                    </td>
                                    {cells.map((cell) => (
                                      <td key={cell.iso} className="py-3 px-2 text-center">
                                        <span
                                          className={`inline-flex items-center justify-center w-6 h-6 rounded-lg font-mono font-extrabold text-[11px] border ${
                                            cell.v === 'presente'
                                              ? 'bg-emerald-500/18 border-emerald-400/40 text-emerald-300'
                                              : cell.v === 'justificada'
                                              ? 'bg-amber-500/18 border-amber-400/40 text-amber-300'
                                              : 'bg-[#ED101C]/20 border-[#ED101C]/50 text-[#FF6B74]'
                                          }`}
                                        >
                                          {cell.v === 'presente'
                                            ? 'P'
                                            : cell.v === 'justificada'
                                            ? 'J'
                                            : 'F'}
                                        </span>
                                      </td>
                                    ))}
                                    <td className="py-3 px-3 text-center font-mono text-[11px] whitespace-nowrap text-white/75">
                                      <span className="text-emerald-300">{pTot}P</span> •{' '}
                                      <span className="text-amber-300">{jTot}J</span> •{' '}
                                      <span className="text-[#FF6B74]">{fTot}F</span>
                                    </td>
                                    <td className="py-3 px-4 text-right whitespace-nowrap">
                                      <span
                                        className={`px-2.5 py-1 rounded-lg font-mono font-bold text-[11px] border ${
                                          pct >= 75
                                            ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
                                            : 'bg-[#ED101C]/20 border-[#ED101C]/50 text-[#FF6B74]'
                                        }`}
                                      >
                                        {pct}% {pct >= 75 ? '✓ Apto' : '⚠ Atenção'}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* =================================================================
              ABA 5: FINANCEIRO, BOLETOS (10X), LEMBRETES, DESPESAS E GATEWAY
          ================================================================= */}
          {activeTab === 'financeiro' && (
            <div className="space-y-6">
              {/* 3 KPIs Semáforo em Tela Cheia */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="admin-glass-card p-5 sm:p-6 rounded-3xl border-t-2 border-t-amber-400 hover:-translate-y-0.5 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-white/65 block">Faturamento do Mês (APH 200h)</span>
                    <strong className="font-display font-extrabold text-2xl sm:text-3xl text-amber-300 mt-1 block tabular-nums">
                      {formatBRL(monthlyRevenue)}
                    </strong>
                  </div>
                  <span className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-400/35 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-amber-300" />
                  </span>
                </div>
                <div className="admin-glass-card p-5 sm:p-6 rounded-3xl border-t-2 border-t-[#ED101C] hover:-translate-y-0.5 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-white/65 block">Despesas Lançadas</span>
                    <strong className="font-display font-extrabold text-2xl sm:text-3xl text-[#FF5A65] mt-1 block tabular-nums">
                      {formatBRL(totalExpenses)}
                    </strong>
                  </div>
                  <span className="w-11 h-11 rounded-2xl bg-[#ED101C]/15 border border-[#ED101C]/40 flex items-center justify-center shrink-0">
                    <Receipt className="w-5 h-5 text-[#FF5A65]" />
                  </span>
                </div>
                <div className="admin-glass-card p-5 sm:p-6 rounded-3xl border-t-2 border-t-emerald-400 hover:-translate-y-0.5 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-white/70 block">Lucro Líquido ({profitMarginPct}%)</span>
                    <strong className="font-display font-extrabold text-2xl sm:text-3xl text-emerald-400 mt-1 block tabular-nums">
                      {formatBRL(netProfit)}
                    </strong>
                  </div>
                  <span className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-400/35 flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </span>
                </div>
              </div>

              {/* Sub-abas CENTRALIZADAS e proporcionais (rótulos nítidos no Mobile sem cortar!) */}
              <div className="flex justify-center">
                <div className="w-full max-w-2xl grid grid-cols-3 gap-1.5 bg-[#0D0F16] border border-white/10 p-1.5 rounded-2xl shadow-lg">
                  {[
                    { id: 'boletos', short: 'Boletos', label: 'Boletos (10x)', icon: FileText },
                    { id: 'despesas', short: 'Despesas', label: 'Despesas do Curso', icon: Receipt },
                    { id: 'gateway', short: 'Gateway', label: 'Gateway (MP / Stripe)', icon: CreditCard },
                  ].map((sub) => {
                    const SubIcon = sub.icon;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setFinanceSubTab(sub.id)}
                        className={`py-2.5 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${
                          financeSubTab === sub.id
                            ? 'bg-gradient-to-r from-[#ED101C] to-[#C80B15] text-white shadow-[0_6px_18px_rgba(237,16,28,0.38)]'
                            : 'text-white/70 hover:text-white hover:bg-white/[0.04]'
                        }`}
                      >
                        <SubIcon className="w-4 h-4 shrink-0" />
                        <span className="sm:hidden truncate">{sub.short}</span>
                        <span className="hidden sm:inline truncate">{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {financeSubTab === 'boletos' ? (
                <div className="space-y-5">
                  {/* Régua Automática de Lembretes de Vencimento (Portal + WhatsApp) */}
                  <div className="admin-glass-card rounded-3xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-l-4 border-l-amber-400">
                    <div className="flex items-start gap-3">
                      <span className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/35 flex items-center justify-center shrink-0">
                        <Zap className="w-5 h-5 text-amber-300" />
                      </span>
                      <div>
                        <strong className="text-sm sm:text-base text-white block">
                          Lembretes Automáticos de Vencimento (Portal + WhatsApp)
                        </strong>
                        <span className="text-xs text-white/60 block mt-0.5">
                          Ative os disparos automáticos antes e no dia do vencimento para evitar atrasos — ou envie um aviso manual em 1 clique na parcela abaixo.
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto shrink-0">
                      {[
                        { key: 'd5', label: '5 dias antes' },
                        { key: 'd1', label: '1 dia antes' },
                        { key: 'd0', label: 'No vencimento' },
                      ].map((rule) => {
                        const on = autoDueReminders[rule.key];
                        return (
                          <button
                            key={rule.key}
                            type="button"
                            onClick={() => {
                              setAutoDueReminders((prev) => ({ ...prev, [rule.key]: !prev[rule.key] }));
                              showToast(
                                `Lembrete "${rule.label}" ${!on ? 'ATIVADO ✓' : 'desativado'}.`,
                                !on ? 'success' : 'info'
                              );
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                              on
                                ? 'bg-emerald-500/15 border-emerald-400/45 text-emerald-300'
                                : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
                            }`}
                          >
                            {on ? '✓ ' : ''}
                            {rule.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Seletor de Aluno no Financeiro + Lista das 10 Parcelas */}
                  <div className="admin-glass-card rounded-3xl p-5 sm:p-6 space-y-5">
                    <div className="p-4 rounded-2xl bg-[#0D0F16] border border-[#ED101C]/35 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="w-11 h-11 rounded-2xl bg-[#ED101C]/15 border border-[#ED101C]/45 text-[#FF5A65] font-display font-extrabold text-sm flex items-center justify-center shrink-0">
                          {(selectedFinanceStudent.nome || 'AL')
                            .trim()
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((w) => w[0])
                            .join('')
                            .toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF6B74] block">
                            Aluno Selecionado no Financeiro
                          </span>
                          <strong className="font-display font-extrabold text-sm sm:text-base text-white block truncate">
                            {selectedFinanceStudent.nome}
                          </strong>
                          <span className="text-xs text-white/55 font-mono block">
                            CPF {selectedFinanceStudent.cpf} • {installments.filter((i) => i.status === 'paga').length}/10 pagas
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                        <label className="text-[11px] font-bold text-white/60 sm:hidden">
                          Trocar Aluno:
                        </label>
                        <select
                          value={selectedFinanceStudent.id}
                          onChange={(e) => setSelectedFinanceStudentId(e.target.value)}
                          className="bg-[#141722] border border-white/15 focus:border-[#ED101C] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-white focus:outline-none min-w-[230px]"
                          aria-label="Selecionar aluno para gerenciar financeiro"
                        >
                          {students.map((st) => (
                            <option key={st.id} value={st.id}>
                              {st.nome} ({st.parcelasPagas}/{st.parcelasTotal} • {st.statusFinanceiro})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-display font-extrabold text-lg text-white">
                        Gestão de Parcelas 10x — {selectedFinanceStudent.nome}
                      </h3>
                      <p className="text-xs text-white/60">
                        Clique no status ou em <strong className="text-white/85">Registrar / Editar Pagamento</strong> para escolher <strong className="text-white/85">PIX, Cartão, Dinheiro ou Boleto</strong>, além da data e horário exatos. Tudo aparece imediatamente no Portal do Aluno.
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {installments.map((p) => {
                        const isPaid = p.status === 'paga';
                        const needsAttention = p.status === 'aberta' || p.status === 'atrasada';
                        const rowBorder =
                          p.status === 'atrasada'
                            ? 'border-l-[#ED101C]'
                            : p.status === 'aberta'
                            ? 'border-l-amber-400'
                            : isPaid
                            ? 'border-l-emerald-400'
                            : 'border-l-sky-400/60';
                        return (
                          <div
                            key={p.numero}
                            className={`p-4 rounded-2xl bg-[#151824] hover:bg-[#1B1F2E] border border-white/10 border-l-4 ${rowBorder} flex flex-col xl:flex-row xl:items-center justify-between gap-3 transition-all`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <span className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 font-mono text-xs font-extrabold text-white flex items-center justify-center shrink-0">
                                {String(p.numero).padStart(2, '0')}/10
                              </span>
                              <div className="min-w-0">
                                <strong className="text-sm text-white block">
                                  Parcela {p.numero} — {p.valor} (Venc. {p.vencimento})
                                </strong>
                                {isPaid ? (
                                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs mt-0.5">
                                    <span className="text-emerald-300 font-bold">
                                      Pago via {p.metodo || 'PIX'}
                                    </span>
                                    <span className="text-white/45">•</span>
                                    <span className="text-white/70 font-mono">
                                      {p.pagoEm || `${p.vencimento} às 14:20`}
                                    </span>
                                    {p.recebidoPor && (
                                      <>
                                        <span className="text-white/45">•</span>
                                        <span className="text-white/55">Por {p.recebidoPor}</span>
                                      </>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-xs text-white/60 block truncate">
                                    {p.boletoNome
                                      ? `✓ Boleto anexado: ${p.boletoNome} (${p.boletoTamanho})`
                                      : 'Aguardando pagamento ou baixa administrativa'}
                                  </span>
                                )}
                                {p.observacaoPagamento && isPaid && (
                                  <span className="text-[11px] text-white/50 italic block mt-0.5 truncate">
                                    Obs.: {p.observacaoPagamento}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => openPaymentEditorModal(p, isPaid ? 'paga' : 'paga')}
                                title="Abrir tela para alterar status, forma de pagamento (PIX, Cartão, Dinheiro), data e horário"
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                                  isPaid
                                    ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/40 text-emerald-300'
                                    : p.status === 'atrasada'
                                    ? 'bg-[#ED101C]/20 hover:bg-[#ED101C]/35 border-[#ED101C]/60 text-[#FF6B74]'
                                    : p.status === 'aberta'
                                    ? 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-400/55 text-amber-300'
                                    : 'bg-sky-500/15 hover:bg-sky-500/25 border-sky-400/35 text-sky-300'
                                }`}
                              >
                                {isPaid
                                  ? `✓ Paga (${p.metodo || 'PIX'})`
                                  : p.status === 'atrasada'
                                  ? '⚠ Atrasada'
                                  : p.status === 'aberta'
                                  ? 'Em aberto'
                                  : 'A vencer'}
                              </button>

                              <button
                                type="button"
                                onClick={() => openPaymentEditorModal(p)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border transition-all ${
                                  isPaid
                                    ? 'bg-white/[0.06] hover:bg-white/[0.14] border-white/15 text-white/85'
                                    : 'bg-emerald-500/15 hover:bg-emerald-600 border-emerald-400/45 text-emerald-300 hover:text-white'
                                }`}
                                title={
                                  isPaid
                                    ? 'Alterar forma de pagamento, data, horário ou status'
                                    : 'Dar baixa (PIX, Cartão de Crédito/Débito, Dinheiro ou Boleto)'
                                }
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>{isPaid ? 'Editar Pagamento' : 'Dar Baixa'}</span>
                              </button>

                              {/* Botões de Lembrete (Portal + WhatsApp) para parcelas Atrasadas ou Em Aberto */}
                              {needsAttention && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleSendDueReminderToPortal(p)}
                                    className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold inline-flex items-center gap-1.5 transition-all"
                                    title="Enviar alerta de vencimento para o sininho do Portal do Aluno"
                                  >
                                    <Bell className="w-3.5 h-3.5" />
                                    <span>Avisar Portal</span>
                                  </button>
                                  <a
                                    href={getStudentWhatsAppUrl(
                                      selectedFinanceStudent.telefone,
                                      p.status === 'atrasada'
                                        ? `Olá ${selectedFinanceStudent.nome}! Lembrete da BLACK Treinamentos: sua Parcela ${p.numero}/10 (${p.valor}, vencimento ${p.vencimento}) está em atraso. O boleto/PIX está disponível no seu Portal do Aluno.`
                                        : `Olá ${selectedFinanceStudent.nome}! Lembrete da BLACK Treinamentos: sua Parcela ${p.numero}/10 (${p.valor}) vence em ${p.vencimento}. O boleto/PIX já está disponível no Portal do Aluno.`
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-600 border border-emerald-500/35 text-emerald-300 hover:text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all"
                                    title={`Enviar lembrete no WhatsApp de ${selectedFinanceStudent.nome} (${selectedFinanceStudent.telefone})`}
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                    <span>WhatsApp</span>
                                  </a>
                                </>
                              )}

                              {(p.boletoFileId || p.boletoDataUrl || p.boletoNome) && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleOpenAttachment({
                                      fileId: p.boletoFileId,
                                      dataUrl: p.boletoDataUrl,
                                      name: p.boletoNome || `Boleto_Parcela_${p.numero}.pdf`,
                                      type: p.boletoTipo,
                                    })
                                  }
                                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold inline-flex items-center gap-1.5"
                                  title="Visualizar arquivo anexado"
                                >
                                  <FileText className="w-3.5 h-3.5 text-emerald-300" />
                                  <span>Ver</span>
                                </button>
                              )}

                              {/* Em parcela PAGA: exibe botão do Comprovante Oficial Digital + recibo anexo opcional */}
                              {isPaid ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setReceiptModalParcela(p)}
                                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-600 border border-emerald-400/45 text-emerald-300 hover:text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all"
                                    title="Abrir Comprovante Oficial de Pagamento da BLACK"
                                  >
                                    <Receipt className="w-3.5 h-3.5" />
                                    <span>Comprovante</span>
                                  </button>
                                  <label
                                    className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                                    title="Anexar recibo ou comprovante opcional"
                                  >
                                    <Paperclip className="w-3.5 h-3.5" />
                                    <span>{p.boletoNome ? 'Trocar Anexo' : 'Anexo'}</span>
                                    <input
                                      type="file"
                                      accept=".pdf,image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) handleUploadBoleto(p.numero, f);
                                        e.target.value = '';
                                      }}
                                    />
                                  </label>
                                </>
                              ) : (
                                <label className="px-3.5 py-1.5 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-red-glow-sm transition-all">
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>{p.boletoNome ? 'Trocar Boleto' : 'Anexar Boleto'}</span>
                                  <input
                                    type="file"
                                    accept=".pdf,image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const f = e.target.files?.[0];
                                      if (f) handleUploadBoleto(p.numero, f);
                                      e.target.value = '';
                                    }}
                                  />
                                </label>
                              )}

                              {p.boletoNome && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveBoleto(p.numero)}
                                  className="p-2 rounded-xl bg-white/5 hover:bg-[#ED101C]/25 border border-white/15 text-white/75 hover:text-[#FF6B74]"
                                  title="Remover arquivo"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : financeSubTab === 'despesas' ? (
                <div className="admin-glass-card rounded-3xl p-5 sm:p-6 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display font-extrabold text-lg text-white">
                        Despesas do Curso (Instrutores, Sala, Insumos e Gráfica)
                      </h3>
                      <p className="text-xs text-white/60">
                        Cada lançamento atualiza o Lucro Líquido e o gráfico principal automaticamente.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {expensesByCategory.map(([cat, val]) => (
                        <span
                          key={cat}
                          className="px-3 py-1 rounded-xl bg-[#190A0D] border border-[#ED101C]/35 text-xs text-white/85"
                        >
                          {cat}: <strong className="font-mono text-[#FF6B74]">{formatBRL(val)}</strong>
                        </span>
                      ))}
                    </div>
                  </div>

                  <form
                    onSubmit={handleAddExpense}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-5 rounded-2xl bg-[#0B0D14] border border-white/15 items-end"
                  >
                    <div className="sm:col-span-5">
                      <label className="block text-[11px] font-bold text-white/70 mb-1">
                        Descrição da Despesa *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Insumos aula prática (gaze, luvas, torniquete)"
                        value={newExpense.descricao}
                        onChange={(e) => setNewExpense({ ...newExpense, descricao: e.target.value })}
                        className="w-full bg-[#141722] border border-white/15 focus:border-[#ED101C] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-white/70 mb-1">
                        Categoria
                      </label>
                      <select
                        value={newExpense.categoria}
                        onChange={(e) => setNewExpense({ ...newExpense, categoria: e.target.value })}
                        className="w-full bg-[#141722] border border-white/15 focus:border-[#ED101C] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                      >
                        <option value="Materiais APH">Materiais APH</option>
                        <option value="Estrutura">Estrutura / Sala</option>
                        <option value="Equipe">Equipe / Instrutores</option>
                        <option value="Gráfica">Gráfica / Apostilas</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-white/70 mb-1">
                        Valor (R$) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="0,00"
                        value={newExpense.valor}
                        onChange={(e) => setNewExpense({ ...newExpense, valor: e.target.value })}
                        className="w-full bg-[#141722] border border-white/15 focus:border-[#ED101C] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="sm:col-span-2 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs sm:text-sm font-extrabold py-2.5 shadow-red-glow-sm transition-all"
                    >
                      + Lançar
                    </button>
                  </form>

                  <div className="space-y-2.5">
                    {expenses.map((exp) => (
                      <div
                        key={exp.id}
                        className="p-4 rounded-2xl bg-[#151824] hover:bg-[#1B1F2E] border border-white/10 border-l-4 border-l-[#ED101C]/75 flex items-center justify-between gap-3 transition-all"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <span className="w-9 h-9 rounded-xl bg-[#ED101C]/15 border border-[#ED101C]/35 flex items-center justify-center shrink-0">
                            <Receipt className="w-4 h-4 text-[#FF6B74]" />
                          </span>
                          <div className="min-w-0">
                            <strong className="text-sm text-white block truncate">{exp.descricao}</strong>
                            <span className="text-xs text-white/55">
                              {exp.categoria} • {exp.data}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <strong className="font-mono text-sm sm:text-base text-[#FF5A65]">
                            - {formatBRL(exp.valor)}
                          </strong>
                          <button
                            type="button"
                            onClick={() => handleRemoveExpense(exp.id)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-[#ED101C]/25 text-white/65 hover:text-[#FF6B74] transition-colors"
                            title="Remover despesa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* GATEWAY CENTRALIZADO E PREMIUM! */
                <div className="max-w-4xl mx-auto admin-glass-card rounded-3xl p-6 sm:p-8 space-y-6">
                  <div className="text-center max-w-xl mx-auto space-y-1.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ED101C]/15 border border-[#ED101C]/40 text-[#FF6B74] text-[11px] font-mono font-bold uppercase">
                      <CreditCard className="w-3.5 h-3.5" />
                      Checkout Integrado • Adapter Pronto
                    </span>
                    <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                      Gateway de Pagamentos (Mercado Pago / Stripe)
                    </h3>
                    <p className="text-xs sm:text-sm text-white/65">
                      Escolha qual provedor ficará ativo no checkout oficial assim que conectarmos as chaves de produção no Supabase.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        id: 'MERCADO_PAGO',
                        name: 'Mercado Pago',
                        badge: 'Recomendado p/ Brasil',
                        desc: 'PIX com baixa automática, Boleto registrado e Cartão em até 10x sem burocracia.',
                        tags: ['PIX Instantâneo', 'Boleto 10x', 'Cartão Nacional'],
                        activeCls:
                          'bg-gradient-to-br from-[#0B253C] via-[#131826] to-[#11131B] border-sky-400 shadow-[0_10px_30px_rgba(56,189,248,0.2)]',
                        dotCls: 'bg-sky-400',
                      },
                      {
                        id: 'STRIPE',
                        name: 'Stripe',
                        badge: 'Internacional / Recorrência',
                        desc: 'Cobrança recorrente no cartão, checkout ultrarrápido e webhooks nativos de alta escala.',
                        tags: ['Cartão Recorrente', 'Apple/Google Pay', 'Webhooks Pro'],
                        activeCls:
                          'bg-gradient-to-br from-[#231442] via-[#151426] to-[#11131B] border-purple-400 shadow-[0_10px_30px_rgba(168,85,247,0.22)]',
                        dotCls: 'bg-purple-400',
                      },
                    ].map((gw) => {
                      const selected = activeGateway === gw.id;
                      return (
                        <button
                          key={gw.id}
                          type="button"
                          onClick={() => {
                            setActiveGateway(gw.id);
                            showToast(`Gateway selecionado: ${gw.name} ✓`);
                          }}
                          className={`p-6 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-1 space-y-3 ${
                            selected
                              ? gw.activeCls
                              : 'bg-[#141722] border-white/10 hover:border-white/25 text-white/80'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <span className={`w-3 h-3 rounded-full ${gw.dotCls}`} />
                              <strong className="font-display font-extrabold text-lg text-white">
                                {gw.name}
                              </strong>
                            </div>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                selected
                                  ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-300'
                                  : 'bg-white/5 border border-white/10 text-white/60'
                              }`}
                            >
                              {selected ? '✓ Selecionado' : gw.badge}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                            {gw.desc}
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {gw.tags.map((t) => (
                              <span
                                key={t}
                                className="px-2.5 py-1 rounded-lg bg-black/35 border border-white/10 text-[11px] font-semibold text-white/80"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0B0D14] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white/70">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>
                        Arquitetura pronta para receber as credenciais de produção assim que conectarmos o <strong className="text-white">Supabase</strong>.
                      </span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold shrink-0">
                      ● Adapter Ativo
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              ABA 6: COMUNICADOS (ESPAÇOSO, TEMPLATES EM 1 CLIQUE E SINCRONIZADO!)
          ================================================================= */}
          {activeTab === 'comunicados' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <form
                onSubmit={handlePublishAnnouncement}
                className="lg:col-span-5 admin-glass-card rounded-3xl p-6 border-t-2 border-t-[#ED101C] space-y-4"
              >
                <div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#FF6B74]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ED101C] animate-pulse" />
                    ENVIO DIRETO PARA O SININHO DO PORTAL DO ALUNO
                  </span>
                  <h2 className="font-display font-extrabold text-xl text-white mt-1">
                    Publicar Novo Comunicado
                  </h2>
                </div>

                {/* CONTROLE DE DESTINATÁRIOS (TODOS | 1, 5 OU QUANTOS ALUNOS ESCOLHER!) */}
                <div className="p-3.5 rounded-2xl bg-[#0B0D14] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white/85 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#FF5A65]" />
                      <span>Para quem vai este aviso?</span>
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-300">
                      {noticeTargetMode === 'all'
                        ? `Todos (${students.length})`
                        : `${selectedNoticeStudentIds.length} selecionado(s)`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 bg-[#141722] p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setNoticeTargetMode('all')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                        noticeTargetMode === 'all'
                          ? 'bg-[#ED101C] text-white shadow-red-glow-sm'
                          : 'text-white/65 hover:text-white'
                      }`}
                    >
                      Todos os Alunos ({students.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setNoticeTargetMode('selected')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                        noticeTargetMode === 'selected'
                          ? 'bg-[#ED101C] text-white shadow-red-glow-sm'
                          : 'text-white/65 hover:text-white'
                      }`}
                    >
                      Escolher Alunos
                    </button>
                  </div>

                  {noticeTargetMode === 'selected' && (
                    <div className="space-y-2.5 pt-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="relative flex-1 min-w-[160px]">
                          <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={noticeStudentSearch}
                            onChange={(e) => setNoticeStudentSearch(e.target.value)}
                            placeholder="Filtrar aluno por nome..."
                            className="w-full bg-[#141722] border border-white/10 focus:border-[#ED101C] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedNoticeStudentIds(students.map((s) => s.id))}
                            className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/15 text-[10px] font-bold text-white/80"
                          >
                            Todos
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedNoticeStudentIds(
                                students
                                  .filter((s) => s.statusFinanceiro !== 'Em dia')
                                  .map((s) => s.id)
                              )
                            }
                            className="px-2 py-1 rounded-md bg-amber-500/15 hover:bg-amber-500/30 text-[10px] font-bold text-amber-300"
                          >
                            Pendentes
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedNoticeStudentIds([])}
                            className="px-2 py-1 rounded-md bg-white/5 hover:bg-[#ED101C]/25 text-[10px] font-bold text-white/65 hover:text-[#FF6B74]"
                          >
                            Limpar
                          </button>
                        </div>
                      </div>

                      <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
                        {students
                          .filter(
                            (s) =>
                              s.nome.toLowerCase().includes(noticeStudentSearch.toLowerCase()) ||
                              s.cpf.includes(noticeStudentSearch)
                          )
                          .map((s) => {
                            const checked = selectedNoticeStudentIds.includes(s.id);
                            return (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => toggleNoticeStudent(s.id)}
                                className={`w-full px-3 py-2 rounded-xl border text-left flex items-center justify-between gap-2 transition-all ${
                                  checked
                                    ? 'bg-[#ED101C]/15 border-[#ED101C]/65 text-white'
                                    : 'bg-[#141722]/70 border-white/5 hover:border-white/20 text-white/75'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span
                                    className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-extrabold border shrink-0 ${
                                      checked
                                        ? 'bg-[#ED101C] border-[#FF6B74] text-white'
                                        : 'bg-black/40 border-white/25 text-transparent'
                                    }`}
                                  >
                                    ✓
                                  </span>
                                  <div className="min-w-0">
                                    <strong className="text-xs block truncate">{s.nome}</strong>
                                    <span className="text-[10px] font-mono text-white/45 block">
                                      {s.cpf}
                                    </span>
                                  </div>
                                </div>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                                    s.statusFinanceiro === 'Em dia'
                                      ? 'bg-emerald-500/15 text-emerald-300'
                                      : 'bg-[#ED101C]/20 text-[#FF6B74]'
                                  }`}
                                >
                                  {s.statusFinanceiro}
                                </span>
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Modelos Rápidos em 1 Clique */}
                <div>
                  <span className="block text-[11px] font-bold text-white/55 mb-1.5">
                    Modelos rápidos (clique para preencher):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      {
                        label: 'Aula Sábado',
                        titulo: 'Orientações para Aula Prática neste Sábado',
                        mensagem:
                          'Olá turma! Lembrando que neste sábado teremos aula prática presencial na Unicesumar. Venham de calçado fechado e tragam garrafa de água.',
                      },
                      {
                        label: 'Lembrete Boleto',
                        titulo: 'Boleto da Mensalidade já disponível no Portal',
                        mensagem:
                          'O boleto da mensalidade deste mês já foi liberado na aba Financeiro do seu Portal do Aluno. Você pode visualizar, baixar ou copiar o PIX.',
                      },
                      {
                        label: 'Certificados',
                        titulo: 'Liberação dos Certificados (200h)',
                        mensagem:
                          'Alunos que concluíram os 11 módulos e a Avaliação Final já podem clicar em Solicitar Emissão na aba Meu Certificado para nossa conferência.',
                      },
                    ].map((tpl) => (
                      <button
                        key={tpl.label}
                        type="button"
                        onClick={() =>
                          setNewNotice((prev) => ({
                            ...prev,
                            titulo: tpl.titulo,
                            mensagem: tpl.mensagem,
                          }))
                        }
                        className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-[#ED101C]/20 border border-white/10 hover:border-[#ED101C]/50 text-[11px] font-bold text-white/80 hover:text-white transition-all"
                      >
                        + {tpl.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/75 mb-1.5">Título do Aviso *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Aula prática de torniquete neste sábado!"
                    value={newNotice.titulo}
                    onChange={(e) => setNewNotice({ ...newNotice, titulo: e.target.value })}
                    className="w-full bg-[#090B10] border border-white/15 focus:border-[#ED101C] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/75 mb-1.5">Mensagem *</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Escreva as orientações para a Turma APH 200h..."
                    value={newNotice.mensagem}
                    onChange={(e) => setNewNotice({ ...newNotice, mensagem: e.target.value })}
                    className="w-full bg-[#090B10] border border-white/15 focus:border-[#ED101C] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="cta-btn-shimmer w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ED101C] to-[#C80B15] hover:brightness-110 text-white text-sm font-extrabold inline-flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(237,16,28,0.4)] transition-all hover:-translate-y-0.5"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {noticeTargetMode === 'all'
                      ? `Publicar para Todos (${students.length} alunos)`
                      : selectedNoticeStudentIds.length === 1
                      ? 'Enviar para 1 Aluno Selecionado'
                      : `Enviar para ${selectedNoticeStudentIds.length} Alunos Selecionados`}
                  </span>
                </button>
              </form>

              <div className="lg:col-span-7 admin-glass-card rounded-3xl p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-white">
                      Mural de Comunicados Ativos ({announcements.length})
                    </h3>
                    <p className="text-xs text-white/55">
                      Cada aviso mostra exatamente quem recebe no Portal do Aluno (todos ou alunos escolhidos).
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {noticesMuralOpen && announcements.length > 3 && (
                      <button
                        type="button"
                        onClick={() => setShowAllNotices((v) => !v)}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-bold text-white/85 transition-all"
                      >
                        {showAllNotices ? 'Ver menos (3)' : `Ver todos (${announcements.length})`}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setNoticesMuralOpen((v) => !v)}
                      className="px-3 py-1.5 rounded-xl bg-[#ED101C]/15 hover:bg-[#ED101C]/30 border border-[#ED101C]/45 text-[#FF6B74] hover:text-white text-xs font-bold inline-flex items-center gap-1 transition-all"
                    >
                      <span>{noticesMuralOpen ? 'Fechar aba' : 'Abrir aba'}</span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          noticesMuralOpen ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {!noticesMuralOpen ? (
                  <div className="p-4 rounded-2xl bg-[#0B0D14] border border-white/10 flex items-center justify-between gap-3 text-xs text-white/60">
                    <span>
                      Mural recolhido — <strong className="text-white">{announcements.length}</strong> comunicado(s) ativo(s) no Portal do Aluno.
                    </span>
                    <button
                      type="button"
                      onClick={() => setNoticesMuralOpen(true)}
                      className="text-[#FF6B74] hover:text-white font-bold shrink-0"
                    >
                      Expandir →
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {(showAllNotices ? announcements : announcements.slice(0, 3)).map((com) => {
                        const isTargeted =
                          com.targetType === 'selected' && Array.isArray(com.targetStudentIds);
                        const targetCount = isTargeted ? com.targetStudentIds.length : students.length;
                        const targetText = !isTargeted
                          ? 'Todos os alunos'
                          : targetCount === 1
                          ? `Exclusivo: ${com.targetLabels?.[0] || '1 aluno'}`
                          : `${targetCount} alunos: ${(com.targetLabels || []).slice(0, 2).join(', ')}${
                              targetCount > 2 ? ` +${targetCount - 2}` : ''
                            }`;
                        return (
                          <div
                            key={com.id}
                            className="p-4 sm:p-5 rounded-2xl bg-[#151824] hover:bg-[#1B1F2E] border border-white/10 border-l-4 border-l-[#ED101C] flex items-start justify-between gap-4 transition-all"
                          >
                            <div className="space-y-1.5 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[11px] font-mono font-bold text-[#FF6B74]">
                                  {com.data}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    isTargeted
                                      ? 'bg-amber-500/15 border-amber-400/45 text-amber-300'
                                      : 'bg-sky-500/15 border-sky-400/35 text-sky-300'
                                  }`}
                                >
                                  {isTargeted ? `🎯 ${targetText}` : `👥 ${targetText}`}
                                </span>
                              </div>
                              <h4 className="font-display font-bold text-sm sm:text-base text-white">
                                {com.titulo}
                              </h4>
                              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                                {com.mensagem}
                              </p>
                              {com.autor && (
                                <span className="text-[11px] text-white/45 block pt-1">
                                  Assinado por: {com.autor}
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveAnnouncement(com.id)}
                              className="p-2 rounded-xl bg-white/5 hover:bg-[#ED101C]/25 text-white/60 hover:text-[#FF6B74] shrink-0 transition-colors"
                              title="Remover comunicado"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {announcements.length > 3 && (
                      <button
                        type="button"
                        onClick={() => setShowAllNotices((v) => !v)}
                        className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-bold text-white/85 hover:text-white transition-all"
                      >
                        {showAllNotices
                          ? 'Mostrar menos (ver só os 3 mais recentes) ↑'
                          : `Ver mais ${announcements.length - 3} comunicado(s) antigo(s) ↓`}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* =================================================================
              ABA 7: CERTIFICADOS (200H) — EXPLICAÇÃO CLARA + FILA + EMISSOR A4
          ================================================================= */}
          {activeTab === 'certificados' && (
            <div className="space-y-6">
              {/* Faixa Explicativa Clara das 2 Funções desta Tela */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="admin-glass-card rounded-2xl p-4 sm:p-5 border-l-4 border-l-amber-400 flex items-start gap-3.5">
                  <span className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-amber-300" />
                  </span>
                  <div>
                    <strong className="text-sm text-white block">
                      1. Trava de Autorização (Libera no Portal do Aluno)
                    </strong>
                    <p className="text-xs text-white/65 mt-0.5 leading-relaxed">
                      Quando o aluno conclui 100% das aulas, o diploma <strong className="text-white">não sai sozinho</strong>. Cai aqui pro Cleve conferir Nome/CPF e clicar em <strong className="text-emerald-300">Autorizar ✓</strong> — aí libera na hora no Portal do Aluno!
                    </p>
                  </div>
                </div>
                <div className="admin-glass-card rounded-2xl p-4 sm:p-5 border-l-4 border-l-[#ED101C] flex items-start gap-3.5">
                  <span className="w-10 h-10 rounded-xl bg-[#ED101C]/15 border border-[#ED101C]/40 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-[#FF6B74]" />
                  </span>
                  <div>
                    <strong className="text-sm text-white block">
                      2. Emissor Direto (Impressão na Escola / 2ª Via)
                    </strong>
                    <p className="text-xs text-white/65 mt-0.5 leading-relaxed">
                      Use o emissor abaixo caso queira imprimir o Certificado A4 Frente e Verso em papel couchê na escola ou enviar uma 2ª via em PDF para o aluno.
                    </p>
                  </div>
                </div>
              </div>

              {/* BLOCO 1: SOLICITAÇÕES DE CERTIFICADO AGUARDANDO CONFERÊNCIA DO CLEVE! */}
              <div className="admin-glass-card rounded-3xl p-5 sm:p-6 border border-amber-400/40 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Trava de Segurança — Conferência Obrigatória pelo Diretor</span>
                    </span>
                    <h2 className="font-display font-extrabold text-lg sm:text-xl text-white mt-0.5">
                      Solicitações de Liberação de Certificado ({certRequests.length})
                    </h2>
                    <p className="text-xs text-white/65">
                      Confira se o Nome Completo e o CPF estão corretos (sem apelidos ou erros) antes de autorizar o PDF oficial para o aluno.
                    </p>
                  </div>
                </div>

                {certRequests.length === 0 ? (
                  <p className="text-sm text-white/55 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    Nenhuma solicitação recebida ainda.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {certRequests.map((req) => {
                      const isEditing = editingCertReq?.id === req.id;
                      return (
                        <div
                          key={req.id}
                          className={`p-4 sm:p-5 rounded-2xl border space-y-3 transition-all ${
                            req.status === 'pending'
                              ? 'bg-[#1A120B] border-amber-400/55'
                              : req.status === 'approved'
                              ? 'bg-emerald-950/25 border-emerald-500/40'
                              : 'bg-[#190A0D] border-[#ED101C]/45'
                          }`}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <strong className="text-sm sm:text-base text-white">
                                  {req.studentName}
                                </strong>
                                <span className="font-mono text-xs text-white/70">
                                  CPF: {req.studentCpf}
                                </span>
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                    req.status === 'approved'
                                      ? 'bg-emerald-500/20 text-emerald-300'
                                      : req.status === 'rejected'
                                      ? 'bg-[#ED101C]/20 text-[#FF6B74]'
                                      : 'bg-amber-500/20 text-amber-300'
                                  }`}
                                >
                                  {req.status === 'approved'
                                    ? '✓ Autorizado e Liberado no Portal'
                                    : req.status === 'rejected'
                                    ? 'Devolvido p/ Correção'
                                    : '⏳ Aguardando sua Autorização'}
                                </span>
                              </div>
                              <p className="text-xs text-white/65 mt-1">
                                Solicitado em {req.requestedAt} • Módulos: {req.modulosConcluidos}/11 • Frequência: {req.frequenciaPct}% • Prova Final: {req.notaProvaPct}%
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingCertReq(
                                    isEditing
                                      ? null
                                      : {
                                          id: req.id,
                                          nome: req.studentName,
                                          cpf: req.studentCpf,
                                        }
                                  )
                                }
                                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold inline-flex items-center gap-1.5"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Conferir / Editar Nome</span>
                              </button>

                              {req.status !== 'approved' && (
                                <button
                                  type="button"
                                  onClick={() => handleApproveCertRequest(req)}
                                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold inline-flex items-center gap-1.5"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Autorizar Certificado ✓</span>
                                </button>
                              )}

                              {req.status === 'pending' && (
                                <button
                                  type="button"
                                  onClick={() => handleRejectCertRequest(req)}
                                  className="px-3 py-2 rounded-xl bg-[#ED101C]/20 hover:bg-[#ED101C] border border-[#ED101C]/50 text-[#FF6B74] hover:text-white text-xs font-bold inline-flex items-center gap-1"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Recusar</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Edição Rápida de Nome/CPF antes de Autorizar */}
                          {isEditing && (
                            <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                              <div className="sm:col-span-5">
                                <label className="block text-[11px] font-bold text-white/70 mb-1">
                                  Corrigir Nome Oficial no Diploma
                                </label>
                                <input
                                  type="text"
                                  value={editingCertReq.nome}
                                  onChange={(e) =>
                                    setEditingCertReq({ ...editingCertReq, nome: e.target.value })
                                  }
                                  className="w-full bg-[#0A0B0F] border border-white/20 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-bold uppercase"
                                />
                              </div>
                              <div className="sm:col-span-3">
                                <label className="block text-[11px] font-bold text-white/70 mb-1">
                                  Corrigir CPF
                                </label>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  maxLength={14}
                                  placeholder="000.000.000-00"
                                  value={editingCertReq.cpf}
                                  onChange={(e) =>
                                    setEditingCertReq({
                                      ...editingCertReq,
                                      cpf: formatCpfInput(e.target.value),
                                    })
                                  }
                                  className="w-full bg-[#0A0B0F] border border-white/20 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono"
                                />
                              </div>
                              <div className="sm:col-span-4 flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleApproveCertRequest(
                                      req,
                                      editingCertReq.nome,
                                      editingCertReq.cpf
                                    )
                                  }
                                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold"
                                >
                                  Salvar e Autorizar ✓
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingCertReq(null)}
                                  className="px-3 py-2 rounded-xl bg-white/10 text-white text-xs font-bold"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* BLOCO 2: EMISSOR OFICIAL DIRETO (FRENTE E VERSO 200H) */}
              <div className="admin-glass-card rounded-3xl p-5 sm:p-6 space-y-5">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-white">
                    Emissor Direto — Certificado Oficial Frente e Verso (200h)
                  </h3>
                  <p className="text-xs text-white/60">
                    Preencha ou ajuste os campos abaixo para visualizar ou imprimir qualquer diploma em folha A4 limpa (ideal para 2ª via ou impressão física).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-[#090B10] border border-white/10 p-4 rounded-2xl">
                  <div className="lg:col-span-2">
                    <label className="block text-[11px] font-bold uppercase text-white/65 mb-1">
                      Nome no Diploma
                    </label>
                    <input
                      type="text"
                      value={certEditor.studentName}
                      onChange={(e) =>
                        setCertEditor({ ...certEditor, studentName: e.target.value })
                      }
                      className="w-full bg-[#141722] border border-white/15 focus:border-[#ED101C] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-white/65 mb-1">
                      CPF
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={14}
                      placeholder="000.000.000-00"
                      value={certEditor.studentCpf}
                      onChange={(e) =>
                        setCertEditor({ ...certEditor, studentCpf: formatCpfInput(e.target.value) })
                      }
                      className="w-full bg-[#141722] border border-white/15 focus:border-[#ED101C] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-white/65 mb-1">
                      Período
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="text"
                        value={certEditor.periodStart}
                        onChange={(e) =>
                          setCertEditor({ ...certEditor, periodStart: e.target.value })
                        }
                        className="w-full bg-[#141722] border border-white/15 rounded-lg px-2 py-2.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={certEditor.periodEnd}
                        onChange={(e) =>
                          setCertEditor({ ...certEditor, periodEnd: e.target.value })
                        }
                        className="w-full bg-[#141722] border border-white/15 rounded-lg px-2 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-white/65 mb-1">
                      Data de Emissão
                    </label>
                    <input
                      type="text"
                      value={certEditor.issueDate}
                      onChange={(e) => setCertEditor({ ...certEditor, issueDate: e.target.value })}
                      className="w-full bg-[#141722] border border-white/15 focus:border-[#ED101C] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <OfficialCertificateViewer
                  studentName={certEditor.studentName}
                  studentCpf={certEditor.studentCpf}
                  periodStart={certEditor.periodStart}
                  periodEnd={certEditor.periodEnd}
                  issueDate={certEditor.issueDate}
                  defaultTab="ambos"
                  showPrintButton={true}
                />
              </div>
            </div>
          )}

          {/* =================================================================
              ABA 8: CONFIGURAÇÕES DO ADMINISTRADOR (CENTRALIZADA E PREMIUM!)
          ================================================================= */}
          {activeTab === 'perfil-admin' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <form
                onSubmit={handleSaveAdminProfile}
                className="admin-glass-card rounded-3xl overflow-hidden shadow-2xl"
              >
                {/* Faixa Hero do Perfil do Administrador */}
                <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#280A0F] via-[#151722] to-[#10121B] border-b border-white/10">
                  <div className="pointer-events-none absolute -right-12 -top-12 w-56 h-56 rounded-full bg-[#ED101C]/15 blur-3xl" />
                  <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        {adminProfile.avatarUrl ? (
                          <img
                            src={adminProfile.avatarUrl}
                            alt={adminProfile.nome}
                            className="w-20 h-20 rounded-full object-cover object-top border-2 border-[#ED101C] shadow-[0_0_24px_rgba(237,16,28,0.45)]"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ED101C] to-[#7A070E] border-2 border-[#FF5A65]/60 text-white text-2xl font-display font-extrabold flex items-center justify-center shadow-[0_0_24px_rgba(237,16,28,0.45)]">
                            {adminInitials}
                          </div>
                        )}
                        <span className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#12141E]" />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono font-bold uppercase text-[#FF6B74]">
                          Perfil da Diretoria • BLACK Treinamentos
                        </span>
                        <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                          {adminProfile.nome}
                        </h2>
                        <p className="text-xs sm:text-sm text-emerald-400 font-semibold">
                          ● {adminProfile.cargo}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 shrink-0">
                      <label className="cta-btn-shimmer px-4 py-2.5 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer shadow-red-glow-sm transition-all">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Trocar Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAdminAvatarUpload}
                        />
                      </label>
                      {adminProfile.avatarUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...adminProfile, avatarUrl: '' };
                            setAdminProfile(updated);
                            saveAdminProfile(updated);
                            showToast('Foto removida.', 'info');
                          }}
                          className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-white/80 hover:text-white text-xs font-bold"
                        >
                          Remover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setActiveTab('inicio')}
                        className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white inline-flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Voltar</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Campos Editáveis com Ícones */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-white/75 mb-1.5">
                        Nome do Administrador
                      </label>
                      <input
                        type="text"
                        required
                        value={adminProfile.nome}
                        onChange={(e) => setAdminProfile({ ...adminProfile, nome: e.target.value })}
                        className="w-full bg-[#090B10] border border-white/15 focus:border-[#ED101C] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/75 mb-1.5">
                        Cargo / Assinatura nos Comunicados
                      </label>
                      <input
                        type="text"
                        required
                        value={adminProfile.cargo}
                        onChange={(e) => setAdminProfile({ ...adminProfile, cargo: e.target.value })}
                        className="w-full bg-[#090B10] border border-white/15 focus:border-[#ED101C] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/75 mb-1.5 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#FF6B74]" />
                        <span>E-mail Administrativo</span>
                      </label>
                      <input
                        type="email"
                        value={adminProfile.email}
                        onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                        className="w-full bg-[#090B10] border border-white/15 focus:border-[#ED101C] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/75 mb-1.5 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>WhatsApp da Secretaria</span>
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={15}
                        placeholder="(45) 99999-9999"
                        value={adminProfile.telefone}
                        onChange={(e) =>
                          setAdminProfile({
                            ...adminProfile,
                            telefone: formatPhoneInput(e.target.value),
                          })
                        }
                        className="w-full bg-[#090B10] border border-white/15 focus:border-[#ED101C] rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Prévia ao vivo da assinatura nos Comunicados */}
                  <div className="p-4 rounded-2xl bg-[#0B0D14] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-mono uppercase text-white/50 block">
                        Prévia da sua assinatura nos avisos do Portal do Aluno
                      </span>
                      <strong className="text-sm text-white block mt-0.5">
                        — {adminProfile.nome || 'Cleverson da Cruz'} • {adminProfile.cargo || 'Diretor & Coordenador'}
                      </strong>
                    </div>
                    <button
                      type="submit"
                      className="cta-btn-shimmer px-6 py-3 rounded-xl bg-gradient-to-r from-[#ED101C] to-[#C80B15] hover:brightness-110 text-white text-sm font-extrabold inline-flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(237,16,28,0.4)] transition-all hover:-translate-y-0.5 shrink-0"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Salvar Configurações</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* MODAL DE PRONTUÁRIO COMPLETO DO ALUNO (COCKPIT INDIVIDUAL + SENHA + ATALHOS) */}
      {dossierStudent && (() => {
        const currentDossier = students.find((st) => st.id === dossierStudent.id) || dossierStudent;
        const initials = (currentDossier.nome || 'AL')
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((w) => w[0])
          .join('')
          .toUpperCase();
        const isApto = (currentDossier.progressoPct || 0) >= 100 && (currentDossier.frequenciaPct || 0) >= 75;
        const pwdStatus = validateStrongPassword(dossierPwdDraft);

        return (
          <div
            className="fixed inset-0 z-[95] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Prontuário completo do aluno"
            onClick={() => setDossierStudent(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="admin-tab-enter w-full max-w-2xl my-auto rounded-3xl bg-[#0D0F16] border border-[#ED101C]/50 shadow-[0_24px_75px_rgba(0,0,0,0.92),0_0_40px_rgba(237,16,28,0.2)] p-5 sm:p-7 space-y-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ED101C] to-[#7D060D] border-2 border-[#FF7A83]/60 text-white text-lg font-display font-extrabold flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(237,16,28,0.35)]">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#ED101C]/20 border border-[#ED101C]/45 text-[#FF8C93] text-[10px] font-mono font-bold uppercase">
                        Prontuário Oficial • APH 200h
                      </span>
                      {isApto && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[10px] font-bold">
                          ★ Apto ao Certificado
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-extrabold text-lg sm:text-xl text-white mt-1 truncate">
                      {currentDossier.nome}
                    </h3>
                    <span className="text-xs text-white/60 font-mono block">
                      CPF {currentDossier.cpf} • {currentDossier.turma || 'Turma 13/02/2027'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDossierStudent(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-[#ED101C] text-white transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 3 Indicadores do Prontuário */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#141722] border border-white/10">
                  <span className="text-[11px] text-white/55 block">Progresso 200h</span>
                  <strong className="font-display font-extrabold text-xl text-white block mt-0.5">
                    {currentDossier.progressoPct}%
                  </strong>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#141722] border border-white/10">
                  <span className="text-[11px] text-white/55 block">Frequência</span>
                  <strong
                    className={`font-display font-extrabold text-xl block mt-0.5 ${
                      currentDossier.frequenciaPct >= 75 ? 'text-emerald-400' : 'text-amber-300'
                    }`}
                  >
                    {currentDossier.frequenciaPct}%
                  </strong>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#141722] border border-white/10">
                  <span className="text-[11px] text-white/55 block">Parcelas 10x</span>
                  <strong
                    className={`font-display font-extrabold text-xl block mt-0.5 ${
                      currentDossier.statusFinanceiro === 'Em dia' ? 'text-emerald-300' : 'text-[#FF6B74]'
                    }`}
                  >
                    {currentDossier.parcelasPagas}/{currentDossier.parcelasTotal}
                  </strong>
                </div>
              </div>

              {/* Contato + Atalhos Rápidos */}
              <div className="p-4 rounded-2xl bg-[#12141E] border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-white/50 block">E-mail de Acesso</span>
                  <strong className="text-white font-semibold block mt-0.5 break-all">
                    {currentDossier.email || 'Não informado'}
                  </strong>
                </div>
                <div>
                  <span className="text-white/50 block">WhatsApp / Matrícula</span>
                  <strong className="text-white font-semibold block mt-0.5">
                    {currentDossier.telefone} • Desde {currentDossier.dataMatricula || '13/02/2027'}
                  </strong>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setDossierStudent(null);
                    setSelectedFinanceStudentId(currentDossier.id);
                    setFinanceSubTab('boletos');
                    setActiveTab('financeiro');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-bold flex flex-col items-center gap-1.5 transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Financeiro 10x</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDossierStudent(null);
                    setNoticeTargetMode('selected');
                    setSelectedNoticeStudentIds([currentDossier.id]);
                    setActiveTab('comunicados');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3 rounded-xl bg-sky-500/15 hover:bg-sky-600 border border-sky-400/40 text-sky-300 hover:text-white text-xs font-bold flex flex-col items-center gap-1.5 transition-all"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Aviso Exclusivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDossierStudent(null);
                    setCertEditor((prev) => ({
                      ...prev,
                      studentName: currentDossier.nome,
                      studentCpf: currentDossier.cpf,
                    }));
                    setActiveTab('certificados');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3 rounded-xl bg-amber-500/15 hover:bg-[#ED101C] border border-amber-400/40 hover:border-[#ED101C] text-amber-300 hover:text-white text-xs font-bold flex flex-col items-center gap-1.5 transition-all"
                >
                  <Award className="w-4 h-4" />
                  <span>Diploma 200h</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDossierStudent(null);
                    setEditingStudent({ ...currentDossier });
                  }}
                  className="p-3 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/15 text-white text-xs font-bold flex flex-col items-center gap-1.5 transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Corrigir Dados</span>
                </button>
              </div>

              {/* Redefinir Senha de Acesso pelo Admin */}
              <div className="p-4 rounded-2xl bg-[#12141E] border border-white/10 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white inline-flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#FF5A65]" />
                    <span>Redefinir Senha de Acesso do Aluno</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const cpfDigits = String(currentDossier.cpf || '').replace(/\D/g, '').slice(-4) || '2027';
                      setDossierPwdDraft(`Black@${cpfDigits}`);
                    }}
                    className="text-[11px] font-bold text-[#FF6B74] hover:text-white underline"
                  >
                    Gerar senha padrão forte
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={dossierPwdDraft}
                    onChange={(e) => setDossierPwdDraft(e.target.value)}
                    placeholder="Ex: Black@3900 (6+ dígitos, 1 maiúscula e 1 especial)"
                    className="flex-1 bg-[#090B10] border border-white/15 focus:border-[#ED101C] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={!pwdStatus.valid}
                    onClick={() => {
                      saveCustomStudentPassword(currentDossier.id, dossierPwdDraft);
                      showToast(`Nova senha definida para ${currentDossier.nome}: ${dossierPwdDraft.trim()} ✓`);
                      setDossierPwdDraft('');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] disabled:opacity-45 text-white text-xs font-bold shrink-0 transition-all"
                  >
                    Aplicar Nova Senha
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
                {currentDossier.id !== 'demo-student-001' ? (
                  confirmRemoveStudentId === currentDossier.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveStudent(currentDossier.id)}
                        className="px-3.5 py-2 rounded-xl bg-[#ED101C] text-white text-xs font-extrabold"
                      >
                        Confirmar Exclusão
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmRemoveStudentId(null)}
                        className="px-3 py-2 rounded-xl bg-white/10 text-white text-xs font-bold"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmRemoveStudentId(currentDossier.id)}
                      className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-[#ED101C]/20 border border-white/10 hover:border-[#ED101C]/50 text-white/65 hover:text-[#FF8C93] text-xs font-bold inline-flex items-center gap-1.5 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remover Matrícula</span>
                    </button>
                  )
                ) : (
                  <span className="text-[11px] text-white/45 font-mono">
                    Matrícula principal de demonstração
                  </span>
                )}

                <a
                  href={getStudentWhatsAppUrl(
                    currentDossier.telefone,
                    `Olá ${currentDossier.nome}! Aqui é a Coordenação da BLACK Treinamentos (Curso APH 200h).`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all"
                  title={`Chamar ${currentDossier.nome} no WhatsApp (${currentDossier.telefone})`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Chamar no WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL DE EDIÇÃO DE DADOS OFICIAIS DO ALUNO (NOME / CPF DO DIPLOMA) */}
      {editingStudent && (
        <div
          className="fixed inset-0 z-[95] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <form
            onSubmit={handleSaveStudentEdit}
            className="w-full max-w-md rounded-3xl bg-[#12131A] border border-white/15 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-extrabold text-lg text-white">
                Editar Dados Oficiais do Aluno
              </h3>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-[#ED101C] text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-white/75 mb-1">
                  Nome Completo (Diploma)
                </label>
                <input
                  type="text"
                  required
                  value={editingStudent.nome}
                  onChange={(e) => setEditingStudent({ ...editingStudent, nome: e.target.value })}
                  className="w-full bg-[#0A0B0F] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white uppercase font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/75 mb-1">CPF</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={14}
                  placeholder="000.000.000-00"
                  required
                  value={editingStudent.cpf}
                  onChange={(e) =>
                    setEditingStudent({ ...editingStudent, cpf: formatCpfInput(e.target.value) })
                  }
                  className="w-full bg-[#0A0B0F] border border-white/15 focus:border-[#ED101C] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none"
                />
                <span className="text-[10.5px] text-white/45 block mt-1">
                  Formato automático: 000.000.000-00 (11 dígitos)
                </span>
              </div>
              <div>
                <label className="block text-xs font-bold text-white/75 mb-1">WhatsApp</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={15}
                  placeholder="(45) 99999-9999"
                  value={editingStudent.telefone}
                  onChange={(e) =>
                    setEditingStudent({
                      ...editingStudent,
                      telefone: formatPhoneInput(e.target.value),
                    })
                  }
                  className="w-full bg-[#0A0B0F] border border-white/15 focus:border-[#ED101C] rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none"
                />
                <span className="text-[10.5px] text-white/45 block mt-1">
                  Somente números • Formato automático: (45) 99999-9999
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs font-bold text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-xs font-bold text-white"
              >
                Salvar e Sincronizar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO DE ALUNO */}
      {deleteTargetStudent && (
        <div
          className="fixed inset-0 z-[97] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar exclusão de aluno"
          onClick={() => setDeleteTargetStudent(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="admin-tab-enter w-full max-w-md rounded-3xl bg-[#0D0F16] border border-[#ED101C]/60 shadow-[0_24px_75px_rgba(0,0,0,0.92),0_0_40px_rgba(237,16,28,0.22)] p-6 space-y-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#ED101C]/20 border border-[#ED101C]/50 text-[#FF5A65] flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-white">
                  Excluir Matrícula do Aluno?
                </h3>
                <p className="text-xs text-white/65 mt-1 leading-relaxed">
                  Você está prestes a remover{' '}
                  <strong className="text-white">{deleteTargetStudent.nome}</strong> (CPF{' '}
                  <span className="font-mono text-white/85">{deleteTargetStudent.cpf}</span>) da lista da Turma APH 200h.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setDeleteTargetStudent(null)}
                className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/15 text-xs font-bold text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleRemoveStudent(deleteTargetStudent.id)}
                className="px-5 py-2.5 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-xs font-extrabold text-white inline-flex items-center gap-1.5 shadow-red-glow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sim, Excluir Aluno</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE REGISTRO / EDIÇÃO DE PAGAMENTO (PIX, CARTÃO, DINHEIRO, DATA E HORÁRIO) */}
      {paymentModalState && (
        <div
          className="fixed inset-0 z-[96] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Registrar ou editar pagamento da parcela"
          onClick={() => setPaymentModalState(null)}
        >
          <form
            onSubmit={handleSavePaymentModal}
            onClick={(e) => e.stopPropagation()}
            className="admin-tab-enter w-full max-w-lg my-auto rounded-3xl bg-[#0D0F16] border border-[#ED101C]/50 shadow-[0_24px_75px_rgba(0,0,0,0.92),0_0_40px_rgba(237,16,28,0.2)] p-5 sm:p-6 space-y-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FF6B74] block">
                  Financeiro • {selectedFinanceStudent.nome}
                </span>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-white mt-0.5">
                  Parcela {String(paymentModalState.numero).padStart(2, '0')}/10 — {paymentModalState.valor}
                </h3>
                <span className="text-xs text-white/55 block mt-0.5">
                  Vencimento original: {paymentModalState.vencimento}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPaymentModalState(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-[#ED101C] text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. Situação da Parcela */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                1. Situação da Parcela
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'paga', label: '✓ Paga', activeCls: 'bg-emerald-500/20 border-emerald-400 text-emerald-300' },
                  { id: 'aberta', label: 'Em aberto', activeCls: 'bg-amber-500/20 border-amber-400 text-amber-300' },
                  { id: 'atrasada', label: '⚠ Atrasada', activeCls: 'bg-[#ED101C]/20 border-[#ED101C] text-[#FF8C93]' },
                  { id: 'futura', label: 'A vencer', activeCls: 'bg-sky-500/20 border-sky-400 text-sky-300' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setPaymentModalState((prev) => ({ ...prev, status: st.id }))}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      paymentModalState.status === st.id
                        ? st.activeCls
                        : 'bg-[#141722] border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Se PAGA: Forma de Pagamento, Data, Horário e Recebedor */}
            {paymentModalState.status === 'paga' && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                    2. Como o aluno pagou?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'PIX', icon: Smartphone },
                      { id: 'Cartão de Crédito', icon: CreditCard },
                      { id: 'Cartão de Débito', icon: CreditCard },
                      { id: 'Dinheiro', icon: Banknote },
                      { id: 'Boleto Bancário', icon: FileText },
                    ].map((opt) => {
                      const OptIcon = opt.icon;
                      const selected = paymentModalState.metodo === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setPaymentModalState((prev) => ({ ...prev, metodo: opt.id }))
                          }
                          className={`py-2.5 px-3 rounded-xl border text-xs font-bold inline-flex items-center justify-center gap-2 transition-all ${
                            selected
                              ? 'bg-[#ED101C] border-[#FF7A83] text-white shadow-red-glow-sm'
                              : 'bg-[#141722] border-white/10 hover:border-white/25 text-white/75 hover:text-white'
                          }`}
                        >
                          <OptIcon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{opt.id}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                      3. Data do Pagamento *
                    </label>
                    <input
                      type="date"
                      required
                      value={paymentModalState.pagoDataISO}
                      onChange={(e) =>
                        setPaymentModalState((prev) => ({ ...prev, pagoDataISO: e.target.value }))
                      }
                      className="w-full bg-[#141722] border border-white/15 focus:border-[#ED101C] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                      4. Horário Exato *
                    </label>
                    <input
                      type="time"
                      required
                      value={paymentModalState.pagoHora}
                      onChange={(e) =>
                        setPaymentModalState((prev) => ({ ...prev, pagoHora: e.target.value }))
                      }
                      className="w-full bg-[#141722] border border-white/15 focus:border-[#ED101C] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                      Recebido por / Responsável
                    </label>
                    <input
                      type="text"
                      value={paymentModalState.recebidoPor}
                      onChange={(e) =>
                        setPaymentModalState((prev) => ({ ...prev, recebidoPor: e.target.value }))
                      }
                      placeholder="Ex: Cleverson da Cruz"
                      className="w-full bg-[#141722] border border-white/15 focus:border-[#ED101C] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                      Observação (opcional)
                    </label>
                    <input
                      type="text"
                      value={paymentModalState.observacaoPagamento}
                      onChange={(e) =>
                        setPaymentModalState((prev) => ({
                          ...prev,
                          observacaoPagamento: e.target.value,
                        }))
                      }
                      placeholder="Ex: Pago na secretaria em dinheiro"
                      className="w-full bg-[#141722] border border-white/15 focus:border-[#ED101C] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setPaymentModalState(null)}
                className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs font-bold text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-xs sm:text-sm font-extrabold text-white inline-flex items-center gap-2 shadow-red-glow-sm transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Salvar e Atualizar Aluno</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL DE COMPROVANTE OFICIAL DE PAGAMENTO (CARD BLACK TREINAMENTOS) */}
      <PaymentReceiptModal
        parcela={receiptModalParcela}
        studentName={selectedFinanceStudent.nome}
        studentCpf={selectedFinanceStudent.cpf}
        onClose={() => setReceiptModalParcela(null)}
      />

      {/* MODAL DE VISUALIZAÇÃO DE ATESTADO / BOLETO (PDF OU IMAGEM) */}
      {previewAttachment && (() => {
        const isPdf =
          previewAttachment.type?.toLowerCase().includes('pdf') ||
          previewAttachment.name?.toLowerCase().endsWith('.pdf');
        return (
          <div
            className="fixed inset-0 z-[95] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-3xl bg-[#12131A] border border-white/15 rounded-3xl overflow-hidden shadow-2xl">
              <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between gap-3">
                <strong className="text-sm text-white truncate">Anexo: {previewAttachment.name}</strong>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={previewAttachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold inline-flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Abrir em Nova Aba</span>
                  </a>
                  <a
                    href={previewAttachment.url}
                    download={previewAttachment.name}
                    className="px-3 py-1.5 rounded-lg bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs font-bold inline-flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar</span>
                  </a>
                  <button
                    type="button"
                    onClick={closePreviewAttachment}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-[#ED101C] text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 bg-black flex justify-center max-h-[78vh] overflow-auto">
                {isPdf ? (
                  <iframe
                    src={previewAttachment.url}
                    title={previewAttachment.name}
                    className="w-full h-[72vh] rounded-xl bg-white"
                  />
                ) : (
                  <img
                    src={previewAttachment.url}
                    alt={previewAttachment.name}
                    className="max-h-[72vh] w-auto object-contain rounded-xl"
                  />
                )}
              </div>
            </div>
          </div>
        );
      })()}
      {/* BARRA INFERIOR NATIVA ESTILO APP NO CELULAR / TABLET (< LG) */}
      <nav
        className="lg:hidden fixed bottom-3 left-3 right-3 z-40 bg-[#0D0E14]/95 backdrop-blur-xl border border-[#ED101C]/45 rounded-2xl px-1.5 py-1.5 grid grid-cols-5 gap-1 shadow-[0_12px_35px_rgba(0,0,0,0.9)]"
        aria-label="Navegação rápida mobile do Administrador"
      >
        {[
          { id: 'inicio', label: 'Início', icon: Home },
          { id: 'alunos', label: 'Alunos', icon: Users },
          { id: 'presenca', label: 'Presença', icon: CalendarCheck, badge: pendingJustifications.length },
          { id: 'financeiro', label: 'Boletos', icon: CreditCard, badge: openInstallmentsCount },
          { id: 'comunicados', label: 'Avisos', icon: Megaphone },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
                active ? 'text-[#ED101C] bg-[#ED101C]/12' : 'text-white/65'
              }`}
            >
              <div className="relative">
                <Icon className="w-4 h-4" />
                {tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[14px] h-[14px] px-1 rounded-full bg-[#ED101C] text-white text-[9px] font-extrabold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold mt-0.5 leading-none">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
