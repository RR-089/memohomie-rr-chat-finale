import Image from "next/image";
import memoHomieLogo from "@/assets/logo.png";
import memoHomieRobotImg from "@/assets/memohomie.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Cog, GraduationCap, NotebookPen } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import NavBar from "./NavBar";

export default function Home() {
  const { userId } = auth();

  const isUcok = userId === process.env.UCOKGG;

  return (
    <>
      <NavBar isLogin={Boolean(userId)} />
      <main className="flex flex-col items-center justify-center gap-8 p-8">
        <div className="grid grid-cols-1 place-items-center gap-2 sm:flex sm:items-center">
          <Image
            src={memoHomieLogo}
            alt="MemoHomie Logo"
            width={120}
            height={120}
            className="rounded-full"
          />
          <h1 className="text-4xl font-black tracking-tighter lg:text-5xl">
            Memo<span className="text-violet-500">Homie</span>
          </h1>
        </div>
        <div className="grid sm:grid-cols-1 lg:grid-cols-2">
          <div className="max-w-prose p-14 text-justify">
            <p>
              {`Meet your AI homie, adept at comprehending your crucial memos. This
            implementation harnesses the power of OpenAI's AI API within a web
            full-stack environment using Next.js.`}
            </p>
            <br />
            <p>
              {`Enhance your productivity with MemoHomie.
            MemoHomie is designed to simplify your life by organizing and
            understanding your memos effortlessly. Let your AI homie be your
            personal assistant.`}
            </p>
          </div>

          <div className="max-w-prose text-center">
            <Image
              src={memoHomieRobotImg}
              alt="MemoHomie Robot"
              width={800}
              height={500}
              priority={true}
              className="rounded-md"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 place-items-stretch justify-items-center gap-5 sm:flex sm:gap-0">
          <div className="flex-shrink-0">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="lg" className="w-[82vw] p-5 sm:w-auto">
                    <Link href="/memos">Open Memos</Link>
                    <NotebookPen
                      className="ml-2"
                      fill="white"
                      color="black"
                      strokeWidth={1.25}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View your saved memos.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="sm:ml-4">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="lg" className="w-[82vw] p-5 sm:w-auto">
                    <Link href="/about-rr">About Rachmat Rizki</Link>
                    <GraduationCap
                      className="ml-2"
                      fill="white"
                      color="black"
                      strokeWidth={1.25}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Learn more about Rachmat Rizki.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div>
            {isUcok && (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="lg"
                      className="w-[82vw] p-5 sm:ml-4 sm:w-auto"
                      variant="secondary"
                    >
                      <Link href="/abouts">Manage Abouts</Link>
                      <Cog
                        className="ml-2"
                        fill="white"
                        color="black"
                        strokeWidth={1.25}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit or manage details about Rachmat Rizki.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
