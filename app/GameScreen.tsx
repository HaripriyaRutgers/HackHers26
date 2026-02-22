"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Star } from "lucide-react";

interface Choice {
  text: string;
  next: string;
  trait: string;
}

interface GameScreenProps {
  scene: { background: string };
  character: { name: string; position: string };
  dialogue: string;
  choices: Choice[];
  progress: number;
  xp: number;
  episode: number;
  totalEpisodes: number;
  onChoice: (choiceText: string) => void;
}

export default function GameScreen({
  scene,
  character,
  dialogue,
  choices,
  progress,
  xp,
  episode,
  totalEpisodes,
  onChoice,
}: GameScreenProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [showChoices, setShowChoices] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [textDone, setTextDone] = useState(false);

  // Reset and retype on new dialogue
  useEffect(() => {
    setDisplayedText("");
    setShowChoices(false);
    setTextDone(false);
    setIsTransitioning(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(dialogue.slice(0, i));
      if (i >= dialogue.length) {
        clearInterval(interval);
        setTextDone(true);
        setTimeout(() => setShowChoices(true), 600);
      }
    }, 28);
    return () => clearInterval(interval);
  }, [dialogue]);

  const handleChoice = (choiceText: string) => {
    setIsTransitioning(true);
    setShowChoices(false);
    setTimeout(() => onChoice(choiceText), 400);
  };

  // Skip typewriter on click
  const skipTypewriter = () => {
    if (!textDone) {
      setDisplayedText(dialogue);
      setTextDone(true);
      setTimeout(() => setShowChoices(true), 400);
    }
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{ background: "#0a0612" }}
      onClick={skipTypewriter}
    >
      {/* ── BACKGROUND ── */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${scene.background})` }}
      />
      {/* Dark cinematic overlay */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0a0612 0%, rgba(10,6,18,0.65) 50%, rgba(10,6,18,0.45) 100%)" }} />

      {/* ── TOP HUD ── */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 md:p-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Episode counter */}
          <div className="px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest"
            style={{ backgroundColor: "rgba(10,6,18,0.7)", color: "#A0E9FF", border: "1px solid rgba(160,233,255,0.3)", backdropFilter: "blur(10px)" }}>
            Episode {episode}/{totalEpisodes}
          </div>

          {/* Progress bar */}
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: "linear-gradient(to right, #A0E9FF, #B19CD9, #FFB7CE)" }}
            />
          </div>

          {/* XP */}
          <div className="px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2"
            style={{ backgroundColor: "rgba(10,6,18,0.7)", color: "#FFB7CE", border: "1px solid rgba(255,183,206,0.3)", backdropFilter: "blur(10px)" }}>
            <Star className="w-3.5 h-3.5" fill="currentColor" />
            {xp} XP
          </div>
        </div>
      </div>

      {/* ── CHARACTER SILHOUETTE ── */}
      <div className="absolute bottom-56 left-8 md:left-16 z-20 pointer-events-none">
        <div className="relative">
          {/* Glow under character */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-8 rounded-full blur-xl opacity-40"
            style={{ background: "#B19CD9" }} />
          {/* Silhouette shape */}
          <svg width="80" height="160" viewBox="0 0 80 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.85 }}>
            {/* Head */}
            <circle cx="40" cy="28" r="18" fill="#B19CD9" opacity="0.9"/>
            {/* Hair */}
            <ellipse cx="40" cy="16" rx="19" ry="10" fill="#7c5fa0"/>
            {/* Body */}
            <path d="M18 65 Q20 55 40 52 Q60 55 62 65 L66 130 Q66 140 56 140 L24 140 Q14 140 14 130 Z" fill="#B19CD9" opacity="0.85"/>
            {/* Neck */}
            <rect x="34" y="44" width="12" height="12" rx="4" fill="#B19CD9" opacity="0.9"/>
            {/* Arms */}
            <path d="M18 68 Q6 80 8 100 Q9 108 14 106 Q18 104 20 88 L22 72 Z" fill="#B19CD9" opacity="0.8"/>
            <path d="M62 68 Q74 80 72 100 Q71 108 66 106 Q62 104 60 88 L58 72 Z" fill="#B19CD9" opacity="0.8"/>
            {/* Legs */}
            <path d="M24 138 Q22 152 20 160 L32 160 L36 138 Z" fill="#9b7fc2" opacity="0.85"/>
            <path d="M56 138 Q58 152 60 160 L48 160 L44 138 Z" fill="#9b7fc2" opacity="0.85"/>
          </svg>
          {/* Name tag */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{ backgroundColor: "rgba(10,6,18,0.8)", color: "#FFB7CE", border: "1px solid rgba(255,183,206,0.4)" }}>
            {character.name}
          </div>
        </div>
      </div>

      {/* ── DIALOGUE BOX ── */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-4 md:p-6">
        <div className="max-w-5xl mx-auto">

          {/* Scene title nameplate */}
          <div className="inline-block mb-0 ml-2">
            <div className="px-6 py-2 rounded-t-xl"
              style={{ background: "linear-gradient(to right, #6b21a8, #3b0764)", border: "1px solid rgba(160,233,255,0.2)", borderBottom: "none" }}>
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "#A0E9FF" }}>
                {character.name}
              </span>
            </div>
          </div>

          {/* Main dialogue panel */}
          <div className="relative rounded-2xl rounded-tl-none p-6 md:p-8 overflow-hidden"
            style={{ backgroundColor: "rgba(10,6,18,0.92)", border: "2px solid rgba(160,233,255,0.2)", backdropFilter: "blur(20px)", boxShadow: "0 -8px 40px rgba(160,233,255,0.05)" }}>

            {/* Decorative corner lines */}
            <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 rounded-tl-2xl" style={{ borderColor: "rgba(160,233,255,0.4)" }} />
            <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 rounded-tr-2xl" style={{ borderColor: "rgba(255,183,206,0.4)" }} />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 rounded-bl-2xl" style={{ borderColor: "rgba(255,183,206,0.4)" }} />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 rounded-br-2xl" style={{ borderColor: "rgba(160,233,255,0.4)" }} />

            <p className="text-lg md:text-xl leading-relaxed font-serif relative z-10 min-h-[2rem]" style={{ color: "#f0e8ff" }}>
              {displayedText}
              {!textDone && <span className="inline-block w-0.5 h-5 ml-0.5 animate-pulse" style={{ backgroundColor: "#A0E9FF", verticalAlign: "middle" }} />}
            </p>

            {/* Continue arrow */}
            {textDone && !showChoices && (
              <div className="absolute bottom-4 right-6 flex items-center gap-1 text-sm animate-pulse" style={{ color: "#B19CD9" }}>
                <span>tap to continue</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* ── CHOICES ── */}
          {showChoices && choices.length > 0 && (
            <div className="mt-3 space-y-2">
              {choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); handleChoice(choice.text); }}
                  disabled={isTransitioning}
                  className="group w-full text-left transition-all hover:scale-[1.01] disabled:opacity-50"
                  style={{
                    backgroundColor: "rgba(20,12,35,0.88)",
                    border: "1.5px solid rgba(160,233,255,0.2)",
                    borderRadius: "14px",
                    padding: "14px 20px",
                    backdropFilter: "blur(10px)",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,183,206,0.6)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(160,233,255,0.2)")}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #A0E9FF, #B19CD9)", color: "#0a0612" }}>
                      {i + 1}
                    </div>
                    <p className="flex-1 font-medium text-base" style={{ color: "#f0e8ff" }}>{choice.text}</p>
                    <ChevronRight className="w-5 h-5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#FFB7CE" }} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}