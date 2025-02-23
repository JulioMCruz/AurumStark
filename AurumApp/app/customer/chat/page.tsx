"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { AgentsList } from "@/components/agent-list"
import { AgentCards } from "@/components/agent-cards"
import { ChatInterface } from "@/components/chat-interface"
import { Button } from "@/components/ui/button"
import type { Agent } from "@/types/agents"

export default function CustomerChat() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent)
  }

  const handleBack = () => {
    setSelectedAgent(null)
  }

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Agents Sidebar */}
      <aside className="w-64 border-r bg-card-gradient">
        <AgentsList onSelectAgent={handleSelectAgent} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {selectedAgent ? (
          <div className="flex-1 p-4">
            <div className="mb-4">
              <Button 
                onClick={handleBack}
                variant="ghost" 
                className="text-muted-foreground hover:text-primary"
              >
                ← Back to Agents
              </Button>
            </div>
            <ChatInterface agentId={selectedAgent.id} />
          </div>
        ) : (
          <div className="flex-1 p-4">
            <h1 className="text-2xl font-bold mb-6 text-gradient">
              Available Agents
            </h1>
            <AgentCards onSelectAgent={handleSelectAgent} />
          </div>
        )}
      </main>
    </div>
  )
}

