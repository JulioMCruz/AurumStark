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

    const data = await response.json() as AgentsResponse
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    )
  }
}
