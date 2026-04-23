import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/layout/QueryProvider";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Manga Rental",
  description: "Your Trusted Manga Rental",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${geist.variable} font-sans antialiased bg-gray-50`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
