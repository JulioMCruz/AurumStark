"use client"

import { useState, useEffect, useCallback } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { userService } from "@/services/user"
import {
  useCreateWallet,
} from "@chipi-pay/chipi-sdk"

interface AuthState {
  user: User | null
  loading: boolean
  isFirstLogin: boolean
  userProfile: UserData | null
}

// Custom hook to safely use Chipi SDK hooks
function useClientSideChipi() {
  const [isMounted, setIsMounted] = useState(false)
  
  // Always call the hook unconditionally at the top level
  const createWalletHook = useCreateWallet()
  
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])
  
  // Return null for the function if not mounted yet
  return {
    createWalletAsync: isMounted ? createWalletHook.createWalletAsync : null
  }
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isFirstLogin: false,
    userProfile: null
  })

  // Use the safe client-side hook
  const { createWalletAsync } = useClientSideChipi()

  const createWallet = useCallback(async (pin: string) => {
    if (!createWalletAsync) {
      throw new Error("Wallet creation not initialized")
    }

    try {
      const response = await createWalletAsync(pin)
      console.log("creation response", response)
      return response
    } catch (error) {
      console.error("Error creating wallet:", error)
      //throw error
    }
  }, [createWalletAsync])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          let userData = await userService.getUserProfile({ uid: user.uid })
          
          if (!userData) {
            userData = await userService.createUserProfile({ user })
          } else {
            await userService.updateUserProfile({
              uid: user.uid,
              data: { lastLoginAt: new Date().toISOString() }
            })
          }

          setState({
            user,
            loading: false,
            isFirstLogin: userData.isFirstLogin,
            userProfile: userData
          })
        } catch (error) {
          console.error("Error fetching user data:", error)
          setState({ user, loading: false, isFirstLogin: false, userProfile: null })
        }
      } else {
        setState({ user: null, loading: false, isFirstLogin: false, userProfile: null })
      }
    })

    return () => unsubscribe()
  }, [])

  return {
    ...state,
    createWallet
  }
}

