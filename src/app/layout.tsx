import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "SSC PREP – SSC CGL Practice & Mock Tests",
  description:
    "Prepare for SSC CGL with practice questions, previous year questions, and full-length mock tests for Reasoning, Quantitative Aptitude, English, and General Awareness.",
  keywords: [
    "SSC CGL",
    "SSC CGL preparation",
    "SSC CGL mock test",
    "SSC CGL practice questions",
    "SSC CGL previous year questions",
    "SSC reasoning",
    "SSC maths",
    "SSC English",
    "SSC general awareness",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}