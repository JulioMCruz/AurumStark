import { NextRequest, NextResponse } from 'next/server'

interface TranscriptSegment {
  text: string
  speaker: string
  speakerId: number
  is_user: boolean
  start: number
  end: number
}

export async function POST(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get('session_id')
    const uid = searchParams.get('uid')

    // Only validate uid as required
    if (!uid) {
      return NextResponse.json(
        { error: 'Missing required uid parameter' },
        { status: 400 }
      )
    }

    const dataReceived = await request.json()
    console.log("************************************************")
    console.log('From Real-Time Transcript route')
    console.log("request:", JSON.stringify(dataReceived, null, 2))
    console.log("************************************************")

    // Get request body
    const segments: TranscriptSegment[] = dataReceived

    // // Log the received data (as requested)
    // console.log('From omi loader route')
    // console.log('Received Session ID:', sessionId || 'Not provided')
    // console.log('Received User ID:', uid)
    // console.log('Received Segments:', segments)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 