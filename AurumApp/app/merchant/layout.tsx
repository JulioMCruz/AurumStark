import type React from "react"
import { MerchantHeader } from "@/components/merchant-header"

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-hero-gradient">
      <MerchantHeader />
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}

