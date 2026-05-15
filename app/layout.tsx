import type { Metadata } from "next";
import { Roboto_Slab } from "next/font/google";
import "./globals.css";

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
});

export const metadata: Metadata = {
  title: "NusaTrip",
  description: "Rencanakan perjalanan terbaikmu di Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${robotoSlab.className} min-h-screen flex flex-col antialiased bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
