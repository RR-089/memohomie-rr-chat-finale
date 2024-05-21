import { Pinecone } from "@pinecone-database/pinecone";

const pineconeApiKey = process.env.PINECONE_API_KEY;

if (!pineconeApiKey) {
  throw Error("PINECONE_API_KEY is undefined");
}

const pinecone = new Pinecone({
  apiKey: pineconeApiKey,
});

export const memosIndex = pinecone.Index("memohomie");
