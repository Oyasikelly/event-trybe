import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "EventTrybe - Create, Manage & Discover Events",
  description: "The ultimate platform for creating, managing, and discovering events. Join thousands of event organizers and attendees.",
  keywords: ["events", "event management", "event platform", "create events", "discover events"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <Toaster />
      </body>
    </html>
  );
}


