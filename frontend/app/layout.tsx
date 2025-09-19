import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";
import { FilterProvider } from "@/contexts/FilterContext";
import Footer from "@/components/footer";
import { translations } from "@/consts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: translations.Title,
  description: translations.TitleDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-screen px-4 max-w-4xl mx-auto`}
      >
        <header className="sticky top-0 bg-white z-10 w-full">
          <h1 className="text-center text-4xl font-extrabold tracking-tight text-balance py-4 md:py-2 bg-gradient-to-r from-blue-700 via-purple-500 to-pink-500 bg-clip-text text-transparent md:my-2">
            <Link href="/">{String(metadata?.title)}</Link>
          </h1>
        </header>

        <FilterProvider>
          {children}
          <Footer />
        </FilterProvider>

        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  );
}
