import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Nav from "./components/Nav";

export const metadata: Metadata = {
  title: "Sculpt — We don't build agents. We sculpt them.",
  description: "Shape AI agents through conversation by removing what doesn't belong.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full antialiased">
        <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
          <Nav />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
