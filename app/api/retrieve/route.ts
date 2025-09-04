import { NextRequest, NextResponse } from 'next/server'
import { queryPinecone } from '@/lib/pinecone'

export async function POST(request: NextRequest) {
  try {
    const { query, topK = 5 } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // Query Pinecone for relevant context
    const matches = await queryPinecone(query, topK)

    // Transform matches to our RetrievedContext format
    const retrievedContext = matches.map((match, index) => ({
      id: match.id || `context-${index}`,
      text: match.metadata?.text || 'No content available',
      score: match.score || 0,
      metadata: {
        title: match.metadata?.title,
        section: match.metadata?.section,
        page: match.metadata?.page,
      }
    }))

    return NextResponse.json({
      success: true,
      context: retrievedContext
    })

  } catch (error) {
    console.error('Error in retrieve API:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve context' },
      { status: 500 }
    )
  }
}
