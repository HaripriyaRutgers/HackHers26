"use client";
import { useEffect, useState } from "react";

const PHRASES = [
  "What kind of friend are you?",
  "How do you handle pressure?",
  "Who are you when no one's watching?",
  "Do you lead or follow?",
  "What does your heart cost?",
  "Your choices define you.",
  "Are you ready to find out?",
];

export default function TypewriterCycler() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex,   setCharIndex]   = useState(0);
  const [deleting,    setDeleting]    = useState(false);
  const [text,        setText]        = useState("");
  const [paused,      setPaused]      = useState(false);

  useEffect(() => {
    if (paused) {
      const t = setTimeout(() => setPaused(false), 1800);
      return () => clearTimeout(t);
    }

    const current = PHRASES[phraseIndex];

    if (!deleting && charIndex < current.length) {
      const t = setTimeout(() => {
        setText(current.slice(0, charIndex + 1));
        setCharIndex(i => i + 1);
      }, 55);
      return () => clearTimeout(t);
    }

    if (!deleting && charIndex === current.length) {
      setPaused(true);
      setTimeout(() => setDeleting(true), 1800);
      return;
    }

    if (deleting && charIndex > 0) {
      const t = setTimeout(() => {
        setText(current.slice(0, charIndex - 1));
        setCharIndex(i => i - 1);
      }, 28);
      return () => clearTimeout(t);
    }

    if (deleting && charIndex === 0) {
      setDeleting(false);
      setPhraseIndex(i => (i + 1) % PHRASES.length);
    }
  }, [charIndex, deleting, paused, phraseIndex]);

  return (
    <p
      className="text-center"
      style={{
        fontFamily: "'Courier New', monospace",
        fontSize: "clamp(0.9rem, 2.5vw, 1.25rem)",
        color: "#B19CD9",
        letterSpacing: "0.08em",
        minHeight: "2em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "2px",
      }}
    >
      {text}
      <span
        style={{
          display: "inline-block",
          width: "2px",
          height: "1.1em",
          backgroundColor: "#FFB7CE",
          marginLeft: "2px",
          animation: "blink 1s step-end infinite",
          verticalAlign: "middle",
        }}
      />
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </p>
  );
}