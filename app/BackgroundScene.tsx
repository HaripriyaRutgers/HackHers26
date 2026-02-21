"use client";

import { motion } from "framer-motion";

/* ✅ Define props type */
type BackgroundSceneProps = {
  background: string;
};

export default function BackgroundScene({
  background,
}: BackgroundSceneProps) {
  return (
    <motion.div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
}
