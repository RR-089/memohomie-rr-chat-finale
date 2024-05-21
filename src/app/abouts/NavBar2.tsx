"use client";
import Image from "next/image";
import Link from "next/link";
import memoHomieLogo from "@/assets/logo.png";
import { UserButton } from "@clerk/nextjs";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function NavBar2() {
  const { theme } = useTheme();

  return (
    <>
      <div className="p-4 shadow shadow-purple-700">
        <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-1">
            <Image
              src={memoHomieLogo}
              alt="MemoHomie Logo"
              width={40}
              height={40}
            />
            <span className="font-black">
              Memo<span className="text-violet-500">Homie</span>
            </span>
          </Link>
          <div className="grid auto-cols-auto gap-4 sm:flex sm:w-auto sm:items-center">
            <div className="flex items-center justify-between">
              <ThemeToggleButton />
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  baseTheme: theme === "dark" ? dark : undefined,
                  elements: {
                    avatarBox: {
                      width: "2.2rem",
                      height: "2.2rem",
                      outline: "2px solid #6636c6",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
