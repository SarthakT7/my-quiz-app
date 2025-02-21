import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const gemini = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function generateQuestionsFromText(text: string) {
  const schema = getSchema();

  try {
    const model = gemini.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const prompt = `
      Generate multiple-choice questions based on the following content:
      ---
      ${text}
      ---
      Ensure that the output follows the JSON schema strictly.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return JSON.parse(response);
  } catch (error) {
    console.error("AI Question Generation Failed:", error);
    return [];
  }
}

function getSchema() {
  return {
    description: "Generated multiple-choice questions",
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        question: { type: SchemaType.STRING, description: "The question text" },
        optionA: {
          type: SchemaType.STRING,
          description: "First answer choice",
        },
        optionB: {
          type: SchemaType.STRING,
          description: "Second answer choice",
        },
        optionC: {
          type: SchemaType.STRING,
          description: "Third answer choice",
        },
        optionD: {
          type: SchemaType.STRING,
          description: "Fourth answer choice",
        },
        correctOption: {
          type: SchemaType.STRING,
          description: "Correct answer (e.g., 'Option A', 'Option B')",
        },
        topic: { type: SchemaType.STRING, description: "The related topic" },
      },
      required: [
        "question",
        "optionA",
        "optionB",
        "optionC",
        "optionD",
        "correctOption",
        "topic",
      ],
    },
  };
}
