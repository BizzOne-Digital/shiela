import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { BUSINESS, siteUrl } from "@/lib/site-metadata";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a1f44",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${BUSINESS.shortName} | Court Document Service`,
    template: `%s | ${BUSINESS.shortName}`,
  },
  description: BUSINESS.description,
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: BUSINESS.name,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full`}>
      <body className="flex min-h-full min-w-0 flex-col overflow-x-clip antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
