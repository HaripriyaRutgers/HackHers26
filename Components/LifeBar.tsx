"use client";

interface LifeBarProps {
  current: number; // episodes completed
  total: number;   // total episodes
  label?: string;
}

// RPG-style life/health bar for the game HUD
export default function LifeBar({ current, total, label = "LIFE" }: LifeBarProps) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  // Color shifts as progress increases — green → yellow → red (like health depleting)
  const barColor =
    pct > 66 ? "#34d399" :
    pct > 33 ? "#fbbf24" :
               "#f87171";

  const glowColor =
    pct > 66 ? "rgba(52,211,153,0.6)" :
    pct > 33 ? "rgba(251,191,36,0.6)" :
               "rgba(248,113,113,0.6)";

  return (
    <div className="flex items-center gap-2" style={{ minWidth: 180 }}>
      {/* Label */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          fontWeight: 600,
          letterSpacing: "0.15em",
          color: barColor,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          textShadow: `0 0 8px ${glowColor}`,
          transition: "color 0.5s, text-shadow 0.5s",
        }}
      >
        {label}
      </span>

      {/* Bar track */}
      <div
        className="relative flex-1 rounded-full overflow-hidden"
        style={{
          height: 8,
          backgroundColor: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5)",
        }}
      >
        {/* Filled portion */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
            boxShadow: `0 0 8px ${glowColor}, 0 0 16px ${glowColor}`,
          }}
        />

        {/* Segment notches — like classic RPG health bars */}
        {Array.from({ length: total - 1 }, (_, i) => (
          <div
            key={i}
            className="absolute inset-y-0"
            style={{
              left: `${((i + 1) / total) * 100}%`,
              width: 1,
              backgroundColor: "rgba(0,0,0,0.4)",
            }}
          />
        ))}

        {/* Shine overlay */}
        <div
          className="absolute inset-x-0 top-0 rounded-full"
          style={{
            height: "40%",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)",
          }}
        />
      </div>

      {/* Fraction */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          color: "rgba(255,255,255,0.35)",
          whiteSpace: "nowrap",
        }}
      >
        {current}/{total}
      </span>
    </div>
  );
}