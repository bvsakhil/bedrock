import type React from "react"
import "./globals.css"
import { Archivo, Barlow, PT_Serif } from "next/font/google"
import type { Metadata } from "next"
import { Footer } from "./components/footer"

// Load and configure fonts with Next.js font optimization
const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
  weight: ["300", "400", "500", "600", "700"],
})

const barlow = Barlow({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-barlow",
  weight: ["900"],
  style: ["italic"],
})

const ptSerif = PT_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ptserif",
  weight: ["400", "700"],
})

/**
 * Global metadata configuration for the entire site
 * Includes SEO settings, Open Graph, Twitter cards, and more
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://bedrock.media"),
  title: {
    default: "BEDROCK - Independent Media Platform",
    template: "%s | BEDROCK",
  },
  description: "BEDROCK is an independent media platform covering builders, consumer tech, and onchain developments.",
  keywords: [
    "news",
    "media",
    "technology",
    "blockchain",
    "onchain",
    "builders",
    "consumer tech",
    "web3",
    "startups",
    "innovation",
  ],
  authors: [{ name: "BEDROCK Media", url: "https://bedrock.media" }],
  creator: "BEDROCK Media",
  publisher: "BEDROCK Media",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bedrock.media",
    siteName: "BEDROCK",
    title: "BEDROCK - Independent Media Platform",
    description: "BEDROCK is an independent media platform covering builders, consumer tech, and onchain developments.",
    images: [
      {
        url: "https://bedrock.media/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BEDROCK Media",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BEDROCK - Independent Media Platform",
    description: "BEDROCK is an independent media platform covering builders, consumer tech, and onchain developments.",
    creator: "@bedrockmedia",
    site: "@bedrockmedia",
    images: ["https://bedrock.media/twitter-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#000000",
      },
    ],
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
  alternates: {
    canonical: "https://bedrock.media",
    types: {
      "application/rss+xml": "https://bedrock.media/rss.xml",
    },
  },
  category: "news",
    generator: 'v0.dev'
}

/**
 * Root layout component that provides the basic HTML structure
 * Applies font variables and includes the global footer
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${archivo.variable} ${barlow.variable} ${ptSerif.variable}`}>
      <body className="font-archivo">
        {children}
        <Footer />
      </body>
    </html>
  )
}



import './globals.css'