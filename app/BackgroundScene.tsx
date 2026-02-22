"use client";

import { motion } from "framer-motion";


<motion.section
 initial={{ opacity: 0, y: 60 }}
 whileInView={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 viewport={{ once: true }}
></motion.section>

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
