"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription } from "@/components/ui/toast"
import { QRCodeSVG } from "qrcode.react"

export default function RequestPayment() {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [currency, setCurrency] = useState("ETH")
  const [qrCodeData, setQRCodeData] = useState<string | null>(null)
  const { addToast, toasts, removeToast } = useToast()

  const handleRequestPayment = () => {
    if (!amount || !description) {
      addToast({
        title: "Error",
        description: "Please fill in all fields",
        type: "error",
      })
      return
    }

    // Generate a unique payment ID
    const paymentId = Math.random().toString(36).substr(2, 9).toUpperCase()

    // Create the payment data
    const paymentData = {
      id: paymentId,
      amount,
      currency,
      description,
      timestamp: new Date().toISOString(),
    }

    // Create a URL for the capture-payment page with the payment data
    const capturePaymentUrl = `/merchant/capture-payment?paymentInfo=${encodeURIComponent(JSON.stringify(paymentData))}`

    // Set the QR code data to the capture-payment URL
    setQRCodeData(capturePaymentUrl)

    // Show success message
    addToast({
      title: "Payment Requested",
      description: `Payment request created with ID: ${paymentId}`,
      type: "success",
    })
  }

  return (
    <ToastProvider>
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gradient">Request Payment</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-card-gradient">
            <CardHeader>
              <CardTitle className="text-gradient">Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleRequestPayment()
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="flex-grow bg-secondary/50"
                    />
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="bg-secondary/50 border border-border rounded p-2"
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
                    placeholder="Payment description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-secondary/50"
                  />
                </div>
                <Button type="submit" className="button-gradient">
                  Request Payment
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-card-gradient">
            <CardHeader>
              <CardTitle className="text-gradient">Payment QR Code</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              {qrCodeData ? (
                <div className="space-y-4">
                  <QRCodeSVG value={qrCodeData} size={256} />
                  <p className="text-center text-muted-foreground">Scan this QR code to process the payment</p>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  Fill out the payment details and click "Request Payment" to generate a QR code
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <ToastViewport />
      {toasts.map((toast) => (
        <Toast key={toast.id} variant={toast.type === "error" ? "destructive" : "default"}>
          <ToastTitle>{toast.title}</ToastTitle>
          <ToastDescription>{toast.description}</ToastDescription>
        </Toast>
      ))}
    </ToastProvider>
  )
}

