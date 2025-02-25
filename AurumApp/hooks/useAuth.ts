"use client"

import { useState, useEffect } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { userService } from "@/services/user"
import { ChipiSDK } from '@chipi-pay/chipi-sdk';

interface AuthState {
  user: User | null
  loading: boolean
  isFirstLogin: boolean
  userProfile: UserData | null
}

export const createWallet = async (pin: string) => {
  const chipi = new ChipiSDK({
    rpcUrl: `https://starknet-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
    apiKey: process.env.NEXT_PUBLIC_AVNU_API_KEY,
    network: "mainnet"
    })
  const wallet = await chipi.createWallet(pin)
  console.log(wallet)
  return wallet
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isFirstLogin: false,
    userProfile: null
  })



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

