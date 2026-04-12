import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dubai Guide — Step-by-step guides for living and working in Dubai",
  description:
    "Clear, practical guides for company setup, visas, hiring, and relocation in Dubai and the UAE.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full`}>
      <body className="min-h-full bg-white text-gray-900">{children}</body>
    </html>
  );
}
