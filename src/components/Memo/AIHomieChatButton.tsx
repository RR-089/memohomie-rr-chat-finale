import { ScanFace } from "lucide-react";
import { useState } from "react";
import AIHomieChatBox from "./AIHomieChatBox";
import { Button } from "../ui/button";
import memoHomieChatIcon from "@/assets/icon-chat-mh.png";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AIHomieChatButton() {
  const [homieChatBoxOpen, setHomieChatBoxOpen] = useState(false);
  const memoHomieChatIconUrl = memoHomieChatIcon.src;

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setHomieChatBoxOpen((prevState) => !prevState)}
            >
              <ScanFace size={20} className="mr-2" />
              Your AI Homie Here
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Interact with AI Homie to inquire about or manage your memos.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="w-[45px} fixed bottom-20 right-10 h-[45px] bg-transparent sm:h-[70px] sm:w-[70px] md:h-[150px] md:w-[150px]"
              onClick={() => setHomieChatBoxOpen((prevState) => !prevState)}
            >
              <Avatar className="h-[60px] w-[60px] border-2 border-purple-500 sm:h-[70px] sm:w-[70px] md:h-[150px] md:w-[150px]">
                <AvatarImage src={memoHomieChatIconUrl} />
                <AvatarFallback>MH</AvatarFallback>
              </Avatar>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Interact with AI Homie to inquire about or manage your memos.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AIHomieChatBox
        open={homieChatBoxOpen}
        onClose={() => setHomieChatBoxOpen(false)}
      ></AIHomieChatBox>
    </>
  );
}
