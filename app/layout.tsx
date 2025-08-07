import { Geist, Geist_Mono } from "next/font/google";

import type { Metadata } from "next";

import "./globals.css";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import { QueryProvider } from "@/components/query-provider";
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <QueryProvider>
            <ReactQueryDevtools initialIsOpen={true} />
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
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
            </ThemeProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
