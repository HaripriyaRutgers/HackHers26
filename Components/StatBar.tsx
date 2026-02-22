"use client";

import { motion } from "framer-motion";

export default function StatBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <p>{label}</p>

      <div
        style={{
          width: "100%",
          height: "12px",
          background: "#222",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1 }}
          style={{
            height: "100%",
            background: "linear-gradient(90deg,#ff4d6d,#c77dff)",
          }}
        />
      </div>
    </div>
  );
}
