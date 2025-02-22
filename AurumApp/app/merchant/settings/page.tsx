"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function MerchantSettings() {
  const [businessName, setBusinessName] = useState("My Awesome Store")
  const [email, setEmail] = useState("merchant@example.com")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [autoPayoutEnabled, setAutoPayoutEnabled] = useState(false)

  const handleSave = () => {
    // Implement save logic here
    console.log("Saving settings:", { businessName, email, notificationsEnabled, autoPayoutEnabled })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gradient">Merchant Settings</h1>

      <Card className="bg-card-gradient">
        <CardHeader>
          <CardTitle className="text-gradient">Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Contact Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary/50"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card-gradient">
        <CardHeader>
          <CardTitle className="text-gradient">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="text-muted-foreground">
              Enable Email Notifications
            </Label>
            <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="autopayout" className="text-muted-foreground">
              Enable Auto Payout
            </Label>
            <Switch id="autopayout" checked={autoPayoutEnabled} onCheckedChange={setAutoPayoutEnabled} />
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

