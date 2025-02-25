import { useState, useContext } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { userService } from "@/services/user"
import { toast } from "react-hot-toast"
import { AuthContext } from "@/components/providers/auth-provider"
import { useAuth } from "@/hooks/useAuth"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

interface UserOnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export function UserOnboardingModal({ isOpen, onClose, userId }: UserOnboardingModalProps) {
  const [name, setName] = useState("")
  const [pin, setPin] = useState("")
  const { user, loading } = useContext(AuthContext)
  const { createWallet } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (pin.length !== 6) {
      toast.error("Please enter a 6-digit PIN")
      return
    }

    try {
      // Create wallet using the PIN
      const wallet = await createWallet(pin)
      if (!wallet) throw new Error("Failed to create wallet")

      // Update user profile
      const updatedProfile = await userService.updateUserProfile({
        uid: userId,
        data: {
          name,
          isFirstLogin: false,
          walletAddress: wallet.address // Store the wallet address
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
      toast.error("Failed to complete onboarding")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
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
          <Button type="submit" className="w-full button-gradient">
            Complete Profile
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 