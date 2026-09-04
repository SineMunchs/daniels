import type { Metadata } from "next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { client } from "@/sanity/client";
import "./globals.css";

export const revalidate = 0;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteName = "Artisan Entreprise";
const siteDescription = "Artisan Entreprise.";

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
  sections?: {
    _type?: string;
    title?: string;
    navTitle?: string;
    navn?: string;
    slug?: { current?: string };
    showInNav?: boolean;
  }[];
};

const navLabel = (section: {
  title?: string;
  navTitle?: string;
  navn?: string;
}) => section.navTitle?.trim() || section.navn?.trim() || section.title?.trim() || "";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [kontakt, frontpage] = await Promise.all([
    client.fetch<{ navn?: string } | null>(`*[_type == "kontakt"][0]{navn}`),
    client.fetch<NavData | null>(
      `*[_type == "frontpage"][0]{sections[]{_type, title, navTitle, navn, slug, showInNav}}`,
    ),
  ]);

  const hasKontaktSektion = (frontpage?.sections ?? []).some(
    (section) => section._type === "kontaktSektion",
  );

  const navLinks = [
    ...(frontpage?.sections ?? [])
      .filter((section) => section.showInNav !== false)
      .filter((section) => navLabel(section) && section.slug?.current)
      .filter(
        (section) => !hasKontaktSektion || navLabel(section).toLowerCase() !== "kontakt",
      )
      .map((section) => ({
        hash: section.slug!.current!.trim(),
        label: navLabel(section),
      })),
    ...(hasKontaktSektion ? [{ hash: "kontakt", label: "Kontakt" }] : []),
  ];

  return (
    <html lang="da">
      <body>
        <Header
          siteName={kontakt?.navn || "Artisan Entreprise"}
          links={navLinks}
        />
        {children}
        <Footer />
      </body>
    </html>
  );
}
