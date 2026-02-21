"use client";

import { motion } from "framer-motion";
import ChoiceButton from "./ChoiceButton";

/* ✅ Choice type */
type Choice = {
  text: string;
  next?: string;
};

/* ✅ Props type */
type DialogueBoxProps = {
  characterName?: string;
  dialogue: string;
  choices: Choice[];
  onChoice: (choice: Choice) => void;
};

export default function DialogueBox({
  characterName,
  dialogue,
  choices,
  onChoice,
}: DialogueBoxProps) {
  return (
    <motion.div
      className="absolute bottom-0 w-full bg-black/70 backdrop-blur-md text-white p-6 rounded-t-3xl"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {characterName && (
        <h2 className="text-lg font-bold mb-2">{characterName}</h2>
      )}

      <p className="text-md mb-4">{dialogue}</p>

      <div className="flex flex-col gap-4">
        {choices.map((choice, index) => (
          <ChoiceButton
            key={index}
            text={choice.text}
            onClick={() => onChoice(choice)}
          />
        ))}
      </div>
    </motion.div>
  );
}
