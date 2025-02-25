"use client"

import { createContext } from "react"
import type { User } from "firebase/auth"
import { useAuth } from "@/hooks/useAuth"
import { UserOnboardingModal } from "@/components/user-onboarding-modal"
import { useState, useEffect } from "react"

interface AuthContextType {
  user: User | null
  loading: boolean
  isFirstLogin: boolean
  userProfile: UserData | null
  createWallet: (pin: string) => Promise<any>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isFirstLogin: false,
  userProfile: null,
  createWallet: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, isFirstLogin, userProfile, createWallet } = useAuth()
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    if (user && isFirstLogin) {
      setShowOnboarding(true)
    }
  }, [user, isFirstLogin])

  return (
    <AuthContext.Provider value={{ user, loading, isFirstLogin, userProfile, createWallet }}>
      {children}
      {user && (
        <UserOnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          userId={user.uid}
        />
      )}
    </AuthContext.Provider>
  )
} 