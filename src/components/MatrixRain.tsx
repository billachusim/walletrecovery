import { useEffect, useRef } from "react";

export function MatrixRain({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = 0;
    const chars = "アイウエオカキクケコサシスセソタチツテトナヒフヘホ0123456789ABCDEFabcdef$#%*+=".split("");
    let cols = 0;
    let drops: number[] = [];
    const fontSize = 14;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(rect.width / fontSize);
      drops = Array.from({ length: cols }, () => Math.random() * -50);
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 55) return; // ~18fps
      last = t;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.fillStyle = "rgba(10, 20, 14, 0.15)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      for (let i = 0; i < cols; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillStyle = y < fontSize * 2 ? "rgba(200,255,200,0.9)" : "rgba(80,220,120,0.55)";
        ctx.fillText(text, x, y);
        if (y > h && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 opacity-40 ${className}`}
    />
  );
}
