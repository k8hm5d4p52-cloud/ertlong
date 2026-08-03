import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ERTLONG / Live Streetwear",
  description: "Premium streetwear. Live inventory. Worldwide shipping.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
