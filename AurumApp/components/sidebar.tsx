import Link from "next/link"
import { Home, MessageSquare, CreditCard, Store } from "lucide-react"

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 p-4">
      <nav className="space-y-2">
        <Link href="/" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
          <Home size={20} />
          <span>Home</span>
        </Link>
        <Link href="/customer/chat" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
          <MessageSquare size={20} />
          <span>Chat</span>
        </Link>
        <Link href="/customer/transactions" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
          <CreditCard size={20} />
          <span>Transactions</span>
        </Link>
        <Link href="/merchant" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded">
          <Store size={20} />
          <span>Merchant</span>
        </Link>
      </nav>
    </aside>
  )
}

