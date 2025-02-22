"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function CustomerProfile() {
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john.doe@example.com")
  const [phone, setPhone] = useState("+1 234 567 8900")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const handleSave = () => {
    // Implement save logic here
    console.log("Saving profile:", { name, email, phone, notificationsEnabled, twoFactorEnabled })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gradient">Customer Profile</h1>

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
        </CardContent>
      </Card>

      <Card className="bg-card-gradient">
        <CardHeader>
          <CardTitle className="text-gradient">Account Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">2.5 ETH</p>
          <p className="text-sm text-muted-foreground">≈ $4,250.00 USD</p>
        </CardContent>
      </Card>

      <Card className="bg-card-gradient">
        <CardHeader>
          <CardTitle className="text-gradient">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Enable Notifications</Label>
            <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
            <Switch id="2fa" checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
          </div>
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

