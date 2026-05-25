import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Login Cripto",
  description: "Pantalla de login y registro para una plataforma cripto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
