import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import {
  Phone,
  X,
  CheckCircle2,
  Shield,
  LogOut,
} from 'lucide-react';
import NavbarAndHero from './components/NavbarAndHero';
import CoursesSection from './components/CoursesSection';
import InstructorsShowcase from './components/InstructorsShowcase';
import JourneyAndCertification from './components/JourneyAndCertification';
import { BRAND_CONFIG, getWhatsAppUrl } from './data/blackData';
import {
  initNavigationHistory,
  pushOverlayHistory,
  dismissOverlayHistory,
  pushViewTransition,
  confirmExitSite,
  cancelExitConfirm,
} from './utils/navigationHistory';

const StudentPortalLMS = lazy(() => import('./components/StudentPortalLMS'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

const CURSO_UNICO_OFICIAL =
  'Curso de Socorrista - APH (Turma 13/02/2027 • Sábados na Unicesumar + Online)';
const MODALIDADE_UNICA_OFICIAL =
  'Híbrido (Práticas aos sábados na Unicesumar + Portal do Aluno Online)';

export default function App() {
  const getInitialView = () => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('view');
    if (v === 'landing' || v === 'aluno' || v === 'admin') return v;
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') return 'admin';
    if (window.location.pathname === '/aluno' || window.location.hash === '#aluno') return 'aluno';
    return 'landing';
  };

  const [currentProject, setCurrentProject] = useState(getInitialView);
  const currentProjectRef = useRef(currentProject);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);

  const [formNome, setFormNome] = useState('');
  const [formTelefone, setFormTelefone] = useState('');

  useEffect(() => {
    currentProjectRef.current = currentProject;
  }, [currentProject]);

  useEffect(() => {
    return initNavigationHistory({
      getCurrentView: () => currentProjectRef.current,
      onGoHome: () => {
        setCurrentProject('landing');
        const url = new URL(window.location.href);
        url.searchParams.delete('view');
        url.hash = '';
        if (window.location.search !== url.search || window.location.hash) {
          window.history.replaceState(
            { ...(window.history.state || {}), __blackNav: true },
            '',
            url.toString()
          );
        }
      },
      onRequestExitConfirm: () => {
        setExitConfirmOpen(true);
      },
      onCloseExitConfirm: () => {
        setExitConfirmOpen(false);
      },
    });
  }, []);

  const handleStayInSite = () => {
    setExitConfirmOpen(false);
    cancelExitConfirm();
  };

  const handleConfirmExit = () => {
    setExitConfirmOpen(false);
    confirmExitSite();
  };

  const switchProject = (proj, rawOpts = {}) => {
    const opts = rawOpts && typeof rawOpts === 'object' && !rawOpts.nativeEvent ? rawOpts : {};
    const prevProj = currentProjectRef.current;
    setCurrentProject(proj);
    const url = new URL(window.location.href);
    if (proj === 'landing') {
      url.searchParams.delete('view');
    } else {
      url.searchParams.set('view', proj);
    }
    pushViewTransition(
      prevProj,
      proj,
      url.toString(),
      (returnY) => {
        setCurrentProject(prevProj);
        window.setTimeout(() => {
          window.scrollTo({ top: returnY ?? 0, behavior: 'smooth' });
        }, 80);
      },
      opts
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEnrollModal = (_courseName, rawOpts = {}) => {
    const opts = rawOpts && typeof rawOpts === 'object' && !rawOpts.nativeEvent ? rawOpts : {};
    setEnrollModalOpen(true);
    pushOverlayHistory('enroll-modal', () => setEnrollModalOpen(false), opts);
  };

  const handleCloseEnrollModal = () => {
    setEnrollModalOpen(false);
    dismissOverlayHistory('enroll-modal');
  };

  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    const msg = `Olá! Meu nome é *${formNome || 'Interessado'}* (${
      formTelefone || 'WhatsApp'
    }). Quero realizar minha inscrição / garantir minha vaga no *${CURSO_UNICO_OFICIAL}* (${MODALIDADE_UNICA_OFICIAL}).`;
    window.open(getWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
    handleCloseEnrollModal();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-[#ED101C] selection:text-white">
      {/* RENDERIZAÇÃO SOB DEMANDA (CODE-SPLITTING) — SOMENTE LANDING + PORTAL DO ALUNO VISÍVEIS AO PÚBLICO */}
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="flex items-center gap-3 text-sm font-mono text-white/80">
              <span className="w-3 h-3 rounded-full bg-[#ED101C] animate-ping" />
              <span>Carregando BLACK Treinamentos...</span>
            </div>
          </div>
        }
      >
        {currentProject === 'admin' ? (
          <AdminDashboard onNavigateProject={switchProject} />
        ) : currentProject === 'aluno' ? (
          <StudentPortalLMS
            onNavigateProject={switchProject}
            onBackToLanding={() => switchProject('landing')}
          />
        ) : (
          <>
            <NavbarAndHero
              onOpenEnrollModal={handleOpenEnrollModal}
              onOpenStudentPortal={(opts) => switchProject('aluno', opts)}
            />

            <main>
              <CoursesSection onOpenEnrollModal={handleOpenEnrollModal} />
              <InstructorsShowcase />
              <JourneyAndCertification
                onOpenEnrollModal={handleOpenEnrollModal}
                onOpenStudentPortal={(opts) => switchProject('aluno', opts)}
                showTestimonialsPreview={false}
              />
            </main>

            {/* Botão Flutuante de WhatsApp Oficial */}
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar pelo WhatsApp Oficial da BLACK Treinamentos"
              className="fixed bottom-4 sm:bottom-5 right-4 sm:right-5 z-40 btn-magnetic bg-[#ED101C] hover:bg-[#C80B15] text-white font-bold text-xs sm:text-sm p-3.5 sm:px-4 sm:py-3 rounded-full shadow-red-glow flex items-center gap-2 border border-white/20"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp {BRAND_CONFIG.whatsappDisplay}</span>
            </a>
          </>
        )}
      </Suspense>

      {/* =====================================================================
          MODAL DE INSCRIÇÃO — EXCLUSIVO PARA O CURSO DE SOCORRISTA (APH)
      ===================================================================== */}
      {enrollModalOpen && (
        <div
          onClick={handleCloseEnrollModal}
          className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-modal-inscricao"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#121216] border border-white/15 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl my-auto"
          >
            <div className="p-6 sm:p-7 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ED101C]/15 border border-[#ED101C]/40 flex items-center justify-center text-[#ED101C]">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#ED101C] font-bold block">
                    Inscrição & Atendimento Oficial
                  </span>
                  <h3 id="titulo-modal-inscricao" className="font-display font-extrabold text-xl text-white">
                    Garanta sua Vaga na BLACK
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseEnrollModal}
                className="p-2 rounded-lg bg-white/5 hover:bg-[#ED101C] text-white transition-colors"
                aria-label="Fechar janela de inscrição"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="p-6 sm:p-7 space-y-4">
              {/* Curso Único Ativo no Momento */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#B8B8B8] mb-1.5">
                  Treinamento Selecionado
                </label>
                <div className="w-full bg-[#08080B] border border-[#ED101C]/60 rounded-xl px-4 py-3 text-sm font-bold text-white flex items-center justify-between gap-2">
                  <span>{CURSO_UNICO_OFICIAL}</span>
                  <span className="px-2 py-0.5 rounded bg-[#ED101C] text-white text-[10px] font-mono uppercase shrink-0">
                    200 Horas
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="campo-nome" className="block text-xs font-bold uppercase tracking-wider text-[#B8B8B8] mb-1.5">
                  Seu Nome Completo
                </label>
                <input
                  id="campo-nome"
                  type="text"
                  required
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  placeholder="Digite seu nome completo"
                  className="w-full bg-[#08080B] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ED101C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="campo-whats" className="block text-xs font-bold uppercase tracking-wider text-[#B8B8B8] mb-1.5">
                    Seu WhatsApp / Telefone
                  </label>
                  <input
                    id="campo-whats"
                    type="tel"
                    required
                    value={formTelefone}
                    onChange={(e) => setFormTelefone(e.target.value)}
                    placeholder="(45) 99999-9999"
                    className="w-full bg-[#08080B] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ED101C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#B8B8B8] mb-1.5">
                    Modalidade da Turma
                  </label>
                  <div className="w-full bg-[#08080B] border border-white/15 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-white/90 font-medium truncate">
                    Híbrido (Unicesumar + Online)
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#17171C] border border-white/10 text-xs text-[#B8B8B8] space-y-1">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#ED101C]" />
                  <span>Condição divulgada para o Curso de Socorrista APH (200 Horas):</span>
                </div>
                <p>
                  Início previsto em <strong>13/02/2027</strong> • Duração de <strong>8 meses (200h em 11 módulos)</strong> •
                  Práticas aos <strong>sábados à tarde no Prédio da Unicesumar + Portal Online</strong> • Parcelamento em até{' '}
                  <strong>10x no boleto ou cartão de crédito</strong>.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseEnrollModal}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-semibold text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-sm font-bold text-white inline-flex items-center justify-center gap-2 shadow-red-glow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>Continuar no WhatsApp Oficial</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL DE CONFIRMAÇÃO DE SAÍDA — QUANDO JÁ ESTÁ NO INÍCIO DA PÁGINA
      ===================================================================== */}
      {exitConfirmOpen && (
        <div
          onClick={handleStayInSite}
          className="fixed inset-0 z-[90] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-modal-saida"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#111218] border border-[#ED101C]/70 rounded-3xl p-6 shadow-[0_24px_70px_rgba(0,0,0,0.95),0_0_36px_rgba(237,16,28,0.22)] text-center space-y-5 my-auto"
          >
            <div className="mx-auto w-12 h-12 rounded-2xl bg-[#1F070A] border border-[#ED101C]/60 flex items-center justify-center text-[#ED101C] shadow-[0_0_20px_rgba(237,16,28,0.3)]">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <span className="block text-[10px] font-mono uppercase tracking-widest text-[#ED101C] font-bold">
                BLACK Treinamentos • Resgate & APH
              </span>
              <h3 id="titulo-modal-saida" className="font-display font-extrabold text-xl text-white">
                Você quer sair?
              </h3>
              <p className="text-sm text-white/75 leading-relaxed">
                Você já está no início da página principal. Tem certeza que quer sair do site?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleConfirmExit}
                className="py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-sm font-bold text-white/85 hover:text-white transition-colors"
              >
                Sim, sair
              </button>
              <button
                type="button"
                onClick={handleStayInSite}
                className="py-3 px-4 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-sm font-extrabold text-white shadow-red-glow-sm transition-colors"
              >
                Não, ficar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
