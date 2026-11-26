import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
} from 'lucide-react';
import {
  BRAND_CONFIG,
  CONTEUDO_PROGRAMATICO_200H,
  getWhatsAppUrl,
} from '../data/blackData';

gsap.registerPlugin(ScrollTrigger);

export default function CoursesSection({ onOpenEnrollModal }) {
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
      id="detalhes-turma"
      className="relative bg-[#050505] text-white pt-3 pb-12 sm:pb-16 lg:py-20 border-b border-white/10 overflow-hidden select-none scroll-mt-28 sm:scroll-mt-32"
      aria-labelledby="titulo-curso-socorrista"
    >
      {/* =====================================================================
          1. DETALHES DIAGONAIS VERMELHOS NOS CANTOS (SUPERIOR ESQUERDO NO DESKTOP E INFERIOR DIREITO)
             Fiel à imagem de referência `ref-layout-secao-curso-socorrista.jpg`
      ===================================================================== */}
      <div
        className="hidden lg:block pointer-events-none absolute -top-12 -left-16 w-64 h-64 opacity-70 z-10"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-6 lg:gap-6 lg:min-h-[600px]">
          {/* =================================================================
              COLUNA ESQUERDA (lg:col-span-5):
              - No Mobile: Mantém direto "Garantir Inscrição" + Panfleto/Cartaz logo abaixo da arte nova
              - No Desktop: Cabeçalho + 4 Cards de Informações da Turma + CTAs
          ================================================================= */}
          <div className="curso-reveal lg:col-span-5 flex flex-col justify-between space-y-5 text-center lg:text-left">
            <div className="hidden lg:flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#160709]/95 border border-[#ED101C]/65 text-[#ED101C] text-xs font-extrabold uppercase tracking-wider mb-3 shadow-[0_0_16px_rgba(237,16,28,0.16)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ED101C] animate-pulse shrink-0" />
                <span>CRONOGRAMA OFICIAL • TURMA 2027</span>
              </div>

              <h2
                id="titulo-curso-socorrista"
                className="font-display font-extrabold text-3xl xl:text-[2.2rem] text-white leading-[1.15] tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]"
              >
                Detalhes da Turma
                <br />
                <span className="bg-gradient-to-r from-white via-[#FF5E68] to-[#ED101C] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(237,16,28,0.4)]">
                  &amp; Grade Oficial
                </span>
              </h2>

              {/* Grade 2x2 dos 4 Cards de Informações da Turma (Desktop) */}
              <div className="mt-5 w-full grid grid-cols-2 gap-3 text-left">
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
                      (Sábados à tarde)
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
                    <strong className="text-white text-xs sm:text-sm font-extrabold leading-snug block">
                      Unicesumar + Portal Online
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

            {/* Botão Principal de Inscrição Centralizado abaixo dos 4 cards */}
            <div className="pt-1 lg:pt-2 w-full flex justify-center">
              <a
                href={getWhatsAppUrl(
                  'Olá! Vi o Curso de Socorrista (APH - 200 horas • Formato Híbrido) com início previsto para 13/02/2027 e quero garantir minha inscrição!'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn-shimmer w-full sm:w-auto sm:min-w-[300px] bg-[#ED101C] hover:bg-[#D40D18] text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-[0_8px_25px_rgba(237,16,28,0.4)] hover:shadow-[0_10px_32px_rgba(237,16,28,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 inline-flex items-center justify-center text-center"
              >
                <span>Garantir Inscrição</span>
              </a>
            </div>
          </div>

          {/* Espaço Central no Desktop (lg:col-span-2) */}
          <div className="hidden lg:block lg:col-span-2 min-h-[520px]" aria-hidden="true" />

          {/* =================================================================
              COLUNA DIREITA (lg:col-span-5): Card Flutuante com Borda Vermelha
              "Conteúdo Programático (11 Módulos • 200h)"
          ================================================================= */}
          <div className="curso-reveal lg:col-span-5 lg:mt-0">
            <div className="relative overflow-hidden bg-[#0B0B0F]/95 backdrop-blur-xl border border-[#ED101C]/70 hover:border-[#ED101C] rounded-3xl p-4 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(237,16,28,0.18)] transition-colors duration-300">
              {/* Brilho atmosférico discreto no topo do card */}
              <div
                className="pointer-events-none -top-12 left-1/2 -translate-x-1/2 w-64 h-24 rounded-full bg-[#ED101C]/20 blur-[48px] absolute"
                aria-hidden="true"
              />

              {/* Topo do Card com Contraste Branco -> Vermelho e Badge 200h */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 text-center sm:text-left">
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#FF7A82]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ED101C] animate-pulse shrink-0" />
                    <span>GRADE OFICIAL DO CERTIFICADO</span>
                  </span>
                  <h3 className="font-display font-extrabold text-lg sm:text-[19px] xl:text-[20px] text-white mt-1 leading-snug">
                    Conteúdo Programático{' '}
                    <span className="bg-gradient-to-r from-white via-[#FF5E68] to-[#ED101C] bg-clip-text text-transparent">
                      (11 Módulos)
                    </span>
                  </h3>
                </div>
                <span className="self-center sm:self-auto px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#ED101C] to-[#C80B15] border border-white/20 text-[11px] font-mono font-extrabold text-white shrink-0 shadow-[0_0_16px_rgba(237,16,28,0.55)]">
                  TOTAL: 200h
                </span>
              </div>

              {/* Tabela dos 11 Módulos com Badges nos Números e Barra Inferior de Total */}
              <div className="relative z-10 bg-[#121217]/95 border border-white/10 rounded-2xl overflow-hidden shadow-inner">
                <div className="grid grid-cols-12 bg-[#2B070B] border-b border-white/10 px-3 sm:px-4 py-2.5 text-[10px] sm:text-[11px] font-mono font-bold uppercase text-white/95">
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
                      <span className="col-span-2">
                        <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-md bg-[#ED101C]/15 border border-[#ED101C]/35 font-mono font-bold text-[11px] text-[#FF6B73]">
                          {item.modulo}
                        </span>
                      </span>
                      <span className="col-span-8 font-medium text-white/95 pr-2">
                        {item.titulo}
                      </span>
                      <span className="col-span-2 text-right font-mono font-bold text-white">
                        {item.cargaHoraria}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-[#1A0609]/95 border-t border-[#ED101C]/30 px-3 sm:px-4 py-2 flex items-center justify-between text-[10.5px] sm:text-[11px] font-mono">
                  <span className="text-white/75">Role a lista • 11 módulos completos</span>
                  <span className="font-extrabold text-[#FF6B73]">200h Certificadas</span>
                </div>
              </div>

              {/* Nota Legal LDB */}
              <p className="relative z-10 mt-4 text-[11px] text-[#B8B8B8] leading-relaxed text-center sm:text-left">
                * {BRAND_CONFIG.legalBasis}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
