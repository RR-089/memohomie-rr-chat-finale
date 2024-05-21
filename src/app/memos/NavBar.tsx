"use client";
import Image from "next/image";
import Link from "next/link";
import memoHomieLogo from "@/assets/logo.png";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddEditMemoDialog from "@/components/Memo/AddEditMemoDialog";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import AIHomieChatButton from "@/components/Memo/AIHomieChatButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function NavBar() {
  const [showAddMemoDialog, setShowAddMemoDialog] = useState(false);
  const { theme } = useTheme();

  return (
    <>
      <div className="p-4 shadow shadow-purple-700">
        <div className="m-auto h-auto gap-3 sm:flex sm:max-w-7xl sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-col items-center">
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
          </div>
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
            <AIHomieChatButton />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => setShowAddMemoDialog(true)}>
                    Add Memo
                    <Plus size={20} className="ml-2" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Create a new memo to save your thoughts<br></br>or important
                    information.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      <AddEditMemoDialog
        open={showAddMemoDialog}
        setOpen={setShowAddMemoDialog}
      />
    </>
  );
}
