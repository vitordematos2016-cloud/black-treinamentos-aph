import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  FileText,
  Phone,
  Award,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import {
  BRAND_CONFIG,
  CONTEUDO_PROGRAMATICO_200H,
  getWhatsAppUrl,
} from '../data/blackData';

gsap.registerPlugin(ScrollTrigger);

export default function CoursesSection({ onOpenEnrollModal }) {
  const [previewMedia, setPreviewMedia] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.curso-reveal', {
        y: 22,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cursos"
      className="relative bg-[#050505] text-white py-16 sm:py-20 lg:py-24 border-b border-white/10 overflow-hidden select-none"
      aria-labelledby="titulo-curso-socorrista"
    >
      {/* =====================================================================
          1. DETALHES DIAGONAIS VERMELHOS NOS CANTOS (SUPERIOR ESQUERDO E INFERIOR DIREITO)
             Fiel à imagem de referência `ref-layout-secao-curso-socorrista.jpg`
      ===================================================================== */}
      <div
        className="pointer-events-none absolute -top-12 -left-16 w-64 h-64 opacity-70 z-10"
        aria-hidden="true"
      >
        <div className="w-3 h-72 bg-gradient-to-b from-[#ED101C] via-[#ED101C]/60 to-transparent rotate-[32deg] transform origin-top-left shadow-[0_0_25px_#ED101C]" />
        <div className="w-1.5 h-64 bg-gradient-to-b from-[#ED101C]/80 to-transparent rotate-[32deg] transform origin-top-left translate-x-6 -translate-y-64" />
      </div>

      <div
        className="pointer-events-none absolute -bottom-16 -right-12 w-72 h-72 opacity-80 z-10"
        aria-hidden="true"
      >
        <div className="w-6 h-80 bg-gradient-to-t from-[#ED101C] via-[#ED101C]/75 to-transparent rotate-[32deg] transform origin-bottom-right translate-x-48 shadow-[0_0_30px_#ED101C]" />
        <div className="w-2.5 h-72 bg-gradient-to-t from-[#ED101C]/90 to-transparent rotate-[32deg] transform origin-bottom-right translate-x-36 -translate-y-72" />
      </div>

      {/* =====================================================================
          2. IMAGEM CENTRAL DO SOCORRISTA DE COSTAS COM A AMBULÂNCIA AO FUNDO
             - No Desktop (lg+): Usa a versão horizontal posicionada no centro.
             - No Mobile (<lg): Usa a versão vertical `socorrista-costas-ambulancia-mobile.png`!
      ===================================================================== */}
      <div
        className="pointer-events-none absolute inset-0 z-0 flex items-end justify-center overflow-hidden"
        aria-hidden="true"
      >
        {/* Versão Desktop Horizontal + Pulso Atmosférico Discreto no Giroflex da Ambulância */}
        <div className="hidden lg:flex relative w-full max-w-[1440px] h-full items-end justify-center">
          <img
            src="/assets/socorrista-costas-ambulancia.jpg"
            alt=""
            className="w-full lg:w-[82%] xl:w-[76%] h-full object-cover object-center lg:translate-x-[1%]"
            style={{
              WebkitMaskImage:
                'linear-gradient(to right, transparent 2%, black 22%, black 78%, transparent 98%)',
              maskImage:
                'linear-gradient(to right, transparent 2%, black 22%, black 78%, transparent 98%)',
            }}
          />
          {/* Luzes suaves pulsando discretamente sobre o giroflex da ambulância desfocada ao fundo */}
          <div className="cta-beacon-left absolute top-[18%] left-[54%] w-40 h-20 rounded-full bg-[#ED101C]/35 blur-[36px]" />
          <div className="cta-beacon-right absolute top-[18%] left-[62%] w-40 h-20 rounded-full bg-white/20 blur-[36px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#050505] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#050505]/70 to-transparent" />
        </div>

        {/* No Mobile (<lg), removemos o fundo duplicado borrado para exibir a arte vertical limpa uma única vez em destaque */}
      </div>

      {/* =====================================================================
          3. CONTEÚDO EM 2 COLUNAS (ESQUERDA: DADOS E CTAs | CENTRO: SOCORRISTA | DIREITA: CARD 11 MÓDULOS)
      ===================================================================== */}
      <div className="relative z-20 max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-8 lg:gap-6 min-h-[600px]">
          {/* =================================================================
              COLUNA ESQUERDA (lg:col-span-5): Centralizada no Mobile, Alinhada à Esquerda no Desktop
          ================================================================= */}
          <div className="curso-reveal lg:col-span-5 flex flex-col justify-between space-y-5 text-center lg:text-left">
            <div className="flex flex-col items-center lg:items-start">
              {/* Pílula Superior */}
              <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#160709]/95 border border-[#ED101C]/65 text-[#ED101C] text-[10.5px] sm:text-xs font-extrabold uppercase tracking-wider mb-4 shadow-[0_0_16px_rgba(237,16,28,0.16)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ED101C] animate-pulse shrink-0" />
                <span>TURMA PRESENCIAL • CARGA HORÁRIA: 200H</span>
              </div>

              {/* Título em 3 linhas com (APH) em vermelho */}
              <h2
                id="titulo-curso-socorrista"
                className="font-display font-extrabold text-[1.95rem] sm:text-4xl xl:text-[2.65rem] text-white leading-[1.12] tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]"
              >
                Curso de Socorrista —
                <br />
                Atendimento Pré-Hospitalar
                <br />
                <span className="text-[#ED101C] drop-shadow-[0_0_20px_rgba(237,16,28,0.4)]">(APH)</span>
              </h2>

              {/* Descrição Metodológica */}
              <p className="mt-4 text-white/85 text-sm sm:text-[15px] max-w-md lg:max-w-none leading-relaxed drop-shadow">
                Aulas teóricas e práticas, estudo de casos, simulações realísticas e avaliação de aprendizagem.
                Formação com certificado de <strong className="text-white">200 horas</strong> distribuídas em{' '}
                <strong className="text-white">11 módulos práticos e teóricos</strong>.
              </p>

              {/* Grade 2x2 dos 4 Cards de Informações da Turma */}
              <div className="mt-6 w-full grid grid-cols-2 gap-2.5 sm:gap-3 text-left">
                {/* Card 1: Início Previsto */}
                <div className="group bg-[#101015]/90 backdrop-blur-md border border-[#ED101C]/35 hover:border-[#ED101C]/80 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(237,16,28,0.16)] rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 transition-all duration-200">
                  <Calendar className="w-5 h-5 text-[#ED101C] shrink-0 sm:mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-[10px] sm:text-[11px] text-[#B8B8B8] uppercase font-semibold block">
                      INÍCIO PREVISTO
                    </span>
                    <strong className="text-white text-sm sm:text-lg font-extrabold">
                      13/02/2027
                    </strong>
                  </div>
                </div>

                {/* Card 2: Carga Horária & Duração */}
                <div className="group bg-[#101015]/90 backdrop-blur-md border border-[#ED101C]/35 hover:border-[#ED101C]/80 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(237,16,28,0.16)] rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 transition-all duration-200">
                  <Clock className="w-5 h-5 text-[#ED101C] shrink-0 sm:mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-[10px] sm:text-[11px] text-[#B8B8B8] uppercase font-semibold block">
                      CARGA HORÁRIA
                    </span>
                    <strong className="text-white text-xs sm:text-sm font-extrabold leading-snug block">
                      200 Horas • 8 meses
                      <br />
                      (Sábados)
                    </strong>
                  </div>
                </div>

                {/* Card 3: Local das Aulas */}
                <div className="group bg-[#101015]/90 backdrop-blur-md border border-[#ED101C]/35 hover:border-[#ED101C]/80 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(237,16,28,0.16)] rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 transition-all duration-200">
                  <MapPin className="w-5 h-5 text-[#ED101C] shrink-0 sm:mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-[10px] sm:text-[11px] text-[#B8B8B8] uppercase font-semibold block">
                      LOCAL DAS AULAS
                    </span>
                    <strong className="text-white text-xs sm:text-sm font-extrabold">
                      Prédio da Unicesumar
                    </strong>
                  </div>
                </div>

                {/* Card 4: Condição Divulgada */}
                <div className="group bg-[#101015]/90 backdrop-blur-md border border-[#ED101C]/35 hover:border-[#ED101C]/80 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(237,16,28,0.16)] rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 transition-all duration-200">
                  <CreditCard className="w-5 h-5 text-[#ED101C] shrink-0 sm:mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-[10px] sm:text-[11px] text-[#B8B8B8] uppercase font-semibold block">
                      PARCELAMENTO
                    </span>
                    <strong className="text-white text-xs sm:text-sm font-extrabold leading-snug block">
                      Até 10x no boleto ou
                      <br />
                      cartão
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco de Botões Centralizados no Mobile */}
            <div className="pt-2 space-y-3 w-full">
              {/* Botão Principal Vermelho com Shimmer Discreto */}
              <a
                href={getWhatsAppUrl(
                  'Olá! Vi o Curso de Socorrista (APH - 200 horas) com início previsto para 13/02/2027 aos sábados na Unicesumar e quero garantir minha inscrição!'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn-shimmer w-full sm:w-auto sm:min-w-[310px] bg-[#ED101C] hover:bg-[#D40D18] text-white font-bold text-sm sm:text-base px-6 sm:px-7 py-4 rounded-2xl shadow-[0_8px_25px_rgba(237,16,28,0.38)] hover:shadow-[0_10px_32px_rgba(237,16,28,0.58)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 inline-flex items-center justify-center gap-2.5"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>Garantir Inscrição • (45) 99986-7555</span>
              </a>

              {/* Linha Inferior de 3 Botões Secundários Centralizados no Mobile */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                <a
                  href="#certificacao"
                  className="bg-[#111115]/90 hover:bg-amber-500/15 backdrop-blur-md text-amber-400 font-bold text-xs sm:text-sm px-4 py-3 rounded-xl border border-amber-500/60 hover:border-amber-400 hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Ver Certificado 200h</span>
                </a>

                <button
                  type="button"
                  onClick={() =>
                    setPreviewMedia({
                      title: 'Panfleto Oficial — Formação de Socorrista (APH)',
                      src: '/assets/jornal-socorrista.png',
                    })
                  }
                  className="bg-[#111115]/90 hover:bg-white/10 backdrop-blur-md text-white/90 hover:text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl border border-white/15 hover:border-white/30 hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-[#ED101C]" />
                  <span>Panfleto</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPreviewMedia({
                      title: 'Cartaz Oficial da Turma — Curso de Socorrista (13/02/2027)',
                      src: '/assets/cartaz-socorrista.jpeg',
                    })
                  }
                  className="bg-[#111115]/90 hover:bg-white/10 backdrop-blur-md text-white/90 hover:text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl border border-white/15 hover:border-white/30 hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center gap-2"
                >
                  <ImageIcon className="w-4 h-4 text-[#ED101C]" />
                  <span>Cartaz</span>
                </button>
              </div>
            </div>
          </div>

          {/* Espaço Central no Desktop (lg:col-span-2) */}
          <div className="hidden lg:block lg:col-span-2 min-h-[520px]" aria-hidden="true" />

          {/* Imagem Dedicada Mobile Única (Limpa, Nítida e Enquadrada sem Duplicação) */}
          <div className="block lg:hidden relative w-full max-w-[360px] mx-auto rounded-3xl overflow-hidden border border-[#ED101C]/40 shadow-[0_14px_40px_rgba(0,0,0,0.85)]">
            <img
              src="/assets/socorrista-costas-ambulancia-mobile.png"
              alt="Socorrista da BLACK Treinamentos com capacete vermelho, Estrela da Vida e ambulância ao fundo"
              className="w-full h-auto object-cover object-top"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#050505] to-transparent" />
          </div>

          {/* =================================================================
              COLUNA DIREITA (lg:col-span-5): Card Flutuante com Borda Vermelha
              "Conteúdo Programático (11 Módulos • 200h)"
          ================================================================= */}
          <div className="curso-reveal lg:col-span-5 lg:mt-4">
            <div className="bg-[#0B0B0F]/92 backdrop-blur-xl border border-[#ED101C]/65 hover:border-[#ED101C]/90 rounded-3xl p-4 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(237,16,28,0.14)] transition-colors duration-300">
              {/* Topo do Card (Quebra limpa no Mobile sem estourar 390px; 1 linha no Desktop xl+) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 text-center sm:text-left">
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#ED101C] block">
                    GRADE OFICIAL DO CERTIFICADO
                  </span>
                  <h3 className="font-display font-extrabold text-base sm:text-[17px] xl:text-[18.5px] text-white mt-0.5 leading-snug xl:whitespace-nowrap">
                    Conteúdo Programático (11 Módulos • 200h)
                  </h3>
                </div>
                <span className="self-center sm:self-auto px-3 py-1 rounded-lg bg-[#ED101C] text-[11px] font-mono font-extrabold text-white shrink-0 shadow-[0_0_12px_rgba(237,16,28,0.5)]">
                  TOTAL: 200h
                </span>
              </div>

              {/* Tabela dos 11 Módulos com Destaque Tátil na Linha ao Passar o Mouse */}
              <div className="bg-[#121217]/95 border border-white/10 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-12 bg-[#2B070B] border-b border-white/10 px-3 sm:px-4 py-2.5 text-[10px] sm:text-[11px] font-mono font-bold uppercase text-white/90">
                  <span className="col-span-2">MÓD.</span>
                  <span className="col-span-8">CONTEÚDO</span>
                  <span className="col-span-2 text-right">C.H.</span>
                </div>

                <div className="divide-y divide-white/5 max-h-[345px] overflow-y-auto pr-0.5">
                  {CONTEUDO_PROGRAMATICO_200H.map((item) => (
                    <div
                      key={item.modulo}
                      className="grid grid-cols-12 px-3 sm:px-4 py-3 text-xs sm:text-[13px] items-center border-l-2 border-l-transparent hover:border-l-[#ED101C] hover:bg-[#ED101C]/[0.08] transition-all duration-150"
                    >
                      <span className="col-span-2 font-mono font-bold text-[#ED101C]">
                        {item.modulo}
                      </span>
                      <span className="col-span-8 font-medium text-white/90 pr-2">
                        {item.titulo}
                      </span>
                      <span className="col-span-2 text-right font-mono font-bold text-white">
                        {item.cargaHoraria}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nota Legal LDB */}
              <p className="mt-4 text-[11px] text-[#B8B8B8] leading-relaxed text-center sm:text-left">
                * {BRAND_CONFIG.legalBasis}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox para Visualizar o Panfleto ou Cartaz Oficial */}
      {previewMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-4xl w-full bg-[#121216] border border-white/15 rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
              <h4 className="font-bold text-sm sm:text-base text-white">{previewMedia.title}</h4>
              <button
                type="button"
                onClick={() => setPreviewMedia(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-[#ED101C] text-white transition-colors"
                aria-label="Fechar visualização"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 max-h-[82vh] overflow-y-auto flex justify-center bg-black">
              <img
                src={previewMedia.src}
                alt={previewMedia.title}
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
