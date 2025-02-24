import { NextResponse } from "next/server"

interface Agent {
  id: string
  name: string
  clients: any[] // You can replace 'any' with proper client type if available
}

interface AgentsResponse {
  agents: Agent[]
}

export const GET = async () => {
  try {
    if (!process.env.SERVER_ENDPOINT) 
      return NextResponse.json(
        { error: "Server endpoint not configured" },
        { status: 500 }
      )

    const response = await fetch(`${process.env.SERVER_ENDPOINT}/agents`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok)
      return NextResponse.json(
        { error: "Failed to fetch agents from server" },
        { status: response.status }
      )

    const dataToFilter = await response.json() as AgentsResponse
    console.log("dataToFilter:", dataToFilter)

    // filter the agent id what its iclude in the coma delimited allow ids defined in the .env NEXT_PUBLIC_AGENT_ALLOW_IDS
    const allowIds = process.env.NEXT_PUBLIC_AGENT_ALLOW_IDS?.split(',') || []
    console.log("allowIds:", allowIds)

    const data = { "agents": dataToFilter.agents.filter(agent => allowIds.includes(agent.id))}
    console.log("data:", data)
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    )
  }
}
