"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare, CreditCard, User, Send, FileText } from "lucide-react"
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { useRouter } from "next/navigation";
import { useIsLoggedIn, useDynamicContext } from "@dynamic-labs/sdk-react-core";

export function CustomerHeader() {

  const router = useRouter();

  const isLoggedIn = useIsLoggedIn();
  const { handleLogOut, setShowAuthFlow } = useDynamicContext()

  function login() {
    if (!isLoggedIn) {
        setShowAuthFlow(true)
    } else {
      //toast.warning('user is already logged in')
    }
  }

  async function logout() {
    await handleLogOut()
    router.push('/')
    //setIsMenuOpen?.(false)
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
          {/* <Link href="/customer/profile">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </Link> */}


          { !isLoggedIn && (
            <Button 
                onClick={login} >
                Launch App
            </Button>
          )}

          { isLoggedIn && (
            <>
              <DynamicWidget />
              <Button
                onClick={logout} >
                Logout
                </Button>
            </>
            )}

          </nav>
      </div>
    </header>
  )
}

