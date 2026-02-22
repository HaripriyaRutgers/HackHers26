import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Incoming:", body);

    const { traits, name } = body;

    if (!traits || !name) {
      return NextResponse.json({ error: "No traits or name provided" }, { status: 400 });
    }

    // Count trait frequencies
    const traitCounts: Record<string, number> = {};
    traits.forEach((t: string) => { traitCounts[t] = (traitCounts[t] || 0) + 1; });
    const topTraits = Object.entries(traitCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);

    const text = `
You are a narrative psychologist for an interactive story game called "LIFE.EXE" where players make choices that reveal their decision-making patterns.

The player's name is ${name}. They made ${traits.length} choices throughout the story, reflecting these traits (in order): ${traits.join(", ")}.

Their most frequent traits were: ${topTraits.join(", ")}.

Generate a complete psychological profile as a JSON object with EXACTLY this structure (respond with ONLY the JSON, no markdown, no explanation):

{
  "analysis": "A warm, flowing 3-4 sentence personal reflection addressed to ${name} about their dominant decision-making patterns and what this reveals about how they approach challenges and relationships. Make it feel insightful and specific to their choices.",
  
  "archetype": {
    "name": "A 2-3 word archetype title like 'The Compassionate Strategist' or 'The Bold Connector' — based on their actual traits",
    "description": "2 sentences describing what this archetype means and how it shows up in real life. Be specific to their trait patterns."
  },

  "topTraits": ["trait1", "trait2", "trait3"],

  "decisionStyle": {
    "logic": <0-100 number based on how analytical/strategic their choices were>,
    "emotion": <0-100 number based on how emotionally driven their choices were>,
    "risk": <0-100 number based on how bold/risky their choices were>,
    "caution": <0-100 number based on how careful/protective their choices were>,
    "independence": <0-100 number based on how self-reliant their choices were>,
    "collaboration": <0-100 number based on how connection-oriented their choices were>
  },

  "insight": "One powerful, memorable sentence that captures the essence of who ${name} is as a decision-maker. Should feel like a fortune cookie crossed with therapy."
}

Base ALL numbers and descriptions on the actual traits provided. Do not make generic responses.
Traits provided: ${traits.join(", ")}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text }] }],
    });

    const raw = result.response.text();

    // Try to parse as JSON, fall back to plain text analysis
    let profileData;
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      profileData = JSON.parse(cleaned);
    } catch {
      // If JSON parsing fails, return plain analysis
      profileData = {
        analysis: raw,
        archetype: { name: "The Reflective Soul", description: "Someone who approaches life with thoughtfulness and depth." },
        topTraits: topTraits.slice(0, 3),
        decisionStyle: { logic: 60, emotion: 60, risk: 50, caution: 50, independence: 60, collaboration: 60 },
        insight: "Your choices tell a story only you could write."
      };
    }

    return NextResponse.json({ analysis: profileData.analysis, profile: profileData });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json({ error: "Failed to analyze" }, { status: 500 });
  }
}

