import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart2, DollarSign, Settings, User, CreditCard } from "lucide-react"

export function MerchantHeader() {
  return (
    <header className="bg-secondary/50 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gradient">
          AurumStark Merchant
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/merchant/dashboard">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <BarChart2 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/merchant/request-payment">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <DollarSign className="h-4 w-4 mr-2" />
              Request Payment
            </Button>
          </Link>
          <Link href="/merchant/capture-payment">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <CreditCard className="h-4 w-4 mr-2" />
              Capture Payment
            </Button>
          </Link>
          <Link href="/merchant/settings">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
          <Link href="/merchant/profile">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}

