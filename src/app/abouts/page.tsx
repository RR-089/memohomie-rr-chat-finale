import About from "@/components/About/About";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { MessageCircleWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MemoHomie - Abouts",
};

export default async function AboutsPage() {
  const { userId } = auth();

  if (userId !== process.env.UCOKGG) {
    return (
      <div className="m-5 flex h-[66vh] items-center justify-center sm:m-0 sm:h-[80vh] sm:text-lg">
        <Alert className="w-fit p-10 shadow-lg shadow-red-600">
          <MessageCircleWarning className="h-4 w-4" />
          <AlertTitle className="font-bold">Hands up!</AlertTitle>
          <AlertDescription>
            You are not worthy. GO BACK IMMEDIATELY!!!
          </AlertDescription>
          <AlertDescription className="mt-5">
            <Button variant={"destructive"}>
              <Link href="/memos" className="font-black">
                GO BACK
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const allAbouts = await prisma.about.findMany({});

  return (
    <div className=" grid gap-4 sm:grid-cols-2">
      {allAbouts.map((about) => (
        <About about={about} key={about.id}></About>
      ))}
      {allAbouts.length === 0 && (
        <div className="col-span-full flex h-full items-center justify-center">
          <p className="text-center">
            Oyy Ucok, there is nothing about Rachmat Rizki here! Wanna add one?
          </p>
        </div>
      )}
    </div>
  );
}
