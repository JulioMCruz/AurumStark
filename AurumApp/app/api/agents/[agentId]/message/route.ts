import { NextResponse } from "next/server"

interface MessageResponse {
  user: string
  text: string
  action: 'NONE' | string // Expand this union type with other possible actions
}

export const POST = async (
  request: Request,
  { params }: { params: { agentId: string } }
) => {
  try {
    if (!process.env.SERVER_ENDPOINT) {
      throw new Error("SERVER_ENDPOINT environment variable is not set")
    }

    const body = await request.json()
    const response = await fetch(
      `${process.env.SERVER_ENDPOINT}/${params.agentId}/message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}: ${await response.text()}`)
    }

    const data = (await response.json()) as MessageResponse[]
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in message API route:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process message" },
      { status: 500 }
    )
  }
} 