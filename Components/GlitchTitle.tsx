"use client";
import { useEffect, useState } from "react";

const FINAL = "MindQuest";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?";

// Each letter animates in separately with a scramble effect
// then locks into its final character — like a terminal boot sequence
export default function GlitchTitle() {
  const [displayed, setDisplayed] = useState<string[]>(
    Array(FINAL.length).fill("_")
  );
  const [locked, setLocked] = useState<boolean[]>(
    Array(FINAL.length).fill(false)
  );
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    FINAL.split("").forEach((char, i) => {
      // Start scrambling each letter with a staggered delay
      let scrambleCount = 0;
      const maxScramble = 8 + i * 3;

      const scramble = setInterval(() => {
        scrambleCount++;
        setDisplayed(prev => {
          const next = [...prev];
          next[i] = char === "." ? "." : CHARS[Math.floor(Math.random() * CHARS.length)];
          return next;
        });

        if (scrambleCount >= maxScramble) {
          clearInterval(scramble);
          const lockDelay = setTimeout(() => {
            setDisplayed(prev => { const n = [...prev]; n[i] = char; return n; });
            setLocked(prev  => { const n = [...prev]; n[i] = true;  return n; });
            if (i === FINAL.length - 1) {
              setTimeout(() => setDone(true), 300);
            }
          }, i * 60);
          timers.push(lockDelay);
        }
      }, 50);

      // Start each letter's scramble at a staggered time
      const startDelay = setTimeout(() => {}, i * 80);
      timers.push(startDelay);

      timers.push(
        setTimeout(() => {}, 0) // placeholder so cleanup works
      );
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <h1
      className="select-none"
      style={{
        fontFamily: "'Courier New', monospace",
        fontSize: "clamp(3.5rem, 10vw, 7rem)",
        fontWeight: 900,
        letterSpacing: "0.15em",
        lineHeight: 1,
      }}
    >
      {displayed.map((char, i) => (
        <span
          key={i}
          style={{
            color: locked[i] ? "#A0E9FF" : "#4a9aba",
            textShadow: locked[i]
              ? "0 0 30px rgba(160,233,255,0.6), 0 0 60px rgba(160,233,255,0.3)"
              : "0 0 10px rgba(74,154,186,0.4)",
            transition: locked[i] ? "color 0.2s, text-shadow 0.3s" : "none",
            display: "inline-block",
            animation: !locked[i] ? "flicker 0.1s infinite" : done ? "none" : "none",
          }}
        >
          {char}
        </span>
      ))}
      <style>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes pulse-glow {
          0%, 100% { text-shadow: 0 0 30px rgba(160,233,255,0.6), 0 0 60px rgba(160,233,255,0.3); }
          50% { text-shadow: 0 0 50px rgba(160,233,255,0.9), 0 0 100px rgba(160,233,255,0.5), 0 0 20px #fff; }
        }
      `}</style>
    </h1>
  );
}