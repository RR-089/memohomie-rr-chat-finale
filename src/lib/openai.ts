import OpenAI from "openai";

const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  throw Error("OPENAI_API_KEY is undefined");
}

const openai = new OpenAI({ apiKey: openaiApiKey });

export default openai;

export async function getEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });

  const embeddingResult = response.data[0].embedding;

  if (!embeddingResult) {
    throw Error("Error generating embedding.");
  }

  return embeddingResult;
}

export async function getModeration(text: string) {
  const response = await openai.moderations.create({ input: text });

  if (!response.results[0]) {
    throw Error("Error generating moderation.");
  }

  const moderationResult = response.results[0].flagged;

  return moderationResult;
}
