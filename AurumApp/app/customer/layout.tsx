import type React from "react"
import { CustomerHeader } from "@/components/customer-header"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-hero-gradient">
      <CustomerHeader />
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}

