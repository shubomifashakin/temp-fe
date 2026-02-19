import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair } from "next/font/google";
import "./globals.css";
import QueryClientProvider from "@/providers/query-client.provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Temp - File Sharing Made Easy",
  description: "Secure ephemeral file sharing made easy.",
  keywords: [
    "temp",
    "temporary",
    "ephemeral",
    "file sharing",
    "secure",
    "easy",
  ],
  authors: [{ name: "Fashakin Olashubomi" }],
  creator: "Fashakin Olashubomi",
  category: "technology",
  publisher: "Fashakin Olashubomi",
  openGraph: {
    type: "website",
    siteName: "Temp - File Sharing Made Easy",
    url: "https://temp.545plea.xyz",
  },
  twitter: {
    card: "summary_large_image",
    title: "Temp - File Sharing Made Easy",
    description: "Secure ephemeral file sharing made easy.",
    creator: "@545plea",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <QueryClientProvider>
          {children}

          <Toaster />
        </QueryClientProvider>
      </body>
    </html>
  );
}
