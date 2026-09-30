import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import FaqJsonLd from "@/components/FaqJsonLd";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LLM Pricing & Context Calculator | Token Cost Optimizer",
  description:
    "Estimate LLM API pricing, monthly token spend, prompt-cache savings, and context window utilization. Compare GPT-4o, Claude, Gemini, and DeepSeek, plus an LLM cost optimization FAQ.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1747700617931627"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <FaqJsonLd />
        {children}
      </body>
    </html>
  );
}
