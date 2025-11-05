import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionReminder from "@/components/SessionReminder";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DualTech1v1",
  description: "Plateforme de défis IT 1v1 - Entraîne-toi, challenge, progresse",
  icons: {
    icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/951f6ca1-4326-4628-b511-d37b38da1131/generated_images/modern-minimalist-logo-for-1v1-tech-duel-863e8c19-20251105134914.jpg",
    shortcut: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/951f6ca1-4326-4628-b511-d37b38da1131/generated_images/modern-minimalist-logo-for-1v1-tech-duel-863e8c19-20251105134914.jpg",
    apple: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/951f6ca1-4326-4628-b511-d37b38da1131/generated_images/modern-minimalist-logo-for-1v1-tech-duel-863e8c19-20251105134914.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SessionReminder />
        <Toaster />
      </body>
    </html>
  );
}