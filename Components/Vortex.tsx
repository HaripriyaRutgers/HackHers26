"use client";
import { useEffect, useRef } from "react";

interface VortexProps {
  children: React.ReactNode;
}

// Matches the Inspira UI Vortex Background:
// purple + pink sparkling particles drifting/twinkling across a dark background
export default function Vortex({ children }: VortexProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width  = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      initParticles();
    };
    window.addEventListener("resize", onResize);

    interface Star {
      x: number; y: number;
      vx: number; vy: number;
      size: number;
      opacity: number;
      twinkleSpeed: number;
      twinkleOffset: number;
      color: string;
      glow: number;
    }

    // Color palette matching the screenshot — purple, violet, pink, white
    const COLORS = [
      "160,100,255",  // violet
      "200,80,255",   // purple
      "255,100,220",  // pink
      "180,120,255",  // lavender
      "255,180,255",  // light pink
      "220,160,255",  // soft purple
      "255,255,255",  // white sparkle
    ];

    let stars: Star[] = [];

    const initParticles = () => {
      const COUNT = Math.floor((W * H) / 6000); // density scales with screen size
      stars = Array.from({ length: Math.max(120, COUNT) }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.18 - 0.05,
        size: 0.5 + Math.random() * 2.5,
        opacity: 0.2 + Math.random() * 0.8,
        twinkleSpeed: 0.008 + Math.random() * 0.025,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        glow: 2 + Math.random() * 8,
      }));
    };
    initParticles();

    let tick = 0;
    let raf: number;

    const draw = () => {
      tick++;

      // Clear with very dark background
      ctx.fillStyle = "rgb(5, 3, 12)";
      ctx.fillRect(0, 0, W, H);

      stars.forEach(s => {
        // Move
        s.x += s.vx;
        s.y += s.vy;

        // Wrap around edges
        if (s.x < -10) s.x = W + 10;
        if (s.x > W + 10) s.x = -10;
        if (s.y < -10) s.y = H + 10;
        if (s.y > H + 10) s.y = -10;

        // Twinkle opacity
        const twinkle = 0.5 + 0.5 * Math.sin(tick * s.twinkleSpeed + s.twinkleOffset);
        const alpha = s.opacity * (0.4 + 0.6 * twinkle);

        // Glow halo
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * s.glow);
        grad.addColorStop(0,   `rgba(${s.color}, ${alpha})`);
        grad.addColorStop(0.3, `rgba(${s.color}, ${alpha * 0.4})`);
        grad.addColorStop(1,   `rgba(${s.color}, 0)`);

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.glow, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Hard bright center dot
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color}, ${Math.min(1, alpha * 1.5)})`;
        ctx.fill();

        // Occasional 4-point star sparkle on bright ones
        if (twinkle > 0.85 && s.size > 1.5) {
          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.strokeStyle = `rgba(${s.color}, ${alpha * 0.6})`;
          ctx.lineWidth = 0.5;
          const spLen = s.size * 4;
          ctx.beginPath();
          ctx.moveTo(-spLen, 0); ctx.lineTo(spLen, 0);
          ctx.moveTo(0, -spLen); ctx.lineTo(0, spLen);
          ctx.stroke();
          ctx.restore();
        }
      });

      // Subtle nebula clouds in background
      const nebulas = [
        { x: W * 0.2,  y: H * 0.3, r: 200, color: "100,50,200"  },
        { x: W * 0.75, y: H * 0.6, r: 250, color: "180,50,180"  },
        { x: W * 0.5,  y: H * 0.8, r: 180, color: "120,40,220"  },
      ];
      nebulas.forEach(n => {
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        g.addColorStop(0,   `rgba(${n.color}, 0.04)`);
        g.addColorStop(0.5, `rgba(${n.color}, 0.02)`);
        g.addColorStop(1,   `rgba(${n.color}, 0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden" style={{ background: "rgb(5,3,12)" }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <div className="relative flex flex-col min-h-screen" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}