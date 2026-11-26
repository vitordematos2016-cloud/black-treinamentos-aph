import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import {
  Shield,
  Users,
  ChevronDown,
  ChevronUp,
  RotateCw,
  Maximize2,
  Quote,
  X,
  Phone,
} from 'lucide-react';
import { BRAND_CONFIG, getWhatsAppUrl } from '../data/blackData';
import { pushOverlayHistory, dismissOverlayHistory } from '../utils/navigationHistory';

const INSTRUCTOR_CARDS = [
  {
    id: 'cleverson-black',
    nome: 'Cleverson Black',
    cargo: 'Diretor & Instrutor Responsável de APH',
    especialidade: 'Bombeiro Civil • Socorrista • Defesa Civil • Enfermagem',
    destaqueLider: true,
    cardFrente: '/assets/card-cleverson-frente.png',
    cardVerso: '/assets/card-cleverson-verso.png',
  },
  {
    id: 'iverson-rodrigo',
    nome: 'Iverson Rodrigo',
    cargo: 'Instrutor de APH',
    especialidade: 'Téc. Enfermagem • Instrumentador Cirúrgico • Bombeiro Civil',
    destaqueLider: false,
    cardFrente: '/assets/card-iverson-frente.png?v=2',
    cardVerso: '/assets/card-iverson-verso.png?v=2',
  },
  {
    id: 'erika-raquel',
    nome: 'Érica Raquel de Oliveira',
    cargo: 'Instrutora de APH • Socorrista e Resgatista',
    especialidade: 'Resgate Rodoviário • BLS • Brigada • Enfermagem',
    destaqueLider: false,
    cardFrente: '/assets/card-erika-frente.png',
    cardVerso: '/assets/card-erika-verso.png',
  },
  {
    id: 'wagner-brita',
    nome: 'Wagner Ricardo dos Santos “Brita”',
    cargo: 'Instrutor de APH',
    especialidade: 'Resgate Veicular Holmatro • APH Tático • Viaturas de Emergência',
    destaqueLider: false,
    cardFrente: '/assets/card-wagner-frente.png',
    cardVerso: '/assets/card-wagner-verso.png',
  },
  {
    id: 'salete-silva',
    nome: 'Salete da Silva',
    cargo: 'Instrutora de APH',
    especialidade: 'Cenap Cascavel • Experiência SMR & SAMU • BLS & Resgate',
    destaqueLider: false,
    cardFrente: '/assets/card-salete-frente.png',
    cardVerso: '/assets/card-salete-verso.png',
  },
];

export default function InstructorsShowcase() {
  const [showInstructors, setShowInstructors] = useState(false);
  const [flippedMap, setFlippedMap] = useState({});
  const [tiltMap, setTiltMap] = useState({});
  const [inspectCard, setInspectCard] = useState(null);
  const audioCtxRef = useRef(null);
  const sectionRef = useRef(null);

  const openInspectCard = (inst) => {
    setInspectCard(inst);
    pushOverlayHistory('inspect-card', () => setInspectCard(null));
  };

  const closeInspectCard = () => {
    setInspectCard(null);
    dismissOverlayHistory('inspect-card');
  };

  // Entrada escalonada suave dos 5 crachás ao abrir o módulo de instrutores
  useEffect(() => {
    if (!showInstructors || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.equipe-card-reveal', {
        y: 18,
        opacity: 0,
        duration: 0.45,
        stagger: 0.07,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [showInstructors]);

  // Libera o AudioContext ao desmontar para evitar vazamentos em recarregamentos
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Inclinação 3D física sutil (±6°) apenas em dispositivos com mouse/hover real
  const handleCardMouseMove = (e, id, isFlipped) => {
    if (isFlipped || window.matchMedia?.('(hover: none)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 11; // -5.5deg a +5.5deg
    const rotateX = (0.5 - py) * 11;
    setTiltMap((prev) => ({
      ...prev,
      [id]: {
        rotateX,
        rotateY,
        glareX: px * 100,
        glareY: py * 100,
        active: true,
      },
    }));
  };

  const handleCardMouseLeave = (id) => {
    setTiltMap((prev) => ({
      ...prev,
      [id]: { rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, active: false },
    }));
  };

  /**
   * Sintetizador Web Audio API de Alta Precisão:
   * Gera o efeito sonoro físico de um crachá rígido girando no ar ("Whoosh" aerodinâmico)
   * seguido de um leve estalo magnético tático ("Snap/Lock") ao encaixar em 180º.
   */
  const playCardFlipSound = (isFlippingToBack = true, delaySec = 0) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;

      const scheduleSound = () => {
        try {
          if (ctx.state === 'closed') return;
          const now = ctx.currentTime + delaySec;

          // 1. Camada "Whoosh" (Sopro aerodinâmico do cartão cortando o ar)
          const duration = 0.22;
          const bufferSize = Math.floor(ctx.sampleRate * duration);
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }

          const whiteNoise = ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;

          const bandpass = ctx.createBiquadFilter();
          bandpass.type = 'bandpass';
          bandpass.Q.setValueAtTime(2.4, now);
          const startFreq = isFlippingToBack ? 260 : 340;
          const peakFreq = isFlippingToBack ? 1550 : 1250;
          const endFreq = isFlippingToBack ? 420 : 280;
          bandpass.frequency.setValueAtTime(startFreq, now);
          bandpass.frequency.exponentialRampToValueAtTime(peakFreq, now + 0.09);
          bandpass.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.001, now);
          noiseGain.gain.linearRampToValueAtTime(0.28, now + 0.075);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

          whiteNoise.connect(bandpass);
          bandpass.connect(noiseGain);
          noiseGain.connect(ctx.destination);

          whiteNoise.start(now);
          whiteNoise.stop(now + duration);

          // 2. Camada "Tactical Snap" (Toque mecânico grave + clique sutil no encaixe final do giro)
          const snapTime = now + 0.14;
          const osc = ctx.createOscillator();
          const snapGain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(isFlippingToBack ? 190 : 155, snapTime);
          osc.frequency.exponentialRampToValueAtTime(48, snapTime + 0.065);

          snapGain.gain.setValueAtTime(0.001, snapTime);
          snapGain.gain.linearRampToValueAtTime(0.22, snapTime + 0.008);
          snapGain.gain.exponentialRampToValueAtTime(0.001, snapTime + 0.065);

          osc.connect(snapGain);
          snapGain.connect(ctx.destination);

          osc.start(snapTime);
          osc.stop(snapTime + 0.07);
        } catch (err) {
          // Ignora com segurança qualquer falha de áudio em navegadores restritos
        }
      };

      if (ctx.state === 'suspended') {
        ctx.resume().then(scheduleSound).catch(() => {});
      } else {
        scheduleSound();
      }
    } catch (e) {
      // Ignora caso o navegador bloqueie áudio antes de interação
    }
  };

  const toggleCardFlip = (id) => {
    const nextFlipped = !flippedMap[id];
    playCardFlipSound(nextFlipped, 0);
    setTiltMap((prev) => ({
      ...prev,
      [id]: { rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, active: false },
    }));
    setFlippedMap((prev) => ({
      ...prev,
      [id]: nextFlipped,
    }));
  };

  return (
    <section
      ref={sectionRef}
      id="equipe"
      className="relative bg-[#050505] text-white py-14 sm:py-20 border-b border-white/10 overflow-hidden scroll-mt-28 sm:scroll-mt-32"
      aria-labelledby="titulo-equipe-instrutores"
    >
      {/* Feixes Diagonais Vermelhos Discretos nos Cantos (Coesão Visual com todo o site) */}
      <div
        className="pointer-events-none absolute -top-12 -left-16 w-64 h-64 opacity-70 z-0"
        aria-hidden="true"
      >
        <div className="w-4 h-72 bg-gradient-to-b from-[#ED101C] via-[#ED101C]/60 to-transparent rotate-[32deg] transform origin-top-left shadow-[0_0_25px_#ED101C]" />
        <div className="w-1.5 h-64 bg-gradient-to-b from-[#ED101C]/80 to-transparent rotate-[32deg] transform origin-top-left translate-x-6 -translate-y-64" />
      </div>

      <div
        className="pointer-events-none absolute -bottom-16 -right-12 w-72 h-72 opacity-75 z-0"
        aria-hidden="true"
      >
        <div className="w-6 h-80 bg-gradient-to-t from-[#ED101C] via-[#ED101C]/70 to-transparent rotate-[32deg] transform origin-bottom-right translate-x-48 shadow-[0_0_30px_#ED101C]" />
        <div className="w-2.5 h-72 bg-gradient-to-t from-[#ED101C]/85 to-transparent rotate-[32deg] transform origin-bottom-right translate-x-36 -translate-y-72" />
      </div>

      {/* Luzes táticas ambientais */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[820px] h-[380px] rounded-full bg-[#ED101C]/12 blur-[150px]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ===================================================================
            CABEÇALHO ENXUTO + MÓDULO INTERATIVO PARA ABRIR OS INSTRUTORES
        =================================================================== */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ED101C]/15 border border-[#ED101C]/40 text-[#ED101C] text-[11px] font-extrabold uppercase tracking-widest mb-3.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Equipe de Elite APH</span>
          </div>

          <h2
            id="titulo-equipe-instrutores"
            className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight"
          >
            Conheça Nossa{' '}
            <span className="bg-gradient-to-r from-white via-[#FF5E68] to-[#ED101C] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(237,16,28,0.35)]">
              Equipe de Instrutores
            </span>
          </h2>

          <p className="mt-3 text-[#B8B8B8] text-sm sm:text-base leading-relaxed">
            Treinamento conduzido por <strong className="text-white">5 especialistas</strong> com vivência real em
            resgate, SAMU e combate a incêndio.
          </p>

          {/* Módulo Compacto Clicável: Abre/Recolhe os Cartões dos Instrutores */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setShowInstructors((prev) => !prev)}
              aria-expanded={showInstructors}
              className={`btn-magnetic group w-full sm:w-auto sm:min-w-[320px] px-6 py-4 rounded-2xl border transition-all duration-300 inline-flex items-center justify-center gap-3 font-extrabold text-sm sm:text-base ${
                showInstructors
                  ? 'bg-[#14141A] border-white/20 text-white hover:border-[#ED101C]/60'
                  : 'cta-btn-shimmer bg-[#ED101C] hover:bg-[#C80B15] border-[#ED101C] text-white shadow-[0_10px_30px_rgba(237,16,28,0.42)]'
              }`}
            >
              <Users className="w-5 h-5 shrink-0" />
              <span>
                {showInstructors
                  ? 'Ocultar Instrutores'
                  : 'Ver Nossos Instrutores'}
              </span>
              {showInstructors ? (
                <ChevronUp className="w-4 h-4 shrink-0 text-white/80" />
              ) : (
                <ChevronDown className="w-4 h-4 shrink-0 group-hover:translate-y-0.5 transition-transform" />
              )}
            </button>
          </div>
        </div>

        {/* ===================================================================
            ÁREA EXPANDIDA: INSTRUÇÃO CLARA + GRADE 3D FLIP CARDS DOS 5 INSTRUTORES
        =================================================================== */}
        {showInstructors && (
          <div className="mt-8 sm:mt-10">
            {/* Comunicação objetiva de como virar o cartão para ver habilidades e currículo */}
            <div className="max-w-xl mx-auto mb-8 px-4 py-3 rounded-2xl bg-[#110608]/95 border border-[#ED101C]/40 text-center">
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                <strong className="text-[#FF6B73]">Toque ou clique em qualquer cartão</strong> para girar em 3D e
                conferir habilidades, cursos e experiência. Use <strong className="text-white">Ampliar</strong> para
                leitura em tela cheia.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-7 lg:gap-9">
          {INSTRUCTOR_CARDS.map((inst, idx) => {
            const isFlipped = !!flippedMap[inst.id];
            const tilt = tiltMap[inst.id] || {
              rotateX: 0,
              rotateY: 0,
              glareX: 50,
              glareY: 50,
              active: false,
            };

            return (
              <div
                key={inst.id}
                className="equipe-card-reveal w-full sm:w-[330px] lg:w-[355px] flex flex-col items-center"
              >
                {/* Topo Identificador Acima do Crachá (Selo sempre em 1 linha limpa!) */}
                <div className="w-full flex items-center justify-between gap-2 px-2 mb-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="px-2 py-0.5 rounded-md bg-[#ED101C]/20 border border-[#ED101C]/45 font-mono text-xs font-extrabold text-[#ED101C] shrink-0">
                      0{idx + 1}
                    </span>
                    <span className="font-display font-bold text-sm text-white truncate">
                      {inst.nome}
                    </span>
                  </div>

                  <span
                    className={`whitespace-nowrap shrink-0 text-[10.5px] font-mono font-bold px-2.5 py-0.5 rounded-full transition-colors ${
                      isFlipped
                        ? 'bg-white text-[#050505]'
                        : 'bg-[#17171D] text-[#B8B8B8] border border-white/10'
                    }`}
                  >
                    {isFlipped ? 'VERSO • CURRÍCULO' : 'FRENTE • CAPA'}
                  </span>
                </div>

                {/* Palco 3D do Cartão com Inclinação Física Sutil seguindo o Cursor */}
                <div
                  onClick={() => toggleCardFlip(inst.id)}
                  onMouseMove={(e) => handleCardMouseMove(e, inst.id, isFlipped)}
                  onMouseLeave={() => handleCardMouseLeave(inst.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleCardFlip(inst.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Cartão de ${inst.nome}. Clique para girar entre capa e currículo.`}
                  className="group perspective-1200 w-full aspect-[2/3] cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ED101C] rounded-[1.75rem]"
                >
                  <div
                    className={`relative w-full h-full transform-style-3d rounded-[1.75rem] ${
                      isFlipped
                        ? 'shadow-[0_20px_55px_rgba(237,16,28,0.34)]'
                        : 'shadow-[0_18px_45px_rgba(0,0,0,0.85)] group-hover:shadow-[0_24px_60px_rgba(237,16,28,0.32)]'
                    }`}
                    style={{
                      transform: isFlipped
                        ? 'rotateY(180deg)'
                        : `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) ${
                            tilt.active ? 'translateY(-4px)' : ''
                          }`,
                      transition: tilt.active
                        ? 'transform 0.12s ease-out, box-shadow 0.3s ease'
                        : 'transform 0.72s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease',
                    }}
                  >
                    {/* FACE 1: FRENTE (CAPA DO CRACHÁ TÁTICO — 100% LIMPA SEM COBREDORES NO RODAPÉ!) */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rounded-[1.75rem] overflow-hidden bg-[#08080B] border border-white/15 group-hover:border-[#ED101C]/80 transition-colors">
                      <img
                        src={inst.cardFrente}
                        alt={`Capa do cartão de ${inst.nome} - ${inst.cargo}`}
                        className="w-full h-full object-contain bg-[#050505]"
                      />

                      {/* Reflexo Especular Holográfico Dinâmico acompanhando o cursor */}
                      <div
                        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                        style={{
                          opacity: tilt.active ? 1 : 0,
                          background: `radial-gradient(circle 220px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.22), rgba(237,16,28,0.08) 45%, transparent 75%)`,
                        }}
                      />

                      {/* Indicador Discreto no Canto Superior Direito (aparece no hover sem cobrir nada do crachá!) */}
                      <div className="pointer-events-none absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-250">
                        <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#ED101C]/70 text-white text-[10px] font-bold inline-flex items-center gap-1.5 shadow-lg">
                          <RotateCw className="w-3 h-3 text-[#ED101C]" />
                          <span>Girar 3D</span>
                        </span>
                      </div>
                    </div>

                    {/* FACE 2: VERSO (INFORMAÇÕES E QUALIFICAÇÕES COMPLETAS) */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-[1.75rem] overflow-hidden bg-white border-2 border-[#ED101C] shadow-2xl">
                      <img
                        src={inst.cardVerso}
                        alt={`Currículo e qualificações de ${inst.nome}`}
                        className="w-full h-full object-contain bg-white"
                      />

                      <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5">
                        <span className="px-3 py-1 rounded-full bg-[#050505]/90 hover:bg-[#ED101C] text-white text-[11px] font-bold inline-flex items-center gap-1.5 shadow-lg transition-colors">
                          <RotateCw className="w-3 h-3" />
                          <span>Voltar à Capa</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Barra Inferior de Ações Rápidas do Cartão */}
                <div className="w-full mt-3 flex items-center justify-between gap-2 px-1">
                  <button
                    type="button"
                    onClick={() => toggleCardFlip(inst.id)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#111116] hover:bg-[#1A0609] border border-white/10 hover:border-[#ED101C]/60 text-xs font-bold text-white/90 hover:text-white inline-flex items-center justify-center gap-1.5 transition-all"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-[#ED101C]" />
                    <span>{isFlipped ? 'Mostrar Capa' : 'Girar Cartão 3D'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openInspectCard(inst)}
                    className="py-2.5 px-3.5 rounded-xl bg-[#111116] hover:bg-[#ED101C] border border-white/10 hover:border-[#ED101C] text-xs font-bold text-white/90 hover:text-white inline-flex items-center justify-center gap-1.5 transition-all"
                    title="Ampliar Frente e Verso lado a lado"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Ampliar</span>
                  </button>
                </div>
              </div>
            );
          })}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setShowInstructors(false)}
                className="px-5 py-2.5 rounded-full bg-[#14141A] border border-white/15 hover:border-[#ED101C]/60 text-xs font-bold text-white/85 hover:text-white inline-flex items-center gap-2 transition-colors"
              >
                <ChevronUp className="w-4 h-4 text-[#ED101C]" />
                <span>Recolher Lista de Instrutores</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            MANIFESTO DE LIDERANÇA DO FUNDADOR (CLEVERSON BLACK)
        =================================================================== */}
        <div className="mt-10 sm:mt-14 relative overflow-hidden bg-gradient-to-r from-[#140507] via-[#0E0E13] to-[#120608] border border-[#ED101C]/55 rounded-3xl p-6 sm:p-9 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-[0_18px_50px_rgba(0,0,0,0.85),inset_0_0_24px_rgba(237,16,28,0.1)] text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 max-w-3xl">
            <div className="w-12 h-12 rounded-2xl bg-[#1A0609] border border-[#ED101C]/55 shadow-[0_0_18px_rgba(237,16,28,0.22)] flex items-center justify-center shrink-0 text-[#ED101C] lg:mt-0.5">
              <Quote className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white/95 font-medium italic text-sm sm:text-base lg:text-lg leading-relaxed">
                {BRAND_CONFIG.leaderQuote}
              </p>
              <span className="mt-2 block text-xs sm:text-sm font-bold text-[#ED101C]">
                — {BRAND_CONFIG.leaderAuthor}
              </span>
            </div>
          </div>

          <a
            href={getWhatsAppUrl(
              'Olá! Vi os cartões e qualificações da equipe de 5 instrutores da BLACK Treinamentos e quero saber mais sobre as inscrições!'
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-magnetic cta-btn-shimmer w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs sm:text-sm font-bold shadow-[0_0_24px_rgba(237,16,28,0.45)] inline-flex items-center justify-center gap-2 shrink-0"
          >
            <Phone className="w-4 h-4" />
            <span>Treinar com a Equipe BLACK</span>
          </a>
        </div>
      </div>

      {/* MODAL DE INSPEÇÃO EM ALTA RESOLUÇÃO (FRENTE + VERSO LADO A LADO) */}
      {inspectCard && (
        <div
          onClick={closeInspectCard}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-[#121217] border border-white/15 rounded-3xl overflow-hidden shadow-2xl my-8"
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#ED101C] font-bold block">
                  Credencial Oficial • Frente e Verso
                </span>
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-white">
                  {inspectCard.nome} — {inspectCard.cargo}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeInspectCard}
                className="p-2 rounded-xl bg-white/10 hover:bg-[#ED101C] text-white transition-colors"
                aria-label="Fechar visualização"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[82vh] overflow-y-auto bg-[#08080B]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-2 text-center">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#B8B8B8] font-bold">
                    Frente — Capa Operacional
                  </span>
                  <img
                    src={inspectCard.cardFrente}
                    alt={`Frente ${inspectCard.nome}`}
                    className="w-full max-h-[70vh] object-contain rounded-2xl mx-auto shadow-2xl"
                  />
                </div>
                <div className="space-y-2 text-center">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#ED101C] font-bold">
                    Verso — Qualificações e Currículo
                  </span>
                  <img
                    src={inspectCard.cardVerso}
                    alt={`Verso ${inspectCard.nome}`}
                    className="w-full max-h-[70vh] object-contain rounded-2xl mx-auto shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
