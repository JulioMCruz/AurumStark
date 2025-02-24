"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare, CreditCard, User, Send, FileText } from "lucide-react"
import { useContext, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthContext } from "@/components/providers/auth-provider"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { LoginModal } from "@/components/login-modal"

export function CustomerHeader() {
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
          Aurum Stark Customer
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/customer/chat">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </Link>
          <Link href="/customer/transactions">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <CreditCard className="h-4 w-4 mr-2" />
              Transactions
            </Button>
          </Link>
          <Link href="/send-payment">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Send className="h-4 w-4 mr-2" />
              Send Payment
            </Button>
          </Link>
          <Link href="/pay-invoice">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <FileText className="h-4 w-4 mr-2" />
              Pay Invoice
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

