"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart2, DollarSign, Settings, User, CreditCard } from "lucide-react"
import { useContext, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthContext } from "@/components/providers/auth-provider"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { LoginModal } from "@/components/login-modal"

export function MerchantHeader() {
  const router = useRouter()
  const { user, loading } = useContext(AuthContext)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error("Error signing out", error)
    }
  }

  return (
    <header className="bg-secondary/50 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gradient">
          Aurum Stark Merchant
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

          {loading ? (
            <Button size="sm" disabled>
              Loading...
            </Button>
          ) : user ? (
            <Button onClick={handleLogout} size="sm" variant="destructive">
              Logout
            </Button>
          ) : (
            <Button onClick={() => setIsLoginModalOpen(true)} size="sm" className="button-gradient">
              Login
            </Button>
          )}
        </nav>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  )
}

