import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function MerchantPortal() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Merchant Portal</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/merchant/payment-acceptance">
          <Button className="w-full">Payment Acceptance Dashboard</Button>
        </Link>
        <Link href="/merchant/invoice-management">
          <Button className="w-full">Invoice Management</Button>
        </Link>
      </div>
    </div>
  )
}

