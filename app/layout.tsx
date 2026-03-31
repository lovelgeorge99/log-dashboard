import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Script from "next/script";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LogStream - Real-time Log Dashboard",
  description: "Monitor and analyze logs from all your services in real-time",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <Script src="https://cdn.botpress.cloud/webchat/v3.6/inject.js"></Script>
      <Script
        src="https://files.bpcontent.cloud/2026/03/24/15/20260324155215-1YL7R18D.js"
        defer
      ></Script>

      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
