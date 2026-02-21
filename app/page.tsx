"use client";

import { useState } from "react";
import GameScreen from "./GameScreen";

const storyData: Record<string, any> = {
  start: {
    scene: { background: "/images/campus.jpg" },
    character: { name: "Haripriya", image: "/placehold.jpg", position: "left" },
    dialogue: "You step onto campus with your schedule in hand. Students rush past you.",
    choices: [
      { text: "Ask for directions", next: "scene2", trait: "social" },
      { text: "Follow the crowd", next: "scene2", trait: "cautious" },
      { text: "Grab food", next: "scene2", trait: "impulsive" },
      { text: "Sit and watch", next: "scene2", trait: "reflective" },
    ],
  },
  scene2: {
    scene: { background: "/images/classroom.jpg" },
    character: { name: "Haripriya", image: "/placehold.jpg", position: "left" },
    dialogue: "Group project time! Sravya isn't responding to the chat.",
    choices: [
      { text: "Assign tasks clearly", next: "scene3", trait: "bold" },
      { text: "Do only your part", next: "scene3", trait: "cautious" },
      { text: "Reach out to Sravya", next: "scene3", trait: "connection" },
      { text: "Ignore it", next: "scene3", trait: "avoidant" },
    ],
  },
  scene3: {
    scene: { background: "/images/midterm.jpg" },
    character: { name: "Haripriya", image: "/placehold.jpg", position: "left" },
    dialogue: "Midterm results: You got 75. Sravya got 92.",
    choices: [
      { text: "Ask professor for help", next: "scene4", trait: "reflective" },
      { text: "Ignore and study harder", next: "scene4", trait: "avoidant" },
      { text: "Compare notes secretly", next: "scene4", trait: "curious" },
      { text: "Vent to a friend", next: "scene4", trait: "social" },
    ],
  },
  scene4: {
    scene: { background: "/images/quad.jpg" },
    character: { name: "Haripriya", image: "/placehold.jpg", position: "left" },
    dialogue: "Sravya cancels a study session. Is the friendship changing?",
    choices: [
      { text: "Ask Sravya directly", next: "scene5", trait: "connection" },
      { text: "Make other friends", next: "scene5", trait: "bold" },
      { text: "Let it slide", next: "scene5", trait: "avoidant" },
      { text: "Reflect on behavior", next: "scene5", trait: "reflective" },
    ],
  },
  scene5: {
    scene: { background: "/images/library.jpg" },
    character: { name: "Haripriya", image: "/placehold.jpg", position: "left" },
    dialogue: "Two days before the project is due, you find an error in the work.",
    choices: [
      { text: "Fix it quietly", next: "scene6", trait: "bold" },
      { text: "Tell Sravya immediately", next: "scene6", trait: "connection" },
      { text: "Leave it as-is", next: "scene6", trait: "avoidant" },
      { text: "Review together", next: "scene6", trait: "reflective" },
    ],
  },
  scene6: {
    scene: { background: "/images/finals.jpg" },
    character: { name: "Haripriya", image: "/placehold.jpg", position: "left" },
    dialogue: "Finals week is here. Where do you put your energy?",
    choices: [
      { text: "Focus on grades", next: "ending", trait: "bold" },
      { text: "Fix friendships", next: "ending", trait: "connection" },
      { text: "Prioritize mental health", next: "ending", trait: "reflective" },
      { text: "Avoid everything", next: "ending", trait: "avoidant" },
    ],
  },
  ending: {
    scene: { background: "/images/sunset.jpg" },
    character: { name: "Haripriya", image: "/placehold.jpg", position: "left" },
    dialogue: "Analyzing your university journey...",
    choices: [],
  }
};


export default function Home() {
  const [currentStep, setCurrentStep] = useState("start");
  const [traits, setTraits] = useState<string[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");


  const currentScene = storyData[currentStep];


  const handleChoice = (choice: any) => {
    const updatedTraits = [...traits, choice.trait];
    setTraits(updatedTraits);
    setCurrentStep(choice.next);


    if (choice.next === "ending") {
      generateSummary(updatedTraits);
    }
  };


  const generateSummary = (finalTraits: string[]) => {
    // This mimics the AI logic you'll eventually put in an API route
    const counts: Record<string, number> = {};
    finalTraits.forEach(t => counts[t] = (counts[t] || 0) + 1);
   
    const topTrait = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
   
    const feedback: Record<string, string> = {
      reflective: "You are deep and thoughtful, always seeking the 'why' before the 'how'.",
      connection: "You prioritize people and harmony, building a strong community around you.",
      bold: "You are a natural leader, unafraid to take charge when things get messy.",
      avoidant: "You prefer peace over conflict, though you might find strength in facing things head-on.",
      social: "You thrive on energy from others and navigate campus like a pro.",
    };


    setAiAnalysis(`Haripriya, your journey shows a tendency toward being ${topTrait}. ${feedback[topTrait] || "You have a unique, balanced approach to college life!"}`);
  };


  return (
    <div style={{ backgroundColor: "#F9F3DF", minHeight: "100vh" }}>
      <GameScreen
        scene={currentScene.scene}
        character={currentScene.character}
        dialogue={currentStep === "ending" ? aiAnalysis : currentScene.dialogue}
        choices={currentScene.choices}
        onChoice={(choiceText: string) => {
          const choiceObj = currentScene.choices.find((c: any) => c.text === choiceText);
          if (choiceObj) handleChoice(choiceObj);
        }}
      />
    </div>
  );
}
