import { aboutsIndex } from "@/lib/db/pinecone-about";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import {
  createAboutSchema,
  deleteAboutSchema,
  updateAboutSchema,
} from "@/lib/validation/about";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedResult = createAboutSchema.safeParse(body);

    if (!parsedResult.success) {
      console.error(parsedResult.error);
      return NextResponse.json(
        { error: "Invalid Input (Bad Request)" },
        { status: 400 },
      );
    }

    const { content } = parsedResult.data;

    const { userId } = auth();

    if (userId !== process.env.UCOKGG) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const embedding = await getAboutEmbedding(content);

    const createdAbout = await prisma.$transaction(async (tx) => {
      const about = await tx.about.create({
        data: { content, userId },
      });

      await aboutsIndex.upsert([
        {
          id: about.id,
          values: embedding,
          metadata: { userId },
        },
      ]);

      return about;
    });

    return NextResponse.json({ about: createdAbout }, { status: 201 });
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
    const parsedResult = updateAboutSchema.safeParse(body);

    if (!parsedResult.success) {
      console.error(parsedResult.error);
      return NextResponse.json(
        { error: "Invalid Input (Bad Request)" },
        { status: 400 },
      );
    }

    const { id, content } = parsedResult.data;

    const about = await prisma.about.findUnique({ where: { id } });

    if (!about) {
      return NextResponse.json({ error: "About Not Found" }, { status: 404 });
    }

    const { userId } = auth();

    if (userId !== process.env.UCOKGG) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const embedding = await getAboutEmbedding(content);

    const updatedAbout = await prisma.$transaction(async (tx) => {
      const aboutUpdate = await tx.about.update({
        where: { id },
        data: { content },
      });

      await aboutsIndex.upsert([
        {
          id,
          values: embedding,
          metadata: { userId },
        },
      ]);

      return aboutUpdate;
    });

    return NextResponse.json({ updatedAbout }, { status: 200 });
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
    const parsedResult = deleteAboutSchema.safeParse(body);

    if (!parsedResult.success) {
      console.error(parsedResult.error);
      return NextResponse.json(
        { error: "Invalid Input (Bad Request)" },
        { status: 400 },
      );
    }

    const { id } = parsedResult.data;

    const about = await prisma.about.findUnique({ where: { id } });

    if (!about) {
      return NextResponse.json({ error: "About Not Found" }, { status: 404 });
    }

    const { userId } = auth();
    if (userId !== process.env.UCOKGG) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.about.delete({ where: { id } });
      await aboutsIndex.deleteOne(id);
    });

    return NextResponse.json({ message: "About Deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

async function getAboutEmbedding(content: string) {
  return getEmbedding(content);
}
