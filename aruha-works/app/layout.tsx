import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";
import FloatingLogos from "@/components/FloatingLogos";

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "ARUHA WORKS — Premium FiveM Scripts",
  description:
    "Carefully crafted FiveM resources focused on performance, stability, and seamless server integration. ESX · QBCore · QBox.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${body.variable} ${mono.variable}`}>
      <body className="font-sans antialiased bg-bg text-text">
        <div className="site-grid fixed inset-0 -z-20 pointer-events-none" aria-hidden />
        <FloatingLogos />
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
