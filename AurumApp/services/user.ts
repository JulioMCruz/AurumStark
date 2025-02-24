import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import type { User } from "firebase/auth"

interface UserData {
  uid: string
  email: string | null
  name: string | null
  createdAt: string
  lastLoginAt: string
  isFirstLogin: boolean
}

export const userService = {
  async createUserProfile({ user }: { user: User }): Promise<UserData> {
    const userRef = doc(db, "users", user.uid)
    
    const userData: UserData = {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isFirstLogin: true
    }
    
    await setDoc(userRef, userData)
    return userData
  },

  async getUserProfile({ uid }: { uid: string }): Promise<UserData | null> {
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)
    
    if (!userSnap.exists()) return null
    
    return userSnap.data() as UserData
  },

  async updateUserProfile({ uid, data }: { uid: string, data: Partial<UserData> }) {
    const userRef = doc(db, "users", uid)
    await setDoc(userRef, data, { merge: true })
  }
} 