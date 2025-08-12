import { Geist, Geist_Mono } from "next/font/google";

import type { Metadata } from "next";

import "./globals.css";

import { SessionProvider } from "next-auth/react";
import { ChevronLeftIcon } from "lucide-react";
import { Toaster } from "sonner";

import { QueryProvider } from "@/components/query-provider";
import { NextThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Boilerplate of Next.js",
  description: "Boilerplate of Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <QueryProvider>
            <ReactQueryDevtools initialIsOpen={true} />
            <NextThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster
                expand={false}
                richColors
                closeButton
                position="top-center"
              />
            </NextThemeProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
