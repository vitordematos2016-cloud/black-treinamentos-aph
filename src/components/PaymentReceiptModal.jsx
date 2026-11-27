import React from 'react';
import {
  Check,
  CheckCircle2,
  GraduationCap,
  FileText,
  Calendar,
  CreditCard,
  CircleDollarSign,
  Info,
  Printer,
  ShieldCheck,
  User,
  X,
} from 'lucide-react';
import { BRAND_CONFIG } from '../data/blackData';

/**
 * Gera código estruturado e único com resolução inteligente anti-colisão:
 * - Padrão limpo (sem colisão): BLK-[ANO]-[INICIAL_NOME][MÊS_PAGO]-[4_ULTIMOS_CPF]
 *   Ex.: Vitor de Matos (CPF ...3900), 10/05/2027 → BLK-2027-V05-3900
 * - Se já existir exatamente igual na base (`existingCodes`), o sistema anexa
 *   progressivamente a 1ª letra do nome (...3900V), se repetir a próxima (...3900I),
 *   depois a próxima (...3900T), etc. — garantindo unicidade absoluta!
 */
export function buildReceiptCode(
  parcela,
  studentName = 'VITOR MATOS',
  studentCpf = '108.492.739-00',
  existingCodes = []
) {
  if (
    parcela?.comprovanteCodigo &&
    /^BLK-\d{4}-[A-Z]\d{2}-\d{4}([A-Z]\d*)?$/.test(parcela.comprovanteCodigo) &&
    existingCodes.length === 0
  ) {
    // Se veio do formato antigo que forçava letra no final sem colisão, deixa limpar para 4 dígitos
    if (/^BLK-\d{4}-[A-Z]\d{2}-\d{4}$/.test(parcela.comprovanteCodigo)) {
      return parcela.comprovanteCodigo;
    }
  }

  const parts = String(parcela?.vencimento || '').split('/');
  const mes =
    parts.length >= 2 && parts[1]
      ? parts[1].padStart(2, '0')
      : String(parcela?.numero || 1).padStart(2, '0');
  const ano = parts.length >= 3 && parts[2] ? parts[2].slice(0, 4) : '2027';

  // Nome limpo sem acentos (letras A-Z do nome completo, priorizando o primeiro nome)
  const cleanLetters = String(studentName || 'ALUNO')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');

  const firstInitial = cleanLetters[0] || 'A';

  // 4 últimos dígitos numéricos do CPF
  const cpfDigits = String(studentCpf || '').replace(/\D/g, '');
  const cpfLast4 = cpfDigits.length >= 4 ? cpfDigits.slice(-4) : cpfDigits.padStart(4, '0');

  const baseCode = `BLK-${ano}-${firstInitial}${mes}-${cpfLast4}`;
  const used = new Set(existingCodes.filter(Boolean));

  // Caso padrão (sem repetição): termina limpo nos 4 dígitos do CPF!
  if (!used.has(baseCode)) return baseCode;

  // Resolução inteligente anti-colisão acumulativa (até 3 letras do nome; depois número):
  // Normal → ...3900 | 1ª → ...3900V | 2ª → ...3900VI | 3ª → ...3900VIT | 4ª+ → ...3900VIT2
  const maxPrefixLetters = Math.min(3, cleanLetters.length);
  for (let i = 0; i < maxPrefixLetters; i += 1) {
    const candidate = `${baseCode}${cleanLetters.slice(0, i + 1)}`;
    if (!used.has(candidate)) return candidate;
  }

  const prefix3 = cleanLetters.slice(0, maxPrefixLetters) || firstInitial;
  let seq = 2;
  while (used.has(`${baseCode}${prefix3}${seq}`)) {
    seq += 1;
  }
  return `${baseCode}${prefix3}${seq}`;
}

/**
 * Card Oficial de Comprovante de Pagamento — BLACK Treinamentos (Resgate & APH)
 * Construído 1:1 no estilo vidro escuro com brilho neon vermelho BLACK da referência:
 * - Logo BLACK centralizada + linha divisória luminosa
 * - Quadrado arredondado vermelho neon com Check branco
 * - Pílula verde luminosa "Pagamento aprovado"
 * - 3 painéis internos com borda luminosa vermelha (Curso | Dados do Pagamento | Próximos Passos + PDF)
 * - Rodapé "Pagamento 100% Seguro" + Logo BLACK com linha ECG pulsante
 */
const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export default function PaymentReceiptModal({
  parcela,
  studentName = 'VITOR MATOS',
  studentCpf = '108.492.739-00',
  onClose,
}) {
  if (!parcela) return null;

  const receiptCode = buildReceiptCode(parcela, studentName, studentCpf);
  const paidDate = parcela.pagoEm || `${parcela.vencimento} às 08:42`;
  const parcelaLabel = `Parcela ${String(parcela.numero).padStart(2, '0')}/10`;
  const metodoLabel = parcela.metodo || 'PIX';
  const valorLabel = parcela.valor || 'R$ 200,00';

  const handlePrintReceiptPdf = () => {
    const existing = document.getElementById('black-payment-receipt-frame');
    if (existing) existing.remove();

    const iframe = document.createElement('iframe');
    iframe.id = 'black-payment-receipt-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const safeCode = escapeHtml(receiptCode);
    const safeParcelaLabel = escapeHtml(parcelaLabel);
    const safeStudentName = escapeHtml(studentName);
    const safeStudentCpf = escapeHtml(studentCpf);
    const safePaidDate = escapeHtml(paidDate);
    const safeMetodoLabel = escapeHtml(metodoLabel);
    const safeValorLabel = escapeHtml(valorLabel);
    const safeCorpName = escapeHtml(BRAND_CONFIG.corporateName);
    const safeCnpj = escapeHtml(BRAND_CONFIG.cnpj);

    const origin = window.location.origin;
    const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Comprovante ${safeCode} — BLACK Treinamentos</title>
  <style>
    @page { size: A4 portrait; margin: 0; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body {
      margin: 0;
      padding: 18mm 14mm;
      background: #060609;
      font-family: 'Segoe UI', Inter, Arial, sans-serif;
      color: #FFFFFF;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .shell {
      width: 100%;
      max-width: 470px;
      border-radius: 30px;
      padding: 28px 26px 24px;
      background:
        radial-gradient(ellipse 85% 40% at 50% 0%, rgba(237,16,28,0.34), transparent 72%),
        radial-gradient(ellipse 70% 35% at 85% 98%, rgba(237,16,28,0.22), transparent 68%),
        linear-gradient(165deg, #160B0E 0%, #09090D 50%, #14070A 100%);
      border: 1.5px solid rgba(255,86,98,0.75);
      box-shadow: 0 0 38px rgba(237,16,28,0.3);
      text-align: center;
    }
    .top-logo { height: 46px; width: auto; object-fit: contain; }
    .divider {
      height: 1px; margin: 14px 0 18px;
      background: linear-gradient(90deg, transparent, rgba(255,90,101,0.85), transparent);
    }
    .check-box {
      width: 62px; height: 62px; border-radius: 16px; margin: 0 auto 14px;
      background: linear-gradient(145deg, #FF4752 0%, #E00C18 50%, #7A040B 100%);
      border: 1.5px solid rgba(255,195,200,0.8);
      box-shadow: 0 0 24px rgba(237,16,28,0.75);
      display: flex; align-items: center; justify-content: center;
      font-size: 32px; font-weight: 900; color: #FFFFFF;
    }
    h1 { margin: 0 0 10px; font-size: 26px; font-weight: 800; letter-spacing: -0.02em; }
    .pill {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 18px; border-radius: 9999px;
      background: rgba(6, 55, 28, 0.85);
      border: 1.5px solid rgba(52, 211, 153, 0.85);
      color: #6EE7B7; font-size: 13px; font-weight: 800;
      box-shadow: 0 0 18px rgba(16, 185, 129, 0.4);
    }
    .sub { margin: 10px 0 18px; font-size: 13px; color: rgba(255,255,255,0.78); }
    .panel {
      text-align: left;
      border-radius: 18px;
      padding: 14px 16px;
      margin-bottom: 12px;
      background: linear-gradient(180deg, rgba(28,12,16,0.75), rgba(11,10,14,0.92));
      border: 1px solid rgba(255,76,88,0.52);
    }
    .course-title { font-size: 16px; font-weight: 800; margin: 2px 0; }
    .muted { font-size: 11.5px; color: rgba(255,255,255,0.62); }
    .row {
      display: flex; justify-content: space-between; align-items: center; gap: 10px;
      padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 12.5px;
    }
    .row:last-child { border-bottom: none; padding-bottom: 2px; }
    .row:first-child { padding-top: 2px; }
    .val { font-weight: 700; text-align: right; }
    .val-mono { font-family: Consolas, monospace; font-weight: 700; }
    .val-money { color: #34D399; font-size: 17px; font-weight: 900; font-family: Consolas, monospace; }
    .footer {
      margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      text-align: left; font-size: 11px; color: rgba(255,255,255,0.7);
    }
    .footer-logo { height: 28px; width: auto; object-fit: contain; }
  </style>
</head>
<body>
  <div class="shell">
    <img class="top-logo" src="${origin}/assets/logo-header-sharp.png" alt="BLACK Treinamentos" />
    <div class="divider"></div>
    <div class="check-box">✓</div>
    <h1>Comprovante de Pagamento</h1>
    <div class="pill">✓ Pagamento aprovado</div>
    <p class="sub">Seu pagamento foi processado com sucesso!</p>

    <div class="panel">
      <div class="muted">Curso • ${safeParcelaLabel}</div>
      <div class="course-title">Socorrista — APH (200h)</div>
      <div class="muted">Atendimento Pré-Hospitalar • Turma 13/02/2027</div>
    </div>

    <div class="panel">
      <div class="row"><span class="muted">Código do Pagamento</span><span class="val-mono">${safeCode}</span></div>
      <div class="row"><span class="muted">Aluno</span><span class="val">${safeStudentName}</span></div>
      <div class="row"><span class="muted">CPF</span><span class="val-mono">${safeStudentCpf}</span></div>
      <div class="row"><span class="muted">Data do Pagamento</span><span class="val">${safePaidDate}</span></div>
      <div class="row"><span class="muted">Forma de Pagamento</span><span class="val">${safeMetodoLabel}</span></div>
      <div class="row"><span class="muted">Valor Pago</span><span class="val-money">${safeValorLabel}</span></div>
    </div>

    <div class="panel">
      <div style="font-weight:800;font-size:13px;margin-bottom:3px;">Próximos Passos</div>
      <div class="muted" style="line-height:1.45;">
        Acesse o Portal do Aluno com seu CPF/e-mail e acompanhe suas aulas, frequência presencial e certificado oficial (200h).
      </div>
    </div>

    <div class="footer">
      <div>
        <strong style="color:#FFFFFF;display:block;">Pagamento 100% Seguro</strong>
        <span>${safeCorpName} • CNPJ ${safeCnpj}</span>
      </div>
      <img class="footer-logo" src="${origin}/assets/logo-header-sharp.png" alt="BLACK" />
    </div>
  </div>
</body>
</html>`;

    const doc = iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }, 350);
  };

  return (
    <div
      className="fixed inset-0 z-[98] bg-black/85 backdrop-blur-md flex items-center justify-center px-3 py-6 sm:p-5 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Comprovante de Pagamento BLACK Treinamentos"
      onClick={onClose}
    >
      <div
        className="admin-tab-enter black-receipt-shell relative w-full max-w-[440px] my-auto rounded-[1.75rem] sm:rounded-[2rem] px-4 sm:px-6 pt-5 pb-5 text-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Reflexo diagonal sutil de vidro sobre o card */}
        <div
          className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/[0.04] blur-2xl"
          aria-hidden="true"
        />

        {/* Botão Fechar discreto no canto superior direito */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/[0.06] hover:bg-[#ED101C] border border-white/15 text-white/75 hover:text-white transition-all"
          aria-label="Fechar comprovante"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. LOGO BLACK TREINAMENTOS NO TOPO */}
        <div className="relative flex justify-center pt-1 pb-3">
          <img
            src="/assets/logo-header-sharp.png"
            alt="BLACK Treinamentos — Resgate & APH"
            className="h-11 sm:h-12 w-auto object-contain drop-shadow-[0_0_16px_rgba(237,16,28,0.35)]"
          />
        </div>

        {/* Linha divisória luminosa vermelha */}
        <div className="glass-cal-neon-divider w-full mb-4 opacity-85" />

        {/* 2. QUADRADO VERMELHO NEON COM CHECK BRANCO */}
        <div className="black-receipt-check mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-3.5">
          <Check className="w-8 h-8 sm:w-9 sm:h-9 text-white stroke-[3.2]" />
        </div>

        {/* 3. TÍTULO + PÍLULA VERDE "PAGAMENTO APROVADO" + SUBTÍTULO */}
        <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight">
          Comprovante de Pagamento
        </h3>

        <div className="mt-2.5 flex justify-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-950/80 border border-emerald-400/80 text-emerald-300 text-xs sm:text-sm font-extrabold shadow-[0_0_22px_rgba(34,197,94,0.45)]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Pagamento aprovado</span>
          </span>
        </div>

        <p className="text-xs sm:text-[13px] text-white/75 mt-2.5">
          Seu pagamento foi processado com sucesso!
        </p>

        {/* 4. PAINEL 1: CURSO (COM ÍCONE DE CHAPÉU NEON VERMELHO) */}
        <div className="black-receipt-panel mt-4 rounded-2xl p-3.5 flex items-center gap-3.5 text-left">
          <div className="black-receipt-icon-box w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6 text-[#FF5A65]" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] text-white/60 block">
              Curso • {parcelaLabel}
            </span>
            <strong className="font-display font-extrabold text-sm sm:text-base text-white block truncate">
              Socorrista — APH (200h)
            </strong>
            <span className="text-[11px] text-white/60 block">
              Atendimento Pré-Hospitalar
            </span>
          </div>
        </div>

        {/* 5. PAINEL 2: DADOS DO PAGAMENTO COM ÍCONES NEON VERMELHOS */}
        <div className="black-receipt-panel mt-3 rounded-2xl px-3.5 sm:px-4 py-3 text-left divide-y divide-white/[0.08] text-[11px] sm:text-[13px]">
          <div className="py-2 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 text-white/70 min-w-0">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF4D58] shrink-0 drop-shadow-[0_0_6px_rgba(237,16,28,0.8)]" />
              <span className="truncate">Código do Pagamento</span>
            </span>
            <strong className="font-mono text-white text-right tracking-tight shrink-0">
              {receiptCode}
            </strong>
          </div>

          <div className="py-2 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 text-white/70 shrink-0">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF4D58] shrink-0 drop-shadow-[0_0_6px_rgba(237,16,28,0.8)]" />
              <span>Aluno</span>
            </span>
            <strong className="text-white text-right truncate max-w-[165px] sm:max-w-[195px]" title={`${studentName} • CPF ${studentCpf}`}>
              {studentName}
            </strong>
          </div>

          <div className="py-2 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 text-white/70 shrink-0">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF4D58] shrink-0 drop-shadow-[0_0_6px_rgba(237,16,28,0.8)]" />
              <span>Data</span>
            </span>
            <strong className="text-white text-right shrink-0">{paidDate}</strong>
          </div>

          <div className="py-2 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 text-white/70 shrink-0">
              <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF4D58] shrink-0 drop-shadow-[0_0_6px_rgba(237,16,28,0.8)]" />
              <span>Pagamento</span>
            </span>
            <strong className="text-white text-right shrink-0">{metodoLabel}</strong>
          </div>

          <div className="pt-2.5 pb-1 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 text-white/85 font-semibold shrink-0">
              <CircleDollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF4D58] shrink-0 drop-shadow-[0_0_6px_rgba(237,16,28,0.8)]" />
              <span>Valor Pago</span>
            </span>
            <strong className="font-mono font-extrabold text-base sm:text-lg text-emerald-400 shrink-0 drop-shadow-[0_0_10px_rgba(52,211,153,0.45)]">
              {valorLabel}
            </strong>
          </div>
        </div>

        {/* 6. PAINEL 3: PRÓXIMOS PASSOS + BOTÃO DE IMPRIMIR/BAIXAR PDF EM 1 CLIQUE */}
        <div className="black-receipt-panel mt-3 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-left">
          <div className="flex items-start gap-3 min-w-0">
            <span className="w-8 h-8 rounded-full bg-[#ED101C]/15 border border-[#FF5A65]/60 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_12px_rgba(237,16,28,0.4)]">
              <Info className="w-4 h-4 text-[#FF5A65]" />
            </span>
            <div className="min-w-0">
              <strong className="text-xs sm:text-sm text-white block">
                Próximos Passos
              </strong>
              <p className="text-[11px] text-white/65 leading-relaxed mt-0.5">
                Acesse o Portal do Aluno para acompanhar suas aulas ou clique ao lado para baixar o comprovante em PDF.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePrintReceiptPdf}
            title="Baixar / Imprimir Comprovante em PDF"
            className="black-receipt-icon-box hover:scale-105 active:scale-95 w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-[#FF6B74] hover:text-white transition-all cursor-pointer"
          >
            <Printer className="w-5 h-5" />
          </button>
        </div>

        {/* Botão direto de Baixar PDF discreto e claro */}
        <button
          type="button"
          onClick={handlePrintReceiptPdf}
          className="cta-btn-shimmer mt-3.5 w-full py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#ED101C] to-[#B80913] hover:brightness-110 text-white text-xs font-extrabold inline-flex items-center justify-center gap-2 shadow-[0_6px_22px_rgba(237,16,28,0.42)] transition-all hover:-translate-y-0.5"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Baixar / Imprimir Comprovante (PDF)</span>
        </button>

        {/* 7. RODAPÉ OFICIAL: PAGAMENTO 100% SEGURO + LOGO BLACK COM LINHA ECG */}
        <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-left">
            <ShieldCheck className="w-6 h-6 text-[#FF4D58] shrink-0 drop-shadow-[0_0_8px_rgba(237,16,28,0.7)]" />
            <div>
              <strong className="text-[11px] sm:text-xs text-white block leading-tight">
                Pagamento 100% Seguro
              </strong>
              <span className="text-[10px] text-white/55 block">
                Seus dados são protegidos.
              </span>
            </div>
          </div>

          <div className="h-7 w-px bg-white/15 shrink-0" />

          <div className="flex items-center gap-1.5 shrink-0">
            <img
              src="/assets/logo-header-sharp.png"
              alt="BLACK Treinamentos"
              className="h-6 sm:h-7 w-auto object-contain"
            />
            <svg
              viewBox="0 0 46 22"
              className="w-9 h-5 overflow-visible"
              aria-hidden="true"
            >
              <path
                d="M 0 12 L 10 12 L 15 3 L 21 19 L 27 8 L 31 12 L 45 12"
                fill="none"
                stroke="#ED101C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: 'drop-shadow(0 0 5px rgba(237,16,28,0.95))' }}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
