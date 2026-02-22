"use client";
import React, { useEffect, useRef } from "react";

// Ultra-lightweight glow dot cursor — no ring, no physics, just a smooth pink dot
export default function GlowDotCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let x = -100, y = -100;
    let raf: number;

    const onMove = (e: MouseEvent) => { x = e.clientX; y = e.clientY; };
    window.addEventListener("mousemove", onMove);

    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x - 5}px, ${y - 5}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed top-0 left-0"
      style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        backgroundColor: "#FFB7CE",
        boxShadow: "0 0 10px rgba(255,183,206,1), 0 0 24px rgba(255,183,206,0.6), 0 0 40px rgba(255,183,206,0.2)",
        zIndex: 9999,
        willChange: "transform",
      }}
    />
  );
}