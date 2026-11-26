import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Palco Cinematográfico 3D da Logo BLACK Treinamentos no Hero (Aba Início)
 * - Sem botões auxiliares embaixo (visual 100% limpo).
 * - O efeito completo de entrada (subida girando 5x + estouro de raios + descida) acontece
 *   automaticamente ao abrir/recarregar a página.
 * - Ao clicar ou tocar na Logo 3D (tanto no PC quanto no Mobile), dispara raios vermelhos
 *   modernos e discretos saindo da logo + leve pulso luminoso.
 * - Ao segurar e arrastar para os lados e soltar, ela retorna com mola elástica para o ponto de referência.
 */
export default function Hero3DLogoStage() {
  // 'climbing' -> 'lightning' -> 'dropping' -> 'idle'
  const [phase, setPhase] = useState('climbing');
  const [clickPulse, setClickPulse] = useState(false);

  // Estado de arraste interativo (Desktop mouse: Drag & Elastic Spring-Back | Mobile touch: rolagem 100% livre + toque para raios)
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0, rotY: 0, rotX: 0 });
  const dragStartRef = useRef({ clientX: 0, clientY: 0 });
  const touchTapRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const animFrameRef = useRef(null);
  const pulseTimeoutRef = useRef(null);

  /**
   * Desenha raios elétricos ramificados na paleta do site
   * (Vermelho Emergência #ED101C + Núcleo Branco/Rubi Quente) saindo da Logo 3D.
   */
  const triggerRedLightning = useCallback(
    (durationMs = 520, intensity = 0.75, originYShift = 0, customOrigin = null) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const startTime = performance.now();

      const drawBolt = (x1, y1, x2, y2, displace, glowColor, coreColor, lineWidth) => {
        if (displace < 3.5) {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = coreColor;
          ctx.lineWidth = lineWidth;
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = 18;
          ctx.stroke();
          return;
        }
        const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * displace;
        const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * displace;
        drawBolt(x1, y1, midX, midY, displace / 2, glowColor, coreColor, lineWidth);
        drawBolt(midX, midY, x2, y2, displace / 2, glowColor, coreColor, lineWidth);

        if (Math.random() < 0.28 && lineWidth > 0.95) {
          const branchAngle = Math.atan2(y2 - y1, x2 - x1) + (Math.random() - 0.5) * 1.25;
          const branchLen = Math.hypot(x2 - x1, y2 - y1) * 0.52;
          const bx = midX + Math.cos(branchAngle) * branchLen;
          const by = midY + Math.sin(branchAngle) * branchLen;
          drawBolt(midX, midY, bx, by, displace / 2.1, glowColor, coreColor, lineWidth * 0.55);
        }
      };

      const renderFrame = (now) => {
        const elapsed = now - startTime;
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        if (elapsed >= durationMs) {
          ctx.clearRect(0, 0, w, h);
          return;
        }

        const progress = elapsed / durationMs;
        const envelope = progress < 0.15 ? progress / 0.15 : 1 - (progress - 0.15) / 0.85;

        const defaultOrigins = [
          { x: w * 0.22, y: h * 0.42 + originYShift }, // Letra B
          { x: w * 0.50, y: h * 0.38 + originYShift }, // Triângulo vermelho do A
          { x: w * 0.80, y: h * 0.42 + originYShift }, // Corte vermelho do K
          { x: w * 0.26, y: h * 0.62 + originYShift }, // RESGATE
          { x: w * 0.76, y: h * 0.66 + originYShift }, // APH / ECG
        ];

        const origins = customOrigin ? [customOrigin, ...defaultOrigins] : defaultOrigins;

        if (Math.random() < 0.88 * envelope) {
          const numBolts = Math.max(2, Math.ceil(4 * intensity));
          for (let i = 0; i < numBolts; i++) {
            const origin =
              customOrigin && i === 0
                ? customOrigin
                : origins[Math.floor(Math.random() * origins.length)];
            const angle = Math.random() * Math.PI * 2;
            const radius = (w * 0.18 + Math.random() * (w * 0.20)) * intensity;
            const targetX = Math.max(12, Math.min(w - 12, origin.x + Math.cos(angle) * radius));
            const targetY = Math.max(12, Math.min(h - 12, origin.y + Math.sin(angle) * radius * 0.75));

            const isDeepRed = i % 2 === 0;
            const glow = isDeepRed ? 'rgba(237, 16, 28, 0.98)' : 'rgba(255, 65, 75, 0.95)';
            const core = isDeepRed ? 'rgba(255, 235, 235, 0.96)' : 'rgba(255, 155, 160, 0.94)';

            drawBolt(origin.x, origin.y, targetX, targetY, 46 * intensity, glow, core, 2.0 * envelope);
          }
        }

        animFrameRef.current = requestAnimationFrame(renderFrame);
      };

      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(renderFrame);
    },
    []
  );

  // O efeito completo de entrada acontece apenas ao carregar/recarregar a página
  useEffect(() => {
    setPhase('climbing');
    setDragOffset({ x: 0, y: 0, rotY: 0, rotX: 0 });

    const tLightning = setTimeout(() => {
      setPhase('lightning');
      if (videoRef.current) {
        videoRef.current.currentTime = 1.85;
        videoRef.current.play().catch(() => {});
      }
      triggerRedLightning(920, 1.0, -38);
    }, 1450);

    const tDrop = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setPhase('dropping');
    }, 2350);

    const tIdle = setTimeout(() => {
      setPhase('idle');
    }, 2680);

    return () => {
      clearTimeout(tLightning);
      clearTimeout(tDrop);
      clearTimeout(tIdle);
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [triggerRedLightning]);

  const fireLightningAtPointer = (clientX, clientY) => {
    let clickOrigin = null;
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        clickOrigin = {
          x: ((clientX - rect.left) / rect.width) * canvasRef.current.width,
          y: ((clientY - rect.top) / rect.height) * canvasRef.current.height,
        };
      }
    }

    setClickPulse(true);
    if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    pulseTimeoutRef.current = setTimeout(() => setClickPulse(false), 450);
    triggerRedLightning(460, 0.72, 4, clickOrigin);
  };

  // No Mobile (touch), NUNCA captura o dedo no pointerDown para não travar a rolagem vertical da página!
  const handlePointerDown = (e) => {
    if (phase !== 'idle') return;

    if (e.pointerType === 'touch') {
      touchTapRef.current = { clientX: e.clientX, clientY: e.clientY, time: Date.now() };
      return;
    }

    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = {
      clientX: e.clientX - dragOffset.x,
      clientY: e.clientY - dragOffset.y,
    };
    fireLightningAtPointer(e.clientX, e.clientY);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || e.pointerType === 'touch') return;
    const rawX = e.clientX - dragStartRef.current.clientX;
    const rawY = e.clientY - dragStartRef.current.clientY;

    const maxOffsetX = 95;
    const maxOffsetY = 48;
    const clampedX = Math.max(-maxOffsetX, Math.min(maxOffsetX, rawX * 0.65));
    const clampedY = Math.max(-maxOffsetY, Math.min(maxOffsetY, rawY * 0.5));

    const rotY = (clampedX / maxOffsetX) * 32;
    const rotX = -(clampedY / maxOffsetY) * 18;

    setDragOffset({
      x: clampedX,
      y: clampedY,
      rotY,
      rotX,
    });
  };

  const handlePointerUp = (e) => {
    if (e.pointerType === 'touch') {
      const start = touchTapRef.current;
      touchTapRef.current = null;
      // Só dispara os raios se foi um toque rápido (sem arrastar para rolar a página)
      if (start && Math.hypot(e.clientX - start.clientX, e.clientY - start.clientY) < 12) {
        fireLightningAtPointer(e.clientX, e.clientY);
      }
      return;
    }

    if (!isDragging) return;
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0, rotY: 0, rotX: 0 });
  };

  const handlePointerCancel = () => {
    touchTapRef.current = null;
    if (!isDragging) return;
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0, rotY: 0, rotX: 0 });
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none py-2">
      <style>{`
        @keyframes climbAndSpin5xClean {
          0% {
            transform: perspective(1400px) translate3d(0px, 58px, -120px) rotateY(-1800deg) rotateX(14deg) scale(0.45);
            opacity: 0;
          }
          18% {
            opacity: 1;
          }
          85% {
            transform: perspective(1400px) translate3d(0px, -44px, 12px) rotateY(-40deg) rotateX(-2deg) scale(1.03);
          }
          100% {
            transform: perspective(1400px) translate3d(0px, -40px, 0px) rotateY(0deg) rotateX(0deg) scale(1);
            opacity: 1;
          }
        }

        @keyframes hoverStraightAtTopClean {
          0%, 100% {
            transform: perspective(1400px) translate3d(0px, -40px, 0px) rotateY(0deg) rotateX(0deg) scale(1.03);
          }
          50% {
            transform: perspective(1400px) translate3d(0px, -43px, 8px) rotateY(0deg) rotateX(0deg) scale(1.04);
          }
        }

        @keyframes dropToReferencePoint {
          0% {
            transform: perspective(1400px) translate3d(0px, -40px, 0px) rotateY(0deg) rotateX(0deg) scale(1.03);
          }
          78% {
            transform: perspective(1400px) translate3d(0px, 10px, 0px) rotateY(0deg) rotateX(3deg) scale(1.01, 0.98);
          }
          100% {
            transform: perspective(1400px) translate3d(0px, 4px, 0px) rotateY(0deg) rotateX(0deg) scale(1);
          }
        }

        .anim-climb-spin-clean {
          animation: climbAndSpin5xClean 1.45s cubic-bezier(0.18, 0.89, 0.32, 1.08) forwards;
          transform-style: preserve-3d;
        }

        .anim-top-lightning-clean {
          animation: hoverStraightAtTopClean 0.25s ease-in-out infinite;
          transform-style: preserve-3d;
        }

        .anim-drop-clean {
          animation: dropToReferencePoint 0.32s cubic-bezier(0.34, 1.45, 0.64, 1) forwards;
          transform-style: preserve-3d;
        }
      `}</style>

      {/* Palco 3D Limpo (Sem botões embaixo, clique ou arraste direto na Logo 3D) */}
      <div className="relative w-full max-w-[700px] aspect-[16/10] flex items-center justify-center overflow-visible">
        {/* 1. Vídeo de Raios (`ref-raios.mp4`) ativo apenas no efeito completo ao recarregar a página */}
        <video
          ref={videoRef}
          src="/assets/ref-raios.mp4"
          muted
          playsInline
          style={{
            filter: 'hue-rotate(115deg) saturate(3.2) brightness(1.15) contrast(1.25)',
            WebkitMaskImage: 'radial-gradient(ellipse 65% 60% at 50% 45%, black 45%, transparent 95%)',
            maskImage: 'radial-gradient(ellipse 65% 60% at 50% 45%, black 45%, transparent 95%)',
          }}
          className={`pointer-events-none absolute inset-0 w-full h-full object-cover mix-blend-screen z-20 transition-opacity duration-200 ${
            phase === 'lightning' ? 'opacity-95' : 'opacity-0'
          }`}
          aria-hidden="true"
        />

        {/* 2. Canvas de Raios Vermelhos Modernos e Discretos (Na entrada e sempre que clicar/tocar na Logo 3D) */}
        <canvas
          ref={canvasRef}
          width={760}
          height={480}
          className="pointer-events-none absolute inset-0 w-full h-full z-30"
        />

        {/* 3. A LOGO 3D SEM BORDAS ESCURAS (touch-pan-y garante rolagem vertical 100% lisa no celular!) */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          role="button"
          tabIndex={0}
          aria-label="Logo 3D interativa BLACK Treinamentos. Toque para disparar raios."
          className={`relative z-10 w-[96%] h-[92%] flex items-center justify-center touch-pan-y ${
            phase === 'climbing'
              ? 'anim-climb-spin-clean cursor-wait'
              : phase === 'lightning'
              ? 'anim-top-lightning-clean cursor-wait'
              : phase === 'dropping'
              ? 'anim-drop-clean cursor-wait'
              : isDragging
              ? 'cursor-grabbing'
              : 'cursor-pointer'
          }`}
          style={
            phase === 'idle'
              ? {
                  transform: `perspective(1400px) translate3d(${dragOffset.x}px, ${
                    4 + dragOffset.y
                  }px, 0px) rotateY(${dragOffset.rotY}deg) rotateX(${dragOffset.rotX}deg) scale(${
                    clickPulse || isDragging ? 1.025 : 1
                  })`,
                  transition: isDragging
                    ? 'transform 0.04s linear'
                    : 'transform 0.72s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }
              : undefined
          }
        >
          <img
            src="/assets/logo-3d-hero-noborder.png?v=3"
            alt="Logo 3D BLACK Treinamentos - Resgate & APH"
            draggable={false}
            className={`w-full h-full object-contain select-none pointer-events-none transition-all duration-200 ${
              phase === 'lightning' || clickPulse
                ? 'brightness-120 drop-shadow-[0_0_28px_rgba(237,16,28,0.8)]'
                : 'drop-shadow-[0_14px_28px_rgba(0,0,0,0.65)]'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
