import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"

export default function InvoiceManagement() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Invoice Management</h1>
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Create Invoice</h2>
          <div className="space-y-2">
            <Input placeholder="Customer Name" />
            <Input placeholder="Amount" type="number" />
            <Select>
              <option value="">Select Currency</option>
              <option value="btc">Bitcoin</option>
              <option value="eth">Ethereum</option>
              <option value="usdc">USDC</option>
            </Select>
            <Button>Generate Invoice</Button>
          </div>
        </div>
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Customer Payment Link</h2>
          {/* Add payment link generation components here */}
          <p>Generated payment link will be displayed here.</p>
        </div>
      </div>
    </div>
  )
}

