import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sumit & Subidha | December 12, 2026",
  description: "Join Sumit and Subidha for their wedding celebration at Rosa Villa in Cleveland, Texas.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
