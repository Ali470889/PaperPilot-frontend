import { useEffect, useRef, useState } from "react";

export function InteractiveBubbleBackground({
  maxBubbles = 80,
  seedCount = 18,
  spawnIntervalMs = 180,
  cursorSpawnEveryNMoves = 10,
  speed = 1,
  quantity = 1,
  attract = false,
  buoyancy = -40,
  damping = 0.985,
  forceStrength = 22000,
  forceMax = 120,
  edgePadding = 120,
}) {
  const [bubbles, setBubbles] = useState([]);
  const bubblesRef = useRef([]);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const mouseRef = useRef({ x: -9999, y: -9999, moving: false, moveTick: 0 });
  const viewportRef = useRef({ w: 0, h: 0 });
  const spawnTimerRef = useRef(0);

  const cfgRef = useRef({
    maxBubbles,
    seedCount,
    spawnIntervalMs,
    cursorSpawnEveryNMoves,
    speed,
    quantity,
    attract,
    buoyancy,
    damping,
    forceStrength,
    forceMax,
    edgePadding,
  });

  useEffect(() => {
    cfgRef.current = {
      maxBubbles,
      seedCount,
      spawnIntervalMs,
      cursorSpawnEveryNMoves,
      speed: Math.max(0.05, speed),
      quantity: Math.max(0.05, quantity),
      attract,
      buoyancy,
      damping,
      forceStrength,
      forceMax,
      edgePadding,
    };
  }, [
    maxBubbles,
    seedCount,
    spawnIntervalMs,
    cursorSpawnEveryNMoves,
    speed,
    quantity,
    attract,
    buoyancy,
    damping,
    forceStrength,
    forceMax,
    edgePadding,
  ]);

  const gradientColors = useRef([
    "linear-gradient(135deg, #FFB347, #FFCC33)",
    "linear-gradient(135deg, #FF4500, #FFD700)",
    "linear-gradient(135deg, #FFA500, #FF6347)",
  ]);

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function newBubble({ x, y } = {}) {
    const { w, h } = viewportRef.current;
    const size = rand(18, 100);
    const startX = x ?? rand(0, w);
    const startY = y ?? h + size;
    const background = pick(gradientColors.current);
    return {
      id: Math.random().toString(36).slice(2),
      x: startX,
      y: startY,
      vx: rand(-10, 10),
      vy: rand(-5, 0),
      size,
      bg: background,
      opacity: rand(0.55, 0.9),
      rot: rand(0, 360),
      rotSpeed: rand(-10, 10),
    };
  }

  function commit() {
    setBubbles([...bubblesRef.current]);
  }

  useEffect(() => {
    function onResize() {
      viewportRef.current = { w: window.innerWidth, h: window.innerHeight };
    }
    onResize();
    window.addEventListener("resize", onResize);

    function onPointerMove(e) {
      const cfg = cfgRef.current;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.moving = true;
      mouseRef.current.moveTick++;
      if (
        bubblesRef.current.length < cfg.maxBubbles &&
        mouseRef.current.moveTick %
        Math.max(1, Math.floor(cfg.cursorSpawnEveryNMoves / cfg.quantity)) ===
        0
      ) {
        const jitter = () => rand(-25, 25);
        bubblesRef.current.push(
          newBubble({ x: e.clientX + jitter(), y: e.clientY + jitter() })
        );
      }
    }

    function onPointerLeave() {
      mouseRef.current.moving = false;
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);

    bubblesRef.current = Array.from(
      { length: cfgRef.current.seedCount },
      () => newBubble()
    );
    commit();

    function step(ts) {
      const cfg = cfgRef.current;
      const last = lastTsRef.current || ts;
      const rawDt = Math.min((ts - last) / 1000, 0.033);
      const dt = rawDt * cfg.speed;
      lastTsRef.current = ts;

      const { w, h } = viewportRef.current;
      const m = mouseRef.current;

      spawnTimerRef.current += rawDt * 1000 * cfg.quantity;
      if (spawnTimerRef.current >= cfg.spawnIntervalMs) {
        spawnTimerRef.current = 0;
        if (bubblesRef.current.length < cfg.maxBubbles) {
          bubblesRef.current.push(newBubble());
        }
      }

      for (let b of bubblesRef.current) {
        b.vy += cfg.buoyancy * dt;

        const dx = b.x - m.x;
        const dy = b.y - m.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > 25 && d2 < 80000) {
          const inv = 1 / Math.sqrt(d2);
          let ax = dx * inv * (cfg.forceStrength / d2);
          let ay = dy * inv * (cfg.forceStrength / d2);
          if (cfg.attract) {
            ax *= -1;
            ay *= -1;
          }
          const aMag = Math.sqrt(ax * ax + ay * ay);
          if (aMag > cfg.forceMax) {
            const scale = cfg.forceMax / aMag;
            ax *= scale;
            ay *= scale;
          }
          const moveScale = m.moving ? 1 : 0.5;
          b.vx += ax * dt * moveScale;
          b.vy += ay * dt * moveScale;
        }

        b.vx *= cfg.damping;
        b.vy *= cfg.damping;
        b.x += b.vx * dt / (rawDt || 1);
        b.y += b.vy * dt / (rawDt || 1);
        b.rot += b.rotSpeed * dt;
      }

      const pad = cfg.edgePadding;
      const next = bubblesRef.current.filter(
        (b) =>
          b.y > -pad && b.y < h + pad && b.x > -pad && b.x < w + pad
      );
      if (next.length > cfg.maxBubbles) next.length = cfg.maxBubbles;
      bubblesRef.current = next;

      if (Math.floor(ts / 32) !== Math.floor((ts - rawDt * 1000) / 32)) {
        commit();
      }

      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {bubbles.map((b) => {
        const size = b.size;
        const transform = `translate(${b.x - size / 2}px, ${b.y - size / 2
          }px) rotate(${b.rot}deg)`;
        return (
          <span
            key={b.id}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              backgroundImage: b.bg,
              opacity: b.opacity,
              filter: "blur(0.2px)",
              transform,
              willChange: "transform",
              transition: "opacity 200ms linear",
              pointerEvents: "none",
            }}
          />
        );
      })}
    </div>
  );
}
