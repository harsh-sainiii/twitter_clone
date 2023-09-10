import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "../globals.css";

export const metadata = {
  title: "Twitter",
  description: " A Next.js 13 Meta Twitter Application",
};

type children = {
  children: React.ReactNode;
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: children) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={` bg-dark-1 ${inter.className}`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
