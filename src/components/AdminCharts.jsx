import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const NEON_THEMES = {
  red: {
    main: '#FF2A36',
    core: '#FFC2C6',
    glow: 'rgba(255, 42, 54, 0.85)',
    fillTop: '#FF4D58',
    fillBottom: '#7A060E',
  },
  blue: {
    main: '#38BDF8',
    core: '#E0F7FF',
    glow: 'rgba(56, 189, 248, 0.85)',
    fillTop: '#38BDF8',
    fillBottom: '#1D4ED8',
  },
  green: {
    main: '#22FF66',
    core: '#D1FFE2',
    glow: 'rgba(34, 255, 102, 0.85)',
    fillTop: '#2EFF72',
    fillBottom: '#0B6E2C',
  },
  purple: {
    main: '#C084FC',
    core: '#F3E8FF',
    glow: 'rgba(192, 132, 252, 0.85)',
    fillTop: '#C084FC',
    fillBottom: '#5B21B6',
  },
};

/**
 * Mini Gráfico Neon Interativo para os 4 Cards Coloridos (Vermelho, Azul, Verde, Roxo):
 * Barras luminosas com preenchimento degradê + linha zigue-zague ascendente com seta neon +
 * linha de base brilhante e reflexo no piso — fiel à referência enviada e interativo ao passar o mouse!
 */
export function KpiSparklineChart({
  data = [],
  dataKey = 'valor',
  unit = '',
  idSuffix = 'red',
  isActive = false,
}) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const theme = NEON_THEMES[idSuffix] || NEON_THEMES.red;
  const glowId = `neonGlow-${idSuffix}`;
  const beamGlowId = `neonBeamGlow-${idSuffix}`;
  const barGradId = `neonBarGrad-${idSuffix}`;
  const floorGradId = `neonFloorGrad-${idSuffix}`;

  const activeBeam = isActive || hoveredIdx !== null;

  // Usa os últimos 3 pontos principais (como as 3 colunas crescentes da referência!) com valores reais
  const points = data.slice(-3);
  const vals = points.map((p) => Number(p[dataKey] || 0));
  const minVal = Math.min(...vals);
  const maxVal = Math.max(...vals);
  const span = Math.max(1, maxVal - minVal);

  // Alturas escalonadas bonitas e proporcionais aos dados reais
  const barHeights = points.map((p, idx) => {
    const norm = (Number(p[dataKey] || 0) - minVal) / span;
    const baseMin = [24, 34, 46][idx] ?? 26;
    const baseMax = [30, 44, 58][idx] ?? 54;
    return Math.round(baseMin + norm * (baseMax - baseMin));
  });

  const barWidth = 17;
  const barXs = [28, 53, 78];
  const baseY = 82;

  // Traçado zigue-zague neon ascendente acima das barras com seta afiada no topo direito
  const arrowPath = 'M 14 50 L 30 37 L 41 43 L 60 25 L 70 30 L 96 9';
  const hoveredPoint = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div
      className="relative w-24 sm:w-32 h-[72px] sm:h-20 shrink-0 select-none"
      onMouseLeave={() => setHoveredIdx(null)}
    >
      {/* Tooltip Interativo ao passar o mouse em cada barra neon */}
      {hoveredPoint && (
        <div className="pointer-events-none absolute -top-11 right-0 z-20 px-2.5 py-1 rounded-lg bg-[#090B10]/95 border border-white/20 shadow-2xl text-[11px] whitespace-nowrap">
          <span className="text-white/60 mr-1.5">{hoveredPoint.label}:</span>
          <strong className="text-white font-mono">
            {hoveredPoint[dataKey]}
            {unit}
          </strong>
        </div>
      )}

      <svg
        viewBox="0 0 118 96"
        className="w-full h-full overflow-visible"
        role="img"
        aria-label="Gráfico de crescimento"
      >
        <defs>
          <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.6" result="blur1" />
            <feGaussianBlur stdDeviation="5.5" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id={beamGlowId} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.5" result="b1" />
            <feGaussianBlur stdDeviation="7" result="b2" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="b1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id={barGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.fillTop} stopOpacity="0.95" />
            <stop offset="55%" stopColor={theme.main} stopOpacity="0.58" />
            <stop offset="100%" stopColor={theme.fillBottom} stopOpacity="0.22" />
          </linearGradient>

          <radialGradient id={floorGradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={theme.main} stopOpacity={activeBeam ? '0.82' : '0.52'} />
            <stop offset="100%" stopColor={theme.main} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Reflexo suave no piso abaixo da linha base */}
        <ellipse cx="60" cy="86" rx="46" ry="6" fill={`url(#${floorGradId})`} />

        {/* 3 Barras Crescentes Neon com Borda Brilhante (interativas + carga ascendente no hover!) */}
        {points.map((pt, idx) => {
          const h = barHeights[idx];
          const x = barXs[idx];
          const y = baseY - h;
          const isHovered = hoveredIdx === idx;
          return (
            <g
              key={pt.label || idx}
              className={`cursor-pointer transition-opacity duration-150 ${
                activeBeam ? `kpi-bar-charge-${idx}` : ''
              }`}
              onMouseEnter={() => setHoveredIdx(idx)}
            >
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={h}
                rx="2"
                fill={`url(#${barGradId})`}
                stroke={isHovered ? '#FFFFFF' : theme.core}
                strokeWidth={isHovered ? '2.2' : '1.7'}
                filter={`url(#${glowId})`}
                opacity={hoveredIdx === null || isHovered ? 1 : 0.65}
              />
            </g>
          );
        })}

        {/* Linha de Base Neon Brilhante */}
        <line
          x1="14"
          y1={baseY}
          x2="106"
          y2={baseY}
          stroke={theme.core}
          strokeWidth="2.4"
          strokeLinecap="round"
          filter={`url(#${glowId})`}
        />

        {/* Linha Zigue-Zague Ascendente Neon (estática quando parado) */}
        <path
          d={arrowPath}
          fill="none"
          stroke={theme.core}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={activeBeam ? 0.55 : 0.95}
          filter={`url(#${glowId})`}
        />

        {/* DISPARO DE RAIO / LUZ DE BAIXO PARA CIMA — SÓ QUANDO PASSA O MOUSE OU CLICA NO CARD! */}
        {activeBeam && (
          <>
            <path
              d={arrowPath}
              fill="none"
              stroke={theme.main}
              strokeWidth="4.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="kpi-arrow-beam-trail"
              filter={`url(#${beamGlowId})`}
            />
            <path
              d={arrowPath}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="kpi-arrow-beam"
              filter={`url(#${beamGlowId})`}
            />
          </>
        )}

        {/* Ponta da Seta Neon Afiada (pulsa luz quando o raio chega no topo!) */}
        <polygon
          points="102,4 86,8 95,19"
          fill={activeBeam ? '#FFFFFF' : theme.core}
          stroke={theme.main}
          strokeWidth="1.2"
          strokeLinejoin="round"
          className={activeBeam ? 'kpi-tip-spark' : ''}
          filter={`url(#${activeBeam ? beamGlowId : glowId})`}
        />
      </svg>
    </div>
  );
}

const BAR_GLASS_STYLES = {
  amber: {
    fill: 'url(#revGlassAmberFill)',
    stroke: 'url(#revGlassAmberStroke)',
    topHighlight: '#FEF08A',
  },
  green: {
    fill: 'url(#revGlassGreenFill)',
    stroke: 'url(#revGlassGreenStroke)',
    topHighlight: '#BBF7D0',
  },
  red: {
    fill: 'url(#revGlassRedFill)',
    stroke: 'url(#revGlassRedStroke)',
    topHighlight: '#FECACA',
  },
};

/**
 * Barra Translúcida de Vidro Neon (Faturamento Amarelo | Lucro Verde | Despesas Vermelho)
 * Corpo translúcido que dissolve na base + borda superior/lateral luminosa!
 */
function GlowingNeonBar(props) {
  const { x, y, width, height, variant = 'amber' } = props;
  if (!height || height <= 0 || !width || width <= 0) return null;

  const style = BAR_GLASS_STYLES[variant] || BAR_GLASS_STYLES.amber;
  const r = Math.min(5, width / 2, height / 2);

  const pathD = [
    `M ${x} ${y + height}`,
    `L ${x} ${y + r}`,
    `Q ${x} ${y} ${x + r} ${y}`,
    `L ${x + width - r} ${y}`,
    `Q ${x + width} ${y} ${x + width} ${y + r}`,
    `L ${x + width} ${y + height}`,
    'Z',
  ].join(' ');

  const rimD = [
    `M ${x + 0.65} ${y + height}`,
    `L ${x + 0.65} ${y + r}`,
    `Q ${x + 0.65} ${y + 0.65} ${x + r} ${y + 0.65}`,
    `L ${x + width - r} ${y + 0.65}`,
    `Q ${x + width - 0.65} ${y + 0.65} ${x + width - 0.65} ${y + r}`,
    `L ${x + width - 0.65} ${y + height}`,
  ].join(' ');

  return (
    <g>
      <path d={pathD} fill={style.fill} />
      <path
        d={rimD}
        fill="none"
        stroke={style.stroke}
        strokeWidth="1.35"
        filter="url(#revBarNeonGlow)"
      />
      {width > 8 && (
        <line
          x1={x + r}
          y1={y + 0.85}
          x2={x + width - r}
          y2={y + 0.85}
          stroke={style.topHighlight}
          strokeWidth="1.35"
          strokeLinecap="round"
        />
      )}
    </g>
  );
}

/**
 * Gráfico Principal Executivo (Padrão Semáforo Realista + Seta Neon Limpa Acima das Barras):
 * - 3 Barras de Vidro Neon agrupadas por mês: Faturamento (Amarelo), Lucro (Verde) e Despesas (Vermelho)
 * - Curva luminosa de crescimento passando ACIMA das barras com seta neon (ZERO pontinhos!)
 * - Filtro rápido clicável no topo (Todos | Faturamento | Lucro | Despesas)
 */
export function RevenueProfitChart({ data = [] }) {
  const [focusMetric, setFocusMetric] = useState('all'); // 'all' | 'faturamento' | 'lucro' | 'despesas'

  const formatBRLShort = (val) =>
    val >= 1000 ? `R$ ${(val / 1000).toFixed(0)}k` : `R$ ${val}`;

  const formatBRLFull = (val) =>
    Number(val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Calcula a linha de tendência suave ACIMA do topo das barras (igual à referência, sem cortar no meio!)
  const chartData = data.map((row) => {
    const activePeak =
      focusMetric === 'lucro'
        ? row.lucro
        : focusMetric === 'despesas'
        ? row.despesas
        : row.faturamento;
    return {
      ...row,
      tendencia: Math.round(activePeak * 1.16 + 750),
    };
  });

  const isCompact = data.length > 7;

  return (
    <div className="space-y-3">
      {/* Pílulas de filtro interativo semáforo */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'Todos', dot: null },
            { id: 'faturamento', label: 'Faturamento', dot: '#FACC15' },
            { id: 'lucro', label: 'Lucro', dot: '#34D399' },
            { id: 'despesas', label: 'Despesas', dot: '#FF4D57' },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFocusMetric(opt.id)}
              className={`px-2.5 py-1 rounded-lg border font-bold inline-flex items-center gap-1.5 transition-all ${
                focusMetric === opt.id
                  ? 'bg-white/10 border-white/25 text-white'
                  : 'bg-white/[0.02] border-white/5 text-white/60 hover:text-white hover:border-white/15'
              }`}
            >
              {opt.dot && (
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: opt.dot, boxShadow: `0 0 6px ${opt.dot}` }}
                />
              )}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
        <span className="text-white/45 font-mono hidden sm:inline">
          Tendência de crescimento ↑
        </span>
      </div>

      <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-[radial-gradient(ellipse_75%_65%_at_55%_40%,rgba(245,158,11,0.09)_0%,rgba(16,185,129,0.06)_40%,rgba(11,12,17,0.45)_75%,transparent_100%)]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 16, left: -12, bottom: 2 }}
            barGap={isCompact ? 1 : 4}
            barCategoryGap={isCompact ? '18%' : '22%'}
          >
            <defs>
              {/* AMARELO — Faturamento */}
              <linearGradient id="revGlassAmberFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FACC15" stopOpacity="0.62" />
                <stop offset="50%" stopColor="#D97706" stopOpacity="0.26" />
                <stop offset="92%" stopColor="#78350F" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#451A03" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="revGlassAmberStroke" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.72" />
                <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
              </linearGradient>

              {/* VERDE — Lucro Líquido */}
              <linearGradient id="revGlassGreenFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34D399" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#059669" stopOpacity="0.26" />
                <stop offset="92%" stopColor="#064E3B" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#022C22" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="revGlassGreenStroke" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#BBF7D0" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#10B981" stopOpacity="0.72" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0" />
              </linearGradient>

              {/* VERMELHO — Despesas */}
              <linearGradient id="revGlassRedFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF4D57" stopOpacity="0.58" />
                <stop offset="50%" stopColor="#B91C1C" stopOpacity="0.26" />
                <stop offset="92%" stopColor="#7F1D1D" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#450A0A" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="revGlassRedStroke" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FECACA" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#ED101C" stopOpacity="0.72" />
                <stop offset="100%" stopColor="#991B1B" stopOpacity="0" />
              </linearGradient>

              {/* Glow suave das barras */}
              <filter id="revBarNeonGlow" x="-25%" y="-25%" width="150%" height="150%">
                <feGaussianBlur stdDeviation="2" result="b1" />
                <feMerge>
                  <feMergeNode in="b1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Glow neon da seta de crescimento ACIMA das barras */}
              <filter id="trendArrowGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="b1" />
                <feGaussianBlur stdDeviation="6" result="b2" />
                <feMerge>
                  <feMergeNode in="b2" />
                  <feMergeNode in="b1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient id="trendArrowGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.75" />
                <stop offset="48%" stopColor="#34D399" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#ECFDF5" stopOpacity="1" />
              </linearGradient>

              {/* Ponta da seta neon limpa (sem bolinhas na curva!) */}
              <marker
                id="trendNeonArrowHead"
                viewBox="0 0 12 12"
                refX="8.5"
                refY="6"
                markerWidth="7.5"
                markerHeight="7.5"
                orient="auto"
              >
                <path
                  d="M 1 1.5 L 11 6 L 1 10.5 L 3.4 6 Z"
                  fill="#ECFDF5"
                  stroke="#34D399"
                  strokeWidth="0.8"
                />
              </marker>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.055)" vertical={false} />
            <XAxis
              dataKey="mes"
              tick={{ fill: '#A0A4B4', fontSize: 11, fontWeight: 600 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatBRLShort}
              tick={{ fill: '#8E93A4', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[0, (max) => Math.ceil((max * 1.08) / 5000) * 5000]}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.04)', radius: 10 }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const row = payload[0].payload;
                const margem =
                  row.faturamento > 0
                    ? ((row.lucro / row.faturamento) * 100).toFixed(1)
                    : '0.0';
                return (
                  <div className="p-3.5 rounded-2xl bg-[#0D0F16]/95 backdrop-blur-xl border border-white/15 shadow-2xl text-xs space-y-1.5 min-w-[195px]">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                      <strong className="text-white font-display">{label} • APH 200h</strong>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold">
                        {margem}% margem
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-white/70 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        Faturamento:
                      </span>
                      <strong className="text-amber-300 font-mono">
                        {formatBRLFull(row.faturamento)}
                      </strong>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-white/70 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#ED101C]" />
                        Despesas:
                      </span>
                      <strong className="text-[#FF5A65] font-mono">
                        {formatBRLFull(row.despesas)}
                      </strong>
                    </div>
                    <div className="flex justify-between gap-4 pt-1 border-t border-white/10">
                      <span className="text-white/90 font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Lucro Líquido:
                      </span>
                      <strong className="text-emerald-400 font-mono">
                        {formatBRLFull(row.lucro)}
                      </strong>
                    </div>
                  </div>
                );
              }}
            />

            {(focusMetric === 'all' || focusMetric === 'faturamento') && (
              <Bar
                dataKey="faturamento"
                name="Faturamento"
                shape={<GlowingNeonBar variant="amber" />}
                maxBarSize={isCompact ? 12 : 24}
              />
            )}
            {(focusMetric === 'all' || focusMetric === 'lucro') && (
              <Bar
                dataKey="lucro"
                name="Lucro Líquido"
                shape={<GlowingNeonBar variant="green" />}
                maxBarSize={isCompact ? 12 : 24}
              />
            )}
            {(focusMetric === 'all' || focusMetric === 'despesas') && (
              <Bar
                dataKey="despesas"
                name="Despesas"
                shape={<GlowingNeonBar variant="red" />}
                maxBarSize={isCompact ? 12 : 24}
              />
            )}

            {/* Curva luminosa limpa ACIMA das barras com seta neon (ZERO pontinhos!) */}
            <Line
              type="monotone"
              dataKey="tendencia"
              name="Tendência"
              stroke="url(#trendArrowGrad)"
              strokeWidth={2.6}
              dot={false}
              activeDot={false}
              isAnimationActive={false}
              markerEnd="url(#trendNeonArrowHead)"
              style={{ filter: 'url(#trendArrowGlow)' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/**
 * Paleta Glossy 3D para cada fatia do Gráfico Circular 3D Escalonado
 */
const PIE_3D_SHADES = {
  '#10B981': {
    topSpec: '#86EFAC',
    topLight: '#34D399',
    topDark: '#059669',
    sideSpec: '#6EE7B7',
    sideLight: '#22C55E',
    sideMid: '#15803D',
    sideDark: '#064E26',
    cutWall: '#0A5E2E',
    glow: 'rgba(16, 185, 129, 0.5)',
  },
  '#ED101C': {
    topSpec: '#FF7A85',
    topLight: '#FF303D',
    topDark: '#B80812',
    sideSpec: '#FF6B74',
    sideLight: '#ED101C',
    sideMid: '#B80913',
    sideDark: '#69040A',
    cutWall: '#8C070F',
    glow: 'rgba(237, 16, 28, 0.55)',
  },
  '#F59E0B': {
    topSpec: '#FEF08A',
    topLight: '#FACC15',
    topDark: '#D97706',
    sideSpec: '#FDE047',
    sideLight: '#F59E0B',
    sideMid: '#CA8A04',
    sideDark: '#78350F',
    cutWall: '#92400E',
    glow: 'rgba(245, 158, 11, 0.55)',
  },
  '#3B82F6': {
    topSpec: '#93C5FD',
    topLight: '#38BDF8',
    topDark: '#1D4ED8',
    sideSpec: '#7DD3FC',
    sideLight: '#3B82F6',
    sideMid: '#2563EB',
    sideDark: '#1E3A8A',
    cutWall: '#1E40AF',
    glow: 'rgba(59, 130, 246, 0.5)',
  },
};

function getShade(color) {
  return (
    PIE_3D_SHADES[color] || {
      topSpec: color,
      topLight: color,
      topDark: color,
      sideSpec: color,
      sideLight: color,
      sideMid: color,
      sideDark: '#111827',
      cutWall: '#1F2937',
      glow: 'rgba(255,255,255,0.25)',
    }
  );
}

/**
 * Gráfico Circular 3D Escalonado com Brilho Glossy (Fiel à referência 3D enviada!)
 * - Cada fatia tem altura 3D proporcional ao seu percentual (maiores mais altas, menores mais baixas)
 * - Paredes cilíndricas extrudadas, brilho especular 3D e sombra suave no piso
 * - 100% dinâmico e interativo: passar o mouse na fatia ou na legenda eleva a fatia em 3D!
 */
export function InstallmentsDonutChart({ data = [] }) {
  const [hoveredName, setHoveredName] = useState(null);

  const activeItems = data.filter((d) => Number(d.value) > 0);
  const total = Math.max(
    1,
    activeItems.reduce((acc, d) => acc + Number(d.value || 0), 0)
  );

  // Centro e raios da elipse isométrica 3D (mais ampla e generosa para excelente leitura)
  const cx = 140;
  const cy = 124;
  const rx = 104;
  const ry = 56;

  // Ordena do maior para o menor para posicionar:
  // Maior (ex: 50%) atrás-esquerda | 2º (ex: 30%) direita | Menores (ex: 10%, 10%) na FRENTE (parte mais larga e visível!)
  const ordered = [...activeItems].sort((a, b) => Number(b.value) - Number(a.value));

  // Começa em +140° (0.78 * PI, frente-esquerda):
  // - Maior varre esquerda + trás + topo
  // - 2º maior varre direita + frente-direita
  // - Fatias menores (10% / 10%) ficam exatamente no palco FRONTAL (68° a 140°), totalmente abertas e legíveis!
  let currentAngle = Math.PI * 0.78;
  const slices = ordered.map((item, idx) => {
    const frac = Number(item.value) / total;
    const sweep = frac * Math.PI * 2;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sweep;
    currentAngle = endAngle;

    const midAngle = (startAngle + endAngle) / 2;

    // Alturas 3D harmônicas e próximas (34px a 48px) — mantém o charme escalonado sem afundar fatias de 10%!
    const gentleStep = Math.max(0, (ordered.length - 1 - idx) * 2.5);
    const height3D = Math.round(34 + frac * 15 + gentleStep);
    const shade = getShade(item.color);

    return {
      ...item,
      idx,
      frac,
      startAngle,
      endAngle,
      midAngle,
      height3D,
      shade,
      depthY: Math.sin(midAngle),
    };
  });

  // Painter's algorithm: desenha primeiro fatias ao fundo (menor sin) e por último as da frente (maior sin)
  const sortedForPaint = [...slices].sort((a, b) => a.depthY - b.depthY);

  const pt = (angle, yOffset = 0, scale = 1) => ({
    x: cx + rx * scale * Math.cos(angle),
    y: cy + ry * scale * Math.sin(angle) - yOffset,
  });

  // Constrói arcos frontais visíveis (onde sin(theta) >= 0, i.e., [0, PI] mod 2PI)
  const getFrontArcSegments = (a0, a1) => {
    const segs = [];
    for (let k = -2; k <= 2; k += 1) {
      const fStart = k * Math.PI * 2;
      const fEnd = fStart + Math.PI;
      const s = Math.max(a0, fStart);
      const e = Math.min(a1, fEnd);
      if (e - s > 0.01) {
        segs.push([s, e]);
      }
    }
    return segs;
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full min-w-0">
      {/* PALCO CENTRALIZADO DO GRÁFICO CIRCULAR 3D (MAIOR, ENCAIXADO E COM 4 FATIAS NITÍDAS!) */}
      <div
        className="relative w-full max-w-[260px] sm:max-w-[285px] h-[188px] sm:h-[202px] mx-auto shrink-0 select-none"
        onMouseLeave={() => setHoveredName(null)}
      >
        <svg
          viewBox="0 0 280 202"
          className="w-full h-full overflow-visible"
          role="img"
          aria-label="Gráfico 3D da situação financeira das parcelas"
        >
          <defs>
            <radialGradient id="pie3dFloorShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.72" />
              <stop offset="65%" stopColor="#000000" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>

            {slices.map((s) => (
              <React.Fragment key={`defs-${s.name}`}>
                {/* 100% opaco: brilho colorido limpo sem vazar o fundo preto (zero manchas cinzas!) */}
                <linearGradient id={`pieTop-${s.idx}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={s.shade.topSpec} />
                  <stop offset="42%" stopColor={s.shade.topLight} />
                  <stop offset="100%" stopColor={s.shade.topDark} />
                </linearGradient>
                <linearGradient id={`pieSide-${s.idx}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={s.shade.sideDark} />
                  <stop offset="28%" stopColor={s.shade.sideSpec} />
                  <stop offset="52%" stopColor={s.shade.sideLight} />
                  <stop offset="76%" stopColor={s.shade.sideMid} />
                  <stop offset="100%" stopColor={s.shade.sideDark} />
                </linearGradient>
              </React.Fragment>
            ))}
          </defs>

          {/* Sombra 3D suave no chão */}
          <ellipse cx={cx} cy={cy + 14} rx={rx + 14} ry={ry + 6} fill="url(#pie3dFloorShadow)" />

          {/* Renderização 3D de cada fatia (ordenado de trás para frente) */}
          {sortedForPaint.map((s) => {
            const isHovered = hoveredName === s.name;
            const h = s.height3D;
            const lift = isHovered ? 6 : 0;
            const largeArc = s.endAngle - s.startAngle > Math.PI ? 1 : 0;

            // Pontos da face superior
            const t0 = pt(s.startAngle, h + lift);
            const t1 = pt(s.endAngle, h + lift);
            const tCenter = { x: cx, y: cy - h - lift };

            // Pontos da base
            const b0 = pt(s.startAngle, lift);
            const b1 = pt(s.endAngle, lift);
            const bCenter = { x: cx, y: cy - lift };

            // Caminho da tampa superior (setor elíptico)
            const topPath = `M ${tCenter.x} ${tCenter.y} L ${t0.x} ${t0.y} A ${rx} ${ry} 0 ${largeArc} 1 ${t1.x} ${t1.y} Z`;

            // Paredes internas retas (corte radial 3D)
            const wallStartPath = `M ${bCenter.x} ${bCenter.y} L ${b0.x} ${b0.y} L ${t0.x} ${t0.y} L ${tCenter.x} ${tCenter.y} Z`;
            const wallEndPath = `M ${bCenter.x} ${bCenter.y} L ${b1.x} ${b1.y} L ${t1.x} ${t1.y} L ${tCenter.x} ${tCenter.y} Z`;

            // Paredes curvas frontais visíveis (cilindro 3D)
            const frontArcs = getFrontArcSegments(s.startAngle, s.endAngle);

            // Posição do texto de porcentagem na face superior (fatias frontais de 10% ficam bem abertas e legíveis!)
            const labelPos = pt(s.midAngle, h + lift, s.frac <= 0.14 ? 0.68 : 0.56);

            return (
              <g
                key={s.name}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredName(s.name)}
                style={{
                  filter: isHovered ? `drop-shadow(0 0 12px ${s.shade.glow})` : 'none',
                }}
              >
                {/* Paredes retas de corte lateral */}
                <path d={wallStartPath} fill={s.shade.cutWall} opacity="0.96" />
                <path d={wallEndPath} fill={s.shade.sideDark} opacity="0.96" />

                {/* Parede cilíndrica frontal brilhante */}
                {frontArcs.map(([fs, fe], arcIdx) => {
                  const pB0 = pt(fs, lift);
                  const pB1 = pt(fe, lift);
                  const pT0 = pt(fs, h + lift);
                  const pT1 = pt(fe, h + lift);
                  const arcLarge = fe - fs > Math.PI ? 1 : 0;
                  const sideD = [
                    `M ${pT0.x} ${pT0.y}`,
                    `A ${rx} ${ry} 0 ${arcLarge} 1 ${pT1.x} ${pT1.y}`,
                    `L ${pB1.x} ${pB1.y}`,
                    `A ${rx} ${ry} 0 ${arcLarge} 0 ${pB0.x} ${pB0.y}`,
                    'Z',
                  ].join(' ');
                  return <path key={arcIdx} d={sideD} fill={`url(#pieSide-${s.idx})`} />;
                })}

                {/* Face Superior Glossy 3D */}
                <path
                  d={topPath}
                  fill={`url(#pieTop-${s.idx})`}
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth={isHovered ? '1.6' : '0.9'}
                />

                {/* Porcentagem em destaque direto sobre a fatia 3D */}
                <text
                  x={labelPos.x}
                  y={labelPos.y + 4.5}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontWeight="800"
                  fontSize={s.frac <= 0.14 ? '12.5' : '16'}
                  style={{
                    fontFamily: 'inherit',
                    textShadow: '0 2px 6px rgba(0,0,0,0.88)',
                  }}
                >
                  {s.pct}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* LEGENDA INTERATIVA 2x2 ENCAIXADA PERFEITAMENTE DENTRO DO CARD */}
      <div className="w-full grid grid-cols-2 gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
        {data.map((item) => {
          const isHovered = hoveredName === item.name;
          return (
            <div
              key={item.name}
              onMouseEnter={() => setHoveredName(item.name)}
              onMouseLeave={() => setHoveredName(null)}
              className={`min-w-0 flex items-center justify-between gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-2 rounded-xl border transition-all cursor-pointer ${
                isHovered
                  ? 'bg-white/[0.08] border-white/25 scale-[1.01]'
                  : 'bg-white/[0.03] border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 0 8px ${item.color}`,
                  }}
                />
                <span className="text-white/90 font-semibold truncate">{item.name}</span>
              </div>
              <span className="font-mono font-bold text-white shrink-0 text-[10px] sm:text-[11px]">
                {item.value}{' '}
                <span className="text-white/55 font-normal">({item.pct}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
