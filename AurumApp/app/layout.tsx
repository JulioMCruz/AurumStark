import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/footer"

import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { StarknetWalletConnectors } from "@dynamic-labs/starknet";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AurumStark",
  description: "Cryptocurrency transaction system",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased flex flex-col`}>
      <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_APP_ID || "",
        walletConnectors: [StarknetWalletConnectors],
      }}
    >
          {children}
          <Footer />
        </DynamicContextProvider>
      </body>
    </html>
  )
}



import './globals.css'