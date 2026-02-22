"use client";
import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.left = e.clientX + "px";
        ref.current.style.top  = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div ref={ref} className="pointer-events-none fixed -translate-x-1/2 -translate-y-1/2"
      style={{ zIndex: 9999, width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(160,233,255,0.07) 0%, transparent 70%)",
        transition: "left 0.08s ease, top 0.08s ease" }} />
  );
}