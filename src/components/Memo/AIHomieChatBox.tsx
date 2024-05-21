import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Message } from "ai";
import { useChat } from "ai/react";
import { ScanFace, Trash2, XSquare } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AIHomieChatBoxProps {
  open: boolean;
  onClose: () => void;
}
export default function AIHomieChatBox({ open, onClose }: AIHomieChatBoxProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    error,
  } = useChat();

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <div
      className={cn(
        "bottom-0 right-0 z-10 w-full max-w-[500px] p-1 md:mr-20 xl:bottom-5 xl:right-32",
        open ? "fixed" : "hidden",
      )}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button onClick={onClose} className="mb-1 ms-auto block">
              <XSquare size={30} color="#6636c6" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Close the chat window.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex h-[400px] flex-col rounded border bg-background shadow-md shadow-violet-400 sm:h-[550px] ">
        <div
          className="mt-3 h-full overflow-y-auto border-b border-violet-400 px-3"
          ref={scrollRef}
        >
          {messages.map((message) => (
            <ChatMessage message={message} key={message.id} />
          ))}
          {isLoading && lastMessageIsUser && (
            <ChatMessage
              message={{
                role: "assistant",
                content: "Thinking...",
              }}
            />
          )}
          {error && (
            <ChatMessage
              message={{
                role: "assistant",
                content: "Something went wrong. Please try again.",
              }}
            />
          )}
          {!error && messages.length === 0 && (
            <div className="flex h-full items-center justify-center gap-3">
              <ScanFace />
              Ask the AI Homie a question about your Memos
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="m-3 flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  title="Clear chat"
                  variant="outline"
                  size="icon"
                  className="mr-3 shrink-0 border border-violet-400"
                  type="button"
                  onClick={() => setMessages([])}
                >
                  <Trash2 color="red" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear the chat history and start fresh.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about your memo to this Homie..."
            ref={inputRef}
          />
          <Button type="submit" className="ml-3 p-4 font-bold">
            SEND
          </Button>
        </form>
      </div>
    </div>
  );
}

function ChatMessage({
  message: { role, content },
}: {
  message: Pick<Message, "role" | "content">;
}) {
  const { user } = useUser();

  const isAiMessage = role === "assistant";

  return (
    <div
      className={cn(
        "mb-3 flex items-center",
        isAiMessage ? "me-5 justify-start" : "ms-5 justify-end",
      )}
    >
      {isAiMessage && <ScanFace className="mr-2 shrink-0" />}
      <p
        className={cn(
          "whitespace-pre-line rounded-md border px-3 py-2",
          isAiMessage ? "bg-background" : "bg-primary text-primary-foreground",
        )}
      >
        {content}
      </p>
      {!isAiMessage && user?.imageUrl && (
        <Image
          src={user.imageUrl}
          alt="User image"
          width={100}
          height={100}
          className="ml-2 h-10 w-10 rounded-full object-cover"
        />
      )}
    </div>
  );
}
