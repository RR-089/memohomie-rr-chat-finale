"use client";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Message } from "ai";
import { useChat } from "ai/react";
import { ScanFace, Trash2 } from "lucide-react";
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

export default function AIChatAbout() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    error,
  } = useChat({ api: "api/chat-about-rr" });

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <div className={cn("bottom-0 right-0 z-10 w-full p-1")}>
      <div className="flex h-[600px] flex-col rounded border bg-background shadow-md shadow-violet-400 sm:mt-3">
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
              {`Ask the AI Homie a question about Rachmat Rizki (myself)`}
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
            placeholder="Ask about Rachmat Rizki to this Homie..."
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
