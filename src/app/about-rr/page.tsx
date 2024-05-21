import AIChatAbout from "@/components/About/AIChatAbout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MemoHomie - About RR",
};

export default async function AboutRrPage() {
  return (
    <div className="flex items-center">
      <AIChatAbout />
    </div>
  );
}
