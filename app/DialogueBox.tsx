"use client";

import ChoiceButton from "./ChoiceButton"; // Import your animated button
import { motion } from "framer-motion";

type Choice = {
  text: string;
  next: string;
};

type DialogueBoxProps = {
  characterName: string;
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
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-3xl">
      {/* Dialogue Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border-4 border-[#4A4A4A] shadow-2xl mb-4"
      >
        <h3 className="text-[#4A4A4A] font-bold text-xl mb-2 underline decoration-wavy">
          {characterName}
        </h3>
        <p className="text-gray-800 text-lg leading-relaxed font-medium">
          {dialogue}
        </p>
      </motion.div>

      {/* Choices Area */}
      <div className="flex flex-col gap-3">
        {choices.map((choice, index) => (
          <ChoiceButton
            key={index}
            text={choice.text}
            // This sends the choice back up through GameScreen to Home
            onClick={() => onChoice(choice)} 
          />
        ))}
      </div>
    </div>
  );
}