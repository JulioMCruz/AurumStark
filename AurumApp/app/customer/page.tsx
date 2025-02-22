import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CustomerPortal() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Customer Portal</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/customer/device-integration">
          <Button className="w-full">Device Integration</Button>
        </Link>
        <Link href="/customer/merchant-discovery">
          <Button className="w-full">Merchant Discovery</Button>
        </Link>
        <Link href="/customer/payment-processing">
          <Button className="w-full">Payment Processing</Button>
        </Link>
      </div>
    </div>
  )
}

