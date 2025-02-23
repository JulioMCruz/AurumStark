"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import type { Agent } from "@/types/agents"

interface AgentCardsProps {
  onSelectAgent: (agent: Agent) => void
}

export function AgentCards({ onSelectAgent }: AgentCardsProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data?.agents.map((agent) => (
        <Card key={agent.id} className="bg-card-gradient">
          <CardHeader>
            <CardTitle>{agent.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => onSelectAgent(agent)}
              className="w-full gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Start Chat
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
