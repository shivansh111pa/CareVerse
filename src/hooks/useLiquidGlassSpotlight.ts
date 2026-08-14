"use client";

import { useCallback, useEffect, useRef } from "react";

export function useLiquidGlassSpotlight<T extends HTMLElement = HTMLDivElement>(
  activeClass = "liquid-glass--active"
) {
  const ref = useRef<T>(null);
  const targetRef = useRef({ x: 50, y: 50 });
  const spotRef = useRef({ x: 50, y: 50 });
  const rafRef = useRef<number>();
  const hoveringRef = useRef(false);

  const setSpotVars = useCallback((x: number, y: number) => {
    ref.current?.style.setProperty("--spot-x", `${x}%`);
    ref.current?.style.setProperty("--spot-y", `${y}%`);
  }, []);

  const startLoop = useCallback(() => {
    const tick = () => {
      if (!hoveringRef.current) return;

      const lerp = 0.14;
      spotRef.current.x += (targetRef.current.x - spotRef.current.x) * lerp;
      spotRef.current.y += (targetRef.current.y - spotRef.current.y) * lerp;

      setSpotVars(spotRef.current.x, spotRef.current.y);
      rafRef.current = requestAnimationFrame(tick);
    };

    cancelAnimationFrame(rafRef.current ?? 0);
    rafRef.current = requestAnimationFrame(tick);
  }, [setSpotVars]);

  const stopLoop = useCallback(() => {
    hoveringRef.current = false;
    cancelAnimationFrame(rafRef.current ?? 0);
    ref.current?.classList.remove(activeClass);
    targetRef.current = { x: 50, y: 50 };
    spotRef.current = { x: 50, y: 50 };
    setSpotVars(50, 50);
  }, [activeClass, setSpotVars]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current ?? 0), []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<T>) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      targetRef.current = { x, y };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        spotRef.current = { x, y };
        setSpotVars(x, y);
      }
    },
    [setSpotVars]
  );

  const onMouseEnter = useCallback(() => {
    hoveringRef.current = true;
    ref.current?.classList.add(activeClass);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    startLoop();
  }, [activeClass, startLoop]);

  const onMouseLeave = useCallback(() => {
    stopLoop();
  }, [stopLoop]);

  return {
    ref,
    handlers: {
      onMouseMove,
      onMouseEnter,
      onMouseLeave,
    },
  };
}
