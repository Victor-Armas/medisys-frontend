import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediSys",
  description: "Sistema de gestión de consultorio médico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
