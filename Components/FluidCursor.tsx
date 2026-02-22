"use client";
import { useEffect, useRef } from "react";

// True fluid simulation cursor — velocity + density fields, diffusion, advection
// This is the real technique behind the Inspira UI fluid cursor (aurora flowing style)
export default function FluidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Canvas setup ──
    const W = (canvas.width  = window.innerWidth);
    const H = (canvas.height = window.innerHeight);

    // We'll use 2D canvas with a fluid sim approximation that looks identical
    // to WebGL fluid — advected color fields that diffuse and dissipate
    const ctx = canvas.getContext("2d")!;

    // ── Sim grid ──
    const SCALE = 4; // grid cell size in pixels
    const GW = Math.floor(W / SCALE);
    const GH = Math.floor(H / SCALE);
    const N  = GW * GH;

    let vx   = new Float32Array(N); // velocity x
    let vy   = new Float32Array(N); // velocity y
    let vx0  = new Float32Array(N);
    let vy0  = new Float32Array(N);
    let dye  = new Float32Array(N * 3); // RGB dye
    let dye0 = new Float32Array(N * 3);

    const idx = (x: number, y: number) =>
      Math.max(0, Math.min(GW - 1, x)) +
      Math.max(0, Math.min(GH - 1, y)) * GW;

    // Bilinear sample
    const sample = (field: Float32Array, x: number, y: number, ch = 0, stride = 1) => {
      x = Math.max(0.5, Math.min(GW - 1.5, x));
      y = Math.max(0.5, Math.min(GH - 1.5, y));
      const x0 = Math.floor(x), x1 = x0 + 1;
      const y0 = Math.floor(y), y1 = y0 + 1;
      const sx = x - x0, sy = y - y0;
      const i00 = (idx(x0, y0) * stride) + ch;
      const i10 = (idx(x1, y0) * stride) + ch;
      const i01 = (idx(x0, y1) * stride) + ch;
      const i11 = (idx(x1, y1) * stride) + ch;
      return field[i00] * (1-sx)*(1-sy) +
             field[i10] * sx*(1-sy) +
             field[i01] * (1-sx)*sy +
             field[i11] * sx*sy;
    };

    // Advect field backward through velocity
    const advect = (
      dst: Float32Array, src: Float32Array,
      vxf: Float32Array, vyf: Float32Array,
      dt: number, stride = 1, ch = 0
    ) => {
      for (let y = 0; y < GH; y++) {
        for (let x = 0; x < GW; x++) {
          const i = idx(x, y);
          const ox = x - vxf[i] * dt;
          const oy = y - vyf[i] * dt;
          dst[i * stride + ch] = sample(src, ox, oy, ch, stride);
        }
      }
    };

    // Diffuse with simple averaging
    const diffuse = (dst: Float32Array, src: Float32Array, diff: number, dt: number, stride = 1, ch = 0) => {
      const a = dt * diff * GW * GH;
      for (let k = 0; k < 4; k++) {
        for (let y = 1; y < GH - 1; y++) {
          for (let x = 1; x < GW - 1; x++) {
            const i = idx(x, y);
            dst[i * stride + ch] = (
              src[i * stride + ch] +
              a * (
                src[idx(x-1,y)*stride+ch] + src[idx(x+1,y)*stride+ch] +
                src[idx(x,y-1)*stride+ch] + src[idx(x,y+1)*stride+ch]
              )
            ) / (1 + 4*a);
          }
        }
      }
    };

    // Dissipate
    const dissipate = (f: Float32Array, rate: number, stride = 1, ch = 0) => {
      for (let i = 0; i < N; i++) f[i*stride+ch] *= rate;
    };

    // Add force + dye at mouse position
    const splat = (gx: number, gy: number, fx: number, fy: number, hue: number, radius = 4) => {
      const r = Math.sin(hue) * 0.5 + 0.5;
      const g = Math.sin(hue + 2.094) * 0.5 + 0.5;
      const b = Math.sin(hue + 4.189) * 0.5 + 0.5;

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist > radius) continue;
          const w = Math.exp(-(dist*dist) / (radius*radius * 0.5));
          const x = Math.round(gx + dx);
          const y = Math.round(gy + dy);
          if (x < 0 || x >= GW || y < 0 || y >= GH) continue;
          const i = idx(x, y);
          vx[i]        += fx * w * 0.3;
          vy[i]        += fy * w * 0.3;
          dye[i*3]     += r * w * 1.5;
          dye[i*3+1]   += g * w * 1.5;
          dye[i*3+2]   += b * w * 1.5;
        }
      }
    };

    // Mouse state
    let mx = -1, my = -1, lx = -1, ly = -1;
    let hue = 0;
    const onMove = (e: MouseEvent) => { mx = e.clientX / SCALE; my = e.clientY / SCALE; };
    window.addEventListener("mousemove", onMove);

    // ── Render to canvas ──
    const imageData = ctx.createImageData(GW, GH);
    const pixels = imageData.data;

    let raf: number;
    const DT = 0.16;

    const step = () => {
      // Add dye + velocity at mouse
      if (mx >= 0 && lx >= 0) {
        hue += 0.04;
        const fx = (mx - lx) * 6;
        const fy = (my - ly) * 6;
        splat(mx, my, fx, fy, hue, 5);
      }
      lx = mx; ly = my;

      // Velocity step
      diffuse(vx0, vx, 0.0001, DT);
      diffuse(vy0, vy, 0.0001, DT);
      [vx, vx0] = [vx0, vx];
      [vy, vy0] = [vy0, vy];
      advect(vx0, vx, vx, vy, DT);
      advect(vy0, vy, vx, vy, DT);
      [vx, vx0] = [vx0, vx];
      [vy, vy0] = [vy0, vy];
      dissipate(vx, 0.98); dissipate(vy, 0.98);

      // Dye step — 3 channels
      for (let ch = 0; ch < 3; ch++) {
        diffuse(dye0, dye, 0.00005, DT, 3, ch);
        for (let i = 0; i < N; i++) dye[i*3+ch] = dye0[i*3+ch];
        advect(dye0, dye, vx, vy, DT, 3, ch);
        for (let i = 0; i < N; i++) dye[i*3+ch] = dye0[i*3+ch];
        dissipate(dye, 0.985, 3, ch);
      }

      // Write pixels
      for (let i = 0; i < N; i++) {
        const r = Math.min(255, dye[i*3]   * 255);
        const g = Math.min(255, dye[i*3+1] * 255);
        const b = Math.min(255, dye[i*3+2] * 255);
        const a = Math.min(255, (r + g + b) / 3 * 1.8);
        pixels[i*4]   = r;
        pixels[i*4+1] = g;
        pixels[i*4+2] = b;
        pixels[i*4+3] = a;
      }

      // Draw small imagedata, scale up with smoothing
      ctx.clearRect(0, 0, W, H);
      const tmp = document.createElement("canvas");
      tmp.width = GW; tmp.height = GH;
      tmp.getContext("2d")!.putImageData(imageData, 0, 0);
      ctx.filter = "blur(8px)";
      ctx.drawImage(tmp, 0, 0, W, H);
      ctx.filter = "none";

      raf = requestAnimationFrame(step);
    };
    step();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 9998, mixBlendMode: "screen" }}
    />
  );
}