import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Home,
  BookOpen,
  Calendar as CalendarIcon,
  Award,
  CreditCard,
  Headphones,
  Search,
  Play,
  Pause,
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
  Users,
  Paperclip,
  Printer,
  ShieldCheck,
  Send,
  Trophy,
  Trash2,
  Camera,
  ExternalLink,
  Star,
  Maximize2,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Check,
  PanelRightOpen,
  Volume2,
  VolumeX,
  Captions,
  Settings,
  PictureInPicture2,
  Maximize,
  Minimize,
  MessageSquare,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';
import { BRAND_CONFIG, getWhatsAppUrl } from '../data/blackData';
import {
  FREQUENCIA_PRESENCIAL_DEMO,
  QUIZ_QUESTIONS_200H,
} from '../data/courseContent200h';
import {
  getCourseCatalog200h,
  loadCourseModules200h,
  saveCourseModules200h,
  loadStudentSession,
  saveStudentSession,
  loadStudentProgress,
  saveStudentProgress,
  loadModuleNotes,
  saveModuleNotes,
  loadLessonRatings,
  saveLessonRatings,
  loadLessonComments,
  saveLessonComments,
  buildLessonStudentColorMap,
  getLessonParticipantColor,
  loadChatNotifications,
  pushChatNotification,
  loadReadChatNotifIds,
  saveReadChatNotifIds,
  loadAbsenceJustifications,
  saveAbsenceJustifications,
  loadAnnouncements,
  loadReadNoticeIds,
  saveReadNoticeIds,
  loadStudentInstallments,
  saveStudentInstallments,
  loadStudentAvatar,
  saveStudentAvatar,
  loadCertificateRequests,
  saveCertificateRequests,
  getStudentCertificateRequest,
  hasCustomStudentPassword,
  changeStudentPassword,
  updateStudentProfileContact,
  validateStrongPassword,
  logoutStudent,
} from '../services/lmsContentService';
import {
  saveFileToVault,
  loadFileUrlFromVault,
  deleteFileFromVault,
} from '../services/localFileVault';
import OfficialCertificateViewer from './OfficialCertificateViewer';
import StudentLoginScreen from './StudentLoginScreen';
import GlassCourseCalendar, {
  Justify3DDatePicker,
  getFirstClassDayInMonth,
  getCourseEventForDate,
} from './GlassCourseCalendar';
import PaymentReceiptModal from './PaymentReceiptModal';
import FinancePaymentModal, { getDueInfo } from './FinancePaymentModal';
import { pushOverlayHistory, dismissOverlayHistory } from '../utils/navigationHistory';

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

  // Tela dedicada de Sala de Aula (Modo Cinema direto ao clicar no módulo)
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(null);
  const [activeAulaIndex, setActiveAulaIndex] = useState(0);
  const [classroomTab, setClassroomTab] = useState('resumo'); // 'resumo' | 'materiais' | 'anotacoes'
  const [mobileClassTab, setMobileClassTab] = useState('aulas'); // 'aulas' | 'conteudo' | 'comentarios'
  const [mobileStarVoteOpen, setMobileStarVoteOpen] = useState(false);
  const [sidebarLessonsOpen, setSidebarLessonsOpen] = useState(true);
  const [expandedSidebarMod, setExpandedSidebarMod] = useState('01');

  // Filtros e Progresso Persistente
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('todos'); // 'todos' | 'pendentes' | 'concluidos'
  const [progressState, setProgressState] = useState(() => loadStudentProgress());
  const [moduleNotes, setModuleNotes] = useState(() => loadModuleNotes());
  const [lessonRatings, setLessonRatings] = useState(() => loadLessonRatings());
  const [hoverRating, setHoverRating] = useState(0);
  const [lessonComments, setLessonComments] = useState(() => loadLessonComments());
  const [commentDraft, setCommentDraft] = useState('');
  const [replyTarget, setReplyTarget] = useState(null); // { id, authorName, authorRole, snippet }
  const chatScrollRef = useRef(null);

  // Controles completos do Player BLACK (Scrubber, Volume, CC, Configurações, Mini Telinha, Fullscreen)
  const playerStageRef = useRef(null);
  const videoElRef = useRef(null);
  const settingsPopoverRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [totalDurationSec, setTotalDurationSec] = useState(40 * 60);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [videoQuality, setVideoQuality] = useState('Auto'); // 'Auto' | '360p' | '720p' | '1080p'
  const [playbackRate, setPlaybackRate] = useState(1);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsView, setSettingsView] = useState('root'); // 'root' | 'captions' | 'quality' | 'speed'
  const [miniPipOpen, setMiniPipOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewportPortrait, setViewportPortrait] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight > window.innerWidth : false
  );
  const [activities, setActivities] = useState(atividadesIniciais);
  const [readNoticeIds, setReadNoticeIds] = useState(() =>
    loadReadNoticeIds(loadStudentSession()?.id || 'demo-student-001')
  );
  const [openedNoticeId, setOpenedNoticeId] = useState(null);
  const [noticeFilterTab, setNoticeFilterTab] = useState('todas'); // 'nao_lidas' | 'lidas' | 'todas'
  const [noticeAudienceTab, setNoticeAudienceTab] = useState('todos'); // 'todos' | 'geral' | 'para_mim'
  const [showAllNotices, setShowAllNotices] = useState(false);
  const [ajudaSectionTab, setAjudaSectionTab] = useState('comunicados'); // 'comunicados' (Informação) | 'chat_aulas' (Conversa)
  const [chatNotifFilter, setChatNotifFilter] = useState('todas'); // 'todas' | 'nao_lidas' | 'professor' | 'colegas'
  const [chatNotifications, setChatNotifications] = useState(() => loadChatNotifications());
  const [readChatNotifIds, setReadChatNotifIds] = useState(() =>
    loadReadChatNotifIds(loadStudentSession()?.id || 'demo-student-001')
  );
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
  const [showAttendanceList, setShowAttendanceList] = useState(false);
  const [showSentJustifications, setShowSentJustifications] = useState(false);
  const [justifyReason, setJustifyReason] = useState('Atestado Médico');
  const [justifyDetails, setJustifyDetails] = useState('');
  const [justifyFileId, setJustifyFileId] = useState('');
  const [justifyFileName, setJustifyFileName] = useState('');
  const [justifyFileSize, setJustifyFileSize] = useState('');
  const [justifyFileType, setJustifyFileType] = useState('');
  const [justifyFileDataUrl, setJustifyFileDataUrl] = useState('');
  const [previewAttachment, setPreviewAttachment] = useState(null);

  // Financeiro (Parcelas + Boletos enviados pelo Admin + Foco na Parcela Atual + Comprovante Oficial)
  const [installments, setInstallments] = useState(() => loadStudentInstallments());
  const [advanceParcela, setAdvanceParcela] = useState(null);
  const [showAllInstallments, setShowAllInstallments] = useState(false);
  const [receiptModalParcela, setReceiptModalParcela] = useState(null);

  // Foto de Perfil Opcional (persistida por aluno mesmo se deslogar)
  const [avatarUrl, setAvatarUrl] = useState(() =>
    loadStudentAvatar(loadStudentSession()?.id || 'demo-student-001')
  );

  // Troca de Senha de Login (Meu Perfil)
  const [hasSavedPassword, setHasSavedPassword] = useState(() =>
    hasCustomStudentPassword(loadStudentSession()?.id || 'demo-student-001')
  );
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmNewPwd, setConfirmNewPwd] = useState('');
  const [showPwdFields, setShowPwdFields] = useState(false);
  const [pwdFeedback, setPwdFeedback] = useState(null); // { type: 'error' | 'success', message: string } | null

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
    saveLessonRatings(lessonRatings);
  }, [lessonRatings]);

  useEffect(() => {
    saveLessonComments(lessonComments);
  }, [lessonComments]);

  useEffect(() => {
    saveAbsenceJustifications(justifications);
  }, [justifications]);

  useEffect(() => {
    if (session?.id) {
      setReadNoticeIds(loadReadNoticeIds(session.id));
      setReadChatNotifIds(loadReadChatNotifIds(session.id));
      setAvatarUrl(loadStudentAvatar(session.id));
      setHasSavedPassword(hasCustomStudentPassword(session.id));
      setCurrentPwd('');
      setNewPwd('');
      setConfirmNewPwd('');
      setPwdFeedback(null);
    }
  }, [session?.id]);

  useEffect(() => {
    if (session?.id) {
      saveReadNoticeIds(session.id, readNoticeIds);
    }
  }, [session?.id, readNoticeIds]);

  // Sincroniza tudo com o Painel Admin (boletos, aulas 200h, comunicados, atestados, chat e certificado!)
  useEffect(() => {
    const syncFromAdmin = () => {
      setInstallments(loadStudentInstallments());
      setModulos(loadCourseModules200h());
      setAnnouncements(loadAnnouncements());
      setJustifications(loadAbsenceJustifications());
      setLessonComments(loadLessonComments());
      setChatNotifications(loadChatNotifications());
      const latestSession = loadStudentSession();
      if (latestSession?.id) {
        setReadChatNotifIds(loadReadChatNotifIds(latestSession.id));
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
    const sum = (arr) => arr.reduce((acc, p) => acc + (p.valorCentavos || 20000), 0);
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

  const unreadChatCount = useMemo(
    () =>
      chatNotifications.filter(
        (n) =>
          !readChatNotifIds.includes(n.id) &&
          (n.authorRole === 'professor' || n.senderId !== (session?.id || 'demo-student-001'))
      ).length,
    [chatNotifications, readChatNotifIds, session?.id]
  );

  const totalAlertsCount = unreadNotices + unreadChatCount;

  const completedModuleIds = progressState.completedModuleIds || [];
  const completedLessonIds = progressState.completedLessonIds || [];
  const quizPassed = Boolean(progressState.quizPassed);

  const getModuleAccessState = (idx) => {
    const mod = modulos[idx];
    if (!mod) {
      return { unlocked: false, isTeacherUnlocked: false, isPreviousDone: false, isDone: false, lockReason: '' };
    }
    const isDone = completedModuleIds.includes(mod.modulo);
    const isTeacherUnlocked = Boolean(mod.liberadoProfessor);
    const prevMod = idx > 0 ? modulos[idx - 1] : null;
    const isPreviousDone = idx === 0 || (prevMod ? completedModuleIds.includes(prevMod.modulo) : true);
    const unlocked = (isDone && isTeacherUnlocked) || (isTeacherUnlocked && isPreviousDone);

    let lockReason = '';
    if (!isTeacherUnlocked) {
      lockReason = `Aguardando liberação do professor`;
    } else if (!isPreviousDone && prevMod) {
      lockReason = `Conclua o Módulo ${prevMod.modulo} primeiro`;
    }

    return {
      unlocked,
      isTeacherUnlocked,
      isPreviousDone,
      isDone,
      prevModule: prevMod,
      lockReason,
    };
  };

  const progressStats = useMemo(() => {
    const totalHours = modulos.reduce((acc, m) => acc + m.cargaHorariaHoras, 0);
    const completedHours = modulos.reduce(
      (acc, m) => (completedModuleIds.includes(m.modulo) ? acc + m.cargaHorariaHoras : acc),
      0
    );
    const completedCount = completedModuleIds.length;
    const totalCount = modulos.length;
    const pct = totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0;

    // Primeiro módulo ainda não concluído que já está liberado pelo professor e com o anterior feito
    const playableIdx = modulos.findIndex((m, idx) => {
      if (completedModuleIds.includes(m.modulo)) return false;
      const teacherOk = Boolean(m.liberadoProfessor);
      const prevOk = idx === 0 || completedModuleIds.includes(modulos[idx - 1].modulo);
      return teacherOk && prevOk;
    });

    const firstPendingIdx = modulos.findIndex((m) => !completedModuleIds.includes(m.modulo));
    const awaitingReleaseModule =
      playableIdx === -1 && firstPendingIdx !== -1 && !modulos[firstPendingIdx]?.liberadoProfessor
        ? modulos[firstPendingIdx]
        : null;

    const teacherUnlockedCount = modulos.filter((m) => Boolean(m.liberadoProfessor)).length;
    const attendanceOk = FREQUENCIA_PRESENCIAL_DEMO.percentualAtual >= curso.frequenciaMinimaPct;
    const modulesOk = completedCount === totalCount;
    const requirementsMet = modulesOk && attendanceOk && quizPassed;
    const certificateAuthorized = certRequest?.status === 'approved';

    const fallbackIdx =
      playableIdx !== -1
        ? playableIdx
        : Math.max(0, firstPendingIdx !== -1 ? firstPendingIdx - 1 : totalCount - 1);

    return {
      totalHours,
      completedHours,
      completedCount,
      totalCount,
      pct,
      teacherUnlockedCount,
      nextPlayableIndex: playableIdx !== -1 ? playableIdx : null,
      nextPlayableModule: playableIdx !== -1 ? modulos[playableIdx] : null,
      awaitingReleaseModule,
      nextModuleIndex: fallbackIdx,
      nextModule: modulos[fallbackIdx] || modulos[0],
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

  const activeModule = selectedModuleIndex !== null ? modulos[selectedModuleIndex] : null;
  const activeAula = activeModule ? activeModule.aulas[activeAulaIndex] || activeModule.aulas[0] : null;
  const activeAulaComments = activeAula ? lessonComments[activeAula.id] || [] : [];

  // Reinicia timer/controles ao trocar de aula (sempre acima de qualquer return condicional — Rules of Hooks!)
  useEffect(() => {
    if (!activeAula) return;
    setCurrentTimeSec(0);
    setTotalDurationSec(Math.max(60, (activeAula.duracaoMin || 40) * 60));
    setIsPlaying(false);
    setSettingsOpen(false);
    setSettingsView('root');
  }, [activeAula?.id]);

  // Avança contador quando Play está ativo (para vídeos demo / slides interativos sem <video> nativo)
  useEffect(() => {
    const isDirectVideoFile =
      activeAula?.videoUrl && /\.(mp4|webm|ogg)(\?.*)?$/i.test(activeAula.videoUrl);
    if (!isPlaying || isDirectVideoFile || selectedModuleIndex === null) return undefined;
    const interval = window.setInterval(() => {
      setCurrentTimeSec((prev) => {
        const next = prev + playbackRate;
        if (next >= totalDurationSec) {
          setIsPlaying(false);
          return totalDurationSec;
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isPlaying, playbackRate, totalDurationSec, activeAula?.videoUrl, selectedModuleIndex]);

  // Aplica velocidade ao elemento <video> nativo
  useEffect(() => {
    if (videoElRef.current) {
      videoElRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate, activeAula?.id]);

  // Sincroniza estado Fullscreen real do navegador (inclusive ao pressionar ESC) + detecta retrato/paisagem
  useEffect(() => {
    const updateOrientation = () => {
      setViewportPortrait(window.innerHeight > window.innerWidth);
    };
    const onFsChange = () => {
      const active = Boolean(document.fullscreenElement);
      setIsFullscreen(active);
      if (!active) {
        try {
          window.screen?.orientation?.unlock?.();
        } catch {
          // ignora
        }
      }
      updateOrientation();
    };
    updateOrientation();
    document.addEventListener('fullscreenchange', onFsChange);
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  // Fecha popover de configurações ao clicar fora
  useEffect(() => {
    if (!settingsOpen) return undefined;
    const onDocClick = (e) => {
      if (settingsPopoverRef.current && !settingsPopoverRef.current.contains(e.target)) {
        setSettingsOpen(false);
        setSettingsView('root');
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [settingsOpen]);

  // Tela de Login se o aluno ainda não entrou (todos os Hooks já foram executados acima!)
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
    if (selectedModuleIndex !== null) {
      setSelectedModuleIndex(null);
      dismissOverlayHistory('classroom-cinema');
    }
    setActiveNav(navId);
    if (navId === 'aulas') setAulasSubTab(subTab || 'modulos');
    if (navId === 'agenda' && subTab) setAgendaSubTab(subTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeModuleClassroom = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    try {
      window.screen?.orientation?.unlock?.();
    } catch {
      // ignora em navegadores sem Orientation API
    }
    setIsFullscreen(false);
    setIsPlaying(false);
    setMiniPipOpen(false);
    setSettingsOpen(false);
    setSelectedModuleIndex(null);
    dismissOverlayHistory('classroom-cinema');
  };

  const handleRateLesson = (lessonId, stars) => {
    setLessonRatings((prev) => ({ ...prev, [lessonId]: stars }));
    showToast(`Obrigado! Você avaliou esta aula com ${stars}/5 ★`, 'success');
  };

  const formatPlayerTime = (sec) => {
    const safe = Math.max(0, Math.floor(sec || 0));
    const hrs = Math.floor(safe / 3600);
    const mins = Math.floor((safe % 3600) / 60);
    const secs = safe % 60;
    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleTogglePlay = () => {
    const nextPlay = !isPlaying;
    setIsPlaying(nextPlay);
    if (videoElRef.current) {
      if (nextPlay) {
        videoElRef.current.play().catch(() => {});
      } else {
        videoElRef.current.pause();
      }
    }
  };

  const handleSeek = (nextSec) => {
    const clamped = Math.max(0, Math.min(totalDurationSec || 1, Number(nextSec) || 0));
    setCurrentTimeSec(clamped);
    if (videoElRef.current) {
      videoElRef.current.currentTime = clamped;
    }
  };

  const handleVolumeChange = (nextVol) => {
    const val = Math.max(0, Math.min(1, Number(nextVol)));
    setVolume(val);
    setIsMuted(val === 0);
    if (videoElRef.current) {
      videoElRef.current.volume = val;
      videoElRef.current.muted = val === 0;
    }
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (!nextMute && volume === 0) setVolume(0.7);
    if (videoElRef.current) {
      videoElRef.current.muted = nextMute;
      if (!nextMute && videoElRef.current.volume === 0) {
        videoElRef.current.volume = 0.7;
      }
    }
  };

  const handleToggleFullscreen = async () => {
    const el = playerStageRef.current;
    const lockLandscape = async () => {
      try {
        if (window.screen?.orientation?.lock) {
          await window.screen.orientation.lock('landscape');
        }
      } catch {
        // iOS Safari, desktop ou aparelhos com trava rígida caem no fallback CSS rotate-90
      }
    };
    const unlockOrientation = () => {
      try {
        window.screen?.orientation?.unlock?.();
      } catch {
        // ignora
      }
    };

    if (document.fullscreenElement || isFullscreen) {
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch {
          // ignora
        }
      }
      unlockOrientation();
      setIsFullscreen(false);
    } else if (el && el.requestFullscreen) {
      try {
        await el.requestFullscreen();
        setIsFullscreen(true);
        await lockLandscape();
      } catch {
        setIsFullscreen(true);
        await lockLandscape();
      }
    } else {
      setIsFullscreen(true);
      await lockLandscape();
    }
  };

  const handleToggleMiniPip = () => {
    if (
      videoElRef.current &&
      document.pictureInPictureEnabled &&
      typeof videoElRef.current.requestPictureInPicture === 'function'
    ) {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture().catch(() => {});
      } else {
        videoElRef.current.requestPictureInPicture().catch(() => {
          setMiniPipOpen((prev) => !prev);
        });
      }
      return;
    }
    setMiniPipOpen((prev) => !prev);
  };

  const getAuthorInitials = (name = '') =>
    String(name || 'AL')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase() || 'AL';

  const handleSendLessonComment = (e) => {
    e.preventDefault();
    const clean = commentDraft.trim();
    if (!clean || !activeAula || !activeModule) return;
    const newEntry = {
      id: `cmt-${Date.now()}`,
      ...(replyTarget
        ? {
            parentId: replyTarget.id,
            replyToName: replyTarget.authorName,
            replyToRole: replyTarget.authorRole,
            replyToSnippet: replyTarget.snippet,
          }
        : {}),
      lessonId: activeAula.id,
      moduloNumero: activeModule.modulo,
      aulaTitulo: activeAula.titulo,
      authorName: session.nome || 'Aluno',
      authorRole: 'aluno',
      text: clean,
      createdAt: new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setLessonComments((prev) => ({
      ...prev,
      [activeAula.id]: [...(prev[activeAula.id] || []), newEntry],
    }));

    // Gera notificação no canal separado de Conversa/Dúvidas (para professor e demais alunos)
    const chatNotif = {
      id: `chatnotif-${newEntry.id}`,
      commentId: newEntry.id,
      lessonId: activeAula.id,
      moduloNumero: activeModule.modulo,
      aulaTitulo: activeAula.titulo,
      senderId: session?.id || 'demo-student-001',
      authorName: newEntry.authorName,
      authorRole: 'aluno',
      replyToName: replyTarget?.authorName || null,
      replyToRole: replyTarget?.authorRole || null,
      replyToSnippet: replyTarget?.snippet || null,
      text: clean,
      createdAt: newEntry.createdAt,
      timestamp: Date.now(),
    };
    const updatedNotifs = pushChatNotification(chatNotif);
    setChatNotifications(updatedNotifs);

    // Marca a própria mensagem como lida para quem acabou de enviar
    const readerKey = session?.id || 'demo-student-001';
    const nextReadChat = Array.from(new Set([...readChatNotifIds, chatNotif.id]));
    setReadChatNotifIds(nextReadChat);
    saveReadChatNotifIds(readerKey, nextReadChat);

    setCommentDraft('');
    setReplyTarget(null);
    showToast(
      replyTarget
        ? `Resposta enviada para ${replyTarget.authorName} e notificada no chat ✓`
        : 'Dúvida enviada! O professor e colegas receberão a notificação separada no chat ✓',
      'success'
    );
    window.setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    }, 40);
  };

  const handleDeleteOwnComment = (lessonId, commentId) => {
    setLessonComments((prev) => ({
      ...prev,
      [lessonId]: (prev[lessonId] || []).filter((c) => c.id !== commentId),
    }));
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
    const access = getModuleAccessState(modIdx);
    const targetMod = modulos[modIdx];
    if (!access.unlocked) {
      showToast(
        `Módulo ${targetMod?.modulo || ''} bloqueado: ${access.lockReason}.`,
        'info'
      );
      return;
    }
    setActiveNav('aulas');
    setSelectedModuleIndex(modIdx);
    setActiveAulaIndex(aulaIdx);
    setExpandedSidebarMod(targetMod?.modulo || '01');
    setClassroomTab('resumo');
    pushOverlayHistory('classroom-cinema', () => setSelectedModuleIndex(null));
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
    if (field === 'email' || field === 'telefone') {
      updateStudentProfileContact({
        studentId: session?.id || 'demo-student-001',
        [field]: value,
      });
    }
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
      };
      img.src = typeof reader.result === 'string' ? reader.result : '';
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
    if (session?.id) saveStudentAvatar(session.id, '');
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
      const nextIdx = selectedModuleIndex + 1;
      const nextMod = modulos[nextIdx];
      const currentDone = completedModuleIds.includes(activeModule.modulo);
      if (!currentDone) {
        showToast(
          `Conclua todas as aulas do Módulo ${activeModule.modulo} antes de avançar para o Módulo ${nextMod.modulo}.`,
          'info'
        );
        return;
      }
      if (!nextMod.liberadoProfessor) {
        showToast(
          `Parabéns por finalizar o Módulo ${activeModule.modulo}! O Módulo ${nextMod.modulo} será liberado pelo professor.`,
          'info'
        );
        setSelectedModuleIndex(null);
        setActiveNav('aulas');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      setSelectedModuleIndex(nextIdx);
      setActiveAulaIndex(0);
      setClassroomTab('resumo');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (!progressStats.modulesOk) {
        showToast('Conclua todos os 11 módulos para liberar a Avaliação Final.', 'info');
        return;
      }
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
    const classEvent = getCourseEventForDate(Number(y), Number(m) - 1, Number(d));
    if (!classEvent) {
      showToast('Selecione um sábado com aula prevista no calendário do curso.', 'info');
      return;
    }
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
      `Olá! Sou *${session.nome}*, aluno do Curso de Socorrista APH (200h).`,
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
    setShowSentJustifications(true);
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
      showToast('Você já está na central de Avisos e Dúvidas ✓', 'info');
      const el = document.getElementById('comunicados-oficiais-card');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setNoticesPulse(false), 1400);
    } else {
      if (unreadNotices === 0 && unreadChatCount > 0) {
        setAjudaSectionTab('chat_aulas');
      } else if (unreadNotices > 0) {
        setAjudaSectionTab('comunicados');
      }
      navigateTo('ajuda');
    }
  };

  // APENAS 6 ABAS PRINCIPAIS — CLAREZA IMEDIATA PARA TODAS AS IDADES
  const sidebarItems = [
    { id: 'inicio', label: 'Início', desc: 'Acesso às aulas', icon: Home },
    { id: 'aulas', label: 'Minhas Aulas', desc: '11 Módulos (200h)', icon: BookOpen },
    { id: 'agenda', label: 'Calendário e Presença', desc: 'Sábados e Frequência', icon: CalendarIcon },
    { id: 'certificado', label: 'Meu Certificado', desc: 'Diploma Oficial 200h', icon: Award },
    { id: 'financeiro', label: 'Financeiro', desc: 'Parcelas e PIX (10x)', icon: CreditCard },
    {
      id: 'ajuda',
      label: 'Avisos e Ajuda',
      desc: 'Informação vs Chat',
      icon: Headphones,
      badge: totalAlertsCount,
    },
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

        {/* 6 Menus Principais — Fixos na Sidebar do Desktop (no Mobile usa-se a barra fixa no rodapé) */}
        <nav
          className="hidden lg:flex lg:flex-col p-3.5 gap-1.5 shrink-0"
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
              {totalAlertsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 rounded-full bg-[#ED101C] text-white text-[10px] font-extrabold flex items-center justify-center tabular-nums shadow-[0_0_12px_rgba(237,16,28,0.8)]">
                  {totalAlertsCount}
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
              TELA DEDICADA 1: PLAYER CINEMA 1:1 (ESTILO MEMBROS PREMIUM)
              Ao clicar em um módulo, abre direto em tela inteira:
              - Esquerda: Vídeo/Slide edge-to-edge (<- topo esq.) + Faixa Título + Estrelas + < >
                          + Apostilas, Anotações e Resumo/Checklist abaixo
              - Direita: Painel "Aulas" (recolhível no Desktop) com acordeão por módulo,
                         checkbox + mini-thumbnail + título da aula
          ================================================================= */}
          {selectedModuleIndex !== null && activeModule && activeAula ? (
            <div
              className="fixed inset-0 z-[80] bg-[#0B0C10] flex flex-col lg:flex-row overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label={`Sala de Aula — ${activeAula.titulo}`}
            >
              {/* COLUNA ESQUERDA (VÍDEO EDGE-TO-EDGE + TÍTULO/ESTRELAS/SETAS + CHAT DÚVIDAS/ANOTAÇÕES + APOSTILA) */}
              <div className="flex-1 min-w-0 h-full overflow-y-auto bg-[#0B0C10]">
                {/* Palco Edge-to-Edge (Vídeo / Slide / Imagem) com Controles Completos BLACK + Auto-Paisagem no Mobile */}
                <div
                  ref={playerStageRef}
                  className={`bg-black border-b border-white/10 group/player select-none overflow-hidden ${
                    isFullscreen
                      ? 'fixed inset-0 z-[120] w-screen h-screen'
                      : 'relative w-full aspect-video max-h-[70vh]'
                  }`}
                >
                  <div
                    className={
                      isFullscreen && viewportPortrait
                        ? 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 w-[100dvh] h-[100vw] bg-black overflow-hidden'
                        : 'relative w-full h-full bg-black overflow-hidden'
                    }
                  >
                  {/* Seta Voltar no canto superior esquerdo do vídeo */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isFullscreen) {
                        handleToggleFullscreen();
                      } else {
                        closeModuleClassroom();
                      }
                    }}
                    aria-label={isFullscreen ? 'Sair da tela cheia' : 'Voltar para os módulos'}
                    title={isFullscreen ? 'Sair da tela cheia' : 'Voltar para os módulos'}
                    className="absolute top-3 left-3 sm:top-4 sm:left-4 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/65 hover:bg-[#ED101C] border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  {/* Botão no topo direito do palco para reabrir Sidebar "Aulas" se recolhida no Desktop */}
                  {!sidebarLessonsOpen && !isFullscreen && (
                    <button
                      type="button"
                      onClick={() => setSidebarLessonsOpen(true)}
                      className="hidden lg:inline-flex items-center gap-1.5 absolute top-4 right-4 z-30 px-3 py-1.5 rounded-full bg-black/70 hover:bg-[#ED101C] border border-white/20 text-white text-xs font-bold backdrop-blur-md transition-colors"
                      title="Abrir lista de aulas"
                    >
                      <PanelRightOpen className="w-4 h-4" />
                      <span>Aulas</span>
                    </button>
                  )}

                  {/* MÍDIA PRINCIPAL (Imagem/Slide | Vídeo MP4 | Iframe YouTube/Vimeo | Palco Oficial BLACK) */}
                  {activeAula.videoUrl &&
                  (/\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(activeAula.videoUrl) ||
                    activeAula.videoUrl.startsWith('data:image/') ||
                    activeAula.tipo === 'IMAGEM') ? (
                    <img
                      src={activeAula.videoUrl}
                      alt={activeAula.titulo}
                      className="w-full h-full object-contain bg-black"
                    />
                  ) : activeAula.videoUrl && /\.(mp4|webm|ogg)(\?.*)?$/i.test(activeAula.videoUrl) ? (
                    <video
                      ref={videoElRef}
                      src={activeAula.videoUrl}
                      onClick={handleTogglePlay}
                      onLoadedMetadata={(e) => {
                        if (e.currentTarget.duration && Number.isFinite(e.currentTarget.duration)) {
                          setTotalDurationSec(Math.floor(e.currentTarget.duration));
                        }
                      }}
                      onTimeUpdate={(e) => {
                        setCurrentTimeSec(e.currentTarget.currentTime || 0);
                      }}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => setIsPlaying(false)}
                      className="w-full h-full bg-black cursor-pointer"
                    />
                  ) : activeAula.videoUrl ? (
                    <iframe
                      src={activeAula.videoUrl}
                      title={activeAula.titulo}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    /* Palco Cinematográfico Oficial — Nome idêntico ao de baixo! */
                    <div
                      onClick={handleTogglePlay}
                      className="relative w-full h-full overflow-hidden cursor-pointer"
                    >
                      <img
                        src={curso.thumb}
                        alt={activeAula.titulo}
                        className="w-full h-full object-cover object-center opacity-55"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/60 flex flex-col items-center justify-center px-11 pt-5 pb-12 sm:p-10 sm:pb-16 text-center">
                        <span className="max-w-[230px] sm:max-w-none truncate px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#ED101C]/90 text-white text-[9px] sm:text-xs font-mono font-bold uppercase tracking-widest mb-1.5 sm:mb-2.5">
                          MÓDULO {activeModule.modulo} • {activeModule.titulo}
                        </span>

                        <h2 className="font-display font-extrabold text-sm sm:text-3xl lg:text-4xl text-white tracking-tight max-w-3xl leading-tight line-clamp-2 sm:line-clamp-none drop-shadow-lg">
                          {activeAula.ordem} — {activeAula.titulo}
                        </h2>
                        <p className="text-[9.5px] sm:text-xs font-mono uppercase tracking-[0.18em] sm:tracking-[0.22em] text-white/75 mt-1 sm:mt-2">
                          {activeAula.tipo === 'SLIDES' || activeAula.tipo === 'IMAGEM'
                            ? `SLIDE / MATERIAL VISUAL • ${activeAula.duracaoMin} MIN`
                            : `${activeAula.tipo} • ${activeAula.duracaoMin} MIN • ${videoQuality}`}
                        </p>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePlay();
                          }}
                          className="mt-2 sm:mt-5 w-11 h-11 sm:w-16 sm:h-16 rounded-full bg-[#ED101C]/90 hover:bg-[#ED101C] border-2 border-white/35 text-white flex items-center justify-center shadow-[0_0_28px_rgba(237,16,28,0.65)] transition-all hover:scale-105"
                          aria-label={isPlaying ? 'Pausar aula' : 'Reproduzir aula'}
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                          ) : activeAula.tipo === 'SLIDES' || activeAula.tipo === 'IMAGEM' ? (
                            <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                          ) : (
                            <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Faixa de Legenda PT-BR quando CC estiver ativado */}
                  {captionsEnabled && (
                    <div className="pointer-events-none absolute bottom-14 sm:bottom-16 inset-x-4 flex justify-center z-20">
                      <span className="px-3.5 py-1.5 rounded-lg bg-black/85 border border-white/15 text-white text-xs sm:text-sm font-medium shadow-lg text-center max-w-2xl">
                        [Legenda PT-BR] {activeAula.ordem} — {activeAula.titulo} ({activeAula.descricao})
                      </span>
                    </div>
                  )}

                  {/* BARRA DE COMANDOS COMPLETA DO PLAYER BLACK (exceto se for iframe externo com player próprio) */}
                  {!(
                    activeAula.videoUrl &&
                    !/\.(png|jpe?g|webp|gif|svg|mp4|webm|ogg)(\?.*)?$/i.test(activeAula.videoUrl) &&
                    !activeAula.videoUrl.startsWith('data:image/') &&
                    activeAula.tipo !== 'IMAGEM'
                  ) && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black via-black/90 to-transparent px-3 sm:px-5 pt-6 pb-2.5 sm:pb-3 space-y-2"
                    >
                      {/* Linha do Scrubber (Arrastável para qualquer minuto) */}
                      <div className="relative flex items-center group/seek">
                        <input
                          type="range"
                          min={0}
                          max={Math.max(1, totalDurationSec)}
                          step={1}
                          value={Math.min(currentTimeSec, totalDurationSec)}
                          onChange={(e) => handleSeek(e.target.value)}
                          aria-label="Linha do tempo da aula"
                          className="w-full h-1.5 appearance-none rounded-full cursor-pointer accent-[#ED101C]"
                          style={{
                            background: `linear-gradient(to right, #ED101C ${
                              totalDurationSec > 0
                                ? Math.min(100, (currentTimeSec / totalDurationSec) * 100)
                                : 0
                            }%, rgba(255,255,255,0.28) ${
                              totalDurationSec > 0
                                ? Math.min(100, (currentTimeSec / totalDurationSec) * 100)
                                : 0
                            }%)`,
                          }}
                        />
                      </div>

                      {/* Botões de Controle: Play | Tempo | Volume + Barra || CC | Engrenagem | Mini Telinha | Fullscreen */}
                      <div className="flex items-center justify-between gap-2 text-white">
                        {/* Controles Esquerdos */}
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <button
                            type="button"
                            onClick={handleTogglePlay}
                            aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
                            className="p-1.5 rounded-lg hover:bg-white/15 transition-colors shrink-0"
                          >
                            {isPlaying ? (
                              <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                            ) : (
                              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                            )}
                          </button>

                          <span className="text-[11px] sm:text-xs font-mono text-white/90 tabular-nums shrink-0">
                            {formatPlayerTime(currentTimeSec)} / {formatPlayerTime(totalDurationSec)}
                          </span>

                          {/* Volume + Barrinha */}
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <button
                              type="button"
                              onClick={handleToggleMute}
                              aria-label={isMuted || volume === 0 ? 'Ativar som' : 'Silenciar'}
                              title={isMuted || volume === 0 ? 'Ativar som' : 'Silenciar'}
                              className="p-1.5 rounded-lg hover:bg-white/15 transition-colors shrink-0"
                            >
                              {isMuted || volume === 0 ? (
                                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF5A65]" />
                              ) : (
                                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                              )}
                            </button>
                            <input
                              type="range"
                              min={0}
                              max={1}
                              step={0.05}
                              value={isMuted ? 0 : volume}
                              onChange={(e) => handleVolumeChange(e.target.value)}
                              aria-label="Volume do áudio"
                              className="w-14 sm:w-20 h-1 appearance-none rounded-full cursor-pointer accent-[#ED101C]"
                              style={{
                                background: `linear-gradient(to right, #FFFFFF ${
                                  (isMuted ? 0 : volume) * 100
                                }%, rgba(255,255,255,0.28) ${(isMuted ? 0 : volume) * 100}%)`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Controles Direitos */}
                        <div className="relative flex items-center gap-1 sm:gap-2 shrink-0" ref={settingsPopoverRef}>
                          {/* Legendas (CC) */}
                          <button
                            type="button"
                            onClick={() => setCaptionsEnabled((prev) => !prev)}
                            title={captionsEnabled ? 'Legendas: Português (Ativa)' : 'Legendas: Desativadas'}
                            aria-label="Alternar legendas"
                            className={`px-1.5 py-1 rounded-md text-[10px] sm:text-xs font-mono font-extrabold border transition-colors ${
                              captionsEnabled
                                ? 'bg-[#ED101C] border-[#ED101C] text-white'
                                : 'bg-white/10 border-white/25 text-white/80 hover:text-white'
                            }`}
                          >
                            CC
                          </button>

                          {/* Configurações (Legendas / Qualidade / Velocidade) */}
                          <button
                            type="button"
                            onClick={() => {
                              setSettingsView('root');
                              setSettingsOpen((prev) => !prev);
                            }}
                            title="Configurações do player"
                            aria-label="Configurações de legenda, qualidade e velocidade"
                            className={`p-1.5 rounded-lg transition-colors ${
                              settingsOpen ? 'bg-[#ED101C] text-white' : 'hover:bg-white/15 text-white/90'
                            }`}
                          >
                            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>

                          {/* Popover de Configurações estilo Kiwify na identidade BLACK */}
                          {settingsOpen && (
                            <div className="absolute bottom-11 right-0 w-60 rounded-2xl bg-[#14151D]/98 backdrop-blur-xl border border-white/15 shadow-[0_18px_45px_rgba(0,0,0,0.92)] overflow-hidden text-xs z-40">
                              {settingsView === 'root' ? (
                                <div className="py-1.5 divide-y divide-white/[0.06]">
                                  <button
                                    type="button"
                                    onClick={() => setSettingsView('captions')}
                                    className="w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-white/[0.06] text-left transition-colors"
                                  >
                                    <span className="text-white font-semibold flex items-center gap-2">
                                      <Captions className="w-3.5 h-3.5 text-[#ED101C]" />
                                      <span>Legendas</span>
                                    </span>
                                    <span className="text-white/65 inline-flex items-center gap-1">
                                      <span>{captionsEnabled ? 'Português' : 'Desativadas'}</span>
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setSettingsView('quality')}
                                    className="w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-white/[0.06] text-left transition-colors"
                                  >
                                    <span className="text-white font-semibold">Qualidade</span>
                                    <span className="text-white/65 inline-flex items-center gap-1">
                                      <span>{videoQuality}</span>
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setSettingsView('speed')}
                                    className="w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-white/[0.06] text-left transition-colors"
                                  >
                                    <span className="text-white font-semibold">Velocidade</span>
                                    <span className="text-white/65 inline-flex items-center gap-1">
                                      <span>{playbackRate}x</span>
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </span>
                                  </button>
                                </div>
                              ) : settingsView === 'captions' ? (
                                <div className="py-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setSettingsView('root')}
                                    className="w-full px-3.5 py-2 border-b border-white/10 flex items-center gap-2 text-white/75 hover:text-white font-bold"
                                  >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                    <span>Legendas</span>
                                  </button>
                                  {[
                                    { label: 'Desativadas', val: false },
                                    { label: 'Português', val: true },
                                  ].map((opt) => (
                                    <button
                                      key={opt.label}
                                      type="button"
                                      onClick={() => {
                                        setCaptionsEnabled(opt.val);
                                        setSettingsOpen(false);
                                        setSettingsView('root');
                                      }}
                                      className="w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-white/[0.06] text-left"
                                    >
                                      <span className={captionsEnabled === opt.val ? 'text-[#FF5A65] font-bold' : 'text-white/85'}>
                                        {opt.label}
                                      </span>
                                      {captionsEnabled === opt.val && <Check className="w-3.5 h-3.5 text-[#ED101C]" />}
                                    </button>
                                  ))}
                                </div>
                              ) : settingsView === 'quality' ? (
                                <div className="py-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setSettingsView('root')}
                                    className="w-full px-3.5 py-2 border-b border-white/10 flex items-center gap-2 text-white/75 hover:text-white font-bold"
                                  >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                    <span>Qualidade</span>
                                  </button>
                                  {[
                                    { id: 'Auto', label: 'Auto (Automático)' },
                                    { id: '360p', label: '360p' },
                                    { id: '720p', label: '720p HD' },
                                    { id: '1080p', label: '1080p Full HD' },
                                  ].map((q) => (
                                    <button
                                      key={q.id}
                                      type="button"
                                      onClick={() => {
                                        setVideoQuality(q.id);
                                        setSettingsOpen(false);
                                        setSettingsView('root');
                                        showToast(`Qualidade ajustada para ${q.label}`, 'info');
                                      }}
                                      className="w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-white/[0.06] text-left"
                                    >
                                      <span className={videoQuality === q.id ? 'text-[#FF5A65] font-bold' : 'text-white/85'}>
                                        {q.label}
                                      </span>
                                      {videoQuality === q.id && <Check className="w-3.5 h-3.5 text-[#ED101C]" />}
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <div className="py-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setSettingsView('root')}
                                    className="w-full px-3.5 py-2 border-b border-white/10 flex items-center gap-2 text-white/75 hover:text-white font-bold"
                                  >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                    <span>Velocidade</span>
                                  </button>
                                  {[0.5, 1, 1.25, 1.5, 2].map((spd) => (
                                    <button
                                      key={spd}
                                      type="button"
                                      onClick={() => {
                                        setPlaybackRate(spd);
                                        setSettingsOpen(false);
                                        setSettingsView('root');
                                      }}
                                      className="w-full px-3.5 py-2 flex items-center justify-between hover:bg-white/[0.06] text-left"
                                    >
                                      <span className={playbackRate === spd ? 'text-[#FF5A65] font-bold' : 'text-white/85'}>
                                        {spd === 1 ? '1x (Normal)' : `${spd}x`}
                                      </span>
                                      {playbackRate === spd && <Check className="w-3.5 h-3.5 text-[#ED101C]" />}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Mini Telinha (PiP / Mini Player no canto para rolar lendo/comentando) */}
                          <button
                            type="button"
                            onClick={handleToggleMiniPip}
                            title="Mini telinha no canto (continuar vendo enquanto rola)"
                            aria-label="Abrir mini telinha no canto"
                            className={`p-1.5 rounded-lg transition-colors ${
                              miniPipOpen ? 'bg-[#ED101C] text-white' : 'hover:bg-white/15 text-white/90'
                            }`}
                          >
                            <PictureInPicture2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>

                          {/* Expandir / Diminuir Tela (Fullscreen) */}
                          <button
                            type="button"
                            onClick={handleToggleFullscreen}
                            title={isFullscreen ? 'Diminuir tela' : 'Expandir tela cheia'}
                            aria-label={isFullscreen ? 'Diminuir tela' : 'Expandir tela cheia'}
                            className="p-1.5 rounded-lg hover:bg-white/15 text-white/90 transition-colors"
                          >
                            {isFullscreen ? (
                              <Minimize className="w-4 h-4 sm:w-5 sm:h-5" />
                            ) : (
                              <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  </div>
                </div>

                {/* FAIXA DE METADADOS LOGO ABAIXO DO VÍDEO */}
                <div className="border-b border-white/[0.08] bg-[#0D0E13]">
                  {/* Cabeçalho Módulo + Título da Aula (sempre visível em Mobile e Desktop) */}
                  <div className="px-4 sm:px-7 pt-3.5 pb-3 lg:py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="block text-[10px] sm:text-xs font-mono uppercase tracking-wider text-[#FF5A65] font-bold truncate">
                        MÓDULO {activeModule.modulo} • {activeModule.titulo}
                      </span>
                      <h3 className="font-display font-extrabold text-base sm:text-xl text-white mt-0.5 leading-snug">
                        {activeAula.ordem} — {activeAula.titulo}
                      </h3>
                    </div>

                    {/* Controles Desktop (LG+): Estrelas + Setas + Concluir */}
                    <div className="hidden lg:flex items-center justify-end gap-4 shrink-0">
                      <div
                        className="flex items-center gap-0.5"
                        onMouseLeave={() => setHoverRating(0)}
                        title="Avalie esta aula de 1 a 5 estrelas"
                      >
                        {[1, 2, 3, 4, 5].map((star) => {
                          const currentRating = lessonRatings[activeAula.id] || 0;
                          const filled = star <= (hoverRating || currentRating);
                          return (
                            <button
                              key={star}
                              type="button"
                              onMouseEnter={() => setHoverRating(star)}
                              onClick={() => handleRateLesson(activeAula.id, star)}
                              aria-label={`Avaliar aula com ${star} estrela${star > 1 ? 's' : ''}`}
                              className={`p-1 transition-transform hover:scale-110 ${
                                filled ? 'text-amber-400' : 'text-white/30 hover:text-amber-300/80'
                              }`}
                            >
                              <Star className={`w-5 h-5 ${filled ? 'fill-amber-400' : ''}`} />
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handlePrevLesson}
                          disabled={selectedModuleIndex === 0 && activeAulaIndex === 0}
                          aria-label="Aula anterior"
                          title="Aula anterior"
                          className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextLesson}
                          aria-label="Próxima aula"
                          title="Próxima aula"
                          className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-[#ED101C] text-white flex items-center justify-center transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleLessonCompleted(activeModule, activeAula.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border transition-colors ${
                          completedLessonIds.includes(activeAula.id)
                            ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                            : 'bg-[#ED101C] hover:bg-[#C80B15] border-[#ED101C] text-white shadow-red-glow-sm'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          {completedLessonIds.includes(activeAula.id) ? 'Concluída ✓' : 'Concluir aula'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Barra de Abas Mobile (< LG) — Estilo Referência: Aulas | Conteúdo | Comentários [X]  +  ☆ */}
                  <div className="lg:hidden px-4 flex items-center justify-between gap-2 relative">
                    <div className="flex items-center gap-5">
                      <button
                        type="button"
                        onClick={() => setMobileClassTab('aulas')}
                        className={`py-2.5 text-sm font-bold border-b-2 transition-colors ${
                          mobileClassTab === 'aulas'
                            ? 'border-[#ED101C] text-white'
                            : 'border-transparent text-white/55 hover:text-white'
                        }`}
                      >
                        Aulas
                      </button>
                      <button
                        type="button"
                        onClick={() => setMobileClassTab('conteudo')}
                        className={`py-2.5 text-sm font-bold border-b-2 transition-colors ${
                          mobileClassTab === 'conteudo'
                            ? 'border-[#ED101C] text-white'
                            : 'border-transparent text-white/55 hover:text-white'
                        }`}
                      >
                        Conteúdo
                      </button>
                      <button
                        type="button"
                        onClick={() => setMobileClassTab('comentarios')}
                        className={`py-2.5 text-sm font-bold border-b-2 inline-flex items-center gap-1.5 transition-colors ${
                          mobileClassTab === 'comentarios'
                            ? 'border-[#ED101C] text-white'
                            : 'border-transparent text-white/55 hover:text-white'
                        }`}
                      >
                        <span>Comentários</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-extrabold leading-none ${
                            mobileClassTab === 'comentarios'
                              ? 'bg-[#ED101C] text-white'
                              : 'bg-white/15 text-white/80'
                          }`}
                        >
                          {activeAulaComments.length}
                        </span>
                      </button>
                    </div>

                    {/* Apenas a estrela à direita (sem escritas — clica e abre para votar!) */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setMobileStarVoteOpen((v) => !v)}
                        aria-label="Avaliar aula"
                        className="p-2 text-white/80 hover:text-amber-400 transition-colors"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            (lessonRatings[activeAula.id] || 0) > 0
                              ? 'text-amber-400 fill-amber-400'
                              : ''
                          }`}
                        />
                      </button>

                      {mobileStarVoteOpen && (
                        <div className="absolute right-0 top-full mt-1.5 z-50 px-3 py-2 rounded-2xl bg-[#14161F] border border-white/15 shadow-[0_14px_35px_rgba(0,0,0,0.9)] flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const currentRating = lessonRatings[activeAula.id] || 0;
                            const filled = star <= currentRating;
                            return (
                              <button
                                key={star}
                                type="button"
                                onClick={() => {
                                  handleRateLesson(activeAula.id, star);
                                  setMobileStarVoteOpen(false);
                                }}
                                aria-label={`Votar ${star} estrela${star > 1 ? 's' : ''}`}
                                className={`p-1 transition-transform active:scale-95 ${
                                  filled ? 'text-amber-400' : 'text-white/35 hover:text-amber-300'
                                }`}
                              >
                                <Star className={`w-5 h-5 ${filled ? 'fill-amber-400' : ''}`} />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ABAIXO NO LADO ESQUERDO: DESKTOP (CHAT + APOSTILAS) | MOBILE (CONFORME ABA ATIVA) */}
                <div className={mobileClassTab === 'aulas' ? 'hidden lg:block p-6' : 'p-4 sm:p-6'}>
                  {/* Controles Exclusivos da Aba Mobile "Conteúdo" (Concluir, Anterior/Próxima e Resumo — sem estrelas aqui!) */}
                  {mobileClassTab === 'conteudo' && (
                    <div className="lg:hidden mb-4 space-y-3">
                      <div className="p-4 rounded-2xl bg-[#101218] border border-white/10 space-y-3">
                        <button
                          type="button"
                          onClick={() => toggleLessonCompleted(activeModule, activeAula.id)}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold inline-flex items-center justify-center gap-2 border transition-colors ${
                            completedLessonIds.includes(activeAula.id)
                              ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                              : 'bg-[#ED101C] hover:bg-[#C80B15] border-[#ED101C] text-white shadow-red-glow-sm'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            {completedLessonIds.includes(activeAula.id)
                              ? 'Aula Concluída ✓'
                              : 'Concluir esta aula'}
                          </span>
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={handlePrevLesson}
                            disabled={selectedModuleIndex === 0 && activeAulaIndex === 0}
                            className="py-2.5 px-3 rounded-xl bg-white/[0.06] disabled:opacity-35 text-xs font-bold text-white inline-flex items-center justify-center gap-1.5 border border-white/10"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Anterior</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleNextLesson}
                            className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white inline-flex items-center justify-center gap-1.5 border border-white/15"
                          >
                            <span>Próxima aula</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>

                        {activeAula.descricao && (
                          <p className="text-xs text-white/70 leading-relaxed pt-2 border-t border-white/10">
                            {activeAula.descricao}
                          </p>
                        )}
                      </div>

                      {activeModule.materiais.length === 0 && (
                        <div className="p-4 rounded-2xl bg-[#101218] border border-white/10 text-center">
                          <p className="text-xs text-white/60">
                            Nenhuma apostila PDF anexada para este módulo ainda.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
                    {/* Chat / Comentários (No mobile só aparece na aba "Comentários"; no Desktop aparece sempre!) */}
                    <div
                      className={`${
                        mobileClassTab === 'comentarios' ? 'block' : 'hidden lg:flex'
                      } ${
                        activeModule.materiais.length > 0 ? 'xl:col-span-8' : 'xl:col-span-12'
                      } rounded-2xl bg-[#101218] border border-white/10 overflow-hidden flex-col shadow-xl`}
                    >
                      {/* Cabeçalho do Chat */}
                      <div className="px-4 py-3 bg-[#14161E] border-b border-white/10 flex items-center justify-between gap-2 shrink-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <MessageSquare className="w-4 h-4 text-[#ED101C] shrink-0" />
                          <h4 className="font-display font-extrabold text-xs sm:text-sm text-white truncate">
                            Dúvidas &amp; Comentários ({activeAulaComments.length})
                          </h4>
                        </div>
                        <span className="hidden sm:inline text-[11px] font-mono text-white/50 shrink-0">
                          Alunos (esq.) • Professor (dir.)
                        </span>
                      </div>

                      {/* Área de Mensagens com Altura Fixa e Scroll Interno */}
                      <div
                        ref={chatScrollRef}
                        className="h-[310px] sm:h-[340px] overflow-y-auto p-3.5 sm:p-4 space-y-3 bg-[#0B0C11]"
                      >
                        {activeAulaComments.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-center px-4">
                            <div className="w-10 h-10 rounded-full bg-[#ED101C]/15 border border-[#ED101C]/35 flex items-center justify-center text-[#ED101C] mb-2">
                              <MessageSquare className="w-5 h-5" />
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-white/75">
                              Nenhuma dúvida ou anotação nesta aula ainda.
                            </p>
                            <p className="text-[11px] text-white/45 mt-1 max-w-sm">
                              Escreva abaixo para enviar sua dúvida — suas mensagens aparecem à esquerda e as respostas de Cleverson Black (Professor) à direita.
                            </p>
                          </div>
                        ) : (() => {
                          const studentColorMap = buildLessonStudentColorMap(activeAulaComments);
                          return activeAulaComments.map((cmt) => {
                            const isProf = cmt.authorRole === 'professor';
                            const displayName = isProf
                              ? cmt.authorName?.toLowerCase().includes('cleverson')
                                ? 'Cleverson Black'
                                : cmt.authorName || 'Cleverson Black'
                              : cmt.authorName;

                            const authorColor = getLessonParticipantColor(
                              studentColorMap,
                              displayName,
                              cmt.authorRole
                            );
                            const authorMeta = !isProf
                              ? studentColorMap.get(String(displayName || 'aluno').trim().toLowerCase())
                              : null;

                            const parentMsg =
                              cmt.parentId &&
                              activeAulaComments.find((p) => p.id === cmt.parentId);
                            const quotedAuthor = cmt.replyToName || parentMsg?.authorName;
                            const quotedRole = cmt.replyToRole || parentMsg?.authorRole || 'aluno';
                            const quotedColor = getLessonParticipantColor(
                              studentColorMap,
                              quotedAuthor,
                              quotedRole
                            );
                            const quotedText = cmt.replyToSnippet || parentMsg?.text;

                            return (
                              <div
                                key={cmt.id}
                                className={`flex items-end gap-2 ${
                                  isProf ? 'justify-end' : 'justify-start'
                                }`}
                              >
                                {/* Avatar do Aluno à Esquerda (com anel sutil na cor dele na conversa) */}
                                {!isProf && (
                                  <div
                                    className="w-7 h-7 rounded-full bg-white/10 border text-[10px] font-bold flex items-center justify-center shrink-0"
                                    style={{
                                      color: authorColor,
                                      borderColor:
                                        authorMeta?.orderIndex > 0
                                          ? `${authorColor}66`
                                          : 'rgba(255,255,255,0.2)',
                                    }}
                                  >
                                    {getAuthorInitials(displayName)}
                                  </div>
                                )}

                                {/* Balão Proporcional ao Conteúdo (Professor sempre à direita com destaque!) */}
                                <div
                                  className={`w-fit max-w-[84%] sm:max-w-[74%] rounded-2xl px-3.5 py-2.5 border transition-all ${
                                    isProf
                                      ? 'rounded-br-sm bg-gradient-to-br from-[#3D0B13] to-[#1D080D] border-[#ED101C]/80 shadow-[0_8px_24px_rgba(237,16,28,0.24)]'
                                      : 'rounded-bl-sm bg-[#161822] border-white/[0.09]'
                                  }`}
                                >
                                  {/* Topo do Balão: 1º Aluno em Branco, demais Alunos em cores distintas, Professor destacado */}
                                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                    <strong
                                      className="text-[11px] sm:text-xs font-extrabold"
                                      style={{ color: authorColor }}
                                    >
                                      {displayName}
                                    </strong>
                                    {isProf && (
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#ED101C] text-white text-[9.5px] font-bold shadow-[0_0_10px_rgba(237,16,28,0.55)]">
                                        <ShieldCheck className="w-2.5 h-2.5" />
                                        <span>(Professor)</span>
                                      </span>
                                    )}
                                  </div>

                                  {/* Citação Compacta de Quem Está Respondendo (com a mesma cor do autor!) */}
                                  {quotedText && (
                                    <div
                                      className={`mb-1.5 px-2.5 py-1.5 rounded-lg border-l-2 text-[11px] leading-snug bg-black/35 ${
                                        isProf ? 'text-white/80' : 'text-white/75'
                                      }`}
                                      style={{
                                        borderLeftColor:
                                          quotedRole === 'professor' ? '#ED101C' : quotedColor,
                                      }}
                                    >
                                      <span
                                        className="block font-bold text-[10.5px]"
                                        style={{
                                          color:
                                            quotedRole === 'professor' ? '#FF6B74' : quotedColor,
                                        }}
                                      >
                                        {quotedAuthor || 'Mensagem anterior'}
                                      </span>
                                      <span className="block truncate max-w-[240px] sm:max-w-[320px] text-white/65">
                                        {quotedText}
                                      </span>
                                    </div>
                                  )}

                                  {/* Texto da Mensagem */}
                                  <p className="text-xs sm:text-[13px] text-white/95 leading-relaxed break-words">
                                    {cmt.text}
                                  </p>

                                  {/* Rodapé Discreto: Horário + Responder + Remover */}
                                  <div className="mt-1.5 flex items-center justify-end gap-3 text-[10px]">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setReplyTarget({
                                          id: cmt.id,
                                          authorName: displayName,
                                          authorRole: cmt.authorRole,
                                          snippet: cmt.text,
                                        })
                                      }
                                      className="font-bold text-white/60 hover:text-white inline-flex items-center gap-1 transition-colors"
                                    >
                                      <span>Responder</span>
                                    </button>
                                    {!isProf && (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteOwnComment(activeAula.id, cmt.id)}
                                        className="text-white/35 hover:text-[#FF5A65] transition-colors"
                                        title="Remover"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    )}
                                    <span className="text-white/40 font-mono">{cmt.createdAt}</span>
                                  </div>
                                </div>

                                {/* Avatar do Professor à Direita */}
                                {isProf && (
                                  <div className="w-7 h-7 rounded-full bg-[#ED101C] border border-[#FF5A65]/60 text-white flex items-center justify-center shrink-0 shadow-[0_0_14px_rgba(237,16,28,0.6)]">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                  </div>
                                )}
                              </div>
                            );
                          });
                        })()}
                      </div>

                      {/* Barra Fixa no Rodapé do Chat (Citação se estiver respondendo + Input + Enviar) */}
                      <div className="bg-[#14161E] border-t border-white/10 p-3 space-y-2 shrink-0">
                        {replyTarget && (
                          <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-[#0B0C11] border-l-2 border-[#ED101C] text-[11px]">
                            <div className="min-w-0">
                              <span className="font-bold text-[#FF5A65] block">
                                Respondendo para {replyTarget.authorName}
                              </span>
                              <span className="text-white/60 truncate block max-w-md">
                                {replyTarget.snippet}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setReplyTarget(null)}
                              aria-label="Cancelar resposta"
                              className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 shrink-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        <form onSubmit={handleSendLessonComment} className="flex items-center gap-2.5">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={session.nome}
                              className="w-8 h-8 rounded-full object-cover border border-[#ED101C]/60 shrink-0 hidden sm:block"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold hidden sm:flex items-center justify-center shrink-0">
                              {studentInitials}
                            </div>
                          )}
                          <input
                            type="text"
                            value={commentDraft}
                            onChange={(e) => setCommentDraft(e.target.value)}
                            placeholder={
                              replyTarget
                                ? `Escreva sua resposta para ${replyTarget.authorName}...`
                                : 'Digite sua dúvida ou comentário sobre esta aula...'
                            }
                            className="flex-1 bg-[#090A0F] border border-white/15 focus:border-[#ED101C] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder:text-white/40 focus:outline-none"
                          />
                          <button
                            type="submit"
                            disabled={!commentDraft.trim()}
                            className="px-4 py-2 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{replyTarget ? 'Responder' : 'Enviar'}</span>
                          </button>
                        </form>
                      </div>
                    </div>

                    {/* Apostilas do Módulo (No mobile só aparece na aba "Conteúdo"; no Desktop ao lado) */}
                    {activeModule.materiais.length > 0 && (
                      <div
                        className={`${
                          mobileClassTab === 'conteudo' ? 'block' : 'hidden lg:block'
                        } xl:col-span-4 rounded-2xl bg-[#101218] border border-white/10 p-4 space-y-3`}
                      >
                        <h4 className="font-display font-extrabold text-xs sm:text-sm text-white flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#ED101C]" />
                          <span>Apostilas do Módulo ({activeModule.materiais.length})</span>
                        </h4>
                        <div className="space-y-2.5">
                          {activeModule.materiais.map((mat) => (
                            <div
                              key={mat.id}
                              className="p-3 rounded-xl bg-[#161822] border border-white/[0.07] flex items-center justify-between gap-2.5"
                            >
                              <div className="min-w-0">
                                <strong className="text-xs text-white block truncate">
                                  {mat.titulo}
                                </strong>
                                <span className="text-[10.5px] text-white/55">
                                  {mat.tipo} • {mat.tamanho}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleMaterialAccess(mat)}
                                className="px-3 py-1.5 rounded-lg bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs font-bold inline-flex items-center gap-1 shrink-0"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Baixar</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* MINI TELINHA FLUTUANTE (CANTO INFERIOR DIREITO ENQUANTO ROLA A PÁGINA) */}
                {miniPipOpen && (
                  <div className="fixed bottom-4 right-4 z-[95] w-[280px] sm:w-[340px] rounded-2xl overflow-hidden bg-[#0E0F14] border-2 border-[#ED101C]/80 shadow-[0_20px_50px_rgba(0,0,0,0.92)]">
                    <div className="relative aspect-video bg-black">
                      <img
                        src={
                          activeAula.videoUrl &&
                          (/\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(activeAula.videoUrl) ||
                            activeAula.videoUrl.startsWith('data:image/'))
                            ? activeAula.videoUrl
                            : curso.thumb
                        }
                        alt={activeAula.titulo}
                        className="w-full h-full object-cover opacity-75"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/60 p-2.5 flex flex-col justify-between">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono font-bold text-[#FF5A65] truncate">
                            Módulo {activeModule.modulo} • Aula {activeAula.ordem}
                          </span>
                          <button
                            type="button"
                            onClick={() => setMiniPipOpen(false)}
                            aria-label="Fechar mini telinha"
                            className="p-1 rounded-md bg-black/70 hover:bg-[#ED101C] text-white transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={handleTogglePlay}
                            className="px-2.5 py-1 rounded-lg bg-[#ED101C] text-white text-[11px] font-bold inline-flex items-center gap-1"
                          >
                            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                            <span>{isPlaying ? 'Pausar' : 'Play'}</span>
                          </button>
                          <span className="text-[10px] font-mono text-white/90 tabular-nums">
                            {formatPlayerTime(currentTimeSec)} / {formatPlayerTime(totalDurationSec)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* LISTA DE MÓDULOS E AULAS NO MOBILE (< LG) — EXATAMENTE NA ABA "AULAS" DA REFERÊNCIA */}
                {mobileClassTab === 'aulas' && (
                  <div className="lg:hidden bg-[#0D0E13] divide-y divide-white/[0.06] pb-8">
                    {modulos.map((mod, mIdx) => {
                      const modAccess = getModuleAccessState(mIdx);
                      const isExpanded = expandedSidebarMod === mod.modulo;
                      const doneInMod = mod.aulas.filter((a) =>
                        completedLessonIds.includes(a.id)
                      ).length;

                      return (
                        <div key={`mob-mod-${mod.modulo}`}>
                          <button
                            type="button"
                            onClick={() => {
                              if (!modAccess.unlocked) {
                                showToast(
                                  `Módulo ${mod.modulo} bloqueado: ${modAccess.lockReason}.`,
                                  'info'
                                );
                                return;
                              }
                              setExpandedSidebarMod(isExpanded ? '' : mod.modulo);
                            }}
                            className={`w-full px-4 py-3.5 flex items-center justify-between gap-2 text-left transition-colors ${
                              !modAccess.unlocked
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-white/[0.03]'
                            }`}
                          >
                            <div className="min-w-0">
                              <strong className="text-xs font-bold text-white block truncate">
                                Módulo {mod.modulo} — {mod.titulo}
                              </strong>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono text-white/60">
                              <span>
                                {doneInMod}/{mod.aulas.length}
                              </span>
                              {!modAccess.unlocked ? (
                                <Lock className="w-3.5 h-3.5 text-white/45" />
                              ) : isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-white/75" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-white/75" />
                              )}
                            </div>
                          </button>

                          {isExpanded && modAccess.unlocked && (
                            <div className="bg-[#0B0C10] py-1">
                              {mod.aulas.map((aula, aIdx) => {
                                const done = completedLessonIds.includes(aula.id);
                                const isCurrentItem =
                                  mIdx === selectedModuleIndex && aIdx === activeAulaIndex;
                                return (
                                  <div
                                    key={`mob-aula-${aula.id}`}
                                    className={`px-4 py-2.5 flex items-center gap-3 transition-colors ${
                                      isCurrentItem ? 'bg-[#221216]' : 'hover:bg-white/[0.03]'
                                    }`}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => toggleLessonCompleted(mod, aula.id)}
                                      aria-label={`Marcar aula ${aula.ordem} como concluída`}
                                      className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 transition-colors ${
                                        done
                                          ? 'bg-[#ED101C] border-[#ED101C] text-white shadow-[0_0_8px_rgba(237,16,28,0.5)]'
                                          : 'border-white/30 text-transparent hover:border-white/60'
                                      }`}
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedModuleIndex(mIdx);
                                        setActiveAulaIndex(aIdx);
                                      }}
                                      className="flex-1 flex items-center gap-3 min-w-0 text-left"
                                    >
                                      <div className="relative w-[84px] h-[48px] rounded-md overflow-hidden bg-black shrink-0 border border-white/10">
                                        <img
                                          src={
                                            aula.videoUrl &&
                                            (/\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(aula.videoUrl) ||
                                              aula.videoUrl.startsWith('data:image/'))
                                              ? aula.videoUrl
                                              : curso.thumb
                                          }
                                          alt={aula.titulo}
                                          className="w-full h-full object-cover opacity-85"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/20">
                                          <div
                                            className="h-full bg-[#ED101C]"
                                            style={{
                                              width: done ? '100%' : isCurrentItem ? '45%' : '0%',
                                            }}
                                          />
                                        </div>
                                      </div>

                                      <div className="min-w-0">
                                        <span className="text-xs font-semibold text-white/95 line-clamp-2 leading-snug block">
                                          {aula.ordem} — {aula.titulo}
                                        </span>
                                        <span className="text-[10px] text-white/50 block mt-0.5">
                                          {aula.tipo} • {aula.duracaoMin} min
                                        </span>
                                      </div>
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* COLUNA DIREITA DESKTOP (LG+): PAINEL "AULAS" IDÊNTICO À REFERÊNCIA */}
              {sidebarLessonsOpen && (
                <aside className="hidden lg:flex lg:flex-col w-[350px] xl:w-[380px] shrink-0 h-full bg-[#131419] border-l border-white/10">
                  {/* Cabeçalho "Aulas" + X */}
                  <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
                    <h3 className="font-display font-extrabold text-base text-white">Aulas</h3>
                    <button
                      type="button"
                      onClick={() => setSidebarLessonsOpen(false)}
                      aria-label="Recolher painel de aulas"
                      className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Lista Acordeão por Módulo (Módulo 01, Módulo 02...) com Checkbox + Miniatura */}
                  <div className="flex-1 overflow-y-auto divide-y divide-white/[0.06]">
                    {modulos.map((mod, mIdx) => {
                      const modAccess = getModuleAccessState(mIdx);
                      const isExpanded = expandedSidebarMod === mod.modulo;
                      const doneInMod = mod.aulas.filter((a) =>
                        completedLessonIds.includes(a.id)
                      ).length;

                      return (
                        <div key={mod.modulo}>
                          <button
                            type="button"
                            onClick={() => {
                              if (!modAccess.unlocked) {
                                showToast(
                                  `Módulo ${mod.modulo} bloqueado: ${modAccess.lockReason}.`,
                                  'info'
                                );
                                return;
                              }
                              setExpandedSidebarMod(isExpanded ? '' : mod.modulo);
                            }}
                            className={`w-full px-5 py-3.5 flex items-center justify-between gap-2 text-left transition-colors ${
                              !modAccess.unlocked
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-white/[0.03]'
                            }`}
                          >
                            <div className="min-w-0">
                              <strong className="text-xs font-bold text-white block truncate">
                                Módulo {mod.modulo} — {mod.titulo}
                              </strong>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono text-white/60">
                              <span>
                                {doneInMod}/{mod.aulas.length}
                              </span>
                              {!modAccess.unlocked ? (
                                <Lock className="w-3.5 h-3.5 text-white/45" />
                              ) : isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-white/65" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-white/65" />
                              )}
                            </div>
                          </button>

                          {isExpanded && modAccess.unlocked && (
                            <div className="bg-[#0E0F14] py-1">
                              {mod.aulas.map((aula, aIdx) => {
                                const done = completedLessonIds.includes(aula.id);
                                const isCurrentItem =
                                  mIdx === selectedModuleIndex && aIdx === activeAulaIndex;
                                return (
                                  <div
                                    key={aula.id}
                                    className={`px-4 py-2.5 flex items-center gap-3 transition-colors ${
                                      isCurrentItem
                                        ? 'bg-[#252730]'
                                        : 'hover:bg-white/[0.04]'
                                    }`}
                                  >
                                    {/* Checkbox de conclusão à esquerda (igual referência!) */}
                                    <button
                                      type="button"
                                      onClick={() => toggleLessonCompleted(mod, aula.id)}
                                      aria-label={`Marcar aula ${aula.ordem} como concluída`}
                                      className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 transition-colors ${
                                        done
                                          ? 'bg-white/25 border-white/50 text-white'
                                          : 'border-white/30 text-transparent hover:border-white/60'
                                      }`}
                                    >
                                      <Check className="w-3 h-3" />
                                    </button>

                                    {/* Mini-thumbnail + título clicáveis */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedModuleIndex(mIdx);
                                        setActiveAulaIndex(aIdx);
                                      }}
                                      className="flex-1 flex items-center gap-3 min-w-0 text-left"
                                    >
                                      <div className="relative w-[84px] h-[48px] rounded-md overflow-hidden bg-black shrink-0 border border-white/10">
                                        <img
                                          src={
                                            aula.videoUrl &&
                                            (/\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(aula.videoUrl) ||
                                              aula.videoUrl.startsWith('data:image/'))
                                              ? aula.videoUrl
                                              : curso.thumb
                                          }
                                          alt={aula.titulo}
                                          className="w-full h-full object-cover opacity-85"
                                        />
                                        {/* Barrinha vermelha na base da mini-thumb (igual referência!) */}
                                        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/20">
                                          <div
                                            className="h-full bg-[#ED101C]"
                                            style={{
                                              width: done ? '100%' : isCurrentItem ? '45%' : '0%',
                                            }}
                                          />
                                        </div>
                                      </div>

                                      <div className="min-w-0">
                                        <span className="text-xs font-medium text-white/95 line-clamp-2 leading-snug block">
                                          {aula.ordem} — {aula.titulo}
                                        </span>
                                      </div>
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </aside>
              )}
            </div>
          ) : activeNav === 'inicio' ? (
            /* =================================================================
               TELA 1: INÍCIO — PORTAL CENTRAL DAS AULAS + DIVISOR ECG OFICIAL BLACK ABAIXO
               Visual limpo e elegante em todas as telas (Mobile, Tablet e Desktop).
            ================================================================= */
            <div className="min-h-[calc(100dvh-250px)] lg:min-h-[calc(100vh-175px)] flex flex-col items-center justify-center gap-5 sm:gap-7 py-3 sm:py-6">
              <div className="w-full max-w-[780px] mx-auto relative rounded-3xl overflow-hidden bg-[#0A0B10] border border-[#ED101C]/50 shadow-[0_24px_70px_rgba(0,0,0,0.85),0_0_40px_rgba(237,16,28,0.14)]">
                <div className="hidden sm:block pointer-events-none absolute inset-y-0 right-0 w-[44%]">
                  <img
                    src="/assets/banner-aph-socorrista-solo.jpg"
                    alt="Curso de Socorrista APH 200h"
                    className="w-full h-full object-cover object-[50%_18%] opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B10] via-[#0A0B10]/55 via-30% to-transparent" />
                </div>

                <div className="relative z-10 p-6 sm:p-10 max-w-2xl space-y-5 sm:space-y-6 flex flex-col items-center text-center sm:items-start sm:text-left">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ED101C]/20 border border-[#ED101C]/60 text-[#FF5A65] text-[11px] sm:text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#ED101C] animate-pulse shrink-0" />
                    <span>Formação Ativa • 200 Horas (11 Módulos)</span>
                  </div>

                  <div>
                    <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white leading-tight">
                      Curso de Socorrista —{' '}
                      <span className="text-[#ED101C]">APH</span>
                    </h2>
                    <p className="text-xs sm:text-base text-white/85 mt-2">
                      {progressStats.pct === 100
                        ? 'Parabéns! Você concluiu todos os 11 módulos (200 horas).'
                        : progressStats.nextPlayableModule
                          ? `Próxima aula disponível: Módulo ${progressStats.nextPlayableModule.modulo} — ${progressStats.nextPlayableModule.titulo}`
                          : progressStats.awaitingReleaseModule
                            ? `Você concluiu até o Módulo ${progressStats.nextModule.modulo}. Aguardando o professor liberar o Módulo ${progressStats.awaitingReleaseModule.modulo}.`
                            : 'Módulo 01 liberado para você começar seus estudos.'}
                    </p>
                  </div>

                  {/* Barra de Progresso Única e Clara */}
                  <div className="w-full max-w-md space-y-2 text-left">
                    <div className="flex items-center justify-between gap-2 text-xs sm:text-sm font-semibold">
                      <span className="text-white/85">
                        Progresso:{' '}
                        <strong className="text-white">
                          {progressStats.completedCount}/11 módulos ({progressStats.completedHours}h / 200h)
                        </strong>
                      </span>
                      <span
                        className={`font-mono font-extrabold shrink-0 ${
                          progressStats.pct === 100 ? 'text-emerald-400' : 'text-[#ED101C]'
                        }`}
                      >
                        {progressStats.pct}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          progressStats.pct === 100 ? 'bg-emerald-500' : 'bg-[#ED101C]'
                        }`}
                        style={{ width: `${progressStats.pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Ação Principal Direta para Mergulhar nas Aulas */}
                  <div className="pt-1 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                    {progressStats.nextPlayableIndex !== null ? (
                      <button
                        type="button"
                        onClick={() => openModuleClassroom(progressStats.nextPlayableIndex)}
                        className="btn-magnetic cta-btn-shimmer w-full sm:w-auto bg-[#ED101C] hover:bg-[#C80B15] text-white font-bold text-sm sm:text-base px-6 sm:px-7 py-3.5 rounded-2xl shadow-[0_8px_28px_rgba(237,16,28,0.45)] inline-flex items-center justify-center gap-2.5"
                      >
                        <Play className="w-5 h-5 fill-current shrink-0" />
                        <span>Entrar no Módulo {progressStats.nextPlayableModule.modulo}</span>
                      </button>
                    ) : progressStats.pct === 100 ? (
                      <button
                        type="button"
                        onClick={() => openModuleClassroom(0)}
                        className="btn-magnetic cta-btn-shimmer w-full sm:w-auto bg-[#ED101C] hover:bg-[#C80B15] text-white font-bold text-sm sm:text-base px-6 sm:px-7 py-3.5 rounded-2xl shadow-[0_8px_28px_rgba(237,16,28,0.45)] inline-flex items-center justify-center gap-2.5"
                      >
                        <Play className="w-5 h-5 fill-current shrink-0" />
                        <span>Revisar Aulas</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openModuleClassroom(progressStats.nextModuleIndex)}
                        className="btn-magnetic cta-btn-shimmer w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#ED101C] hover:bg-[#C80B15] text-white font-bold text-sm sm:text-base shadow-[0_8px_28px_rgba(237,16,28,0.45)] inline-flex items-center justify-center gap-2.5 transition-colors"
                      >
                        <Play className="w-4 h-4 fill-current shrink-0" />
                        <span>Revisar Módulo {progressStats.nextModule.modulo}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => navigateTo('aulas', 'modulos')}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-[#ED101C] shrink-0" />
                      <span>Ver Módulos ({progressStats.teacherUnlockedCount}/11 liberados)</span>
                    </button>

                    {progressStats.modulesOk && (
                      <button
                        type="button"
                        onClick={() => navigateTo('aulas', 'avaliacao')}
                        className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/12 border border-white/10 text-white/90 font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors"
                      >
                        <CheckSquare className="w-4 h-4 text-[#ED101C] shrink-0" />
                        <span>{quizPassed ? 'Avaliação Aprovada ✓' : 'Avaliação Final'}</span>
                      </button>
                    )}
                  </div>

                  {/* Mini guia de estudo em 1 linha dentro do portal */}
                  <p className="text-[11px] sm:text-xs text-white/60 pt-1">
                    Os módulos são liberados gradualmente pelo professor conforme você conclui cada etapa.
                  </p>
                </div>
              </div>

              {/* Divisor de Pulso ECG Oficial BLACK com traço luminoso seguindo cada dobra do sinal */}
              <div className="w-full max-w-[330px] sm:max-w-[540px] lg:max-w-[680px] mx-auto px-2">
                <div className="relative w-full">
                  {/* Aura vermelha suave pulsando no pico central do ECG */}
                  <div
                    className="pointer-events-none absolute left-1/2 top-1/2 w-20 sm:w-28 h-10 sm:h-12 rounded-full bg-[#ED101C]/40 blur-xl black-ecg-core-aura"
                    aria-hidden="true"
                  />

                  {/* Imagem base oficial do Pulso ECG BLACK */}
                  <img
                    src="/assets/divisor-ecg-black.png"
                    alt="Pulso ECG Oficial BLACK Treinamentos"
                    className="relative z-10 w-full h-auto block select-none pointer-events-none drop-shadow-[0_0_24px_rgba(237,16,28,0.3)]"
                  />

                  {/* SVG alinhado 1:1 com a imagem (1000x130): a luz percorre exatamente cada subida e descida do ECG */}
                  <svg
                    viewBox="0 0 1000 130"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    className="pointer-events-none select-none absolute inset-0 z-20 w-full h-full overflow-visible"
                  >
                    <defs>
                      <filter id="blackEcgGlowFilter" x="-20%" y="-40%" width="140%" height="180%">
                        <feGaussianBlur stdDeviation="2.8" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    {/* Cauda vermelha intensa acompanhando os contornos do sinal */}
                    <path
                      d="M 162 71 L 473 71 L 480 65 L 486 71 L 490 74 L 498 37 L 504 96 L 512 71 L 519 71 L 525 65 L 531 71 L 838 71"
                      pathLength="100"
                      fill="none"
                      stroke="#FF2B3A"
                      strokeWidth="3.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#blackEcgGlowFilter)"
                      className="black-ecg-trace-tail"
                    />
                    {/* Ponta de luz branca incandescente subindo e descendo exatamente nas dobras do ECG */}
                    <path
                      d="M 162 71 L 473 71 L 480 65 L 486 71 L 490 74 L 498 37 L 504 96 L 512 71 L 519 71 L 525 65 L 531 71 L 838 71"
                      pathLength="100"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#blackEcgGlowFilter)"
                      className="black-ecg-trace-spark"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ) : activeNav === 'aulas' ? (
            /* =================================================================
               TELA 2: MINHAS AULAS — GRID MODERNO E DIRETO DOS 11 MÓDULOS
               Sem sub-abas confusas, sem busca/filtros de catálogo: bate o olho e entra!
            ================================================================= */
            aulasSubTab === 'avaliacao' ? (
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
                    <span>Voltar para as Aulas</span>
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
            ) : (
              <div className="space-y-6">
                {/* 1. Banner Superior da Trilha na Identidade BLACK (com textura sutil + pulso vermelho) */}
                <div className="relative overflow-hidden rounded-3xl bg-[#0A0B10] border border-[#ED101C]/45 p-5 sm:p-6 shadow-[0_18px_45px_rgba(0,0,0,0.85),0_0_28px_rgba(237,16,28,0.12)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="hidden sm:block pointer-events-none absolute inset-y-0 right-0 w-[36%] opacity-65">
                    <img
                      src="/assets/banner-aph-socorrista-solo.jpg"
                      alt=""
                      className="w-full h-full object-cover object-[50%_22%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B10] via-[#0A0B10]/70 to-transparent" />
                  </div>
                  <div
                    className="pointer-events-none absolute inset-x-8 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#ED101C] to-transparent opacity-80"
                    aria-hidden="true"
                  />

                  <div className="relative z-10 space-y-2.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#FF5A65]">
                        <span className="w-2 h-2 rounded-full bg-[#ED101C] animate-pulse shrink-0" />
                        <span>
                          Trilha do Curso • {progressStats.teacherUnlockedCount} de 11 módulos liberados
                        </span>
                      </span>
                      <span className="font-mono text-sm font-extrabold text-[#ED101C]">
                        {progressStats.pct}%
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#C80B15] to-[#ED101C] shadow-[0_0_12px_rgba(237,16,28,0.65)] transition-all duration-500"
                        style={{ width: `${progressStats.pct}%` }}
                      />
                    </div>

                    <p className="text-xs text-white/75">
                      <strong className="text-white">
                        {progressStats.completedCount} de 11 módulos concluídos
                      </strong>{' '}
                      ({progressStats.completedHours}h / 200h) •{' '}
                      {progressStats.awaitingReleaseModule
                        ? `Módulo ${progressStats.awaitingReleaseModule.modulo} aguarda liberação do professor.`
                        : 'Os módulos abrem conforme a liberação do professor e conclusão da etapa anterior.'}
                    </p>
                  </div>

                  <div className="relative z-10 shrink-0">
                    {progressStats.nextPlayableIndex !== null ? (
                      <button
                        type="button"
                        onClick={() => openModuleClassroom(progressStats.nextPlayableIndex)}
                        className="btn-magnetic cta-btn-shimmer w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-sm font-bold shadow-[0_8px_24px_rgba(237,16,28,0.45)] inline-flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4 fill-current shrink-0" />
                        <span>Continuar Módulo {progressStats.nextPlayableModule.modulo}</span>
                      </button>
                    ) : progressStats.pct === 100 ? (
                      <button
                        type="button"
                        onClick={() => openModuleClassroom(0)}
                        className="btn-magnetic cta-btn-shimmer w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-sm font-bold shadow-[0_8px_24px_rgba(237,16,28,0.45)] inline-flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4 fill-current shrink-0" />
                        <span>Revisar Aulas</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openModuleClassroom(progressStats.nextModuleIndex)}
                        className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/[0.08] hover:bg-[#ED101C] border border-[#ED101C]/60 hover:border-[#ED101C] text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-all"
                      >
                        <Play className="w-4 h-4 fill-current shrink-0" />
                        <span>Revisar Módulo {progressStats.nextModule.modulo}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Grid Vitrine BLACK dos 11 Módulos (Zero amarelo / zero verde excessivo) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                  {modulos.map((mod, idx) => {
                    const access = getModuleAccessState(idx);
                    const isDone = access.isDone;
                    const isLocked = !access.unlocked;
                    const isCurrent =
                      access.unlocked &&
                      !isDone &&
                      progressStats.nextPlayableModule?.modulo === mod.modulo;
                    const modDoneLessons = mod.aulas.filter((a) =>
                      completedLessonIds.includes(a.id)
                    ).length;
                    const modTotalLessons = Math.max(1, mod.aulas.length);
                    const modPct = isDone
                      ? 100
                      : Math.round((modDoneLessons / modTotalLessons) * 100);

                    return (
                      <button
                        key={mod.modulo}
                        type="button"
                        onClick={() => openModuleClassroom(idx)}
                        className={`group relative overflow-hidden text-left rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex flex-col justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ED101C] ${
                          isLocked
                            ? 'bg-[#090A0F] border-white/[0.07] hover:border-white/20 cursor-not-allowed'
                            : isCurrent
                              ? 'bg-gradient-to-br from-[#240A0E] via-[#14121A] to-[#0D0E14] border-[#ED101C] shadow-[0_14px_34px_rgba(237,16,28,0.22)] hover:-translate-y-0.5'
                              : isDone
                                ? 'bg-gradient-to-br from-[#171923] to-[#0E0F15] border-white/20 hover:border-[#ED101C]/75 hover:-translate-y-0.5 shadow-[0_10px_28px_rgba(0,0,0,0.45)]'
                                : 'bg-[#11131A] border-white/15 hover:border-[#ED101C]/70 hover:-translate-y-0.5'
                        }`}
                      >
                        {/* Linha de brilho sutil no topo dos módulos liberados/concluídos */}
                        {!isLocked && (
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none absolute inset-x-5 top-0 h-[1.5px] bg-gradient-to-r from-transparent ${
                              isCurrent ? 'via-[#ED101C]' : 'via-white/45 group-hover:via-[#ED101C]'
                            } to-transparent transition-colors`}
                          />
                        )}

                        {/* Número em Marca d'Água no Fundo Direito para Profundidade Visual */}
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none select-none absolute -right-2 -top-3 font-display font-black text-6xl tracking-tighter leading-none transition-opacity ${
                            isLocked
                              ? 'text-white/[0.025]'
                              : isCurrent
                                ? 'text-[#ED101C]/[0.12]'
                                : 'text-white/[0.045] group-hover:text-[#ED101C]/[0.09]'
                          }`}
                        >
                          {mod.modulo}
                        </span>

                        <div className="relative z-10 space-y-3.5 w-full">
                          {/* Topo do Quadradinho: Número + Selo de Status na Paleta BLACK */}
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`w-10 h-10 rounded-xl font-mono text-sm font-extrabold flex items-center justify-center shrink-0 transition-transform ${
                                isLocked
                                  ? 'bg-white/[0.04] text-white/35 border border-white/[0.08]'
                                  : isCurrent
                                    ? 'bg-[#ED101C] text-white shadow-[0_0_18px_rgba(237,16,28,0.6)] group-hover:scale-105'
                                    : isDone
                                      ? 'bg-[#220B0F] text-white border border-[#ED101C]/60 group-hover:bg-[#ED101C] group-hover:scale-105'
                                      : 'bg-white/[0.07] text-white border border-white/15 group-hover:scale-105'
                              }`}
                            >
                              {isLocked ? <Lock className="w-4 h-4" /> : mod.modulo}
                            </span>

                            {isLocked ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/45 text-[10px] font-mono font-bold uppercase">
                                <Lock className="w-3 h-3" />
                                <span>Bloqueado</span>
                              </span>
                            ) : isCurrent ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ED101C]/20 border border-[#ED101C]/70 text-[#FF5A65] text-[10px] font-mono font-bold uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ED101C] animate-pulse" />
                                <span>Liberado</span>
                              </span>
                            ) : isDone ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/20 text-white text-[10px] font-mono font-bold uppercase">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span>Concluído</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/15 text-white/80 text-[10px] font-mono font-bold uppercase">
                                Liberado
                              </span>
                            )}
                          </div>

                          {/* Nome do Módulo */}
                          <div>
                            <span
                              className={`block text-[10px] font-mono uppercase tracking-wider mb-0.5 ${
                                isLocked ? 'text-white/35' : 'text-[#FF5A65]/90 font-bold'
                              }`}
                            >
                              Módulo {mod.modulo}
                            </span>
                            <h3
                              className={`font-display font-extrabold text-sm sm:text-base leading-snug line-clamp-2 min-h-[2.6rem] ${
                                isLocked ? 'text-white/45' : 'text-white'
                              }`}
                            >
                              {mod.titulo}
                            </h3>
                          </div>
                        </div>

                        {/* Base do Quadradinho: Progresso + Rodapé Limpo */}
                        <div className="relative z-10 w-full space-y-3 pt-1">
                          <div className="space-y-1.5">
                            <div
                              className={`flex items-center justify-between text-[11px] ${
                                isLocked ? 'text-white/35' : 'text-white/65'
                              }`}
                            >
                              <span>
                                {modDoneLessons}/{modTotalLessons}{' '}
                                {modTotalLessons === 1 ? 'aula' : 'aulas'}
                              </span>
                              <span className="font-mono font-bold">
                                {mod.cargaHoraria}
                              </span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  isLocked
                                    ? 'bg-white/10'
                                    : isDone
                                      ? 'bg-gradient-to-r from-[#ED101C] to-[#FF5A65]'
                                      : 'bg-[#ED101C]'
                                }`}
                                style={{ width: `${modPct}%` }}
                              />
                            </div>
                          </div>

                          <div className="pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-xs font-bold">
                            <span
                              className={
                                isLocked
                                  ? 'text-white/40 text-[11px] font-medium'
                                  : isCurrent
                                    ? 'text-[#FF5A65]'
                                    : 'text-white/85 group-hover:text-white'
                              }
                            >
                              {isLocked
                                ? access.lockReason
                                : isDone
                                  ? 'Revisar módulo'
                                  : isCurrent
                                    ? 'Entrar na aula'
                                    : 'Abrir módulo'}
                            </span>
                            {isLocked ? (
                              <Lock className="w-3.5 h-3.5 text-white/30 shrink-0" />
                            ) : (
                              <ArrowRight className="w-4 h-4 text-[#ED101C] transition-transform group-hover:translate-x-1 shrink-0" />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* 3. Card Discreto de Fechamento ao Terminar os Módulos (Avaliação Final) */}
                <div className="rounded-2xl bg-[#11131A] border border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        quizPassed
                          ? 'bg-emerald-500/15 border-emerald-500/45 text-emerald-400'
                          : progressStats.modulesOk
                            ? 'bg-[#1B080B] border-[#ED101C]/50 text-[#ED101C]'
                            : 'bg-white/[0.04] border-white/10 text-white/40'
                      }`}
                    >
                      {progressStats.modulesOk || quizPassed ? (
                        <CheckSquare className="w-5 h-5" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <strong className="font-display font-extrabold text-sm sm:text-base text-white block">
                        Etapa Final • Avaliação do Curso (200h)
                      </strong>
                      <span className="text-xs text-white/65">
                        {quizPassed
                          ? `Aprovado com ${progressState.quizBestPct || 100}% ✓ — Requisito de prova concluído.`
                          : progressStats.modulesOk
                            ? 'Todos os 11 módulos concluídos! Avaliação oficial liberada (mínimo 70%).'
                            : 'Libera automaticamente após concluir os 11 módulos liberados pelo professor.'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!progressStats.modulesOk && !quizPassed) {
                        showToast(
                          `Conclua os 11 módulos liberados (${progressStats.completedCount}/11) para liberar a Avaliação Final.`,
                          'info'
                        );
                        return;
                      }
                      setAulasSubTab('avaliacao');
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shrink-0 transition-colors ${
                      quizPassed
                        ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
                        : progressStats.modulesOk
                          ? 'bg-[#ED101C] hover:bg-[#C80B15] border border-[#ED101C] text-white'
                          : 'bg-white/[0.04] border border-white/10 text-white/45 cursor-not-allowed'
                    }`}
                  >
                    {!progressStats.modulesOk && !quizPassed && <Lock className="w-3.5 h-3.5" />}
                    <span>
                      {quizPassed
                        ? 'Avaliação Aprovada ✓'
                        : progressStats.modulesOk
                          ? 'Abrir Avaliação Final'
                          : 'Bloqueada (0/11 → 11/11)'}
                    </span>
                    {(progressStats.modulesOk || quizPassed) && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )
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
                <div className="bg-[#0D0E14] border border-white/10 rounded-3xl p-4 sm:p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-display font-extrabold text-xl text-white">
                        Minha Frequência Presencial
                      </h2>
                      <p className="text-xs sm:text-sm text-white/60">
                        Aulas aos sábados na Unicesumar • Frequência mínima exigida: 75%
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-emerald-500/40 text-emerald-400 text-xs sm:text-sm font-extrabold">
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
                      className="p-4 sm:p-5 rounded-2xl bg-[#13151E] border border-[#ED101C]/45 space-y-4"
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
                            Data da Aula (somente sábados letivos)
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowJustifyDatePicker((v) => !v)}
                            className={`w-full bg-[#0A0B0F] border rounded-xl px-3.5 py-2.5 text-sm text-white flex items-center justify-between gap-2 transition-colors ${showJustifyDatePicker
                              ? 'border-[#ED101C] ring-1 ring-[#ED101C]/50'
                              : 'border-white/15 hover:border-[#ED101C]/70'
                              }`}
                          >
                            <span className="inline-flex items-center gap-2 font-semibold min-w-0">
                              <CalendarIcon className="w-4 h-4 text-[#ED101C] shrink-0" />
                              <span className="truncate">
                                {(() => {
                                  const [jy, jm, jd] = justifyDate.split('-').map(Number);
                                  const ev = getCourseEventForDate(jy, jm - 1, jd);
                                  const formatted = `${String(jd).padStart(2, '0')}/${String(
                                    jm
                                  ).padStart(2, '0')}/${jy}`;
                                  return ev ? `Sábado, ${formatted} • ${ev.titulo}` : formatted;
                                })()}
                              </span>
                            </span>
                            <span className="text-[11px] font-bold text-[#FF6B74] shrink-0">
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

                      {/* Calendário 3D Oficial do Curso (dias sem aula estritamente bloqueados!) */}
                      {showJustifyDatePicker && (
                        <Justify3DDatePicker
                          value={justifyDate}
                          pickerYear={justifyPickerYear}
                          pickerMonth={justifyPickerMonth}
                          onChangeMonth={(nextY, nextM) => {
                            setJustifyPickerYear(nextY);
                            setJustifyPickerMonth(nextM);
                          }}
                          onSelectDate={(isoKey) => {
                            setJustifyDate(isoKey);
                            setShowJustifyDatePicker(false);
                          }}
                          onClose={() => setShowJustifyDatePicker(false)}
                        />
                      )}

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

                  {/* Acordeão 1: Lista de Presenças (recolhida por padrão para manter o painel limpo) */}
                  <div className="rounded-2xl bg-[#13151E] border border-white/10 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setShowAttendanceList((v) => !v)}
                      aria-expanded={showAttendanceList}
                      className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </span>
                        <div className="min-w-0">
                          <strong className="text-sm font-bold text-white block">
                            {showAttendanceList
                              ? 'Fechar Lista de Presenças'
                              : 'Abrir Lista de Presenças'}
                          </strong>
                          <span className="text-[11px] text-white/55 block truncate">
                            {FREQUENCIA_PRESENCIAL_DEMO.ultimosSabados.length} aulas registradas •{' '}
                            {
                              FREQUENCIA_PRESENCIAL_DEMO.ultimosSabados.filter(
                                (s) => s.status === 'presente'
                              ).length
                            }{' '}
                            presenças confirmadas
                          </span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-2 shrink-0 text-xs font-semibold text-white/75">
                        <span className="hidden sm:inline">
                          {showAttendanceList ? 'Recolher' : 'Visualizar'}
                        </span>
                        {showAttendanceList ? (
                          <ChevronUp className="w-4 h-4 text-[#FF6B74]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-white/60" />
                        )}
                      </span>
                    </button>

                    {showAttendanceList && (
                      <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-white/10 space-y-2">
                        {FREQUENCIA_PRESENCIAL_DEMO.ultimosSabados.map((sab) => (
                          <div
                            key={sab.data}
                            className="p-3.5 rounded-xl bg-[#0D0E14] border border-white/10 flex items-center justify-between gap-3 hover:border-white/20 transition-colors"
                          >
                            <div className="min-w-0">
                              <strong className="text-sm text-white block truncate">
                                {sab.tema}
                              </strong>
                              <span className="text-xs font-mono text-white/50">{sab.data}</span>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 ${
                                sab.status === 'presente'
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/35'
                                  : 'bg-[#ED101C]/15 text-[#FF8C93] border border-[#ED101C]/35'
                              }`}
                            >
                              {sab.status === 'presente' ? '✓ Presente' : 'Justificada'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Acordeão 2: Minhas Justificativas Enviadas (recolhida por padrão; abre mesmo zerada!) */}
                  <div className="rounded-2xl bg-[#13151E] border border-white/10 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setShowSentJustifications((v) => !v)}
                      aria-expanded={showSentJustifications}
                      className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-white/[0.03] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-8 h-8 rounded-xl bg-[#ED101C]/15 border border-[#ED101C]/35 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-[#FF6B74]" />
                        </span>
                        <div className="min-w-0">
                          <strong className="text-sm font-bold text-white block">
                            Minhas Justificativas Enviadas ({justifications.length})
                          </strong>
                          <span className="text-[11px] text-white/55 block truncate">
                            {justifications.length === 0
                              ? 'Zerado • Nenhuma justificativa enviada'
                              : `${justifications.length} justificativa(s) registrada(s)`}
                          </span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-2 shrink-0 text-xs font-semibold text-white/75">
                        <span className="hidden sm:inline">
                          {showSentJustifications ? 'Recolher' : 'Abrir'}
                        </span>
                        {showSentJustifications ? (
                          <ChevronUp className="w-4 h-4 text-[#FF6B74]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-white/60" />
                        )}
                      </span>
                    </button>

                    {showSentJustifications && (
                      <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-white/10 space-y-2.5">
                        {justifications.length === 0 ? (
                          <div className="p-4 rounded-xl bg-[#0D0E14] border border-white/10 text-center space-y-1">
                            <p className="text-sm font-semibold text-white/80">
                              Nenhuma justificativa enviada até o momento.
                            </p>
                            <p className="text-xs text-white/50">
                              Clique em &ldquo;Justificar Falta / Atestado&rdquo; acima quando precisar registrar uma ausência.
                            </p>
                          </div>
                        ) : (
                          justifications.map((item) => {
                            const isConfirming = confirmDeleteJustId === item.id;
                            return (
                              <div
                                key={item.id}
                                className="p-4 rounded-xl bg-[#0D0E14] border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                              >
                                <div className="min-w-0">
                                  <strong className="text-sm text-white block">
                                    Aula de {item.data} — {item.motivo}
                                  </strong>
                                  <span className="text-xs text-white/60 block mt-0.5">
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

                                  <span className="px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/15 text-white/85 text-xs font-bold">
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
                          })
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : activeNav === 'certificado' ? (
            /* =================================================================
               TELA 4: MEU CERTIFICADO (200H) — ESTILO BLACK CENTRALIZADO (SEM AMARELO)
            ================================================================= */
            <div className="max-w-4xl mx-auto bg-[#0D0E14] border border-[#ED101C]/40 rounded-3xl p-5 sm:p-8 space-y-6 shadow-[0_24px_60px_rgba(0,0,0,0.65)]">
              <div className="flex flex-col items-center text-center gap-3 pb-5 border-b border-white/10">
                <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#FF5A65]">
                  Certificado Oficial • 200 Horas • Lei nº 9.394/96 (LDB)
                </span>
                <h2 className="font-display font-extrabold text-xl sm:text-3xl text-white tracking-tight">
                  Diploma — Curso de Socorrista APH
                </h2>
                <span
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold border ${
                    progressStats.certificateUnlocked
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                      : certRequest?.status === 'pending'
                      ? 'bg-[#ED101C]/15 border-[#ED101C]/50 text-[#FF8C93]'
                      : progressStats.requirementsMet
                      ? 'bg-emerald-500/15 border-emerald-500/45 text-emerald-300'
                      : 'bg-white/[0.05] border-white/15 text-white/80'
                  }`}
                >
                  {progressStats.certificateUnlocked ? (
                    <>
                      <Unlock className="w-4 h-4" />
                      <span>Autorizado e Liberado ✓</span>
                    </>
                  ) : certRequest?.status === 'pending' ? (
                    <>
                      <Clock className="w-4 h-4 text-[#FF4B57]" />
                      <span>Em Conferência pela Coordenação</span>
                    </>
                  ) : progressStats.requirementsMet ? (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Pronto para Solicitar Liberação</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#FF4B57]" />
                      <span>Requisitos em Andamento</span>
                    </>
                  )}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-center sm:text-left">
                <div
                  className={`p-4 rounded-2xl border ${
                    progressStats.modulesOk
                      ? 'bg-[#0F1B17] border-emerald-500/40'
                      : 'bg-[#13151E] border-white/10'
                  }`}
                >
                  <span className="text-xs text-white/60 block">1. Módulos (200h)</span>
                  <strong
                    className={`text-base mt-1 block ${
                      progressStats.modulesOk ? 'text-emerald-400' : 'text-white'
                    }`}
                  >
                    {progressStats.completedCount} de 11 concluídos
                    {progressStats.modulesOk ? ' ✓' : ''}
                  </strong>
                </div>
                <div className="p-4 rounded-2xl border bg-[#0F1B17] border-emerald-500/40">
                  <span className="text-xs text-white/60 block">2. Frequência Presencial</span>
                  <strong className="text-base text-emerald-400 mt-1 block">
                    {FREQUENCIA_PRESENCIAL_DEMO.percentualAtual}% (Mínimo 75%) ✓
                  </strong>
                </div>
                <div
                  className={`p-4 rounded-2xl border ${
                    quizPassed
                      ? 'bg-[#0F1B17] border-emerald-500/40'
                      : 'bg-[#13151E] border-white/10'
                  }`}
                >
                  <span className="text-xs text-white/60 block">3. Avaliação Final</span>
                  <strong
                    className={`text-base mt-1 block ${
                      quizPassed ? 'text-emerald-400' : 'text-white'
                    }`}
                  >
                    {quizPassed
                      ? `Aprovado (${progressState.quizBestPct || 100}%) ✓`
                      : 'Pendente (≥ 70%)'}
                  </strong>
                </div>
              </div>

              {/* ETAPA 4: CONFERÊNCIA E AUTORIZAÇÃO OBRIGATÓRIA DO SUPERVISOR (CLEVE) */}
              {!progressStats.requirementsMet ? (
                <div className="p-5 rounded-2xl bg-[#13151E] border border-[#ED101C]/40 flex flex-col items-center text-center gap-4">
                  <p className="text-xs sm:text-sm text-white/80 max-w-xl">
                    Assim que completar os 3 requisitos acima, você poderá solicitar a conferência oficial da Coordenação para liberar a impressão A4 do seu diploma.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowCertPreviewMode(!showCertPreviewMode)}
                      className="px-4 py-2.5 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs font-bold shadow-red-glow-sm transition-colors"
                    >
                      {showCertPreviewMode ? 'Ocultar Prévia do Modelo' : 'Ver Prévia (sem impressão)'}
                    </button>
                  </div>
                </div>
              ) : !progressStats.certificateUnlocked ? (
                certRequest?.status === 'pending' ? (
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#161824] via-[#12131C] to-[#1D090D] border border-[#ED101C]/45 space-y-4">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#ED101C]/15 border border-[#ED101C]/50 text-[#FF5A65] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(237,16,28,0.22)]">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div className="space-y-1.5">
                        <strong className="text-base sm:text-lg text-white block">
                          Solicitação enviada para a Coordenação (Cleverson da Cruz)!
                        </strong>
                        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                          Recebemos seu pedido de emissão no dia{' '}
                          <strong className="text-white">{certRequest.requestedAt}</strong> para{' '}
                          <strong className="text-white">{session.nome}</strong> (CPF{' '}
                          <strong className="font-mono text-[#FF8C93]">{session.cpf}</strong>). Assim que o coordenador conferir seus dados oficiais e autorizar no Painel Administrativo, o botão de impressão A4 será liberado automaticamente aqui.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2.5 pt-2 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setShowCertPreviewMode(!showCertPreviewMode)}
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-colors"
                      >
                        {showCertPreviewMode
                          ? 'Ocultar Prévia do Diploma'
                          : 'Ver Prévia (sem impressão)'}
                      </button>
                      <a
                        href={getWhatsAppUrl(
                          `Olá! Sou ${session.nome}, aluno do Curso de Socorrista APH (200h). Acabei de concluir os 11 módulos e solicitei a liberação do meu Certificado no Portal do Aluno.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-red-glow-sm transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Avisar Coordenação no WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#1D080C] to-[#141722] border border-[#ED101C]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-left">
                      {certRequest?.status === 'rejected' && (
                        <span className="inline-block text-xs font-bold text-[#FF6B74] mb-1">
                          ⚠️ {certRequest.reviewerNote}
                        </span>
                      )}
                      <strong className="text-base sm:text-lg text-white block">
                        Parabéns! Todos os requisitos de 200h foram concluídos ✓
                      </strong>
                      <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                        Clique no botão ao lado para enviar seu pedido à Coordenação. O diretor{' '}
                        <strong>Cleverson da Cruz</strong> vai conferir seu nome (
                        <strong>{session.nome}</strong>) e CPF (<strong>{session.cpf}</strong>) e liberar o seu Certificado Oficial para impressão.
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
                <div className="p-4 rounded-2xl bg-[#0F1B17] border border-emerald-500/45 flex items-center justify-center sm:justify-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <p className="text-xs sm:text-sm text-emerald-200 font-semibold">
                    Certificado conferido e{' '}
                    <strong>autorizado pela Coordenação BLACK Treinamentos</strong>! Seu diploma oficial (Frente e Verso — 200h) está pronto para visualização e impressão A4.
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
          ) : activeNav === 'financeiro' ? (() => {
            /* =================================================================
               TELA 5: FINANCEIRO (10X) — VISUAL BLACK + FOCO PARCELA ATUAL + LISTA ENXUTA
            ================================================================= */
            const currentFocus =
              installments.find((item) => item.status === 'atrasada') ||
              installments.find((item) => item.status === 'aberta') ||
              installments.find((item) => item.status === 'futura') ||
              null;

            // Ordena colocando a parcela atual e pendentes primeiro quando recolhido (5 visíveis)
            const visibleList = showAllInstallments
              ? installments
              : (() => {
                  if (!currentFocus) return installments.slice(0, 5);
                  const idx = installments.findIndex((i) => i.numero === currentFocus.numero);
                  const start = Math.max(0, Math.min(idx - 1, installments.length - 5));
                  return installments.slice(start, start + 5);
                })();

            const focusDue = currentFocus
              ? getDueInfo(currentFocus.vencimento, currentFocus.status)
              : null;

            return (
              <div className="max-w-5xl mx-auto bg-[#0D0E14] border border-white/10 rounded-3xl p-4 sm:p-7 space-y-5 shadow-[0_24px_60px_rgba(0,0,0,0.6)]">
                {/* Cabeçalho */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center sm:text-left">
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5A65]">
                      Gestão Financeira do Aluno
                    </span>
                    <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white mt-0.5">
                      Minhas Parcelas e Boletos (10x de R$ 200,00)
                    </h2>
                    <p className="text-xs text-white/55 mt-0.5">
                      Valor total do curso: <strong className="text-white/85">R$ 2.000,00</strong>
                    </p>
                  </div>
                  <span
                    className={`self-center sm:self-auto px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold border shrink-0 ${
                      financeSummary.atrasadasCount > 0
                        ? 'bg-[#ED101C]/15 border-[#ED101C]/50 text-[#FF8C93]'
                        : 'bg-[#0F1B17] border-emerald-500/45 text-emerald-400'
                    }`}
                  >
                    {financeSummary.pagasCount} de {installments.length} pagas •{' '}
                    {financeSummary.atrasadasCount > 0
                      ? `${financeSummary.atrasadasCount} em atraso`
                      : 'Em dia'}
                  </span>
                </div>

                {/* Resumo Rápido BLACK */}
                <div className="grid grid-cols-3 gap-2.5 text-center sm:text-left">
                  <div className="p-3 rounded-2xl bg-[#0F1815] border border-emerald-500/35">
                    <span className="text-[11px] text-white/60 block">Pagas</span>
                    <strong className="text-xs sm:text-base font-extrabold text-emerald-400">
                      {financeSummary.pagasCount} parc.
                      <span className="hidden sm:inline font-mono text-xs text-emerald-300/80">
                        {' '}
                        ({formatMoneyBRL(financeSummary.pagasTotal)})
                      </span>
                    </strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#190B0E] border border-[#ED101C]/45">
                    <span className="text-[11px] text-white/60 block">Em aberto</span>
                    <strong className="text-xs sm:text-base font-extrabold text-[#FF5A65]">
                      {financeSummary.abertasCount} parc.
                      <span className="hidden sm:inline font-mono text-xs text-[#FF8C93]/85">
                        {' '}
                        ({formatMoneyBRL(financeSummary.abertasTotal)})
                      </span>
                    </strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#131620] border border-white/10">
                    <span className="text-[11px] text-white/60 block">A vencer</span>
                    <strong className="text-xs sm:text-base font-extrabold text-white">
                      {financeSummary.futurasCount} parc.
                      <span className="hidden sm:inline font-mono text-xs text-white/65">
                        {' '}
                        ({formatMoneyBRL(financeSummary.futurasTotal)})
                      </span>
                    </strong>
                  </div>
                </div>

                {/* CARD HERO: FOCO NA PARCELA ATUAL DO CLIENTE */}
                {currentFocus ? (
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#161824] via-[#11131B] to-[#1E080D] border border-[#ED101C]/55 shadow-[0_12px_35px_rgba(237,16,28,0.16)] space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#ED101C] text-white text-[10px] font-extrabold uppercase tracking-wider">
                            {focusDue?.isOverdue
                              ? 'Parcela Vencida em Foco'
                              : 'Parcela Atual em Foco'}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-white/[0.08] border border-white/15 text-white text-[11px] font-mono font-bold">
                            Vence em {currentFocus.vencimento} • {focusDue?.countdownLabel}
                          </span>
                        </div>
                        <h3 className="font-display font-extrabold text-lg sm:text-2xl text-white">
                          Parcela {String(currentFocus.numero).padStart(2, '0')}/10 —{' '}
                          {focusDue?.monthYearLabel}
                        </h3>
                        <p className="text-xs text-white/75">
                          {focusDue?.isOverdue
                            ? 'Esta parcela já passou da data de vencimento. Regularize abaixo.'
                            : `Parcela não vencida (${focusDue?.countdownLabel.toLowerCase()}). Ao clicar em pagar, exibiremos o calendário e a confirmação do mês.`}
                        </p>
                      </div>

                      <div className="flex flex-col sm:items-end gap-2 shrink-0">
                        <strong className="font-display font-black text-2xl sm:text-3xl text-white">
                          {currentFocus.valor}
                        </strong>
                        <button
                          type="button"
                          onClick={() => setAdvanceParcela({ parcela: currentFocus, isFocus: true })}
                          className="btn-magnetic px-5 py-2.5 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-2 shadow-red-glow-sm transition-colors"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Pagar Parcela {currentFocus.numero}/10</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-[#0F1B17] border border-emerald-500/45 flex items-center justify-center gap-3 text-emerald-300">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <strong className="text-sm sm:text-base">
                      Parabéns! Todas as 10 parcelas do curso estão quitadas ✓
                    </strong>
                  </div>
                )}

                {/* LISTA COMPACTA DE PARCELAS (5 POR PADRÃO + BOTÃO MOSTRAR MAIS) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/60">
                      {showAllInstallments
                        ? `Todas as Parcelas (${installments.length})`
                        : `Resumo Próximo à Parcela Atual (${visibleList.length} de ${installments.length})`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAllInstallments((v) => !v)}
                      className="text-xs font-bold text-[#FF6B74] hover:text-white inline-flex items-center gap-1 transition-colors"
                    >
                      <span>
                        {showAllInstallments
                          ? 'Mostrar apenas 5'
                          : `Ver todas (${installments.length})`}
                      </span>
                      {showAllInstallments ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {visibleList.map((p) => {
                    const hasBoleto = Boolean(p.boletoFileId || p.boletoDataUrl || p.boletoNome);
                    const due = getDueInfo(p.vencimento, p.status);
                    const isFocus = currentFocus?.numero === p.numero;

                    return (
                      <div
                        key={p.numero}
                        className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                          p.status === 'paga'
                            ? 'bg-[#10141A] border-emerald-500/25'
                            : isFocus
                            ? 'bg-[#17121A] border-[#ED101C]/65'
                            : 'bg-[#13151E] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`w-10 h-10 rounded-xl font-mono text-xs font-extrabold flex items-center justify-center shrink-0 border ${
                              p.status === 'paga'
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                                : isFocus
                                ? 'bg-[#ED101C] border-[#FF7A83]/60 text-white shadow-red-glow-sm'
                                : 'bg-white/[0.05] border-white/10 text-white/80'
                            }`}
                          >
                            {String(p.numero).padStart(2, '0')}/10
                          </span>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <strong className="text-sm sm:text-base text-white">
                                Parcela {p.numero} — {p.valor}
                              </strong>
                              {p.status === 'paga' ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 text-[10px] font-bold">
                                  ✓ Paga
                                </span>
                              ) : due.isOverdue ? (
                                <span className="px-2 py-0.5 rounded-full bg-[#ED101C]/20 border border-[#ED101C]/60 text-[#FF6B74] text-[10px] font-bold">
                                  ⚠ {due.shortCountdown}
                                </span>
                              ) : isFocus ? (
                                <span className="px-2 py-0.5 rounded-full bg-[#ED101C]/15 border border-[#ED101C]/50 text-[#FF8C93] text-[10px] font-bold">
                                  Atual • {due.shortCountdown}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/15 text-white/75 text-[10px] font-semibold">
                                  {due.shortCountdown}
                                </span>
                              )}
                              {hasBoleto && (
                                <span className="px-2 py-0.5 rounded-full bg-white/[0.07] border border-white/15 text-white/80 text-[10px] font-bold">
                                  Boleto ✓
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-white/55 block mt-0.5">
                              {due.monthName}/{due.year} • Vencimento: {p.vencimento} • {p.metodo}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
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
                              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                            >
                              <Download className="w-3.5 h-3.5 text-[#FF5A65]" />
                              <span>Boleto</span>
                            </button>
                          )}

                          {p.status === 'paga' ? (
                            <button
                              type="button"
                              onClick={() => setReceiptModalParcela(p)}
                              className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-600 border border-emerald-400/45 text-emerald-300 hover:text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Ver Comprovante</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setAdvanceParcela({ parcela: p, isFocus })}
                              className={`px-4 py-2 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 transition-colors ${
                                isFocus
                                  ? 'bg-[#ED101C] hover:bg-[#C80B15] text-white shadow-red-glow-sm'
                                  : 'bg-white/[0.06] hover:bg-[#ED101C] border border-white/15 hover:border-[#ED101C] text-white/85 hover:text-white'
                              }`}
                            >
                              <span>{isFocus ? 'Pagar Atual' : 'Pagar / Adiantar'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {installments.length > 5 && (
                    <button
                      type="button"
                      onClick={() => setShowAllInstallments((v) => !v)}
                      className="w-full py-3 rounded-2xl bg-[#13151E] hover:bg-[#191C28] border border-white/15 text-xs sm:text-sm font-bold text-white/85 hover:text-white inline-flex items-center justify-center gap-2 transition-colors"
                    >
                      {showAllInstallments ? (
                        <>
                          <ChevronUp className="w-4 h-4 text-[#FF5A65]" />
                          <span>Recolher para mostrar apenas 5 parcelas</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 text-[#FF5A65]" />
                          <span>
                            Abrir mais parcelas ({installments.length - visibleList.length}{' '}
                            restantes)
                          </span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })()
          : activeNav === 'ajuda' ? (() => {
            /* =================================================================
               TELA 6: AVISOS DA DIRETORIA + SUPORTE WHATSAPP (PADRÃO BLACK)
            ================================================================= */
            const generalList = visibleAnnouncements.filter(
              (com) => !com.targetType || com.targetType === 'all'
            );
            const personalList = visibleAnnouncements.filter(
              (com) => com.targetType === 'selected'
            );
            const audienceScoped =
              noticeAudienceTab === 'geral'
                ? generalList
                : noticeAudienceTab === 'para_mim'
                ? personalList
                : visibleAnnouncements;

            const unreadList = audienceScoped.filter(
              (com) => !readNoticeIds.includes(com.id)
            );
            const readList = audienceScoped.filter((com) =>
              readNoticeIds.includes(com.id)
            );
            const filteredNotices =
              noticeFilterTab === 'nao_lidas'
                ? unreadList
                : noticeFilterTab === 'lidas'
                ? readList
                : audienceScoped;
            const displayedNotices = showAllNotices
              ? filteredNotices
              : filteredNotices.slice(0, 3);

            const unreadChatList = chatNotifications.filter(
              (n) =>
                !readChatNotifIds.includes(n.id) &&
                (n.authorRole === 'professor' ||
                  n.senderId !== (session?.id || 'demo-student-001'))
            );
            const profChatList = chatNotifications.filter(
              (n) => n.authorRole === 'professor'
            );
            const peerChatList = chatNotifications.filter(
              (n) => n.authorRole !== 'professor'
            );
            const filteredChatNotifs =
              chatNotifFilter === 'nao_lidas'
                ? unreadChatList
                : chatNotifFilter === 'professor'
                ? profChatList
                : chatNotifFilter === 'colegas'
                ? peerChatList
                : chatNotifications;

            const markChatAsRead = (notifId) => {
              if (readChatNotifIds.includes(notifId)) return;
              const next = Array.from(new Set([...readChatNotifIds, notifId]));
              setReadChatNotifIds(next);
              if (session?.id) saveReadChatNotifIds(session.id, next);
            };

            const markAllChatAsRead = () => {
              const allIds = chatNotifications.map((n) => n.id);
              const next = Array.from(new Set([...readChatNotifIds, ...allIds]));
              setReadChatNotifIds(next);
              if (session?.id) saveReadChatNotifIds(session.id, next);
              showToast('Todas as notificações de Dúvidas e Chat foram marcadas como lidas ✓', 'success');
            };

            const openLessonFromChatNotif = (notif) => {
              markChatAsRead(notif.id);
              const modIdx = modulos.findIndex((m) => m.modulo === notif.moduloNumero);
              const targetModIdx = modIdx >= 0 ? modIdx : 0;
              const targetMod = modulos[targetModIdx];
              const aulaIdx = targetMod
                ? Math.max(0, targetMod.aulas.findIndex((a) => a.id === notif.lessonId))
                : 0;
              setMobileClassTab('comentarios');
              openModuleClassroom(targetModIdx, aulaIdx);
            };

            return (
              <div className="max-w-5xl mx-auto space-y-5">
                {/* Banner Suporte WhatsApp BLACK */}
                <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-[#19070B] via-[#101219] to-[#0B0C10] border border-[#ED101C]/45 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#FF5A65]">
                      Suporte Oficial ao Aluno
                    </span>
                    <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                      Precisa de ajuda com o curso?
                    </h2>
                    <p className="text-xs sm:text-sm text-white/70">
                      Fale direto com a equipe da BLACK Treinamentos pelo WhatsApp oficial.
                    </p>
                  </div>
                  <a
                    href={getWhatsAppUrl(
                      `Olá! Sou ${session.nome}, aluno do Curso de Socorrista APH (200h), e preciso de suporte.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-magnetic cta-btn-shimmer px-5 py-3 rounded-2xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-2 shrink-0 shadow-red-glow"
                  >
                    <Phone className="w-4 h-4" />
                    <span>WhatsApp • {BRAND_CONFIG.whatsappDisplay}</span>
                  </a>
                </div>

                {/* SELETOR SEPARADO: INFORMAÇÃO (COMUNICADOS) vs CONVERSA (DÚVIDAS E CHAT DAS AULAS) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-2 rounded-2xl bg-[#0D0E14] border border-white/10">
                  <button
                    type="button"
                    onClick={() => setAjudaSectionTab('comunicados')}
                    className={`px-4 py-3 rounded-xl text-left flex items-center justify-between gap-3 transition-all ${
                      ajudaSectionTab === 'comunicados'
                        ? 'bg-[#ED101C] text-white shadow-red-glow-sm'
                        : 'bg-[#13151E] hover:bg-white/[0.06] text-white/75 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Bell className="w-5 h-5 shrink-0" />
                      <div className="min-w-0">
                        <strong className="text-sm font-extrabold block leading-tight">
                          Comunicados Oficiais
                        </strong>
                        <span
                          className={`text-[11px] block truncate ${
                            ajudaSectionTab === 'comunicados' ? 'text-white/85' : 'text-white/50'
                          }`}
                        >
                          Informação, turma e boletos
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-mono font-extrabold shrink-0 ${
                        ajudaSectionTab === 'comunicados'
                          ? 'bg-black/25 text-white'
                          : unreadNotices > 0
                          ? 'bg-[#ED101C] text-white'
                          : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {unreadNotices > 0 ? `${unreadNotices} nova(s)` : visibleAnnouncements.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAjudaSectionTab('chat_aulas')}
                    className={`px-4 py-3 rounded-xl text-left flex items-center justify-between gap-3 transition-all ${
                      ajudaSectionTab === 'chat_aulas'
                        ? 'bg-[#ED101C] text-white shadow-red-glow-sm'
                        : 'bg-[#13151E] hover:bg-white/[0.06] text-white/75 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <MessageSquare className="w-5 h-5 shrink-0" />
                      <div className="min-w-0">
                        <strong className="text-sm font-extrabold block leading-tight">
                          Dúvidas &amp; Chat das Aulas
                        </strong>
                        <span
                          className={`text-[11px] block truncate ${
                            ajudaSectionTab === 'chat_aulas' ? 'text-white/85' : 'text-white/50'
                          }`}
                        >
                          Conversas e respostas do professor
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-mono font-extrabold shrink-0 ${
                        ajudaSectionTab === 'chat_aulas'
                          ? 'bg-black/25 text-white'
                          : unreadChatList.length > 0
                          ? 'bg-[#ED101C] text-white animate-pulse'
                          : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {unreadChatList.length > 0
                        ? `${unreadChatList.length} nova(s)`
                        : chatNotifications.length}
                    </span>
                  </button>
                </div>

                {ajudaSectionTab === 'comunicados' ? (
                /* Painel 1: Informação — Comunicados Oficiais */
                <div
                  id="comunicados-oficiais-card"
                  className={`bg-[#0D0E14] border rounded-3xl p-4 sm:p-7 space-y-4 transition-all duration-500 shadow-[0_24px_60px_rgba(0,0,0,0.55)] ${
                    noticesPulse
                      ? 'border-[#ED101C] ring-2 ring-[#ED101C]/60 shadow-[0_0_35px_rgba(237,16,28,0.45)]'
                      : 'border-white/10'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display font-extrabold text-lg sm:text-xl text-white">
                        Comunicados Oficiais da Turma
                      </h3>
                      <p className="text-xs text-white/55 mt-0.5">
                        {unreadNotices > 0
                          ? `${unreadNotices} ${unreadNotices === 1 ? 'comunicado não lido' : 'comunicados não lidos'} • Clique para abrir e marcar como lido.`
                          : 'Todas as notificações foram lidas ✓'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {unreadNotices > 0 && (
                        <button
                          type="button"
                          onClick={handleMarkAllNoticesRead}
                          className="px-3.5 py-2 rounded-xl bg-[#ED101C]/15 hover:bg-[#ED101C] border border-[#ED101C]/45 text-[#FF8C93] hover:text-white text-xs font-bold transition-colors"
                        >
                          Marcar todas como lidas
                        </button>
                      )}
                      {filteredNotices.length > 3 && (
                        <button
                          type="button"
                          onClick={() => setShowAllNotices((v) => !v)}
                          className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-bold text-white inline-flex items-center gap-1.5 transition-colors"
                        >
                          <span>
                            {showAllNotices
                              ? 'Recolher lista'
                              : `Abrir todas (${filteredNotices.length})`}
                          </span>
                          {showAllNotices ? (
                            <ChevronUp className="w-3.5 h-3.5 text-[#FF5A65]" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-[#FF5A65]" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Abas de Filtro: Não Lidas | Lidas | Todas */}
                  <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-[#13151E] border border-white/10">
                    <button
                      type="button"
                      onClick={() => setNoticeFilterTab('nao_lidas')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition-all ${
                        noticeFilterTab === 'nao_lidas'
                          ? 'bg-[#ED101C] text-white shadow-red-glow-sm'
                          : 'text-white/65 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <span>Não Lidas</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold ${
                          noticeFilterTab === 'nao_lidas'
                            ? 'bg-black/30 text-white'
                            : unreadList.length > 0
                            ? 'bg-[#ED101C]/25 text-[#FF7A83]'
                            : 'bg-white/10 text-white/55'
                        }`}
                      >
                        {unreadList.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNoticeFilterTab('lidas')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition-all ${
                        noticeFilterTab === 'lidas'
                          ? 'bg-emerald-600 text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)]'
                          : 'text-white/65 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <span>Lidas</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold ${
                          noticeFilterTab === 'lidas'
                            ? 'bg-black/25 text-white'
                            : 'bg-emerald-500/15 text-emerald-400'
                        }`}
                      >
                        {readList.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNoticeFilterTab('todas')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 transition-all ${
                        noticeFilterTab === 'todas'
                          ? 'bg-white text-[#0D0E14] shadow-md'
                          : 'text-white/65 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <span>Todas</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold ${
                          noticeFilterTab === 'todas'
                            ? 'bg-[#0D0E14]/15 text-[#0D0E14]'
                            : 'bg-white/10 text-white/75'
                        }`}
                      >
                        {audienceScoped.length}
                      </span>
                    </button>
                  </div>

                  {/* Filtro de Destinatário: Todos | Para Todos (Turma) | Destinado a Mim */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white/50">
                      Destinatário:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setNoticeAudienceTab('todos')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border transition-all ${
                          noticeAudienceTab === 'todos'
                            ? 'bg-white/15 border-white/40 text-white'
                            : 'bg-[#13151E] border-white/10 text-white/65 hover:text-white hover:border-white/25'
                        }`}
                      >
                        <span>Todos os destinos</span>
                        <span className="font-mono text-[10px] opacity-80">
                          ({visibleAnnouncements.length})
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setNoticeAudienceTab('geral')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border transition-all ${
                          noticeAudienceTab === 'geral'
                            ? 'bg-sky-500/20 border-sky-400/60 text-sky-300'
                            : 'bg-[#13151E] border-white/10 text-white/65 hover:text-white hover:border-white/25'
                        }`}
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Para Todos</span>
                        <span className="font-mono text-[10px] opacity-85">
                          ({generalList.length})
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setNoticeAudienceTab('para_mim')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border transition-all ${
                          noticeAudienceTab === 'para_mim'
                            ? 'bg-[#ED101C]/20 border-[#ED101C]/70 text-[#FF8C93] shadow-[0_0_16px_rgba(237,16,28,0.2)]'
                            : 'bg-[#13151E] border-white/10 text-white/65 hover:text-white hover:border-white/25'
                        }`}
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Destinado a Mim</span>
                        <span className="font-mono text-[10px] opacity-85">
                          ({personalList.length})
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Lista Filtrada de Comunicados */}
                  <div className="space-y-2.5">
                    {displayedNotices.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-[#13151E] border border-white/10 text-center space-y-2">
                        <p className="text-sm font-bold text-white/85">
                          {noticeFilterTab === 'nao_lidas'
                            ? 'Tudo em dia! Você não tem comunicados não lidos.'
                            : 'Nenhum comunicado encontrado nesta categoria.'}
                        </p>
                        {noticeFilterTab === 'nao_lidas' && readList.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setNoticeFilterTab('lidas')}
                            className="text-xs font-bold text-[#FF6B74] hover:text-white transition-colors"
                          >
                            Ver comunicados já lidos ({readList.length}) →
                          </button>
                        )}
                      </div>
                    ) : (
                      displayedNotices.map((com) => {
                        const isRead = readNoticeIds.includes(com.id);
                        const isOpened = openedNoticeId === com.id;
                        const isDirect = com.targetType === 'selected';
                        return (
                          <button
                            key={com.id}
                            type="button"
                            onClick={() => handleOpenNotice(com.id)}
                            className={`w-full text-left p-4 sm:p-5 rounded-2xl border border-l-4 space-y-1.5 transition-all duration-200 cursor-pointer ${
                              !isRead
                                ? 'bg-gradient-to-r from-[#200A0E] to-[#13151E] border-[#ED101C]/45 border-l-[#ED101C] shadow-[0_0_20px_rgba(237,16,28,0.14)]'
                                : isOpened
                                ? 'bg-[#171A25] border-white/25 border-l-emerald-400 ring-1 ring-white/15'
                                : 'bg-[#13151E] border-white/10 border-l-emerald-500/50 hover:border-white/20'
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[11px] font-mono font-bold text-[#FF5A65]">
                                  {com.data}
                                </span>
                                {isDirect ? (
                                  <span className="px-2.5 py-0.5 rounded-full bg-[#ED101C]/15 border border-[#ED101C]/45 text-[#FF8C93] text-[10px] font-bold">
                                    Exclusivo para você
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-400/35 text-sky-300 text-[10px] font-bold">
                                    Para toda a turma
                                  </span>
                                )}
                              </div>
                              {!isRead ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ED101C] text-white text-[10px] font-extrabold uppercase tracking-wide shadow-[0_0_12px_rgba(237,16,28,0.6)]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                  <span>Não lida</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 text-[10px] font-bold">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Lida</span>
                                </span>
                              )}
                            </div>

                            <h4 className="font-display font-bold text-sm sm:text-base text-white">
                              {com.titulo}
                            </h4>

                            <p
                              className={`text-xs sm:text-sm leading-relaxed transition-colors ${
                                !isRead || isOpened ? 'text-white/90' : 'text-white/65 line-clamp-2'
                              }`}
                            >
                              {com.mensagem}
                            </p>

                            <span className="block text-[11px] text-white/50 font-semibold pt-0.5">
                              — {com.autor}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>

                  {/* Barra Inferior para Abrir / Recolher Todos */}
                  {filteredNotices.length > 3 && (
                    <button
                      type="button"
                      onClick={() => setShowAllNotices((v) => !v)}
                      className="w-full py-3 rounded-2xl bg-[#13151E] hover:bg-[#191C28] border border-white/15 text-xs sm:text-sm font-bold text-white/85 hover:text-white inline-flex items-center justify-center gap-2 transition-colors"
                    >
                      {showAllNotices ? (
                        <>
                          <ChevronUp className="w-4 h-4 text-[#FF5A65]" />
                          <span>Recolher comunicados (mostrar apenas 3)</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 text-[#FF5A65]" />
                          <span>
                            Abrir todos os comunicados ({filteredNotices.length - displayedNotices.length}{' '}
                            ocultos)
                          </span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                ) : (
                /* Painel 2: Conversa — Notificações de Dúvidas & Comentários das Aulas */
                <div
                  id="comunicados-oficiais-card"
                  className="bg-[#0D0E14] border border-white/10 rounded-3xl p-4 sm:p-7 space-y-4 shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display font-extrabold text-lg sm:text-xl text-white">
                        Notificações de Dúvidas &amp; Chat das Aulas
                      </h3>
                      <p className="text-xs text-white/55 mt-0.5">
                        Conversas e respostas do professor separadas dos comunicados oficiais.
                      </p>
                    </div>
                    {unreadChatList.length > 0 && (
                      <button
                        type="button"
                        onClick={markAllChatAsRead}
                        className="px-3.5 py-2 rounded-xl bg-[#ED101C]/15 hover:bg-[#ED101C] border border-[#ED101C]/45 text-[#FF8C93] hover:text-white text-xs font-bold transition-colors"
                      >
                        Marcar conversas como lidas ({unreadChatList.length})
                      </button>
                    )}
                  </div>

                  {/* Filtros do Chat das Aulas: Todas | Não Lidas | Respostas do Professor | Turma */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-[#13151E] border border-white/10">
                    <button
                      type="button"
                      onClick={() => setChatNotifFilter('todas')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all ${
                        chatNotifFilter === 'todas'
                          ? 'bg-white text-[#0D0E14] shadow-md'
                          : 'text-white/65 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <span>Todas</span>
                      <span className="font-mono text-[10px] opacity-80">
                        ({chatNotifications.length})
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setChatNotifFilter('nao_lidas')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all ${
                        chatNotifFilter === 'nao_lidas'
                          ? 'bg-[#ED101C] text-white shadow-red-glow-sm'
                          : 'text-white/65 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <span>Não Lidas</span>
                      <span className="font-mono text-[10px] opacity-85">
                        ({unreadChatList.length})
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setChatNotifFilter('professor')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all ${
                        chatNotifFilter === 'professor'
                          ? 'bg-[#ED101C] text-white shadow-red-glow-sm'
                          : 'text-white/65 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Professor</span>
                      <span className="font-mono text-[10px] opacity-85">
                        ({profChatList.length})
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setChatNotifFilter('colegas')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all ${
                        chatNotifFilter === 'colegas'
                          ? 'bg-sky-600 text-white shadow-md'
                          : 'text-white/65 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Alunos</span>
                      <span className="font-mono text-[10px] opacity-85">
                        ({peerChatList.length})
                      </span>
                    </button>
                  </div>

                  {/* Lista de Notificações do Chat das Aulas */}
                  <div className="space-y-2.5">
                    {filteredChatNotifs.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-[#13151E] border border-white/10 text-center space-y-1.5">
                        <p className="text-sm font-bold text-white/85">
                          Nenhuma mensagem de conversa nesta visualização ainda.
                        </p>
                        <p className="text-xs text-white/55">
                          Sempre que o professor responder ou um colega comentar em uma aula, a notificação aparecerá organizada aqui.
                        </p>
                      </div>
                    ) : (
                      filteredChatNotifs.map((n) => {
                        const isProf = n.authorRole === 'professor';
                        const isUnread =
                          !readChatNotifIds.includes(n.id) &&
                          (isProf || n.senderId !== (session?.id || 'demo-student-001'));
                        return (
                          <div
                            key={n.id}
                            className={`p-4 sm:p-5 rounded-2xl border border-l-4 space-y-2.5 transition-all ${
                              isProf
                                ? 'bg-gradient-to-r from-[#26090F] via-[#171119] to-[#13151E] border-[#ED101C]/65 border-l-[#ED101C] shadow-[0_0_24px_rgba(237,16,28,0.16)]'
                                : isUnread
                                ? 'bg-[#181924] border-sky-500/45 border-l-sky-400'
                                : 'bg-[#13151E] border-white/10 border-l-white/25'
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1 ${
                                    isProf
                                      ? 'bg-[#ED101C] text-white shadow-[0_0_12px_rgba(237,16,28,0.6)]'
                                      : 'bg-sky-500/15 border border-sky-400/35 text-sky-300'
                                  }`}
                                >
                                  {isProf ? (
                                    <>
                                      <ShieldCheck className="w-3 h-3" />
                                      <span>{n.authorName} (Professor)</span>
                                    </>
                                  ) : (
                                    <span>{n.authorName} (Aluno)</span>
                                  )}
                                </span>

                                <span className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-[10px] font-mono text-white/75">
                                  Mód. {n.moduloNumero} • {n.aulaTitulo}
                                </span>

                                <span className="text-[11px] font-mono text-white/45">
                                  {n.createdAt}
                                </span>
                              </div>

                              {isUnread ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ED101C] text-white text-[10px] font-extrabold uppercase">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                  <span>Nova resposta</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 text-[10px] font-bold">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Vista</span>
                                </span>
                              )}
                            </div>

                            {n.replyToSnippet && (
                              <div className="px-3 py-1.5 rounded-xl bg-black/35 border-l-2 border-[#ED101C]/70 text-xs text-white/60">
                                <span className="font-bold text-white/80">
                                  Em resposta a {n.replyToName || 'dúvida'}:
                                </span>{' '}
                                &ldquo;{n.replyToSnippet}&rdquo;
                              </div>
                            )}

                            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                              {n.text}
                            </p>

                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10">
                              {isUnread ? (
                                <button
                                  type="button"
                                  onClick={() => markChatAsRead(n.id)}
                                  className="text-xs font-semibold text-white/65 hover:text-white transition-colors"
                                >
                                  Marcar como lida
                                </button>
                              ) : (
                                <span className="text-[11px] text-white/40">
                                  Notificação de chat da aula
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => openLessonFromChatNotif(n)}
                                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-[#ED101C] border border-white/15 hover:border-[#ED101C] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                              >
                                <span>Ir para a Aula</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
                )}
              </div>
            );
          })()
          : (
            /* =================================================================
               TELA 7: MEU PERFIL (CREDENCIAL BLACK + DADOS + DECLARAÇÃO OFICIAL)
            ================================================================= */
            <div className="max-w-5xl mx-auto space-y-5">
              {/* Banner Credencial BLACK do Aluno com Troca Instantânea de Foto */}
              <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-[#19070B] via-[#101219] to-[#0B0C11] border border-[#ED101C]/45 shadow-[0_20px_50px_rgba(0,0,0,0.65)] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-5">
                  <div className="relative group shrink-0">
                    <label
                      className="block cursor-pointer relative rounded-full"
                      title="Clique para trocar sua foto instantaneamente"
                    >
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={session.nome}
                          className="w-20 h-20 rounded-full object-cover border-2 border-[#ED101C] shadow-[0_0_24px_rgba(237,16,28,0.4)] transition-transform duration-200 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ED101C] to-[#7D060D] border-2 border-[#FF5A65]/60 text-white text-2xl font-display font-extrabold flex items-center justify-center shadow-[0_0_24px_rgba(237,16,28,0.35)] transition-transform duration-200 group-hover:scale-[1.03]">
                          {studentInitials}
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#ED101C] border-2 border-[#0B0C11] text-white flex items-center justify-center shadow-md group-hover:bg-[#FF2B38] transition-colors">
                        <Camera className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#ED101C]/20 border border-[#ED101C]/45 text-[#FF8C93] text-[10px] font-mono font-bold uppercase tracking-wider">
                        Aluno Oficial • APH 200h
                      </span>
                      <span className="text-[11px] font-mono text-white/55">
                        Turma 13/02/2027
                      </span>
                    </div>
                    <h2 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                      {session.nome}
                    </h2>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-white/60">
                      <span>Clique na foto para alterar automaticamente</span>
                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="text-[#FF6B74] hover:text-white font-semibold transition-colors"
                        >
                          • Remover foto
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigateTo('inicio')}
                  className="self-center sm:self-auto px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs sm:text-sm font-bold text-white inline-flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-[#FF5A65]" />
                  <span>Voltar ao Início</span>
                </button>
              </div>

              {/* Card Dados Cadastrais & Segurança do Diploma (Padrão BLACK sem amarelo) */}
              <div className="bg-[#0D0E14] border border-white/10 rounded-3xl p-5 sm:p-7 space-y-5 shadow-[0_20px_50px_rgba(0,0,0,0.55)]">
                <div className="p-4 rounded-2xl bg-[#13151E] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                      Para segurança do seu Diploma Oficial (Lei nº 9.394/96),{' '}
                      <strong className="text-white">Nome Completo e CPF</strong> são vinculados à matrícula. Se houver erro de grafia, solicite ajuste à Secretaria.
                    </p>
                  </div>
                  <a
                    href={getWhatsAppUrl(
                      `Olá! Sou ${session.nome}, aluno do Curso de Socorrista APH (200h), e preciso solicitar correção nos meus dados cadastrais de matrícula.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white/[0.07] hover:bg-[#ED101C] border border-white/15 hover:border-[#ED101C] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Solicitar Correção</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center justify-between text-xs font-bold text-white/75 mb-1.5">
                      <span>Nome Completo no Certificado</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ED101C]/15 border border-[#ED101C]/35 text-[10px] font-mono text-[#FF8C93]">
                        <Lock className="w-2.5 h-2.5" /> Protegido
                      </span>
                    </label>
                    <input
                      type="text"
                      value={session.nome}
                      readOnly
                      disabled
                      className="w-full bg-[#090A0E] border border-white/10 rounded-xl px-4 py-3 text-sm font-semibold text-white/75 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="flex items-center justify-between text-xs font-bold text-white/75 mb-1.5">
                      <span>CPF</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ED101C]/15 border border-[#ED101C]/35 text-[10px] font-mono text-[#FF8C93]">
                        <Lock className="w-2.5 h-2.5" /> Protegido
                      </span>
                    </label>
                    <input
                      type="text"
                      value={session.cpf}
                      readOnly
                      disabled
                      className="w-full bg-[#090A0E] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono font-semibold text-white/75 cursor-not-allowed"
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
                      className="w-full bg-[#090A0E] border border-white/15 focus:border-[#ED101C] focus:ring-1 focus:ring-[#ED101C]/35 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
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
                      className="w-full bg-[#090A0E] border border-white/15 focus:border-[#ED101C] focus:ring-1 focus:ring-[#ED101C]/35 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/15 text-xs sm:text-sm font-bold text-white/80 inline-flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-[#ED101C]" />
                    <span>Sair da Conta</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const cleanEmail = String(session.email || '').trim();
                      const cleanPhone = String(session.telefone || '').trim();
                      updateStudentProfileContact({
                        studentId: session?.id || 'demo-student-001',
                        email: cleanEmail,
                        telefone: cleanPhone,
                      });
                      setSession((prev) => ({ ...prev, email: cleanEmail, telefone: cleanPhone }));
                      showToast('Seus dados de contato foram salvos e sincronizados!', 'success');
                    }}
                    className="btn-magnetic px-6 py-2.5 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 shadow-red-glow-sm transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Salvar Dados de Contato</span>
                  </button>
                </div>
              </div>

              {/* Card Trocar Senha de Login */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setPwdFeedback(null);
                  const cleanedNew = newPwd.trim();
                  const cleanedConfirm = confirmNewPwd.trim();
                  const strength = validateStrongPassword(cleanedNew);
                  if (!strength.valid) {
                    setPwdFeedback({
                      type: 'error',
                      message: strength.error,
                    });
                    return;
                  }
                  if (cleanedNew !== cleanedConfirm) {
                    setPwdFeedback({
                      type: 'error',
                      message: 'A confirmação de senha não confere com a nova senha.',
                    });
                    return;
                  }
                  const res = changeStudentPassword({
                    studentId: session.id,
                    currentPassword: currentPwd,
                    newPassword: cleanedNew,
                  });
                  if (!res.ok) {
                    setPwdFeedback({ type: 'error', message: res.error });
                    return;
                  }
                  setHasSavedPassword(true);
                  setCurrentPwd('');
                  setNewPwd('');
                  setConfirmNewPwd('');
                  setPwdFeedback({
                    type: 'success',
                    message: 'Senha de acesso atualizada! Use sua nova senha no próximo login.',
                  });
                  showToast('Senha de login alterada com sucesso!', 'success');
                }}
                className="bg-[#0D0E14] border border-white/10 rounded-3xl p-5 sm:p-7 space-y-5 shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#ED101C]/15 border border-[#ED101C]/45 text-[#FF5A65] flex items-center justify-center shrink-0">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
                        Alterar Senha de Login
                      </h3>
                      <p className="text-xs text-white/60 mt-0.5">
                        {hasSavedPassword
                          ? 'Confirme sua senha atual e crie uma nova senha forte (mín. 6 dígitos, 1 maiúscula e 1 caractere especial).'
                          : 'Defina sua senha pessoal com mínimo de 6 dígitos, 1 letra maiúscula e 1 caractere especial.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/15 text-[10px] font-mono font-bold uppercase tracking-wider text-white/70">
                      6+ • A-Z • !@#
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPwdFields((prev) => !prev)}
                      className="px-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-[11px] font-semibold text-white/80 inline-flex items-center gap-1.5 transition-colors"
                    >
                      {showPwdFields ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showPwdFields ? 'Ocultar' : 'Mostrar'}</span>
                    </button>
                  </div>
                </div>

                <div
                  className={`grid grid-cols-1 ${
                    hasSavedPassword ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
                  } gap-4`}
                >
                  {hasSavedPassword && (
                    <div>
                      <label className="block text-xs font-bold text-white/75 mb-1.5">
                        Senha Atual
                      </label>
                      <input
                        type={showPwdFields ? 'text' : 'password'}
                        value={currentPwd}
                        onChange={(e) => {
                          setCurrentPwd(e.target.value);
                          if (pwdFeedback) setPwdFeedback(null);
                        }}
                        placeholder="Digite sua senha atual"
                        className="w-full bg-[#090A0E] border border-white/15 focus:border-[#ED101C] focus:ring-1 focus:ring-[#ED101C]/35 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none transition-colors"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-white/75 mb-1.5">
                      Nova Senha
                    </label>
                    <input
                      type={showPwdFields ? 'text' : 'password'}
                      minLength={6}
                      value={newPwd}
                      onChange={(e) => {
                        setNewPwd(e.target.value);
                        if (pwdFeedback) setPwdFeedback(null);
                      }}
                      placeholder="Mínimo 6 dígitos"
                      className="w-full bg-[#090A0E] border border-white/15 focus:border-[#ED101C] focus:ring-1 focus:ring-[#ED101C]/35 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white/75 mb-1.5">
                      Confirmar Nova Senha
                    </label>
                    <input
                      type={showPwdFields ? 'text' : 'password'}
                      minLength={6}
                      value={confirmNewPwd}
                      onChange={(e) => {
                        setConfirmNewPwd(e.target.value);
                        if (pwdFeedback) setPwdFeedback(null);
                      }}
                      placeholder="Repita a nova senha"
                      className="w-full bg-[#090A0E] border border-white/15 focus:border-[#ED101C] focus:ring-1 focus:ring-[#ED101C]/35 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {(() => {
                  const { checks } = validateStrongPassword(newPwd);
                  return (
                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        { ok: checks.minLength, label: 'Mínimo 6 dígitos' },
                        { ok: checks.hasUppercase, label: '1 letra maiúscula (A-Z)' },
                        { ok: checks.hasSpecial, label: '1 caractere especial (! @ # $)' },
                      ].map((item) => (
                        <span
                          key={item.label}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition-colors ${
                            item.ok
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                              : 'bg-white/[0.04] border-white/10 text-white/55'
                          }`}
                        >
                          {item.ok ? '✓ ' : '• '}
                          {item.label}
                        </span>
                      ))}
                    </div>
                  );
                })()}

                {pwdFeedback && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold border ${
                      pwdFeedback.type === 'error'
                        ? 'bg-[#1D090D] border-[#ED101C]/55 text-[#FF9CA3]'
                        : 'bg-emerald-500/10 border-emerald-500/35 text-emerald-300'
                    }`}
                  >
                    {pwdFeedback.message}
                  </div>
                )}

                <div className="flex items-center justify-end pt-2 border-t border-white/10">
                  <button
                    type="submit"
                    className="btn-magnetic px-6 py-2.5 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 shadow-red-glow-sm transition-colors"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Atualizar Senha de Acesso</span>
                  </button>
                </div>
              </form>

              {/* Card Declaração de Matrícula (1 Clique para Trabalho / Faculdade) */}
              <div className="bg-gradient-to-r from-[#13151E] via-[#0D0E14] to-[#1A080C] border border-[#ED101C]/45 rounded-3xl p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-[0_16px_45px_rgba(0,0,0,0.5)]">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#ED101C]/15 border border-[#ED101C]/50 text-[#FF5A65] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(237,16,28,0.2)]">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF5A65] block">
                      Documento Oficial BLACK
                    </span>
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
                  className="btn-magnetic cta-btn-shimmer px-5 py-3 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-2 shrink-0 shadow-red-glow-sm"
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

      {/* MODAL INTELIGENTE DE PAGAMENTO / ADIANTAMENTO COM CALENDÁRIO DE VENCIMENTO */}
      <FinancePaymentModal
        parcela={advanceParcela?.parcela || null}
        isCurrentFocus={Boolean(advanceParcela?.isFocus)}
        studentName={session.nome}
        onClose={() => setAdvanceParcela(null)}
        onCopyPix={handleCopyPix}
        onOpenAttachment={handleOpenAttachment}
      />

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
