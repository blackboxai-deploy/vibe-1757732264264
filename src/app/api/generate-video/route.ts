import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, duration, aspectRatio, quality, style } = body

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      )
    }

    // Prepare the prompt for VEO-3 with style and quality parameters
    const enhancedPrompt = `Create a ${duration}-second video in ${aspectRatio} aspect ratio with ${quality} quality in a ${style} style: ${prompt}`

    // Call VEO-3 API via custom endpoint
    const apiResponse = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'customerId': 'cus_SyrD5N7fF6NCZ1',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx',
      },
      body: JSON.stringify({
        model: 'replicate/google/veo-3',
        messages: [
          {
            role: 'user',
            content: enhancedPrompt
          }
        ]
      }),
    })

    if (!apiResponse.ok) {
      const errorData = await apiResponse.text()
      console.error('VEO-3 API Error:', errorData)
      return NextResponse.json(
        { error: 'Failed to generate video', details: errorData },
        { status: 500 }
      )
    }

    const result = await apiResponse.json()
    
    // Extract video URL from the response
    let videoUrl = ''
    
    if (result.choices && result.choices[0] && result.choices[0].message) {
      const content = result.choices[0].message.content
      
      // Try to extract URL from the content
      const urlMatch = content.match(/https?:\/\/[^\s]+\.(mp4|mov|avi)/i)
      if (urlMatch) {
        videoUrl = urlMatch[0]
      } else {
        // If no direct URL, the content might be the URL itself if it looks like one
        if (content.startsWith('http') && (content.includes('.mp4') || content.includes('.mov'))) {
          videoUrl = content.trim()
        }
      }
    }

    // Return the video URL
    return NextResponse.json({
      success: true,
      url: videoUrl,
      message: 'Video generated successfully',
      parameters: {
        prompt,
        duration,
        aspectRatio,
        quality,
        style
      }
    })

  } catch (error) {
    console.error('Error generating video:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to generate videos.' },
    { status: 405 }
  )
}