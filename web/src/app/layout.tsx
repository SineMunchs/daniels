import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { client } from "@/sanity/client";
import "./globals.css";

export const revalidate = 0;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteName = "Daniels hjemmeside";
const siteDescription = "Daniels personlige hjemmeside.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "da_DK",
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDescription,
  },
  twitter: {
    card: "summary",
    title: siteName,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

type NavData = {
  navn?: string;
  sections?: { title?: string; slug?: { current?: string } }[];
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [kontakt, frontpage] = await Promise.all([
    client.fetch<{ navn?: string } | null>(`*[_type == "kontakt"][0]{navn}`),
    client.fetch<NavData | null>(
      `*[_type == "frontpage"][0]{sections[]{title, slug}}`,
    ),
  ]);

  const navLinks = [
    ...(frontpage?.sections ?? [])
      .filter((section) => section.title && section.slug?.current)
      .filter((section) => section.title!.trim().toLowerCase() !== "kontakt")
      .map((section) => ({
        hash: section.slug!.current!,
        label: section.title!,
      })),
    { hash: "kontakt", label: "Kontakt" },
  ];

  return (
    <html lang="da" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Header
          siteName={kontakt?.navn || "Daniel Mielke-Offendal"}
          links={navLinks}
        />
        {children}
        <Footer />
      </body>
    </html>
  );
}
