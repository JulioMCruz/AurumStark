'use client'

import { useQuery } from '@tanstack/react-query'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { UserIcon } from 'lucide-react'
import type { Agent } from '@/types/agents'

function AgentsSidebar() {
  const { data, isLoading, error } = useQuery<{ agents: Agent[] }>({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await fetch('/api/agents')
      if (!response.ok) throw new Error('Failed to fetch agents')
      return response.json()
    }
  })

  if (isLoading) return <div className="p-4">Loading agents...</div>
  if (error) return <div className="p-4 text-red-500">Error loading agents</div>
  
  return (
    <aside className="w-64 border-r ">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Agents</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-129px)]">
        <div className="p-2">
          {data?.agents.map((agent) => (
            <Button
              key={agent.id}
              variant="ghost"
              className="w-full justify-start gap-2 mb-1"
            >
              <UserIcon className="h-4 w-4" />
              {agent.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </aside>
  )
}

export { AgentsSidebar }
