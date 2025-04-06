import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import Navbar from "@/components/layout/Navbar";
import QueryProvider from "@/components/layout/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Narutoverse",
  description: "Explore the world of Naruto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          // disableTransitionOnChange
        >
          <QueryProvider>
            <div className="min-h-screen">
              <Navbar />
              <div className="container py-10 px-6 space-y-8">{children}</div>
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
