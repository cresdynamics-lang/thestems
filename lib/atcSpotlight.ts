/**
 * Ensures only one on-screen product card runs the "Add to cart" open animation
 * at a time (mobile + desktop). Cards register when mounted; IntersectionObserver
 * tracks which are in the viewport; we round-robin among visible ones.
 */

type Listener = (active: boolean) => void;

type CardEntry = {
  id: string;
  el: Element;
  listener: Listener;
};

const cards = new Map<string, CardEntry>();
const visible = new Set<string>();
let activeId: string | null = null;
let observer: IntersectionObserver | null = null;
let pickTimer: ReturnType<typeof setTimeout> | null = null;
let cycleTimer: ReturnType<typeof setTimeout> | null = null;
let roundRobinIndex = 0;

/** Full spotlight cycle: spin + open + hold + close */
export const ATC_CYCLE_MS = 3200;
/** Pause before highlighting the next visible card */
const GAP_MS = 900;

function ensureObserver() {
  if (typeof window === "undefined" || observer) return;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).dataset.atcId;
        if (!id || !cards.has(id)) continue;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
          visible.add(id);
        } else {
          visible.delete(id);
        }
      }
      if (activeId && !visible.has(activeId)) {
        clearActive();
        schedulePick(200);
      } else if (!activeId) {
        schedulePick(200);
      }
    },
    { threshold: [0.4, 0.55], rootMargin: "0px" }
  );
}

function setActive(id: string | null) {
  if (activeId === id) return;
  if (activeId) {
    cards.get(activeId)?.listener(false);
  }
  activeId = id;
  if (id) {
    cards.get(id)?.listener(true);
  }
}

function clearActive() {
  setActive(null);
  if (cycleTimer) {
    clearTimeout(cycleTimer);
    cycleTimer = null;
  }
}

function schedulePick(delay = GAP_MS) {
  if (pickTimer) clearTimeout(pickTimer);
  pickTimer = setTimeout(pickNext, delay);
}

function pickNext() {
  pickTimer = null;
  const candidates = [...visible].filter((id) => cards.has(id));
  if (candidates.length === 0) {
    clearActive();
    return;
  }

  // Prefer a different card than the last one when possible
  let next = candidates[roundRobinIndex % candidates.length];
  if (candidates.length > 1 && next === activeId) {
    roundRobinIndex += 1;
    next = candidates[roundRobinIndex % candidates.length];
  }
  roundRobinIndex = (candidates.indexOf(next) + 1) % candidates.length;

  setActive(next);
  if (cycleTimer) clearTimeout(cycleTimer);
  cycleTimer = setTimeout(() => {
    cycleTimer = null;
    setActive(null);
    schedulePick(GAP_MS);
  }, ATC_CYCLE_MS);
}

export function registerAtcCard(id: string, el: Element, listener: Listener) {
  if (typeof window === "undefined") return () => {};
  ensureObserver();
  const prev = cards.get(id);
  if (prev?.el && observer) {
    try {
      observer.unobserve(prev.el);
    } catch {
      /* ignore */
    }
  }
  cards.set(id, { id, el, listener });
  (el as HTMLElement).dataset.atcId = id;
  observer?.observe(el);
  schedulePick(400);

  return () => {
    unregisterAtcCard(id);
  };
}

export function unregisterAtcCard(id: string) {
  const entry = cards.get(id);
  if (entry && observer) {
    try {
      observer.unobserve(entry.el);
    } catch {
      /* ignore */
    }
  }
  cards.delete(id);
  visible.delete(id);
  if (activeId === id) {
    clearActive();
    schedulePick(200);
  }
}
