import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nududu by Dzie | Spicy Ghanaian Home Cooking",
  description:
    "Discover the bold and authentic flavors of Nududu by Dzie, home to some of the best spicy Ghanaian dishes. Order spicy jollof, spicy chicken, spicy gizzard, banku with okro soup, and more for pickup or delivery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-cream text-espresso antialiased">
        {children}
      </body>
    </html>
  );
}
