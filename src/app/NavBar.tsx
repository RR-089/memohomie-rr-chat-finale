"use client";
import { UserButton } from "@clerk/nextjs";

import ThemeToggleButton from "@/components/ThemeToggleButton";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NavBarProps {
  isLogin: boolean;
}

export default function NavBar({ isLogin }: NavBarProps) {
  const { theme } = useTheme();

  return (
    <>
      <div className="p-4 shadow shadow-purple-700">
        <div className="m-auto h-auto gap-3 sm:flex sm:max-w-7xl sm:flex-wrap sm:items-center sm:justify-end">
          <div className="grid auto-cols-auto gap-4 sm:flex sm:w-auto sm:items-center">
            <div className="flex items-center justify-around">
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
              {!isLogin && (
                <div className="cursor-pointer">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto">
                      <Link href="/sign-in">
                        <Button className="sm:mr-4">Sign In</Button>
                      </Link>
                      <Link href="/sign-up">
                        <Button variant="outline">Sign Up</Button>
                      </Link>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
