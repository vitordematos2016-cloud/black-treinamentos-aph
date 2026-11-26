import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Search,
  UserPlus,
  BookOpen,
  Award,
  CheckCircle2,
  QrCode,
  ChevronDown,
  Phone,
  ArrowRight,
  MapPin,
  Instagram,
  ShieldCheck,
  Clock,
  FileCheck2,
  Star,
  Building2,
  Target,
  Activity,
  HeartHandshake,
  Scale,
  Home,
  GraduationCap,
  Users,
  Layers,
  HelpCircle,
  User,
  Code2,
  X,
  Maximize2,
  RotateCcw,
} from 'lucide-react';
import {
  BRAND_CONFIG,
  COMO_FUNCIONA_PASSOS,
  FAQ_OFICIAL,
  getWhatsAppUrl,
} from '../data/blackData';

gsap.registerPlugin(ScrollTrigger);

const STEP_ICONS = {
  Search,
  UserPlus,
  BookOpen,
  Award,
};

export default function JourneyAndCertification({
  onOpenEnrollModal,
  onOpenStudentPortal,
  showTestimonialsPreview,
}) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [showAllFaq, setShowAllFaq] = useState(false);
  const [faqSymbolPulse, setFaqSymbolPulse] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [certFocusSide, setCertFocusSide] = useState(null); // null (ambos no quadrante) | 'frente' | 'verso'

  const devWhatsAppUrl = `https://wa.me/5545998378795?text=${encodeURIComponent(
    'Olá vim pelo site do Black Treinamentos Resgate e APH e gostaria de desenvolver meu site!'
  )}`;
  const comoFuncionaRef = useRef(null);
  const certificacaoRef = useRef(null);
  const contatoRef = useRef(null);

  // Revelação suave da seção Contato & Rodapé ao rolar até o fechamento da página
  useEffect(() => {
    if (!contatoRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.contato-reveal', {
        y: 24,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: contatoRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    }, contatoRef);
    return () => ctx.revert();
  }, []);

  // Revelação suave da seção Certificação ao rolar
  useEffect(() => {
    if (!certificacaoRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.cert-reveal', {
        y: 22,
        opacity: 0,
        duration: 0.72,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: certificacaoRef.current,
          start: 'top 76%',
          once: true,
        },
      });
    }, certificacaoRef);
    return () => ctx.revert();
  }, []);

  const handleToggleFaq = (index) => {
    const nextIdx = openFaqIndex === index ? -1 : index;
    setOpenFaqIndex(nextIdx);
    if (nextIdx !== -1) {
      setFaqSymbolPulse(true);
      setTimeout(() => setFaqSymbolPulse(false), 450);
    }
  };

  // Revelação sequencial suave (01 -> 02 -> 03 -> 04) ao rolar até Como Funciona
  useEffect(() => {
    if (!comoFuncionaRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.etapa-card-reveal', {
        y: 24,
        opacity: 0,
        duration: 0.68,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: comoFuncionaRef.current,
          start: 'top 76%',
          once: true,
        },
      });
    }, comoFuncionaRef);
    return () => ctx.revert();
  }, []);

  const openCertificatePreview = () => {
    setCertFocusSide(null);
    setShowCertModal(true);
  };

  return (
    <>
      {/* =====================================================================
          SEÇÃO 06 — COMO FUNCIONAM OS TREINAMENTOS (Fiel a `como-funciona-ref.png`)
          - Título alinhado à esquerda com "Treinamentos" em itálico vermelho
          - Linha de pulso ECG vermelha abaixo do subtítulo
          - 4 Cards com borda vermelha brilhante ocupando a área esquerda/central
          - Socorrista de costas enquadrado na direita com a ambulância iluminada ao fundo
      ===================================================================== */}
      <section
        ref={comoFuncionaRef}
        id="como-funciona"
        className="relative bg-[#050505] text-white py-20 sm:py-24 border-b border-white/10 overflow-hidden select-none scroll-mt-28 sm:scroll-mt-32"
        aria-labelledby="titulo-como-funciona"
      >
        {/* Feixes Diagonais Vermelhos nos Cantos (Superior Esquerdo e Inferior Direito) */}
        <div
          className="pointer-events-none absolute -top-12 -left-16 w-64 h-64 opacity-75 z-10"
          aria-hidden="true"
        >
          <div className="w-4 h-72 bg-gradient-to-b from-[#ED101C] via-[#ED101C]/65 to-transparent rotate-[32deg] transform origin-top-left shadow-[0_0_25px_#ED101C]" />
          <div className="w-1.5 h-64 bg-gradient-to-b from-[#ED101C]/85 to-transparent rotate-[32deg] transform origin-top-left translate-x-6 -translate-y-64" />
        </div>

        <div
          className="pointer-events-none absolute -bottom-16 -right-12 w-72 h-72 opacity-85 z-20"
          aria-hidden="true"
        >
          <div className="w-6 h-80 bg-gradient-to-t from-[#ED101C] via-[#ED101C]/75 to-transparent rotate-[32deg] transform origin-bottom-right translate-x-48 shadow-[0_0_30px_#ED101C]" />
          <div className="w-2.5 h-72 bg-gradient-to-t from-[#ED101C]/90 to-transparent rotate-[32deg] transform origin-bottom-right translate-x-36 -translate-y-72" />
        </div>

        {/* Imagem de Fundo: Socorrista Original + Ambulância Desfocada Limpa na Direita (sem corte espelhado) */}
        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#050505]"
          aria-hidden="true"
        >
          {/* Desktop: Foto original limpa posicionada à direita com fusão suave para a esquerda */}
          <div className="hidden lg:block absolute inset-y-0 right-0 w-[62%] xl:w-[58%] overflow-hidden">
            <img
              src="/assets/socorrista-costas-ambulancia.jpg"
              alt=""
              className="w-full h-full object-cover object-[58%_top]"
              style={{
                WebkitMaskImage:
                  'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.45) 26%, black 52%, black 100%)',
                maskImage:
                  'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.45) 26%, black 52%, black 100%)',
              }}
            />
            {/* Giroflex sutil respirando exatamente sobre as luzes da ambulância à direita */}
            <div className="cta-beacon-left absolute top-[15%] right-[22%] w-32 h-16 rounded-full bg-[#ED101C]/35 blur-[34px]" />
            <div className="cta-beacon-right absolute top-[15%] right-[13%] w-32 h-16 rounded-full bg-white/20 blur-[34px]" />
          </div>
          {/* Mobile (<lg): Fundo preto escuro limpo com leve brilho tático central sincronizado com o restante do site */}
          <div className="block lg:hidden relative w-full h-[260px]">
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[300px] h-[160px] rounded-full bg-[#ED101C]/12 blur-[80px]" />
          </div>
          <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[#050505] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#050505] to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cabeçalho Centralizado no Mobile, Alinhado à Esquerda no Desktop + Linha de Pulso ECG Viva */}
          <div className="max-w-3xl mb-10 sm:mb-12 flex flex-col items-center text-center lg:items-start lg:text-left mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#180609]/95 border border-[#ED101C]/65 text-white/95 font-bold text-[10.5px] sm:text-xs uppercase tracking-widest mb-4 shadow-[0_0_16px_rgba(237,16,28,0.16)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ED101C] animate-pulse shrink-0" />
              <span>METODOLOGIA CLARA & TRANSPARENTE</span>
            </div>

            <h2
              id="titulo-como-funciona"
              className="font-display font-extrabold text-[1.95rem] sm:text-4xl lg:text-[3.1rem] text-white leading-tight tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]"
            >
              Como Funcionam{' '}
              <span className="italic bg-gradient-to-r from-white via-[#FF5E68] to-[#ED101C] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(237,16,28,0.4)]">
                os Treinamentos
              </span>
            </h2>

            <p className="mt-3 text-white/85 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed drop-shadow">
              {BRAND_CONFIG.methodology}
            </p>

            {/* Linha de Pulso ECG Vermelha Viva Alinhada à Largura Completa do Título & Subtítulo */}
            <div className="mt-4 flex items-center justify-center lg:justify-start w-full max-w-[680px]">
              <svg
                viewBox="0 0 520 36"
                className="w-full h-8 ecg-glow overflow-visible"
                fill="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="ecgLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ED101C" stopOpacity="0" />
                    <stop offset="25%" stopColor="#ED101C" stopOpacity="0.55" />
                    <stop offset="50%" stopColor="#FF3B47" stopOpacity="0.85" />
                    <stop offset="75%" stopColor="#ED101C" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#ED101C" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 18 L 215 18 L 224 12 L 232 25 L 242 4 L 252 32 L 260 14 L 268 18 L 520 18"
                  stroke="url(#ecgLineGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 0 18 L 215 18 L 224 12 L 232 25 L 242 4 L 252 32 L 260 14 L 268 18 L 520 18"
                  stroke="#FF404D"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="cta-ecg-spark"
                />
              </svg>
            </div>
          </div>

          {/* Grade dos 3 Cards (01 interativo -> Inscrição | 02 e 03 informativos estáticos) */}
          <div className="w-full lg:w-[76%] xl:w-[75%] grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {COMO_FUNCIONA_PASSOS.map((item, idx) => {
              const StepIcon = STEP_ICONS[item.icone] || CheckCircle2;
              const isLastCard = idx === COMO_FUNCIONA_PASSOS.length - 1;
              const isEnrollStep = idx === 0;
              const CardTag = isEnrollStep ? 'button' : 'article';
              const baseCardClasses =
                'etapa-card-reveal text-left relative bg-[#0B0B0F]/88 backdrop-blur-md border border-[#ED101C]/60 rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between shadow-[0_14px_38px_rgba(0,0,0,0.8),inset_0_-1px_12px_rgba(237,16,28,0.18)]';
              const interactiveClasses = isEnrollStep
                ? 'group hover:border-[#ED101C] hover:shadow-[0_18px_46px_rgba(237,16,28,0.26),inset_0_0_20px_rgba(237,16,28,0.15)] hover:-translate-y-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ED101C]'
                : '';

              return (
                <CardTag
                  key={item.passo}
                  {...(isEnrollStep
                    ? {
                        type: 'button',
                        onClick: () =>
                          onOpenEnrollModal('Curso de Socorrista - Atendimento Pré-Hospitalar (APH)'),
                      }
                    : {})}
                  className={`${baseCardClasses} ${interactiveClasses}`}
                >
                  {/* Brilho vermelho na borda inferior do card */}
                  <div
                    className={`pointer-events-none absolute inset-x-6 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#ED101C] to-transparent transition-opacity ${
                      isEnrollStep ? 'opacity-80 group-hover:opacity-100' : 'opacity-75'
                    }`}
                    aria-hidden="true"
                  />

                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span
                        className={`font-display font-extrabold text-2xl sm:text-3xl text-[#ED101C] transition-all ${
                          isEnrollStep ? 'group-hover:drop-shadow-[0_0_10px_rgba(237,16,28,0.6)]' : ''
                        }`}
                      >
                        {item.passo}
                      </span>
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isLastCard
                            ? 'bg-[#ED101C] text-white shadow-[0_0_18px_rgba(237,16,28,0.75)]'
                            : `bg-[#26070B]/90 border border-[#ED101C]/50 text-white ${
                                isEnrollStep
                                  ? 'group-hover:bg-[#ED101C] group-hover:shadow-[0_0_18px_rgba(237,16,28,0.6)]'
                                  : ''
                              }`
                        }`}
                      >
                        <StepIcon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="font-display font-extrabold text-lg sm:text-xl text-white mb-2.5 leading-snug">
                      {item.titulo}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed">
                      {item.descricao}
                    </p>
                  </div>

                  <div
                    className={`mt-6 pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono tracking-wider transition-colors ${
                      isEnrollStep ? 'text-white/75 group-hover:text-white' : 'text-white/65'
                    }`}
                  >
                    <span>ETAPA {idx + 1} DE {COMO_FUNCIONA_PASSOS.length}</span>
                    {isEnrollStep && (
                      <span className="inline-flex items-center gap-1.5 text-[#ED101C] font-bold">
                        <span className="text-[10px] uppercase tracking-wider">Inscrever-se</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </div>
                </CardTag>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SEÇÃO 07 — CERTIFICAÇÃO OFICIAL (Fiel 1:1 a `certificacao-ref-exata.jpg`)
          - Dois socorristas com a vítima na prancha amarela e ambulância NÍTIDOS
            (sem blur) enquadrados na extrema esquerda no PC/Tablet e versão
            vertical dedicada (`hero-bg-socorristas-mobile.png`) no Mobile!
          - Coluna esquerda posicionada logo à direita da ambulância, com os
            3 cards inferiores levemente recuados à direita do capacete do 2º
            socorrista para não cobrir os socorristas nem a vítima.
          - Coluna direita mais ampla (`lg:col-span-7`) com as 3 abas em linha
            única e os 2 certificados grandes lado a lado.
      ===================================================================== */}
      <section
        ref={certificacaoRef}
        id="certificacao"
        className="relative bg-[#050505] text-white py-14 sm:py-16 lg:py-20 border-b border-white/10 overflow-hidden select-none scroll-mt-28 sm:scroll-mt-32"
        aria-labelledby="titulo-certificacao"
      >
        {/* Feixe Diagonal Vermelho no Canto Inferior Direito */}
        <div
          className="pointer-events-none absolute -bottom-16 -right-12 w-72 h-72 opacity-85 z-20"
          aria-hidden="true"
        >
          <div className="w-6 h-80 bg-gradient-to-t from-[#ED101C] via-[#ED101C]/75 to-transparent rotate-[32deg] transform origin-bottom-right translate-x-48 shadow-[0_0_30px_#ED101C]" />
          <div className="w-2.5 h-72 bg-gradient-to-t from-[#ED101C]/90 to-transparent rotate-[32deg] transform origin-bottom-right translate-x-36 -translate-y-72" />
        </div>

        {/* Brilhos atmosféricos táticos sincronizados com o restante da página */}
        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[260px] rounded-full bg-[#ED101C]/12 blur-[120px]" />
          <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[#050505] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#050505] to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Coluna 1 (Esquerda no Desktop / Topo no Mobile): Título + Subtítulo + Card "Ver Certificado Oficial" */}
            <div className="cert-reveal lg:col-span-6 space-y-5">
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-3">
                {/* Pílula Superior */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#190609]/95 border border-[#ED101C]/70 text-white/95 text-[10.5px] sm:text-xs font-extrabold uppercase tracking-wider shadow-[0_0_15px_rgba(237,16,28,0.2)]">
                  <Award className="w-3.5 h-3.5 text-[#ED101C] shrink-0" />
                  <span>CERTIFICADO OFICIAL • FRENTE E VERSO (200H)</span>
                </div>

                <h2
                  id="titulo-certificacao"
                  className="font-display font-extrabold text-[1.95rem] sm:text-4xl xl:text-[2.6rem] text-white leading-[1.1] tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]"
                >
                  Certificado de Conclusão
                  <br />
                  <span className="bg-gradient-to-r from-white via-[#FF5E68] to-[#ED101C] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(237,16,28,0.4)]">
                    BLACK Treinamentos
                  </span>
                </h2>

                <p className="text-white/90 text-xs sm:text-sm xl:text-[15px] max-w-md lg:max-w-lg leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                  Ao concluir o <strong className="text-white">Curso de Socorrista</strong>, o aluno recebe o certificado
                  oficial da <strong className="text-white">{BRAND_CONFIG.corporateName}</strong>, com frente
                  certificada e verso discriminando todos os{' '}
                  <strong className="text-white">11 módulos e as 200 horas de cargas horárias totais.</strong>
                </p>
              </div>

              {/* Card Direto "Ver Certificado Oficial" (Centralizado para equilibrar com a foto ao lado) */}
              <div className="w-full max-w-lg mx-auto lg:mx-0 bg-[#0B0B10]/95 backdrop-blur-xl p-5 sm:p-7 rounded-3xl border border-[#ED101C]/75 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_38px_rgba(237,16,28,0.2)] text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#190609] border border-[#ED101C]/55 text-white/95 text-[11px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ED101C] animate-pulse" />
                  <span>Lei nº 9.394/96 (LDB) • 200h</span>
                </div>

                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white leading-snug">
                  Certificado com Validade
                  <br className="hidden sm:inline" />{' '}
                  <span className="bg-gradient-to-r from-white via-[#FF5E68] to-[#ED101C] bg-clip-text text-transparent">
                    em Todo o Brasil
                  </span>
                </h3>

                <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto leading-relaxed">
                  Confira o modelo oficial frente e verso antes de garantir sua vaga — carga horária completa e
                  assinatura da diretoria.
                </p>

                <div className="flex justify-center pt-0.5">
                  <button
                    type="button"
                    onClick={openCertificatePreview}
                    className="btn-magnetic cta-btn-shimmer w-full sm:w-auto sm:min-w-[290px] px-7 py-4 rounded-2xl bg-[#ED101C] hover:bg-[#C80B15] text-white font-extrabold text-sm sm:text-base shadow-[0_10px_30px_rgba(237,16,28,0.45)] inline-flex items-center justify-center gap-2.5 transition-all"
                  >
                    <Award className="w-5 h-5 shrink-0" />
                    <span>Ver Certificado Oficial</span>
                    <Maximize2 className="w-4 h-4 shrink-0 opacity-90" />
                  </button>
                </div>
              </div>
            </div>

            {/* Coluna 2 (Logo abaixo no Mobile / Direita no Desktop): Foto do Aluno segurando o Certificado Oficial */}
            <div className="cert-reveal lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-[380px] sm:max-w-[400px] lg:max-w-[410px] rounded-3xl overflow-hidden border border-[#ED101C]/45 shadow-[0_22px_65px_rgba(0,0,0,0.9),0_0_36px_rgba(237,16,28,0.18)]">
                <img
                  src="/assets/aluno-certificado-oficial.jpg"
                  alt="Aluno formado pela BLACK Treinamentos segurando o Certificado de Conclusão Oficial de 200 horas"
                  className="w-full h-auto block object-cover select-none"
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#050505]/85 via-[#050505]/30 to-transparent"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal em Quadrante com Desfoque de Fundo para Visualizar Frente & Verso com Zoom */}
      {showCertModal && (
        <div
          onClick={() => setShowCertModal(false)}
          className="fixed inset-0 z-[75] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-label="Visualização do Certificado Oficial"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[460px] sm:max-w-[540px] bg-[#0D0E14] border border-[#ED101C]/70 rounded-3xl overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(237,16,28,0.22)] flex flex-col max-h-[90vh]"
          >
            {/* Cabeçalho do Quadrante */}
            <div className="px-4 sm:px-5 py-3 border-b border-white/10 bg-[#12131B] flex items-center justify-between gap-2 shrink-0">
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#ED101C] font-bold block">
                  Certificado Oficial • 200h (LDB)
                </span>
                <h4 className="font-display font-extrabold text-sm sm:text-base text-white truncate">
                  {certFocusSide === 'frente'
                    ? 'Frente — Certificado Oficial'
                    : certFocusSide === 'verso'
                      ? 'Verso — 11 Módulos e 200h'
                      : 'Toque na Frente ou Verso para ampliar'}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setShowCertModal(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-[#ED101C] text-white transition-colors shrink-0"
                aria-label="Fechar visualização do certificado"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Conteúdo do Quadrante */}
            <div className="p-3 sm:p-4 overflow-y-auto bg-[#07070B] flex-1">
              {!certFocusSide ? (
                /* Visão Completa em 1 Página: Capa (Frente) em cima + Descritivo (Verso) embaixo */
                <div className="flex flex-col gap-3 items-center">
                  <button
                    type="button"
                    onClick={() => setCertFocusSide('frente')}
                    className="group relative w-full rounded-2xl overflow-hidden border border-amber-400/70 hover:border-amber-300 bg-white shadow-lg transition-transform hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ED101C]"
                  >
                    <img
                      src="/assets/certificado-frente.png"
                      alt="Frente do Certificado Oficial BLACK Treinamentos"
                      className="w-full max-h-[34vh] object-contain mx-auto bg-white select-none"
                    />
                    <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-black/85 border border-white/20 text-white text-[10px] font-bold inline-flex items-center gap-1 shadow">
                      <Maximize2 className="w-3 h-3 text-[#ED101C]" />
                      <span>Frente • Tocar p/ zoom</span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCertFocusSide('verso')}
                    className="group relative w-full rounded-2xl overflow-hidden border border-amber-400/70 hover:border-amber-300 bg-white shadow-lg transition-transform hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ED101C]"
                  >
                    <img
                      src="/assets/certificado-verso.png"
                      alt="Verso do Certificado Oficial BLACK Treinamentos com 11 Módulos"
                      className="w-full max-h-[34vh] object-contain mx-auto bg-white select-none"
                    />
                    <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-black/85 border border-white/20 text-white text-[10px] font-bold inline-flex items-center gap-1 shadow">
                      <Maximize2 className="w-3 h-3 text-[#ED101C]" />
                      <span>Verso • Tocar p/ zoom</span>
                    </span>
                  </button>
                </div>
              ) : (
                /* Modo Zoom Focado na Face Clicada */
                <div className="flex flex-col items-center gap-3">
                  <div
                    onClick={() => setCertFocusSide(null)}
                    role="button"
                    tabIndex={0}
                    title="Toque para voltar à visão completa"
                    className="w-full rounded-2xl overflow-hidden border-2 border-amber-400 bg-white shadow-2xl cursor-zoom-out"
                  >
                    <img
                      src={
                        certFocusSide === 'frente'
                          ? '/assets/certificado-frente.png'
                          : '/assets/certificado-verso.png'
                      }
                      alt={
                        certFocusSide === 'frente'
                          ? 'Frente do Certificado Oficial Ampliada'
                          : 'Verso do Certificado Oficial Ampliado'
                      }
                      className="w-full max-h-[68vh] object-contain mx-auto bg-white select-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé Simples de Navegação no Zoom */}
            {certFocusSide && (
              <div className="px-4 py-2.5 border-t border-white/10 bg-[#12131B] flex items-center justify-between gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setCertFocusSide(null)}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#ED101C]" />
                  <span>Ver os dois</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setCertFocusSide(certFocusSide === 'frente' ? 'verso' : 'frente')
                  }
                  className="px-4 py-2 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs font-bold transition-colors"
                >
                  {certFocusSide === 'frente' ? 'Ir para Verso (200h)' : 'Ir para Frente (Capa)'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          SEÇÃO 08 — DEPOIMENTOS (Oculto por padrão conforme PDF)
      ===================================================================== */}
      {showTestimonialsPreview && (
        <section
          id="depoimentos"
          className="bg-[#0A0A0E] text-white py-16 sm:py-20 border-b border-white/10"
          aria-labelledby="titulo-depoimentos"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase">
                Prévia de Layout (Seção Oculta por Padrão até Autorização de Relatos Reais)
              </span>
              <h2 id="titulo-depoimentos" className="mt-3 font-display font-extrabold text-3xl text-white">
                Depoimentos de Alunos
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((slot) => (
                <div
                  key={slot}
                  className="bg-[#141418] border border-dashed border-white/20 rounded-2xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1 text-[#ED101C] mb-3">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <p className="text-sm text-[#B8B8B8] italic">
                      “[Espaço reservado exclusivamente para depoimento real e autorizado de aluno formado pela BLACK
                      Treinamentos - Slot 0{slot}]”
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 text-xs text-white/70">
                    <strong>Nome do Aluno (Aguardando Consentimento)</strong> • Curso de Socorrista APH (200h)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          SEÇÃO 09 — PERGUNTAS FREQUENTES / FAQ (Fiel 1:1 a `faq-ref-exata.jpg`)
          - Fundo `#050505` com feixes diagonais vermelhos nos cantos
          - Coluna Esquerda: Símbolo Estrela da Vida + Bastão de Esculápio (Cobra)
            em neon vermelho 3D com reflexo vermelho no chão (`faq-estrela-com-reflexo.png`)
          - Coluna Direita: Cabeçalho alinhado à esquerda ("DÚVIDAS FREQUENTES" +
            "Perguntas Frequentes") e os 10 acordeões compactos com borda neon
            vermelha no item ativo.
      ===================================================================== */}
      <section
        id="faq"
        className="relative bg-[#050505] text-white py-16 sm:py-20 border-b border-white/10 overflow-hidden select-none scroll-mt-28 sm:scroll-mt-32"
        aria-labelledby="titulo-faq"
      >
        {/* Feixes Diagonais Vermelhos nos Cantos (Superior Esquerdo e Inferior Direito) */}
        <div
          className="pointer-events-none absolute -top-12 -left-16 w-64 h-64 opacity-80 z-10"
          aria-hidden="true"
        >
          <div className="w-4 h-72 bg-gradient-to-b from-[#ED101C] via-[#ED101C]/65 to-transparent rotate-[32deg] transform origin-top-left shadow-[0_0_25px_#ED101C]" />
          <div className="w-1.5 h-64 bg-gradient-to-b from-[#ED101C]/85 to-transparent rotate-[32deg] transform origin-top-left translate-x-6 -translate-y-64" />
        </div>

        <div
          className="pointer-events-none absolute -bottom-16 -right-12 w-72 h-72 opacity-85 z-10"
          aria-hidden="true"
        >
          <div className="w-6 h-80 bg-gradient-to-t from-[#ED101C] via-[#ED101C]/75 to-transparent rotate-[32deg] transform origin-bottom-right translate-x-48 shadow-[0_0_30px_#ED101C]" />
          <div className="w-2.5 h-72 bg-gradient-to-t from-[#ED101C]/90 to-transparent rotate-[32deg] transform origin-bottom-right translate-x-36 -translate-y-72" />
        </div>

        <div className="relative z-20 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Coluna Esquerda (5 colunas): Símbolo da Estrela da Vida + Cobra em Neon Vermelho com Respiração Sutil */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative order-2 lg:order-1 lg:pt-10">
              {/* Brilho radial vermelho atmosférico que reage suavemente ao abrir perguntas */}
              <div
                className={`pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[430px] sm:h-[430px] rounded-full blur-[95px] transition-all duration-500 ${faqSymbolPulse
                  ? 'bg-[#ED101C]/32 scale-110'
                  : 'bg-[#ED101C]/18 scale-100'
                  }`}
                aria-hidden="true"
              />
              <img
                src="/assets/faq-estrela-com-reflexo.png?v=4"
                alt="Símbolo da Estrela da Vida e Bastão de Esculápio em Neon Vermelho — BLACK Treinamentos"
                className="faq-neon-breathe relative z-10 w-full max-w-[210px] sm:max-w-[320px] lg:max-w-[430px] h-auto object-contain transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>

            {/* Coluna Direita (7 colunas): Cabeçalho Centralizado no Mobile, Alinhado à Esquerda no Desktop + 10 Perguntas */}
            <div className="lg:col-span-7 order-1 lg:order-2 max-w-[680px] mx-auto lg:mx-0 w-full">
              {/* Cabeçalho Centralizado no Mobile / Esquerda no Desktop */}
              <div className="text-center lg:text-left mb-6 flex flex-col items-center lg:items-start">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#180609]/95 border border-[#ED101C]/65 text-[#ED101C] font-bold text-[10px] sm:text-[11px] uppercase tracking-widest mb-3 shadow-[0_0_15px_rgba(237,16,28,0.18)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ED101C] animate-pulse" />
                  <span>DÚVIDAS FREQUENTES</span>
                </span>
                <h2
                  id="titulo-faq"
                  className="font-display font-extrabold text-[1.95rem] sm:text-4xl lg:text-[2.65rem] text-white leading-tight tracking-tight"
                >
                  Perguntas{' '}
                  <span className="bg-gradient-to-r from-white via-[#FF5E68] to-[#ED101C] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(237,16,28,0.4)]">
                    Frequentes
                  </span>
                </h2>
                <p className="mt-2 text-white/80 text-xs sm:text-sm max-w-md lg:max-w-xl leading-relaxed">
                  Respostas diretas sobre modalidades, carga horária de 200h, inscrições,
                  <br className="hidden sm:inline" /> formas de pagamento e certificação.
                </p>
              </div>

              {/* Top 4 Perguntas Principais + Expansão Opcional para Demais Dúvidas */}
              <div className="space-y-2.5">
                {(showAllFaq ? FAQ_OFICIAL : FAQ_OFICIAL.slice(0, 4)).map((item, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={item.numero}
                      className={`transition-all duration-300 ${isOpen
                        ? 'rounded-2xl bg-[#0D0D12]/95 border border-[#ED101C] shadow-[0_0_24px_rgba(237,16,28,0.38),inset_0_0_16px_rgba(237,16,28,0.12)]'
                        : 'rounded-xl bg-[#0B0B0F]/90 border border-white/10 hover:border-[#ED101C]/55'
                        }`}
                    >
                      <h3>
                        <button
                          type="button"
                          onClick={() => handleToggleFaq(index)}
                          aria-expanded={isOpen}
                          aria-controls={`faq-panel-${item.numero}`}
                          id={`faq-btn-${item.numero}`}
                          className={`w-full px-4 sm:px-5 ${isOpen ? 'pt-3.5 pb-2' : 'py-3'
                            } text-left flex items-center justify-between gap-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ED101C] rounded-xl transition-all`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`font-mono text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen
                                ? 'bg-[#ED101C] border border-[#ED101C] text-white shadow-[0_0_12px_rgba(237,16,28,0.75)]'
                                : 'bg-[#26070B] border border-[#ED101C]/45 text-[#FF3B47]'
                                }`}
                            >
                              {item.numero}
                            </span>
                            <span className="font-display font-bold text-xs sm:text-[13.5px] text-white">
                              {item.pergunta}
                            </span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-[#ED101C] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                              }`}
                          />
                        </button>
                      </h3>

                      {/* Transição Suave CSS Grid (sem salto seco ao abrir/fechar) */}
                      <div
                        id={`faq-panel-${item.numero}`}
                        role="region"
                        aria-labelledby={`faq-btn-${item.numero}`}
                        className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                          }`}
                      >
                        <div className="overflow-hidden">
                          <div className="px-4 sm:px-5 pb-4 pt-0.5 text-xs sm:text-[13px] text-white/80 leading-relaxed">
                            <p>{item.resposta}</p>
                            {item.ctaLabel && (
                              <a
                                href={getWhatsAppUrl(
                                  'Olá! Estava tirando dúvidas na página e quero falar agora com a coordenação para realizar minha inscrição!'
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#190609]/95 hover:bg-[#ED101C] border border-[#ED101C]/65 hover:border-[#ED101C] text-white font-bold text-xs shadow-[0_0_16px_rgba(237,16,28,0.18)] transition-all duration-200"
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  className="w-3.5 h-3.5 text-[#ED101C] group-hover:text-white fill-current shrink-0 transition-colors"
                                  aria-hidden="true"
                                >
                                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.79 14.01c-.24.68-1.42 1.3-1.97 1.38-.5.07-1.15.1-1.86-.12-.43-.14-.98-.32-1.69-.63-2.97-1.28-4.91-4.29-5.06-4.49-.15-.2-1.21-1.61-1.21-3.07 0-1.46.76-2.18 1.03-2.48.27-.3.59-.37.79-.37.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.83 2.02.9 2.17.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.3.77 1.27 1.65 2.06 1.14 1.02 2.1 1.33 2.4 1.48.3.15.47.12.64-.07.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.72.81 2.01.96.3.15.49.22.56.35.07.12.07.72-.17 1.4z" />
                                </svg>
                                <span>{item.ctaLabel}</span>
                                <ArrowRight className="w-3.5 h-3.5 text-[#ED101C] group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {FAQ_OFICIAL.length > 4 && (
                <div className="mt-4 flex justify-center lg:justify-start">
                  <button
                    type="button"
                    onClick={() => setShowAllFaq((prev) => !prev)}
                    className="px-5 py-2.5 rounded-full bg-[#12131B] hover:bg-[#1A070A] border border-white/15 hover:border-[#ED101C]/60 text-xs font-bold text-white/90 inline-flex items-center gap-2 transition-colors"
                  >
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#ED101C] transition-transform duration-300 ${showAllFaq ? 'rotate-180' : ''}`}
                    />
                    <span>
                      {showAllFaq
                        ? 'Mostrar apenas as 4 principais'
                        : `Ver mais ${FAQ_OFICIAL.length - 4} dúvidas frequentes`}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SEÇÃO 10 — CONTATO, INSCRIÇÃO E RODAPÉ (Fiel 1:1 a `contato-ref-exata.jpg`)
          - Feixes diagonais vermelhos no canto superior esquerdo
          - Card CTA com borda neon vermelha luminosa, bloco de texto + 3 botões
            na esquerda (63%) e arte do socorrista + cidade + ambulância +
            Estrela da Vida posicionada na direita rompendo levemente a borda
            superior do card (efeito 3D pop-out idêntico à referência!).
      ===================================================================== */}
      <section
        ref={contatoRef}
        id="contato"
        className="relative bg-[#050505] text-white pt-14 sm:pt-20 pb-10 sm:pb-20 overflow-hidden scroll-mt-28 sm:scroll-mt-32"
        aria-labelledby="titulo-cta-final"
      >
        {/* Feixes Diagonais Vermelhos Ancorados nas Extremidades da Tela (Superior Esquerdo e Inferior Direito) */}
        <div
          className="pointer-events-none absolute -top-12 -left-16 w-64 h-64 opacity-85 z-10"
          aria-hidden="true"
        >
          <div className="w-5 h-72 bg-gradient-to-b from-[#ED101C] via-[#ED101C]/70 to-transparent rotate-[32deg] transform origin-top-left shadow-[0_0_28px_#ED101C]" />
          <div className="w-2 h-64 bg-gradient-to-b from-[#ED101C]/85 to-transparent rotate-[32deg] transform origin-top-left translate-x-7 -translate-y-64" />
        </div>

        <div
          className="pointer-events-none absolute bottom-[22%] -left-16 w-56 h-56 opacity-75 z-10"
          aria-hidden="true"
        >
          <div className="w-4 h-64 bg-gradient-to-b from-[#ED101C] via-[#ED101C]/65 to-transparent rotate-[32deg] transform origin-top-left shadow-[0_0_24px_#ED101C]" />
          <div className="w-1.5 h-56 bg-gradient-to-b from-[#ED101C]/80 to-transparent rotate-[32deg] transform origin-top-left translate-x-6 -translate-y-64" />
        </div>

        <div
          className="pointer-events-none absolute -bottom-16 -right-12 w-72 h-72 opacity-85 z-10"
          aria-hidden="true"
        >
          <div className="w-5 h-72 bg-gradient-to-t from-[#ED101C] via-[#ED101C]/70 to-transparent rotate-[32deg] transform origin-bottom-right translate-x-44 shadow-[0_0_28px_#ED101C]" />
          <div className="w-2 h-64 bg-gradient-to-t from-[#ED101C]/85 to-transparent rotate-[32deg] transform origin-bottom-right translate-x-34 -translate-y-72" />
        </div>

        <div className="relative z-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Card Principal de Chamada com Borda Luminosa de Giroflex em Movimento + Pop-out 3D */}
          <div className="contato-reveal cta-emergency-border group relative rounded-[1.75rem] p-[1.5px] shadow-[0_0_45px_rgba(237,16,28,0.28)]">
            {/* Borda Giratória de Emergência (Vermelho & Branco) */}
            <div className="cta-emergency-border-ring" aria-hidden="true" />

            {/* Corpo Interno do Card */}
            <div className="relative z-10 rounded-[calc(1.75rem-1.5px)] bg-gradient-to-r from-[#190508] via-[#0F0507] to-[#050406] px-5 sm:px-8 lg:px-9 xl:px-10 py-10 sm:py-12 lg:py-14 shadow-[inset_0_0_32px_rgba(237,16,28,0.14)]">
              {/* Camada interna de brilho suave confinada às bordas arredondadas */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[calc(1.75rem-1.5px)] overflow-hidden"
                aria-hidden="true"
              >
                <div className="absolute -top-24 left-[28%] -translate-x-1/2 w-[520px] h-[260px] rounded-full bg-[#ED101C]/22 blur-[110px]" />
                <div className="absolute bottom-0 right-[8%] w-[360px] h-[220px] rounded-full bg-[#ED101C]/18 blur-[95px]" />
              </div>

              {/* Bloco Esquerdo (68% no Desktop): Pílula, Título, Subtítulo, Pulso ECG Vivo e 3 Botões 100% Inteiros Dentro da Borda */}
              <div className="relative z-20 lg:w-[68%] xl:w-[67%] text-center">
                <span className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#1C0609]/95 border border-[#ED101C]/65 text-white text-[11px] sm:text-xs font-extrabold uppercase tracking-widest mb-4 shadow-[0_0_16px_rgba(237,16,28,0.22)]">
                  <span className="w-2 h-2 rounded-full bg-[#ED101C] animate-pulse shadow-[0_0_8px_#ED101C]" />
                  <span>“{BRAND_CONFIG.certMissionQuote}”</span>
                </span>

                <h2
                  id="titulo-cta-final"
                  className="font-display font-extrabold text-2xl sm:text-4xl lg:text-[2.35rem] xl:text-[2.6rem] text-white leading-[1.13] tracking-tight"
                >
                  Prepare-se para fazer a diferença
                  <br className="hidden sm:inline" /> quando{' '}
                  <span className="bg-gradient-to-r from-white via-[#FF5E68] to-[#ED101C] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(237,16,28,0.45)]">
                    cada segundo importa.
                  </span>
                </h2>

                <p className="mt-3.5 text-white/85 text-xs sm:text-sm lg:text-[15px] max-w-xl mx-auto leading-relaxed">
                  Em uma emergência real, não há tempo para improviso —{' '}
                  <strong className="text-white">quem domina o atendimento salva vidas.</strong> Fale agora com nossa
                  coordenação e garanta sua vaga na próxima turma{' '}
                  <strong className="text-white">(Online + Presencial).</strong>
                </p>

                {/* Linha de Batimento Cardíaco ECG ao Vivo ("cada segundo importa") */}
                <div className="my-4 flex items-center justify-center" aria-hidden="true">
                  <svg viewBox="0 0 420 30" className="w-full max-w-[340px] h-7 overflow-visible" fill="none">
                    {/* Base sutil da linha ECG */}
                    <path
                      d="M 0 15 L 162 15 L 172 10 L 180 21 L 190 2 L 200 28 L 209 11 L 217 15 L 420 15"
                      stroke="rgba(237,16,28,0.28)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Pulso luminoso percorrendo o ECG em tempo real */}
                    <path
                      d="M 0 15 L 162 15 L 172 10 L 180 21 L 190 2 L 200 28 L 209 11 L 217 15 L 420 15"
                      stroke="#FF3845"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="cta-ecg-spark ecg-glow"
                    />
                  </svg>
                </div>

                {/* Botão Único de Fechamento (Alta Urgência — Sem número e sem botões concorrentes) */}
                <div className="mt-2 flex flex-col items-center justify-center gap-2.5 w-full">
                  <a
                    href={getWhatsAppUrl(
                      'Olá! Quero garantir minha vaga na próxima turma do Curso de Socorrista (APH - 200 horas) da BLACK Treinamentos!'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-magnetic cta-btn-shimmer cta-sonar-pulse w-full sm:w-auto sm:min-w-[310px] bg-[#ED101C] hover:bg-[#C80B15] text-white font-extrabold text-sm sm:text-base px-7 py-4 rounded-full inline-flex items-center justify-center gap-2.5 shadow-[0_10px_32px_rgba(237,16,28,0.5)] transition-colors text-center"
                  >
                    <span>Quero Garantir Minha Vaga Agora</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </a>
                  <span className="text-[11px] font-mono text-white/65 tracking-wide">
                    Atendimento direto no WhatsApp • Vagas limitadas
                  </span>
                </div>
              </div>

              {/* Arte Direita no Desktop: Socorrista + Cidade + Ambulância com Giroflex Vivo (Pop-out sutil acima da borda!) */}
              <div
                className="pointer-events-none hidden lg:flex absolute right-1 xl:right-4 -top-7 bottom-[2px] w-[360px] xl:w-[410px] z-10 items-end justify-end"
                aria-hidden="true"
              >
                {/* Brilhos alternados simulando o giroflex aceso no teto da ambulância */}
                <div className="cta-beacon-left absolute right-[44%] top-[53%] w-24 h-16 rounded-full bg-[#ED101C]/65 blur-[22px] z-20" />
                <div className="cta-beacon-right absolute right-[28%] top-[53%] w-24 h-16 rounded-full bg-white/45 blur-[22px] z-20" />

                <img
                  src="/assets/contato-arte-socorrista.png"
                  alt="Socorrista, Ambulância e Estrela da Vida — BLACK Treinamentos"
                  className="relative z-10 w-full h-full object-contain object-bottom select-none transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>

              {/* Versão Mobile / Tablet: Arte centralizada logo abaixo do botão */}
              <div className="block lg:hidden mt-5 flex justify-center relative">
                <img
                  src="/assets/contato-arte-socorrista.png"
                  alt="Socorrista, Ambulância e Estrela da Vida — BLACK Treinamentos"
                  className="w-full max-w-[320px] sm:max-w-[360px] h-auto object-contain select-none"
                />
              </div>
            </div>
          </div>

          {/* =====================================================================
              RODAPÉ INSTITUCIONAL REFINADO
              - Alinhamento simétrico no Mobile (Navegação em 2 colunas + Canais em cards limpos)
              - Colunas equilibradas no Desktop com linha laser vermelha superior e inferior
          ===================================================================== */}
          <footer className="contato-reveal relative mt-14 sm:mt-16 pt-10 sm:pt-12 pb-2">
            {/* Linha Laser Vermelha Superior */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#ED101C] to-transparent shadow-[0_0_16px_rgba(237,16,28,0.85)]"
              aria-hidden="true"
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 pb-10 text-center lg:text-left items-start">
              {/* Coluna 1: Logo + Barra Vertical Neon + Descrição + CNPJ e Diretor */}
              <div className="lg:col-span-5 space-y-4 flex flex-col items-center lg:items-start">
                <div className="flex items-center justify-center lg:justify-start gap-5">
                  <img
                    src="/assets/logo-header-sharp.png"
                    alt="BLACK Treinamentos - Resgate & APH"
                    className="h-11 sm:h-12 w-auto object-contain"
                  />
                  <span
                    className="hidden lg:block w-[2px] h-11 bg-gradient-to-b from-transparent via-[#ED101C] to-transparent shadow-[0_0_12px_#ED101C]"
                    aria-hidden="true"
                  />
                </div>

                <p className="text-xs sm:text-[13.5px] text-white/80 max-w-md leading-relaxed">
                  <strong className="text-white font-extrabold">{BRAND_CONFIG.corporateName}</strong> — “{BRAND_CONFIG.certBackQuote}”{' '}
                  Formação de Socorristas em Atendimento Pré-Hospitalar (APH 200h), Resgate e Prevenção a Incêndios.
                </p>

                <div className="w-full max-w-sm lg:max-w-none space-y-2 text-xs sm:text-[13px] text-white/85 flex flex-col items-center lg:items-start pt-1">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-[#ED101C] shrink-0 drop-shadow-[0_0_8px_rgba(237,16,28,0.6)]" />
                    <span className="text-white/25">|</span>
                    <span>
                      CNPJ: <strong className="text-white font-semibold">{BRAND_CONFIG.cnpj}</strong> • {BRAND_CONFIG.cityState}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-[#ED101C] shrink-0 drop-shadow-[0_0_8px_rgba(237,16,28,0.6)]" />
                    <span className="text-white/25">|</span>
                    <span>
                      Diretor Responsável:{' '}
                      <strong className="text-white font-bold">{BRAND_CONFIG.directorCivilName}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Coluna 2: NAVEGAÇÃO (2 colunas no Mobile/Tablet e Desktop largo xl+; 1 coluna em Notebooks 1024-1279px para nunca truncar!) */}
              <div className="lg:col-span-3 space-y-4 flex flex-col items-center lg:items-start w-full lg:pt-1">
                <h3 className="font-display font-extrabold text-xs sm:text-sm uppercase tracking-wider text-white flex items-center justify-center lg:justify-start gap-2.5">
                  <span className="w-[3px] h-4 rounded-full bg-[#ED101C] shadow-[0_0_10px_#ED101C]" />
                  <span>Navegação</span>
                </h3>
                <ul className="w-full max-w-sm lg:max-w-none grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2 sm:gap-2.5 text-xs sm:text-[12.5px] text-white/85 text-left">
                  {[
                    { href: '#inicio', label: 'Início', icon: Home },
                    { href: '#cursos', label: 'Turma 2027', icon: GraduationCap },
                    { href: '#equipe', label: 'Instrutores', icon: Users },
                    { href: '#como-funciona', label: 'Metodologia', icon: Layers },
                    { href: '#certificacao', label: 'Certificado', icon: Award },
                    { href: '#faq', label: 'FAQ', icon: HelpCircle },
                  ].map((navItem) => {
                    const NavIcon = navItem.icon;
                    return (
                      <li key={navItem.href}>
                        <a
                          href={navItem.href}
                          className="group flex items-center gap-2 p-2 xl:p-1.5 rounded-xl bg-[#0C0D12] border border-white/[0.07] hover:border-[#ED101C]/45 hover:text-white transition-all"
                        >
                          <span className="w-6 h-6 rounded-lg bg-[#190508] border border-[#ED101C]/45 flex items-center justify-center text-[#ED101C] shadow-[0_0_10px_rgba(237,16,28,0.16)] group-hover:bg-[#ED101C] group-hover:text-white transition-all shrink-0">
                            <NavIcon className="w-3.5 h-3.5" />
                          </span>
                          <span className="truncate font-medium group-hover:translate-x-0.5 transition-transform">
                            {navItem.label}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                  {onOpenStudentPortal && (
                    <li className="col-span-2 lg:col-span-1 xl:col-span-2">
                      <button
                        type="button"
                        onClick={onOpenStudentPortal}
                        className="group w-full flex items-center justify-center gap-2.5 p-2.5 rounded-xl bg-[#170609]/85 border border-[#ED101C]/50 hover:border-[#ED101C] hover:bg-[#ED101C]/15 text-white transition-all"
                      >
                        <span className="w-6 h-6 rounded-lg bg-[#190508] border border-[#ED101C]/55 flex items-center justify-center text-[#ED101C] shadow-[0_0_12px_rgba(237,16,28,0.2)] group-hover:bg-[#ED101C] group-hover:text-white transition-all shrink-0">
                          <GraduationCap className="w-3.5 h-3.5" />
                        </span>
                        <span className="font-bold text-white group-hover:translate-x-0.5 transition-transform">
                          Área do Aluno (Portal LMS)
                        </span>
                      </button>
                    </li>
                  )}
                </ul>
              </div>

              {/* Coluna 3: CANAIS OFICIAIS (Cartões uniformes no Mobile, Tablet e Desktop) */}
              <div className="lg:col-span-4 space-y-4 flex flex-col items-center lg:items-start w-full lg:pt-1">
                <h3 className="font-display font-extrabold text-xs sm:text-sm uppercase tracking-wider text-white flex items-center justify-center lg:justify-start gap-2.5">
                  <span className="w-[3px] h-4 rounded-full bg-[#ED101C] shadow-[0_0_10px_#ED101C]" />
                  <span>Canais Oficiais</span>
                </h3>
                <div className="w-full max-w-sm lg:max-w-none space-y-3 text-left">
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0C0D12] border border-white/10 hover:border-[#ED101C]/75 hover:bg-[#13070A] transition-all"
                  >
                    <span className="w-10 h-10 rounded-xl bg-[#180508] border border-[#ED101C]/60 flex items-center justify-center text-[#ED101C] shadow-[0_0_16px_rgba(237,16,28,0.22)] group-hover:bg-[#ED101C] group-hover:text-white transition-all shrink-0">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                    <div className="min-w-0 flex-1 leading-snug">
                      <span className="block text-[11px] text-white/70">WhatsApp Oficial (Atendimento):</span>
                      <span className="block text-sm sm:text-base font-display font-extrabold text-white group-hover:text-[#FF3845] transition-colors">
                        {BRAND_CONFIG.whatsappDisplay}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#ED101C] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </a>

                  <div className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#0C0D12] border border-white/10">
                    <span className="w-10 h-10 rounded-xl bg-[#180508] border border-[#ED101C]/60 flex items-center justify-center text-[#ED101C] shadow-[0_0_16px_rgba(237,16,28,0.22)] shrink-0">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                    <div className="min-w-0 text-xs sm:text-[13px] text-white/80 leading-snug">
                      <div>
                        Sede: <strong className="text-white font-extrabold">{BRAND_CONFIG.cityState}</strong>
                      </div>
                      <div className="text-white/90 font-medium mt-0.5">
                        Unicesumar (Presencial) + Portal Online
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Linha Laser Vermelha Inferior + Direitos Autorais e Pilares */}
            <div className="relative pt-7">
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#ED101C] to-transparent shadow-[0_0_16px_rgba(237,16,28,0.85)]"
                aria-hidden="true"
              />
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/75 text-center sm:text-left">
                <p>
                  © {new Date().getFullYear()} {BRAND_CONFIG.corporateName} • TODOS OS DIREITOS RESERVADOS.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 font-medium tracking-wider text-white/85">
                  <span>CONHECIMENTO</span>
                  <span className="text-[#ED101C]">•</span>
                  <span>PRÁTICA</span>
                  <span className="text-[#ED101C]">•</span>
                  <span>SEGURANÇA</span>
                  <span className="text-[#ED101C]">•</span>
                  <span>VIDA</span>
                </div>
              </div>

              {/* Assinatura Discreta e Estratégica do Desenvolvedor (Abre o Card apenas ao clicar) */}
              <div className="mt-5 pt-4 border-t border-white/[0.06] flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowDevModal(true)}
                  className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] text-white/45 hover:text-white/95 bg-transparent hover:bg-white/[0.04] border border-transparent hover:border-[#ED101C]/45 transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#ED101C]"
                  title="Ver credencial do desenvolvedor Matos Soluções"
                >
                  <Code2 className="w-3 h-3 text-[#ED101C]/75 group-hover:text-[#ED101C] transition-colors" />
                  <span>
                    Desenvolvido por{' '}
                    <strong className="font-semibold text-white/65 group-hover:text-white transition-colors">
                      Matos Soluções
                    </strong>
                  </span>
                </button>
              </div>
            </div>
          </footer>
        </div>
      </section>

      {/* =====================================================================
          MODAL ESTRATÉGICO DO DESENVOLVEDOR — MATOS SOLUÇÕES (VITOR DE MATOS)
          Abre somente quando o visitante clica em "Desenvolvido por Matos Soluções"
      ===================================================================== */}
      {showDevModal && (
        <div
          onClick={() => setShowDevModal(false)}
          className="fixed inset-0 z-[80] bg-black/88 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-dev-modal"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[380px] bg-[#0B0B10] border border-[#ED101C]/65 rounded-3xl p-4 sm:p-5 shadow-[0_24px_70px_rgba(0,0,0,0.92),0_0_40px_rgba(237,16,28,0.22)] my-auto"
          >
            {/* Topo do Modal */}
            <div className="flex items-center justify-between gap-3 mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#1A0609] border border-[#ED101C]/50 flex items-center justify-center text-[#ED101C]">
                  <Code2 className="w-4 h-4" />
                </span>
                <div>
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-[#ED101C] font-bold">
                    Matos Soluções
                  </span>
                  <h3 id="titulo-dev-modal" className="font-display font-extrabold text-sm text-white leading-tight">
                    Vitor de Matos — Desenvolvedor
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDevModal(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-[#ED101C] text-white transition-colors"
                aria-label="Fechar cartão do desenvolvedor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Card Oficial do Desenvolvedor */}
            <div className="rounded-2xl overflow-hidden border border-white/15 bg-[#050505] shadow-2xl">
              <img
                src="/assets/card-vitor-matos-dev.jpg"
                alt="Vitor de Matos — Desenvolvedor do Site — Matos Soluções"
                className="w-full h-auto max-h-[60vh] object-contain mx-auto block select-none"
              />
            </div>

            {/* CTA Direto para o WhatsApp do Desenvolvedor */}
            <div className="mt-4 space-y-2 text-center">
              <p className="text-[11px] text-white/70">
                Gostou deste projeto e quer desenvolver um site ou sistema sob medida?
              </p>
              <a
                href={devWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-magnetic cta-btn-shimmer w-full py-3 px-4 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(237,16,28,0.5)] transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>Desenvolver Meu Site • (45) 99837-8795</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
