"use client";

import { motion } from "framer-motion";

/* ✅ Define prop types */
type CharacterSpriteProps = {
  name: string;
  image: string;
  position: "left" | "right";
};

/* ✅ Apply types to props */
export default function CharacterSprite({
  name,
  image,
  position,
}: CharacterSpriteProps) {
  return (
    <motion.img
      src={image}
      alt={name}
      className={`absolute bottom-0 ${
        position === "left" ? "left-10" : "right-10"
      } h-3/4`}
      initial={{ x: position === "left" ? -200 : 200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    />
  );
}
