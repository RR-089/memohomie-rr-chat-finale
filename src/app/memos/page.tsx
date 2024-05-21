import Memo from "@/components/Memo/Memo";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MemoHomie - Memos",
};

export default async function MemosPage() {
  const { userId } = auth();
  if (!userId) {
    throw Error("userId Undefined");
  }

  const allMemos = await prisma.memo.findMany({ where: { userId } });

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {allMemos.map((memo) => (
        <Memo memo={memo} key={memo.id}></Memo>
      ))}
      {allMemos.length === 0 && (
        <div className="col-span-full flex h-full items-center justify-center">
          <p className="text-center">Hey, no memos here! Wanna add one?</p>
        </div>
      )}
    </div>
  );
}
