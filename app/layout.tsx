import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";
import QueryProvider from "@/shared/providers/QueryProvider";
import { Inter } from "next/font/google";
import { cn } from "@/shared/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "MediSys",
  description: "Sistema de gestión de consultorio médico",
};

import { Toaster } from "@/shared/ui/toaster";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
      <body>
        <QueryProvider>
          <ThemeProvider>
            {children}
            <Toaster closeButton richColors expand={false} />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
