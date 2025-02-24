"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  sendEmailVerification,
  applyActionCode,
  checkActionCode,
  verifyBeforeUpdateEmail,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { FcGoogle } from "react-icons/fc"
import { toast } from "react-hot-toast"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [verificationId, setVerificationId] = useState("")
  const [showOTP, setShowOTP] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()

  useEffect(() => {
    let verifier: RecaptchaVerifier | null = null

    const initializeRecaptcha = async () => {
      try {
        // Clear any existing verifier
        if (window.recaptchaVerifier) {
          try {
            window.recaptchaVerifier.clear()
          } catch (e) {
            console.warn('Error clearing existing reCAPTCHA:', e)
          }
          window.recaptchaVerifier = undefined
        }

        // Create new verifier instance
        verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            console.log('reCAPTCHA solved')
          },
          'expired-callback': () => {
            console.log('reCAPTCHA expired')
            if (window.recaptchaVerifier) {
              try {
                window.recaptchaVerifier.clear()
              } catch (e) {
                console.warn('Error clearing expired reCAPTCHA:', e)
              }
              window.recaptchaVerifier = undefined
            }
          }
        })

        // Render the verifier
        await verifier.render()
        window.recaptchaVerifier = verifier
      } catch (error) {
        console.error('Error initializing reCAPTCHA:', error)
        toast.error('Failed to initialize phone authentication. Please try again.')
      }
    }

    if (isOpen) {
      initializeRecaptcha()
    }

    // Cleanup function
    return () => {
      if (verifier) {
        try {
          verifier.clear()
        } catch (e) {
          console.warn('Error during cleanup of reCAPTCHA:', e)
        }
        window.recaptchaVerifier = undefined
      }
    }
  }, [isOpen]) // Only re-run when modal opens/closes

  const handleSuccessfulLogin = (user: any) => {
    onClose()
    // if (user.email?.includes("merchant")) {
    //   router.push("/merchant/dashboard")
    // } else {
    //   router.push("/customer/chat")
    // }
  }

  const handleSendEmailVerification = async (user: any) => {
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: false // Changed to false since we're using link verification
      }

      await sendEmailVerification(user, actionCodeSettings)
      onClose() // Close the modal after sending verification email
      toast.success(
        "Verification email sent! Please check your inbox and click the verification link.",
        { duration: 5000 }
      )
    } catch (error) {
      console.error("Error sending verification email:", error)
      toast.error("Failed to send verification email")
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      if (!userCredential.user.emailVerified) {
        await handleSendEmailVerification(userCredential.user)
      } else {
        handleSuccessfulLogin(userCredential.user)
      }
    } catch (error) {
      console.error("Error signing in with email and password", error)
      toast.error("Invalid email or password")
    }
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await handleSendEmailVerification(userCredential.user)
      
      // Clear form fields
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      
      // Show success message and guide user to login
      toast.success(
        "Account created successfully! Please check your email for verification and then login with your credentials.",
        {
          duration: 5000
        }
      )
      
      // Switch back to login tab after a short delay
      setTimeout(() => {
        const loginTrigger = document.querySelector('[value="login"]') as HTMLButtonElement
        if (loginTrigger) loginTrigger.click()
      }, 1000)
      
    } catch (error: any) {
      console.error("Error signing up:", error)
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already in use")
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address")
      } else if (error.code === "auth/weak-password") {
        toast.error("Password is too weak")
      } else {
        toast.error("Failed to create account")
      }
    }
  }

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      handleSuccessfulLogin(result.user)
    } catch (error) {
      console.error("Error signing in with Google", error)
    }
  }

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!window.recaptchaVerifier) {
        await new Promise(resolve => setTimeout(resolve, 1000)) // Small delay to ensure reCAPTCHA is ready
        if (!window.recaptchaVerifier) throw new Error("Recaptcha not initialized")
      }
      
      // Format phone number to E.164 format
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`
      
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        window.recaptchaVerifier
      )
      
      // Save confirmation result
      window.confirmationResult = confirmationResult
      setShowOTP(true)
      toast.success("Verification code sent successfully!")
    } catch (error) {
      console.error("Error during phone authentication:", error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : "Failed to send verification code. Please try again."
      )
      
      // Reset reCAPTCHA on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear()
        window.recaptchaVerifier = undefined
      }
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!window.confirmationResult) throw new Error("No confirmation result found")
      
      const result = await window.confirmationResult.confirm(verificationCode)
      handleSuccessfulLogin(result.user)
    } catch (error) {
      console.error("Error verifying code:", error)
      toast.error("Invalid verification code. Please try again.")
    }
  }

  return (
    <>
      <div id="recaptcha-container" className="hidden"></div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gradient">Login to AurumStark</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              {/* <TabsTrigger value="phone">Phone</TabsTrigger> */}
              <TabsTrigger value="google">Google</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full button-gradient">
                      Login
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleEmailSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signupEmail">Email</Label>
                      <Input 
                        id="signupEmail" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signupPassword">Password</Label>
                      <Input
                        id="signupPassword"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full button-gradient"
                      disabled={password !== confirmPassword || !password || !email}
                    >
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </TabsContent>
            {/* <TabsContent value="phone">
              <form onSubmit={handlePhoneLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full button-gradient">
                  Send Verification Code
                </Button>
              </form>
              {showOTP && (
                <form onSubmit={handleVerifyCode} className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Verification Code</Label>
                    <Input
                      id="code"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full button-gradient">
                    Verify Code
                  </Button>
                </form>
              )}
              <div 
                id="recaptcha-container" 
                className="invisible"
                aria-hidden="true"
              ></div>
            </TabsContent> */}
            <TabsContent value="google">
              <Button onClick={handleGoogleLogin} className="w-full" variant="outline">
                <FcGoogle className="mr-2 h-4 w-4" />
                Sign in with Google
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}


