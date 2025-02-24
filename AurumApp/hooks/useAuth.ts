"use client"

import { useState, useEffect } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    // Handle initial auth state
    if (auth.currentUser) {
      setUser(auth.currentUser)
      setLoading(false)
    }

    return () => unsubscribe()
  }, [])

  return { user, loading }
}

