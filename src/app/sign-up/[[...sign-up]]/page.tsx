import type { Metadata } from "next";
import SignUpPage from "./signup";

export const metadata: Metadata = {
  title: "Sign Up - MemoHomie",
};

export default function Page() {
  return (
    <div>
      <SignUpPage />
    </div>
  );
}
