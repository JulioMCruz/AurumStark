"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CustomerHeader } from "@/components/customer-header"

// Mock function to fetch invoice details
const fetchInvoiceDetails = async (invoiceKey: string) => {
  // In a real application, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: invoiceKey,
        amount: "0.5",
        currency: "ETH",
        description: "Payment for services",
        merchantName: "AurumStark Merchant",
        date: "2023-06-15",
        dueDate: "2023-06-30",
        tokenReward: "10 AUR",
      })
    }, 1000)
  })
}

export default function PayInvoice() {
  const [invoiceKey, setInvoiceKey] = useState("")
  const [invoiceDetails, setInvoiceDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleFetchInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const details = await fetchInvoiceDetails(invoiceKey)
      setInvoiceDetails(details)
    } catch (error) {
      console.error("Error fetching invoice details:", error)
      // Handle error (e.g., show error message to user)
    }
    setIsLoading(false)
  }

  const handlePayment = () => {
    // Implement payment processing logic here
    console.log("Processing payment for invoice:", invoiceDetails.id)
    alert("Payment processed successfully!")
    router.push("/") // Redirect to home page after payment
  }

  return (
    <div className="min-h-screen flex flex-col bg-hero-gradient">
      <CustomerHeader />
      <div className="flex-grow container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gradient">Pay Invoice</h1>
        {!invoiceDetails ? (
          <Card className="bg-card-gradient">
            <CardHeader>
              <CardTitle className="text-gradient">Enter Invoice Key</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFetchInvoice} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceKey">Invoice Key</Label>
                  <Input
                    id="invoiceKey"
                    value={invoiceKey}
                    onChange={(e) => setInvoiceKey(e.target.value)}
                    placeholder="Enter your invoice key"
                    required
                    className="bg-secondary/50"
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="button-gradient">
                  {isLoading ? "Loading..." : "Fetch Invoice"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card-gradient">
              <CardHeader>
                <CardTitle className="text-gradient">Invoice Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-muted-foreground">Invoice ID</h3>
                    <p>{invoiceDetails.id}</p>
                  </div>
                  <div className="text-right">
                    <h3 className="font-semibold text-muted-foreground">Date</h3>
                    <p>{invoiceDetails.date}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-muted-foreground">Merchant</h3>
                  <p>{invoiceDetails.merchantName}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-muted-foreground">Description</h3>
                  <p>{invoiceDetails.description}</p>
                </div>
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-muted-foreground">Amount Due</h3>
                    <p className="text-2xl font-bold">
                      {invoiceDetails.amount} {invoiceDetails.currency}
                    </p>
                  </div>
                  <div className="text-right">
                    <h3 className="font-semibold text-muted-foreground">Due Date</h3>
                    <p>{invoiceDetails.dueDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card-gradient">
              <CardHeader>
                <CardTitle className="text-gradient">Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <Image src="/placeholder.svg" alt="Token Reward" width={200} height={200} className="rounded-full" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-muted-foreground">Token Reward</h3>
                  <p className="text-2xl font-bold text-gradient">{invoiceDetails.tokenReward}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Pay now and earn {invoiceDetails.tokenReward} in AurumStark tokens!
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handlePayment} className="w-full button-gradient">
                  Process Payment
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

