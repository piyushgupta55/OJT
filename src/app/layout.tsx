import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "K3 Studio | OJT Student Management Dashboard",
  description: "Comprehensive 30-day OJT Internship Portal to manage students, projects, Freelancer tracking, attendance, and certificates.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className={`${poppins.className} antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
