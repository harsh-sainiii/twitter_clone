import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Topbar from "@/components/shared/Topbar";
import Rightbar from "@/components/shared/Rightbar";
import Bottombar from "@/components/shared/Bottombar";
import Leftbar from "@/components/shared/Leftbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Home | Twitter by Goldie Tiara",
  description: " A Next.js 13 Meta Twitter Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          <Topbar />
          <main className="flex flex-row">
            <Leftbar />
            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>
            <Rightbar />
          </main>
          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}
