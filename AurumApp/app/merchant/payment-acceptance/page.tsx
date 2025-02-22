import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"

export default function PaymentAcceptance() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Payment Acceptance Dashboard</h1>
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Account</h2>
          <div className="space-y-2">
            <Input placeholder="Email" type="email" />
            <Input placeholder="Password" type="password" />
            <Button>Login / Create Account</Button>
          </div>
        </div>
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Payment Processing</h2>
          <div className="space-y-2">
            <Select>
              <option value="">Select Cryptocurrency</option>
              <option value="btc">Bitcoin</option>
              <option value="eth">Ethereum</option>
              <option value="usdc">USDC</option>
            </Select>
            <Input placeholder="Amount" type="number" />
            <Button>Process Payment</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

