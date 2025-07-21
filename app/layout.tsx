import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { PitchProvider } from "@/contexts/PitchContext"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pitch & Invest Platform",
  description: "Connect entrepreneurs with investors",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <PitchProvider>
            {children}
            <Toaster />
          </PitchProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
