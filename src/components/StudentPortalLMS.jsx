import React, { useState, useMemo, useEffect } from 'react';
import {
  Home,
  BookOpen,
  Calendar as CalendarIcon,
  Award,
  CreditCard,
  Headphones,
  Search,
  Play,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Clock,
  FileText,
  Download,
  X,
  Phone,
  MapPin,
  Copy,
  Lock,
  Unlock,
  LogOut,
  StickyNote,
  Video,
  UserCheck,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bell,
  ClipboardList,
  CheckSquare,
  User,
  Paperclip,
  Printer,
  ShieldCheck,
  Send,
  Trophy,
  Trash2,
  Camera,
  ExternalLink,
} from 'lucide-react';
import { BRAND_CONFIG, getWhatsAppUrl } from '../data/blackData';
import {
  FREQUENCIA_PRESENCIAL_DEMO,
  QUIZ_QUESTIONS_200H,
} from '../data/courseContent200h';
import {
  getCourseCatalog200h,
  loadCourseModules200h,
  loadStudentSession,
  saveStudentSession,
  loadStudentProgress,
  saveStudentProgress,
  loadModuleNotes,
  saveModuleNotes,
  loadAbsenceJustifications,
  saveAbsenceJustifications,
  loadAnnouncements,
  loadReadNoticeIds,
  saveReadNoticeIds,
  loadStudentInstallments,
  loadStudentAvatar,
  saveStudentAvatar,
  loadCertificateRequests,
  saveCertificateRequests,
  getStudentCertificateRequest,
  logoutStudent,
} from '../services/lmsContentService';
import {
  saveFileToVault,
  loadFileUrlFromVault,
  deleteFileFromVault,
} from '../services/localFileVault';
import OfficialCertificateViewer from './OfficialCertificateViewer';
import StudentLoginScreen from './StudentLoginScreen';
import GlassCourseCalendar, { getFirstClassDayInMonth } from './GlassCourseCalendar';
import PaymentReceiptModal from './PaymentReceiptModal';

export default function StudentPortalLMS({ onBackToLanding }) {
  const catalog = useMemo(() => getCourseCatalog200h(), []);
  const { curso, atividadesIniciais } = catalog;
  const [modulos, setModulos] = useState(() => loadCourseModules200h());
  const [announcements, setAnnouncements] = useState(() => loadAnnouncements());

  // Sessão do Aluno
  const [session, setSession] = useState(() => loadStudentSession());
  const [certRequest, setCertRequest] = useState(() =>
    getStudentCertificateRequest(loadStudentSession()?.id || 'demo-student-001')
  );

  // Navegação ULTRA-LIMPA: apenas 6 destinos principais (+ Perfil pelo avatar no topo)
  // 'inicio' | 'aulas' | 'agenda' | 'certificado' | 'financeiro' | 'ajuda' | 'perfil'
  const [activeNav, setActiveNav] = useState('inicio');

  // Sub-abas internas (mantêm tudo acessível sem poluir a barra lateral!)
  const [aulasSubTab, setAulasSubTab] = useState('modulos'); // 'modulos' | 'materiais' | 'atividades' | 'avaliacao'
  const [agendaSubTab, setAgendaSubTab] = useState('calendario'); // 'calendario' | 'frequencia'

  // Tela dedicada de Sala de Aula (sem modal preso que corta o topo!)
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(null);
  const [activeAulaIndex, setActiveAulaIndex] = useState(0);
  const [classroomTab, setClassroomTab] = useState('resumo'); // 'resumo' | 'materiais' | 'anotacoes'

  // Filtros e Progresso Persistente
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('todos'); // 'todos' | 'pendentes' | 'concluidos'
  const [progressState, setProgressState] = useState(() => loadStudentProgress());
  const [moduleNotes, setModuleNotes] = useState(() => loadModuleNotes());
  const [activities, setActivities] = useState(atividadesIniciais);
  const [readNoticeIds, setReadNoticeIds] = useState(() =>
    loadReadNoticeIds(loadStudentSession()?.id || 'demo-student-001')
  );
  const [openedNoticeId, setOpenedNoticeId] = useState(null);
  const [noticesPulse, setNoticesPulse] = useState(false);

  // Avaliação Final (agora tela própria limpa com botão ← Voltar + Popup central!)
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [quizModal, setQuizModal] = useState(null); // { type: 'missing' | 'passed' | 'failed', ... }
  const [showCertPreviewMode, setShowCertPreviewMode] = useState(false);

  // Justificativa de Faltas (Presencial aos Sábados)
  const [justifications, setJustifications] = useState(() => loadAbsenceJustifications());
  const [confirmDeleteJustId, setConfirmDeleteJustId] = useState(null);
  const [showJustifyForm, setShowJustifyForm] = useState(false);
  const [justifyDate, setJustifyDate] = useState('2027-03-13');
  const [showJustifyDatePicker, setShowJustifyDatePicker] = useState(false);
  const [justifyPickerYear, setJustifyPickerYear] = useState(2027);
  const [justifyPickerMonth, setJustifyPickerMonth] = useState(2); // Mar/2027
  const [justifyReason, setJustifyReason] = useState('Atestado Médico');
  const [justifyDetails, setJustifyDetails] = useState('');
  const [justifyFileId, setJustifyFileId] = useState('');
  const [justifyFileName, setJustifyFileName] = useState('');
  const [justifyFileSize, setJustifyFileSize] = useState('');
  const [justifyFileType, setJustifyFileType] = useState('');
  const [justifyFileDataUrl, setJustifyFileDataUrl] = useState('');
  const [previewAttachment, setPreviewAttachment] = useState(null);

  // Financeiro (Parcelas + Boletos enviados pelo Admin + Antecipação + Comprovante Oficial)
  const [installments, setInstallments] = useState(() => loadStudentInstallments());
  const [advanceParcela, setAdvanceParcela] = useState(null);
  const [receiptModalParcela, setReceiptModalParcela] = useState(null);

  // Foto de Perfil Opcional (persistida por aluno mesmo se deslogar)
  const [avatarUrl, setAvatarUrl] = useState(() =>
    loadStudentAvatar(loadStudentSession()?.id || 'demo-student-001')
  );

  // Calendário Livre (rola passado, presente e futuro; destaca os 8 meses do curso)
  const [calYear, setCalYear] = useState(2027);
  const [calMonth, setCalMonth] = useState(1); // Fev/2027
  const [selectedDateKey, setSelectedDateKey] = useState('2027-02-13');

  // Toast elegante (zero alert() feio)
  const [toast, setToast] = useState(null);

  const showToast = (message, tone = 'info') => {
    setToast({ message, tone });
  };

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3400);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    saveStudentProgress(progressState);
  }, [progressState]);

  useEffect(() => {
    saveModuleNotes(moduleNotes);
  }, [moduleNotes]);

  useEffect(() => {
    saveAbsenceJustifications(justifications);
  }, [justifications]);

  useEffect(() => {
    if (session?.id) {
      setReadNoticeIds(loadReadNoticeIds(session.id));
      setAvatarUrl(loadStudentAvatar(session.id));
    }
  }, [session?.id]);

  useEffect(() => {
    if (session?.id) {
      saveReadNoticeIds(session.id, readNoticeIds);
    }
  }, [session?.id, readNoticeIds]);

  // Sincroniza tudo com o Painel Admin (boletos, aulas 200h, comunicados, atestados e autorização de certificado!)
  useEffect(() => {
    const syncFromAdmin = () => {
      setInstallments(loadStudentInstallments());
      setModulos(loadCourseModules200h());
      setAnnouncements(loadAnnouncements());
      setJustifications(loadAbsenceJustifications());
      const latestSession = loadStudentSession();
      if (latestSession?.id) {
        setCertRequest(getStudentCertificateRequest(latestSession.id));
        if (session && (latestSession.nome !== session.nome || latestSession.cpf !== session.cpf)) {
          setSession(latestSession);
        }
      }
    };
    syncFromAdmin();
    window.addEventListener('focus', syncFromAdmin);
    window.addEventListener('storage', syncFromAdmin);
    return () => {
      window.removeEventListener('focus', syncFromAdmin);
      window.removeEventListener('storage', syncFromAdmin);
    };
  }, [activeNav, session?.id]);

  const financeSummary = useMemo(() => {
    const pagas = installments.filter((p) => p.status === 'paga');
    const abertas = installments.filter((p) => p.status === 'aberta' || p.status === 'atrasada');
    const atrasadas = installments.filter((p) => p.status === 'atrasada');
    const futuras = installments.filter((p) => p.status === 'futura');
    const sum = (arr) => arr.reduce((acc, p) => acc + (p.valorCentavos || 18000), 0);
    return {
      pagasCount: pagas.length,
      pagasTotal: sum(pagas),
      abertasCount: abertas.length,
      abertasTotal: sum(abertas),
      atrasadasCount: atrasadas.length,
      futurasCount: futuras.length,
      futurasTotal: sum(futuras),
      boletosAnexadosCount: installments.filter((p) => Boolean(p.boletoFileId || p.boletoNome)).length,
    };
  }, [installments]);

  // Filtra comunicados para exibir apenas avisos gerais ("all") OU direcionados especificamente a este aluno!
  const visibleAnnouncements = useMemo(() => {
    const sid = session?.id || 'demo-student-001';
    return announcements.filter(
      (com) =>
        !com.targetType ||
        com.targetType === 'all' ||
        (Array.isArray(com.targetStudentIds) && com.targetStudentIds.includes(sid))
    );
  }, [announcements, session?.id]);

  const unreadNotices = useMemo(
    () => visibleAnnouncements.filter((com) => !readNoticeIds.includes(com.id)).length,
    [visibleAnnouncements, readNoticeIds]
  );

  const completedModuleIds = progressState.completedModuleIds || [];
  const completedLessonIds = progressState.completedLessonIds || [];
  const quizPassed = Boolean(progressState.quizPassed);

  const progressStats = useMemo(() => {
    const totalHours = modulos.reduce((acc, m) => acc + m.cargaHorariaHoras, 0);
    const completedHours = modulos.reduce(
      (acc, m) => (completedModuleIds.includes(m.modulo) ? acc + m.cargaHorariaHoras : acc),
      0
    );
    const completedCount = completedModuleIds.length;
    const totalCount = modulos.length;
    const pct = totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0;
    const nextIdx = modulos.findIndex((m) => !completedModuleIds.includes(m.modulo));
    const attendanceOk = FREQUENCIA_PRESENCIAL_DEMO.percentualAtual >= curso.frequenciaMinimaPct;
    const modulesOk = completedCount === totalCount;
    const requirementsMet = modulesOk && attendanceOk && quizPassed;
    const certificateAuthorized = certRequest?.status === 'approved';

    return {
      totalHours,
      completedHours,
      completedCount,
      totalCount,
      pct,
      nextModuleIndex: nextIdx === -1 ? totalCount - 1 : nextIdx,
      nextModule: nextIdx === -1 ? modulos[totalCount - 1] : modulos[nextIdx],
      attendanceOk,
      modulesOk,
      requirementsMet,
      certificateUnlocked: requirementsMet && certificateAuthorized,
    };
  }, [modulos, completedModuleIds, quizPassed, curso.frequenciaMinimaPct, certRequest?.status]);

  const allMaterials200h = useMemo(
    () =>
      modulos.flatMap((mod) =>
        mod.materiais.map((mat) => ({
          ...mat,
          moduloNumero: mod.modulo,
          moduloTitulo: mod.titulo,
        }))
      ),
    [modulos]
  );

  // Tela de Login se o aluno ainda não entrou
  if (!session) {
    return (
      <StudentLoginScreen
        onBackToLanding={onBackToLanding}
        onLoginSuccess={(newSession) => {
          setSession(newSession);
          showToast(`Bem-vindo(a), ${newSession.nome}!`, 'success');
        }}
      />
    );
  }

  const firstName = (session.nome || 'Aluno').trim().split(' ')[0];

  const navigateTo = (navId, subTab = null) => {
    setSelectedModuleIndex(null); // sempre sai da sala de aula ao trocar de seção
    setActiveNav(navId);
    if (navId === 'aulas' && subTab) setAulasSubTab(subTab);
    if (navId === 'agenda' && subTab) setAgendaSubTab(subTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenNotice = (noticeId) => {
    setOpenedNoticeId((prev) => (prev === noticeId ? null : noticeId));
    if (!readNoticeIds.includes(noticeId)) {
      const next = [...readNoticeIds, noticeId];
      setReadNoticeIds(next);
      if (session?.id) saveReadNoticeIds(session.id, next);
      const remaining = visibleAnnouncements.filter((c) => !next.includes(c.id)).length;
      showToast(
        remaining > 0
          ? `Notificação lida ✓ (${remaining} ${remaining === 1 ? 'nova restante' : 'novas restantes'})`
          : 'Todas as notificações foram lidas ✓',
        'success'
      );
    }
  };

  const handleMarkAllNoticesRead = () => {
    const allIds = visibleAnnouncements.map((c) => c.id);
    setReadNoticeIds(allIds);
    if (session?.id) saveReadNoticeIds(session.id, allIds);
    showToast('Todas as notificações foram marcadas como lidas ✓', 'success');
  };

  const handleRequestCertificateRelease = () => {
    const allReqs = loadCertificateRequests();
    const existing = allReqs.find((r) => r.studentId === session.id);
    const updatedEntry = {
      id: existing?.id || `cert-req-${Date.now()}`,
      studentId: session.id,
      studentName: (session.nome || 'ALUNO').trim().toUpperCase(),
      studentCpf: session.cpf || '',
      turma: curso.turma,
      modulosConcluidos: progressStats.completedCount,
      frequenciaPct: FREQUENCIA_PRESENCIAL_DEMO.percentualAtual,
      notaProvaPct: progressState.quizBestPct || 100,
      status: 'pending',
      requestedAt: new Date().toLocaleDateString('pt-BR'),
      reviewedAt: '',
      reviewerNote: '',
    };

    const nextList = existing
      ? allReqs.map((r) => (r.studentId === session.id ? updatedEntry : r))
      : [updatedEntry, ...allReqs];

    saveCertificateRequests(nextList);
    setCertRequest(updatedEntry);
    showToast(
      'Solicitação enviada para a Coordenação (Cleverson da Cruz)! Assim que conferirmos seu nome e CPF, seu Certificado Oficial será liberado aqui ✓',
      'success'
    );
  };

  const openModuleClassroom = (modIdx, aulaIdx = 0) => {
    setActiveNav('aulas');
    setSelectedModuleIndex(modIdx);
    setActiveAulaIndex(aulaIdx);
    setClassroomTab('resumo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logoutStudent();
    setSession(null);
  };

  const updateProfileField = (field, value) => {
    const updated = { ...session, [field]: value };
    setSession(updated);
    saveStudentSession(updated);
  };

  const handleAvatarUpload = (e) => {
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
        setAvatarUrl(compressed);
        if (session?.id) saveStudentAvatar(session.id, compressed);
        showToast('Foto de perfil atualizada com sucesso ✓', 'success');
      };
      img.src = typeof reader.result === 'string' ? reader.result : '';
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
    if (session?.id) saveStudentAvatar(session.id, '');
    showToast('Foto de perfil removida.', 'info');
  };

  const studentInitials = (session.nome || 'AL')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

  const toggleModuleCompleted = (moduloId) => {
    const targetMod = modulos.find((m) => m.modulo === moduloId);
    const modLessonIds = targetMod ? targetMod.aulas.map((a) => a.id) : [];

    setProgressState((prev) => {
      const prevMods = prev.completedModuleIds || [];
      const prevLessons = prev.completedLessonIds || [];
      const exists = prevMods.includes(moduloId);

      const nextMods = exists
        ? prevMods.filter((id) => id !== moduloId)
        : [...prevMods, moduloId];

      const nextLessons = exists
        ? prevLessons.filter((id) => !modLessonIds.includes(id))
        : Array.from(new Set([...prevLessons, ...modLessonIds]));

      return { ...prev, completedModuleIds: nextMods, completedLessonIds: nextLessons };
    });
  };

  const toggleLessonCompleted = (mod, lessonId) => {
    const modLessonIds = mod.aulas.map((a) => a.id);
    const currentlyDone = completedLessonIds.includes(lessonId);
    const nextLessons = currentlyDone
      ? completedLessonIds.filter((id) => id !== lessonId)
      : [...completedLessonIds, lessonId];

    const allModLessonsDone = modLessonIds.every((id) => nextLessons.includes(id));
    const prevMods = completedModuleIds;
    const nextMods = allModLessonsDone
      ? Array.from(new Set([...prevMods, mod.modulo]))
      : prevMods.filter((id) => id !== mod.modulo);

    setProgressState((prev) => ({
      ...prev,
      completedLessonIds: nextLessons,
      completedModuleIds: nextMods,
    }));

    if (!currentlyDone && allModLessonsDone) {
      showToast(`Parabéns! Você concluiu todas as aulas do Módulo ${mod.modulo}!`, 'success');
    } else if (!currentlyDone) {
      showToast('Aula marcada como concluída ✓', 'success');
    }
  };

  const handlePrevLesson = () => {
    if (selectedModuleIndex === null || !activeModule) return;
    if (activeAulaIndex > 0) {
      setActiveAulaIndex(activeAulaIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (selectedModuleIndex > 0) {
      const prevMod = modulos[selectedModuleIndex - 1];
      setSelectedModuleIndex(selectedModuleIndex - 1);
      setActiveAulaIndex(Math.max(0, prevMod.aulas.length - 1));
      setClassroomTab('resumo');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextLesson = () => {
    if (selectedModuleIndex === null || !activeModule) return;
    if (activeAulaIndex < activeModule.aulas.length - 1) {
      setActiveAulaIndex(activeAulaIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (selectedModuleIndex < modulos.length - 1) {
      setSelectedModuleIndex(selectedModuleIndex + 1);
      setActiveAulaIndex(0);
      setClassroomTab('resumo');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigateTo('aulas', 'avaliacao');
      showToast('Você chegou ao final dos 11 módulos! Agora pode realizar a Avaliação Final.', 'info');
    }
  };

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
        // segue para fallback
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
    showToast(
      'Este boleto foi anexado antes da atualização. Peça à coordenação para reanexá-lo no Painel Admin.',
      'info'
    );
  };

  const handleJustifyFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const kb = Math.max(1, Math.round(file.size / 1024));
    const sizeLabel = kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
    const inferredType =
      file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/png');
    const fileId = `just-file-${Date.now()}`;

    try {
      if (justifyFileId) {
        await deleteFileFromVault(justifyFileId);
      }
      await saveFileToVault(fileId, file);
      setJustifyFileId(fileId);
      setJustifyFileName(file.name);
      setJustifyFileSize(sizeLabel);
      setJustifyFileType(inferredType);
      setJustifyFileDataUrl('');
      showToast(`Arquivo anexado com sucesso: ${file.name} (${sizeLabel}) ✓`, 'success');
    } catch {
      showToast('Não foi possível anexar o arquivo localmente. Tente novamente.', 'info');
    }
  };

  const handleSubmitJustification = (e) => {
    e.preventDefault();
    if (!justifyDate) {
      showToast('Selecione a data da aula presencial que deseja justificar.', 'info');
      return;
    }
    const [y, m, d] = justifyDate.split('-');
    const formattedDate = `${d}/${m}/${y}`;
    const cleanDetails = justifyDetails.trim();

    const entry = {
      id: `just-${Date.now()}`,
      alunoNome: session.nome,
      alunoCpf: session.cpf,
      data: formattedDate,
      motivo: justifyReason,
      detalhes: cleanDetails || 'Registrado pelo Portal do Aluno.',
      anexoFileId: justifyFileId || '',
      anexo: justifyFileName || '',
      anexoTamanho: justifyFileSize || '',
      anexoTipo: justifyFileType || '',
      anexoDataUrl: justifyFileDataUrl || '',
      status: 'Em análise pela Secretaria',
      enviadoEm: new Date().toLocaleDateString('pt-BR'),
    };

    // 1. Registra imediatamente no sistema (visível no Portal e pronto para o Painel Admin / Supabase)
    setJustifications((prev) => [entry, ...prev]);

    // 2. Abre o WhatsApp do Cleve automaticamente já preenchido (2 em 1!)
    const waMessage = [
      `Olá! Sou *${session.nome}* (CPF ${session.cpf}), aluno do Curso de Socorrista APH (200h).`,
      `Acabei de registrar uma justificativa de falta no Portal do Aluno:`,
      `• *Data da aula:* ${formattedDate}`,
      `• *Motivo:* ${justifyReason}`,
      cleanDetails ? `• *Observação:* ${cleanDetails}` : null,
      justifyFileName
        ? `• *Anexo registrado no Portal:* ${justifyFileName} (${justifyFileSize})`
        : null,
    ]
      .filter(Boolean)
      .join('\n');

    window.open(getWhatsAppUrl(waMessage), '_blank', 'noopener,noreferrer');

    setJustifyDetails('');
    setJustifyFileId('');
    setJustifyFileName('');
    setJustifyFileSize('');
    setJustifyFileType('');
    setJustifyFileDataUrl('');
    setShowJustifyForm(false);
    showToast(
      `Justificativa de ${formattedDate} registrada no sistema e aberta no WhatsApp da coordenação ✓`,
      'success'
    );
  };

  const handleRemoveJustification = async (id, dataLabel) => {
    const target = justifications.find((item) => item.id === id);
    if (target?.anexoFileId) {
      await deleteFileFromVault(target.anexoFileId);
    }
    setJustifications((prev) => prev.filter((item) => item.id !== id));
    setConfirmDeleteJustId(null);
    showToast(`Justificativa do dia ${dataLabel} removida com sucesso ✓`, 'info');
  };

  const handlePrintEnrollmentDeclaration = () => {
    const existingFrame = document.getElementById('black-enrollment-declaration-frame');
    if (existingFrame) existingFrame.remove();

    const iframe = document.createElement('iframe');
    iframe.id = 'black-enrollment-declaration-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const todayStr = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <title>Declaração de Matrícula — BLACK Treinamentos Resgate e APH</title>
          <style>
            @page { size: A4 portrait; margin: 0; }
            * { box-sizing: border-box; }
            body {
              font-family: "Times New Roman", Times, Georgia, serif;
              color: #161616;
              line-height: 1.7;
              margin: 0;
              padding: 18mm 20mm;
              background: #ffffff;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #ED101C;
              padding-bottom: 14px;
              margin-bottom: 28px;
            }
            .header img {
              height: 70px;
              width: auto;
              margin-bottom: 10px;
            }
            .company {
              font-size: 13px;
              font-weight: bold;
              letter-spacing: 0.6px;
            }
            .cnpj {
              font-size: 11px;
              color: #555;
            }
            h1 {
              text-align: center;
              font-size: 20px;
              letter-spacing: 1.5px;
              text-transform: uppercase;
              margin: 28px 0 26px;
            }
            p {
              font-size: 14.5px;
              text-align: justify;
              margin-bottom: 16px;
            }
            .box {
              border: 1px solid #d4d4d4;
              background: #fafafa;
              border-radius: 6px;
              padding: 14px 18px;
              margin: 22px 0;
              font-size: 13.5px;
            }
            .box div { margin-bottom: 6px; }
            .box div:last-child { margin-bottom: 0; }
            .date {
              text-align: right;
              margin-top: 38px;
              font-size: 14px;
            }
            .signature {
              margin-top: 64px;
              text-align: center;
            }
            .sig-line {
              width: 300px;
              border-top: 1px solid #161616;
              margin: 0 auto 8px;
            }
            .sig-name { font-weight: bold; font-size: 14px; }
            .sig-role { font-size: 12px; color: #444; }
            .footer-note {
              margin-top: 46px;
              padding-top: 12px;
              border-top: 1px solid #e5e5e5;
              font-size: 10.5px;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${window.location.origin}/assets/logo-black-papel-branco.png?v=2" alt="BLACK Treinamentos" />
            <div class="company">BLACK TREINAMENTOS RESGATE E APH</div>
            <div class="cnpj">CNPJ: 58.279.230/0001-10 • Guaraniaçu – PR • WhatsApp: ${BRAND_CONFIG.whatsappDisplay}</div>
          </div>

          <h1>Declaração de Matrícula</h1>

          <p>
            Declaramos, para os devidos fins de comprovação profissional, acadêmica ou trabalhista, que
            <strong>${String(session.nome || '').toUpperCase().replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]))}</strong>, inscrito(a) no CPF sob o nº
            <strong>${String(session.cpf || '—').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]))}</strong>, encontra-se regularmente matriculado(a) e com vínculo ativo no
            <strong>Curso de Socorrista — Atendimento Pré-Hospitalar (APH)</strong>, promovido pela
            <strong>BLACK TREINAMENTOS RESGATE E APH</strong>, em conformidade com a Lei nº 9.394/96 (LDB — Cursos Livres de Qualificação Profissional).
          </p>

          <div class="box">
            <div><strong>Curso:</strong> Formação de Socorrista — Atendimento Pré-Hospitalar (APH)</div>
            <div><strong>Carga Horária Total:</strong> 200 horas (11 módulos teóricos e práticos)</div>
            <div><strong>Período da Turma:</strong> 13/02/2027 a 16/10/2027 (duração de 8 meses)</div>
            <div><strong>Dias e Local:</strong> Sábados à tarde — Prédio da Unicesumar, Guaraniaçu – PR</div>
            <div><strong>Situação Atual:</strong> ${progressStats.completedCount}/11 módulos concluídos (${progressStats.completedHours}h/200h) • Frequência presencial: ${FREQUENCIA_PRESENCIAL_DEMO.percentualAtual}%</div>
          </div>

          <p>
            Por ser expressão da verdade, firmamos a presente declaração.
          </p>

          <div class="date">Guaraniaçu – PR, ${todayStr}.</div>

          <div class="signature">
            <div class="sig-line"></div>
            <div class="sig-name">CLEVERSON DA CRUZ</div>
            <div class="sig-role">Diretor e Instrutor Responsável • BLACK Treinamentos Resgate e APH</div>
          </div>

          <div class="footer-note">
            Documento emitido eletronicamente pelo Portal do Aluno BLACK Treinamentos • Validação via Secretaria: ${BRAND_CONFIG.whatsappDisplay}
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 300);
  };

  const simulateFullApprovalForTest = () => {
    setProgressState({
      completedModuleIds: modulos.map((m) => m.modulo),
      completedLessonIds: modulos.flatMap((m) => m.aulas.map((a) => a.id)),
      quizPassed: true,
      quizBestPct: 100,
    });
    setActivities((prev) => prev.map((a) => ({ ...a, status: 'concluida' })));
    showToast('Modo Teste: 11/11 módulos e Avaliação concluídos! Certificado A4 liberado.', 'success');
  };

  const handleMaterialAccess = (mat) => {
    if (mat.arquivoUrl) {
      const trimmedUrl = String(mat.arquivoUrl).trim();
      if (!/^https?:\/\//i.test(trimmedUrl)) {
        showToast('Link de material inválido. Use um endereço seguro (https://).', 'info');
        return;
      }
      window.open(trimmedUrl, '_blank', 'noopener,noreferrer');
      showToast(`Abrindo material: ${mat.titulo}`, 'success');
    } else {
      showToast(
        `Espaço pronto para o PDF real (${mat.titulo}). Assim que subir no Supabase, o download abre automaticamente.`,
        'info'
      );
    }
  };

  const handleCopyPix = (parcela, discountedAmountText = null) => {
    const pixCode = `00020126580014BR.GOV.BCB.PIX0136BLACK-TREINAMENTOS-APH-PARCELA-${String(
      parcela.numero
    ).padStart(2, '0')}5204000053039865802BR5925BLACK TREINAMENTOS APH6011GUARANIACU6304A1B2`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(pixCode).catch(() => { });
    }
    showToast(
      `Código PIX da Parcela ${parcela.numero}/10 (${discountedAmountText || parcela.valor}) copiado!`,
      'success'
    );
  };

  const formatMoneyBRL = (centavos) =>
    (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    const missingQuestions = QUIZ_QUESTIONS_200H.filter(
      (q) => quizAnswers[q.id] === undefined
    ).map((q) => q.id);

    if (missingQuestions.length > 0) {
      setQuizModal({
        type: 'missing',
        missingQuestions,
      });
      return;
    }

    let hits = 0;
    QUIZ_QUESTIONS_200H.forEach((q) => {
      if (quizAnswers[q.id] === q.correta) hits += 1;
    });
    const pct = Math.round((hits / QUIZ_QUESTIONS_200H.length) * 100);
    const scoreObj = { hits, total: QUIZ_QUESTIONS_200H.length, pct };
    setQuizScore(scoreObj);

    if (pct >= curso.notaMinimaAprovacaoPct) {
      setProgressState((prev) => ({
        ...prev,
        quizPassed: true,
        quizBestPct: Math.max(prev.quizBestPct || 0, pct),
      }));
      setActivities((prev) => prev.map((a) => (a.opensQuiz ? { ...a, status: 'concluida' } : a)));
      setQuizModal({ type: 'passed', ...scoreObj });
    } else {
      setQuizModal({ type: 'failed', ...scoreObj });
    }
  };

  // Calendário Livre (seleciona automaticamente o 1º sábado de aula ao mudar de mês!)
  const goToPrevMonth = () => {
    const nextY = calMonth === 0 ? calYear - 1 : calYear;
    const nextM = calMonth === 0 ? 11 : calMonth - 1;
    const autoDay = getFirstClassDayInMonth(nextY, nextM);
    setCalYear(nextY);
    setCalMonth(nextM);
    setSelectedDateKey(
      `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(autoDay).padStart(2, '0')}`
    );
  };

  const goToNextMonth = () => {
    const nextY = calMonth === 11 ? calYear + 1 : calYear;
    const nextM = calMonth === 11 ? 0 : calMonth + 1;
    const autoDay = getFirstClassDayInMonth(nextY, nextM);
    setCalYear(nextY);
    setCalMonth(nextM);
    setSelectedDateKey(
      `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(autoDay).padStart(2, '0')}`
    );
  };

  const jumpToMonth = (year, month, day = 1) => {
    setCalYear(year);
    setCalMonth(month);
    setSelectedDateKey(
      `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    );
  };

  const handleBellClick = () => {
    if (activeNav === 'ajuda' && selectedModuleIndex === null) {
      setNoticesPulse(true);
      showToast('Você já está vendo os Comunicados Oficiais da Turma ✓', 'info');
      const el = document.getElementById('comunicados-oficiais-card');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setNoticesPulse(false), 1400);
    } else {
      navigateTo('ajuda');
    }
  };

  // APENAS 6 ABAS PRINCIPAIS — CLAREZA IMEDIATA PARA TODAS AS IDADES
  const sidebarItems = [
    { id: 'inicio', label: 'Início', desc: 'Resumo rápido', icon: Home },
    { id: 'aulas', label: 'Minhas Aulas', desc: 'Módulos, PDFs e Prova', icon: BookOpen },
    { id: 'agenda', label: 'Calendário e Presença', desc: 'Sábados e Frequência', icon: CalendarIcon },
    { id: 'certificado', label: 'Meu Certificado', desc: 'Diploma Oficial 200h', icon: Award },
    { id: 'financeiro', label: 'Financeiro', desc: 'Parcelas e PIX (10x)', icon: CreditCard },
    { id: 'ajuda', label: 'Avisos e Ajuda', desc: 'Comunicados e WhatsApp', icon: Headphones, badge: unreadNotices },
  ];

  const filteredModules = modulos.filter((mod) => {
    const isDone = completedModuleIds.includes(mod.modulo);
    if (moduleFilter === 'concluidos' && !isDone) return false;
    if (moduleFilter === 'pendentes' && isDone) return false;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      mod.titulo.toLowerCase().includes(q) ||
      mod.modulo.includes(q) ||
      mod.aulas.some((a) => a.titulo.toLowerCase().includes(q))
    );
  });

  const activeModule = selectedModuleIndex !== null ? modulos[selectedModuleIndex] : null;
  const activeAula = activeModule ? activeModule.aulas[activeAulaIndex] || activeModule.aulas[0] : null;

  return (
    <div className="min-h-screen bg-[#07080C] text-white flex flex-col lg:flex-row font-sans selection:bg-[#ED101C] selection:text-white pb-24 lg:pb-16">
      {/* TOAST ELEGANTE GLOBAL */}
      {toast && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-[90] sm:max-w-sm bg-[#12131A]/95 backdrop-blur-xl border border-[#ED101C]/70 rounded-2xl px-4 py-3 shadow-[0_14px_40px_rgba(0,0,0,0.85)] flex items-start gap-3">
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
            aria-label="Fechar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =====================================================================
          SIDEBAR ESQUERDA PREMIUM — TUDO AGRUPADO NO TOPO E FIXO NA ROLAGEM!
      ===================================================================== */}
      <aside className="w-full lg:w-[278px] lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto bg-gradient-to-b from-[#0D0E14] to-[#08090D] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-start shrink-0">
        {/* Logo BLACK HD — Centralizada no Mobile, Tablet e Desktop! */}
        <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3.5 sm:pb-4 border-b border-white/10 flex items-center justify-center lg:flex-col lg:items-center lg:text-center relative overflow-hidden shrink-0">
          <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-52 h-32 rounded-full bg-[#ED101C]/14 blur-2xl" />
          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              className="lg:hidden absolute left-3.5 top-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-[#ED101C]/65 text-[11px] font-bold text-white active:scale-95 transition-all"
              aria-label="Voltar ao Site Principal"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#ED101C]" />
              <span>Site</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => navigateTo('inicio')}
            className="relative flex flex-col items-center text-center focus:outline-none group"
          >
            <img
              src="/assets/logo-header-sharp.png"
              alt="BLACK Treinamentos - Resgate & APH"
              className="w-[136px] sm:w-[178px] lg:w-[214px] h-auto object-contain transition-transform duration-300 group-hover:scale-[1.03] contrast-[1.08] brightness-[1.05]"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
            />
            <span className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11px] text-white/80 font-semibold mt-2.5 sm:mt-3 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ED101C] animate-pulse" />
              <span>Portal do Aluno • Socorrista 200h</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('perfil')}
            className="lg:hidden absolute right-3.5 top-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.06] border border-white/15 text-[11px] font-bold text-white active:scale-95 transition-all"
            aria-label="Meu Perfil"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={session.nome}
                className="w-5 h-5 rounded-full object-cover border border-[#ED101C]/70"
              />
            ) : (
              <User className="w-3.5 h-3.5 text-[#ED101C]" />
            )}
            <span className="hidden xs:inline sm:inline">Perfil</span>
          </button>
        </div>

        {/* 6 Menus Principais — Swipe suave no Mobile/Tablet e Fixos no Desktop */}
        <nav
          className="px-3 py-2.5 lg:p-3.5 flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar snap-x gap-1.5 shrink-0"
          aria-label="Menu principal do aluno"
        >
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateTo(item.id)}
                className={`w-auto lg:w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl text-left transition-all duration-200 shrink-0 group ${isActive
                  ? 'bg-gradient-to-r from-[#ED101C] to-[#C80B15] text-white shadow-[0_8px_24px_rgba(237,16,28,0.4)] ring-1 ring-white/20'
                  : 'text-white/80 hover:text-white hover:bg-white/[0.06] hover:translate-x-0.5'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                      isActive ? 'scale-105' : 'text-white/65 group-hover:text-[#FF5A65]'
                    }`}
                  />
                  <div>
                    <span className="block text-sm font-bold leading-tight whitespace-nowrap">
                      {item.label}
                    </span>
                    <span
                      className={`hidden lg:block text-[11px] mt-0.5 ${isActive ? 'text-white/85' : 'text-white/45'
                        }`}
                    >
                      {item.desc}
                    </span>
                  </div>
                </div>
                {item.badge > 0 && (
                  <span
                    className={`min-w-[22px] h-[22px] px-1.5 rounded-full text-[11px] font-extrabold flex items-center justify-center shrink-0 tabular-nums shadow-sm ${
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

        {/* Perfil do Aluno + Sair logo abaixo do menu — sobe e desce junto com tudo! */}
        <div className="hidden lg:block px-3.5 pt-3 pb-5 border-t border-white/10 space-y-2 shrink-0">
          <button
            type="button"
            onClick={() => navigateTo('perfil')}
            className={`w-full p-2.5 rounded-2xl border flex items-center gap-3 text-left transition-all duration-200 ${activeNav === 'perfil'
              ? 'bg-gradient-to-r from-[#23090D] to-[#14161F] border-[#ED101C]/80 shadow-[0_0_20px_rgba(237,16,28,0.22)]'
              : 'bg-white/[0.03] border-white/10 hover:border-[#ED101C]/50 hover:bg-white/[0.06]'
              }`}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={session.nome}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#ED101C]/75 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ED101C] to-[#8C0810] border border-[#FF5A65]/50 text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                {studentInitials}
              </div>
            )}
            <div className="min-w-0">
              <strong className="text-xs font-bold text-white block truncate capitalize">
                {session.nome.toLowerCase()}
              </strong>
              <span className="text-[11px] text-white/55 block">Ver meu perfil →</span>
            </div>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-[#ED101C]" />
            <span>Sair da conta</span>
          </button>

          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              className="w-full py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/75 hover:text-white text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#ED101C]" />
              <span>Voltar ao Site</span>
            </button>
          )}
        </div>
      </aside>

      {/* =====================================================================
          ÁREA PRINCIPAL — MUITO MAIS RESPIRO, LEITURA FÁCIL E ZERO POLUIÇÃO
      ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOPBAR LIMPA */}
        <header className="bg-[#0B0C10]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-3 sticky top-0 z-30">
          <div className="min-w-0">
            <h1 className="font-display font-extrabold text-base sm:text-xl text-white truncate">
              {selectedModuleIndex !== null
                ? `Sala de Aula — Módulo ${activeModule.modulo}`
                : activeNav === 'inicio'
                  ? `Olá, ${firstName}!`
                  : activeNav === 'aulas'
                    ? 'Minhas Aulas (200 Horas)'
                    : activeNav === 'agenda'
                      ? 'Calendário e Presença'
                      : activeNav === 'certificado'
                        ? 'Meu Certificado (200h)'
                        : activeNav === 'financeiro'
                          ? 'Financeiro e Parcelas'
                          : activeNav === 'ajuda'
                            ? 'Avisos e Suporte'
                            : 'Meu Perfil'}
            </h1>
            <p className="text-xs text-white/55 hidden sm:block truncate">
              Curso de Socorrista — Atendimento Pré-Hospitalar (APH) • {curso.turma}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {onBackToLanding && (
              <button
                type="button"
                onClick={onBackToLanding}
                className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-[#ED101C]/65 text-white text-[11px] sm:text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap transition-all hover:-translate-y-0.5"
                title="Voltar para a Página Inicial"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ED101C] shrink-0" />
                <span className="sm:hidden">Voltar</span>
                <span className="hidden sm:inline">Voltar ao Site</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleBellClick}
              title={
                activeNav === 'ajuda'
                  ? 'Você já está na aba de Avisos e Comunicados'
                  : 'Ver Comunicados Oficiais da Turma'
              }
              className={`relative p-2 sm:p-2.5 rounded-xl border transition-all ${activeNav === 'ajuda' && selectedModuleIndex === null
                ? 'bg-[#ED101C]/20 border-[#ED101C] text-[#FF545E] shadow-[0_0_16px_rgba(237,16,28,0.4)]'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                }`}
              aria-label="Avisos"
            >
              <Bell className="w-4 h-4" />
              {unreadNotices > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 rounded-full bg-[#ED101C] text-white text-[10px] font-extrabold flex items-center justify-center tabular-nums shadow-[0_0_12px_rgba(237,16,28,0.8)]">
                  {unreadNotices}
                </span>
              )}
            </button>

            <a
              href={getWhatsAppUrl(`Olá! Sou ${session.nome}, aluno do Curso de Socorrista APH (200h), e preciso de ajuda.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1A080B] hover:bg-[#ED101C] border border-[#ED101C]/50 text-white text-xs font-bold transition-colors whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>
        </header>

        {/* CONTAINER CENTRAL CONFORTÁVEL (MÁXIMO 1060PX = LEITURA CALMA E FÁCIL!) */}
        <main className="flex-1 w-full max-w-[1060px] mx-auto px-4 sm:px-8 py-6 sm:py-8">
          {/* =================================================================
              TELA DEDICADA 1: SALA DE AULA (COM BOTÃO "← VOLTAR" SEMPRE NO TOPO)
          ================================================================= */}
          {selectedModuleIndex !== null && activeModule ? (
            <div className="space-y-6">
              {/* Botão Voltar Impossível de Perder */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedModuleIndex(null)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-[#ED101C] text-white text-sm font-bold transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar para os 11 Módulos</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleModuleCompleted(activeModule.modulo)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 border transition-colors ${completedModuleIds.includes(activeModule.modulo)
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                    : 'bg-[#ED101C] hover:bg-[#C80B15] border-[#ED101C] text-white'
                    }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {completedModuleIds.includes(activeModule.modulo)
                      ? 'Módulo Concluído ✓'
                      : 'Marcar Módulo como Concluído'}
                  </span>
                </button>
              </div>

              {/* Card Principal da Aula */}
              <div className="bg-[#11131A] border border-white/10 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
                <div>
                  <span className="text-xs font-mono font-bold text-[#ED101C] uppercase tracking-wider">
                    Módulo {activeModule.modulo} • Carga Horária: {activeModule.cargaHoraria}
                  </span>
                  <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white mt-1">
                    {activeModule.titulo}
                  </h2>
                </div>

                {/* Palco de Vídeo (Suporta YouTube/MP4 real ou espaço limpo pronto para conteúdo) */}
                <div className="relative h-60 sm:h-80 rounded-2xl overflow-hidden bg-black border border-white/15">
                  {activeAula.videoUrl ? (
                    <iframe
                      src={activeAula.videoUrl}
                      title={activeAula.titulo}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <img
                        src={curso.thumb}
                        alt={activeAula.titulo}
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/25 flex flex-col justify-between p-5 sm:p-6">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="px-3 py-1 rounded-full bg-[#ED101C] text-white text-xs font-bold">
                            Aula {activeAula.ordem} • {activeAula.tipo} ({activeAula.duracaoMin} min)
                          </span>
                          <span className="px-3 py-1 rounded-full bg-black/75 border border-white/15 text-[11px] font-mono text-amber-300">
                            Pronto para receber o vídeo real
                          </span>
                        </div>
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-full bg-[#ED101C] text-white flex items-center justify-center shrink-0 shadow-red-glow">
                            <Video className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-display font-bold text-base sm:text-lg text-white">
                              {activeAula.titulo}
                            </h3>
                            <p className="text-xs sm:text-sm text-white/75 mt-0.5">
                              {activeAula.descricao}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Barra de Navegação Clara entre Aulas (Ideal para todas as idades!) */}
                {activeAula && (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-[#161922] border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    <button
                      type="button"
                      onClick={handlePrevLesson}
                      disabled={selectedModuleIndex === 0 && activeAulaIndex === 0}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 disabled:opacity-35 disabled:pointer-events-none text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 shrink-0" />
                      <span>Aula Anterior</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleLessonCompleted(activeModule, activeAula.id)}
                      className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 border transition-colors ${completedLessonIds.includes(activeAula.id)
                        ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 hover:bg-emerald-950/80'
                        : 'bg-[#ED101C] hover:bg-[#C80B15] border-[#ED101C] text-white shadow-red-glow-sm'
                        }`}
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>
                        {completedLessonIds.includes(activeAula.id)
                          ? `Aula ${activeAula.ordem} Concluída ✓`
                          : `Marcar Aula ${activeAula.ordem} como Concluída`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextLesson}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-[#ED101C] text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>
                        {selectedModuleIndex === modulos.length - 1 &&
                          activeAulaIndex === activeModule.aulas.length - 1
                          ? 'Ir para Avaliação Final'
                          : 'Próxima Aula'}
                      </span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </button>
                  </div>
                )}

                {/* Seletor de Aulas do Módulo (com status individual ✓ aula por aula) */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white/70 block">
                      Escolha a aula deste módulo ({activeModule.aulas.length} aulas):
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      {
                        activeModule.aulas.filter((a) => completedLessonIds.includes(a.id)).length
                      }{' '}
                      de {activeModule.aulas.length} concluídas
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeModule.aulas.map((aula, idx) => {
                      const lessonDone = completedLessonIds.includes(aula.id);
                      return (
                        <button
                          key={aula.id}
                          type="button"
                          onClick={() => setActiveAulaIndex(idx)}
                          className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${idx === activeAulaIndex
                            ? 'bg-[#1C080B] border-[#ED101C] text-white'
                            : lessonDone
                              ? 'bg-[#121917] border-emerald-500/35 text-white/90 hover:border-emerald-400/60'
                              : 'bg-[#171922] border-white/10 text-white/80 hover:border-white/25'
                            }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 ${idx === activeAulaIndex
                                ? 'bg-[#ED101C] text-white'
                                : lessonDone
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-white/10'
                                }`}
                            >
                              {lessonDone ? '✓' : aula.ordem}
                            </span>
                            <div className="min-w-0">
                              <strong className="text-xs sm:text-sm block truncate">
                                {aula.titulo}
                              </strong>
                              <span className="text-[11px] text-white/55">
                                {aula.tipo} • {aula.duracaoMin} min
                              </span>
                            </div>
                          </div>
                          {lessonDone && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3 Sub-abas Limpas dentro da Aula */}
                <div className="pt-2 border-t border-white/10 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'resumo', label: 'Resumo e Checklist', icon: ClipboardList },
                      { id: 'materiais', label: `Apostilas (${activeModule.materiais.length})`, icon: FileText },
                      { id: 'anotacoes', label: 'Minhas Anotações', icon: StickyNote },
                    ].map((t) => {
                      const TabIcon = t.icon;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setClassroomTab(t.id)}
                          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-colors ${classroomTab === t.id
                            ? 'bg-[#ED101C] text-white'
                            : 'bg-white/5 text-white/75 hover:text-white'
                            }`}
                        >
                          <TabIcon className="w-4 h-4" />
                          <span>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {classroomTab === 'resumo' ? (
                    <div className="space-y-3 text-sm text-white/85">
                      <p className="leading-relaxed">{activeModule.resumo}</p>
                      <div className="space-y-2 pt-1">
                        <strong className="text-xs uppercase font-mono text-[#ED101C] block">
                          O que você precisa dominar neste módulo:
                        </strong>
                        {activeModule.checklistPratico.map((item) => (
                          <div key={item} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-[#ED101C] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : classroomTab === 'materiais' ? (
                    <div className="space-y-2.5">
                      {activeModule.materiais.map((mat) => (
                        <div
                          key={mat.id}
                          className="p-4 rounded-xl bg-[#171922] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <strong className="text-sm text-white block">{mat.titulo}</strong>
                            <span className="text-xs text-white/60">
                              {mat.tipo} • {mat.tamanho}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleMaterialAccess(mat)}
                            className="px-4 py-2 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shrink-0"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Baixar PDF</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        rows={4}
                        value={moduleNotes[activeModule.modulo] || ''}
                        onChange={(e) =>
                          setModuleNotes((prev) => ({
                            ...prev,
                            [activeModule.modulo]: e.target.value,
                          }))
                        }
                        placeholder={`Escreva suas anotações do Módulo ${activeModule.modulo}... (salvo automaticamente!)`}
                        className="w-full bg-[#0A0B0F] border border-white/15 focus:border-[#ED101C] rounded-xl p-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none"
                      />
                      <span className="text-xs text-emerald-400">
                        ✓ Suas anotações ficam salvas automaticamente.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : activeNav === 'inicio' ? (
            /* =================================================================
               TELA 1: INÍCIO — ULTRA-LIMPO ("BATEU O OLHO, SABE ONDE IR!")
               Zero grade de 11 módulos despejada aqui, zero repetição, zero poluição!
            ================================================================= */
            <div className="space-y-6">
              {/* 1. Cartão Principal Único do Curso (Hero + Barra de Progresso Integrada + 1 Botão Claro) */}
              <div className="relative rounded-3xl overflow-hidden bg-[#11131A] border border-[#ED101C]/45 shadow-2xl">
                <div className="absolute inset-y-0 right-0 w-full sm:w-[55%]">
                  <img
                    src="/assets/lms-hero-banner.jpg"
                    alt="Curso de Socorrista APH 200h"
                    className="w-full h-full object-cover object-right opacity-65 sm:opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#11131A]/90 via-[#11131A]/85 to-[#11131A]/95 sm:bg-gradient-to-r sm:from-[#11131A] sm:via-[#11131A]/85 sm:to-transparent" />
                </div>

                <div className="relative z-10 p-5 sm:p-9 max-w-2xl space-y-5 flex flex-col items-center text-center sm:items-start sm:text-left">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ED101C]/20 border border-[#ED101C]/60 text-[#FF5A65] text-[11px] sm:text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#ED101C] animate-pulse shrink-0" />
                    <span>Formação Ativa • 200 Horas (11 Módulos)</span>
                  </div>

                  <div>
                    <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white leading-tight">
                      Curso de Socorrista —{' '}
                      <span className="text-[#ED101C]">APH</span>
                    </h2>
                    <p className="text-xs sm:text-base text-white/80 mt-2">
                      {progressStats.pct === 100
                        ? 'Parabéns! Você concluiu todos os 11 módulos (200 horas).'
                        : `Próxima aula recomendada: Módulo ${progressStats.nextModule.modulo} — ${progressStats.nextModule.titulo}`}
                    </p>
                  </div>

                  {/* Barra de Progresso Única e Clara (sem widget redundante na direita!) */}
                  <div className="w-full max-w-md space-y-2 text-left">
                    <div className="flex items-center justify-between gap-2 text-xs sm:text-sm font-semibold">
                      <span className="text-white/85">
                        Progresso:{' '}
                        <strong className="text-white">
                          {progressStats.completedCount}/11 módulos ({progressStats.completedHours}h / 200h)
                        </strong>
                      </span>
                      <span
                        className={`font-mono font-extrabold shrink-0 ${progressStats.pct === 100 ? 'text-emerald-400' : 'text-[#ED101C]'
                          }`}
                      >
                        {progressStats.pct}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${progressStats.pct === 100 ? 'bg-emerald-500' : 'bg-[#ED101C]'
                          }`}
                        style={{ width: `${progressStats.pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-1 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => openModuleClassroom(progressStats.nextModuleIndex)}
                      className="btn-magnetic cta-btn-shimmer w-full sm:w-auto bg-[#ED101C] hover:bg-[#C80B15] text-white font-bold text-sm sm:text-base px-6 sm:px-7 py-3.5 rounded-2xl shadow-[0_8px_28px_rgba(237,16,28,0.45)] inline-flex items-center justify-center gap-2.5"
                    >
                      <Play className="w-5 h-5 fill-current shrink-0" />
                      <span>
                        {progressStats.pct === 100
                          ? 'Revisar Aulas'
                          : `Continuar Módulo ${progressStats.nextModule.modulo}`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateTo('aulas', 'avaliacao')}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors"
                    >
                      <CheckSquare className="w-4 h-4 text-[#ED101C] shrink-0" />
                      <span>{quizPassed ? 'Avaliação Aprovada ✓' : 'Fazer Avaliação Final'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Grade de 4 Caminhos Grandes e Óbvios ("O que você quer acessar agora?") */}
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white/55 mb-3">
                  Acesso Rápido
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => navigateTo('aulas', 'modulos')}
                    className="group p-5 rounded-2xl bg-[#11131A] hover:bg-[#161922] border border-white/10 hover:border-[#ED101C]/70 text-left flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#ED101C]/15 border border-[#ED101C]/45 text-[#ED101C] flex items-center justify-center shrink-0 group-hover:bg-[#ED101C] group-hover:text-white transition-colors">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <strong className="font-display font-extrabold text-base text-white block">
                          Aulas, Apostilas e Provas
                        </strong>
                        <span className="text-xs sm:text-sm text-white/65">
                          {progressStats.completedCount} de 11 módulos concluídos • {allMaterials200h.length} apostilas
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-[#ED101C] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo('agenda', 'calendario')}
                    className="group p-5 rounded-2xl bg-[#11131A] hover:bg-[#161922] border border-white/10 hover:border-emerald-500/60 text-left flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <CalendarIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <strong className="font-display font-extrabold text-base text-white block">
                          Calendário e Presença
                        </strong>
                        <span className="text-xs sm:text-sm text-white/65">
                          Sábados na Unicesumar • Frequência: {FREQUENCIA_PRESENCIAL_DEMO.percentualAtual}%
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo('certificado')}
                    className="group p-5 rounded-2xl bg-[#11131A] hover:bg-[#161922] border border-white/10 hover:border-amber-400/70 text-left flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/45 text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <strong className="font-display font-extrabold text-base text-white block">
                          Meu Certificado (200h)
                        </strong>
                        <span className="text-xs sm:text-sm text-white/65">
                          {progressStats.certificateUnlocked
                            ? 'Autorizado e liberado para impressão A4 ✓'
                            : certRequest?.status === 'pending'
                            ? 'Aguardando conferência da Coordenação'
                            : progressStats.requirementsMet
                            ? 'Concluído! Clique para solicitar emissão'
                            : 'Ver os 3 requisitos para liberação oficial'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo('financeiro')}
                    className="group p-5 rounded-2xl bg-[#11131A] hover:bg-[#161922] border border-white/10 hover:border-[#ED101C]/70 text-left flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#ED101C]/15 border border-[#ED101C]/45 text-[#ED101C] flex items-center justify-center shrink-0 group-hover:bg-[#ED101C] group-hover:text-white transition-colors">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <strong className="font-display font-extrabold text-base text-white block">
                          Financeiro e Parcelas
                        </strong>
                        <span className="text-xs sm:text-sm text-white/65">
                          4 de 10 pagas • Próxima: 10/06/2027 (PIX / Boleto)
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-[#ED101C] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                </div>
              </div>

              {/* 3. Faixa Simples de Próxima Aula Presencial */}
              <div className="p-5 rounded-2xl bg-[#11131A] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#19080B] border border-[#ED101C]/50 text-[#ED101C] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-sm text-white block">
                      Turma Presencial — Início 13/02/2027 (8 meses • Sábados à tarde)
                    </strong>
                    <span className="text-xs text-white/65">
                      Local: Prédio da Unicesumar • Guaraniaçu – PR
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('agenda', 'calendario')}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-[#ED101C] border border-white/15 text-xs sm:text-sm font-bold text-white transition-colors shrink-0"
                >
                  Abrir Calendário
                </button>
              </div>
            </div>
          ) : activeNav === 'aulas' ? (
            /* =================================================================
               TELA 2: MINHAS AULAS (SUB-ABAS: 11 MÓDULOS | APOSTILAS | ATIVIDADES | AVALIAÇÃO)
            ================================================================= */
            <div className="space-y-6">
              {/* Sub-abas Simétricas (2x2 no Mobile, 4 colunas no Tablet/Desktop) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-[#11131A] border border-white/10 p-1.5 rounded-2xl">
                {[
                  { id: 'modulos', label: '11 Módulos', fullLabel: '11 Módulos (200h)', icon: BookOpen },
                  { id: 'materiais', label: 'Apostilas', fullLabel: 'Apostilas e PDFs', icon: FileText },
                  { id: 'atividades', label: 'Atividades', fullLabel: 'Atividades', icon: ClipboardList },
                  { id: 'avaliacao', label: 'Prova Final', fullLabel: 'Avaliação Final', icon: CheckSquare },
                ].map((sub) => {
                  const SubIcon = sub.icon;
                  const active = aulasSubTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setAulasSubTab(sub.id)}
                      className={`py-2.5 px-2.5 sm:px-4 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-1.5 sm:gap-2 transition-all ${active
                        ? 'bg-[#ED101C] text-white shadow-red-glow-sm'
                        : 'text-white/75 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <SubIcon className="w-4 h-4 shrink-0" />
                      <span className="sm:hidden truncate">{sub.label}</span>
                      <span className="hidden sm:inline truncate">{sub.fullLabel}</span>
                    </button>
                  );
                })}
              </div>

              {aulasSubTab === 'modulos' ? (
                <div className="space-y-4">
                  {/* Busca Simples + Filtros Rápidos Simétricos (Todos | Em aberto | Concluídos) */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-white/45 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Procurar módulo ou assunto (ex: SBV, Hemorragias, Trauma)..."
                        className="w-full bg-[#11131A] border border-white/15 focus:border-[#ED101C] rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-3 sm:flex items-center gap-1 sm:gap-1.5 bg-[#11131A] border border-white/10 p-1 rounded-2xl shrink-0">
                      {[
                        { id: 'todos', label: `Todos (${modulos.length})` },
                        {
                          id: 'pendentes',
                          label: `Abertos (${modulos.length - progressStats.completedCount})`,
                        },
                        {
                          id: 'concluidos',
                          label: `Feitos (${progressStats.completedCount})`,
                        },
                      ].map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setModuleFilter(f.id)}
                          className={`px-2 sm:px-3 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-colors whitespace-nowrap text-center ${moduleFilter === f.id
                            ? 'bg-[#ED101C] text-white'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Lista Limpa dos 11 Módulos (1 ação óbvia por card: "Abrir Módulo") */}
                  <div className="space-y-3">
                    {filteredModules.map((mod) => {
                      const originalIdx = modulos.findIndex((m) => m.modulo === mod.modulo);
                      const isDone = completedModuleIds.includes(mod.modulo);
                      const modDoneLessons = mod.aulas.filter((a) =>
                        completedLessonIds.includes(a.id)
                      ).length;
                      return (
                        <div
                          key={mod.modulo}
                          className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${isDone
                            ? 'bg-[#11151B] border-emerald-500/35'
                            : 'bg-[#11131A] border-white/10 hover:border-[#ED101C]/60'
                            }`}
                        >
                          <div className="flex items-start gap-3.5 min-w-0">
                            <span
                              className={`w-10 h-10 rounded-xl font-mono text-sm font-extrabold flex items-center justify-center shrink-0 ${isDone
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-[#ED101C]/20 text-[#ED101C] border border-[#ED101C]/45'
                                }`}
                            >
                              {mod.modulo}
                            </span>
                            <div className="min-w-0">
                              <h3 className="font-display font-extrabold text-sm sm:text-base text-white">
                                {mod.titulo}
                              </h3>
                              <p className="text-xs text-white/65 mt-0.5">
                                Carga horária: <strong className="text-white">{mod.cargaHoraria}</strong> •{' '}
                                {modDoneLessons}/{mod.aulas.length} aula(s) concluída(s) •{' '}
                                {isDone ? (
                                  <span className="text-emerald-400 font-bold">Concluído ✓</span>
                                ) : modDoneLessons > 0 ? (
                                  <span className="text-amber-300 font-semibold">Em andamento</span>
                                ) : (
                                  <span className="text-white/55 font-semibold">Não iniciado</span>
                                )}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => openModuleClassroom(originalIdx)}
                            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shrink-0 transition-colors ${isDone
                              ? 'bg-white/10 hover:bg-white/15 text-white'
                              : 'bg-[#ED101C] hover:bg-[#C80B15] text-white shadow-red-glow-sm'
                              }`}
                          >
                            <Play className="w-4 h-4 fill-current" />
                            <span>{isDone ? 'Revisar Módulo' : 'Estudar Módulo'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : aulasSubTab === 'materiais' ? (
                <div className="space-y-3">
                  {allMaterials200h.map((mat) => (
                    <div
                      key={mat.id}
                      className="p-4 sm:p-5 rounded-2xl bg-[#11131A] border border-white/10 hover:border-[#ED101C]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-[#ED101C]/15 border border-[#ED101C]/40 text-[#ED101C] flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <strong className="text-sm sm:text-base text-white block">{mat.titulo}</strong>
                          <span className="text-xs text-white/60">
                            Módulo {mat.moduloNumero} • {mat.tipo} • {mat.tamanho}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleMaterialAccess(mat)}
                        className="px-4 py-2.5 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shrink-0"
                      >
                        <Download className="w-4 h-4" />
                        <span>Baixar PDF</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : aulasSubTab === 'atividades' ? (
                <div className="space-y-3">
                  {activities.map((atv) => (
                    <div
                      key={atv.id}
                      className="p-4 sm:p-5 rounded-2xl bg-[#11131A] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <span className="text-[11px] font-mono font-bold text-[#ED101C]">
                          {atv.modulo} • {atv.tipo}
                        </span>
                        <strong className="text-sm sm:text-base text-white block mt-0.5">
                          {atv.titulo}
                        </strong>
                        <span className="text-xs text-white/60">{atv.prazo}</span>
                      </div>

                      {atv.opensQuiz ? (
                        <button
                          type="button"
                          onClick={() => setAulasSubTab('avaliacao')}
                          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border shrink-0 transition-colors ${quizPassed
                            ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/60'
                            : 'bg-[#ED101C] hover:bg-[#C80B15] border-[#ED101C] text-white'
                            }`}
                        >
                          {quizPassed ? '✓ Aprovado (Ver Prova)' : 'Abrir Avaliação Final'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setActivities((prev) =>
                              prev.map((a) =>
                                a.id === atv.id
                                  ? {
                                    ...a,
                                    status: a.status === 'concluida' ? 'pendente' : 'concluida',
                                  }
                                  : a
                              )
                            )
                          }
                          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border shrink-0 ${atv.status === 'concluida'
                            ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                            : 'bg-[#ED101C] border-[#ED101C] text-white'
                            }`}
                        >
                          {atv.status === 'concluida' ? '✓ Entregue' : 'Marcar como Entregue'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* AVALIAÇÃO FINAL EM TELA PRÓPRIA (NUNCA CORTA O TOPO E TEM BOTÃO ← VOLTAR!) */
                <div className="bg-[#11131A] border border-[#ED101C]/40 rounded-3xl p-5 sm:p-8 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div>
                      <span className="text-xs font-mono font-bold uppercase text-[#ED101C]">
                        Avaliação Oficial • Nota Mínima para Aprovação: 70%
                      </span>
                      <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white mt-0.5">
                        Avaliação Final — Socorrista APH (200h)
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAulasSubTab('modulos')}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-bold"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Voltar aos Módulos</span>
                    </button>
                  </div>

                  {quizPassed && (
                    <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <p className="text-xs sm:text-sm text-emerald-200 font-semibold">
                          Você já foi aprovado nesta avaliação com{' '}
                          <strong className="text-white">{progressState.quizBestPct || 100}%</strong>!
                          Se quiser, pode refazer as questões apenas para treinar.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigateTo('certificado')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0"
                      >
                        Ver Meu Certificado
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleQuizSubmit} className="space-y-5">
                    {QUIZ_QUESTIONS_200H.map((q) => (
                      <div
                        key={q.id}
                        className="p-4 sm:p-5 rounded-2xl bg-[#171A23] border border-white/10 space-y-3"
                      >
                        <p className="font-bold text-sm sm:text-base text-white leading-relaxed">
                          {q.pergunta}
                        </p>
                        <div className="space-y-2">
                          {q.opcoes.map((op, opIdx) => (
                            <label
                              key={op}
                              className={`flex items-center gap-3 p-3 rounded-xl border text-sm cursor-pointer transition-colors ${quizAnswers[q.id] === opIdx
                                ? 'bg-[#ED101C]/20 border-[#ED101C] text-white font-semibold'
                                : 'bg-[#101218] border-white/10 text-white/80 hover:border-white/25'
                                }`}
                            >
                              <input
                                type="radio"
                                name={`questao-${q.id}`}
                                checked={quizAnswers[q.id] === opIdx}
                                onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: opIdx })}
                                className="accent-[#ED101C] w-4 h-4 shrink-0"
                              />
                              <span>{op}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    {quizScore && (
                      <div
                        className={`p-4 rounded-2xl border text-sm ${quizScore.pct >= 70
                          ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                          : 'bg-amber-950/60 border-amber-500/50 text-amber-200'
                          }`}
                      >
                        <strong>
                          Resultado: {quizScore.hits} de {quizScore.total} acertos ({quizScore.pct}%) —{' '}
                          {quizScore.pct >= 70
                            ? 'APROVADO! Requisito concluído.'
                            : 'Você precisa atingir 70%. Revise e tente novamente.'}
                        </strong>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setAulasSubTab('modulos')}
                        className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/85 text-sm font-bold inline-flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Voltar</span>
                      </button>

                      <div className="flex flex-wrap items-center gap-3">
                        {quizPassed && (
                          <button
                            type="button"
                            onClick={() => navigateTo('certificado')}
                            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold"
                          >
                            Ir para Meu Certificado
                          </button>
                        )}
                        <button
                          type="submit"
                          className="px-6 py-3 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-sm font-bold shadow-red-glow-sm"
                        >
                          Enviar e Corrigir Prova
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ) : activeNav === 'agenda' ? (
            /* =================================================================
               TELA 3: CALENDÁRIO E PRESENÇA (ESPAÇO LIMPO P/ NOVO CALENDÁRIO!)
            ================================================================= */
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-1.5 bg-[#11131A] border border-white/10 p-1.5 rounded-2xl w-full sm:max-w-md mx-auto sm:mx-0">
                <button
                  type="button"
                  onClick={() => setAgendaSubTab('calendario')}
                  className={`py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-all ${agendaSubTab === 'calendario'
                    ? 'bg-[#ED101C] text-white shadow-red-glow-sm'
                    : 'text-white/75 hover:text-white'
                    }`}
                >
                  <CalendarIcon className="w-4 h-4 shrink-0" />
                  <span>Calendário</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAgendaSubTab('frequencia')}
                  className={`py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-all ${agendaSubTab === 'frequencia'
                    ? 'bg-[#ED101C] text-white shadow-red-glow-sm'
                    : 'text-white/75 hover:text-white'
                    }`}
                >
                  <UserCheck className="w-4 h-4 shrink-0" />
                  <span>Presença ({FREQUENCIA_PRESENCIAL_DEMO.percentualAtual}%)</span>
                </button>
              </div>

              {agendaSubTab === 'calendario' ? (
                <GlassCourseCalendar
                  calYear={calYear}
                  calMonth={calMonth}
                  selectedDateKey={selectedDateKey}
                  onPrevMonth={goToPrevMonth}
                  onNextMonth={goToNextMonth}
                  onJumpToMonth={jumpToMonth}
                  onSelectDate={setSelectedDateKey}
                />
              ) : (
                <div className="bg-[#11131A] border border-white/10 rounded-3xl p-5 sm:p-7 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-display font-extrabold text-xl text-white">
                        Minha Frequência Presencial
                      </h2>
                      <p className="text-xs sm:text-sm text-white/65">
                        Aulas aos sábados no Prédio da Unicesumar • Frequência mínima exigida: 75%
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-sm font-extrabold">
                        ✓ {FREQUENCIA_PRESENCIAL_DEMO.percentualAtual}% de Presença
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowJustifyForm((v) => !v)}
                        className="px-4 py-2 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 shadow-red-glow-sm transition-colors"
                      >
                        <Paperclip className="w-4 h-4 shrink-0" />
                        <span>
                          {showJustifyForm ? 'Fechar Formulário' : 'Justificar Falta / Atestado'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Formulário Inline Limpo de Justificativa de Falta / Atestado */}
                  {showJustifyForm && (
                    <form
                      onSubmit={handleSubmitJustification}
                      className="p-5 rounded-2xl bg-[#160A0D] border border-[#ED101C]/50 space-y-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-sm sm:text-base text-white">
                          Enviar Justificativa de Falta ou Atestado
                        </strong>
                        <button
                          type="button"
                          onClick={() => setShowJustifyForm(false)}
                          className="text-white/55 hover:text-white p-1"
                          aria-label="Fechar"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-bold text-white/75 mb-1.5">
                            Data da Aula (clique para escolher no calendário)
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowJustifyDatePicker((v) => !v)}
                            className={`w-full bg-[#0A0B0F] border rounded-xl px-3.5 py-2.5 text-sm text-white flex items-center justify-between gap-2 transition-colors ${showJustifyDatePicker
                              ? 'border-[#ED101C] ring-1 ring-[#ED101C]/50'
                              : 'border-white/15 hover:border-[#ED101C]/70'
                              }`}
                          >
                            <span className="inline-flex items-center gap-2 font-semibold">
                              <CalendarIcon className="w-4 h-4 text-[#ED101C] shrink-0" />
                              <span>
                                {(() => {
                                  const [jy, jm, jd] = justifyDate.split('-').map(Number);
                                  const dObj = new Date(jy, jm - 1, jd);
                                  const weekday = [
                                    'Domingo',
                                    'Segunda',
                                    'Terça',
                                    'Quarta',
                                    'Quinta',
                                    'Sexta',
                                    'Sábado',
                                  ][dObj.getDay()];
                                  return `${weekday}, ${String(jd).padStart(2, '0')}/${String(
                                    jm
                                  ).padStart(2, '0')}/${jy}`;
                                })()}
                              </span>
                            </span>
                            <span className="text-[11px] font-bold text-[#FF6B74]">
                              {showJustifyDatePicker ? 'Fechar' : 'Alterar'}
                            </span>
                          </button>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-white/75 mb-1.5">
                            Motivo da Ausência
                          </label>
                          <select
                            value={justifyReason}
                            onChange={(e) => setJustifyReason(e.target.value)}
                            className="w-full bg-[#0A0B0F] border border-white/15 focus:border-[#ED101C] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                          >
                            <option value="Atestado Médico">Atestado Médico</option>
                            <option value="Escala de Trabalho">Escala / Plantão de Trabalho</option>
                            <option value="Motivo Familiar">Motivo Familiar / Emergência</option>
                            <option value="Outro Motivo">Outro Motivo</option>
                          </select>
                        </div>
                      </div>

                      {/* Mini Calendário Visual Direto no Formulário (Sábados de Aula Destacados!) */}
                      {showJustifyDatePicker && (() => {
                        const pickerMonthsPt = [
                          'Janeiro',
                          'Fevereiro',
                          'Março',
                          'Abril',
                          'Maio',
                          'Junho',
                          'Julho',
                          'Agosto',
                          'Setembro',
                          'Outubro',
                          'Novembro',
                          'Dezembro',
                        ];
                        const firstW = new Date(justifyPickerYear, justifyPickerMonth, 1).getDay();
                        const totalD = new Date(
                          justifyPickerYear,
                          justifyPickerMonth + 1,
                          0
                        ).getDate();
                        const courseStart = new Date(2027, 1, 13);
                        const courseEnd = new Date(2027, 9, 16);

                        return (
                          <div className="p-4 rounded-2xl bg-[#0B0C11] border border-[#ED101C]/45 space-y-3 shadow-xl">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-xs font-bold text-white/80">
                                Escolha no calendário o dia da falta{' '}
                                <span className="text-[#FF5A65]">(sábados de aula destacados)</span>:
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (justifyPickerMonth === 0) {
                                      setJustifyPickerMonth(11);
                                      setJustifyPickerYear((y) => y - 1);
                                    } else {
                                      setJustifyPickerMonth((m) => m - 1);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-[#ED101C] text-white transition-colors"
                                  aria-label="Mês anterior"
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                </button>
                                <strong className="text-xs sm:text-sm font-display text-white min-w-[125px] text-center">
                                  {pickerMonthsPt[justifyPickerMonth]} {justifyPickerYear}
                                </strong>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (justifyPickerMonth === 11) {
                                      setJustifyPickerMonth(0);
                                      setJustifyPickerYear((y) => y + 1);
                                    } else {
                                      setJustifyPickerMonth((m) => m + 1);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-[#ED101C] text-white transition-colors"
                                  aria-label="Próximo mês"
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Atalhos rápidos dos meses da turma */}
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                { m: 1, l: 'Fev/27' },
                                { m: 2, l: 'Mar/27' },
                                { m: 3, l: 'Abr/27' },
                                { m: 4, l: 'Mai/27' },
                                { m: 5, l: 'Jun/27' },
                                { m: 6, l: 'Jul/27' },
                                { m: 7, l: 'Ago/27' },
                                { m: 8, l: 'Set/27' },
                                { m: 9, l: 'Out/27' },
                              ].map((chip) => {
                                const isActiveChip =
                                  justifyPickerYear === 2027 && justifyPickerMonth === chip.m;
                                return (
                                  <button
                                    key={chip.l}
                                    type="button"
                                    onClick={() => {
                                      setJustifyPickerYear(2027);
                                      setJustifyPickerMonth(chip.m);
                                    }}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-colors ${isActiveChip
                                      ? 'bg-[#ED101C] text-white'
                                      : 'bg-white/5 text-white/65 hover:text-white hover:bg-white/10'
                                      }`}
                                  >
                                    {chip.l}
                                  </button>
                                );
                              })}
                            </div>

                            <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold text-white/50">
                              <span>Dom</span>
                              <span>Seg</span>
                              <span>Ter</span>
                              <span>Qua</span>
                              <span>Qui</span>
                              <span>Sex</span>
                              <span className="text-[#FF4B57]">Sáb</span>
                            </div>

                            <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                              {Array.from({ length: firstW }).map((_, idx) => (
                                <div key={`jp-empty-${idx}`} />
                              ))}
                              {Array.from({ length: totalD }, (_, i) => i + 1).map((day) => {
                                const isoKey = `${justifyPickerYear}-${String(
                                  justifyPickerMonth + 1
                                ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const dObj = new Date(justifyPickerYear, justifyPickerMonth, day);
                                const isClassSaturday =
                                  dObj.getDay() === 6 && dObj >= courseStart && dObj <= courseEnd;
                                const isSelected = justifyDate === isoKey;

                                return (
                                  <button
                                    key={isoKey}
                                    type="button"
                                    onClick={() => {
                                      setJustifyDate(isoKey);
                                      setShowJustifyDatePicker(false);
                                    }}
                                    className={`py-2 rounded-xl font-bold flex flex-col items-center justify-center transition-all ${isSelected
                                      ? 'bg-[#ED101C] text-white ring-2 ring-white/80 shadow-red-glow-sm'
                                      : isClassSaturday
                                        ? 'bg-[#ED101C]/20 border border-[#ED101C]/70 text-white hover:bg-[#ED101C]/40'
                                        : 'bg-white/[0.04] text-white/75 hover:bg-white/15 hover:text-white'
                                      }`}
                                  >
                                    <span>{day}</span>
                                    {isClassSaturday && (
                                      <span className="text-[8px] font-mono uppercase tracking-tight opacity-90">
                                        Aula
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}

                      <div>
                        <label className="block text-xs font-bold text-white/75 mb-1.5">
                          Observação para a Coordenação (opcional)
                        </label>
                        <textarea
                          rows={2}
                          value={justifyDetails}
                          onChange={(e) => setJustifyDetails(e.target.value)}
                          placeholder="Ex: Estava de plantão / anexei o atestado médico..."
                          className="w-full bg-[#0A0B0F] border border-white/15 focus:border-[#ED101C] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <label
                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${justifyFileName
                              ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-300'
                              : 'bg-white/5 hover:bg-white/10 border-white/15 text-white/90'
                              }`}
                          >
                            <Paperclip className="w-4 h-4 shrink-0" />
                            <span className="truncate max-w-[230px]">
                              {justifyFileName
                                ? `✓ ${justifyFileName} (${justifyFileSize})`
                                : 'Anexar Foto ou PDF do Atestado'}
                            </span>
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              className="hidden"
                              onChange={handleJustifyFileSelect}
                            />
                          </label>

                          {justifyFileName && (
                            <button
                              type="button"
                              onClick={() => {
                                if (justifyFileId) deleteFileFromVault(justifyFileId);
                                setJustifyFileId('');
                                setJustifyFileName('');
                                setJustifyFileSize('');
                                setJustifyFileType('');
                                setJustifyFileDataUrl('');
                              }}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-white/65 hover:text-white"
                              title="Remover arquivo selecionado"
                              aria-label="Remover arquivo selecionado"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Botão Único 2-em-1: Registra no Painel/Admin + Já abre o WhatsApp da Coordenação */}
                        <button
                          type="submit"
                          className="px-5 py-3 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shadow-red-glow-sm shrink-0 transition-colors"
                        >
                          <Send className="w-4 h-4 shrink-0" />
                          <span>Registrar e Avisar no WhatsApp</span>
                        </button>
                      </div>

                      <p className="text-[11px] text-white/55 leading-relaxed">
                        Ao clicar acima, sua justificativa fica <strong className="text-white/80">registrada no sistema para a Secretaria</strong> e já abre o <strong className="text-white/80">WhatsApp da coordenação</strong> preenchido para aviso imediato.
                      </p>
                    </form>
                  )}

                  <div className="space-y-2.5">
                    {FREQUENCIA_PRESENCIAL_DEMO.ultimosSabados.map((sab) => (
                      <div
                        key={sab.data}
                        className="p-4 rounded-2xl bg-[#171A23] border border-white/10 flex items-center justify-between gap-3"
                      >
                        <div>
                          <strong className="text-sm text-white block">{sab.tema}</strong>
                          <span className="text-xs font-mono text-white/55">{sab.data}</span>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 ${sab.status === 'presente'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}
                        >
                          {sab.status === 'presente' ? '✓ Presente' : 'Justificada'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {justifications.length > 0 && (
                    <div className="pt-4 border-t border-white/10 space-y-2.5">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white/60">
                        Minhas Justificativas Enviadas ({justifications.length})
                      </h3>
                      {justifications.map((item) => {
                        const isConfirming = confirmDeleteJustId === item.id;
                        return (
                          <div
                            key={item.id}
                            className="p-4 rounded-2xl bg-[#141720] border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <strong className="text-sm text-white block">
                                Aula de {item.data} — {item.motivo}
                              </strong>
                              <span className="text-xs text-white/65 block mt-0.5">
                                {item.detalhes} •{' '}
                                {item.anexo
                                  ? `Anexo: ${item.anexo}${item.anexoTamanho ? ` (${item.anexoTamanho})` : ''}`
                                  : 'Sem arquivo anexado'}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 shrink-0">
                              {(item.anexoFileId || item.anexoDataUrl) && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleOpenAttachment({
                                      fileId: item.anexoFileId,
                                      dataUrl: item.anexoDataUrl,
                                      name: item.anexo,
                                      type: item.anexoTipo,
                                    })
                                  }
                                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                                >
                                  <FileText className="w-3.5 h-3.5 text-[#ED101C]" />
                                  <span>Ver Anexo</span>
                                </button>
                              )}

                              <span className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold">
                                {item.status}
                              </span>

                              {isConfirming ? (
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveJustification(item.id, item.data)}
                                    className="px-3 py-1.5 rounded-lg bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs font-bold transition-colors"
                                  >
                                    Sim, remover
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteJustId(null)}
                                    className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/80 text-xs font-semibold transition-colors"
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteJustId(item.id)}
                                  title="Cancelar e remover esta justificativa"
                                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#ED101C]/20 border border-white/15 hover:border-[#ED101C]/60 text-white/75 hover:text-[#FF6B74] text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Remover</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : activeNav === 'certificado' ? (
            /* =================================================================
               TELA 4: MEU CERTIFICADO (200H) COM TRAVA TRANSPARENTE DE 3 REQUISITOS
            ================================================================= */
            <div className="bg-[#11131A] border border-[#ED101C]/45 rounded-3xl p-5 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs font-mono font-bold uppercase text-amber-400">
                    Certificado Oficial • 200 Horas • Lei nº 9.394/96 (LDB)
                  </span>
                  <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white mt-0.5">
                    Diploma — Curso de Socorrista APH
                  </h2>
                </div>
                <span
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold border ${progressStats.certificateUnlocked
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                    : certRequest?.status === 'pending'
                    ? 'bg-amber-950/60 border-amber-400/60 text-amber-300'
                    : 'bg-amber-950/50 border-amber-500/50 text-amber-300'
                    }`}
                >
                  {progressStats.certificateUnlocked ? (
                    <>
                      <Unlock className="w-4 h-4" />
                      <span>Autorizado e Liberado ✓</span>
                    </>
                  ) : certRequest?.status === 'pending' ? (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>Em Conferência pela Coordenação</span>
                    </>
                  ) : progressStats.requirementsMet ? (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Pronto para Solicitar Liberação</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Requisitos em Andamento</span>
                    </>
                  )}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div
                  className={`p-4 rounded-2xl border ${progressStats.modulesOk
                    ? 'bg-emerald-950/30 border-emerald-500/45'
                    : 'bg-[#171A23] border-white/10'
                    }`}
                >
                  <span className="text-xs text-white/60 block">1. Módulos (200h)</span>
                  <strong
                    className={`text-base mt-1 block ${progressStats.modulesOk ? 'text-emerald-300' : 'text-white'
                      }`}
                  >
                    {progressStats.completedCount} de 11 concluídos
                    {progressStats.modulesOk ? ' ✓' : ''}
                  </strong>
                </div>
                <div className="p-4 rounded-2xl border bg-emerald-950/30 border-emerald-500/45">
                  <span className="text-xs text-white/60 block">2. Frequência Presencial</span>
                  <strong className="text-base text-emerald-300 mt-1 block">
                    {FREQUENCIA_PRESENCIAL_DEMO.percentualAtual}% (Mínimo 75%) ✓
                  </strong>
                </div>
                <div
                  className={`p-4 rounded-2xl border ${quizPassed
                    ? 'bg-emerald-950/30 border-emerald-500/45'
                    : 'bg-[#171A23] border-white/10'
                    }`}
                >
                  <span className="text-xs text-white/60 block">3. Avaliação Final</span>
                  <strong
                    className={`text-base mt-1 block ${quizPassed ? 'text-emerald-300' : 'text-white'
                      }`}
                  >
                    {quizPassed ? `Aprovado (${progressState.quizBestPct || 100}%) ✓` : 'Pendente (≥ 70%)'}
                  </strong>
                </div>
              </div>

              {/* ETAPA 4: CONFERÊNCIA E AUTORIZAÇÃO OBRIGATÓRIA DO SUPERVISOR (CLEVE) */}
              {!progressStats.requirementsMet ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#18080B] border border-[#ED101C]/45 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-xs sm:text-sm text-white/85">
                    Assim que completar os 3 requisitos acima, você poderá solicitar a conferência oficial da Coordenação para liberar a impressão A4 do seu diploma.
                  </p>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowCertPreviewMode(!showCertPreviewMode)}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold"
                    >
                      {showCertPreviewMode ? 'Ocultar Prévia' : 'Ver Prévia'}
                    </button>
                    <button
                      type="button"
                      onClick={simulateFullApprovalForTest}
                      className="px-4 py-2.5 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs font-bold"
                    >
                      Simular 100% Concluído (Teste)
                    </button>
                  </div>
                </div>
              ) : !progressStats.certificateUnlocked ? (
                certRequest?.status === 'pending' ? (
                  <div className="p-5 sm:p-6 rounded-2xl bg-amber-950/35 border border-amber-400/55 space-y-3">
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-amber-300 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <strong className="text-base text-amber-200 block">
                          Solicitação enviada para a Coordenação (Cleverson da Cruz)!
                        </strong>
                        <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                          Recebemos seu pedido de emissão no dia <strong>{certRequest.requestedAt}</strong> para{' '}
                          <strong className="text-white">{session.nome}</strong> (CPF{' '}
                          <strong className="font-mono text-white">{session.cpf}</strong>). Assim que o coordenador conferir seus dados oficiais e autorizar no Painel Administrativo, o botão de impressão A4 será liberado automaticamente aqui!
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowCertPreviewMode(!showCertPreviewMode)}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold"
                      >
                        {showCertPreviewMode ? 'Ocultar Prévia do Diploma' : 'Ver Prévia (sem impressão)'}
                      </button>
                      <a
                        href={getWhatsAppUrl(
                          `Olá! Sou ${session.nome} (CPF ${session.cpf}). Acabei de concluir os 11 módulos (200h) e solicitei a liberação do meu Certificado no Portal do Aluno.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-[#ED101C] border border-white/15 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Avisar Coordenação no WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#1D080C] to-[#141722] border border-[#ED101C]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      {certRequest?.status === 'rejected' && (
                        <span className="inline-block text-xs font-bold text-[#FF6B74] mb-1">
                          ⚠️ {certRequest.reviewerNote}
                        </span>
                      )}
                      <strong className="text-base sm:text-lg text-white block">
                        Parabéns! Todos os requisitos de 200h foram concluídos ✓
                      </strong>
                      <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                        Clique no botão ao lado para enviar seu pedido à Coordenação. O diretor <strong>Cleverson da Cruz</strong> vai conferir seu nome (<strong>{session.nome}</strong>) e CPF (<strong>{session.cpf}</strong>) e liberar o seu Certificado Oficial para impressão.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRequestCertificateRelease}
                      className="btn-magnetic cta-btn-shimmer px-6 py-3.5 rounded-2xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-sm font-extrabold inline-flex items-center justify-center gap-2 shrink-0 shadow-red-glow"
                    >
                      <Award className="w-5 h-5 shrink-0" />
                      <span>Solicitar Emissão do Certificado</span>
                    </button>
                  </div>
                )
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <p className="text-xs sm:text-sm text-emerald-200 font-semibold">
                    Certificado conferido e <strong>autorizado pela Coordenação BLACK Treinamentos</strong>! Seu diploma oficial (Frente e Verso — 200h) está pronto para visualização e impressão A4.
                  </p>
                </div>
              )}

              {(progressStats.certificateUnlocked || showCertPreviewMode) && (
                <OfficialCertificateViewer
                  studentName={session.nome}
                  studentCpf={session.cpf}
                  periodStart="13/02/2027"
                  periodEnd="16/10/2027"
                  issueDate="18 de Outubro de 2027."
                  defaultTab="ambos"
                  showPrintButton={progressStats.certificateUnlocked}
                />
              )}
            </div>
          ) : activeNav === 'financeiro' ? (
            /* =================================================================
               TELA 5: FINANCEIRO (10X) — TRANSPARÊNCIA TOTAL, BOLETOS E ANTECIPAÇÃO
            ================================================================= */
            <div className="bg-[#11131A] border border-white/10 rounded-3xl p-4 sm:p-7 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center sm:text-left">
                <div>
                  <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                    Minhas Parcelas e Boletos (Até 10x)
                  </h2>
                  <p className="text-xs sm:text-sm text-white/65">
                    Visualize todos os boletos anexados pela Secretaria, copie o PIX ou adiante parcelas futuras.
                  </p>
                </div>
                <span className="self-center sm:self-auto px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm font-bold shrink-0">
                  {financeSummary.pagasCount} de {installments.length} pagas • Em dia
                </span>
              </div>

              {/* Faixa Discreta de Resumo Financeiro em 1 Segundo */}
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5 text-center sm:text-left">
                <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-950/25 border border-emerald-500/35">
                  <span className="text-[10.5px] sm:text-[11px] text-white/60 block">Pagas</span>
                  <strong className="text-xs sm:text-base font-extrabold text-emerald-300">
                    {financeSummary.pagasCount} <span className="hidden xs:inline sm:inline">parc.</span>
                    <span className="hidden sm:inline font-mono text-xs">
                      {' '}({formatMoneyBRL(financeSummary.pagasTotal)})
                    </span>
                  </strong>
                </div>
                <div className="p-2.5 sm:p-3 rounded-2xl bg-[#1C080B] border border-[#ED101C]/50">
                  <span className="text-[10.5px] sm:text-[11px] text-white/60 block">Em aberto</span>
                  <strong className="text-xs sm:text-base font-extrabold text-[#FF5A65]">
                    {financeSummary.abertasCount} <span className="hidden xs:inline sm:inline">parc.</span>
                    <span className="hidden sm:inline font-mono text-xs">
                      {' '}({formatMoneyBRL(financeSummary.abertasTotal)})
                    </span>
                  </strong>
                </div>
                <div className="p-2.5 sm:p-3 rounded-2xl bg-[#171A23] border border-white/10">
                  <span className="text-[10.5px] sm:text-[11px] text-white/60 block">A vencer</span>
                  <strong className="text-xs sm:text-base font-extrabold text-white/90">
                    {financeSummary.futurasCount} <span className="hidden xs:inline sm:inline">parc.</span>
                    <span className="hidden sm:inline font-mono text-xs">
                      {' '}({formatMoneyBRL(financeSummary.futurasTotal)})
                    </span>
                  </strong>
                </div>
              </div>

              <div className="space-y-2.5">
                {installments.map((p) => {
                  const hasBoleto = Boolean(p.boletoFileId || p.boletoDataUrl || p.boletoNome);
                  return (
                    <div
                      key={p.numero}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        p.status === 'atrasada'
                          ? 'bg-[#1F070A] border-[#ED101C]/80'
                          : p.status === 'aberta'
                            ? 'bg-[#1D1508] border-amber-400/65'
                            : 'bg-[#171A23] border-white/10'
                        }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 font-mono text-xs font-extrabold text-white flex items-center justify-center shrink-0">
                          {String(p.numero).padStart(2, '0')}/10
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <strong className="text-sm sm:text-base text-white">
                              Parcela {p.numero} — {p.valor}
                            </strong>
                            {p.status === 'atrasada' && (
                              <span className="px-2 py-0.5 rounded-full bg-[#ED101C]/20 border border-[#ED101C]/60 text-[#FF6B74] text-[10px] font-bold">
                                ⚠ Em Atraso
                              </span>
                            )}
                            {p.status === 'aberta' && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] font-bold">
                                Em Aberto
                              </span>
                            )}
                            {hasBoleto && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                                Boleto disponível ✓
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-white/60 block mt-0.5">
                            Vencimento: {p.vencimento} • {p.metodo}
                            {p.boletoNome ? ` • ${p.boletoNome}` : ''}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {/* Botão de Ver/Baixar Boleto sempre que o professor anexar (PDF ou Imagem!) */}
                        {hasBoleto && (
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
                            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5 text-[#FF5A65]" />
                            <span>Ver Boleto</span>
                          </button>
                        )}

                        {p.status === 'paga' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setReceiptModalParcela(p)}
                              className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-600 border border-emerald-400/45 text-emerald-300 hover:text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-all"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Ver Comprovante</span>
                            </button>
                            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                              ✓ Paga
                            </span>
                          </>
                        ) : p.status === 'aberta' || p.status === 'atrasada' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleCopyPix(p)}
                              className="px-4 py-2 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar PIX</span>
                            </button>
                            {!hasBoleto && (
                              <a
                                href={getWhatsAppUrl(
                                  `Olá! Sou ${session.nome} e gostaria do boleto da parcela ${p.numero}/10 (vencimento ${p.vencimento}).`
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold"
                              >
                                Pedir Boleto
                              </a>
                            )}
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setAdvanceParcela(p)}
                            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-white/85 hover:text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                          >
                            <span>Adiantar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : activeNav === 'ajuda' ? (
            /* =================================================================
               TELA 6: AVISOS DA DIRETORIA + SUPORTE WHATSAPP NUM SÓ LUGAR
            ================================================================= */
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#190609] to-[#11131A] border border-[#ED101C]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div>
                  <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                    Precisa de ajuda com o curso?
                  </h2>
                  <p className="text-sm text-white/75 mt-1">
                    Fale direto com a equipe da BLACK Treinamentos pelo WhatsApp oficial.
                  </p>
                </div>
                <a
                  href={getWhatsAppUrl(
                    `Olá! Sou ${session.nome}, aluno do Curso de Socorrista APH (200h), e preciso de suporte.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-magnetic cta-btn-shimmer px-6 py-3.5 rounded-2xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-sm font-bold inline-flex items-center justify-center gap-2 shrink-0 shadow-red-glow"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp • {BRAND_CONFIG.whatsappDisplay}</span>
                </a>
              </div>

              <div
                id="comunicados-oficiais-card"
                className={`bg-[#11131A] border rounded-3xl p-5 sm:p-7 space-y-4 transition-all duration-500 ${noticesPulse
                  ? 'border-[#ED101C] ring-2 ring-[#ED101C]/60 shadow-[0_0_35px_rgba(237,16,28,0.45)]'
                  : 'border-white/10'
                  }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-white">
                      Comunicados Oficiais da Turma
                    </h3>
                    <p className="text-xs text-white/55 mt-0.5">
                      {unreadNotices > 0
                        ? `Você tem ${unreadNotices} ${unreadNotices === 1 ? 'notificação nova' : 'notificações novas'} — clique em cima para abrir e marcar como lida.`
                        : 'Você já visualizou todas as notificações.'}
                    </p>
                  </div>
                  {unreadNotices > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllNoticesRead}
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-xs font-bold text-white/85 transition-colors"
                    >
                      Marcar todas como lidas
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {visibleAnnouncements.map((com) => {
                    const isRead = readNoticeIds.includes(com.id);
                    const isOpened = openedNoticeId === com.id;
                    const isDirect = com.targetType === 'selected';
                    return (
                      <button
                        key={com.id}
                        type="button"
                        onClick={() => handleOpenNotice(com.id)}
                        className={`w-full text-left p-5 rounded-2xl border space-y-2 transition-all duration-200 active:scale-[0.985] cursor-pointer ${!isRead
                          ? 'bg-gradient-to-r from-[#210A0E] to-[#171A23] border-[#ED101C]/70 hover:border-[#ED101C] shadow-[0_0_24px_rgba(237,16,28,0.16)]'
                          : isOpened
                            ? 'bg-[#1A1E29] border-white/25 ring-1 ring-white/20'
                            : 'bg-[#14161E] border-white/10 hover:border-white/20'
                          }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[#ED101C]">
                              {com.data}
                            </span>
                            {isDirect && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[10px] font-bold">
                                Mensagem direta para você
                              </span>
                            )}
                          </div>
                          {!isRead ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ED101C] text-white text-[10px] font-extrabold uppercase tracking-wide shadow-[0_0_12px_rgba(237,16,28,0.65)]">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                              <span>Nova • Clique para abrir</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Lida</span>
                            </span>
                          )}
                        </div>

                        <h4 className="font-display font-bold text-base text-white">
                          {com.titulo}
                        </h4>

                        <p
                          className={`text-sm leading-relaxed transition-colors ${!isRead || isOpened ? 'text-white/90' : 'text-white/65'
                            }`}
                        >
                          {com.mensagem}
                        </p>

                        <span className="block text-xs text-white/50 font-semibold pt-1">
                          — {com.autor}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* =================================================================
               TELA 7: MEU PERFIL (DADOS TRAVADOS DO DIPLOMA + DECLARAÇÃO DE MATRÍCULA)
            ================================================================= */
            <div className="space-y-6">
              <div className="bg-[#11131A] border border-white/10 rounded-3xl p-5 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                      Meu Perfil e Documentos
                    </h2>
                    <p className="text-xs sm:text-sm text-white/65">
                      Nome e CPF são vinculados à sua matrícula oficial para emissão do Certificado (200h).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateTo('inicio')}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs sm:text-sm font-bold text-white inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Início</span>
                  </button>
                </div>

                {/* Foto de Perfil (Opcional) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#161922] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={session.nome}
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#ED101C]/75 shadow-lg shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ED101C] to-[#7D060D] border-2 border-[#FF5A65]/50 text-white text-xl font-display font-extrabold flex items-center justify-center shadow-lg shrink-0">
                        {studentInitials}
                      </div>
                    )}
                    <div>
                      <strong className="text-sm sm:text-base text-white block">
                        Foto de Perfil <span className="text-xs font-normal text-white/50">(opcional)</span>
                      </strong>
                      <span className="text-xs text-white/60 block mt-0.5">
                        Adicione uma foto sua para aparecer no seu perfil do Portal do Aluno.
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <label className="px-4 py-2 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{avatarUrl ? 'Trocar Foto' : 'Inserir Foto'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-white/75 hover:text-white text-xs font-semibold transition-colors"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                </div>

                {/* Aviso Discreto de Segurança do Diploma */}
                <div className="p-4 rounded-2xl bg-[#171A23] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                      Para segurança do seu Diploma Oficial (Lei nº 9.394/96), <strong className="text-white">Nome Completo e CPF</strong> são protegidos pela Secretaria. Se houver qualquer erro de grafia, solicite a correção abaixo.
                    </p>
                  </div>
                  <a
                    href={getWhatsAppUrl(
                      `Olá! Sou ${session.nome} (CPF: ${session.cpf}), aluno do Curso de Socorrista APH (200h), e preciso solicitar correção nos meus dados oficiais de matrícula.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#ED101C] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Solicitar Correção</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center justify-between text-xs font-bold text-white/75 mb-1.5">
                      <span>Nome Completo no Certificado</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-300">
                        <Lock className="w-3 h-3" /> Protegido
                      </span>
                    </label>
                    <input
                      type="text"
                      value={session.nome}
                      readOnly
                      disabled
                      className="w-full bg-[#0A0B0F]/70 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/75 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="flex items-center justify-between text-xs font-bold text-white/75 mb-1.5">
                      <span>CPF</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-300">
                        <Lock className="w-3 h-3" /> Protegido
                      </span>
                    </label>
                    <input
                      type="text"
                      value={session.cpf}
                      readOnly
                      disabled
                      className="w-full bg-[#0A0B0F]/70 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/75 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/75 mb-1.5">
                      E-mail de Acesso (editável)
                    </label>
                    <input
                      type="email"
                      value={session.email}
                      onChange={(e) => updateProfileField('email', e.target.value)}
                      className="w-full bg-[#0A0B0F] border border-white/15 focus:border-[#ED101C] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/75 mb-1.5">
                      WhatsApp (editável)
                    </label>
                    <input
                      type="tel"
                      value={session.telefone}
                      onChange={(e) => updateProfileField('telefone', e.target.value)}
                      className="w-full bg-[#0A0B0F] border border-white/15 focus:border-[#ED101C] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-sm font-bold text-white/80 inline-flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-[#ED101C]" />
                    <span>Sair da Conta</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      showToast('Seus dados de contato foram salvos com sucesso!', 'success');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-sm font-bold inline-flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Salvar Dados de Contato</span>
                  </button>
                </div>
              </div>

              {/* Card Limpo: Declaração de Matrícula (1 Clique para Trabalho / Faculdade) */}
              <div className="bg-[#11131A] border border-white/10 rounded-3xl p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#ED101C]/15 border border-[#ED101C]/45 text-[#ED101C] flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
                      Declaração de Matrícula (Comprovante Oficial)
                    </h3>
                    <p className="text-xs sm:text-sm text-white/65 mt-0.5 max-w-xl">
                      Emita em 1 clique a declaração oficial do seu vínculo no Curso de Socorrista APH (200h) para apresentar na empresa, trabalho ou faculdade.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handlePrintEnrollmentDeclaration}
                  className="px-5 py-3 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shrink-0 shadow-red-glow-sm"
                >
                  <Printer className="w-4 h-4 shrink-0" />
                  <span>Emitir Declaração (PDF)</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL DE COMPROVANTE OFICIAL DE PAGAMENTO (CARD BLACK TREINAMENTOS) */}
      <PaymentReceiptModal
        parcela={receiptModalParcela}
        studentName={session.nome}
        studentCpf={session.cpf}
        onClose={() => setReceiptModalParcela(null)}
      />

      {/* MODAL LIMPO DE VISUALIZAÇÃO DO ATESTADO / BOLETO (PDF OU IMAGEM) */}
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
                <strong className="text-sm text-white truncate">
                  Arquivo: {previewAttachment.name}
                </strong>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={previewAttachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Abrir em Nova Aba</span>
                  </a>
                  <a
                    href={previewAttachment.url}
                    download={previewAttachment.name}
                    className="px-3 py-1.5 rounded-lg bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar</span>
                  </a>
                  <button
                    type="button"
                    onClick={closePreviewAttachment}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-[#ED101C] text-white transition-colors"
                    aria-label="Fechar anexo"
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

      {/* MODAL LIMPO DE ANTECIPAÇÃO DE PARCELA (VALOR FIXO DO BOLETO + NEGOCIAÇÃO OPCIONAL) */}
      {advanceParcela && (() => {
        const baseCentavos = advanceParcela.valorCentavos || 18000;
        const valorTexto = formatMoneyBRL(baseCentavos);
        const hasBoleto = Boolean(
          advanceParcela.boletoFileId || advanceParcela.boletoDataUrl || advanceParcela.boletoNome
        );

        return (
          <div
            className="fixed inset-0 z-[95] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-md rounded-3xl bg-[#12131A] border border-white/15 p-6 space-y-5 shadow-[0_24px_65px_rgba(0,0,0,0.9)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase text-[#FF5A65]">
                    Antecipar Pagamento
                  </span>
                  <h3 className="font-display font-extrabold text-xl text-white">
                    Parcela {advanceParcela.numero}/10
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setAdvanceParcela(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-[#ED101C] text-white"
                  aria-label="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#181B24] border border-white/10 space-y-2 text-sm">
                <div className="flex justify-between text-white/75">
                  <span>Vencimento original:</span>
                  <strong className="text-white">{advanceParcela.vencimento}</strong>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                  <span className="font-bold text-white">Valor da parcela:</span>
                  <strong className="font-display font-extrabold text-xl text-white">
                    {valorTexto}
                  </strong>
                </div>
              </div>

              <div className="space-y-2.5">
                {hasBoleto && (
                  <button
                    type="button"
                    onClick={() => {
                      const p = advanceParcela;
                      setAdvanceParcela(null);
                      handleOpenAttachment({
                        fileId: p.boletoFileId,
                        dataUrl: p.boletoDataUrl,
                        name: p.boletoNome || `Boleto_Parcela_${p.numero}.pdf`,
                        type: p.boletoTipo,
                      });
                    }}
                    className="w-full py-3 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-sm font-extrabold inline-flex items-center justify-center gap-2 shadow-red-glow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Ver / Baixar Boleto desta Parcela</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    handleCopyPix(advanceParcela, valorTexto);
                    setAdvanceParcela(null);
                  }}
                  className={`w-full py-3 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2 ${
                    hasBoleto
                      ? 'bg-white/10 hover:bg-white/15 text-white'
                      : 'bg-[#ED101C] hover:bg-[#C80B15] text-white shadow-red-glow-sm'
                  }`}
                >
                  <Copy className="w-4 h-4" />
                  <span>Copiar PIX ({valorTexto})</span>
                </button>

                <a
                  href={getWhatsAppUrl(
                    `Olá! Sou ${session.nome} (CPF ${session.cpf}) e gostaria de conversar sobre adiantar a Parcela ${advanceParcela.numero}/10 (vencimento ${advanceParcela.vencimento}).`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/85 hover:text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#ED101C]" />
                  <span>Falar com a Secretaria sobre quitação / várias parcelas</span>
                </a>
              </div>
            </div>
          </div>
        );
      })()}

      {/* POPUP CENTRAL COM FUNDO DESFOCADO — RESULTADO / AVISO DA AVALIAÇÃO FINAL */}
      {quizModal && (
        <div
          className="fixed inset-0 z-[95] bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className={`w-full max-w-md rounded-3xl p-6 sm:p-7 text-center space-y-5 shadow-[0_24px_70px_rgba(0,0,0,0.9)] border backdrop-blur-xl ${quizModal.type === 'passed'
              ? 'bg-gradient-to-b from-[#0E2419]/95 to-[#0D1016]/95 border-emerald-400/60 shadow-[0_0_50px_rgba(16,185,129,0.28)]'
              : quizModal.type === 'failed'
                ? 'bg-gradient-to-b from-[#2A090E]/95 to-[#0D1016]/95 border-[#ED101C]/70 shadow-[0_0_50px_rgba(237,16,28,0.3)]'
                : 'bg-gradient-to-b from-[#261A08]/95 to-[#0D1016]/95 border-amber-400/65 shadow-[0_0_50px_rgba(245,158,11,0.25)]'
              }`}
          >
            <div className="flex justify-center">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${quizModal.type === 'passed'
                  ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-300'
                  : quizModal.type === 'failed'
                    ? 'bg-[#ED101C]/20 border-[#ED101C]/65 text-[#FF5A65]'
                    : 'bg-amber-500/20 border-amber-400/60 text-amber-300'
                  }`}
              >
                {quizModal.type === 'passed' ? (
                  <Trophy className="w-8 h-8" />
                ) : (
                  <AlertCircle className="w-8 h-8" />
                )}
              </div>
            </div>

            {quizModal.type === 'missing' ? (
              <>
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                    Faltam Respostas
                  </span>
                  <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                    Responda todas as perguntas!
                  </h3>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Você deixou{' '}
                    <strong className="text-amber-300">
                      {quizModal.missingQuestions.length} pergunta(s)
                    </strong>{' '}
                    em branco (Questão{' '}
                    <strong className="text-white">
                      {quizModal.missingQuestions.join(', ')}
                    </strong>
                    ). Marque todas antes de corrigir a prova.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setQuizModal(null)}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-colors"
                >
                  Voltar e Completar Prova
                </button>
              </>
            ) : quizModal.type === 'passed' ? (
              <>
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                    Avaliação Final Concluída
                  </span>
                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                    Parabéns! Aprovado!
                  </h3>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-mono font-extrabold text-lg">
                    <span>{quizModal.pct}%</span>
                    <span className="text-xs font-sans font-semibold text-emerald-200">
                      ({quizModal.hits} de {quizModal.total} acertos)
                    </span>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed pt-1">
                    Você atingiu a nota mínima de 70% e concluiu o requisito oficial da Avaliação Final!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setQuizModal(null)}
                    className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition-colors"
                  >
                    Fechar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQuizModal(null);
                      navigateTo('certificado');
                    }}
                    className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm transition-colors"
                  >
                    Ir para Meu Certificado
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF5A65]">
                    Nota Insuficiente
                  </span>
                  <h3 className="font-display font-extrabold text-2xl text-white">
                    Você ainda não atingiu 70%
                  </h3>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ED101C]/20 border border-[#ED101C]/60 text-[#FF6B74] font-mono font-extrabold text-lg">
                    <span>{quizModal.pct}%</span>
                    <span className="text-xs font-sans font-semibold text-white/80">
                      ({quizModal.hits} de {quizModal.total} acertos)
                    </span>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed pt-1">
                    Para ser aprovado na Avaliação Final você precisa atingir pelo menos{' '}
                    <strong className="text-white">70%</strong>. Revise as respostas e tente novamente!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setQuizModal(null)}
                  className="w-full py-3.5 rounded-2xl bg-[#ED101C] hover:bg-[#C80B15] text-white font-extrabold text-sm shadow-red-glow-sm transition-colors"
                >
                  Revisar e Tentar Novamente
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* BARRA INFERIOR NATIVA ESTILO APP NO CELULAR (< LG) */}
      <nav
        className="lg:hidden fixed bottom-3 left-3 right-3 z-40 bg-[#0D0E14]/95 backdrop-blur-xl border border-[#ED101C]/45 rounded-2xl px-2 py-1.5 grid grid-cols-5 gap-1 shadow-[0_12px_35px_rgba(0,0,0,0.9)]"
        aria-label="Navegação mobile"
      >
        {[
          { id: 'inicio', label: 'Início', icon: Home },
          { id: 'aulas', label: 'Aulas', icon: BookOpen },
          { id: 'agenda', label: 'Agenda', icon: CalendarIcon },
          { id: 'financeiro', label: 'Parcelas', icon: CreditCard },
          { id: 'certificado', label: 'Diploma', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeNav === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => navigateTo(tab.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${active ? 'text-[#ED101C] bg-[#ED101C]/10' : 'text-white/65'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-bold mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
