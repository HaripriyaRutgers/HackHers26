"use client";

import BackgroundScene from "./BackgroundScene";
import CharacterSprite from "./CharacterSprite";
import DialogueBox from "./DialogueBox";

/* ---------- TYPES ---------- */

type Choice = {
  text: string;
  next: string;
};

type Character = {
  name: string;
  image: string;
  position: "left" | "right";
};

type GameScreenProps = {
  scene: { background: string };
  character?: Character;
  dialogue: string;
  choices?: Choice[];
  onChoice: (next: string) => void;
};

/* ---------- COMPONENT ---------- */

export default function GameScreen({
  scene,
  character,
  dialogue,
  choices,
  onChoice,
}: GameScreenProps) {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background */}
      <BackgroundScene background={scene.background} />

      {/* Character */}
      {character && (
        <CharacterSprite
          name={character.name}
          image={character.image}
          position={character.position}
        />
      )}

      {/* Dialogue */}
      <DialogueBox
        characterName={character?.name || ""}
        dialogue={dialogue}
        choices={choices || []}
        onChoice={(choice) => choice.next && onChoice(choice.next)}
      />
    </div>
  );
}
