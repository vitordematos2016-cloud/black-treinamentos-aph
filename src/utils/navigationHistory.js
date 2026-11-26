/**
 * Controlador central de histórico interno e botão Voltar passo a passo:
 * - Sempre que há passos na pilha (zoom, modal, menu, atalho de seção ou Portal do Aluno),
 *   cada toque em Voltar desfaz 1 passo até retornar ao ponto anterior.
 * - Quando não há mais passos e o visitante já está na página principal mas fora do topo,
 *   o Voltar leva de volta para o topo da página principal (#inicio).
 * - Quando já está no topo da página principal sem nada para voltar, exibe o diálogo
 *   de confirmação ("Tem certeza que quer sair? Sim ou Não").
 */

const TOP_THRESHOLD_PX = 160;

const internalStack = [];
let initialized = false;
let stepCounter = 0;
let suppressNextPop = false;
let isExiting = false;
let baseGuardArmed = false;
let exitConfirmOpen = false;

let callbacks = {
  getCurrentView: () => 'landing',
  onGoHome: () => {},
  onRequestExitConfirm: () => {},
  onCloseExitConfirm: () => {},
};

function getCurrentDepth() {
  const d = window.history.state?.depth;
  return typeof d === 'number' && Number.isFinite(d) ? d : 0;
}

function pushBrowserState(kind, extra = {}, url) {
  if (isExiting) return getCurrentDepth();
  const nextDepth = getCurrentDepth() + 1;
  const targetUrl = url || window.location.href;
  window.history.pushState(
    {
      __blackNav: true,
      depth: nextDepth,
      kind,
      ...extra,
    },
    '',
    targetUrl
  );
  return nextDepth;
}

function ensureBaseGuard() {
  if (baseGuardArmed || isExiting) return;
  baseGuardArmed = true;
  if (getCurrentDepth() === 0) {
    pushBrowserState('base-guard');
  }
}

function closeAllOverlays() {
  for (let i = internalStack.length - 1; i >= 0; i -= 1) {
    const item = internalStack[i];
    if (item.kind === 'overlay') {
      try {
        item.close?.();
      } catch {
        // Ignora componente já desmontado
      }
      internalStack.splice(i, 1);
    }
  }
}

function performExit(depthHint) {
  isExiting = true;
  closeAllOverlays();
  internalStack.length = 0;
  try {
    callbacks.onCloseExitConfirm?.();
  } catch {
    // Fallback silencioso
  }

  const currentDepth =
    typeof depthHint === 'number' && Number.isFinite(depthHint) ? depthHint : getCurrentDepth();
  const stepsBack = currentDepth + 1;

  if (stepsBack > 1) {
    window.history.go(-stepsBack);
  } else {
    window.history.back();
  }

  // Reabilita caso a aba tenha sido aberta diretamente sem histórico externo
  window.setTimeout(() => {
    isExiting = false;
  }, 900);
}

function handlePopState(event) {
  if (suppressNextPop) {
    suppressNextPop = false;
    return;
  }
  if (isExiting) return;

  // 1) Se há passos na pilha interna (modal, zoom, menu, atalho de seção, outra aba/view), volta 1 passo
  if (internalStack.length > 0) {
    const step = internalStack.pop();

    if (step.kind === 'overlay') {
      try {
        step.close?.();
      } catch {
        // Componente pode já estar desmontado
      }
    } else if (step.kind === 'scroll') {
      window.scrollTo({ top: step.returnY ?? 0, behavior: 'smooth' });
    } else if (step.kind === 'view') {
      try {
        step.restore?.();
      } catch {
        // Fallback silencioso
      }
    }

    // Garante entrada sentinela no histórico para capturar os próximos cliques em Voltar
    if (getCurrentDepth() === 0) {
      pushBrowserState('post-step-guard');
    }
    return;
  }

  // 2) Se estava fora da Landing principal (ex.: entrou direto em ?view=aluno), volta para a página principal
  const currentView = callbacks.getCurrentView?.() || 'landing';
  if (currentView !== 'landing') {
    const landingUrl = new URL(window.location.href);
    landingUrl.searchParams.delete('view');
    landingUrl.hash = '';
    try {
      callbacks.onGoHome?.();
    } catch {
      // Fallback silencioso
    }
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    if (getCurrentDepth() === 0) {
      pushBrowserState('home-sentinel', {}, landingUrl.toString());
    }
    return;
  }

  // 3) Já está na Landing principal, mas está abaixo na página -> volta lá para cima (topo #inicio)
  if (window.scrollY > TOP_THRESHOLD_PX) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (getCurrentDepth() === 0) {
      pushBrowserState('top-guard');
    }
    return;
  }

  // 4) Já está no topo da página principal e não tem mais para onde voltar
  if (getCurrentDepth() === 0) {
    pushBrowserState('exit-guard');
  }

  if (exitConfirmOpen) {
    // Se o modal de confirmação já estava aberto e o visitante apertou Voltar novamente, fecha o diálogo
    exitConfirmOpen = false;
    try {
      callbacks.onCloseExitConfirm?.();
    } catch {
      // Fallback silencioso
    }
    return;
  }

  exitConfirmOpen = true;
  try {
    callbacks.onRequestExitConfirm?.(event.state?.depth ?? 0);
  } catch {
    performExit(event.state?.depth ?? 0);
  }
}

export function initNavigationHistory(opts = {}) {
  callbacks = { ...callbacks, ...opts };

  if (initialized) {
    return () => {};
  }
  initialized = true;

  if (!window.history.state || typeof window.history.state.depth !== 'number') {
    window.history.replaceState(
      { ...(window.history.state || {}), __blackOrigin: true, depth: 0 },
      '',
      window.location.href
    );
  }

  const armOnFirstGesture = () => {
    ensureBaseGuard();
  };

  window.addEventListener('pointerdown', armOnFirstGesture, { once: true, capture: true, passive: true });
  window.addEventListener('keydown', armOnFirstGesture, { once: true, capture: true, passive: true });
  window.addEventListener('popstate', handlePopState);

  return () => {
    window.removeEventListener('pointerdown', armOnFirstGesture, { capture: true });
    window.removeEventListener('keydown', armOnFirstGesture, { capture: true });
    window.removeEventListener('popstate', handlePopState);
    initialized = false;
  };
}

/**
 * Chamado quando o usuário clica em "Sim, sair" no diálogo de confirmação.
 */
export function confirmExitSite() {
  exitConfirmOpen = false;
  performExit(getCurrentDepth());
}

/**
 * Chamado quando o usuário clica em "Não" ou fecha o diálogo de confirmação de saída.
 */
export function cancelExitConfirm() {
  exitConfirmOpen = false;
  ensureBaseGuard();
  if (getCurrentDepth() === 0) {
    pushBrowserState('exit-guard');
  }
}

/**
 * Registra abertura de modal/lightbox/menu/diálogo no histórico.
 */
export function pushOverlayHistory(id, close, options = {}) {
  const { replaceOverlayIds = [] } = options;
  ensureBaseGuard();

  const toReplace = Array.isArray(replaceOverlayIds) ? replaceOverlayIds : [replaceOverlayIds];
  let reusedDepth = null;

  for (let i = internalStack.length - 1; i >= 0; i -= 1) {
    const item = internalStack[i];
    if (item.kind === 'overlay' && (item.id === id || toReplace.includes(item.id))) {
      if (reusedDepth === null) reusedDepth = item.depth;
      internalStack.splice(i, 1);
    }
  }

  stepCounter += 1;
  let depth = reusedDepth;
  if (depth === null) {
    depth = pushBrowserState('overlay', { overlayId: id, seq: stepCounter });
  } else {
    window.history.replaceState(
      { ...(window.history.state || {}), __blackNav: true, depth, kind: 'overlay', overlayId: id, seq: stepCounter },
      '',
      window.location.href
    );
  }

  internalStack.push({
    kind: 'overlay',
    id,
    close,
    depth,
    seq: stepCounter,
  });
}

/**
 * Remove overlay(s) da pilha quando fechado manualmente (botão X / backdrop).
 */
export function dismissOverlayHistory(ids) {
  const idList = Array.isArray(ids) ? ids : [ids];
  let removedDepthMin = null;
  let removedTopSequential = 0;

  for (let i = internalStack.length - 1; i >= 0; i -= 1) {
    const item = internalStack[i];
    if (item.kind === 'overlay' && idList.includes(item.id)) {
      const wasAtStackTop = i === internalStack.length - 1;
      internalStack.splice(i, 1);
      if (wasAtStackTop) {
        removedTopSequential += 1;
        removedDepthMin = item.depth;
      }
    }
  }

  const currentDepth = getCurrentDepth();
  if (removedTopSequential > 0 && currentDepth >= (removedDepthMin || 1)) {
    const targetDepth = internalStack.length > 0 ? internalStack[internalStack.length - 1].depth : 1;
    const diff = currentDepth - Math.max(1, targetDepth);
    if (diff > 0) {
      suppressNextPop = true;
      window.history.go(-diff);
    }
  }
}

/**
 * Navega suavemente para uma seção (#inicio, #cursos, #certificacao, etc.)
 * salvando na pilha a posição anterior de scroll para permitir voltar passo a passo.
 */
export function navigateToSection(href, options = {}) {
  const { closeOverlayIds = [], onBeforeScroll } = options;
  ensureBaseGuard();

  const targetId = String(href || '').replace(/^#/, '') || 'inicio';
  const returnY = window.scrollY;

  const idsToClear = Array.isArray(closeOverlayIds) ? closeOverlayIds : [closeOverlayIds];
  let replacedOverlayDepth = null;
  for (let i = internalStack.length - 1; i >= 0; i -= 1) {
    const item = internalStack[i];
    if (item.kind === 'overlay' && idsToClear.includes(item.id)) {
      replacedOverlayDepth = item.depth;
      internalStack.splice(i, 1);
    }
  }

  if (typeof onBeforeScroll === 'function') {
    onBeforeScroll();
  }

  const targetEl = targetId === 'inicio' ? null : document.getElementById(targetId);
  const targetY =
    targetId === 'inicio'
      ? 0
      : targetEl
        ? Math.max(0, targetEl.getBoundingClientRect().top + window.scrollY - 104)
        : returnY;

  if (Math.abs(targetY - returnY) > 40) {
    stepCounter += 1;
    const depth =
      replacedOverlayDepth !== null
        ? replacedOverlayDepth
        : pushBrowserState('scroll', { targetId, seq: stepCounter });

    internalStack.push({
      kind: 'scroll',
      returnY,
      targetId,
      depth,
      seq: stepCounter,
    });
  } else if (replacedOverlayDepth !== null && getCurrentDepth() > 1) {
    suppressNextPop = true;
    window.history.back();
  }

  window.requestAnimationFrame(() => {
    if (targetId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

/**
 * Registra transição de visualização principal (Landing <-> Portal do Aluno / Admin).
 */
export function pushViewTransition(fromView, toView, targetUrl, restoreFn, options = {}) {
  const { replaceOverlayIds = [] } = options;
  ensureBaseGuard();
  const returnY = window.scrollY;

  const toReplace = Array.isArray(replaceOverlayIds) ? replaceOverlayIds : [replaceOverlayIds];
  let reusedDepth = null;
  for (let i = internalStack.length - 1; i >= 0; i -= 1) {
    const item = internalStack[i];
    if (item.kind === 'overlay' && toReplace.includes(item.id)) {
      if (reusedDepth === null) reusedDepth = item.depth;
      internalStack.splice(i, 1);
    }
  }

  closeAllOverlays();

  stepCounter += 1;
  let depth = reusedDepth;
  if (depth === null) {
    depth = pushBrowserState('view', { fromView, toView, seq: stepCounter }, targetUrl);
  } else {
    window.history.replaceState(
      { __blackNav: true, depth, kind: 'view', fromView, toView, seq: stepCounter },
      '',
      targetUrl
    );
  }

  internalStack.push({
    kind: 'view',
    returnView: fromView,
    returnY,
    depth,
    seq: stepCounter,
    restore: () => {
      restoreFn?.(returnY);
    },
  });
}
