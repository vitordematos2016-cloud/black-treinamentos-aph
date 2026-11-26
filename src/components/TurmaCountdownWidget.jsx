import React, { useState, useEffect } from 'react';

const DEFAULT_TURMA_START_ISO = '2027-02-13T13:30:00-03:00';

/**
 * Calcula o tempo restante real até a data prevista da Turma 2027.
 * Nunca reseta de forma artificial — acompanha o relógio real em contagem regressiva.
 */
function computeRemainingTime(targetTimestamp) {
  const diffMs = Math.max(0, targetTimestamp - Date.now());
  const totalSeconds = Math.floor(diffMs / 1000);

  const dias = Math.floor(totalSeconds / 86400);
  const horas = Math.floor((totalSeconds % 86400) / 3600);
  const minutos = Math.floor((totalSeconds % 3600) / 60);
  const segundos = totalSeconds % 60;

  return {
    dias,
    horas,
    minutos,
    segundos,
  };
}

const pad2 = (n) => String(n).padStart(2, '0');

/**
 * Plaquinha estilo Calendário de Mesa com argolinhas no topo:
 * A folha inteira vira para cima e para trás sem nenhum risco no meio do número,
 * revelando a folha seguinte logo abaixo.
 */
function DeskCalendarSheet({ value, unitLabel }) {
  const [state, setState] = useState({
    prev: value,
    curr: value,
    flipKey: 0,
    flipping: false,
  });

  useEffect(() => {
    if (value === state.curr) return;
    setState((s) => ({
      prev: s.curr,
      curr: value,
      flipKey: s.flipKey + 1,
      flipping: true,
    }));
  }, [value, state.curr]);

  useEffect(() => {
    if (!state.flipping) return;
    const doneTimer = setTimeout(() => {
      setState((s) => ({ ...s, prev: s.curr, flipping: false }));
    }, 500);
    return () => clearTimeout(doneTimer);
  }, [state.flipping, state.flipKey]);

  const cardWidthClass =
    state.curr.length > 2
      ? 'min-w-[29px] sm:min-w-[35px]'
      : 'min-w-[24px] sm:min-w-[28px]';

  const digitTextClass =
    'font-mono font-extrabold text-[11.5px] sm:text-[13px] text-[#FACC15] tabular-nums leading-none drop-shadow-[0_0_6px_rgba(250,204,21,0.45)] select-none';

  return (
    <div className="inline-flex items-center gap-[3px] sm:gap-1">
      <div className="relative pt-[2px]">
        {/* Duas micro-argolinhas metálicas no topo simulando o espiral do calendário de mesa */}
        <div
          className="pointer-events-none absolute top-0 left-1.5 right-1.5 flex items-center justify-between z-30"
          aria-hidden="true"
        >
          <span className="w-[3px] h-[5px] rounded-full bg-gradient-to-b from-[#FEF08A] to-[#CA8A04] shadow-[0_1px_2px_rgba(0,0,0,0.9)]" />
          <span className="w-[3px] h-[5px] rounded-full bg-gradient-to-b from-[#FEF08A] to-[#CA8A04] shadow-[0_1px_2px_rgba(0,0,0,0.9)]" />
        </div>

        {/* Bloco das folhas do calendário */}
        <div
          className={`flip-cal-unit relative h-[22px] sm:h-[26px] ${cardWidthClass} rounded-[5px] bg-[#141105] border border-[#FACC15]/60 shadow-[0_3px_10px_rgba(250,204,21,0.16),0_2px_0_rgba(250,204,21,0.2)] overflow-visible`}
        >
          {/* Folha de baixo (Novo número 100% inteiro e nítido) */}
          <div
            key={`under-${state.flipKey}`}
            className={`w-full h-full rounded-[4px] bg-gradient-to-b from-[#251F08] via-[#191506] to-[#110E04] flex items-center justify-center pt-[2px] ${
              state.flipping ? 'desk-cal-under-reveal' : ''
            }`}
          >
            <span className={digitTextClass}>{state.curr}</span>
          </div>

          {/* Folha da frente virando para cima e para trás ao mudar */}
          {state.flipping && (
            <div
              key={`flip-${state.flipKey}`}
              className="desk-cal-sheet-flip absolute inset-0 rounded-[4px] bg-gradient-to-b from-[#28220A] via-[#1B1707] to-[#120F04] border border-[#FACC15]/45 flex items-center justify-center pt-[2px] z-20 shadow-lg"
            >
              <span className={digitTextClass}>{state.prev}</span>
            </div>
          )}
        </div>
      </div>

      <span className="text-[9px] sm:text-[10px] font-mono font-extrabold uppercase text-[#FDE047]/90 tracking-tight pt-[2px]">
        {unitLabel}
      </span>
    </div>
  );
}

export default function TurmaCountdownWidget({
  targetIso = DEFAULT_TURMA_START_ISO,
  dateLabel = '13/02/2027',
  onClick,
}) {
  const targetTimestamp = new Date(targetIso).getTime();
  const [remaining, setRemaining] = useState(() => computeRemainingTime(targetTimestamp));

  useEffect(() => {
    setRemaining(computeRemainingTime(targetTimestamp));
    const timer = setInterval(() => {
      setRemaining(computeRemainingTime(targetTimestamp));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTimestamp]);

  return (
    <a
      href="#detalhes-turma"
      onClick={onClick}
      className="relative z-10 flex items-center justify-between gap-2 bg-[#0B0A05]/95 hover:bg-[#141106] border-t border-[#FACC15]/35 rounded-b-[14px] px-2.5 sm:px-7 lg:px-9 py-1.5 transition-colors group"
      title="Contagem regressiva real para o início da Turma 2027 — Toque para garantir sua inscrição"
    >
      {/* Lado Esquerdo: Data confirmada da Turma */}
      <div className="inline-flex items-center gap-1.5 min-w-0">
        <span className="w-2 h-2 rounded-full bg-[#FACC15] animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.9)] shrink-0" />
        <span className="text-[10px] min-[390px]:text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-white/95 truncate">
          <span className="hidden min-[380px]:inline">Turma 2027 • </span>
          <span className="text-[#FACC15]">{dateLabel}</span>
        </span>
      </div>

      {/* Lado Direito: Calendário de Mesa Virando para Trás (Dias • Horas • Min • Seg) */}
      <div className="inline-flex items-center gap-1 sm:gap-2 shrink-0">
        <DeskCalendarSheet value={String(remaining.dias)} unitLabel="d" />
        <DeskCalendarSheet value={pad2(remaining.horas)} unitLabel="h" />
        <DeskCalendarSheet value={pad2(remaining.minutos)} unitLabel="m" />
        <DeskCalendarSheet value={pad2(remaining.segundos)} unitLabel="s" />
      </div>
    </a>
  );
}
