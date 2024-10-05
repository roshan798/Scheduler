import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google"
import Header from "@/components/Header";
import {ClerkProvider} from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sheduler",
  description: "Meeting scheduling app",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
          {children}
        </main>
        <footer className="bg-blue-100 py-12">
          <div className="container mx-auto px-4 text-center text-gray-600">
            Made with 💖 | Roshan Kumar
          </div>
        </footer>
      </body>
      </html >
      </ClerkProvider>
  );
}
