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
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isFirstLogin: false,
  userProfile: null
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, isFirstLogin, userProfile } = useAuth()
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    if (user && isFirstLogin) {
      setShowOnboarding(true)
    }
  }, [user, isFirstLogin])

  return (
    <AuthContext.Provider value={{ user, loading, isFirstLogin, userProfile }}>
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