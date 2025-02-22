"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { QRCodeSVG } from "qrcode.react"
import { CustomerHeader } from "@/components/customer-header"

export default function SendPayment() {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [currency, setCurrency] = useState("ETH")
  const [qrCodeData, setQRCodeData] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Generate a unique payment ID
    const paymentId = Math.random().toString(36).substr(2, 9).toUpperCase()
    // Create the payment data
    const paymentData = JSON.stringify({
      id: paymentId,
      amount,
      currency,
      description,
      timestamp: new Date().toISOString(),
    })
    // Set the QR code data
    setQRCodeData(paymentData)
  }

  return (
    <div className="min-h-screen flex flex-col bg-hero-gradient">
      <CustomerHeader />
      <div className="flex-grow container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gradient">Send Payment</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-card-gradient">
            <CardHeader>
              <CardTitle className="text-gradient">Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      required
                      className="bg-secondary/50"
                    />
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="bg-secondary/50 border rounded p-2"
                    >
                      <option value="ETH">ETH</option>
                      <option value="USDC">USDC</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter payment description"
                    required
                    className="bg-secondary/50"
                  />
                </div>
                <Button type="submit" className="button-gradient">
                  Send Payment
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-card-gradient">
            <CardHeader>
              <CardTitle className="text-gradient">QR Code for Merchant</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              {qrCodeData ? (
                <div className="space-y-4">
                  <QRCodeSVG value={qrCodeData} size={256} />
                  <p className="text-center text-muted-foreground">Scan this QR code to claim the payment</p>
                </div>
              ) : (
                <p className="text-muted-foreground">Fill out the payment details to generate a QR code</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

