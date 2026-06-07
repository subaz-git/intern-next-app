import { GoogleGenAI } from "@google/genai";

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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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