import { aboutsIndex } from "@/lib/db/pinecone-about";
import prisma from "@/lib/db/prisma";
import openai, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
import { ChatCompletionMessage } from "openai/resources/chat/index.mjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;
    const messagesTruncated = messages.slice(-6);

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n"),
    );

    const vectorQueryResponse = await aboutsIndex.query({
      vector: embedding,
      topK: 8,
    });

    const relevantAbouts = await prisma.about.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((match) => match.id),
        },
      },
    });

    console.log("Relevant abouts found: ", relevantAbouts);

    const systemMessage: ChatCompletionMessage = {
      role: "assistant",
      content:
        "You are Rachmat Rizki now, act as though you are their best friend and " +
        "answer all of their questions about Rachmat Rizki as if you were Rachmat Rizki yourself." +
        "The relevant details about Rachmat Rizki for this query are:\n" +
        relevantAbouts
          .map((about) => `Content:\n${about.content}`)
          .join("\n\n"),
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k-0613",
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
