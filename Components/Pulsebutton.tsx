"use client";
import { useState, useRef } from "react";

interface Ripple { id: number; x: number; y: number; }

interface PulseButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export default function PulseButton({ onClick, children }: PulseButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn  = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    const id   = Date.now();

    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700);
    onClick();
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      className="relative overflow-hidden px-16 py-5 rounded-full font-bold text-xl transition-all"
      style={{
        backgroundColor: "#FFB7CE",
        color: "#1A1221",
        boxShadow: "0 0 40px rgba(255,183,206,0.5)",
        animation: "heartbeat 2.5s ease-in-out infinite",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 70px rgba(255,183,206,0.85), 0 0 120px rgba(255,183,206,0.4)";
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.07)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 40px rgba(255,183,206,0.5)";
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
      }}
    >
      {/* Ripple rings */}
      {ripples.map(r => (
        <span
          key={r.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: r.x,
            top:  r.y,
            width: 10,
            height: 10,
            marginLeft: -5,
            marginTop:  -5,
            background: "rgba(255,255,255,0.5)",
            animation: "ripple-out 0.7s ease-out forwards",
          }}
        />
      ))}

      {children}

      <style>{`
        @keyframes heartbeat {
          0%, 100% { box-shadow: 0 0 40px rgba(255,183,206,0.5); transform: scale(1); }
          14%       { box-shadow: 0 0 60px rgba(255,183,206,0.8); transform: scale(1.04); }
          28%       { box-shadow: 0 0 40px rgba(255,183,206,0.5); transform: scale(1); }
          42%       { box-shadow: 0 0 55px rgba(255,183,206,0.7); transform: scale(1.02); }
          70%       { box-shadow: 0 0 40px rgba(255,183,206,0.5); transform: scale(1); }
        }
        @keyframes ripple-out {
          0%   { transform: scale(1);  opacity: 0.8; }
          100% { transform: scale(18); opacity: 0; }
        }
      `}</style>
    </button>
  );
}