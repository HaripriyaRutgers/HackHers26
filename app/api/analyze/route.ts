import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { traits, name } = body;

    if (!traits || !name) {
      return NextResponse.json({ error: "No traits or name provided" }, { status: 400 });
    }

    // Count trait frequencies
    const traitCounts: Record<string, number> = {};
    traits.forEach((t: string) => { traitCounts[t] = (traitCounts[t] || 0) + 1; });
    const sorted = Object.entries(traitCounts).sort((a, b) => b[1] - a[1]);
    const topTraits = sorted.slice(0, 5).map(([t]) => t);
    const dominantTrait = sorted[0]?.[0] || traits[0];

    const text = `
You are a narrative psychologist for an interactive story game called "LIFE.EXE."

Player name: ${name}
All choices made (as traits): ${traits.join(", ")}
Most frequent traits: ${topTraits.join(", ")}
Single most dominant trait: ${dominantTrait}

Generate a psychological profile as JSON. Respond with ONLY valid JSON, no markdown, no backticks, no explanation.

{
  "dominantWord": "ONE single evocative word (not a trait name) that captures their essence — something poetic and memorable like 'ARCHITECT' or 'WANDERER' or 'GUARDIAN' or 'EMBER' or 'CATALYST'. Make it feel like a character class or soul archetype. ALL CAPS.",

  "analysis": "2-3 sentences max. Address ${name} directly. Be specific about their choices, warm but insightful. NOT a list. Flowing prose only. Start with their dominant word woven in naturally.",

  "archetype": {
    "name": "2-3 word poetic archetype title like 'The Quiet Strategist' or 'The Brave Heart'",
    "description": "One sentence describing this archetype in the real world."
  },

  "topTraits": ["top3", "traits", "here"],

  "decisionStyle": {
    "logic": <0-100, how analytical their choices were>,
    "emotion": <0-100, how emotionally driven>,
    "risk": <0-100, how bold/risky>,
    "caution": <0-100, how protective/careful>,
    "independence": <0-100, how self-reliant>,
    "collaboration": <0-100, how connection-oriented>
  },

  "insight": "One short, punchy, memorable sentence. Like a horoscope crossed with a game achievement unlock. Should feel earned."
}

Make dominantWord feel like unlocking a character class. Make analysis feel personal, not generic. Base ALL numbers on actual trait patterns.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text }] }],
    });

    const raw = result.response.text();

    let profileData;
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      profileData = JSON.parse(cleaned);
    } catch {
      profileData = {
        dominantWord: "SEEKER",
        analysis: `${name}, your choices reveal someone who moves through the world with quiet intention. You don't just react — you observe, weigh, and then act with purpose that others rarely notice until it's already happened.`,
        archetype: { name: "The Thoughtful One", description: "Someone who leads with reflection before action." },
        topTraits: topTraits.slice(0, 3),
        decisionStyle: { logic: 60, emotion: 60, risk: 50, caution: 55, independence: 60, collaboration: 55 },
        insight: "You were never just playing a game. You were taking notes on yourself."
      };
    }

    return NextResponse.json({
      analysis: profileData.analysis,
      dominantWord: profileData.dominantWord,
      profile: profileData
    });

  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json({ error: "Failed to analyze" }, { status: 500 });
  }
}

