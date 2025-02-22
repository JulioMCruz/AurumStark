import Link from "next/link"
import { Button } from "@/components/ui/button"

export function LandingHeader() {
  return (
    <header className="bg-secondary/50 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gradient">
          AurumStark
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/pay-invoice" className="text-muted-foreground hover:text-foreground transition-colors">
            Pay Invoice
          </Link>
          <Link href="/send-payment" className="text-muted-foreground hover:text-foreground transition-colors">
            Send Payment
          </Link>
          <Link
            href="/merchant/capture-payment"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Capture Payment
          </Link>
          <Button asChild variant="secondary" size="sm" className="text-muted-foreground hover:text-foreground">
            <Link href="/customer/chat">Customer Login</Link>
          </Button>
          <Button asChild size="sm" className="button-gradient">
            <Link href="/merchant/dashboard">Merchant Login</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

