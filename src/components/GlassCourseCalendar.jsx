import React, { useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  GraduationCap,
  Clock,
  ChevronLeft,
  ChevronRight,
  Users,
  Check,
  CalendarClock,
  Info,
} from 'lucide-react';

const MONTH_NAMES_PT = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const MONTH_SHORT_PT = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

const COURSE_START = new Date(2027, 1, 13); // 13/02/2027
const COURSE_END = new Date(2027, 9, 16);   // 16/10/2027

const COURSE_MONTHS_SHORTCUT = [
  { year: 2027, month: 1, label: 'Fev/27' },
  { year: 2027, month: 2, label: 'Mar/27' },
  { year: 2027, month: 3, label: 'Abr/27' },
  { year: 2027, month: 4, label: 'Mai/27' },
  { year: 2027, month: 5, label: 'Jun/27' },
  { year: 2027, month: 6, label: 'Jul/27' },
  { year: 2027, month: 7, label: 'Ago/27' },
  { year: 2027, month: 8, label: 'Set/27' },
  { year: 2027, month: 9, label: 'Out/27' },
];

// Programação realista das aulas presenciais por sábado (200h • 11 módulos)
const SPECIAL_SATURDAY_EVENTS = {
  '2027-02-13': {
    status: 'agendada',
    titulo: 'Aula Inaugural',
    subtitulo: 'Apresentação do curso e cronograma',
    detalhe: 'Aula Inaugural – Curso de Socorrista APH 200h',
    horario: '13h30 – 17h30',
  },
  '2027-02-20': {
    status: 'realizada',
    titulo: 'Suporte Básico de Vida (SBV)',
    subtitulo: 'Reconhecimento e condutas iniciais',
    detalhe: 'Suporte Básico de Vida (SBV) — Módulo 01/04',
    horario: '13h30 – 17h30',
  },
  '2027-02-27': {
    status: 'realizada',
    titulo: 'Avaliação Teórica (Módulo 1)',
    subtitulo: 'Conteúdo inicial e primeiros socorros',
    detalhe: 'Avaliação Teórica (Módulo 1) — Introdução ao APH e Legislação',
    horario: '13h30 – 17h30',
  },
  '2027-03-06': {
    status: 'realizada',
    titulo: 'Anatomia e Fisiologia Humana',
    subtitulo: 'Sistemas cardiorrespiratório e nervoso',
    detalhe: 'Módulo 02 — Anatomia e Fisiologia Aplicada ao APH',
    horario: '13h30 – 17h30',
  },
  '2027-03-13': {
    status: 'reposicao',
    titulo: 'Aula de Reposição — Vias Aéreas',
    subtitulo: 'Prática assistida e revisão de conteúdo',
    detalhe: 'Aula de Reposição — Vias Aéreas e Ventilação (Unicesumar)',
    horario: '13h30 – 17h30',
  },
  '2027-03-20': {
    status: 'realizada',
    titulo: 'Avaliação da Vítima (XABCDE)',
    subtitulo: 'Avaliação primária e sinais vitais',
    detalhe: 'Módulo 03 — Protocolo XABCDE e Sinais Vitais',
    horario: '13h30 – 17h30',
  },
  '2027-03-27': {
    status: 'agendada',
    titulo: 'Escala de Glasgow e Triagem',
    subtitulo: 'Sinais vitais e conduta de cena',
    detalhe: 'Módulo 03 — Prática de Glasgow e Avaliação Secundária',
    horario: '13h30 – 17h30',
  },
  '2027-04-03': {
    status: 'realizada',
    titulo: 'Suporte Básico de Vida (SBV)',
    subtitulo: 'Reconhecimento da PCR e condutas',
    detalhe: 'Módulo 04 — Suporte Básico de Vida (SBV)',
    horario: '13h30 – 17h30',
  },
  '2027-04-10': {
    status: 'realizada',
    titulo: 'RCP de Alta Qualidade (30:2)',
    subtitulo: 'Prática em manequins e ritmo 100–120',
    detalhe: 'Módulo 04 — Prática de RCP em Adultos e Crianças',
    horario: '13h30 – 17h30',
  },
  '2027-04-17': {
    status: 'agendada',
    titulo: 'Operação do DEA e OVACE',
    subtitulo: 'Desfibrilador e manobra de Heimlich',
    detalhe: 'Módulo 04 — Desfibrilador (DEA) e Desobstrução de Vias Aéreas',
    horario: '13h30 – 17h30',
  },
  '2027-04-24': {
    status: 'agendada',
    titulo: 'Prática Avaliativa de SBV',
    subtitulo: 'Simulação em equipe supervisionada',
    detalhe: 'Módulo 04 — Simulação Supervisionada de Suporte Básico de Vida',
    horario: '13h30 – 17h30',
  },
  '2027-07-24': {
    status: 'agendada',
    titulo: 'Prática de Traumatismos e Prancha',
    subtitulo: 'Imobilização, colar cervical e rolamento',
    detalhe: 'Prática Avaliativa — Traumatismos, Prancha Rígida e Colar Cervical',
    horario: '13h30 – 17h30',
  },
  '2027-10-16': {
    status: 'agendada',
    titulo: 'Simulação Final e Formatura',
    subtitulo: 'Avaliação prática integrada e entrega 200h',
    detalhe: 'Simulação Realística Final, Avaliação e Encerramento da Turma 200h',
    horario: '13h30 – 17h30',
  },
};

const MONTHLY_TOPICS = {
  1: ['Introdução ao APH e Legislação', 'Anatomia e Fisiologia Humana', 'Avaliação Inicial'],
  2: ['Anatomia e Fisiologia Humana', 'Avaliação da Vítima (XABCDE)', 'Sinais Vitais e Glasgow'],
  3: ['Suporte Básico de Vida (SBV)', 'RCP de Alta Qualidade (30:2)', 'Operação do DEA e OVACE'],
  4: ['Vias Aéreas e Ventilação', 'Oxigenoterapia e Ambu', 'Manejo Prático de Vias Aéreas'],
  5: ['Hemorragias e Choque', 'Torniquete Tático e Curativos', 'Prática Stop The Bleed'],
  6: ['Traumatismos e Fraturas', 'Colar Cervical e Prancha Rígida', 'Imobilizações em Equipe'],
  7: ['Urgências Clínicas (IAM e AVC)', 'Convulsões e Intoxicações', 'Emergências Pediátricas'],
  8: ['Desengasgo e RCP Pediátrica', 'Resgate e Chave de Rautek', 'Transporte Seguro de Vítimas'],
  9: ['Revisão Integrada XABCDE', 'Simulações Realísticas', 'Encerramento da Turma 200h'],
};

export function isMonthInCourseWindow(year, month) {
  return year === 2027 && month >= 1 && month <= 9;
}

export function formatDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function getFirstClassDayInMonth(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d += 1) {
    const dt = new Date(year, month, d);
    if (dt >= COURSE_START && dt <= COURSE_END && dt.getDay() === 6) {
      return d;
    }
  }
  return 1;
}

function getCourseEventForDate(year, month, day) {
  const dt = new Date(year, month, day);
  if (dt < COURSE_START || dt > COURSE_END) return null;

  const key = formatDateKey(year, month, day);
  if (SPECIAL_SATURDAY_EVENTS[key]) {
    return {
      ...SPECIAL_SATURDAY_EVENTS[key],
      day,
      month,
      year,
      key,
    };
  }

  if (dt.getDay() === 6) {
    const weekIdx = Math.floor((day - 1) / 7);
    const topics = MONTHLY_TOPICS[month] || ['Aula Presencial — Socorrista APH 200h'];
    const titulo = topics[weekIdx % topics.length];
    return {
      status: month <= 3 && weekIdx < 2 ? 'realizada' : 'agendada',
      titulo,
      subtitulo: 'Aula teórica e prática presencial',
      detalhe: `${titulo} – Curso de Socorrista APH 200h`,
      horario: '13h30 – 17h30',
      day,
      month,
      year,
      key,
    };
  }

  return null;
}

export default function GlassCourseCalendar({
  calYear,
  calMonth,
  selectedDateKey,
  onPrevMonth,
  onNextMonth,
  onJumpToMonth,
  onSelectDate,
}) {
  const inCourseWindow = isMonthInCourseWindow(calYear, calMonth);
  const firstWeekdayOfMonth = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const [selY, selM, selD] = selectedDateKey.split('-').map(Number);
  const selectedDayEvent = getCourseEventForDate(selY, selM - 1, selD);

  // Lista das aulas do mês visualizado (exibe 3 cards limpos igual à referência para alinhar 1:1 com a grade!)
  const allMonthClasses = useMemo(() => {
    const list = [];
    for (let d = 1; d <= daysInMonth; d += 1) {
      const ev = getCourseEventForDate(calYear, calMonth, d);
      if (ev) list.push(ev);
    }
    if (list.length > 0) return list;

    return [
      getCourseEventForDate(2027, 1, 13),
      getCourseEventForDate(2027, 1, 20),
      getCourseEventForDate(2027, 1, 27),
    ].filter(Boolean);
  }, [calYear, calMonth, daysInMonth]);

  // Mantém os 3 cards visíveis sem esticar a altura e deixar buraco vazio embaixo do calendário!
  const visibleClasses = useMemo(() => {
    if (allMonthClasses.length <= 3) return allMonthClasses;
    const selIdx = allMonthClasses.findIndex((c) => c.key === selectedDateKey);
    if (selIdx >= 3) {
      return [allMonthClasses[0], allMonthClasses[1], allMonthClasses[selIdx]];
    }
    return allMonthClasses.slice(0, 3);
  }, [allMonthClasses, selectedDateKey]);

  const panelClass = inCourseWindow ? 'glass-cal-panel' : 'glass-cal-panel-neutral';

  return (
    <div
      className={`rounded-[28px] overflow-hidden transition-all duration-300 backdrop-blur-2xl ${
        inCourseWindow ? 'glass-cal-frame' : 'glass-cal-frame-neutral'
      }`}
    >
      {/* Linha sutil de reflexo no topo do vidro */}
      <div className="pointer-events-none absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/45 to-transparent" />

      {/* =================================================================
          TOPO LIMPO + LINHA NEON DE DIVISÃO
      ================================================================= */}
      <div className={inCourseWindow ? 'glass-cal-header-wash' : ''}>
        <div className="px-4 sm:px-6 pt-5 pb-4 grid grid-cols-1 md:grid-cols-[1.45fr_1fr_0.75fr] gap-4 items-center">
          <div className="flex items-center justify-center md:justify-start text-center md:text-left gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl glass-cal-day-red flex items-center justify-center shrink-0">
              <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow" />
            </div>
            <div className="text-left">
              <h2 className="font-display font-extrabold text-lg sm:text-2xl text-white leading-tight tracking-tight drop-shadow">
                Calendário da Turma
              </h2>
              <p className="text-[11px] sm:text-sm text-white/80 mt-0.5">
                Aulas presenciais na Unicesumar – Sábados (tarde)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:contents gap-2.5 pt-2 md:pt-0 border-t border-white/10 md:border-t-0">
            <div className="flex items-center justify-center md:justify-start gap-2.5 md:border-l md:border-white/20 md:pl-4 bg-white/[0.03] md:bg-transparent rounded-xl p-2.5 md:p-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#ED101C]/20 border border-[#FF5A65]/50 text-[#FF4D58] flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(237,16,28,0.35)]">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 text-left">
                <span className="block text-[10px] sm:text-[11px] text-white/65 font-medium">
                  Mês do Curso
                </span>
                <strong className="text-xs sm:text-base font-extrabold text-white tracking-tight block truncate">
                  Fev/27 – Out/27
                </strong>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2.5 md:border-l md:border-white/20 md:pl-4 bg-white/[0.03] md:bg-transparent rounded-xl p-2.5 md:p-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#ED101C]/20 border border-[#FF5A65]/50 text-[#FF4D58] flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(237,16,28,0.35)]">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 text-left">
                <span className="block text-[10px] sm:text-[11px] text-white/65 font-medium">
                  Carga Horária
                </span>
                <strong className="text-xs sm:text-base font-extrabold text-white block">
                  200 horas
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Linha Laser Neon Vermelha abaixo do Cabeçalho */}
      <div className={inCourseWindow ? 'glass-cal-neon-divider' : 'h-px bg-white/15'} />

      {/* CONTEÚDO INTERNO */}
      <div className="relative z-10 p-3.5 sm:p-6 space-y-4">
        {/* Atalhos Rápidos de Vidro para os 8 Meses do Curso + Hoje (swipe fluido no mobile!) */}
        <div className="flex sm:flex-wrap items-center gap-1.5 overflow-x-auto sm:overflow-visible no-scrollbar pb-0.5">
          <button
            type="button"
            onClick={() => {
              const now = new Date();
              onJumpToMonth(now.getFullYear(), now.getMonth(), now.getDate());
            }}
            className="px-3 py-1.5 rounded-xl glass-cal-day text-[11px] font-bold text-white/95 transition-all shrink-0"
          >
            Hoje
          </button>
          {COURSE_MONTHS_SHORTCUT.map((item) => {
            const active = calYear === item.year && calMonth === item.month;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() =>
                  onJumpToMonth(item.year, item.month, getFirstClassDayInMonth(item.year, item.month))
                }
                className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-all shrink-0 ${
                  active
                    ? 'glass-cal-day-red text-white'
                    : 'bg-white/[0.04] hover:bg-white/[0.1] border border-[#FF5A65]/35 text-[#FF8C93] hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          {!inCourseWindow && (
            <span className="hidden sm:inline ml-auto text-[11px] font-mono text-white/60">
              Fora dos 8 meses do curso (clique em Fev/27 a Out/27)
            </span>
          )}
        </div>

        {/* =================================================================
            CORPO EM 2 COLUNAS EQUILIBRADAS (ZERO ESPAÇO VAZIO EMBAIXO!)
        ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.95fr] gap-4 items-stretch">
          {/* PAINEL ESQUERDO — GRADE MENSAL DE VIDRO (INTERIOR 100% LIMPO + LUZ NA BORDA) */}
          <div className={`${panelClass} rounded-2xl p-3 sm:p-5 flex flex-col justify-between`}>
            {/* Navegação do Mês */}
            <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-4">
              <button
                type="button"
                onClick={onPrevMonth}
                aria-label="Mês anterior"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl glass-cal-day text-white flex items-center justify-center transition-all shrink-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="text-center min-w-0">
                <div className="inline-flex items-center justify-center gap-1.5 sm:gap-2">
                  <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF3B47] shrink-0 drop-shadow-[0_0_8px_rgba(237,16,28,0.8)]" />
                  <strong className="font-display font-extrabold text-base sm:text-2xl text-white tracking-tight truncate">
                    {MONTH_NAMES_PT[calMonth]} {calYear}
                  </strong>
                </div>
                <span
                  className={`block text-[11px] sm:text-sm font-bold mt-0.5 ${
                    inCourseWindow
                      ? 'text-[#FF414D] drop-shadow-[0_0_10px_rgba(237,16,28,0.55)]'
                      : 'text-white/55'
                  }`}
                >
                  {inCourseWindow
                    ? 'Aulas presenciais aos Sábados'
                    : 'Navegação livre • Sem aulas presenciais'}
                </span>
              </div>

              <button
                type="button"
                onClick={onNextMonth}
                aria-label="Próximo mês"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl glass-cal-day text-white flex items-center justify-center transition-all shrink-0"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Cabeçalho Dias da Semana */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[11px] sm:text-sm font-bold text-white/80 mb-2">
              <span>Dom</span>
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span>Sex</span>
              <span className={inCourseWindow ? 'text-[#FF3D49]' : 'text-white/80'}>Sáb</span>
            </div>

            {/* Grade de Dias 3D Vidro (Perfeita de 360px até 4K sem cortar nenhum ícone/número!) */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center flex-1 content-start">
              {Array.from({ length: firstWeekdayOfMonth }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-11 sm:h-[50px]" />
              ))}

              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const key = formatDateKey(calYear, calMonth, day);
                const ev = getCourseEventForDate(calYear, calMonth, day);
                const isSel = selectedDateKey === key;

                const statusClass =
                  ev?.status === 'agendada'
                    ? 'glass-cal-day-red text-white'
                    : ev?.status === 'realizada'
                    ? 'glass-cal-day-green text-white'
                    : ev?.status === 'reposicao'
                    ? 'glass-cal-day-amber text-white'
                    : 'glass-cal-day text-white/90';

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onSelectDate(key)}
                    className={`h-11 sm:h-[50px] rounded-xl font-extrabold text-xs sm:text-base flex flex-col sm:flex-row items-center justify-center gap-0 sm:gap-1 leading-none transition-all duration-150 ${statusClass} ${
                      isSel
                        ? 'ring-2 ring-white ring-offset-1 sm:ring-offset-2 ring-offset-[#0D0C12] scale-[1.03]'
                        : ''
                    }`}
                  >
                    <span>{day}</span>
                    {ev?.status === 'agendada' && (
                      <Users className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 shrink-0 mt-0.5 sm:mt-0" />
                    )}
                    {ev?.status === 'realizada' && (
                      <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 stroke-[3] shrink-0 mt-0.5 sm:mt-0" />
                    )}
                    {ev?.status === 'reposicao' && (
                      <CalendarClock className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 shrink-0 mt-0.5 sm:mt-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PAINEL DIREITO — PRÓXIMAS AULAS (3 CARDS EQUILIBRADOS) + LEGENDA */}
          <div className="flex flex-col justify-between gap-4">
            {/* Card 1: Próximas Aulas */}
            <div className={`${panelClass} rounded-2xl p-4 space-y-2.5 flex-1`}>
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-[#FF3B47]" />
                  <h3 className="font-display font-extrabold text-base text-white">
                    {inCourseWindow ? 'Próximas Aulas' : 'Aulas da Turma (2027)'}
                  </h3>
                </div>
                {allMonthClasses.length > 3 && (
                  <span className="text-[10px] font-mono text-white/60">
                    {allMonthClasses.length} sábados no mês
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {visibleClasses.map((ev) => {
                  const isSel = selectedDateKey === ev.key;
                  const badgeClass =
                    ev.status === 'agendada'
                      ? 'glass-cal-day-red'
                      : ev.status === 'realizada'
                      ? 'glass-cal-day-green'
                      : 'glass-cal-day-amber';

                  const activeCardClass =
                    ev.status === 'realizada'
                      ? 'glass-cal-event-active-green'
                      : ev.status === 'reposicao'
                      ? 'glass-cal-event-active-amber'
                      : 'glass-cal-event-active-red';

                  return (
                    <button
                      key={ev.key}
                      type="button"
                      onClick={() => onJumpToMonth(ev.year, ev.month, ev.day)}
                      className={`w-full p-2.5 rounded-xl text-left flex items-center gap-3 transition-all ${
                        isSel
                          ? activeCardClass
                          : 'bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl text-white flex flex-col items-center justify-center shrink-0 leading-none ${badgeClass}`}
                      >
                        <strong className="text-base font-extrabold">{ev.day}</strong>
                        <span className="text-[10px] font-bold opacity-95 mt-0.5">
                          {MONTH_SHORT_PT[ev.month]}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <strong className="text-xs sm:text-sm font-extrabold text-white block truncate">
                          {ev.titulo}
                        </strong>
                        <span className="text-[11px] text-white/70 block truncate mt-0.5">
                          {ev.subtitulo}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-white/80 mt-1">
                          <Clock className="w-3 h-3 text-white/60" />
                          <span>{ev.horario}</span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Card 2: Legenda 2x2 Vidro */}
            <div className={`${panelClass} rounded-2xl p-4 space-y-2.5`}>
              <div className="flex items-center gap-2 pb-2 border-b border-white/15">
                <CalendarClock className="w-4 h-4 text-[#FF3B47]" />
                <h3 className="font-display font-extrabold text-sm sm:text-base text-white">
                  Legenda
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold text-white/90">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg glass-cal-day-red flex items-center justify-center shrink-0">
                    <Users className="w-3.5 h-3.5 text-white" />
                  </span>
                  <span>Aula agendada</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg glass-cal-day-green flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                  </span>
                  <span>Aula realizada</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg glass-cal-day-amber flex items-center justify-center shrink-0">
                    <CalendarClock className="w-3.5 h-3.5 text-white" />
                  </span>
                  <span>Aula de reposição</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg glass-cal-day shrink-0" />
                  <span>Sem aula</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================
            FAIXA INFERIOR LIMPA COM BORDA ILUMINADA (DETALHE DO DIA)
        ================================================================= */}
        <div
          className={`${
            inCourseWindow ? 'glass-cal-bottom-bar' : 'glass-cal-panel-neutral'
          } rounded-2xl px-4 sm:px-5 py-3.5 flex items-center gap-3.5`}
        >
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
              selectedDayEvent?.status === 'realizada'
                ? 'glass-cal-day-green'
                : selectedDayEvent?.status === 'reposicao'
                ? 'glass-cal-day-amber'
                : 'glass-cal-day-red'
            }`}
          >
            <Info className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm sm:text-base font-bold text-white leading-snug">
              <span
                className={`font-mono mr-1.5 ${
                  selectedDayEvent?.status === 'realizada'
                    ? 'text-emerald-400'
                    : selectedDayEvent?.status === 'reposicao'
                    ? 'text-amber-300'
                    : 'text-[#FF4B57]'
                }`}
              >
                {String(selD).padStart(2, '0')}/{String(selM).padStart(2, '0')}/{selY}:
              </span>
              <span>
                {selectedDayEvent
                  ? selectedDayEvent.detalhe
                  : 'Sem aula presencial agendada nesta data.'}
              </span>
            </p>
            <p className="text-xs text-white/75 mt-0.5">
              <strong className="text-white/95">Local:</strong> Prédio da Unicesumar
              <span className="mx-2 text-white/30">|</span>
              <strong className="text-white/95">Horário:</strong>{' '}
              {selectedDayEvent
                ? `Sábado (tarde) • ${selectedDayEvent.horario}`
                : 'Sábado (tarde)'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
