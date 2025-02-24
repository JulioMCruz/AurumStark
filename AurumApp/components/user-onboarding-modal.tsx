import { useState, useContext } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { userService } from "@/services/user"
import { toast } from "react-hot-toast"
import { AuthContext } from "@/components/providers/auth-provider"

interface UserOnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export function UserOnboardingModal({ isOpen, onClose, userId }: UserOnboardingModalProps) {
  const [name, setName] = useState("")
  const { user, loading } = useContext(AuthContext)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const updatedProfile = await userService.updateUserProfile({
        uid: userId,
        data: {
          name,
          isFirstLogin: false
        }
      })
      
      // Force a refresh of the auth state to update the profile
      if (user) {
        await user.reload()
      }
      
      toast.success("Profile updated successfully!")
      onClose()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome! Please complete your profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button type="submit" className="w-full button-gradient">
            Complete Profile
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 