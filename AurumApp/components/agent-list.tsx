"use client"

import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User } from "lucide-react"
import type { Agent } from "@/types/agents"

interface AgentsListProps {
  onSelectAgent: (agent: Agent) => void
}

export function AgentsList({ onSelectAgent }: AgentsListProps) {
  const { data, isLoading, error } = useQuery<{ agents: Agent[] }>({
    queryKey: ["agents"],
    queryFn: async () => {
      const response = await fetch("/api/agents")
      if (!response.ok) throw new Error("Failed to fetch agents")
      return response.json()
    }
  })

  if (isLoading) return <div className="p-4">Loading agents...</div>
  if (error) return <div className="p-4 text-red-500">Error loading agents</div>

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <h2 className="font-semibold mb-4">Available Agents</h2>
        <div className="space-y-2">
          {data?.agents.map((agent) => (
            <Button
              key={agent.id}
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => onSelectAgent(agent)}
            >
              <User className="h-4 w-4" />
              <span>{agent.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}
