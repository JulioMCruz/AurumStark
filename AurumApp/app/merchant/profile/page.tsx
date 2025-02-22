"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function MerchantProfile() {
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john.doe@example.com")
  const [phone, setPhone] = useState("+1 234 567 8900")
  const [bio, setBio] = useState("Passionate merchant selling awesome products.")

  const handleSave = () => {
    // Implement save logic here
    console.log("Saving profile:", { name, email, phone, bio })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gradient">Merchant Profile</h1>

      <Card className="bg-card-gradient">
        <CardHeader>
          <CardTitle className="text-gradient">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-secondary/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="bg-secondary/50"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card-gradient">
        <CardHeader>
          <CardTitle className="text-gradient">Account Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Total Sales: <span className="text-foreground">1,234 ETH</span>
          </p>
          <p className="text-muted-foreground">
            Total Customers: <span className="text-foreground">567</span>
          </p>
          <p className="text-muted-foreground">
            Member Since: <span className="text-foreground">January 1, 2023</span>
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="button-gradient">
          Save Changes
        </Button>
      </div>
    </div>
  )
}

