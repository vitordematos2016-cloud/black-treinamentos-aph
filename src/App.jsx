import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
  Phone,
  X,
  CheckCircle2,
  Eye,
  EyeOff,
  Shield,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Lock,
} from 'lucide-react';
import NavbarAndHero from './components/NavbarAndHero';
import CoursesSection from './components/CoursesSection';
import InstructorsShowcase from './components/InstructorsShowcase';
import JourneyAndCertification from './components/JourneyAndCertification';
import { BRAND_CONFIG, getWhatsAppUrl } from './data/blackData';

const StudentPortalLMS = lazy(() => import('./components/StudentPortalLMS'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

const CURSO_UNICO_OFICIAL =
  'Curso de Socorrista - APH (Turma 13/02/2027 • Sábados na Unicesumar)';
const MODALIDADE_UNICA_OFICIAL =
  'Presencial (Aos sábados à tarde • Prédio da Unicesumar)';

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
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [showTestimonialsPreview, setShowTestimonialsPreview] = useState(false);

  const [formNome, setFormNome] = useState('');
  const [formTelefone, setFormTelefone] = useState('');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentProject(getInitialView());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const switchProject = (proj) => {
    setCurrentProject(proj);
    const url = new URL(window.location.href);
    url.searchParams.set('view', proj);
    window.history.pushState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEnrollModal = () => {
    setEnrollModalOpen(true);
  };

  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    const msg = `Olá! Meu nome é *${formNome || 'Interessado'}* (${
      formTelefone || 'WhatsApp'
    }). Quero realizar minha inscrição / garantir minha vaga no *${CURSO_UNICO_OFICIAL}* (${MODALIDADE_UNICA_OFICIAL}).`;
    window.open(getWhatsAppUrl(msg), '_blank', 'noopener,noreferrer');
    setEnrollModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-[#ED101C] selection:text-white">
      {/* BARRA FLUTUANTE DE NAVEGAÇÃO ENTRE OS 3 PROJETOS (Compacta no Mobile sem corte horizontal) */}
      <div className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 bg-[#111218]/95 backdrop-blur-xl border border-white/15 rounded-full p-1 sm:p-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.85)] flex items-center gap-0.5 sm:gap-1.5 max-w-[96vw] overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => switchProject('landing')}
          className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 whitespace-nowrap transition-all ${
            currentProject === 'landing'
              ? 'bg-[#ED101C] text-white shadow-red-glow-sm'
              : 'text-white/75 hover:text-white hover:bg-white/5'
          }`}
        >
          <Globe className="w-3.5 h-3.5 shrink-0" />
          <span>1. Landing</span>
          <span className="hidden sm:inline">Page</span>
        </button>

        <button
          type="button"
          onClick={() => switchProject('aluno')}
          className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 whitespace-nowrap transition-all ${
            currentProject === 'aluno'
              ? 'bg-[#ED101C] text-white shadow-red-glow-sm'
              : 'text-white/75 hover:text-white hover:bg-white/5'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 shrink-0" />
          <span>2. Aluno</span>
          <span className="hidden sm:inline">(LMS)</span>
        </button>

        <button
          type="button"
          onClick={() => switchProject('admin')}
          className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 whitespace-nowrap transition-all ${
            currentProject === 'admin'
              ? 'bg-[#ED101C] text-white shadow-red-glow-sm'
              : 'text-white/75 hover:text-white hover:bg-white/5'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
          <span>3. Admin</span>
        </button>
      </div>

      {/* RENDERIZAÇÃO SOB DEMANDA (CODE-SPLITTING) DO PROJETO ATIVO */}
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="flex items-center gap-3 text-sm font-mono text-white/80">
              <span className="w-3 h-3 rounded-full bg-[#ED101C] animate-ping" />
              <span>Carregando módulo BLACK Treinamentos...</span>
            </div>
          </div>
        }
      >
        {currentProject === 'admin' ? (
          <AdminDashboard onNavigateProject={switchProject} />
        ) : currentProject === 'aluno' ? (
          <StudentPortalLMS onNavigateProject={switchProject} />
        ) : (
          <>
            <NavbarAndHero onOpenEnrollModal={handleOpenEnrollModal} />

            <main>
              <CoursesSection onOpenEnrollModal={handleOpenEnrollModal} />
              <InstructorsShowcase />
              <JourneyAndCertification
                onOpenEnrollModal={handleOpenEnrollModal}
                showTestimonialsPreview={showTestimonialsPreview}
              />
            </main>

            {/* Botão Flutuante de WhatsApp Oficial (Posicionado acima da barra de projetos no Mobile para nunca sobrepor!) */}
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar pelo WhatsApp Oficial da BLACK Treinamentos"
              className="fixed bottom-[66px] sm:bottom-5 right-4 sm:right-5 z-40 btn-magnetic bg-[#ED101C] hover:bg-[#C80B15] text-white font-bold text-xs sm:text-sm p-3.5 sm:px-4 sm:py-3 rounded-full shadow-red-glow flex items-center gap-2 border border-white/20"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp {BRAND_CONFIG.whatsappDisplay}</span>
            </a>

            {/* Controle Discreto de Revisão */}
            <div className="fixed bottom-5 left-5 z-40 hidden md:block">
              <button
                type="button"
                onClick={() => setShowTestimonialsPreview(!showTestimonialsPreview)}
                className="px-3.5 py-2 rounded-full bg-[#121216]/90 hover:bg-[#1C1C22] backdrop-blur-md border border-white/15 text-[11px] font-mono text-white/80 hover:text-white flex items-center gap-2 shadow-xl transition-colors"
              >
                {showTestimonialsPreview ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-[#ED101C]" />
                    <span>Ocultar Depoimentos</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-[#ED101C]" />
                    <span>Testar Seção 08</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </Suspense>

      {/* =====================================================================
          MODAL DE INSCRIÇÃO — EXCLUSIVO PARA O CURSO DE SOCORRISTA (APH)
      ===================================================================== */}
      {enrollModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-modal-inscricao"
        >
          <div className="bg-[#121216] border border-white/15 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
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
                onClick={() => setEnrollModalOpen(false)}
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
                    Presencial (Sábados • Unicesumar)
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
                  Aulas aos <strong>sábados à tarde no Prédio da Unicesumar</strong> • Parcelamento em até{' '}
                  <strong>10x no boleto ou cartão de crédito</strong>.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEnrollModalOpen(false)}
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
    </div>
  );
}
