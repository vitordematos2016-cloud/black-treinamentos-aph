import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  Copy,
  Download,
  Phone,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { getWhatsAppUrl } from '../data/blackData';

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

export function parseBrDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const parts = dateStr.split('/').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  const [day, month, year] = parts;
  return new Date(year, month - 1, day);
}

export function getDueInfo(dateStr, status) {
  const dueDate = parseBrDate(dateStr);
  if (!dueDate) {
    return {
      day: 10,
      month: 0,
      year: 2027,
      monthName: 'Mês',
      monthYearLabel: dateStr || '',
      diffDays: 0,
      isOverdue: status === 'atrasada',
      isToday: false,
      countdownLabel: 'Data a confirmar',
      shortCountdown: dateStr || '',
    };
  }

  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueMidnight = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  const diffDays = Math.round((dueMidnight.getTime() - todayMidnight.getTime()) / 86400000);

  const day = dueDate.getDate();
  const month = dueDate.getMonth();
  const year = dueDate.getFullYear();
  const monthName = MONTH_NAMES_PT[month];
  const monthYearLabel = `${monthName} de ${year}`;

  const isOverdue = status !== 'paga' && diffDays < 0;
  const isToday = status !== 'paga' && diffDays === 0;

  let countdownLabel;
  let shortCountdown;
  if (status === 'paga') {
    countdownLabel = 'Quitada';
    shortCountdown = 'Paga ✓';
  } else if (diffDays < 0) {
    const abs = Math.abs(diffDays);
    countdownLabel = abs === 1 ? 'Venceu há 1 dia' : `Venceu há ${abs} dias`;
    shortCountdown = `Atrasada (${abs}d)`;
  } else if (diffDays === 0) {
    countdownLabel = 'Vence hoje!';
    shortCountdown = 'Vence hoje';
  } else if (diffDays === 1) {
    countdownLabel = 'Vence amanhã (falta 1 dia)';
    shortCountdown = 'Falta 1 dia';
  } else {
    countdownLabel = `Vence em ${diffDays} dias`;
    shortCountdown = `Vence em ${diffDays} dias`;
  }

  return {
    day,
    month,
    year,
    monthName,
    monthYearLabel,
    diffDays,
    isOverdue,
    isToday,
    countdownLabel,
    shortCountdown,
  };
}

/**
 * Calendariozinho visual BLACK mostrando o mês do vencimento da parcela
 * e quantos dias faltam para vencer.
 */
function MiniDueDateCalendar({ dueInfo }) {
  const firstWeekday = new Date(dueInfo.year, dueInfo.month, 1).getDay();
  const daysInMonth = new Date(dueInfo.year, dueInfo.month + 1, 0).getDate();

  return (
    <div className="rounded-2xl bg-[#0B0C11] border border-[#ED101C]/40 overflow-hidden shadow-lg flex flex-col justify-between">
      {/* Cabeçalho centralizado em 1 linha limpa (sem quebra torta) */}
      <div className="px-3.5 py-2.5 bg-gradient-to-r from-[#6E050B] via-[#ED101C] to-[#6E050B] text-center shadow-[inset_0_1px_0_rgba(255,190,195,0.4)]">
        <div className="inline-flex items-center justify-center gap-2 text-white whitespace-nowrap">
          <CalendarIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="font-display font-black text-xs sm:text-sm uppercase tracking-wider">
            {dueInfo.monthName}
          </span>
          <span className="h-3.5 w-[1.5px] bg-white/45 shrink-0" aria-hidden="true" />
          <span className="font-display font-extrabold text-xs sm:text-sm">
            {dueInfo.year}
          </span>
        </div>
      </div>

      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="grid grid-cols-7 gap-1 text-center items-center text-[10px] font-extrabold uppercase text-white/55 mb-2">
            <span className="bg-[#ED101C]/85 text-white rounded-full py-0.5 leading-none">Dom</span>
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span className="text-white/80">Sáb</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] tabular-nums">
            {Array.from({ length: firstWeekday }).map((_, i) => (
              <div key={`due-empty-${i}`} className="h-7" />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
              const isDueDay = d === dueInfo.day;
              const isSunday = new Date(dueInfo.year, dueInfo.month, d).getDay() === 0;
              return (
                <div
                  key={d}
                  className={`h-7 w-full rounded-lg flex items-center justify-center font-bold leading-none ${
                    isDueDay
                      ? 'bg-[#ED101C] text-white font-black ring-2 ring-white/90 shadow-[0_0_12px_rgba(237,16,28,0.85)]'
                      : isSunday
                      ? 'text-[#FF3B47]'
                      : 'text-white/75'
                  }`}
                >
                  {d}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between gap-2 text-[11px]">
          <span className="font-semibold text-white/70">Vencimento dia {String(dueInfo.day).padStart(2, '0')}</span>
          <span className="font-mono font-bold text-[#FF6B74] whitespace-nowrap">
            {dueInfo.countdownLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function FinancePaymentModal({
  parcela,
  isCurrentFocus,
  studentName,
  onClose,
  onCopyPix,
  onOpenAttachment,
}) {
  const [confirmedFuturePay, setConfirmedFuturePay] = useState(false);

  useEffect(() => {
    setConfirmedFuturePay(false);
  }, [parcela?.numero]);

  if (!parcela) return null;

  const dueInfo = getDueInfo(parcela.vencimento, parcela.status);
  const valorTexto =
    parcela.valor ||
    ((parcela.valorCentavos || 20000) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  const hasBoleto = Boolean(
    parcela.boletoFileId || parcela.boletoDataUrl || parcela.boletoNome
  );

  // Se não está vencida (vence daqui a X dias), sempre protege contra confusão com parcela atrasada!
  const requiresAdvanceConfirmation = !dueInfo.isOverdue && dueInfo.diffDays > 0;
  const canProceedPayment = !requiresAdvanceConfirmation || confirmedFuturePay;

  return (
    <div
      className="fixed inset-0 z-[95] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl rounded-3xl bg-[#101219] border border-[#ED101C]/45 p-5 sm:p-6 space-y-4 shadow-[0_24px_65px_rgba(0,0,0,0.92)] my-auto">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF5A65]">
              {isCurrentFocus ? 'Parcela Atual em Foco' : 'Pagamento / Adiantamento'}
            </span>
            <h3 className="font-display font-extrabold text-xl text-white mt-0.5">
              Parcela {parcela.numero}/10 — {dueInfo.monthYearLabel}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-[#ED101C] text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Plaquinha de Vencimento + Resumo Financeiro alinhados em linha */}
        <div className="p-3.5 rounded-2xl bg-[#161923] border border-white/10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 border whitespace-nowrap ${
                dueInfo.isOverdue
                  ? 'bg-[#ED101C]/20 border-[#ED101C]/60 text-[#FF7A83]'
                  : 'bg-white/[0.06] border-white/15 text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-[#FF5A65] shrink-0" />
              <span>Vencimento: {parcela.vencimento}</span>
            </span>
            <span
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold whitespace-nowrap ${
                dueInfo.isOverdue
                  ? 'bg-[#ED101C] text-white'
                  : 'bg-[#ED101C]/15 text-[#FF8C93] border border-[#ED101C]/35'
              }`}
            >
              {dueInfo.countdownLabel}
            </span>
          </div>

          <strong className="font-display font-black text-xl sm:text-2xl text-white whitespace-nowrap shrink-0">
            {valorTexto}
          </strong>
        </div>

        {/* Grade equilibrada: Calendariozinho BLACK + Aviso Anti-Engano */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
          <MiniDueDateCalendar dueInfo={dueInfo} />

          <div
            className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-2.5 ${
              dueInfo.isOverdue
                ? 'bg-[#1D090D] border-[#ED101C]/55'
                : 'bg-[#151822] border-white/15'
            }`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                {dueInfo.isOverdue ? (
                  <AlertCircle className="w-4 h-4 text-[#FF4B57] shrink-0" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <strong className="text-xs sm:text-sm font-extrabold text-white">
                  {dueInfo.isOverdue
                    ? 'Atenção: Parcela Vencida'
                    : 'Esta parcela não está atrasada'}
                </strong>
              </div>

              {dueInfo.isOverdue ? (
                <p className="text-xs text-white/75 leading-relaxed">
                  Esta parcela de <strong className="text-white">{dueInfo.monthYearLabel}</strong>{' '}
                  venceu em <strong className="text-white">{parcela.vencimento}</strong> (
                  {dueInfo.countdownLabel.toLowerCase()}). Regularize abaixo via PIX ou boleto.
                </p>
              ) : (
                <p className="text-xs text-white/80 leading-relaxed">
                  Tem certeza que quer pagar a parcela de{' '}
                  <strong className="text-white">{dueInfo.monthYearLabel}</strong>? Ela ainda vai
                  vencer em{' '}
                  <strong className="text-[#FF6B74]">
                    {dueInfo.diffDays} {dueInfo.diffDays === 1 ? 'dia' : 'dias'}
                  </strong>{' '}
                  (vencimento em {parcela.vencimento}).
                </p>
              )}
            </div>

            {requiresAdvanceConfirmation && !confirmedFuturePay && (
              <button
                type="button"
                onClick={() => setConfirmedFuturePay(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs font-extrabold transition-colors shadow-red-glow-sm"
              >
                Sim, quero pagar {dueInfo.monthName}/{dueInfo.year}
              </button>
            )}

            {requiresAdvanceConfirmation && confirmedFuturePay && (
              <div className="px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Confirmado para {dueInfo.monthName}/{dueInfo.year}</span>
              </div>
            )}
          </div>
        </div>

        {/* Ações de Pagamento (liberadas após confirmar caso seja futura/adiantada) */}
        {canProceedPayment && (
          <div className="space-y-2.5 pt-1 border-t border-white/10">
            {hasBoleto && (
              <button
                type="button"
                onClick={() => {
                  const p = parcela;
                  onClose();
                  onOpenAttachment({
                    fileId: p.boletoFileId,
                    dataUrl: p.boletoDataUrl,
                    name: p.boletoNome || `Boleto_Parcela_${p.numero}.pdf`,
                    type: p.boletoTipo,
                  });
                }}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-[#FF5A65]" />
                <span>Ver / Baixar Boleto desta Parcela</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onCopyPix(parcela, valorTexto)}
              className="w-full py-3 px-4 rounded-xl bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-2 shadow-red-glow-sm transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>Copiar Código PIX ({valorTexto})</span>
            </button>

            {/* Aviso de Baixa Automática via Gateway */}
            <div className="p-3 rounded-xl bg-[#141722] border border-white/10 flex items-start gap-2.5 text-[11px] sm:text-xs text-white/75 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Baixa automática bancária:</strong> após o pagamento via PIX ou boleto compensado, o sistema quita automaticamente esta parcela, gera seu comprovante e atualiza o painel para o próximo mês.
              </span>
            </div>

            <a
              href={getWhatsAppUrl(
                `Olá! Sou ${studentName}, aluno do Curso de Socorrista APH (200h), e preciso de atendimento sobre a Parcela ${parcela.numero}/10 (${dueInfo.monthYearLabel} — vencimento ${parcela.vencimento}).`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/75 hover:text-white text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#ED101C]" />
              <span>Enviar comprovante ou tirar dúvida no WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
