"use client";

import Vortex from "@/Components/Vortex";
import GlitchTitle      from "@/Components/GlitchTitle";
import TypewriterCycler from "@/Components/Typewritercycler";
import PulseButton      from "@/Components/Pulsebutton";
import FlipCard         from "@/Components/Flipcard";
import FluidCursor      from "@/Components/FluidCursor";
import GlowDotCursor    from "@/Components/GlowDot";
import LifeBar          from "@/Components/LifeBar";

import { useState, useEffect } from "react";
import {
  Sparkles, BookOpen, Heart, Users, ActivitySquare,
  ChevronRight, Star, Home as HomeIcon, Library, User, TrendingUp
} from "lucide-react";

/* ══════════════════════════════════════════
   STORY DATA
══════════════════════════════════════════ */
const backgrounds: Record<string, string> = {
  academics: "https://images.unsplash.com/photo-1637455587265-2a3c2cbbcc84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  love:      "https://images.unsplash.com/photo-1713446697904-8e029eaa3453?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  family:    "https://images.unsplash.com/photo-1628624997995-0f1fd6f29dce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  health:    "https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
};

const themeColors: Record<string, string> = {
  academics: "#38bdf8",
  love:      "#f472b6",
  family:    "#a78bfa",
  health:    "#34d399",
};

const storyDataByTheme: Record<string, any[]> = {
  academics: [
    { title: "The Impossible Deadline", content: "It's 2 AM and you're staring at your laptop. Your final project is due in 6 hours, but you've barely started. Your roommate is asleep, and you notice an old project folder from a graduated senior that could be 'adapted.' Meanwhile, your phone buzzes—your study group asking if you're okay.", choices: [{ text: "Pull an all-nighter and do it yourself, no matter what", trait: "integrity" }, { text: "Use parts of the old project as 'inspiration'", trait: "pragmatism" }, { text: "Email the professor explaining the situation", trait: "honesty" }] },
    { title: "The Career Crossroads", content: "You've been offered two internships. One is at a prestigious company your parents dream about—stable, well-paying, but in a field you find boring. The other is a startup working on something you're passionate about, but it's unpaid and risky.", choices: [{ text: "Take the prestigious internship for stability", trait: "security" }, { text: "Follow your passion with the startup", trait: "risk" }, { text: "Try to negotiate a middle ground somehow", trait: "balance" }] },
    { title: "The Grade That Matters", content: "You got your midterm back—a C+. It's your hardest class, and you've been struggling all semester. Your scholarship requires a 3.5 GPA.", choices: [{ text: "Fight for every point and improve the grade", trait: "determination" }, { text: "Drop the class to protect your GPA", trait: "strategy" }, { text: "Switch to pass/fail and reduce pressure", trait: "pragmatism" }] },
    { title: "The Group Project Dilemma", content: "Your group project partner hasn't shown up to a single meeting. The project is worth 30% of your grade.", choices: [{ text: "Do their work yourself to ensure a good grade", trait: "self-reliance" }, { text: "Report them to the professor immediately", trait: "accountability" }, { text: "Reach out to understand what's going on", trait: "empathy" }] },
    { title: "The Networking Event", content: "There's a major career fair tonight with recruiters from your dream companies. But you also have a major exam tomorrow that you haven't studied for yet.", choices: [{ text: "Go to the career fair, this opportunity is rare", trait: "opportunity" }, { text: "Stay and study, academics come first", trait: "discipline" }, { text: "Go briefly then study late into the night", trait: "ambition" }] },
    { title: "The Research Opportunity", content: "A professor offers you a spot in their research lab. It's prestigious and looks great on resumes, but it's unpaid and requires 15 hours per week.", choices: [{ text: "Accept it, sacrifice sleep and social life", trait: "sacrifice" }, { text: "Decline politely and focus on current commitments", trait: "boundaries" }, { text: "Negotiate for fewer hours or course credit", trait: "negotiation" }] },
    { title: "The Major Decision", content: "You're halfway through college and realizing your major doesn't align with your passions anymore. Switching means an extra year of school and more debt.", choices: [{ text: "Switch majors and follow your true interest", trait: "courage" }, { text: "Finish current major, pursue passion as minor", trait: "compromise" }, { text: "Stay the course, it's too late to change", trait: "commitment" }] },
  ],
  love: [
    { title: "The Unexpected Confession", content: "Your best friend since freshman year just told you they have feelings for you. You never saw it coming. You value this friendship more than anything, but you're not sure if you feel the same way romantically.", choices: [{ text: "Be honest that you see them as a friend", trait: "honesty" }, { text: "Ask for time to process your feelings", trait: "thoughtfulness" }, { text: "Consider giving a relationship a try", trait: "openness" }] },
    { title: "The Distance Decision", content: "You've been dating for eight months, and it's been amazing. But summer is coming, and you got an opportunity abroad for three months.", choices: [{ text: "Take the opportunity, trust the relationship", trait: "independence" }, { text: "Stay for the relationship", trait: "commitment" }, { text: "Make a detailed plan for long-distance", trait: "planning" }] },
    { title: "The Heart's Truth", content: "You're in a relationship, but something feels off. You care about them, but you're not in love. Maybe you never were.", choices: [{ text: "End it respectfully and honestly", trait: "integrity" }, { text: "Give it more time to be sure", trait: "patience" }, { text: "Talk about your doubts openly", trait: "communication" }] },
    { title: "The Jealousy Test", content: "Your partner has become close friends with someone you find threatening. They study together, get coffee, share inside jokes.", choices: [{ text: "Express your feelings without accusations", trait: "vulnerability" }, { text: "Trust them completely and work on insecurity", trait: "trust" }, { text: "Ask to meet the friend to ease concerns", trait: "proactivity" }] },
    { title: "The Ex Returns", content: "Your ex texted. They want to talk, to apologize, maybe to try again. You've moved on—or have you?", choices: [{ text: "Hear them out, people can change", trait: "forgiveness" }, { text: "Decline politely, the past is the past", trait: "closure" }, { text: "Meet as friends with clear boundaries", trait: "maturity" }] },
    { title: "The Unequal Effort", content: "You're always the one planning dates, sending good morning texts, making compromises. You're exhausted from carrying the relationship alone.", choices: [{ text: "Have a serious conversation about needs", trait: "communication" }, { text: "Pull back and see if they notice", trait: "testing" }, { text: "End it, you deserve equal effort", trait: "self-worth" }] },
    { title: "The Future Talk", content: "You've been together for a year. They want to talk about the future—post-graduation plans, moving in together, long-term commitment.", choices: [{ text: "Commit to planning a future together", trait: "commitment" }, { text: "Be honest about your uncertainty", trait: "honesty" }, { text: "Suggest taking things one step at a time", trait: "caution" }] },
  ],
  family: [
    { title: "The Unexpected Call", content: "Your phone rings at midnight. It's your mom, and she's crying. Your parents are arguing about money again, and she wants you to come home this weekend.", choices: [{ text: "Go home immediately, family comes first", trait: "loyalty" }, { text: "Stay and prepare, but call to talk through it", trait: "balance" }, { text: "Promise to visit next weekend instead", trait: "boundaries" }] },
    { title: "The Family Expectations", content: "Thanksgiving dinner. Your relatives ask about your major for the hundredth time. Your uncle questions why you're not in pre-med like your cousin.", choices: [{ text: "Defend your choices passionately", trait: "assertiveness" }, { text: "Smile and change the subject diplomatically", trait: "avoidance" }, { text: "Explain your career path with patience", trait: "education" }] },
    { title: "The Secret You Keep", content: "Your parents think you're doing great. They don't know you changed your major, that you're seeing a therapist, or that you're questioning everything they planned for you.", choices: [{ text: "Tell them everything, no matter the consequences", trait: "honesty" }, { text: "Reveal one thing at a time, start small", trait: "caution" }, { text: "Keep the secret a bit longer until you're sure", trait: "protection" }] },
    { title: "The Financial Burden", content: "Your parents ask you to send money home to help with bills. You're already struggling with your own expenses, eating ramen most nights.", choices: [{ text: "Send the money despite your situation", trait: "sacrifice" }, { text: "Explain your own financial struggles honestly", trait: "transparency" }, { text: "Send a smaller amount as compromise", trait: "balance" }] },
    { title: "The Sibling Crisis", content: "Your younger sibling is failing high school and getting into trouble. Your parents want you to come home every weekend to 'be a role model' and tutor them.", choices: [{ text: "Go home every weekend as requested", trait: "duty" }, { text: "Set up weekly video tutoring sessions instead", trait: "adaptation" }, { text: "Suggest professional help or resources", trait: "resourcefulness" }] },
    { title: "The Cultural Conflict", content: "You want to study abroad next semester—an incredible opportunity for your major. Your family sees it as abandonment.", choices: [{ text: "Go abroad, it's your life and future", trait: "independence" }, { text: "Stay home to keep peace with family", trait: "harmony" }, { text: "Bring them into the planning to feel included", trait: "inclusion" }] },
    { title: "The Identity Question", content: "You've been hiding a significant part of your identity from your family. Living authentically at school but hiding at home is exhausting.", choices: [{ text: "Come out fully, embrace your truth", trait: "authenticity" }, { text: "Continue compartmentalizing for now", trait: "protection" }, { text: "Test the waters with subtle hints first", trait: "caution" }] },
  ],
  health: [
    { title: "The Breaking Point", content: "You haven't slept more than 4 hours in a week. You skipped three meals yesterday. Your friends say you seem different lately—distant, irritable.", choices: [{ text: "Schedule an appointment at student health services", trait: "self-care" }, { text: "Power through, just two more weeks until break", trait: "endurance" }, { text: "Drop some commitments to create breathing room", trait: "boundaries" }] },
    { title: "The Social Pressure", content: "Everyone's going out tonight. You've been invited to three different parties, and your friends are pressuring you to come.", choices: [{ text: "Go out briefly to make an appearance, then leave", trait: "compromise" }, { text: "Politely decline and have a self-care night", trait: "boundaries" }, { text: "Suggest a low-key alternative hangout", trait: "initiative" }] },
    { title: "The Stigma", content: "You've been considering therapy, but you're worried about what people will think. Your roommate made a joke about therapy being 'for weak people' last week.", choices: [{ text: "Make the appointment, your health matters most", trait: "self-advocacy" }, { text: "Try self-help resources first", trait: "caution" }, { text: "Talk to a trusted friend or mentor first", trait: "support-seeking" }] },
    { title: "The Substance Spiral", content: "What started as occasional stress relief has become a pattern. Whether it's drinking, smoking, or something else, you're using more frequently to cope.", choices: [{ text: "Reach out to counseling services immediately", trait: "courage" }, { text: "Cut back on your own gradually", trait: "self-control" }, { text: "Confide in a trusted friend for accountability", trait: "trust" }] },
    { title: "The Body Image Battle", content: "You catch yourself in the mirror and spiral. Social media makes it worse—everyone looks perfect, accomplished, happy.", choices: [{ text: "Seek help from student health or counseling", trait: "self-awareness" }, { text: "Unfollow triggering accounts and limit social media", trait: "boundaries" }, { text: "Talk to friends who might understand", trait: "openness" }] },
    { title: "The Panic Attack", content: "It happened in class—your heart racing, can't breathe, feeling like you're dying. Everyone stared as you rushed out.", choices: [{ text: "See a doctor and therapist about anxiety", trait: "help-seeking" }, { text: "Research and practice coping techniques", trait: "self-help" }, { text: "Email professor and explain the situation", trait: "transparency" }] },
    { title: "The Burnout Reality", content: "You can't remember the last time you felt excited about anything. Everything is gray, exhausting, meaningless.", choices: [{ text: "Take a leave of absence to prioritize recovery", trait: "self-preservation" }, { text: "See a therapist while maintaining schedule", trait: "balance" }, { text: "Reduce course load and commitments", trait: "adjustment" }] },
  ],
};

const themes = [
  { id: "academics", title: "The Semester Begins",    subtitle: "Academics",   description: "Navigate exams, projects, and career choices",         Icon: BookOpen,       chapter: 1 },
  { id: "love",      title: "Unexpected Connections", subtitle: "Love Life",   description: "Explore connections, heartbreak, and self-discovery",   Icon: Heart,          chapter: 2 },
  { id: "family",    title: "Voices From Home",       subtitle: "Family Life", description: "Balance expectations, relationships, and independence", Icon: Users,          chapter: 3 },
  { id: "health",    title: "Reality Check",          subtitle: "Health",      description: "Face challenges of mental wellness and self-care",      Icon: ActivitySquare, chapter: 4 },
];

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */
type Screen = "welcome" | "name" | "game" | "ending";
type Tab    = "home" | "chapters" | "profile";

interface ProfileData {
  analysis: string;
  archetype: { name: string; description: string };
  topTraits: string[];
  decisionStyle: { logic: number; emotion: number; risk: number; caution: number; independence: number; collaboration: number };
  insight: string;
}

const BG = "radial-gradient(ellipse at 60% 40%, #2d1f3f 0%, #0f0a1a 60%, #0a0612 100%)";

/* ══════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════ */
function Navbar({ activeTab, setTab }: { activeTab: Tab; setTab: (t: Tab) => void }) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{
        backgroundColor: "rgba(5,3,12,0.7)",
        borderBottom: "1px solid rgba(160,233,255,0.08)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <button
        onClick={() => setTab("home")}
        style={{ background: "none", border: "none", padding: 0 }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "1.35rem",
            letterSpacing: "0.18em",
            background: "linear-gradient(90deg, #A0E9FF 0%, #c4b5fd 50%, #FFB7CE 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          MindQuest
        </span>
      </button>

      <div className="flex items-center gap-1">
        {([
          { id: "home"     as Tab, label: "Home"     },
          { id: "chapters" as Tab, label: "Chapters" },
          { id: "profile"  as Tab, label: "Profile"  },
        ] as const).map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="px-4 py-2 rounded-full text-sm transition-all"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: activeTab === id ? 700 : 500,
              letterSpacing: "0.06em",
              color: activeTab === id ? "#FFB7CE" : "#7c6a96",
              border: activeTab === id ? "1px solid rgba(255,183,206,0.4)" : "1px solid transparent",
              backgroundColor: activeTab === id ? "rgba(255,183,206,0.08)" : "transparent",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════════
   CHARACTER SPRITE
══════════════════════════════════════════ */
function CharacterSprite({ name }: { name: string }) {
  return (
    <div className="absolute bottom-52 left-8 md:left-16 z-20 pointer-events-none select-none">
      <div className="relative">
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-6 rounded-full blur-xl opacity-40" style={{ background: "#B19CD9" }} />
        <svg width="80" height="155" viewBox="0 0 80 155" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.88 }}>
          <circle cx="40" cy="26" r="17" fill="#B19CD9" opacity="0.9"/>
          <ellipse cx="40" cy="14" rx="18" ry="10" fill="#7c5fa0"/>
          <path d="M18 62 Q20 52 40 49 Q60 52 62 62 L65 125 Q65 135 55 135 L25 135 Q15 135 15 125 Z" fill="#B19CD9" opacity="0.85"/>
          <rect x="34" y="41" width="12" height="11" rx="4" fill="#B19CD9" opacity="0.9"/>
          <path d="M18 65 Q6 77 8 97 Q9 105 14 103 Q18 101 20 85 L22 69 Z" fill="#B19CD9" opacity="0.8"/>
          <path d="M62 65 Q74 77 72 97 Q71 105 66 103 Q62 101 60 85 L58 69 Z" fill="#B19CD9" opacity="0.8"/>
          <path d="M25 133 Q23 147 21 155 L33 155 L37 133 Z" fill="#9b7fc2" opacity="0.85"/>
          <path d="M55 133 Q57 147 59 155 L47 155 L43 133 Z" fill="#9b7fc2" opacity="0.85"/>
        </svg>
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
          style={{ backgroundColor: "rgba(10,6,18,0.85)", color: "#FFB7CE", border: "1px solid rgba(255,183,206,0.4)" }}>{name}</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   RADAR CHART
══════════════════════════════════════════ */
function RadarChart({ data }: { data: Record<string, number> }) {
  const labels = ["Logic", "Emotion", "Risk", "Caution", "Independence", "Collaboration"];
  const keys   = ["logic", "emotion", "risk", "caution", "independence", "collaboration"];
  const cx = 130, cy = 130, r = 90;
  const n = labels.length;
  const angleOf = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pointAt = (i: number, val: number) => {
    const a = angleOf(i);
    const pct = val / 100;
    return { x: cx + r * pct * Math.cos(a), y: cy + r * pct * Math.sin(a) };
  };
  const dataPoints = keys.map((k, i) => pointAt(i, data[k] || 0));
  const polyPoints = dataPoints.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox="0 0 260 260" className="w-full max-w-xs mx-auto">
      {[25, 50, 75, 100].map(pct => {
        const pts = Array.from({ length: n }, (_, i) => pointAt(i, pct));
        return <polygon key={pct} points={pts.map(p => `${p.x},${p.y}`).join(" ")} fill="none" stroke="rgba(160,233,255,0.12)" strokeWidth="1" />;
      })}
      {Array.from({ length: n }, (_, i) => {
        const end = pointAt(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="rgba(160,233,255,0.18)" strokeWidth="1" />;
      })}
      <polygon points={polyPoints} fill="rgba(160,233,255,0.15)" stroke="#A0E9FF" strokeWidth="2" />
      {dataPoints.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#A0E9FF" />)}
      {labels.map((label, i) => {
        const a = angleOf(i);
        const lx = cx + (r + 18) * Math.cos(a);
        const ly = cy + (r + 18) * Math.sin(a);
        return <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#B19CD9" fontWeight="600">{label}</text>;
      })}
    </svg>
  );
}

/* ══════════════════════════════════════════
   TRAIT BAR
══════════════════════════════════════════ */
function TraitBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-semibold" style={{ color: "#B19CD9" }}>
        <span>{label}</span><span style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   CHAPTERS TAB
══════════════════════════════════════════ */
function ChaptersTab({ characterName, xp, completedThemes, onStartChapter }: {
  characterName: string;
  xp: number;
  completedThemes: string[];
  onStartChapter: (id: string) => void;
}) {
  const level   = Math.floor(xp / 150) + 1;
  const levelXp = xp % 150;

  return (
    <div className="min-h-screen pt-20 px-6 pb-10" style={{ background: BG }}>
      <GlowDotCursor />
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-1 pt-4">
          <h1 className="text-4xl font-black" style={{ color: "#A0E9FF", fontFamily: "Georgia, serif" }}>
            {characterName || "Your"}'s Journey
          </h1>
          <p style={{ color: "#B19CD9" }}>Choose your next chapter</p>
        </div>

        <div className="flex items-center gap-4 px-6 py-4 rounded-2xl"
          style={{ backgroundColor: "rgba(45,31,63,0.5)", border: "1px solid rgba(160,233,255,0.2)" }}>
          <Star className="w-5 h-5 flex-shrink-0" style={{ color: "#FFD700" }} fill="#FFD700" />
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs font-semibold" style={{ color: "#B19CD9" }}>
              <span>Self-Awareness Points</span>
              <span>Level {level} &nbsp;<span style={{ color: "#A0E9FF" }}>{levelXp} / 150</span></span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
              <div className="h-full rounded-full transition-all"
                style={{ width: `${(levelXp / 150) * 100}%`, background: "linear-gradient(to right, #A0E9FF, #FFB7CE)" }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {themes.map(({ id, title, subtitle, description, Icon, chapter }) => {
            const done  = completedThemes.includes(id);
            const color = themeColors[id];
            return (
              <FlipCard key={id} color={color}
                front={
                  <div className="w-full h-full flex flex-col">
                    <div className="h-36 flex items-center justify-center flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${color}44, ${color}18)` }}>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${color}22`, border: `2px solid ${color}66` }}>
                        <Icon className="w-8 h-8" style={{ color }} />
                      </div>
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color }}>Chapter {chapter}</p>
                        <h3 className="text-xl font-black" style={{ color: "#f0e8ff" }}>{title}</h3>
                        <p className="text-xs mt-1" style={{ color: "#B19CD9" }}>7 episodes · 150 XP</p>
                      </div>
                      <div className="space-y-1 mt-3">
                        <div className="flex justify-between text-xs" style={{ color: "#7c6a96" }}>
                          <span>Progress</span><span>{done ? "7/7" : "0/7"}</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                          <div className="h-full rounded-full" style={{ width: done ? "100%" : "0%", background: color }} />
                        </div>
                      </div>
                      <p className="text-xs mt-3 italic" style={{ color: "#4a3f5c" }}>Hover to learn more →</p>
                    </div>
                  </div>
                }
                back={
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color }}>{subtitle}</p>
                      <h3 className="text-2xl font-black mb-3" style={{ color: "#f0e8ff" }}>{title}</h3>
                      <p className="text-sm leading-relaxed border-t pt-3" style={{ color: "#c4b5d4", borderColor: `${color}44` }}>{description}</p>
                      <div className="mt-4 flex items-center gap-2 flex-wrap">
                        <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}44` }}>7 episodes</span>
                        <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(255,183,206,0.12)", color: "#FFB7CE", border: "1px solid rgba(255,183,206,0.3)" }}>150 XP</span>
                        {done && <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(52,211,153,0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }}>✓ Done</span>}
                      </div>
                    </div>
                    <button onClick={() => onStartChapter(id)} disabled={done}
                      className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed mt-4"
                      style={{ background: done ? "rgba(255,255,255,0.06)" : color, color: done ? "#7c6a96" : "#0a0612" }}>
                      {done ? "✓ Completed" : "Start Chapter"}
                    </button>
                  </div>
                }
              />
            );
          })}
        </div>

        <p className="text-center text-xs pb-4" style={{ color: "#4a3f5c" }}>
          Your choices shape your journey and unlock deeper insights
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   PROFILE TAB
══════════════════════════════════════════ */
function ProfileTab({ characterName, xp, traits, profile, isLoading }: {
  characterName: string; xp: number; traits: string[]; profile: ProfileData | null; isLoading: boolean
}) {
  const [activeSection, setActiveSection] = useState<"profile" | "reflection">("profile");

  if (!characterName) return (
    <div className="min-h-screen pt-20 flex items-center justify-center" style={{ background: BG }}>
      <GlowDotCursor />
      <div className="text-center space-y-4 px-8">
        <div className="text-6xl">🎮</div>
        <h2 className="text-2xl font-black" style={{ color: "#A0E9FF" }}>Play a story first!</h2>
        <p style={{ color: "#B19CD9" }}>Your profile will appear here after you complete a chapter.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-16" style={{ background: BG }}>
      <GlowDotCursor />
      <div className="flex">
        <div className="w-56 flex-shrink-0 p-4 pt-6 space-y-2 sticky top-16 h-screen">
          {([
            { id: "profile"    as const, label: "Profile",    Icon: User },
            { id: "reflection" as const, label: "Reflection", Icon: TrendingUp },
          ]).map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setActiveSection(id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{
                backgroundColor: activeSection === id ? "rgba(255,183,206,0.15)" : "transparent",
                border: activeSection === id ? "1.5px solid rgba(255,183,206,0.5)" : "1.5px solid transparent",
                color: activeSection === id ? "#FFB7CE" : "#B19CD9",
              }}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        <div className="flex-1 px-6 py-6 overflow-y-auto space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 pt-20">
              <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#A0E9FF" }} />
              <p className="text-lg italic" style={{ color: "#B19CD9" }}>Generating your profile...</p>
            </div>
          ) : profile ? (
            <>
              {activeSection === "profile" && (
                <>
                  <h1 className="text-4xl font-black text-center" style={{ color: "#A0E9FF" }}>YOUR PROFILE</h1>
                  <p className="text-center text-sm" style={{ color: "#B19CD9" }}>A psychological portrait based on your narrative choices</p>
                  <div className="p-6 rounded-2xl space-y-4" style={{ backgroundColor: "rgba(45,31,63,0.6)", border: "1.5px solid rgba(160,233,255,0.25)" }}>
                    <div className="flex items-start gap-5">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 text-4xl"
                        style={{ background: "linear-gradient(135deg, rgba(160,233,255,0.2), rgba(255,183,206,0.2))", border: "2px solid rgba(160,233,255,0.3)" }}>🧠</div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-black" style={{ color: "#A0E9FF" }}>{profile.archetype.name}</h2>
                        <p className="text-xs mt-0.5 mb-3" style={{ color: "#7c6a96" }}>Archetype determined by {traits.length} narrative decisions</p>
                        <div className="flex gap-4 text-center mb-3">
                          <div><p className="text-2xl font-black" style={{ color: "#FFB7CE" }}>1</p><p className="text-xs" style={{ color: "#7c6a96" }}>Stories</p></div>
                          <div><p className="text-2xl font-black" style={{ color: "#FFB7CE" }}>{traits.length}</p><p className="text-xs" style={{ color: "#7c6a96" }}>Choices</p></div>
                          <div><p className="text-2xl font-black" style={{ color: "#FFB7CE" }}>{xp}</p><p className="text-xs" style={{ color: "#7c6a96" }}>XP</p></div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {profile.topTraits.map((t: string) => (
                            <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                              style={{ backgroundColor: "rgba(160,233,255,0.12)", border: "1px solid rgba(160,233,255,0.3)", color: "#A0E9FF" }}>{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#c4b5d4" }}>{profile.archetype.description}</p>
                  </div>

                  <div className="p-6 rounded-2xl" style={{ backgroundColor: "rgba(45,31,63,0.5)", border: "1.5px solid rgba(160,233,255,0.15)" }}>
                    <h3 className="text-lg font-black mb-4 flex items-center gap-2" style={{ color: "#A0E9FF" }}>
                      <TrendingUp className="w-5 h-5" /> Trait Overview
                    </h3>
                    <RadarChart data={profile.decisionStyle} />
                  </div>

                  <div className="p-6 rounded-2xl space-y-5" style={{ backgroundColor: "rgba(45,31,63,0.5)", border: "1.5px solid rgba(160,233,255,0.15)" }}>
                    <h3 className="text-lg font-black" style={{ color: "#A0E9FF" }}>Decision Traits</h3>
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: "rgba(10,6,18,0.4)", border: "1px solid rgba(160,233,255,0.1)" }}>
                        <p className="text-sm font-bold" style={{ color: "#f0e8ff" }}>🧠 Logic vs. Emotion</p>
                        <TraitBar label="Logic"   value={profile.decisionStyle.logic}   color="#38bdf8" />
                        <TraitBar label="Emotion" value={profile.decisionStyle.emotion} color="#f472b6" />
                      </div>
                      <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: "rgba(10,6,18,0.4)", border: "1px solid rgba(160,233,255,0.1)" }}>
                        <p className="text-sm font-bold" style={{ color: "#f0e8ff" }}>⚡ Risk vs. Caution</p>
                        <TraitBar label="Risk"    value={profile.decisionStyle.risk}    color="#38bdf8" />
                        <TraitBar label="Caution" value={profile.decisionStyle.caution} color="#f472b6" />
                      </div>
                      <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: "rgba(10,6,18,0.4)", border: "1px solid rgba(160,233,255,0.1)" }}>
                        <p className="text-sm font-bold" style={{ color: "#f0e8ff" }}>🤝 Independence vs. Collaboration</p>
                        <TraitBar label="Independence"  value={profile.decisionStyle.independence}  color="#38bdf8" />
                        <TraitBar label="Collaboration" value={profile.decisionStyle.collaboration} color="#f472b6" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeSection === "reflection" && (
                <>
                  <h1 className="text-4xl font-black text-center" style={{ color: "#A0E9FF" }}>YOUR REFLECTION</h1>
                  <p className="text-center text-sm" style={{ color: "#B19CD9" }}>What your story choices reveal about you</p>
                  <div className="relative p-8 rounded-3xl" style={{ backgroundColor: "rgba(45,31,63,0.6)", border: "2px solid rgba(160,233,255,0.25)" }}>
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 rounded-tl-3xl" style={{ borderColor: "#A0E9FF" }} />
                    <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 rounded-tr-3xl" style={{ borderColor: "#FFB7CE" }} />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 rounded-bl-3xl" style={{ borderColor: "#FFB7CE" }} />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 rounded-br-3xl" style={{ borderColor: "#A0E9FF" }} />
                    <p className="text-lg leading-relaxed font-serif italic" style={{ color: "#f0e8ff" }}>{profile.analysis}</p>
                  </div>
                  <div className="p-6 rounded-2xl space-y-3" style={{ backgroundColor: "rgba(45,31,63,0.5)", border: "1.5px solid rgba(160,233,255,0.15)" }}>
                    <h3 className="text-xl font-black" style={{ color: "#A0E9FF" }}>About Your Archetype</h3>
                    <p className="text-sm leading-relaxed">
                      <span className="font-bold" style={{ color: "#A0E9FF" }}>{profile.archetype.name}</span>
                      <span style={{ color: "#c4b5d4" }}> — {profile.archetype.description}</span>
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl text-center" style={{ backgroundColor: "rgba(255,183,206,0.08)", border: "1.5px solid rgba(255,183,206,0.3)" }}>
                    <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#FFB7CE" }}>Core Insight</p>
                    <p className="text-xl font-bold italic" style={{ color: "#f0e8ff" }}>"{profile.insight}"</p>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 pt-20">
              <div className="text-6xl">📖</div>
              <p className="text-lg" style={{ color: "#B19CD9" }}>Complete a story to see your profile here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════ */
export default function Home() {
  const [tab, setTab]                     = useState<Tab>("home");
  const [screen, setScreen]               = useState<Screen>("welcome");
  const [nameInput, setNameInput]         = useState("");
  const [characterName, setCharacterName] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [chapterIndex, setChapterIndex]   = useState(0);
  const [traits, setTraits]               = useState<string[]>([]);
  const [completedThemes, setCompletedThemes] = useState<string[]>([]);
  const [aiProfile, setAiProfile]         = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading]         = useState(false);
  const [xp, setXp]                       = useState(0);
  const [showXp, setShowXp]               = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [textDone, setTextDone]           = useState(false);
  const [showChoices, setShowChoices]     = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const chapters = storyDataByTheme[selectedTheme] || [];
  const chapter  = chapters[chapterIndex];

  useEffect(() => {
    if (screen !== "game" || !chapter) return;
    setDisplayedText(""); setTextDone(false); setShowChoices(false); setIsTransitioning(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayedText(chapter.content.slice(0, i));
      if (i >= chapter.content.length) { clearInterval(iv); setTextDone(true); setTimeout(() => setShowChoices(true), 500); }
    }, 25);
    return () => clearInterval(iv);
  }, [chapterIndex, screen, selectedTheme]);

  const skipTypewriter = () => {
    if (!textDone && chapter) { setDisplayedText(chapter.content); setTextDone(true); setTimeout(() => setShowChoices(true), 300); }
  };

  const startChapter = (themeId: string) => {
    setSelectedTheme(themeId);
    setChapterIndex(0);
    setScreen("game");
    setTab("home");
  };

  const handleChoice = async (trait: string) => {
    setIsTransitioning(true); setShowChoices(false);
    const updatedTraits = [...traits, trait];
    setTraits(updatedTraits); setXp(p => p + 20); setShowXp(true);
    setTimeout(() => setShowXp(false), 1400);
    setTimeout(async () => {
      if (chapterIndex < chapters.length - 1) {
        setChapterIndex(i => i + 1);
      } else {
        setCompletedThemes(prev => [...prev, selectedTheme]);
        setScreen("ending");
        setIsLoading(true);
        try {
          const res  = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ traits: updatedTraits, name: characterName }) });
          const data = await res.json();
          setAiProfile(data.profile || null);
        } catch { /* silent */ }
        finally { setIsLoading(false); }
      }
    }, 500);
  };

  const restart = () => {
    setScreen("welcome"); setChapterIndex(0); setTraits([]); setXp(0);
    setNameInput(""); setCharacterName(""); setSelectedTheme(""); setAiProfile(null);
  };

  /* ── TAB OVERRIDES ── */
  if (tab === "chapters") return (
    <>
      <Navbar activeTab={tab} setTab={setTab} />
      <ChaptersTab characterName={characterName} xp={xp} completedThemes={completedThemes} onStartChapter={startChapter} />
    </>
  );

  if (tab === "profile") return (
    <>
      <Navbar activeTab={tab} setTab={setTab} />
      <ProfileTab characterName={characterName} xp={xp} traits={traits} profile={aiProfile} isLoading={isLoading} />
    </>
  );

  /* ── WELCOME ── */
  if (screen === "welcome") return (
    <>
      <FluidCursor />
      <Vortex>
        <Navbar activeTab="home" setTab={setTab} />
        <div className="flex-1 flex items-center justify-center" style={{ minHeight: "100vh" }}>
          <div className="flex flex-col items-center justify-center text-center gap-8 px-8" style={{ marginTop: "-60px" }}>
            <GlitchTitle />
            <TypewriterCycler />
            <div className="flex items-center gap-3" style={{ opacity: 0.6 }}>
              <Sparkles className="w-4 h-4" style={{ color: "#FFB7CE" }} />
              <p className="text-sm tracking-[0.3em] uppercase" style={{ color: "#B19CD9" }}>Choose. Play. Reflect</p>
              <Sparkles className="w-4 h-4" style={{ color: "#FFB7CE" }} />
            </div>
            <PulseButton onClick={() => setScreen("name")}>Start Game</PulseButton>
          </div>
        </div>
      </Vortex>
    </>
  );

  /* ── NAME ── */
  if (screen === "name") return (
    <div className="min-h-screen flex flex-col" style={{ background: BG }}>
      <GlowDotCursor />
      <Navbar activeTab="home" setTab={setTab} />
      <div className="flex-1 flex items-center justify-center pt-16">
        <div className="w-full max-w-lg px-8 space-y-8">
          <h2 className="text-5xl font-black text-center tracking-widest uppercase" style={{ color: "#A0E9FF" }}>Enter Your Name</h2>
          <input type="text" value={nameInput} onChange={e => setNameInput(e.target.value)}
            placeholder="Your character's name..."
            onKeyDown={e => { if (e.key === "Enter" && nameInput.trim()) { setCharacterName(nameInput.trim()); setTab("chapters"); }}}
            autoFocus className="w-full px-8 py-5 rounded-2xl text-lg focus:outline-none border-2"
            style={{ backgroundColor: "rgba(45,31,63,0.6)", borderColor: "#FFB7CE", color: "#f5f3ff", boxShadow: "0 0 30px rgba(255,183,206,0.3)" }} />
          <div className="flex gap-4">
            <button onClick={() => setScreen("welcome")} className="flex-1 py-4 rounded-2xl border-2 font-semibold"
              style={{ borderColor: "#B19CD9", color: "#B19CD9", backgroundColor: "rgba(177,156,217,0.1)" }}>Back</button>
            <button onClick={() => { if (nameInput.trim()) { setCharacterName(nameInput.trim()); setTab("chapters"); }}}
              disabled={!nameInput.trim()} className="flex-1 py-4 rounded-2xl font-bold transition-all hover:scale-105 disabled:opacity-40"
              style={{ backgroundColor: "#FFB7CE", color: "#1A1221" }}>Continue →</button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── ENDING ── */
  if (screen === "ending") return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: BG }}>
      <GlowDotCursor />
      <Navbar activeTab="home" setTab={setTab} />
      <div className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: "#A0E9FF" }} />
      <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: "#FFB7CE" }} />
      <div className="flex-1 flex items-center justify-center pt-16 px-8">
        <div className="relative z-10 text-center max-w-2xl w-full space-y-8">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-widest" style={{ color: "#B19CD9" }}>Chapter Complete</p>
            <h1 className="text-5xl font-black" style={{ color: "#A0E9FF", fontFamily: "Georgia, serif" }}>{characterName}'s Reflection</h1>
            <p className="text-sm" style={{ color: "#B19CD9" }}>{xp} XP · {traits.length} choices</p>
          </div>
          <div className="relative p-8 rounded-3xl border-2" style={{ backgroundColor: "rgba(45,31,63,0.7)", borderColor: "rgba(160,233,255,0.3)", backdropFilter: "blur(20px)" }}>
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 rounded-tl-3xl" style={{ borderColor: "#A0E9FF" }} />
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 rounded-tr-3xl" style={{ borderColor: "#FFB7CE" }} />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 rounded-bl-3xl" style={{ borderColor: "#FFB7CE" }} />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 rounded-br-3xl" style={{ borderColor: "#A0E9FF" }} />
            {isLoading ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#A0E9FF" }} />
                <p className="text-lg italic" style={{ color: "#B19CD9" }}>Generating your profile...</p>
              </div>
            ) : (
              <p className="text-xl leading-relaxed font-serif italic" style={{ color: "#f0e8ff" }}>{aiProfile?.analysis || "Your story has been recorded."}</p>
            )}
          </div>
          {!isLoading && (
            <div className="flex gap-4 justify-center">
              <button onClick={() => setTab("profile")} className="px-8 py-4 rounded-full font-bold text-base transition-transform hover:scale-105"
                style={{ backgroundColor: "#A0E9FF", color: "#0a0612" }}>View Full Profile</button>
              <button onClick={restart} className="px-8 py-4 rounded-full font-bold text-base transition-transform hover:scale-105"
                style={{ backgroundColor: "#FFB7CE", color: "#1A1221", boxShadow: "0 0 30px rgba(255,183,206,0.4)" }}>Play Again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  /* ── GAME ── */
  if (!chapter) return null;
  return (
    <div className="relative w-full h-screen overflow-hidden" onClick={skipTypewriter} style={{ background: "#0a0612" }}>
      <GlowDotCursor />
      <Navbar activeTab="home" setTab={setTab} />
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backgrounds[selectedTheme]})` }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0a0612 0%, rgba(10,6,18,0.65) 50%, rgba(10,6,18,0.38) 100%)" }} />

      {/* HUD */}
      <div className="absolute top-16 left-0 right-0 z-30 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <div className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap"
            style={{ fontFamily: "var(--font-mono)", backgroundColor: "rgba(10,6,18,0.75)", color: "#A0E9FF", border: "1px solid rgba(160,233,255,0.3)", backdropFilter: "blur(10px)" }}>
            EP {chapterIndex + 1}/{chapters.length}
          </div>
          <div className="flex-1">
            <LifeBar current={chapterIndex + 1} total={chapters.length} label="LIFE PROGRESS" />
          </div>
          <div className="px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
            style={{ fontFamily: "var(--font-mono)", backgroundColor: "rgba(10,6,18,0.75)", color: "#FFB7CE", border: "1px solid rgba(255,183,206,0.3)", backdropFilter: "blur(10px)" }}>
            <Star className="w-3 h-3" fill="currentColor" />{xp} XP
          </div>
        </div>
      </div>

      {showXp && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full flex items-center gap-2 font-bold text-sm animate-bounce"
          style={{ backgroundColor: "#FFB7CE", color: "#1A1221" }}>
          <Sparkles className="w-4 h-4" />+20 XP
        </div>
      )}

      <CharacterSprite name={characterName} />

      {/* Dialogue */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="inline-block mb-0 ml-2">
            <div className="px-5 py-1.5 rounded-t-xl" style={{ background: "linear-gradient(to right, #6b21a8, #3b0764)", border: "1px solid rgba(160,233,255,0.2)", borderBottom: "none" }}>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#A0E9FF" }}>{chapter.title}</span>
            </div>
          </div>
          <div className="relative rounded-2xl rounded-tl-none p-6 md:p-7"
            style={{ backgroundColor: "rgba(10,6,18,0.93)", border: "2px solid rgba(160,233,255,0.2)", backdropFilter: "blur(20px)" }}>
            <div className="absolute top-0 left-0 w-10 h-10 border-l-2 border-t-2 rounded-tl-2xl" style={{ borderColor: "rgba(160,233,255,0.4)" }} />
            <div className="absolute top-0 right-0 w-10 h-10 border-r-2 border-t-2 rounded-tr-2xl" style={{ borderColor: "rgba(255,183,206,0.4)" }} />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-l-2 border-b-2 rounded-bl-2xl" style={{ borderColor: "rgba(255,183,206,0.4)" }} />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-r-2 border-b-2 rounded-br-2xl" style={{ borderColor: "rgba(160,233,255,0.4)" }} />
            <p className="text-base md:text-lg leading-relaxed font-serif relative z-10 min-h-[2.5rem]" style={{ color: "#f0e8ff" }}>
              {displayedText}
              {!textDone && <span className="inline-block w-0.5 h-4 ml-0.5 animate-pulse" style={{ backgroundColor: "#A0E9FF", verticalAlign: "middle" }} />}
            </p>
            {textDone && !showChoices && (
              <div className="absolute bottom-3 right-5 flex items-center gap-1 text-xs animate-pulse" style={{ color: "#B19CD9" }}>
                tap to continue <ChevronRight className="w-3 h-3" />
              </div>
            )}
          </div>

          {showChoices && chapter.choices.length > 0 && (
            <div className="mt-3 space-y-2">
              {chapter.choices.map((choice: any, i: number) => (
                <button key={i}
                  onClick={e => { e.stopPropagation(); if (!isTransitioning) handleChoice(choice.trait); }}
                  disabled={isTransitioning}
                  className="group w-full text-left rounded-2xl p-4 transition-all hover:scale-[1.01] disabled:opacity-50"
                  style={{ backgroundColor: "rgba(20,12,35,0.88)", border: "1.5px solid rgba(160,233,255,0.2)", backdropFilter: "blur(10px)" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,183,206,0.6)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(160,233,255,0.2)")}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #A0E9FF, #B19CD9)", color: "#0a0612" }}>{i + 1}</div>
                    <p className="flex-1 font-medium text-sm md:text-base" style={{ color: "#f0e8ff" }}>{choice.text}</p>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" style={{ color: "#FFB7CE" }} />
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