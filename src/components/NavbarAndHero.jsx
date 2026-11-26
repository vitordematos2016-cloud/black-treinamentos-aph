import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  Menu,
  X,
  UserCheck,
  Users,
  Award,
  ClipboardCheck,
  Headphones,
  Calendar,
  MapPin,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';
import { BRAND_CONFIG, DIFERENCIAIS_LIST, getWhatsAppUrl } from '../data/blackData';
import Hero3DLogoStage from './Hero3DLogoStage';
import TurmaCountdownWidget from './TurmaCountdownWidget';

const ICON_MAP = {
  UserCheck,
  Users,
  Award,
  ClipboardCheck,
  Headphones,
};

const NAV_LINKS = [
  { id: 'inicio', label: 'Início', href: '#inicio' },
  { id: 'cursos', label: 'Cursos', href: '#cursos' },
  { id: 'equipe', label: 'Equipe', href: '#equipe' },
  { id: 'como-funciona', label: 'Como Funciona', href: '#como-funciona' },
  { id: 'certificacao', label: 'Certificação', href: '#certificacao' },
  { id: 'faq', label: 'FAQ', href: '#faq' },
  { id: 'contato', label: 'Contato', href: '#contato' },
];

export default function NavbarAndHero({ onOpenEnrollModal, onOpenStudentPortal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const heroContentRef = useRef(null);

  // Entrada cinematográfica staggered (GSAP) da coluna de texto do Hero em sintonia com a Logo 3D
  useEffect(() => {
    if (!heroContentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.hero-reveal', {
        y: 24,
        opacity: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
    }, heroContentRef);
    return () => ctx.revert();
  }, []);

  // Scroll-Spy em tempo real: detecta em qual seção o usuário está ao descer ou subir a página
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);

      // Ponto de referência de leitura (um terço abaixo do topo da tela)
      const triggerLine = y + window.innerHeight * 0.34;

      let currentId = 'inicio';
      for (const item of NAV_LINKS) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const elTop = rect.top + y;
          if (triggerLine >= elTop) {
            currentId = item.id;
          }
        }
      }
      setActiveSection(currentId);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* =====================================================================
          SEÇÃO 01 — CABEÇALHO / HEADER MODERNO COM LUZ VERMELHA E BRANCA
          (REFERÊNCIA À AMBULÂNCIA) GIRANDO CONSTANTEMENTE EM VOLTA DA BARRA
          + LOGO MAIOR, MAIS NÍTIDA E CENTRALIZADA + SINALIZADOR DE ABA ATIVA
      ===================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 px-2.5 sm:px-5 pt-2.5 transition-all duration-300">
        {/* Moldura com Luz Vermelha (#ED101C) e Branca (#FFFFFF) girando 360º constantemente */}
        <div
          className={`max-w-[1320px] mx-auto navbar-ambulance-border rounded-2xl p-[2px] transition-shadow duration-300 ${
            scrolled
              ? 'shadow-[0_14px_42px_rgba(237,16,28,0.32)]'
              : 'shadow-[0_10px_30px_rgba(237,16,28,0.22)]'
          }`}
        >
          {/* Interior Escuro Fosco do Header */}
          <div
            className={`relative z-10 bg-[#07070A]/95 backdrop-blur-xl px-3 sm:px-7 lg:px-8 py-2.5 flex items-center justify-between gap-2 sm:gap-4 ${
              !mobileMenuOpen ? 'rounded-t-[14px]' : 'rounded-[14px]'
            }`}
          >
            {/* Logo Oficial BLACK Treinamentos — Maior, mais centralizada e com nitidez reforçada */}
            <a
              href="#inicio"
              onClick={() => setActiveSection('inicio')}
              className="flex items-center justify-center pl-0.5 sm:pl-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ED101C] rounded-lg group shrink-0"
              aria-label="BLACK Treinamentos - Resgate & APH - Ir para o início"
            >
              <img
                src="/assets/logo-header-sharp.png"
                alt="Logomarca oficial BLACK Treinamentos - Resgate & APH"
                className="h-10 sm:h-12 lg:h-11 xl:h-[54px] w-auto object-contain select-none drop-shadow-[0_2px_12px_rgba(237,16,28,0.35)] group-hover:scale-[1.03] transition-transform"
              />
            </a>

            {/* Navegação Desktop com Sinalizador Inteligente de Aba Ativa ao Rolar/Subir */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5" aria-label="Navegação principal">
              {NAV_LINKS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setActiveSection(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative px-2 xl:px-3.5 py-2 rounded-xl text-[11.5px] xl:text-sm font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ED101C] ${
                      isActive
                        ? 'bg-gradient-to-r from-[#ED101C]/25 via-[#ED101C]/15 to-white/10 text-white border border-[#ED101C]/80 shadow-[0_0_20px_rgba(237,16,28,0.45)]'
                        : 'text-white/75 hover:text-white hover:bg-white/[0.05] border border-transparent'
                    }`}
                  >
                    {/* Ponto LED Vermelho/Branco indicando a seção ativa */}
                    {isActive && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-85" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ED101C]" />
                      </span>
                    )}
                    <span>{item.label}</span>

                    {/* Traço luminoso inferior na aba ativa */}
                    {isActive && (
                      <span className="absolute -bottom-[1px] left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-[#ED101C] via-white to-[#ED101C]" />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Ações Direitas: Área do Aluno + Inscreva-se agora + Hamburger Mobile */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {onOpenStudentPortal && (
                <button
                  type="button"
                  onClick={onOpenStudentPortal}
                  className="px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-[#ED101C]/65 text-white text-[11px] sm:text-xs xl:text-sm font-bold inline-flex items-center gap-1.5 whitespace-nowrap transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ED101C]"
                >
                  <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ED101C] shrink-0" />
                  <span>Área do Aluno</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onOpenEnrollModal('Curso de Socorrista - Atendimento Pré-Hospitalar (APH)')}
                className="hidden sm:flex lg:hidden xl:flex btn-magnetic bg-[#ED101C] hover:bg-[#C80B15] text-white font-bold text-xs xl:text-sm px-4 xl:px-5 py-2.5 rounded-xl shadow-red-glow-sm items-center gap-2 border border-white/20 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Inscreva-se agora</span>
              </button>

              {/* Botão Hamburger Mobile */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-menu"
                aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
                className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-[#17171D] text-white hover:bg-[#24242C] border border-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ED101C]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </div>

          {/* Contador Regressivo Real em Amarelo Emergência (#FACC15) fixo no Header */}
          {!mobileMenuOpen && (
            <TurmaCountdownWidget variant="header" />
          )}
        </div>

        {/* Menu Recolhível Mobile (Backdrop escuro + Borda e contraste reforçados para destacar do fundo) */}
        {mobileMenuOpen && (
          <>
            <div
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/75 backdrop-blur-[3px] z-[-1]"
              aria-hidden="true"
            />
            <div
              id="mobile-navigation-menu"
              className="lg:hidden relative max-w-[1320px] mx-auto mt-2.5 bg-gradient-to-b from-[#171822] via-[#13141C] to-[#101118] backdrop-blur-2xl border-2 border-[#ED101C]/80 ring-1 ring-white/15 rounded-2xl px-4 pt-3.5 pb-5 space-y-2.5 shadow-[0_24px_70px_rgba(0,0,0,0.96),0_0_32px_rgba(237,16,28,0.32)] overflow-hidden"
            >
              {/* Linha de brilho superior para destacar a borda no escuro */}
              <div
                className="pointer-events-none absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/70 to-transparent"
                aria-hidden="true"
              />
              <nav className="flex flex-col space-y-1" aria-label="Navegação mobile">
                {NAV_LINKS.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={() => {
                        setActiveSection(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`px-4 py-3 rounded-xl text-base font-bold transition-colors flex items-center justify-between ${
                        isActive
                          ? 'bg-[#ED101C]/22 border border-[#ED101C]/80 text-white shadow-[0_0_16px_rgba(237,16,28,0.2)]'
                          : 'text-white/90 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full bg-[#ED101C] text-white text-[10px] font-mono uppercase">
                          Você está aqui
                        </span>
                      )}
                    </a>
                  );
                })}
              </nav>
              <div className="pt-3 border-t border-white/15 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenEnrollModal('Curso de Socorrista - Atendimento Pré-Hospitalar (APH)');
                  }}
                  className="w-full bg-[#ED101C] hover:bg-[#C80B15] text-white font-bold py-3.5 px-5 rounded-xl flex items-center justify-center shadow-red-glow-sm"
                >
                  <span>Inscreva-se agora</span>
                </button>
                {onOpenStudentPortal && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenStudentPortal();
                    }}
                    className="w-full bg-white/[0.08] hover:bg-white/[0.14] text-white font-bold py-3 px-4 rounded-xl border border-white/20 flex items-center justify-center gap-2 text-sm"
                  >
                    <GraduationCap className="w-4 h-4 text-[#ED101C]" />
                    <span>Área do Aluno (Portal LMS)</span>
                  </button>
                )}
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#1C1E28] hover:bg-[#252734] text-white font-semibold py-3 px-4 rounded-xl border border-white/20 hover:border-[#ED101C]/70 flex items-center justify-center gap-2 text-sm transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 text-[#ED101C] fill-current shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.79 14.01c-.24.68-1.42 1.3-1.97 1.38-.5.07-1.15.1-1.86-.12-.43-.14-.98-.32-1.69-.63-2.97-1.28-4.91-4.29-5.06-4.49-.15-.2-1.21-1.61-1.21-3.07 0-1.46.76-2.18 1.03-2.48.27-.3.59-.37.79-.37.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.83 2.02.9 2.17.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.3.77 1.27 1.65 2.06 1.14 1.02 2.1 1.33 2.4 1.48.3.15.47.12.64-.07.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.72.81 2.01.96.3.15.49.22.56.35.07.12.07.72-.17 1.4z" />
                  </svg>
                  <span>WhatsApp Oficial</span>
                </a>
              </div>
            </div>
          </>
        )}
      </header>

      {/* =====================================================================
          SEÇÃO 02 — HERO PRINCIPAL / PRIMEIRA DOBRA
      ===================================================================== */}
      <section
        id="inicio"
        className="relative bg-[#050505] pt-32 sm:pt-36 lg:pt-36 overflow-hidden lg:border-b lg:border-white/10"
      >
        {/* FUNDO DO HERO:
            - Desktop (lg+): Traços vetoriais 100% nítidos (sem imagem pixelada) passando de leve sob a Logo 3D e topo direito, deixando o lado esquerdo limpo
            - Mobile e Tablet em pé (<lg): Preto tático limpo */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#050505]" aria-hidden="true">
          {/* Desktop Horizontal Vetorial Ultra-Nítido */}
          <div className="hidden lg:block absolute inset-x-0 top-[96px] bottom-[84px] overflow-hidden">
            <svg
              viewBox="0 0 1440 560"
              preserveAspectRatio="none"
              className="w-full h-full"
              fill="none"
            >
              <defs>
                {/* Onda inferior nasce suavemente após o botão "Inscreva-se agora" e corre nítida sob a Logo 3D */}
                <linearGradient id="heroWaveBottom" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ED101C" stopOpacity="0" />
                  <stop offset="38%" stopColor="#ED101C" stopOpacity="0" />
                  <stop offset="56%" stopColor="#ED101C" stopOpacity="0.65" />
                  <stop offset="78%" stopColor="#FF525D" stopOpacity="0.95" />
                  <stop offset="94%" stopColor="#ED101C" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#ED101C" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="heroWaveBottomSoft" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ED101C" stopOpacity="0" />
                  <stop offset="42%" stopColor="#ED101C" stopOpacity="0" />
                  <stop offset="68%" stopColor="#ED101C" stopOpacity="0.45" />
                  <stop offset="88%" stopColor="#FF7A82" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#ED101C" stopOpacity="0" />
                </linearGradient>

                {/* Traço discreto no topo para dar profundidade sem deixar a parte superior toda preta */}
                <linearGradient id="heroWaveTop" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ED101C" stopOpacity="0" />
                  <stop offset="22%" stopColor="#ED101C" stopOpacity="0.22" />
                  <stop offset="62%" stopColor="#FF4B55" stopOpacity="0.5" />
                  <stop offset="90%" stopColor="#ED101C" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ED101C" stopOpacity="0" />
                </linearGradient>

                <filter id="heroCrimsonGlow" x="-10%" y="-40%" width="120%" height="180%">
                  <feGaussianBlur stdDeviation="4.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Faixa sutil discreta na parte superior */}
              <path
                d="M 140 92 Q 560 44, 980 86 T 1440 54"
                stroke="url(#heroWaveTop)"
                strokeWidth="1.25"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
              />
              <path
                d="M 280 112 Q 720 68, 1120 102 T 1440 78"
                stroke="url(#heroWaveTop)"
                strokeWidth="0.75"
                strokeOpacity="0.45"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
              />

              {/* Onda de neon difuso muito suave apenas embaixo da Logo 3D */}
              <path
                d="M 520 500 C 760 526, 980 468, 1440 486"
                stroke="url(#heroWaveBottomSoft)"
                strokeWidth="7"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                opacity="0.35"
                filter="url(#heroCrimsonGlow)"
              />

              {/* Filamento principal ultra-nítido passando de leve sob a Logo 3D */}
              <path
                d="M 500 502 C 745 526, 985 466, 1440 484"
                stroke="url(#heroWaveBottom)"
                strokeWidth="1.65"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
              />

              {/* Segundo filamento fino complementar para acabamento elegante */}
              <path
                d="M 570 518 C 820 488, 1080 518, 1440 470"
                stroke="url(#heroWaveBottomSoft)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Mobile & Tablet (<lg): Fundo Preto Puro Tático com brilho atmosférico discreto e feixes diagonais */}
          <div className="block lg:hidden absolute inset-0 bg-[#050505]">
            <div className="absolute -top-12 -left-16 w-56 h-56 opacity-70">
              <div className="w-3.5 h-64 bg-gradient-to-b from-[#ED101C] via-[#ED101C]/60 to-transparent rotate-[32deg] transform origin-top-left shadow-[0_0_24px_#ED101C]" />
              <div className="w-1.5 h-56 bg-gradient-to-b from-[#ED101C]/80 to-transparent rotate-[32deg] transform origin-top-left translate-x-5 -translate-y-56" />
            </div>
            <div className="absolute bottom-[14%] left-1/2 -translate-x-1/2 w-[320px] h-[220px] rounded-full bg-[#ED101C]/18 blur-[85px]" />
            <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[260px] h-[180px] rounded-full bg-[#ED101C]/10 blur-[90px]" />
          </div>
        </div>

        <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-8 min-h-[540px] lg:min-h-[610px]">
            {/* Coluna Esquerda (6 colunas no Desktop para enquadramento limpo sem quebrar travessão) */}
            <div
              ref={heroContentRef}
              className="lg:col-span-6 z-20 pt-2 pb-2 sm:py-8 lg:py-10 flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <div className="hero-reveal inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-[#ED101C]/45 shadow-[0_0_18px_rgba(237,16,28,0.16)] text-[11px] sm:text-sm text-white/95 mb-4 sm:mb-5">
                <span className="w-2 h-2 rounded-full bg-[#ED101C] animate-pulse shadow-[0_0_8px_#ED101C] shrink-0" />
                <span className="font-semibold text-white">BLACK Treinamentos</span>
                <span className="text-white/40">•</span>
                <span className="text-[#C8C8C8]">Resgate & APH</span>
              </div>

              <h1 className="hero-reveal font-display font-extrabold tracking-tight text-white text-[2rem] sm:text-5xl lg:text-[2.6rem] xl:text-[2.95rem] leading-[1.1] drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
                Curso de Socorrista
                <br />
                Atendimento
                <br />
                <span className="lg:whitespace-nowrap">
                  Pré-Hospitalar{' '}
                  <span className="text-[#ED101C] drop-shadow-[0_0_24px_rgba(237,16,28,0.45)] block lg:inline">
                    (APH)
                  </span>
                </span>
              </h1>

              <p className="hero-reveal mt-4 sm:mt-5 text-white/85 text-sm sm:text-lg max-w-md lg:max-w-xl leading-relaxed font-normal drop-shadow">
                Aprenda a agir com segurança em situações de emergência e salve vidas.
              </p>

              {/* Botão Único Principal do Hero (Limpo e centralizado, sem botões concorrentes) */}
              <div className="hero-reveal mt-6 sm:mt-7 flex items-center justify-center lg:justify-start w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => onOpenEnrollModal('Curso de Socorrista - Atendimento Pré-Hospitalar (APH)')}
                  className="btn-magnetic cta-btn-shimmer cta-sonar-pulse w-full sm:w-auto sm:min-w-[270px] bg-[#ED101C] hover:bg-[#C80B15] text-white font-bold text-base sm:text-lg px-8 py-4 rounded-full inline-flex items-center justify-center text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors"
                >
                  <span>Inscreva-se agora</span>
                </button>
              </div>

              {/* Informações da Turma Confirmada */}
              <div className="hero-reveal mt-5 sm:mt-6 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-[11px] min-[390px]:text-xs sm:text-sm text-white/75">
                <div className="flex items-center justify-center gap-1.5 whitespace-normal min-[380px]:whitespace-nowrap">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ED101C] shrink-0" />
                  <span>
                    Início: <strong className="text-white font-bold">13/02/2027 (Sábados)</strong>
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-center whitespace-normal min-[380px]:whitespace-nowrap">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ED101C] shrink-0" />
                  <span>
                    Local:{' '}
                    <strong className="text-white font-bold">
                      Prédio da Unicesumar + Portal do Aluno
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Coluna Direita (6 colunas no Desktop): Logo 3D Limpa */}
            <div className="lg:col-span-6 relative z-10 flex items-center justify-center pb-4 lg:pb-0">
              <Hero3DLogoStage />
            </div>
          </div>
        </div>

        {/* ===================================================================
            SEÇÃO 03 — CRONOGRAMA & RESUMO VISUAL DA TURMA 2027
            - Mobile (<lg): Exibe a arte completa do instrutor com os 8 cards integrados (limpa e compacta)
            - Desktop (lg+): Faixa horizontal com os 4 pilares emendando nos detalhes abaixo
        =================================================================== */}
        <div
          id="cursos"
          className="relative z-20 bg-[#050505]/95 backdrop-blur-md scroll-mt-28 sm:scroll-mt-32"
        >
          {/* Linha Laser Vermelha Superior conectando o Hero à Seção de Turma */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#ED101C]/80 to-transparent shadow-[0_0_14px_rgba(237,16,28,0.65)]"
            aria-hidden="true"
          />
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pt-4 pb-2 lg:pt-8 lg:pb-7">
            {/* Versão Mobile (<lg): Arte completa do Instrutor com todos os 8 cards e Cronograma Oficial */}
            <div className="block lg:hidden relative max-w-[430px] mx-auto overflow-hidden rounded-2xl">
              <img
                src="/assets/curso-aph-turma-2027.jpg"
                alt="Curso de Socorrista APH Turma 2027 — Instrutores Especialistas, Certificação 200 Horas (LDB), Aulas Teóricas e Práticas, Suporte Completo, Início 13/02/2027 na Unicesumar + Portal Online e parcelamento em até 10x"
                className="w-full h-auto block object-contain"
              />
              {/* Fusão sutil no topo e base com o fundo preto #050505 */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[#050505] to-transparent"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#050505] to-transparent"
                aria-hidden="true"
              />
            </div>

            {/* Versão Desktop (lg+): Faixa de 4 diferenciais */}
            <div className="hidden lg:grid grid-cols-4 gap-4">
              {DIFERENCIAIS_LIST.map((item) => {
                const IconComponent = ICON_MAP[item.icon] || ShieldCheck;
                return (
                  <div
                    key={item.id}
                    className="group flex items-center text-left gap-3.5 p-4 rounded-2xl bg-[#101015]/90 backdrop-blur-md border border-[#ED101C]/35 hover:border-[#ED101C]/80 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(237,16,28,0.16)] transition-all duration-200"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#180508] border border-[#ED101C]/50 flex items-center justify-center shrink-0 text-[#ED101C] shadow-[0_0_16px_rgba(237,16,28,0.18)] group-hover:bg-[#ED101C] group-hover:text-white group-hover:shadow-[0_0_22px_rgba(237,16,28,0.6)] transition-all duration-300">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-white/95 group-hover:text-white font-bold text-sm leading-snug whitespace-pre-line transition-colors">
                        {item.shortTitle}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
