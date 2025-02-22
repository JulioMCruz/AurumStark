"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription } from "@/components/ui/toast"

interface PaymentData {
  id: string
  amount: string
  currency: string
  description: string
  timestamp: string
}

export default function CapturePayment() {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    id: "",
    amount: "",
    currency: "ETH",
    description: "",
    timestamp: new Date().toISOString(),
  })
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const { addToast, toasts, removeToast } = useToast()

  useEffect(() => {
    const paymentInfo = searchParams.get("paymentInfo")
    if (paymentInfo) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(paymentInfo))
        setPaymentData(decodedData)
      } catch (error) {
        console.error("Error parsing payment data:", error)
        addToast({
          title: "Error",
          description: "Invalid payment data. Please enter the details manually.",
          type: "error",
        })
      }
    }
    setIsLoading(false)
  }, [searchParams, addToast])

  const handleAcceptTransfer = () => {
    // Here you would typically make an API call to process the payment
    // For this example, we'll just show a success message
    addToast({
      title: "Payment Accepted",
      description: `Payment of ${paymentData.amount} ${paymentData.currency} has been accepted.`,
      type: "success",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPaymentData((prev) => ({ ...prev, [name]: value }))
  }

  if (isLoading) {
    return <div className="container mx-auto p-6 text-center text-gradient">Loading payment data...</div>
  }

  return (
    <ToastProvider>
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold mb-6 text-gradient">Capture Payment</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-card-gradient">
            <CardHeader>
              <CardTitle className="text-gradient">Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id">Payment ID</Label>
                <Input
                  id="id"
                  name="id"
                  value={paymentData.id}
                  onChange={handleInputChange}
                  placeholder="Enter Payment ID"
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  value={paymentData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter Amount"
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  name="currency"
                  value={paymentData.currency}
                  onChange={handleInputChange}
                  placeholder="Enter Currency"
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={paymentData.description}
                  onChange={handleInputChange}
                  placeholder="Enter Description"
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timestamp">Timestamp</Label>
                <Input
                  id="timestamp"
                  name="timestamp"
                  value={new Date(paymentData.timestamp).toLocaleString()}
                  onChange={handleInputChange}
                  placeholder="Enter Timestamp"
                  className="bg-secondary/50"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card-gradient flex flex-col justify-between">
            <CardContent className="flex-grow flex flex-col items-center justify-center p-6">
              <Image src="/placeholder.svg" alt="Payment Illustration" width={200} height={200} className="mb-6" />
              <p className="text-center mb-6 text-muted-foreground">
                Review the payment details and click the button below to accept the transfer.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAcceptTransfer} className="w-full button-gradient">
                Accept Transfer of {paymentData.amount} {paymentData.currency}
              </Button>
            </CardFooter>
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

