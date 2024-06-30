import { memosIndex } from "@/lib/db/pinecone";
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

    console.log(messages);
    console.log(messagesTruncated);

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n"),
    );

    const vectorQueryResponse = await memosIndex.query({
      vector: embedding,
      topK: 8,
      filter: { userId },
    });

    const relevantMemos = await prisma.memo.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((match) => match.id),
        },
      },
    });

    console.log("Relevant memos found: ", relevantMemos);

    const systemMessage: ChatCompletionMessage = {
      role: "assistant",
      content:
        "You're a smart memo app. You answer questions using the user's memos and can chat informally," +
        "like their best friend." +
        "The relevant memos for this query are:\n" +
        relevantMemos
          .map((memo) => `Title: ${memo.title}\n\nContent:\n${memo.content}`)
          .join("\n\n"),
    };

    const response = await openai.chat.completions.create({
      // model: "gpt-3.5-turbo-16k-0613",
      model: "gpt-3.5-turbo-0125",
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
