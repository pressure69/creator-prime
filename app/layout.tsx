import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pressure69 Live",
  description: "Discover the hottest pressure69 content",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
