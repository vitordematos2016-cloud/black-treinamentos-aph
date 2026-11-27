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
  Lock,
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

const COURSE_START = new Date(2027, 1, 13); // 13/02/2027 (Sábado verdadeiro)
const COURSE_END = new Date(2027, 9, 16);   // 16/10/2027 (Sábado verdadeiro)

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

// Programação realista das aulas presenciais por sábado verdadeiro de 2027 (200h • 11 módulos)
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

export function getCourseEventForDate(year, month, day) {
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

/**
 * Cabeçalho 3D oficial BLACK Treinamentos — Argolas metálicas, Estrela da Vida,
 * Logo BLACK, Ambulância com giroflex e Faixa Vermelha de Mês | Ano.
 */
function Black3DCalendarTop({
  monthName,
  year,
  onPrev,
  onNext,
  disablePrev = false,
  disableNext = false,
  compact = false,
}) {
  return (
    <div className="relative">
      {/* Par de argolas metálicas 3D presas em ilhós no topo do cartão */}
      <div
        className={`pointer-events-none absolute -top-3.5 left-0 right-0 flex justify-around z-20 ${
          compact ? 'px-12' : 'px-14 sm:px-20'
        }`}
        aria-hidden="true"
      >
        {[0, 1].map((idx) => (
          <div key={idx} className="relative flex flex-col items-center">
            <div className="cal3d-ring -mb-2.5 z-10" />
            <div className="cal3d-eyelet" />
          </div>
        ))}
      </div>

      {/* Área Superior BLACK Art (Estrela da Vida + Logo BLACK + Ambulância limpa na direita) */}
      <div
        className={`cal3d-top-art flex items-center justify-between gap-2 ${
          compact ? 'px-3.5 pt-6 pb-3 min-h-[76px]' : 'px-4 sm:px-6 pt-7 pb-4 min-h-[96px] sm:min-h-[112px]'
        }`}
      >
        {/* Listras diagonais vermelhas no canto superior esquerdo */}
        <div
          className="pointer-events-none absolute -top-2 left-2 flex gap-1.5 -skew-x-[28deg] opacity-85 z-10"
          aria-hidden="true"
        >
          <span className="w-2.5 h-16 bg-gradient-to-b from-[#ED101C] to-transparent block" />
          <span className="w-1.5 h-14 bg-gradient-to-b from-[#FF4D58]/70 to-transparent block" />
        </div>

        {/* Direita (camada integrada): Frente da Ambulância BLACK com giroflex vermelho aceso, zero texto */}
        <div
          className={`pointer-events-none absolute right-0 top-0 bottom-0 overflow-hidden ${
            compact ? 'w-[44%]' : 'w-[44%] sm:w-[42%]'
          }`}
          aria-hidden="true"
        >
          <img
            src="/assets/calendario-ambulancia-frente.jpg"
            alt=""
            className="w-full h-full object-cover object-[76%_46%] mix-blend-lighten opacity-95"
            style={{
              WebkitMaskImage:
                'linear-gradient(to left, rgba(0,0,0,1) 48%, rgba(0,0,0,0.45) 78%, transparent 100%)',
              maskImage:
                'linear-gradient(to left, rgba(0,0,0,1) 48%, rgba(0,0,0,0.45) 78%, transparent 100%)',
            }}
          />
        </div>

        {/* Esquerda: Estrela da Vida Vermelha com fusão radial limpa */}
        <div className="relative z-10 flex items-center shrink-0 pl-1 sm:pl-2">
          <img
            src="/assets/simbolo-estrela-da-vida-cobra.png"
            alt="Estrela da Vida APH"
            className={`object-contain mix-blend-screen drop-shadow-[0_0_12px_rgba(237,16,28,0.85)] ${
              compact ? 'w-10 h-10' : 'w-12 h-12 sm:w-16 sm:h-16'
            }`}
            style={{
              WebkitMaskImage: 'radial-gradient(circle, rgba(0,0,0,1) 54%, transparent 82%)',
              maskImage: 'radial-gradient(circle, rgba(0,0,0,1) 54%, transparent 82%)',
            }}
          />
        </div>

        {/* Centro: Logo Oficial BLACK Treinamentos — Resgate & APH */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-1">
          <img
            src="/assets/logo-header-sharp.png"
            alt="BLACK Treinamentos — Resgate & APH"
            className={`object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] ${
              compact ? 'h-9 sm:h-10' : 'h-11 sm:h-14'
            }`}
          />
        </div>

        {/* Espaçador direito para manter o logo perfeitamente centralizado em equilíbrio com a ambulância */}
        <div className={compact ? 'w-12 sm:w-16 shrink-0' : 'w-14 sm:w-24 shrink-0'} aria-hidden="true" />
      </div>

      {/* Faixa Metálica Vermelha: <   MÊS  |  ANO   > */}
      <div
        className={`cal3d-month-band flex items-center justify-between gap-2 overflow-hidden ${
          compact ? 'px-3 py-2' : 'px-4 sm:px-5 py-2.5'
        }`}
      >
        {/* Detalhes diagonais nas laterais */}
        <div
          className="pointer-events-none absolute left-2 inset-y-0 flex items-center gap-1 -skew-x-[25deg] opacity-30"
          aria-hidden="true"
        >
          <span className="w-2 h-full bg-black/45 block" />
          <span className="w-1.5 h-full bg-black/35 block" />
        </div>
        <div
          className="pointer-events-none absolute right-2 inset-y-0 flex items-center gap-1 -skew-x-[25deg] opacity-30"
          aria-hidden="true"
        >
          <span className="w-1.5 h-full bg-black/35 block" />
          <span className="w-2 h-full bg-black/45 block" />
        </div>

        <button
          type="button"
          onClick={onPrev}
          disabled={disablePrev}
          aria-label="Mês anterior"
          className={`relative z-10 rounded-xl bg-black/30 hover:bg-black/50 border border-white/25 text-white flex items-center justify-center transition-all shrink-0 disabled:opacity-30 disabled:cursor-not-allowed ${
            compact ? 'w-7 h-7' : 'w-8 h-8 sm:w-9 sm:h-9'
          }`}
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="relative z-10 flex items-center justify-center gap-2.5 sm:gap-3.5 min-w-0">
          <strong
            className={`font-display font-black uppercase tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)] truncate ${
              compact ? 'text-sm sm:text-base' : 'text-base sm:text-xl'
            }`}
          >
            {monthName}
          </strong>
          <span className="h-4 sm:h-5 w-[1.5px] bg-white/45 shrink-0" aria-hidden="true" />
          <span
            className={`font-display font-extrabold text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] ${
              compact ? 'text-sm sm:text-base' : 'text-base sm:text-xl'
            }`}
          >
            {year}
          </span>
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={disableNext}
          aria-label="Próximo mês"
          className={`relative z-10 rounded-xl bg-black/30 hover:bg-black/50 border border-white/25 text-white flex items-center justify-center transition-all shrink-0 disabled:opacity-30 disabled:cursor-not-allowed ${
            compact ? 'w-7 h-7' : 'w-8 h-8 sm:w-9 sm:h-9'
          }`}
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}

/**
 * Barra inferior ECG idêntica à referência: 3 barras diagonais vermelhas nos cantos + linha de pulso cardíaco neon no centro.
 */
function Black3DCalendarFooterBar({ compact = false }) {
  return (
    <div
      className={`flex items-center justify-between gap-2 select-none ${
        compact ? 'px-3.5 pt-1 pb-3' : 'px-5 pt-2 pb-4'
      }`}
      aria-hidden="true"
    >
      {/* 3 Barras diagonais esquerdas */}
      <div className="flex items-center gap-1 -skew-x-[25deg] shrink-0">
        <span className="w-2 h-2.5 bg-[#6E050B] rounded-[2px]" />
        <span className="w-2.5 h-2.5 bg-[#B30812] rounded-[2px]" />
        <span className="w-3 h-2.5 bg-[#ED101C] rounded-[2px] shadow-[0_0_8px_rgba(237,16,28,0.8)]" />
      </div>

      {/* Pulso ECG Vermelho Neon Central com traço correndo dentro das dobras */}
      <div className="relative flex-1 max-w-[230px] flex items-center">
        <svg
          viewBox="0 0 260 28"
          className={`w-full overflow-visible ${compact ? 'h-4' : 'h-5 sm:h-6'}`}
        >
          <defs>
            <linearGradient id="blackCalEcgLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ED101C" stopOpacity="0.08" />
              <stop offset="30%" stopColor="#ED101C" stopOpacity="0.72" />
              <stop offset="50%" stopColor="#FF6B74" stopOpacity="1" />
              <stop offset="70%" stopColor="#ED101C" stopOpacity="0.72" />
              <stop offset="100%" stopColor="#ED101C" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <path
            d="M 0 15 L 98 15 L 106 15 L 111 11 L 116 18 L 122 15 L 126 15 L 130 3 L 135 26 L 140 12 L 145 16 L 152 15 L 260 15"
            fill="none"
            stroke="url(#blackCalEcgLine)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 0 6px rgba(237,16,28,0.9))' }}
          />
          <path
            d="M 0 15 L 98 15 L 106 15 L 111 11 L 116 18 L 122 15 L 126 15 L 130 3 L 135 26 L 140 12 L 145 16 L 152 15 L 260 15"
            pathLength="100"
            fill="none"
            stroke="#FF3B47"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="black-ecg-trace-tail"
            style={{ filter: 'drop-shadow(0 0 8px rgba(255,48,62,0.95))' }}
          />
          <path
            d="M 0 15 L 98 15 L 106 15 L 111 11 L 116 18 L 122 15 L 126 15 L 130 3 L 135 26 L 140 12 L 145 16 L 152 15 L 260 15"
            pathLength="100"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="black-ecg-trace-spark"
            style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.95))' }}
          />
        </svg>
      </div>

      {/* 3 Barras diagonais direitas */}
      <div className="flex items-center gap-1 -skew-x-[25deg] shrink-0">
        <span className="w-3 h-2.5 bg-[#ED101C] rounded-[2px] shadow-[0_0_8px_rgba(237,16,28,0.8)]" />
        <span className="w-2.5 h-2.5 bg-[#B30812] rounded-[2px]" />
        <span className="w-2 h-2.5 bg-[#6E050B] rounded-[2px]" />
      </div>
    </div>
  );
}

/**
 * Seletor de Data 3D BLACK usado no formulário de Justificativa de Falta / Atestado.
 * Bloqueia estritamente os dias sem aula (permite apenas sábados verdadeiros do curso).
 */
export function Justify3DDatePicker({
  value,
  pickerYear,
  pickerMonth,
  onChangeMonth,
  onSelectDate,
  onClose,
}) {
  const firstWeekday = new Date(pickerYear, pickerMonth, 1).getDay();
  const totalDays = new Date(pickerYear, pickerMonth + 1, 0).getDate();
  const currentMonthIdx = COURSE_MONTHS_SHORTCUT.findIndex(
    (m) => m.year === pickerYear && m.month === pickerMonth
  );

  const handleStepMonth = (delta) => {
    const safeIdx = currentMonthIdx === -1 ? 0 : currentMonthIdx;
    const next = COURSE_MONTHS_SHORTCUT[safeIdx + delta];
    if (next) {
      onChangeMonth(next.year, next.month);
    }
  };

  return (
    <div className="pt-2 pb-1 space-y-3">
      {/* Atalhos rápidos dos 9 meses reais do curso */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {COURSE_MONTHS_SHORTCUT.map((m) => {
            const active = pickerYear === m.year && pickerMonth === m.month;
            return (
              <button
                key={m.label}
                type="button"
                onClick={() => onChangeMonth(m.year, m.month)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold shrink-0 transition-all ${
                  active
                    ? 'glass-cal-day-red text-white'
                    : 'bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white/75 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-[11px] font-bold text-white/65 hover:text-white shrink-0"
        >
          Recolher
        </button>
      </div>

      {/* Réplica 3D BLACK compacta */}
      <div className="cal3d-card mt-6 max-w-md mx-auto">
        <Black3DCalendarTop
          monthName={MONTH_NAMES_PT[pickerMonth]}
          year={pickerYear}
          onPrev={() => handleStepMonth(-1)}
          onNext={() => handleStepMonth(1)}
          disablePrev={currentMonthIdx <= 0}
          disableNext={currentMonthIdx >= COURSE_MONTHS_SHORTCUT.length - 1}
          compact
        />

        <div className="p-3 sm:p-4">
          <div className="grid grid-cols-7 gap-1 text-center items-center text-[10px] font-extrabold uppercase tracking-wider mb-2">
            <span className="cal3d-sun-pill text-white rounded-full py-0.5 px-1 mx-auto w-full max-w-[42px]">
              Dom
            </span>
            <span className="text-white/80">Seg</span>
            <span className="text-white/80">Ter</span>
            <span className="text-white/80">Qua</span>
            <span className="text-white/80">Qui</span>
            <span className="text-white/80">Sex</span>
            <span className="text-[#FF525D]">Sáb</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {Array.from({ length: firstWeekday }).map((_, i) => (
              <div key={`empty-j-${i}`} className="h-9 sm:h-10" />
            ))}

            {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
              const isoKey = formatDateKey(pickerYear, pickerMonth, day);
              const ev = getCourseEventForDate(pickerYear, pickerMonth, day);
              const isSelected = value === isoKey;
              const isAllowed = Boolean(ev);

              if (!isAllowed) {
                return (
                  <button
                    key={isoKey}
                    type="button"
                    disabled
                    aria-disabled="true"
                    title="Sem aula presencial nesta data"
                    className="h-9 sm:h-10 rounded-xl font-bold text-xs flex items-center justify-center cal3d-day-disabled select-none"
                  >
                    {day}
                  </button>
                );
              }

              const tileClass =
                ev.status === 'realizada'
                  ? 'glass-cal-day-green text-white'
                  : ev.status === 'reposicao'
                  ? 'glass-cal-day-amber text-white'
                  : 'glass-cal-day-red text-white';

              return (
                <button
                  key={isoKey}
                  type="button"
                  onClick={() => onSelectDate(isoKey)}
                  title={`${ev.titulo} • ${ev.horario}`}
                  className={`h-9 sm:h-10 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-0.5 transition-all ${tileClass} ${
                    isSelected
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-[#090A0E] scale-[1.06]'
                      : 'hover:scale-[1.04]'
                  }`}
                >
                  <span>{day}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between gap-2 text-[11px] text-white/60">
            <span className="inline-flex items-center gap-1 font-semibold">
              <Lock className="w-3 h-3 text-[#FF4D58]" />
              Somente sábados letivos habilitados
            </span>
            <span className="font-mono font-bold text-white/85">Fev/27 – Out/27</span>
          </div>
        </div>

        <Black3DCalendarFooterBar compact />
      </div>
    </div>
  );
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

  // Lista das aulas verdadeiras do mês visualizado
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
      {/* Linha sutil de reflexo no topo */}
      <div className="pointer-events-none absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/45 to-transparent" />

      {/* =================================================================
          CABEÇALHO DA TURMA
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
            <div className="flex items-center justify-center md:justify-start gap-2.5 md:border-l md:border-white/20 md:pl-4 bg-white/[0.04] md:bg-transparent rounded-xl p-2.5 md:p-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#ED101C]/25 border border-[#FF5A65]/60 text-[#FF5E68] flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(237,16,28,0.35)]">
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

            <div className="flex items-center justify-center md:justify-start gap-2.5 md:border-l md:border-white/20 md:pl-4 bg-white/[0.04] md:bg-transparent rounded-xl p-2.5 md:p-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#ED101C]/25 border border-[#FF5A65]/60 text-[#FF5E68] flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(237,16,28,0.35)]">
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

      {/* Linha Laser Neon Vermelha */}
      <div className={inCourseWindow ? 'glass-cal-neon-divider' : 'h-px bg-white/15'} />

      {/* CONTEÚDO INTERNO */}
      <div className="relative z-10 p-3.5 sm:p-6 space-y-5">
        {/* Atalhos Rápidos dos Meses do Curso */}
        <div className="flex sm:flex-wrap items-center gap-1.5 overflow-x-auto sm:overflow-visible no-scrollbar pb-0.5">
          <button
            type="button"
            onClick={() => {
              const now = new Date();
              onJumpToMonth(now.getFullYear(), now.getMonth(), now.getDate());
            }}
            className="px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-[11px] font-bold text-white transition-all shrink-0"
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
                    : 'bg-white/[0.06] hover:bg-white/[0.12] border border-[#FF5A65]/40 text-[#FF9CA3] hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          {!inCourseWindow && (
            <span className="hidden sm:inline ml-auto text-[11px] font-mono text-white/60">
              Fora dos meses letivos (clique em Fev/27 a Out/27)
            </span>
          )}
        </div>

        {/* =================================================================
            CORPO EM 2 COLUNAS: RÉPLICA 3D BLACK + AULAS DA TURMA & LEGENDA
        ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.28fr_1fr] gap-5 items-stretch pt-5">
          {/* PAINEL ESQUERDO — RÉPLICA EXATA DO CALENDÁRIO 3D BLACK TREINAMENTOS */}
          <div className="cal3d-card flex flex-col justify-between">
            <Black3DCalendarTop
              monthName={MONTH_NAMES_PT[calMonth]}
              year={calYear}
              onPrev={onPrevMonth}
              onNext={onNextMonth}
            />

            <div className="px-3.5 sm:px-6 pt-4 pb-2 flex-1 flex flex-col justify-between">
              {/* Cabeçalho Dias da Semana com Pílula Vermelha em DOM */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center items-center text-[11px] sm:text-xs font-extrabold uppercase tracking-wider mb-3">
                <span className="cal3d-sun-pill text-white rounded-full py-1 px-1.5 mx-auto w-full max-w-[52px]">
                  Dom
                </span>
                <span className="text-white/85">Seg</span>
                <span className="text-white/85">Ter</span>
                <span className="text-white/85">Qua</span>
                <span className="text-white/85">Qui</span>
                <span className="text-white/85">Sex</span>
                <span className={inCourseWindow ? 'text-[#FF4B57]' : 'text-white/85'}>Sáb</span>
              </div>

              {/* Grade de Dias 100% Verdadeiros */}
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center flex-1 content-start">
                {Array.from({ length: firstWeekdayOfMonth }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="h-10 sm:h-11" />
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const key = formatDateKey(calYear, calMonth, day);
                  const ev = getCourseEventForDate(calYear, calMonth, day);
                  const isSel = selectedDateKey === key;
                  const weekday = new Date(calYear, calMonth, day).getDay();

                  const statusClass =
                    ev?.status === 'agendada'
                      ? 'glass-cal-day-red text-white'
                      : ev?.status === 'realizada'
                      ? 'glass-cal-day-green text-white'
                      : ev?.status === 'reposicao'
                      ? 'glass-cal-day-amber text-white'
                      : `cal3d-day-normal ${weekday === 0 ? '!text-[#FF1E2B]' : ''}`;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => onSelectDate(key)}
                      title={ev ? `${ev.titulo} (${ev.horario})` : undefined}
                      className={`h-10 sm:h-11 rounded-xl font-extrabold text-sm sm:text-base flex flex-col sm:flex-row items-center justify-center gap-0 sm:gap-1 leading-none transition-all duration-150 ${statusClass} ${
                        isSel
                          ? ev
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-[#090A0E] scale-[1.06]'
                            : '!bg-[#ED101C]/25 !border-[#FF5A65]/80 !text-white ring-1 ring-[#ED101C]/60'
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

            {/* Rodapé ECG + Barras Diagonais Vermelhas */}
            <Black3DCalendarFooterBar />
          </div>

          {/* PAINEL DIREITO — AULAS DA TURMA + LEGENDA */}
          <div className="flex flex-col justify-between gap-4">
            {/* Card 1: Aulas da Turma */}
            <div className={`${panelClass} rounded-2xl p-4 sm:p-5 space-y-3 flex-1`}>
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#ED101C]/20 border border-[#FF5A65]/50 flex items-center justify-center">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#FF5A65]" />
                  </span>
                  <h3 className="font-display font-bold text-sm sm:text-base text-white">
                    {inCourseWindow
                      ? `Aulas da Turma (${MONTH_SHORT_PT[calMonth]}/${calYear})`
                      : 'Aulas da Turma (2027)'}
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ED101C]/20 text-[#FF8C93] border border-[#ED101C]/35">
                  {allMonthClasses.length} aulas
                </span>
              </div>

              <div className="space-y-2.5">
                {visibleClasses.map((ev) => {
                  const isActive = ev.key === selectedDateKey;
                  const cardGlow = isActive
                    ? ev.status === 'realizada'
                      ? 'glass-cal-event-active-green'
                      : ev.status === 'reposicao'
                      ? 'glass-cal-event-active-amber'
                      : 'glass-cal-event-active-red'
                    : 'bg-white/[0.045] hover:bg-white/[0.09] border border-white/15 hover:border-white/25 hover:-translate-y-0.5';

                  const badgeClass =
                    ev.status === 'realizada'
                      ? 'glass-cal-day-green'
                      : ev.status === 'reposicao'
                      ? 'glass-cal-day-amber'
                      : 'glass-cal-day-red';

                  return (
                    <button
                      key={ev.key}
                      type="button"
                      onClick={() => onJumpToMonth(ev.year, ev.month, ev.day)}
                      className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center gap-3.5 ${cardGlow}`}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center shrink-0 text-white leading-none ${badgeClass}`}
                      >
                        <span className="text-base font-extrabold">{ev.day}</span>
                        <span className="text-[9px] font-bold uppercase mt-0.5 opacity-95">
                          {MONTH_SHORT_PT[ev.month]}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <strong className="text-sm font-bold text-white block truncate">
                          {ev.titulo}
                        </strong>
                        <span className="text-[11px] text-white/75 block truncate">
                          {ev.subtitulo}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/90 mt-0.5">
                          <Clock className="w-3 h-3 text-[#FF6B74]" />
                          {ev.horario}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Card 2: Legenda 2x2 */}
            <div className={`${panelClass} rounded-2xl p-4 sm:p-5 space-y-3`}>
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <span className="w-7 h-7 rounded-lg bg-[#ED101C]/20 border border-[#FF5A65]/50 flex items-center justify-center">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#FF5A65]" />
                </span>
                <h3 className="font-display font-bold text-sm sm:text-base text-white">
                  Legenda
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold text-white">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="w-7 h-7 rounded-lg glass-cal-day-red flex items-center justify-center shrink-0">
                    <Users className="w-3.5 h-3.5 text-white" />
                  </span>
                  <span>Aula agendada</span>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="w-7 h-7 rounded-lg glass-cal-day-green flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                  </span>
                  <span>Aula realizada</span>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="w-7 h-7 rounded-lg glass-cal-day-amber flex items-center justify-center shrink-0">
                    <CalendarClock className="w-3.5 h-3.5 text-white" />
                  </span>
                  <span>Aula de reposição</span>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="w-7 h-7 rounded-lg bg-[#12131A] border border-white/20 text-white font-extrabold text-[11px] flex items-center justify-center shrink-0">
                    15
                  </span>
                  <span>Sem aula</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================
            FAIXA INFERIOR DE DETALHE DO DIA SELECIONADO
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
                    : 'text-[#FF5A65]'
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
