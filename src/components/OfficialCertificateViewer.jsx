import React, { useState } from 'react';
import {
  Award,
  FileText,
  Columns,
  Printer,
  CheckCircle2,
  X,
} from 'lucide-react';

/**
 * Componente Oficial Reutilizável do Certificado BLACK Treinamentos (Frente e Verso - 200h)
 * - Fiel a `certificacao-ref.jpg`: Molduras douradas limpas (sem botões cobrindo o canto
 *   superior direito "Conhecimento que salva vidas!"). Clicar na imagem amplia em tela cheia.
 * - Na impressão ("Imprimir / PDF"): Imprime SOMENTE as 2 folhas A4 limpas (Frente e Verso).
 */
/**
 * Coordenadas milimétricas calibradas diretamente sobre `public/assets/certificado-frente.png` (768 x 1024).
 * Compartilhadas entre a visualização em tela (SVG viewBox 0 0 768 1024) e a impressão A4 (Canvas 2x),
 * garantindo alinhamento idêntico de linha de base, centralização e proporção tipográfica em qualquer tela ou PDF.
 */
const CERT_BASE_W = 768;
const CERT_BASE_H = 1024;
const CERT_SERIF_FONT = '"Times New Roman", Times, Georgia, serif';
const CERT_INK_COLOR = '#1A1A1A';

const getCertificateTextSpecs = ({
  studentName = '',
  studentCpf = '',
  periodStart = '',
  periodEnd = '',
  issueDate = '',
}) => {
  const cleanName = studentName.trim().toUpperCase();
  const nameFontSize =
    cleanName.length > 38 ? 18.5 : cleanName.length > 30 ? 21 : cleanName.length > 24 ? 23 : 25;

  const formattedPeriodEnd = periodEnd
    ? periodEnd.trim().endsWith(',')
      ? periodEnd.trim()
      : `${periodEnd.trim()},`
    : '';

  return {
    name: cleanName
      ? {
          text: cleanName,
          x: 384,
          y: 455,
          fontSize: nameFontSize,
          fontWeight: '700',
          letterSpacing: 0.6,
          align: 'center',
        }
      : null,
    cpf: studentCpf.trim()
      ? {
          text: studentCpf.trim(),
          x: 389,
          y: 497,
          fontSize: 20,
          fontWeight: '700',
          letterSpacing: 0,
          align: 'left',
        }
      : null,
    periodStart: periodStart.trim()
      ? {
          text: periodStart.trim(),
          x: 163,
          y: 591,
          fontSize: 20,
          fontWeight: '400',
          letterSpacing: 0,
          align: 'center',
        }
      : null,
    periodEnd: formattedPeriodEnd
      ? {
          text: formattedPeriodEnd,
          x: 303,
          y: 591,
          fontSize: 20,
          fontWeight: '400',
          letterSpacing: 0,
          align: 'center',
        }
      : null,
    issueDate: issueDate.trim()
      ? {
          text: issueDate.trim(),
          x: 516,
          y: 703,
          fontSize: 17,
          fontWeight: '400',
          letterSpacing: 0,
          align: 'left',
        }
      : null,
  };
};

export default function OfficialCertificateViewer({
  studentName = '',
  studentCpf = '',
  periodStart = '',
  periodEnd = '',
  issueDate = '',
  defaultTab = 'ambos',
  compact = false,
  showPrintButton = true,
}) {
  const [viewMode, setViewMode] = useState(defaultTab); // 'frente' | 'verso' | 'ambos'
  const [zoomImage, setZoomImage] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const textSpecs = getCertificateTextSpecs({
    studentName,
    studentCpf,
    periodStart,
    periodEnd,
    issueDate,
  });

  const handleCleanPrint = async () => {
    setIsPrinting(true);
    try {
      const loadImg = (src) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });

      const [frenteImg, versoImg] = await Promise.all([
        loadImg('/assets/certificado-frente.png'),
        loadImg('/assets/certificado-verso.png'),
      ]);

      const scale = 2;
      const canvas = document.createElement('canvas');
      canvas.width = CERT_BASE_W * scale;
      canvas.height = CERT_BASE_H * scale;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(frenteImg, 0, 0, canvas.width, canvas.height);

      if (textSpecs.name) {
        ctx.fillStyle = CERT_INK_COLOR;
        ctx.textBaseline = 'alphabetic';

        const drawSpec = (spec) => {
          if (!spec) return;
          ctx.font = `${spec.fontWeight} ${spec.fontSize * scale}px ${CERT_SERIF_FONT}`;
          ctx.textAlign = spec.align;
          ctx.fillText(spec.text, spec.x * scale, spec.y * scale);
        };

        drawSpec(textSpecs.name);
        drawSpec(textSpecs.cpf);
        drawSpec(textSpecs.periodStart);
        drawSpec(textSpecs.periodEnd);
        drawSpec(textSpecs.issueDate);
      }

      const frenteDataUrl = canvas.toDataURL('image/png', 1.0);

      const existingFrame = document.getElementById('black-clean-cert-print-frame');
      if (existingFrame) existingFrame.remove();

      const iframe = document.createElement('iframe');
      iframe.id = 'black-clean-cert-print-frame';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(`
        <!doctype html>
        <html lang="pt-BR">
          <head>
            <meta charset="UTF-8" />
            <title>Certificado BLACK Treinamentos</title>
            <style>
              @page {
                size: A4 portrait;
                margin: 0mm;
              }
              * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
              }
              html, body {
                width: 100%;
                background: #ffffff;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .cert-sheet {
                width: 210mm;
                height: 297mm;
                page-break-after: always;
                break-after: page;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #ffffff;
              }
              .cert-sheet:last-child {
                page-break-after: auto;
                break-after: auto;
              }
              .cert-sheet img {
                width: 100%;
                height: 100%;
                object-fit: fill;
                display: block;
              }
            </style>
          </head>
          <body>
            <div class="cert-sheet">
              <img id="img-frente" src="${frenteDataUrl}" alt="Certificado Frente" />
            </div>
            <div class="cert-sheet">
              <img id="img-verso" src="${versoImg.src}" alt="Certificado Verso" />
            </div>
          </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        setIsPrinting(false);
      }, 350);
    } catch (err) {
      console.error('Erro ao preparar impressão limpa:', err);
      setIsPrinting(false);
      window.print();
    }
  };

  const renderStudentOverlay = () => {
    if (!textSpecs.name) return null;

    const fields = [
      { key: 'name', spec: textSpecs.name },
      { key: 'cpf', spec: textSpecs.cpf },
      { key: 'periodStart', spec: textSpecs.periodStart },
      { key: 'periodEnd', spec: textSpecs.periodEnd },
      { key: 'issueDate', spec: textSpecs.issueDate },
    ].filter((item) => item.spec);

    return (
      <svg
        viewBox={`0 0 ${CERT_BASE_W} ${CERT_BASE_H}`}
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 w-full h-full select-none"
        aria-hidden="true"
      >
        {fields.map(({ key, spec }) => (
          <text
            key={key}
            x={spec.x}
            y={spec.y}
            fill={CERT_INK_COLOR}
            fontFamily={CERT_SERIF_FONT}
            fontSize={spec.fontSize}
            fontWeight={spec.fontWeight}
            letterSpacing={spec.letterSpacing || undefined}
            textAnchor={spec.align === 'center' ? 'middle' : 'start'}
            dominantBaseline="alphabetic"
          >
            {spec.text}
          </text>
        ))}
      </svg>
    );
  };

  const renderFrenteCard = () => (
    <div
      onClick={() =>
        setZoomImage({
          title: 'Frente Oficial — Certificado de Conclusão (200 Horas)',
          src: '/assets/certificado-frente.png',
          isFrente: true,
        })
      }
      role="button"
      tabIndex={0}
      title="Clique para ampliar a Frente do Certificado"
      className="cert-gold-sheen relative group rounded-2xl overflow-hidden border-2 border-amber-400/75 hover:border-amber-300 bg-white shadow-[0_12px_35px_rgba(0,0,0,0.75)] hover:shadow-[0_18px_45px_rgba(251,191,36,0.28)] hover:-translate-y-1 cursor-zoom-in transition-all duration-300"
    >
      <img
        src="/assets/certificado-frente.png"
        alt="Certificado de Conclusão Oficial BLACK Treinamentos - Frente"
        className="w-full h-auto block select-none"
      />
      {renderStudentOverlay()}
      <span className="no-print pointer-events-none absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-amber-400/60 text-amber-300 text-[10px] font-bold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
        Clique para ampliar
      </span>
    </div>
  );

  const renderVersoCard = () => (
    <div
      onClick={() =>
        setZoomImage({
          title: 'Verso Oficial — Conteúdo Programático (11 Módulos • 200 Horas)',
          src: '/assets/certificado-verso.png',
        })
      }
      role="button"
      tabIndex={0}
      title="Clique para ampliar o Verso do Certificado (200h)"
      className="cert-gold-sheen relative group rounded-2xl overflow-hidden border-2 border-amber-400/75 hover:border-amber-300 bg-white shadow-[0_12px_35px_rgba(0,0,0,0.75)] hover:shadow-[0_18px_45px_rgba(251,191,36,0.28)] hover:-translate-y-1 cursor-zoom-in transition-all duration-300"
    >
      <img
        src="/assets/certificado-verso.png"
        alt="Certificado Oficial BLACK Treinamentos - Verso com Conteúdo Programático de 200 Horas (11 Módulos)"
        className="w-full h-auto block select-none"
      />
      <span className="no-print pointer-events-none absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-amber-400/60 text-amber-300 text-[10px] font-bold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
        Clique para ampliar
      </span>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Topo de Controle Fiel à Referência `certificacao-ref-exata.jpg` (Adaptado limpo para Mobile) */}
      <div className="no-print space-y-3">
        {/* Linha 1: Seletor Frente + Verso | 1. Frente | 2. Verso (Empilhado limpo em rounded-2xl no Mobile, 1 linha pill no Desktop!) */}
        <div className="flex flex-col sm:flex-row sm:flex-nowrap items-stretch sm:items-center justify-between gap-2 bg-[#14151D] border border-white/15 p-1.5 rounded-2xl sm:rounded-full">
          <div className="grid grid-cols-1 sm:flex sm:flex-nowrap items-center justify-between w-full gap-1.5">
            <button
              type="button"
              onClick={() => setViewMode('ambos')}
              className={`whitespace-nowrap px-4 xl:px-5 py-2.5 sm:py-2 rounded-xl sm:rounded-full text-xs xl:text-[13.5px] font-bold flex items-center justify-center gap-2 transition-all ${
                viewMode === 'ambos'
                  ? 'bg-[#ED101C] text-white shadow-[0_0_18px_rgba(237,16,28,0.6)]'
                  : 'text-white/85 hover:text-white hover:bg-white/5'
              }`}
            >
              <Columns className="w-4 h-4 shrink-0" />
              <span>Frente + Verso</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('frente')}
              className={`whitespace-nowrap px-3.5 xl:px-4 py-2.5 sm:py-2 rounded-xl sm:rounded-full text-xs xl:text-[13.5px] font-bold flex items-center justify-center gap-2 transition-all ${
                viewMode === 'frente'
                  ? 'bg-[#ED101C] text-white shadow-[0_0_18px_rgba(237,16,28,0.6)]'
                  : 'text-white/85 hover:text-white hover:bg-white/5'
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>1. Frente (Diploma)</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('verso')}
              className={`whitespace-nowrap px-3.5 xl:px-4 py-2.5 sm:py-2 rounded-xl sm:rounded-full text-xs xl:text-[13.5px] font-bold flex items-center justify-center gap-2 transition-all ${
                viewMode === 'verso'
                  ? 'bg-[#ED101C] text-white shadow-[0_0_18px_rgba(237,16,28,0.6)]'
                  : 'text-white/85 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>2. Verso (11 Módulos • 200h)</span>
            </button>
          </div>

          {showPrintButton && (
            <button
              type="button"
              onClick={handleCleanPrint}
              disabled={isPrinting}
              className="whitespace-nowrap px-4 py-2.5 sm:py-2 rounded-xl sm:rounded-full bg-[#ED101C] hover:bg-[#C80B15] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors shadow-red-glow-sm disabled:opacity-50"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span>{isPrinting ? 'Preparando...' : 'Imprimir / PDF (Frente e Verso)'}</span>
            </button>
          )}
        </div>

        {/* Linha 2: Pílula na Paleta Oficial BLACK (Vermelho + Dourado, sem verde fora de contexto) */}
        <div className="flex justify-center sm:justify-start">
          <span className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-white/95 px-4 py-1.5 rounded-full bg-[#190609]/95 border border-[#ED101C]/55 shadow-[0_0_15px_rgba(237,16,28,0.18)]">
            <CheckCircle2 className="w-4 h-4 text-[#ED101C]" />
            <span>Lei nº 9.394/96 (LDB) • 200h</span>
          </span>
        </div>
      </div>

      {/* Área de Exibição em Tela */}
      {viewMode === 'ambos' ? (
        <div className={`grid grid-cols-1 ${compact ? 'md:grid-cols-2' : 'sm:grid-cols-2'} gap-4 items-start pt-1`}>
          <div className="space-y-2">
            <span className="no-print text-[11px] sm:text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block text-center leading-snug">
              PÁGINA 1 — FRENTE
              <br />
              (CERTIFICADO DE CONCLUSÃO)
            </span>
            {renderFrenteCard()}
          </div>
          <div className="space-y-2">
            <span className="no-print text-[11px] sm:text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block text-center leading-snug">
              PÁGINA 2 — VERSO
              <br />
              (CONTEÚDO PROGRAMÁTICO 200 HORAS)
            </span>
            {renderVersoCard()}
          </div>
        </div>
      ) : viewMode === 'frente' ? (
        <div className="max-w-lg mx-auto">{renderFrenteCard()}</div>
      ) : (
        <div className="max-w-lg mx-auto">{renderVersoCard()}</div>
      )}

      {/* Lightbox de Tela Cheia ao Clicar no Certificado */}
      {zoomImage && (
        <div
          className="no-print fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-3xl w-full bg-[#121217] border border-white/15 rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
              <h4 className="font-bold text-sm sm:text-base text-white">{zoomImage.title}</h4>
              <button
                type="button"
                onClick={() => setZoomImage(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-[#ED101C] text-white transition-colors"
                aria-label="Fechar visualização"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 max-h-[84vh] overflow-y-auto flex justify-center bg-black">
              <div className="relative inline-block">
                <img
                  src={zoomImage.src}
                  alt={zoomImage.title}
                  className="max-h-[78vh] w-auto block rounded-lg select-none"
                />
                {zoomImage.isFrente && renderStudentOverlay()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
