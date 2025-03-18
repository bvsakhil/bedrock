import type React from "react"
import "./globals.css"
import { Archivo, Barlow, PT_Serif } from "next/font/google"
import type { Metadata } from "next"
import { Footer } from "./components/footer"
import { ThemeProvider } from "@/components/theme-provider"

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
  metadataBase: new URL("https://onbedrock.co/"),
  title: {
    default: "Bedrock - Writing the future of the onchain economy",
    template: "%s | Bedrock",
  },
  description: "A publication writing the future of the onchain economy, covering the ideas, builders, and projects ushering in an onchain renaissance.",
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
  authors: [{ name: "BEDROCK Media", url: "https://onbedrock.co/" }],
  creator: "BEDROCK Media",
  publisher: "BEDROCK Media",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
    url: "https://onbedrock.co/",
    siteName: "Bedrock",
    title: "Bedrock - Writing the future of the onchain economy",
    description: "A publication writing the future of the onchain economy, covering the ideas, builders, and projects ushering in an onchain renaissance.",
    images: [
      {
        url: "https://onbedrock.co/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bedrock",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bedrock - Writing the future of the onchain economy",
    description: "A publication writing the future of the onchain economy, covering the ideas, builders, and projects ushering in an onchain renaissance.",
    creator: "@bedrockmedia",
    site: "@bedrockmedia",
    images: ["https://onbedrock.co/twitter-image.jpg"],
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
    canonical: "https://onbedrock.co/",
    types: {
      "application/rss+xml": "https://onbedrock.co/rss.xml",
    },
  },
  category: "news",
  generator: 'v0.dev'
}

// Add viewport export
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
    <html lang="en" className={`${archivo.variable} ${barlow.variable} ${ptSerif.variable}`} suppressHydrationWarning>
      <body className="font-archivo">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  )
}