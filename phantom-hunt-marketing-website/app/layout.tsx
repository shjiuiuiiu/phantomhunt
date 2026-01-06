import type React from "react"
import type { Metadata } from "next"
import { Orbitron, JetBrains_Mono, Tajawal } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" })
const tajawal = Tajawal({ subsets: ["latin", "arabic"], weight: ["400", "700"], variable: "--font-tajawal" })

export const metadata: Metadata = {
  title: "PhantomHunt - Silent. Vintage. Unseen.",
  description:
    "A terminal-first Instagram reconnaissance engine for the invisible operator. OSINT tool for red-teamers, bug bounty hunters, and privacy researchers.",
  generator: "v0.app",
  keywords: ["OSINT", "Instagram", "reconnaissance", "cybersecurity", "red team", "privacy"],
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${jetbrainsMono.variable} ${tajawal.variable}`}>
      <body className={`font-mono antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
