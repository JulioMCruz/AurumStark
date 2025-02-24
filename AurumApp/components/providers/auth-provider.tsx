"use client"

import { createContext } from "react"
import type { User } from "firebase/auth"
import { useAuth } from "@/hooks/useAuth"

export const AuthContext = createContext<{ user: User | null; loading: boolean }>({ 
  user: null, 
  loading: true 
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
} 