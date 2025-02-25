"use client"

import { useState, useEffect } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { userService } from "@/services/user"
//import { ChipiSDK } from '@chipi-pay/chipi-sdk';
import {
  useApprove,
  useStake,
  useCreateWallet,
  useTransfer,
  useWithdraw,
  useCallAnyContract,
} from "@chipi-pay/chipi-sdk";

interface AuthState {
  user: User | null
  loading: boolean
  isFirstLogin: boolean
  userProfile: UserData | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isFirstLogin: false,
    userProfile: null
  })

  const { createWalletAsync } = useCreateWallet()

  const createWallet = async (pin: string) => {
    if (!createWalletAsync) {
      throw new Error("Wallet creation not initialized")
    }

    try {
      const response = await createWalletAsync(pin)
      console.log("creation response", response)
      return response
    } catch (error) {
      console.error("Error creating wallet:", error)
      throw error
    }
  }

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

