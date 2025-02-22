"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const transactions = [
  { id: 1, date: "2023-05-01", type: "Payment", amount: "0.05 ETH", status: "Completed" },
  { id: 2, date: "2023-05-03", type: "Reward", amount: "10 AUR", status: "Received" },
  { id: 3, date: "2023-05-05", type: "Payment", amount: "0.1 BTC", status: "Pending" },
]

export default function TransactionsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gradient">Transactions & Rewards</h1>
      <Card className="bg-card-gradient">
        <CardHeader>
          <CardTitle className="text-gradient">Token Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-gradient">250 AUR</p>
          <p className="text-sm text-muted-foreground">Total rewards earned</p>
        </CardContent>
      </Card>
      <Card className="bg-card-gradient">
        <CardHeader>
          <CardTitle className="text-gradient">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-secondary/50">
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Amount</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id} className="border-b border-border hover:bg-secondary/50">
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>{tx.type}</TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        tx.status === "Completed"
                          ? "bg-green-500/20 text-green-400"
                          : tx.status === "Pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

