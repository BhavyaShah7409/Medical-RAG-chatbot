import { NextRequest, NextResponse } from 'next/server'
import { queryPinecone } from '@/lib/pinecone'
import { generateResponse } from '@/lib/gemini'
import { Message } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { query, conversationHistory = [] } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // Step 1: Retrieve relevant context from Pinecone
    const matches = await queryPinecone(query, 5)
    
    const retrievedContext = matches.map((match, index) => ({
      id: match.id || `context-${index}`,
      text: String(match.metadata?.text || 'No content available'),
      score: match.score || 0,
      metadata: {
        title: String(match.metadata?.title || ''),
        section: String(match.metadata?.section || ''),
        page: Number(match.metadata?.page) || 0,
      }
    }))

    // Step 2: Generate response using Gemini with context and history
    const response = await generateResponse(
      query,
      retrievedContext,
      conversationHistory
    )

    return NextResponse.json({
      success: true,
      response,
      sources: retrievedContext
    })

  } catch (error) {
    console.error('Error in generate API:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
