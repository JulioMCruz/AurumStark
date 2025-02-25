"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
// import {
//   DynamicContextProvider,
//   DynamicWidget,
// } from "@dynamic-labs/sdk-react-core";
// import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core'


import { useState, useContext } from "react"
import { LoginModal } from "@/components/login-modal"
import { AuthContext } from "@/components/providers/auth-provider"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

export function LandingHeader() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { user, loading, userProfile } = useContext(AuthContext)

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error signing out", error)
    }
  }

  // const isLoggedIn = useIsLoggedIn();
  // const { handleLogOut, setShowAuthFlow } = useDynamicContext()

  // function login() {
  //   if (!isLoggedIn) {
  //       setShowAuthFlow(true)
  //   } else {
  //     //toast.warning('user is already logged in')
  //   }
  // }

  // async function logout() {
  //   await handleLogOut()
  //   //router.push('/')
  //   //setIsMenuOpen?.(false)
  // }

  return (
    <header className="bg-secondary/50 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gradient">
          Aurum Stark
        </Link>
        <nav className="flex items-center space-x-4">

          {/* <Link href="/pay-invoice" className="text-muted-foreground hover:text-foreground transition-colors">
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
          </Link> */}

          {/* <Button asChild variant="secondary" size="sm" className="text-muted-foreground hover:text-foreground">
            <Link href="/customer/chat">Customer Login</Link>
          </Button>
          <Button asChild size="sm" className="button-gradient">
            <Link href="/merchant/dashboard">Merchant Login</Link>
          </Button> */}

          {/* <div>
            {isLoggedIn ? (
              <p>User is logged in to Starknet</p>
            ) : (
              <p>User is not logged in to Starknet</p>
            )}
          </div> */}
          
          {/* { !isLoggedIn && (
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
            )} */}

            {/* // show the message: 'Welcome, {user.name}' if user is logged in */}


          {loading ? (
            <Button size="sm" disabled>
              Loading...
            </Button>
          ) : user ? (
            <>
              {userProfile && (
                <p>Welcome, {userProfile.name}</p>
              )}
              <Button asChild size="sm" variant="outline">
                <Link href={user.email?.includes("merchant") ? "/merchant/dashboard" : "/customer/chat"}>
                  Dashboard
                </Link>
              </Button>
              <Button onClick={handleLogout} size="sm" variant="destructive">
                Logout
              </Button>
            </>
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

