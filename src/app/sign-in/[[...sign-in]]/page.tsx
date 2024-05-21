import type { Metadata } from "next";
import SignInPage from "./signin";

export const metadata: Metadata = {
  title: "Sign In - MemoHomie",
};

export default function Page() {
  return (
    <div>
      <SignInPage />
    </div>
  );
}
