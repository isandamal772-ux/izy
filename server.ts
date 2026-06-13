import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Lazy initialization of the Gemini API Client
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment secrets. Please set it in Settings > Secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  const PORT = 3000;

  // AI Travel Assistant endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message) {
         res.status(400).json({ error: "Message input is required." });
         return;
      }

      const ai = getGeminiClient();
      
      const systemInstruction = 
        "You are the 'IZYSL.COM AI Assistant,' an expert, friendly local travel advisor. " +
        "You have world-class knowledge of Sri Lankan waterfalls, pristine beaches, high altitude mountain hikes, " +
        "safari national parks, historical heritage landmarks, boutique resorts, and fine dining. " +
        "Provide extremely helpful advice on itineraries, local costs, visa requirements, transport details, " +
        "and things to avoid. Answer warmly in structured Markdown, keeping answers punchy yet elegant.";

      const contents = history ? [...history, { role: "user", parts: [{ text: message }] }] : [{ role: "user", parts: [{ text: message }] }];

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error details:", error.message || error);
      res.status(500).json({ 
        error: error.message || "An unexpected error occurred during message generation.",
        needsApiKey: !process.env.GEMINI_API_KEY
      });
    }
  });

  // Serve frontend assets
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`IZYSL.COM Server listening dynamically on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start the Express server:", error);
});
