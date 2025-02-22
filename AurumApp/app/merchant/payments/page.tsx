"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Mock data for payments
const mockPayments = [
  {
    id: 1,
    date: "2023-06-01",
    customer: "john@example.com",
    amount: "0.5 ETH",
    status: "Completed",
    tokenReward: "10 AUR",
  },
  {
    id: 2,
    date: "2023-06-02",
    customer: "alice@example.com",
    amount: "100 USDC",
    status: "Pending",
    tokenReward: "5 AUR",
  },
  {
    id: 3,
    date: "2023-06-03",
    customer: "bob@example.com",
    amount: "0.2 ETH",
    status: "Completed",
    tokenReward: "4 AUR",
  },
  {
    id: 4,
    date: "2023-06-04",
    customer: "emma@example.com",
    amount: "200 USDC",
    status: "Completed",
    tokenReward: "8 AUR",
  },
  {
    id: 5,
    date: "2023-06-05",
    customer: "david@example.com",
    amount: "0.1 ETH",
    status: "Pending",
    tokenReward: "2 AUR",
  },
]

export default function MerchantPayments() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredPayments, setFilteredPayments] = useState(mockPayments)

  const handleSearch = () => {
    const filtered = mockPayments.filter(
      (payment) =>
        payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.amount.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.status.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredPayments(filtered)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Merchant Payments</h1>

      <Card>
        <CardHeader>
          <CardTitle>Search Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Search by customer, amount, or status"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Token Reward</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.customer}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>{payment.status}</TableCell>
                  <TableCell>{payment.tokenReward}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

