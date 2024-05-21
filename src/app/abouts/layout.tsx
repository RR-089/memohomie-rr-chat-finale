import NavBar from "./NavBar";
import NavBar2 from "./NavBar2";
import { auth } from "@clerk/nextjs/server";

export default function MemosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  const isRachmatRizki = userId === process.env.UCOKGG;

  return (
    <>
      {isRachmatRizki ? <NavBar /> : <NavBar2 />}
      <main className="m-auto max-w-7xl p-4">{children}</main>
    </>
  );
}
