"use client";

import { motion } from "framer-motion";

/* ✅ Props type */
type ChoiceButtonProps = {
  text: string;
  onClick: () => void;
};

export default function ChoiceButton({
  text,
  onClick,
}: ChoiceButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-blue-600"
      whileHover={{
        scale: 1.05,
        boxShadow: "0px 0px 8px rgba(255,255,255,0.8)",
      }}
      whileTap={{ scale: 0.95 }}
    >
      {text}
    </motion.button>
  );
}
