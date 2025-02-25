"use client"

import { useState, useContext, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { userService } from "@/services/user"
import { toast } from "react-hot-toast"
import { AuthContext } from "@/components/providers/auth-provider"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface UserOnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export function UserOnboardingModal({ isOpen, onClose, userId }: UserOnboardingModalProps) {
  const [name, setName] = useState("")
  const [pin, setPin] = useState("")
  const [userType, setUserType] = useState<"customer" | "merchant" | "">("")
  const { user, loading, createWallet } = useContext(AuthContext)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (pin.length !== 6) {
      toast.error("Please enter a 6-digit PIN")
      return
    }

    if (!userType) {
      toast.error("Please select your account type")
      return
    }

    setIsSubmitting(true)

    try {
      // Create wallet using the PIN
      const wallet = await createWallet(pin)
      
      // Validate wallet object and address
      if (!wallet || !wallet.success) {
        console.error("Invalid wallet response:", wallet)
        throw new Error("Failed to create wallet: Invalid wallet data received")
      }

      // Update user profile
      const updatedProfile = await userService.updateUserProfile({
        uid: userId,
        data: {
          name,
          isFirstLogin: false,
          walletAddress: wallet.wallet?.publicKey, // Store the wallet address
          userType // Store the user type
        }
      })
      
      // Force a refresh of the auth state to update the profile
      if (user) {
        await user.reload()
      }
      
      toast.success("Profile and wallet created successfully!")
      onClose()
    } catch (error) {
      console.error("Error during onboarding:", error)
      toast.error(`Failed to complete onboarding: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Prevent closing the modal if it's the first login
  const handleOpenChange = (open: boolean) => {
    if (open === false && user?.uid) {
      // Only allow closing if this is not the first login
      if (!name || !pin || !userType) {
        toast.error("Please complete your profile setup")
        return
      }
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome! Complete Your Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="userType" className="block mb-2">Account Type</Label>
            <RadioGroup 
              value={userType} 
              onValueChange={(value) => setUserType(value as "customer" | "merchant")}
              className="flex flex-col space-y-2"
              required
            >
              <div className="flex items-center space-x-2 p-3 rounded-md border border-border hover:bg-secondary/20 transition-colors">
                <RadioGroupItem value="customer" id="customer" />
                <Label htmlFor="customer" className="flex-1 cursor-pointer">
                  <div className="font-medium">Customer</div>
                  <div className="text-sm text-muted-foreground">Send payments and interact with merchants</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-md border border-border hover:bg-secondary/20 transition-colors">
                <RadioGroupItem value="merchant" id="merchant" />
                <Label htmlFor="merchant" className="flex-1 cursor-pointer">
                  <div className="font-medium">Merchant</div>
                  <div className="text-sm text-muted-foreground">Accept payments and manage your business</div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pin" className="text-center block">Create 6-Digit PIN</Label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={pin}
                onChange={(value) => setPin(value)}
                render={({ slots }) => (
                  <InputOTPGroup className="gap-2">
                    {slots.map((slot, index) => (
                      <InputOTPSlot
                        key={index}
                        {...slot}
                        className="bg-secondary/50"
                      />
                    ))}
                  </InputOTPGroup>
                )}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              This PIN will be used to secure your wallet. Please remember it.
            </p>
          </div>
          <Button 
            type="submit" 
            className="w-full button-gradient"
            disabled={!name || pin.length !== 6 || !userType || isSubmitting}
          >
            {isSubmitting ? "Creating Profile..." : "Complete Profile"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 