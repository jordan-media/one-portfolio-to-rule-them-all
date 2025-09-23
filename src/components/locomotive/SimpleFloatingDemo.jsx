import React, { useEffect, useLayoutEffect, useRef } from "react";

/**
 * CalmFloatingDemo
 * - Soft drift + drag
 * - Position-based separation (stable, no jitter)
 * - Wall keep-in
 * - Resize-aware
 */
export default function SimpleFloatingDemo() {
  const labels = ["React", "TypeScript", "Vite", "Node", "CSS", "GitHub Actions", "Accessibility", "Testing"];

  const containerRef = useRef(null);
  const itemsRef = useRef([]);         // [{el,x,y,vx,vy,r,phaseX,phaseY}]
  const sizeRef = useRef({ w: 0, h: 0 });
  const rafRef = useRef(0);

  // Build item slots once
  if (itemsRef.current.length !== labels.length) {
    itemsRef.current = labels.map(() => ({
      el: null,
      x: 0, y: 0,
      vx: (Math.random() - 0.9) * 10,  // px/s
      vy: (Math.random() - 0.5) * 10,
      r: 30,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
    }));
  }

  const setLeafEl = (i) => (el) => {
    itemsRef.current[i].el = el || null;
    if (el) {
      const rect = el.getBoundingClientRect();
      // Radius with buffer to avoid visual touching
      itemsRef.current[i].r = 0.6 * Math.max(rect.width, rect.height);
    }
  };

  // Measure container + reflow on resize
  useLayoutEffect(() => {
    const div = containerRef.current;
    if (!div) return;

    const measure = () => {
      const rect = div.getBoundingClientRect();
      sizeRef.current = { w: rect.width, h: rect.height };
      // Re-measure pill radii (font breakpoints)
      for (const it of itemsRef.current) {
        if (!it.el) continue;
        const r = it.el.getBoundingClientRect();
        it.r = 0.6 * Math.max(r.width, r.height);
      }
      // Seed positions if needed (or if out of bounds after resize)
      placeInitial();
      paint();
    };

    const ro = new ResizeObserver(measure);
    ro.observe(div);
    measure();

    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function placeInitial() {
    const { w, h } = sizeRef.current;
    if (!w || !h) return;
    const pad = 12;
    const topOffset = 56;

    for (let i = 0; i < itemsRef.current.length; i++) {
      const it = itemsRef.current[i];
      // Re-seed if not yet placed or if outside bounds (after resize)
      const out =
        it.x < pad + it.r ||
        it.x > w - pad - it.r ||
        it.y < pad + topOffset + it.r ||
        it.y > h - pad - it.r;

      if (it.x === 0 && it.y === 0 || out) {
        let tries = 0, ok = false;
        while (!ok && tries < 400) {
          const x = rand(pad + it.r, w - pad - it.r);
          const y = rand(pad + topOffset + it.r, h - pad - it.r);
          ok = true;
          for (let j = 0; j < i; j++) {
            const jt = itemsRef.current[j];
            const minD = it.r + jt.r + 8;
            if (dist2(x, y, jt.x, jt.y) < minD * minD) { ok = false; break; }
          }
          if (ok) { it.x = x; it.y = y; }
          tries++;
        }
      }
    }
  }

  function paint() {
    for (const it of itemsRef.current) {
      if (!it.el) continue;
      it.el.style.transform = `translate3d(${it.x}px, ${it.y}px, 0) translate(-50%, -50%)`;
    }
  }

  useEffect(() => {
    let last = performance.now();

    const step = (now) => {
      const dtSec = Math.min(0.032, (now - last) / 1000); // cap for stability
      last = now;

      simulate(dtSec, now / 1000);
      paint();
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  function simulate(dt, t) {
    const { w, h } = sizeRef.current;
    if (!w || !h) return;

    const items = itemsRef.current;
    const pad = 12;
    const topOffset = 56;

    // Drift params (very calm)
    const drag = 0.90;              // velocity damping per frame
    const windAmp = 69;              // px/s^2 magnitude
    const windFreqX = 0.15;         // Hz
    const windFreqY = .1;         // Hz
    const maxSpeed = 100;            // px/s cap (prevents runaway)

    // 1) integrate positions (with calm “current”)
    for (const it of items) {
      if (!it.el) continue;

      const ax = Math.cos(it.phaseX + t * 2 * Math.PI * windFreqX) * windAmp;
      const ay = Math.sin(it.phaseY + t * 2 * Math.PI * windFreqY) * windAmp;

      it.vx = (it.vx + ax * dt) * drag;
      it.vy = (it.vy + ay * dt) * drag;

      // speed cap
      const sp = Math.hypot(it.vx, it.vy);
      if (sp > maxSpeed) {
        const s = maxSpeed / sp;
        it.vx *= s; it.vy *= s;
      }

      it.x += it.vx * dt;
      it.y += it.vy * dt;

      // keep in bounds, gently
      const minX = pad + it.r, maxX = w - pad - it.r;
      const minY = pad + topOffset + it.r, maxY = h - pad - it.r;

      if (it.x < minX) { it.x = minX; it.vx *= -0.4; }
      if (it.x > maxX) { it.x = maxX; it.vx *= -0.4; }
      if (it.y < minY) { it.y = minY; it.vy *= -0.4; }
      if (it.y > maxY) { it.y = maxY; it.vy *= -0.4; }
    }

    // 2) position-based collisions (2 iterations → very stable)
    const iterations = 2;
    for (let k = 0; k < iterations; k++) {
      for (let i = 0; i < items.length; i++) {
        const a = items[i]; if (!a.el) continue;
        for (let j = i + 1; j < items.length; j++) {
          const b = items[j]; if (!b.el) continue;

          const dx = b.x - a.x, dy = b.y - a.y;
          const minD = a.r + b.r + 6;
          const d2 = dx * dx + dy * dy;
          if (d2 > 0 && d2 < minD * minD) {
            const d = Math.sqrt(d2) || 0.0001;
            const nx = dx / d, ny = dy / d;
            const overlap = minD - d;
            const push = overlap * 0.5; // split the correction

            // Only move positions (no velocity impulses → calmer)
            a.x -= nx * push; a.y -= ny * push;
            b.x += nx * push; b.y += ny * push;
          }
        }
      }
    }
  }

  return (
    <div className="w-full flex justify-center py-10">
      <div
        ref={containerRef}
        className="relative w-full max-w-xl h-80 rounded-2xl border border-white/15 bg-gradient-to-br from-slate-900 to-black overflow-hidden"
      >
        {/* Title / safe area */}
        <div className="absolute left-0 right-0 top-0 h-14 flex items-center px-4">
          <h3 className="text-sm font-black tracking-widest text-emerald-400">CALM DEMO</h3>
        </div>

        {/* Pills */}
        {labels.map((txt, i) => (
          <div
            key={i}
            ref={setLeafEl(i)}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none
                       bg-white/8 border border-white/15 rounded-full
                       px-3 py-1.5 text-xs font-medium text-white/90 shadow-sm
                       will-change-transform"
            style={{ transform: "translate3d(0,0,0) translate(-50%, -50%)" }}
            aria-hidden
          >
            {txt}
          </div>
        ))}
      </div>
    </div>
  );
}

/* helpers */
function rand(min, max) { return Math.random() * (max - min) + min; }
function dist2(ax, ay, bx, by) { const dx = ax - bx, dy = ay - by; return dx*dx + dy*dy; }
