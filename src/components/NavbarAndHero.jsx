import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  Menu,
  X,
  ArrowRight,
  UserCheck,
  Award,
  ClipboardCheck,
  Headphones,
  Calendar,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { BRAND_CONFIG, DIFERENCIAIS_LIST, getWhatsAppUrl } from '../data/blackData';
import Hero3DLogoStage from './Hero3DLogoStage';

const ICON_MAP = {
  UserCheck,
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

export default function NavbarAndHero({ onOpenEnrollModal }) {
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
          <div className="relative z-10 bg-[#07070A]/95 backdrop-blur-xl rounded-[14px] px-4 sm:px-7 lg:px-9 py-2.5 flex items-center justify-between gap-4">
            {/* Logo Oficial BLACK Treinamentos — Maior, mais centralizada e com nitidez reforçada */}
            <a
              href="#inicio"
              onClick={() => setActiveSection('inicio')}
              className="flex items-center justify-center pl-1 sm:pl-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ED101C] rounded-lg group"
              aria-label="BLACK Treinamentos - Resgate & APH - Ir para o início"
            >
              <img
                src="/assets/logo-header-sharp.png"
                alt="Logomarca oficial BLACK Treinamentos - Resgate & APH"
                className="h-12 sm:h-14 lg:h-[58px] w-auto object-contain select-none drop-shadow-[0_2px_12px_rgba(237,16,28,0.35)] group-hover:scale-[1.03] transition-transform"
              />
            </a>

            {/* Navegação Desktop com Sinalizador Inteligente de Aba Ativa ao Rolar/Subir */}
            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2" aria-label="Navegação principal">
              {NAV_LINKS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setActiveSection(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ED101C] ${
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

            {/* CTA Desktop "Inscreva-se agora" */}
            <div className="hidden sm:flex items-center gap-3 pr-1">
              <button
                type="button"
                onClick={() => onOpenEnrollModal('Curso de Socorrista - Atendimento Pré-Hospitalar (APH)')}
                className="btn-magnetic bg-[#ED101C] hover:bg-[#C80B15] text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-red-glow-sm flex items-center gap-2 border border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Inscreva-se agora</span>
              </button>
            </div>

            {/* Botão Hamburger Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-menu"
              aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
              className="lg:hidden p-2.5 rounded-xl bg-[#17171D] text-white hover:bg-[#24242C] border border-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ED101C]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu Recolhível Mobile (Também com Sinalização da Aba Ativa) */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation-menu"
            className="lg:hidden max-w-[1320px] mx-auto mt-2 bg-[#0A0A0E]/95 backdrop-blur-xl border border-[#ED101C]/40 rounded-2xl px-4 pt-3 pb-5 space-y-2 shadow-2xl"
          >
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
                        ? 'bg-[#ED101C]/20 border border-[#ED101C]/70 text-white'
                        : 'text-white/85 hover:text-white hover:bg-white/5'
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
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEnrollModal('Curso de Socorrista - Atendimento Pré-Hospitalar (APH)');
                }}
                className="w-full bg-[#ED101C] hover:bg-[#C80B15] text-white font-bold py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 shadow-red-glow-sm"
              >
                <span>Inscreva-se agora</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#171717] hover:bg-[#222226] text-white/90 font-medium py-3 px-4 rounded-xl border border-white/10 flex items-center justify-center gap-2 text-sm"
              >
                <Phone className="w-4 h-4 text-[#ED101C]" />
                <span>WhatsApp Oficial: {BRAND_CONFIG.whatsappDisplay}</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* =====================================================================
          SEÇÃO 02 — HERO PRINCIPAL / PRIMEIRA DOBRA
      ===================================================================== */}
      <section
        id="inicio"
        className="relative bg-[#050505] pt-28 sm:pt-32 lg:pt-32 overflow-hidden border-b border-white/10"
      >
        {/* IMAGEM DE FUNDO DE TUDO: Versão Desktop (Horizontal) + Versão Mobile (Vertical dedicada) */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          {/* Desktop / Tablet Horizontal */}
          <img
            src="/assets/hero-bg-socorristas.jpg"
            alt=""
            className="hidden md:block w-full h-full object-cover object-center blur-[3px] sm:blur-[4px] scale-105 opacity-60"
          />
          {/* Mobile Vertical (`socorristas img mobile.png` enquadrada no topo para mostrar ambulância + socorristas) */}
          <img
            src="/assets/hero-bg-socorristas-mobile.png"
            alt=""
            className="block md:hidden w-full h-full object-cover object-top blur-[2px] scale-105 opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/85 via-[#050505]/55 to-[#050505] md:bg-gradient-to-r md:from-[#050505]/90 md:via-[#050505]/50 md:to-[#050505]/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/60" />
        </div>

        <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-4 lg:gap-8 min-h-[540px] lg:min-h-[600px]">
            {/* Coluna Esquerda (5 colunas): Centralizada no Mobile, Alinhada à Esquerda no Desktop */}
            <div
              ref={heroContentRef}
              className="lg:col-span-5 z-20 pt-2 pb-2 sm:py-8 lg:py-12 flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <div className="hero-reveal inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-[#ED101C]/45 shadow-[0_0_18px_rgba(237,16,28,0.16)] text-[11px] sm:text-sm text-white/95 mb-4 sm:mb-5">
                <span className="w-2 h-2 rounded-full bg-[#ED101C] animate-pulse shadow-[0_0_8px_#ED101C] shrink-0" />
                <span className="font-semibold text-white">BLACK Treinamentos</span>
                <span className="text-white/40">•</span>
                <span className="text-[#C8C8C8]">Formação 200h</span>
              </div>

              <h1 className="hero-reveal font-display font-extrabold tracking-tight text-white text-[2.15rem] sm:text-5xl lg:text-[3.35rem] xl:text-[3.6rem] leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
                Treinamentos em
                <br />
                Atendimento
                <br />
                Pré-Hospitalar
                <br />
                <span className="text-[#ED101C] drop-shadow-[0_0_24px_rgba(237,16,28,0.45)]">(APH)</span>
              </h1>

              <p className="hero-reveal mt-4 sm:mt-5 text-white/85 text-sm sm:text-lg max-w-md lg:max-w-lg leading-relaxed font-normal drop-shadow">
                Aprenda a agir com segurança em situações de emergência e salve vidas.
              </p>

              {/* Botões de Ação do Hero (Centralizados e confortáveis no Mobile) */}
              <div className="hero-reveal mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-3.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => onOpenEnrollModal('Curso de Socorrista - Atendimento Pré-Hospitalar (APH)')}
                  className="btn-magnetic cta-btn-shimmer cta-sonar-pulse group w-full sm:w-auto bg-[#ED101C] hover:bg-[#C80B15] text-white font-bold text-base sm:text-lg pl-6 pr-3.5 py-3.5 rounded-full inline-flex items-center justify-center gap-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors"
                >
                  <span>Inscreva-se agora</span>
                  <span className="w-9 h-9 rounded-full bg-black/25 group-hover:bg-black/35 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </span>
                </button>

                <a
                  href="#cursos"
                  className="w-full sm:w-auto text-center px-5 py-3.5 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md text-white/95 hover:text-white font-semibold text-sm sm:text-base border border-white/15 hover:border-[#ED101C]/55 transition-all"
                >
                  Conhecer treinamentos
                </a>
              </div>

              {/* Informações da Turma Confirmada (Centralizadas no Mobile) */}
              <div className="hero-reveal mt-5 sm:mt-6 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs sm:text-sm text-white/85">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#ED101C] shrink-0 drop-shadow-[0_0_6px_rgba(237,16,28,0.5)]" />
                  <span>
                    Turma Socorrista (200h): <strong className="text-white">13/02/2027 (Sábados)</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#ED101C] shrink-0 drop-shadow-[0_0_6px_rgba(237,16,28,0.5)]" />
                  <span>
                    Local: <strong className="text-white">Prédio da Unicesumar</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Coluna Direita (7 colunas): Logo 3D Limpa Sobre o Fundo Desfocado */}
            <div className="lg:col-span-7 relative z-10 flex items-center justify-center pb-4 lg:pb-0">
              <Hero3DLogoStage />
            </div>
          </div>
        </div>

        {/* ===================================================================
            SEÇÃO 03 — FAIXA DE DIFERENCIAIS (Centralizada em Cards no Mobile)
        =================================================================== */}
        <div className="relative z-20 bg-[#08080B]/95 backdrop-blur-md">
          {/* Linha Laser Vermelha Superior conectando o Hero aos Diferenciais */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#ED101C]/80 to-transparent shadow-[0_0_14px_rgba(237,16,28,0.65)]"
            aria-hidden="true"
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-7">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {DIFERENCIAIS_LIST.map((item) => {
                const IconComponent = ICON_MAP[item.icon] || ShieldCheck;
                return (
                  <div
                    key={item.id}
                    className="group flex flex-col sm:flex-row items-center text-center sm:text-left gap-2.5 sm:gap-4 p-3 sm:p-2.5 rounded-2xl bg-white/[0.02] sm:bg-transparent border border-white/[0.06] sm:border-transparent hover:border-[#ED101C]/40 hover:bg-white/[0.03] transition-all duration-300"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#180508] border border-[#ED101C]/50 flex items-center justify-center shrink-0 text-[#ED101C] shadow-[0_0_16px_rgba(237,16,28,0.18)] group-hover:bg-[#ED101C] group-hover:text-white group-hover:shadow-[0_0_22px_rgba(237,16,28,0.6)] transition-all duration-300">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h2 className="text-white/95 group-hover:text-white font-bold text-xs sm:text-sm md:text-base leading-snug whitespace-pre-line transition-colors">
                        {item.shortTitle}
                      </h2>
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
