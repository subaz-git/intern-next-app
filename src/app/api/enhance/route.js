import { GoogleGenAI } from "@google/genai";
import { rateLimit } from "@/lib/rateLimit";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text?.trim()) {
      return Response.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // Rate limit: 5 requests per minute per IP
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const limitCheck = rateLimit(`enhance:${ip}`, 5, 60000);

    if (!limitCheck.allowed) {
      return Response.json(
        {
          error: `Rate limited. Please try again in ${limitCheck.retryAfter} seconds.`,
        },
        { status: 429, headers: { "Retry-After": limitCheck.retryAfter } }
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `
Improve the following question or statement.

Requirements:
- Make it clear and professional.
- Fix grammar and spelling.
- Keep the original meaning.
- Return ONLY the improved text.
- Do not add explanations.
- Try to frame questions always

Text:
${text}
`,
    });

    return Response.json({
      enhanced: response.text,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to enhance text" },
      { status: 500 }
    );
  }
}