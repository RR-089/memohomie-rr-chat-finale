import { memosIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding, getModeration } from "@/lib/openai";
import {
  createMemoSchema,
  deleteMemoSchema,
  updateMemoSchema,
} from "@/lib/validation/memo";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedResult = createMemoSchema.safeParse(body);

    if (!parsedResult.success) {
      console.error(parsedResult.error);
      return NextResponse.json(
        { error: "Invalid Input (Bad Request)" },
        { status: 400 },
      );
    }

    const { title, content } = parsedResult.data;

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const moderation = await getModeration(`${title} - ${content}`);
    if (moderation) {
      return NextResponse.json(
        { message: "Bad request, harmful content detected" },
        { status: 403 },
      );
    }

    const embedding = await getMemoEmbedding(title, content);

    const createdMemo = await prisma.$transaction(async (tx) => {
      const memo = await tx.memo.create({
        data: { title, content, userId },
      });

      await memosIndex.upsert([
        {
          id: memo.id,
          values: embedding,
          metadata: { userId },
        },
      ]);

      return memo;
    });

    return NextResponse.json({ memo: createdMemo }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const parsedResult = updateMemoSchema.safeParse(body);

    if (!parsedResult.success) {
      console.error(parsedResult.error);
      return NextResponse.json(
        { error: "Invalid Input (Bad Request)" },
        { status: 400 },
      );
    }

    const { id, title, content } = parsedResult.data;

    const memo = await prisma.memo.findUnique({ where: { id } });

    if (!memo) {
      return NextResponse.json({ error: "Memo Not Found" }, { status: 404 });
    }
    const { userId } = auth();

    if (!userId || userId !== memo.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const moderation = await getModeration(`${title} - ${content}`);

    if (moderation) {
      return NextResponse.json(
        { message: "Bad request, harmful content detected" },
        { status: 403 },
      );
    }

    const embedding = await getMemoEmbedding(title, content);

    const updatedMemo = await prisma.$transaction(async (tx) => {
      const memoUpdate = await tx.memo.update({
        where: { id },
        data: { title, content },
      });

      await memosIndex.upsert([
        {
          id,
          values: embedding,
          metadata: { userId },
        },
      ]);

      return memoUpdate;
    });

    return NextResponse.json({ updatedMemo }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const parsedResult = deleteMemoSchema.safeParse(body);

    if (!parsedResult.success) {
      console.error(parsedResult.error);
      return NextResponse.json(
        { error: "Invalid Input (Bad Request)" },
        { status: 400 },
      );
    }

    const { id } = parsedResult.data;
    const memo = await prisma.memo.findUnique({ where: { id } });
    if (!memo) {
      return NextResponse.json({ error: "Memo Not Found" }, { status: 404 });
    }

    const { userId } = auth();
    if (!userId || userId !== memo.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.memo.delete({ where: { id } });
      await memosIndex.deleteOne(id);
    });

    return NextResponse.json({ message: "Memo Deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

async function getMemoEmbedding(title: string, content: string | undefined) {
  return getEmbedding(title + "\n\n" + content ?? "");
}
