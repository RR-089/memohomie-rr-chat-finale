import NavBar from "./NavBar";

export default function MemosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <main className="m-auto max-w-7xl p-4">{children}</main>
    </>
  );
}
