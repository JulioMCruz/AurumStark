import { NextRequest, NextResponse } from 'next/server'

interface TranscriptSegment {
  text: string
  speaker: string
  speakerId: number
  is_user: boolean
  start: number
  end: number
}

interface ActionItem {
  description: string
  completed: boolean
}

interface AppResponse {
  app_id: string
  content: string
}

interface StructuredData {
  title: string
  overview: string
  emoji: string
  category: string
  action_items: ActionItem[]
  events: any[] // Type can be more specific based on your needs
}

interface Geolocation {
  google_place_id: string
  latitude: number
  longitude: number
  address: string
  location_type: string
}

interface MemoryCreation {
  id: string
  created_at: string
  started_at: string
  finished_at: string
  source: string
  language: string
  structured: StructuredData
  transcript_segments: TranscriptSegment[]
  geolocation: Geolocation
  photos: string[]
  plugins_results: any[]
  external_data: any | null
  discarded: boolean
  deleted: boolean
  visibility: string
  processing_memory_id: string | null
  status: string
}

interface AgentResponse {
  result: boolean
  places?: Array<{
    name: string
    address: string
  }>
}

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const uid = searchParams.get('uid')

    if (!uid) {
      return NextResponse.json(
        { error: 'Missing required uid parameter' },
        { status: 400 }
      )
    }

    const memoryRequest = await request.json()

    console.log("memoryRequest:", memoryRequest)
    const memoryData: MemoryCreation = memoryRequest

    // Validate required fields
    if (!memoryData.created_at || !memoryData.transcript_segments || !memoryData.id) {
      return NextResponse.json(
        { error: 'Missing required fields in memory data' },
        { status: 400 }
      )
    }

    const formattedTranscript = memoryData.transcript_segments
      .map(segment => `${segment.speaker}: ${segment.text}`)
      .join('\n')

    const agentRequestBody = {
      user: uid,
      text: JSON.stringify({
        query: 'Analyze if the user is asking about places nearby, if the user is asking about places nearby, return a SEARCH_PLACES_NEARBY . ' + 
               'If the user is not asking about places nearby, return NOT_ACTION. ' +
               'Just return the string result, no other text or comments.make sure user is mentioning Aurum.',
        context: {
          userLocation: memoryData?.geolocation?.address,
          conversation: formattedTranscript
        }
      })
    }

    console.log("agentRequestBody:", agentRequestBody)

    const response = await fetch(
      `${process.env.SERVER_ENDPOINT}/${process.env.AGENT_ID_EVALUATOR}/message`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(agentRequestBody)
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      const statusCode = response.status
      let errorMessage = `Agent API request failed with status ${statusCode}`

      switch (statusCode) {
        case 404:
          errorMessage = 'Agent endpoint not found. Please verify SERVER_ENDPOINT and AGENT_ID configuration'
          break
        case 401:
          errorMessage = 'Unauthorized access to agent API. Please check authentication credentials'
          break
        case 403:
          errorMessage = 'Forbidden access to agent API. Please verify permissions'
          break
        case 429:
          errorMessage = 'Rate limit exceeded. Please try again later'
          break
        case 500:
          errorMessage = 'Internal server error occurred in agent API'
          break
      }

      console.error('Agent API Error:', {
        status: statusCode,
        endpoint: `${process.env.SERVER_ENDPOINT}/api/agents/${process.env.AGENT_ID}/message`,
        error: errorText,
        requestBody: agentRequestBody
      })

      return NextResponse.json(
        { 
          error: errorMessage,
          details: {
            status: statusCode,
            message: errorText
          }
        },
        { status: statusCode }
      )
    }

    const elizaResponse = await response.json()

    console.log("* elizaResponse:", elizaResponse)

    switch (elizaResponse.text) {
      case 'SEARCH_PLACES_NEARBY':
        const agentRequestSearchPlacesNearbyBody = {
          user: uid,
          text: JSON.stringify({
            query: 'use the action WEB_SEARCH to search in the web for places nearby the user location. return 5 places nearby the user location. return the name and url link of the place. like a comma separated list. ' + 
                   'Just return the comma separated list, no other text or comments.make sure user is mentioning Aurum.',
            context: {
              userLocation: memoryData?.geolocation?.address,
              conversation: formattedTranscript
            }
          })
        }

        console.log("agentRequestSearchPlacesNearbyBody:", agentRequestSearchPlacesNearbyBody)

        const response = await fetch(
          `${process.env.SERVER_ENDPOINT}/${process.env.AGENT_ID_EVALUATOR}/message`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(agentRequestSearchPlacesNearbyBody)
          }
        )

        const elizaResponseSearchPlacesNearby = await response.json()

        console.log("elizaResponseSearchPlacesNearby:", elizaResponseSearchPlacesNearby)

        break
      case 'NOT_ACTION':
        console.log("NOT_ACTION")
        break
    }

    //console.log("response from eliza:", elizaResponse)

    const agentResponse: AgentResponse = elizaResponse

    return NextResponse.json({ 
      success: true,
      memory_id: memoryData.id,
      status: memoryData.status,
      agent_response: agentResponse
    })

  } catch (error) {
    console.error('Error processing memory creation:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    const statusCode = error instanceof Error && 'status' in error ? (error as any).status : 500

    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        } : undefined
      },
      { status: statusCode }
    )
  }
}
