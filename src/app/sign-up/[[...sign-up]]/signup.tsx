"use client";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  const { theme } = useTheme();

  return (
    <div className="flex h-screen items-center justify-center">
      <SignUp
        appearance={{
          baseTheme: theme === "dark" ? dark : undefined,
          variables: { colorPrimary: "#6636c6" },
        }}
      />
    </div>
  );
}
