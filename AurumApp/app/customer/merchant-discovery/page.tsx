import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function MerchantDiscovery() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Merchant Discovery</h1>
      <div className="space-y-4">
        <div className="flex space-x-2">
          <Input placeholder="Search for crypto-accepting merchants" className="flex-grow" />
          <Button>Search</Button>
        </div>
        <div className="p-4 border rounded h-96">
          <h2 className="text-xl font-semibold mb-2">Map View</h2>
          {/* Add map component here */}
          <p>Map showing participating merchants will be displayed here.</p>
        </div>
      </div>
    </div>
  )
}

