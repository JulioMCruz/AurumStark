"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

const monthlySalesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 5500 },
]

const dailySalesData = [
  { name: "Mon", sales: 1000 },
  { name: "Tue", sales: 1200 },
  { name: "Wed", sales: 900 },
  { name: "Thu", sales: 1500 },
  { name: "Fri", sales: 2000 },
  { name: "Sat", sales: 1800 },
  { name: "Sun", sales: 1300 },
]

export default function MerchantDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gradient">Merchant Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card-gradient">
          <CardHeader>
            <CardTitle className="text-gradient">Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card-gradient">
          <CardHeader>
            <CardTitle className="text-gradient">Daily Sales (Last Week)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card-gradient">
        <CardHeader>
          <CardTitle className="text-gradient">Sales Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <h3 className="text-lg font-semibold text-muted-foreground">Total Sales</h3>
              <p className="text-2xl font-bold">$28,000</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-muted-foreground">Average Order Value</h3>
              <p className="text-2xl font-bold">$150</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-muted-foreground">Total Orders</h3>
              <p className="text-2xl font-bold">187</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

