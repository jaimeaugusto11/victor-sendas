import type { Metadata } from "next";
import { Inter, Playfair_Display, Great_Vibes } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-wedding" });

export const metadata: Metadata = {
  title: "Victor & Lurdes | Save the Date",
  description: "O convite especial para o casamento de Victor Moço e Lurdes de Carvalho",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${playfair.variable} ${greatVibes.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
